<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class GuestController extends Controller
{
    public function index()
    {
        $guests = User::where('role', 'guest')
            ->with('company')
            ->latest()
            ->get();

        return Inertia::render('Admin/Guests/Index', [
            'guests' => $guests,
        ]);
    }

    public function create()
    {
        $companies = User::where('role', 'company')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('Admin/Guests/Create', [
            'companies' => $companies,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => ['required', 'exists:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'is_active' => ['boolean'],
        ]);

        User::create([
            'company_id' => $validated['company_id'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'guest',
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()
            ->route('admin.guests.index')
            ->with('success', 'Guest created successfully.');
    }

    public function edit(User $guest)
    {
        abort_unless($guest->role === 'guest', 404);

        $companies = User::where('role', 'company')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('Admin/Guests/Edit', [
            'guest' => $guest,
            'companies' => $companies,
        ]);
    }

    public function update(Request $request, User $guest)
    {
        abort_unless($guest->role === 'guest', 404);

        $validated = $request->validate([
            'company_id' => ['required', 'exists:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($guest->id),
            ],
            'password' => ['nullable', 'string', 'min:6'],
            'is_active' => ['boolean'],
        ]);

        $guest->update([
            'company_id' => $validated['company_id'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'is_active' => $validated['is_active'] ?? false,
            'password' => !empty($validated['password'])
                ? Hash::make($validated['password'])
                : $guest->password,
        ]);

        return redirect()
            ->route('admin.guests.index')
            ->with('success', 'Guest updated successfully.');
    }

    public function destroy(User $guest)
    {
        abort_unless($guest->role === 'guest', 404);

        $guest->delete();

        return redirect()
            ->route('admin.guests.index')
            ->with('success', 'Guest deleted successfully.');
    }

    public function toggleStatus(User $guest)
    {
        abort_unless($guest->role === 'guest', 404);

        $guest->update([
            'is_active' => !$guest->is_active,
        ]);

        return back()->with('success', 'Guest status updated successfully.');
    }
}