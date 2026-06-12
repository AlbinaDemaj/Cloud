<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Folder;
use App\Models\Media;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use ZipArchive;

class FolderController extends Controller
{
    public function index()
    {
        $guestId = Auth::id();

        $folders = Folder::query()
            ->where('guest_id', $guestId)
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->withCount([
                'media as media_count' => fn ($query) => $query->where('is_visible', true),
                'children as children_count' => fn ($query) => $query->where('is_active', true),
            ])
            ->latest()
            ->get();

        return Inertia::render('Guest/Folders/Index', [
            'folders' => $folders,
        ]);
    }

    public function show(Folder $folder)
    {
        $this->authorizeFolder($folder);

        $folder->load([
            'parent:id,name',
            'children' => fn ($query) => $query->where('is_active', true)->latest(),
        ]);

        $media = Media::query()
            ->where('folder_id', $folder->id)
            ->where('guest_id', Auth::id())
            ->where('is_visible', true)
            ->latest()
            ->get();

        return Inertia::render('Guest/Folders/Show', [
            'folder' => $folder,
            'media' => $media,
        ]);
    }

    public function downloadFolder(Folder $folder)
    {
        $this->authorizeFolder($folder);

        $media = Media::query()
            ->where('folder_id', $folder->id)
            ->where('guest_id', Auth::id())
            ->where('is_visible', true)
            ->get();

        return $this->makeZip($media, $folder->name . '.zip');
    }

    public function downloadAllFolders()
    {
        $media = Media::query()
            ->where('guest_id', Auth::id())
            ->where('is_visible', true)
            ->whereNotNull('folder_id')
            ->with('folder:id,name')
            ->get();

        return $this->makeZip($media, 'all-folders.zip', true);
    }

    private function makeZip($media, string $zipName, bool $groupByFolder = false)
    {
        if ($media->isEmpty()) {
            return back()->with('error', 'Nuk ka media për download.');
        }

        $tempDir = storage_path('app/temp');

        if (! File::exists($tempDir)) {
            File::makeDirectory($tempDir, 0775, true);
        }

        $zipPath = $tempDir . '/' . uniqid('media_', true) . '.zip';

        $zip = new ZipArchive();

        if ($zip->open($zipPath, ZipArchive::CREATE) !== true) {
            return back()->with('error', 'ZIP nuk mund të krijohet.');
        }

        foreach ($media as $item) {
            $filePath = public_path($item->file_path);

            if (! File::exists($filePath)) {
                continue;
            }

            $fileName = $this->safeName($item->original_name ?: basename($filePath));

            if ($groupByFolder && $item->folder) {
                $folderName = $this->safeName($item->folder->name);
                $zip->addFile($filePath, $folderName . '/' . $fileName);
            } else {
                $zip->addFile($filePath, $fileName);
            }
        }

        $zip->close();

        return response()
            ->download($zipPath, $this->safeName($zipName))
            ->deleteFileAfterSend(true);
    }

    private function authorizeFolder(Folder $folder): void
    {
        abort_if((int) $folder->guest_id !== (int) Auth::id(), 403);
        abort_if(! $folder->is_active, 404);
    }

    private function safeName(string $name): string
    {
        return preg_replace('/[^A-Za-z0-9_\-. ]/', '', $name) ?: 'download.zip';
    }
}