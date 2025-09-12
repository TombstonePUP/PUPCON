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
        'user_id',
        'area_id',
    ];

    /**
     * @return BelongsTo<UserRoles,UserAreaRoles>
     */
    public function Users(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * @return BelongsTo<Areas,UserAreaRoles>
     */
    public function Areas(): BelongsTo
    {
        return $this->belongsTo(Areas::class, 'area_id', 'area_id');
    }
}
