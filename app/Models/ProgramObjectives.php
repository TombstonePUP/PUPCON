<?php

namespace App\Models;

use Database\Factories\ProgramObjectivesFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgramObjectives extends Model
{
    /** @use HasFactory<ProgramObjectivesFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;

    protected $table = 'program_objectives';

    protected $primaryKey = 'program_objective_id';

    protected $fillable = [
        'program_id',
        'objective_title',
        'objective_description',
    ];

    /**
     * @return BelongsTo<Programs,ProgramObjectives>
     */
    public function Programs(): BelongsTo
    {
        return $this->belongsTo(Programs::class, 'program_id', 'program_id');
    }
}
