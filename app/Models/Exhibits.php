<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exhibits extends Model
{
    /** @use HasFactory<\Database\Factories\ExhibitsFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'exhibits';
    protected $primaryKey = 'exhibit_id';
    protected $fillable = [
        'exhibit_name',
        'image_name',
        'image_path',
        'container',
    ];

    /**
     * @return HasMany<ExhibitFiles,Exhibits>
     */
    public function ExhibitOutlines(): HasMany
    {
        return $this->hasMany(ExhibitOutlines::class, 'exhibit_id', 'exhibit_id');
    }
}
