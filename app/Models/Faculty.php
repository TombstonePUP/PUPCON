<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    protected $table = 'faculties';        // explicitly set because plural is irregular
    protected $primaryKey = 'faculty_id';  // your primary key column

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'faculty_status',
        'program_id',
        'program_coordinator',
        'faculty_image_name',
        'faculty_image_path',
    ];

}
