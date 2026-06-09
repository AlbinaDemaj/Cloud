<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Folder;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FolderController extends Controller
{
    public function index()
    {
        $folders = Folder::with(['company', 'guest'])
            ->latest()
            ->get();

        return Inertia::render('Admin/Folders/Index', [
            'folders' => $folders,
        ]);
    }

    public function create()
    {
        $companies = User::where('role', 'company')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        $guests = User::where('role', 'guest')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'company_id']);

        return Inertia::render('Admin/Folders/Create', [
            'companies' => $companies,
            'guests' => $guests,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => ['required', 'exists:users,id'],
            'guest_id' => ['nullable', 'exists:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        Folder::create([
            'company_id' => $validated['company_id'],
            'guest_id' => $validated['guest_id'] ?? null,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_active' => $request->boolean('is_active', true),
        ]);

        return redirect()
            ->route('admin.folders.index')
            ->with('success', 'Folder created successfully.');
    }

    public function edit(Folder $folder)
    {
        $companies = User::where('role', 'company')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        $guests = User::where('role', 'guest')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'company_id']);

        return Inertia::render('Admin/Folders/Edit', [
            'folder' => $folder,
            'companies' => $companies,
            'guests' => $guests,
        ]);
    }

    public function update(Request $request, Folder $folder)
    {
        $validated = $request->validate([
            'company_id' => ['required', 'exists:users,id'],
            'guest_id' => ['nullable', 'exists:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $folder->update([
            'company_id' => $validated['company_id'],
            'guest_id' => $validated['guest_id'] ?? null,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'is_active' => $request->boolean('is_active'),
        ]);

        return redirect()
            ->route('admin.folders.index')
            ->with('success', 'Folder updated successfully.');
    }

    public function destroy(Folder $folder)
    {
        $folder->delete();

        return redirect()
            ->route('admin.folders.index')
            ->with('success', 'Folder deleted successfully.');
    }
}