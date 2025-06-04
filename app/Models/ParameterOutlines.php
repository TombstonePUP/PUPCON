<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

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
        'parameter_outline_category_id',
        'outline_name',
        'outline_description',
        'container'
    ];

    /**
     * @return BelongsTo<AreaParameters,ParameterOutlines>
     */
    public function AreaParameter(): BelongsTo
    {
        return $this->belongsTo(AreaParameters::class, 'area_parameter_id', 'area_parameter_id');
    }

    /**
     * @return BelongsTo<ParameterOutlineCategory,ParameterOutlines>
     */
    public function ParameterOutlineCategory(): BelongsTo
    {
        return $this->belongsTo(ParameterOutlineCategory::class, 'parameter_outline_category_id', 'parameter_outline_category_id');
    }

    /**
     * @return HasOne<AreaFiles,ParameterOutlines>
     */
    public function AreaFiles(): HasOne
    {
        return $this->hasOne(AreaFiles::class, 'parameter_outline_id', 'parameter_outline_id');
    }
}
