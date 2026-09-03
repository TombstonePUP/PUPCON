<?php

namespace App\Models;

use Database\Factories\OrganizationsFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Organizations extends Model
{
    /** @use HasFactory<OrganizationsFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;

    protected $table = 'organizations';

    protected $primaryKey = 'organization_id';

    protected $fillable = [
        'type_id',
        'organization_name',
        'affiliation',
    ];

    /**
     * @return BelongsTo<Organizations, OrganizationTypes>
     */
    public function Type(): BelongsTo
    {
        return $this->belongsTo(OrganizationTypes::class, 'type_id', 'type_id');
    }
}
