<?php

namespace App\Models;

use Database\Factories\PillarItemsFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PillarItems extends Model
{
    /** @use HasFactory<PillarItemsFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;

    protected $table = 'pillar_items';

    protected $primaryKey = 'item_id';

    protected $fillable = [
        'pillar_id',
        'item_description',
    ];

    /**
     * @return BelongsTo<PillarItems, Pillars>
     */
    public function Pillar(): BelongsTo
    {
        return $this->belongsTo(Pillars::class, 'pillar_id', 'pillar_id');
    }
}
