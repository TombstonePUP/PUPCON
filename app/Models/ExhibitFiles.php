<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExhibitFiles extends Model
{
    /** @use HasFactory<\Database\Factories\ExhibitFilesFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;
    protected $table = 'exhibit_files';
    protected $primaryKey = 'exhibit_file_id';
    protected $fillable = [
        'exhibit_id',
        'file_name',
        'file_path',
        'file_status_id',
        'file_reject_reason',
    ];

    /**
     * @return BelongsTo<Exhibits,ExhibitFiles>
     */
    public function Exhibits(): BelongsTo
    {
        return $this->belongsTo(Exhibits::class, 'exhibit_id', 'exhibit_id');
    }

    /**
     * @return BelongsTo<FileStatus,ExhibitFiles>
     */
    public function FileStatus(): BelongsTo
    {
        return $this->belongsTo(FileStatus::class, 'file_status_id', 'file_status_id');
    }
}
