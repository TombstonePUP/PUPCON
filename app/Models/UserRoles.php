<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserRoles extends Model
{
    /** @use HasFactory<\Database\Factories\UserRolesFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'user_roles';
    protected $primaryKey = 'user_role_id';
    protected $fillable = [
        'user_id',
        'role_id',
    ];

    /**
     * @return HasMany<UserAreaRoles,UserRoles>
     */
    public function UserAreaRoles(): HasMany
    {
        return $this->hasMany(UserAreaRoles::class, 'user_role_id', 'user_role_id');
    }

    /**
     * @return HasMany<UserProgramRoles,UserRoles>
     */
    public function UserProgramRoles(): HasMany
    {
        return $this->hasMany(UserProgramRoles::class, 'user_role_id', 'user_role_id');
    }

    /**
     * @return BelongsTo<User,UserRoles>
     */
    public function Users(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * @return BelongsTo<Roles,UserRoles>
     */
    public function Roles(): BelongsTo
    {
        return $this->belongsTo(Roles::class, 'role_id', 'role_id');
    }
}
