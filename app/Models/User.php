<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
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
        'role_id',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
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
     * @return BelongsToMany<Programs,User>
     */
    /* public function Programs(): BelongsToMany
    {
        return $this->belongsToMany(Programs::class, 'user_program_roles', 'user_id', 'program_id')
            ->withPivot('user_program_role_id');
    } */

    /**
     * @return HasMany<ActivityLog,User>
     */
    public function ActivityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class, 'user_id', 'user_id');
    }

    /**
     * @return HasMany<LocalTaskForce,User>
     */
    /* public function LocalTaskForce(): HasMany
    {
        return $this->hasMany(LocalTaskForce::class, 'user_id', 'user_id');
    } */
}
