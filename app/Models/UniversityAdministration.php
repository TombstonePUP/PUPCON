<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UniversityAdministration extends Model
{
    /** @use HasFactory<\Database\Factories\UniversityAdministrationFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'university_administration';
    protected $primaryKey = 'admin_id';
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'additional_info',
        'profile_picture_name',
        'profile_picture_path',
    ];
}
