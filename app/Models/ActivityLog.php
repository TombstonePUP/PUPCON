<?php

namespace App\Models;

use App\Enums\ActivityLogAction;
use App\Enums\ActivityLogType;
use Database\Factories\ActivityLogFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    /** @use HasFactory<ActivityLogFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $table = 'activity_log';

    protected $primaryKey = 'activity_log_id';

    protected $fillable = [
        'user_id',
        'description',
        'activity',
        'type',
        'activity_date',
    ];

    protected $casts = [
        'activity' => ActivityLogAction::class,
        'type' => ActivityLogType::class,
        'activity_date' => 'datetime',
    ];

    /**
     * @return BelongsTo<User,ActivityLog>
     */
    public function Users(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
