<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Programs extends Model
{
    /** @use HasFactory<\Database\Factories\ProgramsFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'programs';
    protected $primaryKey = 'program_id';
    protected $fillable = [
        'degree_type',
        'program_name',
        'program_image_name',
        'program_image_path',
        'program_description',
        'accreditation_level',
        'under_survey',
        'overview_description',
        'overview_image_name',
        'overview_image_path'
    ];

    /**
     * @return HasMany<ProgramObjectives,Programs>
     */
    public function programObjectives(): HasMany
    {
        return $this->hasMany(ProgramObjectives::class, 'program_id', 'program_id');
    }

    /**
     * @return HasMany<AreaParameters,Programs>
     */
    public function AreaParameters(): HasMany
    {
        return $this->hasMany(AreaParameters::class, 'program_id', 'program_id');
    }

    /**
     * @return HasMany<UserProgramRoles,Programs>
     */
    public function UserProgramRoles(): HasMany
    {
        return $this->hasMany(UserProgramRoles::class, 'program_id', 'program_id');
    }

    /**
     * @return HasMany<Facilities,Programs>
     */
    public function Facilities(): HasMany
    {
        return $this->hasMany(Facilities::class, 'program_id', 'program_id');
    }
}
