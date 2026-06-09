<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MediaController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working',
    ]);
});

Route::post('/media/upload', [MediaController::class, 'upload']);

Route::get('/media/guest/{guestId}', [MediaController::class, 'guestMedia']);

Route::delete('/media/{id}', [MediaController::class, 'destroy']);

Route::patch('/media/{id}/visibility', [MediaController::class, 'visibility']);

Route::get('/media/{id}/download', [MediaController::class, 'download']);
