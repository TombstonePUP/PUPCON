<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AreaFiles extends Model
{
    /** @use HasFactory<\Database\Factories\AreaFilesFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'area_files';
    protected $primaryKey = 'area_file_id';
    protected $fillable = [
        'parameter_outline_id',
        'file_name',
        'file_path',
        'file_status_id',
        'file_rejection_reason',
    ];

    /**
     * @return BelongsTo<ParameterOutlines,AreaFiles>
     */
    public function ParameterOutlines(): BelongsTo
    {
        return $this->belongsTo(ParameterOutlines::class, 'parameter_outline_id', 'parameter_outline_id');
    }

    /**
     * @return BelongsTo<FileStatus,AreaFiles>
     */
    public function FileStatus(): BelongsTo
    {
        return $this->belongsTo(FileStatus::class, 'file_status_id', 'file_status_id');
    }
}
