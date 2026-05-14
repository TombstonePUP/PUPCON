<?php

namespace App\Services;

use App\Enums\ActivityLogAction;
use App\Enums\ActivityLogType;
use App\Models\ActivityLog;

class ActivityLogService
{
    private static function log(
        ActivityLogAction $activity,
        ActivityLogType $type,
        string $description,
        ?int $userId = null,
    ): void {
        ActivityLog::create([
            'user_id' => $userId,
            'activity' => $activity,
            'description' => $description,
            'type' => $type,
            'activity_date' => now(),
        ]);
    }

    public static function authenticationLog(
        ActivityLogAction $activity,
        string $description,
        ?int $userId = null
    ): void {
        static::log(
            $activity,
            ActivityLogType::Authentication,
            $description,
            $userId
        );
    }

    public static function fileManagementLog(
        ActivityLogAction $activity,
        string $description,
        ?int $userId = null
    ): void {
        static::log(
            $activity,
            ActivityLogType::FileManagement,
            $description,
            $userId
        );
    }

    public static function contentManagementLog(
        ActivityLogAction $activity,
        string $description,
        ?int $userId = null
    ): void {
        static::log(
            $activity,
            ActivityLogType::ContentManagement,
            $description,
            $userId
        );
    }

    public static function userManagementLog(
        ActivityLogAction $activity,
        string $description,
        ?int $userId = null
    ): void {
        static::log(
            $activity,
            ActivityLogType::UserManagement,
            $description,
            $userId
        );
    }
}
