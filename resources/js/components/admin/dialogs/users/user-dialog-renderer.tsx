'use client';

import { AssignablePrograms, AssignableRoles, UserRecords } from '@/types/user-management';
import { AddUser } from './add-user';
import { AssignRole } from './assign-role';
import { DisableUser } from './disable-user';
import { EnableUser } from './enable-user';

interface UserDialogProps {
    type: 'add' | 'assign' | 'disable' | 'enable' | null;
    user?: UserRecords;
    program?: AssignablePrograms[];
    roles?: AssignableRoles[];
    onClose: () => void;
}

export function RenderUserDialog({ type, user, program, roles, onClose }: UserDialogProps) {
    switch (type) {
        case 'add':
            return <AddUser programRoles={program ?? []} roles={roles ?? []} onClose={onClose} />;
        case 'assign':
            return user ? <AssignRole user={user} programRoles={program ?? []} roles={roles ?? []} onClose={onClose} /> : null;

        case 'disable':
            return user ? <DisableUser user={user} onClose={onClose} /> : null;

        case 'enable':
            return user ? <EnableUser user={user} onClose={onClose} /> : null;
        case null:
            break;
        default:
            return null;
    }
}
