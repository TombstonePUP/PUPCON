<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
        'program_description',
        'under_survey',
        'program_image_name',
        'program_image_path',
        'overview_image_name',
        'overview_image_path',
        'overview_description',
        'page_banner_image_name',
        'page_banner_image_path',
        'is_active',
        'color'
    ];

    protected $casts = [
        'program_image_name' => 'encrypted',
        'program_image_path' => 'encrypted',
        'overview_image_name' => 'encrypted',
        'overview_image_path' => 'encrypted',
        'page_banner_image_name' => 'encrypted',
        'page_banner_image_path' => 'encrypted'
    ];

    /**
     * @return BelongsToMany<User,Programs>
     */
    public function Users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_program_roles', 'program_id', 'user_id')
            ->withPivot('role_id');
    }

    /**
     * @return HasMany<ProgramObjectives,Programs>
     */
    public function programObjectives(): HasMany
    {
        return $this->hasMany(ProgramObjectives::class, 'program_id', 'program_id');
    }

    /**
     * @return HasMany<AccreditationLevels,Programs>
     */
    public function Levels(): HasMany
    {
        return $this->hasMany(AccreditationLevels::class, 'program_id', 'program_id');
    }

    /**
     * @return HasMany<Faculty,Programs>
     */
    public function FacultyStaff(): HasMany
    {
        return $this->hasMany(FacultyStaff::class, 'program_id', 'program_id');
    }

    /**
     * @return HasMany<ProgramGallery,Programs>
     */
    public function ProgramGallery(): HasMany
    {
        return $this->hasMany(ProgramGallery::class, 'program_id', 'program_id');
    }

    public function Objectives()
    {
        return $this->hasMany(ProgramObjectives::class, 'program_id', 'program_id');
    }


    public function latestLevel()
    {
        return $this->hasOne(AccreditationLevels::class, 'program_id', 'program_id')
            ->with('Areas')
            ->orderBy('survey_date', 'desc');
    }
}
