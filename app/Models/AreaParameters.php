<?php

namespace App\Models;

use Database\Factories\AreaParametersFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AreaParameters extends Model
{
    /** @use HasFactory<AreaParametersFactory> */
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
        'area_id',
        'parameter_name',
        'parameter_description',
        'mean',
    ];

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
