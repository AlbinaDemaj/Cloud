<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $fillable = [
        'company_id',
        'folder_id',
        'guest_id',
        'file_type',
        'original_name',
        'file_path',
        'thumbnail_path',
        'file_size',
        'mime_type',
        'is_visible',
        'uploaded_by',
        'uploaded_at',
    ];

    protected $casts = [
        'is_visible' => 'boolean',
        'uploaded_at' => 'datetime',
    ];

    protected $appends = [
        'file_url',
        'thumbnail_url',
    ];

    public function company()
    {
        return $this->belongsTo(User::class, 'company_id');
    }

    public function guest()
    {
        return $this->belongsTo(User::class, 'guest_id');
    }

    public function folder()
    {
        return $this->belongsTo(Folder::class, 'folder_id');
    }

    public function getFileUrlAttribute()
    {
        return $this->buildPublicUrl($this->file_path);
    }

    public function getThumbnailUrlAttribute()
    {
        return $this->buildPublicUrl($this->thumbnail_path);
    }

    private function buildPublicUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        $path = ltrim($path, '/');

        if (str_starts_with($path, 'public/')) {
            $path = substr($path, strlen('public/'));
        }

        if (str_starts_with($path, 'storage/')) {
            return asset($path);
        }

        if (str_starts_with($path, 'uploads/')) {
            return asset($path);
        }

        return asset('storage/' . $path);
    }
}