<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;

    protected $table = 'users';

    protected $primaryKey = 'user_id';

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'is_active',
        'must_update_password',
        'role_id',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'otp',
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'otp_expires_at' => 'datetime',
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * @return BelongsTo<Roles,User>
     */
    public function Roles(): BelongsTo
    {
        return $this->belongsTo(Roles::class, 'role_id', 'role_id');
    }

    /**
     * @return BelongsToMany<Programs,UserRoles>
     */
    public function Areas(): BelongsToMany
    {
        return $this->belongsToMany(Areas::class, 'user_area_roles', 'user_id', 'area_id')
            ->withPivot('user_area_role_id');
    }

    /**
     * @return HasMany<ActivityLog,User>
     */
    public function ActivityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class, 'user_id', 'user_id');
    }

    /**
     * @return HasMany<AreaFiles,User>
     */
    public function AreaFiles(): HasMany
    {
        return $this->hasMany(AreaFiles::class, 'uploaded_by', 'user_id');
    }

    /**
     * @return HasMany<AreaForms,User>
     */
    public function AreaForms(): HasMany
    {
        return $this->hasMany(AreaForms::class, 'uploaded_by', 'user_id');
    }

    /**
     * @return HasMany<ExhibitFiles,User>
     */
    public function ExhibitFiles(): HasMany
    {
        return $this->hasMany(ExhibitFiles::class, 'uploaded_by', 'user_id');
    }
}
