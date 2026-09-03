<?php

namespace App\Models;

use Database\Factories\AreaFormsFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AreaForms extends Model
{
    /** @use HasFactory<AreaFormsFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    public $timestamps = false;

    protected $table = 'area_forms';

    protected $primaryKey = 'area_form_id';

    protected $fillable = [
        'area_id',
        'area_form_category_id',
        'form_image_name',
        'form_image_path',
        'file_name',
        'file_path',
        'file_status_id',
        'file_reject_reason',
        'uploaded_by',
        'uploaded_at',
    ];

    protected $casts = [
        'form_image_name' => 'encrypted',
        'form_image_path' => 'encrypted',
        'file_name' => 'encrypted',
        'file_path' => 'encrypted',
    ];

    /**
     * @return BelongsTo<Areas,AreaForms>
     */
    public function Area(): BelongsTo
    {
        return $this->belongsTo(Areas::class, 'area_id', 'area_id');
    }

    /**
     * @return BelongsTo<AreaFormCategory,AreaForms>
     */
    public function AreaFormCategory(): BelongsTo
    {
        return $this->belongsTo(AreaFormCategory::class, 'area_form_category_id', 'area_form_category_id');
    }

    /**
     * @return BelongsTo<FileStatus,AreaForms>
     */
    public function FileStatus(): BelongsTo
    {
        return $this->belongsTo(FileStatus::class, 'file_status_id', 'file_status_id');
    }

    /**
     * @return BelongsTo<User,AreaForms>
     */
    public function User(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by', 'user_id');
    }
}
