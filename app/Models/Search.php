<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Search extends Model
{
    /** @use HasFactory<\Database\Factories\SearchFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'search';
    protected $primaryKey = 'search_id';
    protected $fillable = [
        'content',
        'content_type',
        'content_path',
    ];
}
