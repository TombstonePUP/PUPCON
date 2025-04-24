<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FileStatus extends Model
{
    /** @use HasFactory<\Database\Factories\FileStatusFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'file_status';
    protected $primaryKey = 'file_status_id';
    protected $fillable = [
        'status_name',
    ];

    /**
     * @return HasMany<AreaFiles,FileStatus>
     */
    public function AreaFiles(): HasMany
    {
        return $this->hasMany(AreaFiles::class, 'file_status_id', 'file_status_id');
    }

    /**
     * @return HasMany<ExhibitFiles,FileStatus>
     */
    public function ExhibitFiles(): HasMany
    {
        return $this->hasMany(ExhibitFiles::class, 'file_status_id', 'file_status_id');
    }
}
