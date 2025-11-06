<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Pillars extends Model
{
    /** @use HasFactory<\Database\Factories\PillarsFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'pillars';
    protected $primaryKey = 'pillar_id';
    protected $fillable = [
        'pillar_title',
    ];
}
