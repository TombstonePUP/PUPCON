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
        'exhibit_outline_id',
        'file_name',
        'file_path',
        'uploaded_by',
        'uploaded_at',
        'file_status_id',
        'file_rejection_reason',
    ];

    protected $casts = [
        'file_name' => 'encrypted',
        'file_path' => 'encrypted',
    ];

    /**
     * @return BelongsTo<ExhibitOutlines,ExhibitFiles>
     */
    public function ExhibitOutlines(): BelongsTo
    {
        return $this->belongsTo(ExhibitOutlines::class, 'exhibit_outline_id', 'exhibit_outline_id');
    }

    /**
     * @return BelongsTo<FileStatus,ExhibitFiles>
     */
    public function FileStatus(): BelongsTo
    {
        return $this->belongsTo(FileStatus::class, 'file_status_id', 'file_status_id');
    }

    /**
     * @return BelongsTo<User,ExhibitFiles>
     */
    public function User(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by', 'user_id');
    }
}
