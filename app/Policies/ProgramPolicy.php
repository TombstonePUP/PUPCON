<?php

namespace App\Policies;

use App\Models\Programs;
use App\Models\User;

class ProgramPolicy
{
    public function before(User $user, string $_ability): ?bool
    {
        if (in_array($user->Roles->role_name, ['admin', 'coordinator'])) {
            return true;
        }

        return null;
    }

    public function manage(User $user, Programs $program): bool
    {
        return $user->Roles->role_name == 'Chairman'
            && $user->Areas->contains('program_id', $program->program_id);
    }

    public function upload(User $user, Programs $program): bool
    {
        return $user->Roles->role_name == 'Chairman'
            && $user->Areas->contains('program_id', $program->program_id);
    }

    public function download(User $user, Programs $program): bool
    {
        return $user->Roles->role_name == 'Chairman'
            && $user->Areas->contains('program_id', $program->program_id);
    }

    public function delete(User $user, Programs $program): bool
    {
        return $user->Roles->role_name == 'Chairman'
            && $user->Areas->contains('program_id', $program->program_id);
    }
}
