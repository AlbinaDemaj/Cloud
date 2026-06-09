<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    protected $fillable = [
        'company_id',
        'guest_id',
        'name',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function company()
    {
        return $this->belongsTo(User::class, 'company_id');
    }

    public function guest()
    {
        return $this->belongsTo(User::class, 'guest_id');
    }

    public function media()
    {
        return $this->hasMany(Media::class, 'folder_id');
    }
}