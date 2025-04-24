<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ParameterOutlines extends Model
{
    /** @use HasFactory<\Database\Factories\ParameterOutlinesFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'parameter_outlines';
    protected $primaryKey = 'parameter_outline_id';
    protected $fillable = [
        'area_parameter_id',
        'outline_name',
        'outline_description',
    ];

    /**
     * @return BelongsTo<AreaParameters,ParameterOutlines>
     */
    public function AreaParameter(): BelongsTo
    {
        return $this->belongsTo(AreaParameters::class, 'area_parameter_id', 'area_parameter_id');
    }

    /**
     * @return HasMany<AreaFiles,ParameterOutlines>
     */
    public function AreaFiles(): HasMany
    {
        return $this->hasMany(AreaFiles::class, 'parameter_outline_id', 'parameter_outline_id');
    }
}
