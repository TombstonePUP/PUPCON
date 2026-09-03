<?php

namespace App\Models;

use Database\Factories\ContentPagesFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContentPages extends Model
{
    /** @use HasFactory<ContentPagesFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;

    protected $table = 'content_pages';

    protected $primaryKey = 'content_page_id';

    protected $fillable = [
        'page',
        'title',
        'subtitle',
        'description',
        'image_name',
        'image_path',
        'quote',
        'author',
        'director_image_name',
        'director_image_path',
        'director_message',
        'director_name',
        'certificate_of_authenticity',
        'video_link',
        'video_title',
        'video_description',
        'phone_number',
        'address',
    ];

    protected $casts = [
        'image_name' => 'encrypted',
        'image_path' => 'encrypted',
        'directors_image_name' => 'encrypted',
        'directors_image_path' => 'encrypted',
        'certificate_of_authenticity' => 'encrypted',
    ];
}
