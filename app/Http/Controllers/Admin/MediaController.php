<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $media = Media::query()
            ->with(['company:id,name,email', 'guest:id,name,email'])
            ->when($request->company_id, function ($query) use ($request) {
                $query->where('company_id', $request->company_id);
            })
            ->when($request->guest_id, function ($query) use ($request) {
                $query->where('guest_id', $request->guest_id);
            })
            ->when($request->type, function ($query) use ($request) {
                $query->where('file_type', $request->type);
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Media/Index', [
            'media' => $media,
            'companies' => User::where('role', 'company')
                ->select('id', 'name', 'email')
                ->orderBy('name')
                ->get(),

            'guests' => User::where('role', 'guest')
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
        if ($media->file_path && Storage::disk('public')->exists($media->file_path)) {
            Storage::disk('public')->delete($media->file_path);
        }

        if ($media->thumbnail_path && Storage::disk('public')->exists($media->thumbnail_path)) {
            Storage::disk('public')->delete($media->thumbnail_path);
        }

        $media->delete();

        return back()->with('success', 'Media deleted successfully.');
    }
}