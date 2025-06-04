<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Areas extends Model
{
    /** @use HasFactory<\Database\Factories\AreasFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'areas';
    protected $primaryKey = 'area_id';
    protected $fillable = [
        'area_number',
        'area_name',
        'area_description',
        'area_image_name',
        'area_image_path'
    ];

    /**
     * @return HasMany<AreaParameters,Areas>
     */
    public function AreaParameters(): HasMany
    {
        return $this->hasMany(AreaParameters::class, 'area_id', 'area_id');
    }

    /**
     * @return HasMany<UserAreaRoles,Areas>
     */
    public function UserAreaRoles(): HasMany
    {
        return $this->hasMany(UserAreaRoles::class, 'area_id', 'area_id');
    }

    /**
     * @return BelongsToMany<UserRoles,Areas>
     */
    public function UserRoles(): BelongsToMany
    {
        return $this->belongsToMany(UserRoles::class, 'user_area_roles', 'area_id', 'user_role_id')
            ->withPivot('user_area_role_id');
    }
}
