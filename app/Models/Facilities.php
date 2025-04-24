<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facilities extends Model
{
    /** @use HasFactory<\Database\Factories\FacilitiesFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'facilities';
    protected $primaryKey = 'facility_id';
    protected $fillable = [
        'facility_name',
        'description',
        'facility_image_name',
        'facility_link_path',
    ];
}
