<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Folder;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GuestController extends Controller
{
    private function companyId(): int
    {
        return Auth::id();
    }

    public function index()
    {
        $guests = User::query()
            ->where('role', 'guest')
            ->where('company_id', $this->companyId())
            ->with([
                'media' => function ($query) {
                    $query->with('folder')
                        ->latest();
                },
            ])
            ->latest()
            ->get();

        return Inertia::render('Company/Guests/Index', [
            'guests' => $guests,
        ]);
    }

    public function show(User $guest)
{
    $this->authorizeGuest($guest);

    $guest->load([
        'media' => function ($query) {
            $query->with('folder')->latest();
        },
    ]);

    $folders = Folder::query()
        ->where('company_id', $this->companyId())
        ->where(function ($query) use ($guest) {
            $query->whereNull('guest_id')
                ->orWhere('guest_id', $guest->id);
        })
        ->latest()
        ->get(['id', 'name', 'guest_id']);

    return Inertia::render('Company/Guests/Show', [
        'guest' => $guest,
        'folders' => $folders,
    ]);
}

    private function authorizeGuest(User $guest): void
    {
        abort_if(
            $guest->role !== 'guest' ||
            (int) $guest->company_id !== (int) $this->companyId(),
            403
        );
    }
}