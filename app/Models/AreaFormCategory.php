<?php

namespace App\Models;

use Database\Factories\AreaFormCategoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AreaFormCategory extends Model
{
    /** @use HasFactory<AreaFormCategoryFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;

    protected $table = 'area_form_categories';

    protected $primaryKey = 'area_form_category_id';

    protected $fillable = [
        'category_name',
    ];

    /**
     * @return HasMany<AreaForms,AreaFormCategory>
     */
    public function AreaForms(): HasMany
    {
        return $this->hasMany(AreaForms::class, 'area_form_category_id', 'area_form_category_id');
    }
}
