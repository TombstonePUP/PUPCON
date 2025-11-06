<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Organizations extends Model
{
    /** @use HasFactory<\Database\Factories\OrganizationsFactory> */
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
}
