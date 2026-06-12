<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Folder;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GuestController extends Controller
{
    private function companyId(): int
    {
        return (int) Auth::id();
    }

    public function index()
    {
        $guests = User::query()
            ->where('role', 'guest')
            ->where('company_id', $this->companyId())
            ->withCount(['media'])
            ->latest()
            ->get();

        return Inertia::render('Company/Guests/Index', [
            'guests' => $guests,
        ]);
    }

    public function show(User $guest)
    {
        $this->authorizeGuest($guest);

        $folders = Folder::query()
            ->where('company_id', $this->companyId())
            ->where('guest_id', $guest->id)
            ->withCount('media')
            ->latest()
            ->get();

        return Inertia::render('Company/Guests/Show', [
            'guest' => $guest,
            'folders' => $folders,
        ]);
    }

    public function storeFolder(Request $request, User $guest)
    {
        $this->authorizeGuest($guest);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $folder = Folder::create([
            'company_id' => $this->companyId(),
            'guest_id' => $guest->id,
            'parent_id' => null,
            'name' => $data['name'],
            'is_visible' => true,
        ]);

        $folder->loadCount('media');

        return response()->json([
            'folder' => $folder,
        ]);
    }

    public function showFolder(User $guest, Folder $folder)
{
    $this->authorizeGuest($guest);

    abort_if(
        (int) $folder->company_id !== $this->companyId() ||
        (int) $folder->guest_id !== (int) $guest->id,
        404
    );

    $folder->load([
        'media' => function ($query) {
            $query->latest();
        },
    ]);

    $folder->loadCount('media');

    return Inertia::render('Company/Guests/FolderShow', [
        'guest' => $guest,
        'folder' => $folder,
        'media' => $folder->media,
    ]);
}

    private function authorizeGuest(User $guest): void
    {
        abort_if(
            $guest->role !== 'guest' ||
            (int) $guest->company_id !== $this->companyId(),
            403
        );
    }
}