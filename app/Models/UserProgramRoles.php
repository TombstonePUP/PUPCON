<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProgramRoles extends Model
{
    /** @use HasFactory<\Database\Factories\UserProgramRolesFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'user_program_roles';
    protected $primaryKey = 'user_program_role_id';
    protected $fillable = [
        'user_id',
        'program_id',
    ];

    /**
     * @return BelongsTo<User,UserProgramRoles>
     */
    public function Users(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * @return BelongsTo<Programs,UserProgramRoles>
     */
    public function Programs(): BelongsTo
    {
        return $this->belongsTo(Programs::class, 'program_id', 'program_id');
    }
}
