<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Index', [
            'admin' => auth()->user(),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $admin = auth()->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['nullable', 'string', 'max:255', 'unique:users,username,' . $admin->id],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $admin->id],
        ]);

        $admin->update($validated);

        return back()->with('success', 'Profile updated successfully.');
    }

    public function updateSecurity(Request $request)
    {
        $admin = auth()->user();

        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $admin->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password updated successfully.');
    }
}