<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    /**
     * @return HasMany<PillarItems,Pillars>
     */
    public function PillarItems(): HasMany
    {
        return $this->hasMany(PillarItems::class, 'pillar_id', 'pillar_id');
    }
}
