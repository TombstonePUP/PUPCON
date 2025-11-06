<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacultyStaff extends Model
{
    /** @use HasFactory<\Database\Factories\FacultyStaffFactory> */
    use HasFactory;

    protected $table = 'faculty_staff';        // explicitly set because plural is irregular
    protected $primaryKey = 'faculty_staff_id';  // your primary key column

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'personnel_type',
        'status',
        'program_id',
        'program_coordinator',
        'faculty_image_name',
        'faculty_image_path',
    ];

    protected $casts = [
        'faculty_image_name' => 'encrypted',
        'faculty_image_path' => 'encrypted',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<Programs,FacultyStaff>
     */
    public function Programs(): BelongsTo
    {
        return $this->belongsTo(Programs::class, 'program_id', 'program_id');
    }

}
