<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
}
