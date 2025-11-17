<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CampusDirectors extends Model
{
    /** @use HasFactory<\Database\Factories\CampusDirectorsFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'campus_directors';
    protected $primaryKey = 'director_id';
    protected $fillable = [
        'name',
        'term_start_date',
        'term_end_date',
        'description',
        'profile_image_name',
        'profile_image_path',
    ];

    protected $casts = [
        'profile_image_name' => 'encrypted',
        'profile_image_path' => 'encrypted',
    ];
}
