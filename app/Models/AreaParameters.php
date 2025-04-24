<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AreaParameters extends Model
{
    /** @use HasFactory<\Database\Factories\AreaParametersFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'area_parameters';
    protected $primaryKey = 'area_parameter_id';
    protected $fillable = [
        'program_id',
        'area_id',
        'parameter_name',
        'parameter_description'
    ];

    /**
     * @return BelongsTo<Programs,AreaParameters>
     */
    public function Programs(): BelongsTo
    {
        return $this->belongsTo(Programs::class, 'program_id', 'program_id');
    }

    /**
     * @return BelongsTo<Areas,AreaParameters>
     */
    public function Areas(): BelongsTo
    {
        return $this->belongsTo(Areas::class, 'area_id', 'area_id');
    }

    /**
     * @return HasMany<ParameterOutlines,AreaParameters>
     */
    public function ParameterOutlines(): HasMany
    {
        return $this->hasMany(ParameterOutlines::class, 'area_parameter_id', 'area_parameter_id');
    }
}
