<?php

namespace App\Models;

use Database\Factories\UniversityAdministrationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UniversityAdministration extends Model
{
    /** @use HasFactory<UniversityAdministrationFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;

    protected $table = 'university_administration';

    protected $primaryKey = 'administration_id';

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'position',
        'type',
        'profile_picture_name',
        'profile_picture_path',
    ];

    protected $casts = [
        'profile_picture_name' => 'encrypted',
        'profile_picture_path' => 'encrypted',
    ];
}
