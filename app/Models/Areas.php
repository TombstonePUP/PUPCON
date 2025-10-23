<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
        'accreditation_level_id',
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
     * @return HasMany<AreaForms,Areas>
     */
    public function AreaForms(): HasMany
    {
        return $this->hasMany(AreaForms::class, 'area_id', 'area_id');
    }

    /**
     * @return HasMany<UserAreaRoles,Areas>
     */
    public function UserAreaRoles(): HasMany
    {
        return $this->hasMany(UserAreaRoles::class, 'area_id', 'area_id');
    }

    /**
     * @return BelongsTo<AccreditationLevels,Areas>
     */
    public function Levels(): BelongsTo
    {
        return $this->belongsTo(AccreditationLevels::class, 'accreditation_level_id', 'accreditation_level_id');
    }

    /**
     * @return BelongsToMany<UserRoles,Areas>
     */
    public function Users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_area_roles', 'area_id', 'user_id')
            ->withPivot('user_area_role_id');
    }
}
