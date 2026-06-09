<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $media = Media::query()
            ->with([
                'company:id,name,email',
                'guest:id,name,email',
                'folder:id,name',
            ])
            ->when($request->filled('company_id'), function ($query) use ($request) {
                $query->where('company_id', $request->company_id);
            })
            ->when($request->filled('guest_id'), function ($query) use ($request) {
                $query->where('guest_id', $request->guest_id);
            })
            ->when($request->filled('type'), function ($query) use ($request) {
                $query->where('file_type', $request->type);
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Media/Index', [
            'media' => $media,

            'companies' => User::query()
                ->where('role', 'company')
                ->select('id', 'name', 'email')
                ->orderBy('name')
                ->get(),

            'guests' => User::query()
                ->where('role', 'guest')
                ->select('id', 'name', 'email', 'company_id')
                ->orderBy('name')
                ->get(),

            'filters' => [
                'company_id' => $request->company_id,
                'guest_id' => $request->guest_id,
                'type' => $request->type,
            ],
        ]);
    }

    public function toggleVisibility(Media $media)
    {
        $media->update([
            'is_visible' => ! $media->is_visible,
        ]);

        return back()->with('success', 'Media visibility updated successfully.');
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
        $this->deletePublicFile($media->file_path);
        $this->deletePublicFile($media->thumbnail_path);

        $media->delete();

        return back()->with('success', 'Media deleted successfully.');
    }

    private function deletePublicFile(?string $path): void
    {
        if (empty($path)) {
            return;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return;
        }

        $path = ltrim($path, '/');

        if (str_starts_with($path, 'public/')) {
            $path = substr($path, strlen('public/'));
        }

        if (str_starts_with($path, 'storage/')) {
            $path = substr($path, strlen('storage/'));
            $fullPath = storage_path('app/public/' . $path);

            if (File::exists($fullPath)) {
                File::delete($fullPath);
            }

            return;
        }

        if (str_starts_with($path, 'uploads/')) {
            $fullPath = public_path($path);

            if (File::exists($fullPath)) {
                File::delete($fullPath);
            }

            return;
        }

        $storagePath = storage_path('app/public/' . $path);

        if (File::exists($storagePath)) {
            File::delete($storagePath);
            return;
        }

        $publicPath = public_path($path);

        if (File::exists($publicPath)) {
            File::delete($publicPath);
        }
    }
}