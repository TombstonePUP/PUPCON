<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAreaRoles extends Model
{
    /** @use HasFactory<\Database\Factories\UserAreaRolesFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'user_area_roles';
    protected $primaryKey = 'user_area_role_id';
    protected $fillable = [
        'user_role_id',
        'area_id',
    ];

    /**
     * @return BelongsTo<UserRoles,UserAreaRoles>
     */
    public function UserRoles(): BelongsTo
    {
        return $this->belongsTo(UserRoles::class, 'user_role_id', 'user_role_id');
    }

    /**
     * @return BelongsTo<Areas,UserAreaRoles>
     */
    public function Areas(): BelongsTo
    {
        return $this->belongsTo(Areas::class, 'area_id', 'area_id');
    }
}
