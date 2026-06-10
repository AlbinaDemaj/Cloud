<?php

namespace App\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use App\Models\Folder;
use App\Models\Media;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FolderController extends Controller
{
    private function companyId(): int
    {
        return Auth::user()->company_id ?? Auth::id();
    }

    public function index()
    {
        $folders = Folder::where('company_id', $this->companyId())
            ->whereNull('parent_id')
            ->with([
                'guest:id,name,username,email',
                'children.guest:id,name,username,email',
            ])
            ->withCount('media')
            ->latest()
            ->get();

        return Inertia::render('Company/Folders/Index', [
            'folders' => $folders,
        ]);
    }

    public function create()
    {
        $guests = User::where('role', 'guest')
            ->where('company_id', $this->companyId())
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'username', 'email']);

        $parentFolders = Folder::where('company_id', $this->companyId())
            ->whereNull('parent_id')
            ->orderBy('name')
            ->get(['id', 'name', 'guest_id']);

        return Inertia::render('Company/Folders/Create', [
            'guests' => $guests,
            'parentFolders' => $parentFolders,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'guest_id' => ['required', 'exists:users,id'],
            'parent_id' => ['nullable', 'exists:folders,id'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        $guest = User::where('id', $validated['guest_id'])
            ->where('role', 'guest')
            ->where('company_id', $this->companyId())
            ->firstOrFail();

        $parentId = $validated['parent_id'] ?? null;

        if ($parentId) {
            Folder::where('id', $parentId)
                ->where('company_id', $this->companyId())
                ->where('guest_id', $guest->id)
                ->firstOrFail();
        }

        Folder::create([
            'company_id' => $this->companyId(),
            'guest_id' => $guest->id,
            'parent_id' => $parentId,
            'name' => $validated['name'],
            'is_active' => true,
        ]);

        return redirect()
            ->route('company.folders.index')
            ->with('success', 'Folder u krijua me sukses.');
    }

    public function show(Folder $folder)
    {
        $this->authorizeFolder($folder);

        $folder->load([
            'guest:id,name,username,email',
            'parent:id,name',
            'children',
        ]);

        $media = Media::where('folder_id', $folder->id)
            ->latest()
            ->get();

        return Inertia::render('Company/Folders/Show', [
            'folder' => $folder,
            'media' => $media,
        ]);
    }

    public function edit(Folder $folder)
    {
        $this->authorizeFolder($folder);

        $guests = User::where('role', 'guest')
            ->where('company_id', $this->companyId())
            ->orderBy('name')
            ->get(['id', 'name', 'username', 'email']);

        $parentFolders = Folder::where('company_id', $this->companyId())
            ->whereNull('parent_id')
            ->where('id', '!=', $folder->id)
            ->orderBy('name')
            ->get(['id', 'name', 'guest_id']);

        return Inertia::render('Company/Folders/Edit', [
            'folder' => $folder,
            'guests' => $guests,
            'parentFolders' => $parentFolders,
        ]);
    }

    public function update(Request $request, Folder $folder)
    {
        $this->authorizeFolder($folder);

        $validated = $request->validate([
            'guest_id' => ['required', 'exists:users,id'],
            'parent_id' => ['nullable', 'exists:folders,id'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        $guest = User::where('id', $validated['guest_id'])
            ->where('role', 'guest')
            ->where('company_id', $this->companyId())
            ->firstOrFail();

        $parentId = $validated['parent_id'] ?? null;

        if ($parentId) {
            Folder::where('id', $parentId)
                ->where('company_id', $this->companyId())
                ->where('guest_id', $guest->id)
                ->where('id', '!=', $folder->id)
                ->firstOrFail();
        }

        $folder->update([
            'guest_id' => $guest->id,
            'parent_id' => $parentId,
            'name' => $validated['name'],
        ]);

        return redirect()
            ->route('company.folders.index')
            ->with('success', 'Folder u përditësua me sukses.');
    }

    public function destroy(Folder $folder)
    {
        $this->authorizeFolder($folder);

        $folder->delete();

        return redirect()
            ->route('company.folders.index')
            ->with('success', 'Folder u fshi me sukses.');
    }

    private function authorizeFolder(Folder $folder): void
    {
        abort_if(
            (int) $folder->company_id !== (int) $this->companyId(),
            403
        );
    }
}