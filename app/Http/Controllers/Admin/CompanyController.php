<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index()
    {
        $companies = User::where('role', 'company')
            ->latest()
            ->get()
            ->map(function ($company) {
                return [
                    'id' => $company->id,
                    'name' => $company->name,
                    'email' => $company->email,
                    'is_active' => (bool) $company->is_active,
                    'guests_count' => User::where('role', 'guest')
                        ->where('company_id', $company->id)
                        ->count(),
                    'user' => [
                        'id' => $company->id,
                        'name' => $company->name,
                        'email' => $company->email,
                    ],
                ];
            });

        return Inertia::render('Admin/Companies/Index', [
            'companies' => $companies,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Companies/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'profile' => ['nullable', 'string'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'company',
            'company_id' => null,
            'is_active' => true,
        ]);

        return redirect()
            ->route('admin.companies.index')
            ->with('success', 'Company created successfully.');
    }

    public function edit(User $company)
    {
        abort_if($company->role !== 'company', 404);

        return Inertia::render('Admin/Companies/Edit', [
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'email' => $company->email,
                'profile' => '',
                'is_active' => (bool) $company->is_active,
                'user' => [
                    'id' => $company->id,
                    'name' => $company->name,
                    'email' => $company->email,
                ],
            ],
        ]);
    }

    public function update(Request $request, User $company)
    {
        abort_if($company->role !== 'company', 404);

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'profile' => ['nullable', 'string'],
            'email' => ['required', 'email', 'unique:users,email,' . $company->id],
            'password' => ['nullable', 'string', 'min:6'],
            'is_active' => ['required', 'boolean'],
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'is_active' => $request->boolean('is_active'),
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $company->update($data);

        return redirect()
            ->route('admin.companies.index')
            ->with('success', 'Company updated successfully.');
    }

    public function destroy(User $company)
    {
        abort_if($company->role !== 'company', 404);

        User::where('role', 'guest')
            ->where('company_id', $company->id)
            ->delete();

        $company->delete();

        return redirect()
            ->route('admin.companies.index')
            ->with('success', 'Company deleted successfully.');
    }
}