<?php

use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\FolderController as AdminFolderController;
use App\Http\Controllers\Admin\GuestController as AdminGuestController;
use App\Http\Controllers\Admin\MediaController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Company\FolderController as CompanyFolderController;
use App\Http\Controllers\Company\GuestController;
use App\Http\Controllers\Company\MediaController as CompanyMediaController;
use App\Http\Controllers\Guest\DashboardController as GuestDashboardController;
use App\Http\Controllers\ProfileController;
use App\Models\Media;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        $user = auth()->user();

        return match ($user->role) {
            'admin' => redirect()->route('admin.dashboard'),
            'company' => redirect()->route('company.dashboard'),
            'guest' => redirect()->route('guest.dashboard'),
            default => redirect('/'),
        };
    })->name('dashboard');

    Route::middleware(['role:admin'])
        ->prefix('admin')
        ->name('admin.')
        ->group(function () {
            Route::get('/dashboard', function () {
                $companiesQuery = User::where('role', 'company');
                $guestsQuery = User::where('role', 'guest');
                $mediaQuery = Media::query();

                return Inertia::render('Admin/Dashboard', [
                    'totalCompanies' => (clone $companiesQuery)->count(),
                    'activeCompanies' => (clone $companiesQuery)->where('is_active', true)->count(),
                    'inactiveCompanies' => (clone $companiesQuery)->where('is_active', false)->count(),
                    'totalGuests' => (clone $guestsQuery)->count(),
                    'totalMedia' => (clone $mediaQuery)->count(),
                    'photosCount' => (clone $mediaQuery)->where('file_type', 'photo')->count(),
                    'videosCount' => (clone $mediaQuery)->where('file_type', 'video')->count(),
                ]);
            })->name('dashboard');

            Route::resource('companies', CompanyController::class);
            Route::resource('guests', AdminGuestController::class);
            Route::resource('folders', AdminFolderController::class);

            Route::patch('/guests/{guest}/toggle-status', [AdminGuestController::class, 'toggleStatus'])
                ->name('guests.toggle-status');

            Route::get('/media', [MediaController::class, 'index'])
                ->name('media.index');

            Route::patch('/media/{media}/visibility', [MediaController::class, 'toggleVisibility'])
                ->name('media.visibility');

            Route::delete('/media/{media}', [MediaController::class, 'destroy'])
                ->name('media.destroy');

            Route::get('/settings', [SettingsController::class, 'index'])
                ->name('settings.index');

            Route::patch('/settings/profile', [SettingsController::class, 'updateProfile'])
                ->name('settings.profile');

            Route::patch('/settings/security', [SettingsController::class, 'updateSecurity'])
                ->name('settings.security');
        });

    Route::middleware(['role:company'])
        ->prefix('company')
        ->name('company.')
        ->group(function () {
            Route::get('/dashboard', function () {
                $companyId = auth()->id();

                $guests = User::where('role', 'guest')
                    ->where('company_id', $companyId)
                    ->latest()
                    ->get();

                $mediaQuery = Media::where('company_id', $companyId);

                return Inertia::render('Company/Dashboard', [
                    'guests' => $guests,
                    'mediaCount' => (clone $mediaQuery)->count(),
                    'photosCount' => (clone $mediaQuery)->where('file_type', 'photo')->count(),
                    'videosCount' => (clone $mediaQuery)->where('file_type', 'video')->count(),
                ]);
            })->name('dashboard');

            Route::get('/guests', [GuestController::class, 'index'])
                ->name('guests.index');

            Route::get('/guests/{guest}', [GuestController::class, 'show'])
                ->name('guests.show');

            Route::resource('folders', CompanyFolderController::class);

            Route::get('/media', [CompanyMediaController::class, 'index'])
                ->name('media.index');

            Route::post('/media', [CompanyMediaController::class, 'store'])
                ->name('media.store');

            Route::patch('/media/{media}/visibility', [CompanyMediaController::class, 'toggleVisibility'])
                ->name('media.visibility');

            Route::delete('/media/{media}', [CompanyMediaController::class, 'destroy'])
                ->name('media.destroy');
        });

    Route::middleware(['role:guest'])
        ->prefix('guest')
        ->name('guest.')
        ->group(function () {
            Route::get('/dashboard', [GuestDashboardController::class, 'index'])
                ->name('dashboard');

            Route::get('/media/download-all', [GuestDashboardController::class, 'downloadAll'])
                ->name('media.downloadAll');

            Route::get('/media/download-selected', [GuestDashboardController::class, 'downloadSelected'])
                ->name('media.downloadSelected');
        });

    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});

Route::get('/test-upload-media', function () {
    return view('test-upload-media');
});

Route::get('/dev-logout', function () {
    auth()->logout();

    request()->session()->invalidate();
    request()->session()->regenerateToken();

    return redirect('/login');
});

require __DIR__.'/auth.php';