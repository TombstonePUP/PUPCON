"use client"

import { AddUser } from "./add-user";
import { AssignRole } from "./assign-role";
import { DisableUser } from "./disable-user";
import { EnableUser } from "./enable-user";
import { AssignablePrograms, AssignableRoles, UserRecords } from "@/types/user-management";


interface UserDialogProps {
    type: "add" | "assign" | "disable" | "enable" | null
    user?: UserRecords;
    program?: AssignablePrograms[];
    roles?: AssignableRoles[];
    onClose: () => void;
}

export function RenderUserDialog({ type, user, program, roles, onClose }: UserDialogProps) {
    switch(type) {
        case 'add':
            return (
                <AddUser
                    programRoles={program}
                    roles={roles}
                    onClose={onClose}
                />
            );
        case 'assign':
            return (
                <AssignRole
                    user={user}
                    programRoles={program}
                    roles={roles}
                    onClose={onClose}
                />
            );
        case 'disable':
            return (
                <DisableUser
                    user={user}
                    onClose={onClose}
                />
            );
        case 'enable':
            return (
                <EnableUser
                    user={user}
                    onClose={onClose}
                />
            );
        case null:
            break;
        default:
            return null;
    }
}

