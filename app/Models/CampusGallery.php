<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CampusGallery extends Model
{
    /** @use HasFactory<\Database\Factories\CampusGallery> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'campus_gallery';
    protected $primaryKey = 'gallery_id';
    protected $fillable = [
        'image_name',
        'image_path',
        'carousel',
        'description',
    ];

    protected $casts = [
        'image_name' => 'encrypted',
        'image_path' => 'encrypted',
        'carousel' => 'boolean',
    ];
}
