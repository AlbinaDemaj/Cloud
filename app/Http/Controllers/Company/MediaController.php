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
    private const GUEST_STORAGE_LIMIT_BYTES = 30 * 1024 * 1024 * 1024;
    private const MAX_FILE_UPLOAD_KB = 31457280;

    private function companyId(): int
    {
        return (int) Auth::id();
    }

    public function index(Request $request)
    {
        $media = Media::query()
            ->where('company_id', $this->companyId())
            ->with(['guest:id,name,username,email', 'folder:id,name'])
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
                'mimes:jpg,jpeg,png,webp,gif,heic,heif,mp4,mov,avi,mkv,webm',
                'max:' . self::MAX_FILE_UPLOAD_KB,
            ],
        ]);

        $company = Auth::user();

        $guest = User::query()
            ->where('id', $validated['guest_id'])
            ->where('role', 'guest')
            ->where('company_id', $this->companyId())
            ->firstOrFail();

        $folder = null;
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

        $newUploadBytes = collect($files)->sum(fn ($file) => (int) $file->getSize());

        if (($currentUsedBytes + $newUploadBytes) > self::GUEST_STORAGE_LIMIT_BYTES) {
            return response()->json([
                'message' => 'Ky guest ka limit maksimal 30GB.',
            ], 422);
        }

        $companyFolder = $company->id . '-' . Str::slug($company->name ?: 'company');
        $guestFolder = $guest->id . '-' . Str::slug($guest->name ?: 'guest');

        $folderFolder = $folder
            ? $folder->id . '-' . Str::slug($folder->name ?: 'folder')
            : 'no-folder';

        $directory = "uploads/media/{$companyFolder}/{$guestFolder}/{$folderFolder}";
        $publicPath = public_path($directory);

        if (!File::exists($publicPath)) {
            File::makeDirectory($publicPath, 0775, true);
        }

        $uploadedMedia = [];

        foreach ($files as $file) {
            $mime = $file->getMimeType();
            $fileSize = $file->getSize();
            $originalName = $file->getClientOriginalName();
            $extension = strtolower($file->getClientOriginalExtension());
            $type = str_starts_with($mime, 'video/') ? 'video' : 'photo';

            $safeOriginalName = pathinfo($originalName, PATHINFO_FILENAME);
            $safeOriginalName = Str::slug($safeOriginalName) ?: 'media';

            $filename = now()->format('YmdHis') . '_' . uniqid() . '_' . $safeOriginalName . '.' . $extension;

            $file->move($publicPath, $filename);

            $media = Media::create([
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

            $uploadedMedia[] = $media->fresh(['guest:id,name,username,email', 'folder:id,name']);
        }

        return response()->json([
            'message' => 'Media u uploadua me sukses.',
            'media' => $uploadedMedia,
            'folder' => $folderId
                ? Folder::withCount('media')->find($folderId)
                : null,
        ]);
    }

    public function toggleVisibility(Media $media)
    {
        $this->authorizeMedia($media);

        $media->update([
            'is_visible' => ! $media->is_visible,
        ]);

        return response()->json([
            'message' => 'Visibility u ndryshua me sukses.',
            'media' => $media->fresh(['guest:id,name,username,email', 'folder:id,name']),
        ]);
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

        return response()->json([
            'message' => 'Media u fshi me sukses.',
        ]);
    }

    private function authorizeMedia(Media $media): void
    {
        abort_if((int) $media->company_id !== $this->companyId(), 403);
    }
}