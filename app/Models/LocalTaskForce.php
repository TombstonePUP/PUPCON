<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'area_name',
        'first_name',
        'last_name',
        'official',
        'official_position',
        'profile_image_name',
        'profile_image_path',
    ];

    protected $casts = [
        'profile_image_name' => 'encrypted',
        'profile_image_path' => 'encrypted',
    ];

    /**
     * @return HasMany<LocalTaskForceMembers, LocalTaskForce>
     */
    public function Members(): HasMany
    {
        return $this->hasMany(LocalTaskForceMembers::class, 'local_task_force_id', 'local_task_force_id');
    }

}
