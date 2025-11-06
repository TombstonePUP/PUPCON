<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PillarItems extends Model
{
    /** @use HasFactory<\Database\Factories\PillarItemsFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'pillar_items';
    protected $primaryKey = 'pillar_item_id';
    protected $fillable = [
        'pillar_id',
        'item_description',
    ];
}
