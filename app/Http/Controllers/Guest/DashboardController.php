<?php

namespace App\Http\Controllers\Guest;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;
use ZipArchive;

class DashboardController extends Controller
{
    public function index()
{
    $guest = Auth::user();

    $media = Media::query()
        ->where('guest_id', $guest->id)
        ->where('is_visible', true)
        ->with('folder:id,name,is_visible')
        ->latest('uploaded_at')
        ->get()
        ->filter(fn ($item) => !$item->folder || $item->folder->is_visible)
        ->map(fn ($item) => [
            'id' => $item->id,
            'folder_id' => $item->folder_id,
            'folder_name' => $item->folder?->name ?? 'Pa folder',
            'file_type' => $item->file_type,
            'original_name' => $item->original_name,
            'file_url' => $item->file_url,
            'thumbnail_url' => $item->thumbnail_url,
            'download_url' => route('guest.media.download', $item->id),
            'is_visible' => (bool) $item->is_visible,
            'uploaded_at' => $item->uploaded_at?->format('Y-m-d H:i:s'),
        ]);

    $folders = $media
        ->groupBy('folder_name')
        ->map(fn ($items, $folderName) => [
            'name' => $folderName,
            'items' => $items->values(),
        ])
        ->values();

    return Inertia::render('Guest/Dashboard', [
        'auth' => [
            'user' => [
                'id' => $guest->id,
                'name' => $guest->name,
                'email' => $guest->email,
                'role' => $guest->role,
            ],
        ],
        'media' => $media->values(),
        'folders' => $folders,
    ]);
}

    public function downloadAll()
    {
        $guest = Auth::user();

        $media = Media::query()
            ->where('guest_id', $guest->id)
            ->where('is_visible', true)
            ->get();

        if ($media->isEmpty()) {
            return redirect()
                ->route('guest.dashboard')
                ->with('error', 'No media available for download.');
        }

        $tempDirectory = storage_path('app/temp');

        if (!File::exists($tempDirectory)) {
            File::makeDirectory($tempDirectory, 0755, true);
        }

        $zipFileName = 'media-' . Str::slug($guest->name) . '-' . now()->format('Y-m-d-H-i-s') . '.zip';
        $zipPath = $tempDirectory . DIRECTORY_SEPARATOR . $zipFileName;

        $zip = new ZipArchive();

        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            return redirect()
                ->route('guest.dashboard')
                ->with('error', 'Could not create ZIP file.');
        }

        $filesAdded = 0;

        foreach ($media as $item) {
            $filePath = public_path($item->file_path);

            if (File::exists($filePath)) {
                $fileName = $item->original_name ?: basename($item->file_path);
                $zip->addFile($filePath, $fileName);
                $filesAdded++;
            }
        }

        $zip->close();

        if ($filesAdded === 0) {
            if (File::exists($zipPath)) {
                File::delete($zipPath);
            }

            return redirect()
                ->route('guest.dashboard')
                ->with('error', 'No files were found.');
        }

        return response()
            ->download($zipPath, $zipFileName)
            ->deleteFileAfterSend(true);
    }

    public function downloadSelected()
    {
        $guest = Auth::user();

        $ids = collect(explode(',', request('ids')))
            ->filter()
            ->map(fn ($id) => (int) $id)
            ->values();

        if ($ids->isEmpty()) {
            return redirect()->route('guest.dashboard');
        }

        $media = Media::query()
            ->where('guest_id', $guest->id)
            ->where('is_visible', true)
            ->whereIn('id', $ids)
            ->get();

        if ($media->isEmpty()) {
            return redirect()->route('guest.dashboard');
        }

        $tempDirectory = storage_path('app/temp');

        if (!File::exists($tempDirectory)) {
            File::makeDirectory($tempDirectory, 0755, true);
        }

        $zipFileName = 'selected-media-' . Str::slug($guest->name) . '-' . now()->format('Y-m-d-H-i-s') . '.zip';
        $zipPath = $tempDirectory . DIRECTORY_SEPARATOR . $zipFileName;

        $zip = new ZipArchive();

        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            return redirect()->route('guest.dashboard');
        }

        foreach ($media as $item) {
            $filePath = public_path($item->file_path);

            if (File::exists($filePath)) {
                $zip->addFile($filePath, $item->original_name ?: basename($item->file_path));
            }
        }

        $zip->close();

        return response()
            ->download($zipPath, $zipFileName)
            ->deleteFileAfterSend(true);
    }
}