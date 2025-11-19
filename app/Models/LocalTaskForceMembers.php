<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LocalTaskForceMembers extends Model
{
    /** @use HasFactory<\Database\Factories\LocalTaskForceMembers> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'local_task_force_members';
    protected $primaryKey = 'member_id';
    protected $fillable = [
        'local_task_force_id',
        'full_name',
        'role',
    ];

    /**
     * @return BelongsTo<LocalTaskForceMembers, LocalTaskForce>
     */
    public function Chairman(): BelongsTo
    {
        return $this->belongsTo(LocalTaskForce::class, 'local_task_force_id', 'local_task_force_id');
    }
}
