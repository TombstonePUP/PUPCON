<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProgramGallery extends Model
{
    /** @use HasFactory<\Database\Factories\ProgramGalleryFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'program_gallery';
    protected $primaryKey = 'program_gallery_id';
    protected $fillable = [
        'program_id',
        'image_name',
        'image_path',
    ];

    protected $casts = [
        'image_name' => 'encrypted',
        'image_path' => 'encrypted',
    ];

    /**
     * Get the program that owns the gallery image.
     */
    public function program(): BelongsTo
    {
        return $this->belongsTo(Programs::class, 'program_id', 'program_id');
    }
}
