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
        'accreditation_level',
        'under_survey',
        'program_image_name',
        'program_image_path',
        'overview_image_name',
        'overview_image_path',
        'overview_description',
        'page_banner_image_name',
        'page_banner_image_path'
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
        return $this->hasMany(Areas::class, 'program_id', 'program_id');
    }

    /**
     * @return HasMany<AreaParameters,Programs>
     */
    public function Areas(): HasMany
    {
        return $this->hasMany(Areas::class, 'program_id', 'program_id');
    }

    /**
     * @return HasMany<UserProgramRoles,Programs>
     */
    public function UserProgramRoles(): HasMany
    {
        return $this->hasMany(UserProgramRoles::class, 'program_id', 'program_id');
    }

}
