<?php

namespace App\Policies;

use App\Models\Areas;
use App\Models\User;

class AreaPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if (in_array($user->Roles->role_name, ['Admin', 'Coordinator'])) {
            return true;
        }

        return null;
    }

    public function manage(User $user, Areas $area): bool
    {
        return $user->Roles->role_name == 'Chairman'
            && $user->Areas->contains('area_id', $area->area_id);
    }

    public function upload(User $user, Areas $area): bool
    {
        return $user->Roles->role_name == 'Chairman'
            && $user->Areas->contains('area_id', $area->area_id);
    }

    public function download(User $user, Areas $area): bool
    {
        return $user->Roles->role_name == 'Chairman'
            && $user->Areas->contains('area_id', $area->area_id);
    }

    public function delete(User $user, Areas $area): bool
    {
        return $user->Roles->role_name == 'Chairman'
            && $user->Areas->contains('area_id', $area->area_id);
    }
}
