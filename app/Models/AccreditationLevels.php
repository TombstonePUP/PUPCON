<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AccreditationLevels extends Model
{
    /** @use HasFactory<\Database\Factories\AccreditationLevelsFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'accreditation_levels';
    protected $primaryKey = 'accreditation_level_id';
    protected $fillable = [
        'program_id',
        'level',
        'remarks',
        'survey_date',
        'mean',
        'is_active',
    ];

    /**
     * @return BelongsTo<Programs,AccreditationLevels>
     */
    public function Programs(): BelongsTo
    {
        return $this->belongsTo(Programs::class, 'program_id', 'program_id');
    }

    /**
     * @return HasMany<Areas,AccreditationLevels>
     */
    public function Areas(): HasMany
    {
        return $this->hasMany(Areas::class, 'accreditation_level_id', 'accreditation_level_id');
    }
}
