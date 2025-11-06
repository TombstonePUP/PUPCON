<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrganizationTypes extends Model
{
    /** @use HasFactory<\Database\Factories\OrganizationTypesFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'organization_types';
    protected $primaryKey = 'type_id';
    protected $fillable = [
        'type_name',
    ];

    /**
     * @return HasMany<Organizations,OrganizationTypes>
     */
    public function Organizations(): HasMany
    {
        return $this->hasMany(Organizations::class, 'type_id', 'type_id');
    }
}
