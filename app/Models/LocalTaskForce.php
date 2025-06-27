<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LocalTaskForce extends Model
{
    /** @use HasFactory<\Database\Factories\LocalTaskForceFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'local_task_force';
    protected $primaryKey = 'local_task_force_id';
    protected $fillable = [
        // 'user_id',
        'area',
        'first_name',
        'last_nae',
        'profile_image_name',
        'profile_image_path',
    ];

    /**
     * @return BelongsTo<User,LocalTaskForce>
     */
    public function Users(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
