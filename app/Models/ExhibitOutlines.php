<?php

namespace App\Models;

use Database\Factories\ExhibitOutlinesFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ExhibitOutlines extends Model
{
    /** @use HasFactory<ExhibitOutlinesFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;

    protected $table = 'exhibit_outlines';

    protected $primaryKey = 'exhibit_outline_id';

    protected $fillable = [
        'exhibit_id',
        'outline_description',
        'category',
    ];

    /**
     * @return BelongsTo<Exhibits,ExhibitOutlines>
     */
    public function Exhibits(): BelongsTo
    {
        return $this->belongsTo(Exhibits::class, 'exhibit_id', 'exhibit_id');
    }

    /**
     * @return HasOne<ExhibitFiles,ExhibitOutlines>
     */
    public function ExhibitFiles(): HasOne
    {
        return $this->hasOne(ExhibitFiles::class, 'exhibit_outline_id', 'exhibit_outline_id');
    }
}
