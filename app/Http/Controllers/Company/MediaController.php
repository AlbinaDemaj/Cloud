<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Folder;
use App\Models\Media;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MediaController extends Controller
{
    private const GUEST_STORAGE_LIMIT_BYTES = 30 * 1024 * 1024 * 1024; // 30GB
    private const MAX_FILE_UPLOAD_KB = 31457280; // 30GB në KB për Laravel validation

    private function companyId(): int
    {
        return (int) Auth::id();
    }

    public function index(Request $request)
    {
        $media = Media::query()
            ->where('company_id', $this->companyId())
            ->with([
                'guest:id,name,username,email',
                'folder:id,name',
            ])
            ->when($request->filled('guest_id'), fn ($query) =>
                $query->where('guest_id', $request->guest_id)
            )
            ->when($request->filled('folder_id'), fn ($query) =>
                $query->where('folder_id', $request->folder_id)
            )
            ->when($request->filled('type'), fn ($query) =>
                $query->where('file_type', $request->type)
            )
            ->latest()
            ->get();

        $guests = User::query()
            ->where('role', 'guest')
            ->where('company_id', $this->companyId())
            ->orderBy('name')
            ->get(['id', 'name', 'username', 'email']);

        $folders = Folder::query()
            ->where('company_id', $this->companyId())
            ->orderBy('name')
            ->get(['id', 'name', 'guest_id']);

        return Inertia::render('Company/Media/Index', [
            'media' => $media,
            'guests' => $guests,
            'folders' => $folders,
            'filters' => [
                'guest_id' => $request->guest_id,
                'folder_id' => $request->folder_id,
                'type' => $request->type,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'guest_id' => ['required', 'exists:users,id'],
            'folder_id' => ['nullable', 'exists:folders,id'],
            'files' => ['required', 'array'],
            'files.*' => [
                'required',
                'file',
                'mimes:jpg,jpeg,png,webp,gif,mp4,mov,avi',
                'max:' . self::MAX_FILE_UPLOAD_KB,
            ],
        ]);

        $company = Auth::user();

        $guest = User::query()
            ->where('id', $validated['guest_id'])
            ->where('role', 'guest')
            ->where('company_id', $this->companyId())
            ->firstOrFail();

        $folderId = null;

        if (!empty($validated['folder_id'])) {
            $folder = Folder::query()
                ->where('id', $validated['folder_id'])
                ->where('company_id', $this->companyId())
                ->where(function ($query) use ($guest) {
                    $query->whereNull('guest_id')
                        ->orWhere('guest_id', $guest->id);
                })
                ->firstOrFail();

            $folderId = $folder->id;
        }

        $files = $request->file('files', []);

        $currentUsedBytes = (int) Media::query()
            ->where('company_id', $this->companyId())
            ->where('guest_id', $guest->id)
            ->sum('file_size');

        $newUploadBytes = collect($files)->sum(function ($file) {
            return (int) $file->getSize();
        });

        if (($currentUsedBytes + $newUploadBytes) > self::GUEST_STORAGE_LIMIT_BYTES) {
            $usedGb = round($currentUsedBytes / 1024 / 1024 / 1024, 2);
            $newGb = round($newUploadBytes / 1024 / 1024 / 1024, 2);

            return back()->withErrors([
                'files' => "Ky guest ka limit maksimal 30GB. Aktualisht ka përdorur {$usedGb}GB dhe po tenton të ngarkojë edhe {$newGb}GB.",
            ]);
        }

        $companyFolder = $company->id . '-' . Str::slug($company->name ?: 'company');
        $guestFolder = $guest->id . '-' . Str::slug($guest->name ?: 'guest');

        foreach ($files as $file) {
            $mime = $file->getMimeType();
            $fileSize = $file->getSize();
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $type = str_starts_with($mime, 'video/') ? 'video' : 'photo';

            $directory = "uploads/media/{$companyFolder}/{$guestFolder}";
            $publicPath = public_path($directory);

            if (!File::exists($publicPath)) {
                File::makeDirectory($publicPath, 0775, true);
            }

            $filename = uniqid('', true) . '_' . time() . '.' . $extension;

            $file->move($publicPath, $filename);

            Media::create([
                'company_id' => $this->companyId(),
                'guest_id' => $guest->id,
                'folder_id' => $folderId,
                'file_type' => $type,
                'original_name' => $originalName,
                'file_path' => $directory . '/' . $filename,
                'thumbnail_path' => null,
                'file_size' => $fileSize,
                'mime_type' => $mime,
                'is_visible' => true,
                'uploaded_by' => Auth::id(),
                'uploaded_at' => now(),
            ]);
        }

        return back()->with('success', 'Media u uploadua me sukses.');
    }

    public function toggleVisibility(Media $media)
    {
        $this->authorizeMedia($media);

        $media->update([
            'is_visible' => ! $media->is_visible,
        ]);

        return back()->with('success', 'Visibility u ndryshua me sukses.');
    }

    public function destroy(Media $media)
    {
        return $this->deleteMedia($media);
    }

    public function destroyByPost(Media $media)
    {
        return $this->deleteMedia($media);
    }

    private function deleteMedia(Media $media)
    {
        $this->authorizeMedia($media);

        if ($media->file_path && File::exists(public_path($media->file_path))) {
            File::delete(public_path($media->file_path));
        }

        if ($media->thumbnail_path && File::exists(public_path($media->thumbnail_path))) {
            File::delete(public_path($media->thumbnail_path));
        }

        $media->delete();

        return back()->with('success', 'Media u fshi me sukses.');
    }

    private function authorizeMedia(Media $media): void
    {
        abort_if(
            (int) $media->company_id !== $this->companyId(),
            403
        );
    }
}