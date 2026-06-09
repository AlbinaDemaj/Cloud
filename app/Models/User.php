<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role',
        'company_id',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function company()
    {
        return $this->belongsTo(User::class, 'company_id');
    }

    public function guests()
    {
        return $this->hasMany(User::class, 'company_id')
            ->where('role', 'guest');
    }

    public function media()
    {
        return $this->hasMany(Media::class, 'guest_id');
    }

    public function companyMedia()
    {
        return $this->hasMany(Media::class, 'company_id');
    }

    public function folders()
    {
        return $this->hasMany(Folder::class, 'company_id');
    }
}