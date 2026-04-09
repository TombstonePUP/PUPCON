<?php

namespace App\Traits;

use App\Models\FileStatus;
use App\Models\User;

trait ResolveFileStatus
{
    protected function resolveFileStatus(User $user): int
    {
        $statusName = in_array($user->Roles->role_name, ['Admin', 'Coordinator'])
            ? 'Approved'
            : 'Pending';

        return FileStatus::where('status_name', $statusName)
            ->value('file_status_id');
    }
}
