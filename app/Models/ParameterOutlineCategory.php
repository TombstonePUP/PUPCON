<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ParameterOutlineCategory extends Model
{
    /** @use HasFactory<\Database\Factories\ParameterOutlineCategoryFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'parameter_outline_category';
    protected $primaryKey = 'parameter_outline_category_id';
    protected $fillable = [
        'category_name',
    ];

    /**
     * @return HasMany<ParameterOutlines,ParameterOutlineCategory>
     */
    public function ParameterOutlines(): HasMany
    {
        return $this->hasMany(ParameterOutlines::class, 'parameter_outline_category_id', 'parameter_outline_category_id');
    }
}
