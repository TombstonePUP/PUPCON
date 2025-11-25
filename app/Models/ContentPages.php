<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ContentPages extends Model
{
    /** @use HasFactory<\Database\Factories\ContentPagesFactory> */
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
        'phone_number',
        'address',
    ];

    protected $casts = [
        'image_name' => 'encrypted',
        'image_path' => 'encrypted',
    ];
}
