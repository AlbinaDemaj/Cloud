<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    public function upload(Request $request)
    {
        $user = auth()->user();
        $uploadedBy = $user?->role ?? 'company';

        $request->validate([
            'guest_id' => ['required', 'exists:users,id'],
            'files' => ['required', 'array'],
            'files.*' => ['required', 'file'],
        ]);

        $guest = User::where('id', $request->guest_id)
            ->where('role', 'guest')
            ->firstOrFail();

        $company = User::where('id', $guest->company_id)
            ->where('role', 'company')
            ->firstOrFail();

        $companyId = $company->id;
        $guestId = $guest->id;

        $companyFolder = $companyId . '-' . Str::slug($company->name ?: 'company');
        $guestFolder = $guestId . '-' . Str::slug($guest->name ?: 'guest');

        $uploaded = [];

        foreach ($request->file('files') as $file) {
            $mime = $file->getMimeType();
            $size = $file->getSize();

            $isPhoto = str_starts_with($mime, 'image/');
            $isVideo = str_starts_with($mime, 'video/');

            if (!$isPhoto && !$isVideo) {
                return response()->json([
                    'message' => 'Only photos and videos are allowed.',
                ], 422);
            }

            if ($isPhoto && $size > 20 * 1024 * 1024) {
                return response()->json([
                    'message' => 'Photo max size is 20MB.',
                ], 422);
            }

            if ($isVideo && $size > 500 * 1024 * 1024) {
                return response()->json([
                    'message' => 'Video max size is 500MB.',
                ], 422);
            }

            $extension = $file->getClientOriginalExtension();
            $filename = Str::uuid() . '.' . $extension;

            $directory = "uploads/media/{$companyFolder}/{$guestFolder}";
            $publicPath = public_path($directory);

            if (!File::exists($publicPath)) {
                File::makeDirectory($publicPath, 0775, true);
            }

            $file->move($publicPath, $filename);

            $path = "{$directory}/{$filename}";

            $media = Media::create([
                'guest_id' => $guestId,
                'company_id' => $companyId,
                'file_type' => $isPhoto ? 'photo' : 'video',
                'original_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'thumbnail_path' => null,
                'file_size' => $size,
                'mime_type' => $mime,
                'is_visible' => true,
                'uploaded_by' => $uploadedBy,
                'uploaded_at' => now(),
            ]);

            $uploaded[] = $this->formatMedia($media);
        }

        return response()->json([
            'success' => true,
            'message' => 'Media uploaded successfully.',
            'media' => $uploaded,
        ], 201);
    }

    public function guestMedia($guestId)
    {
        $media = Media::where('guest_id', $guestId)
            ->latest('uploaded_at')
            ->get()
            ->map(fn ($item) => $this->formatMedia($item));

        return response()->json($media);
    }

    public function destroy($id)
    {
        $media = Media::findOrFail($id);

        if ($media->file_path && File::exists(public_path($media->file_path))) {
            File::delete(public_path($media->file_path));
        }

        if ($media->thumbnail_path && File::exists(public_path($media->thumbnail_path))) {
            File::delete(public_path($media->thumbnail_path));
        }

        $media->delete();

        return response()->json([
            'success' => true,
            'message' => 'Media deleted successfully.',
        ]);
    }

    public function visibility(Request $request, $id)
    {
        $request->validate([
            'is_visible' => ['required', 'boolean'],
        ]);

        $media = Media::findOrFail($id);

        $media->update([
            'is_visible' => $request->boolean('is_visible'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Visibility updated successfully.',
            'media' => $this->formatMedia($media),
        ]);
    }

    public function download($id)
    {
        $media = Media::findOrFail($id);

        if (!$media->file_path || !File::exists(public_path($media->file_path))) {
            return response()->json([
                'message' => 'File not found.',
            ], 404);
        }

        return Response::download(
            public_path($media->file_path),
            $media->original_name
        );
    }

    private function formatMedia(Media $media)
    {
        return [
            'id' => $media->id,
            'guest_id' => $media->guest_id,
            'company_id' => $media->company_id,
            'file_type' => $media->file_type,
            'original_name' => $media->original_name,
            'file_path' => $media->file_path,
            'file_url' => asset($media->file_path),
            'thumbnail_path' => $media->thumbnail_path,
            'thumbnail_url' => $media->thumbnail_path
                ? asset($media->thumbnail_path)
                : null,
            'file_size' => $media->file_size,
            'mime_type' => $media->mime_type,
            'is_visible' => (bool) $media->is_visible,
            'uploaded_by' => $media->uploaded_by,
            'uploaded_at' => $media->uploaded_at,
        ];
    }
}