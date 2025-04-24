<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Faculties extends Model
{
    /** @use HasFactory<\Database\Factories\FacultiesFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'faculties';
    protected $primaryKey = 'faculty_id';
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'faculty_status',
        'program_id',
        'program_coordinator',
        'faculty_image_name',
        'faculty_image_path'
    ];

    /**
     * @return BelongsTo<Programs,Faculties>
     */
    public function Programs(): BelongsTo
    {
        return $this->belongsTo(Programs::class, 'program_id', 'program_id');
    }
}
