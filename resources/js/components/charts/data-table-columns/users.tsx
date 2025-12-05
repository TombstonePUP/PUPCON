'use client';

import { Badge } from '@/components/ui/badge';
import { UserTableActions } from '@/components/user-table-actions';
import { AssignablePrograms, AssignableRoles, type UserRecords } from '@/types/user-management';
import { ColumnDef } from '@tanstack/react-table';
import { Circle, User } from 'lucide-react';

interface DialogProps {
    type: 'add' | 'assign' | 'disable' | 'enable' | null;
    user: UserRecords;
}

interface UserRecordProps {
    programRoles: AssignablePrograms[];
    roles: AssignableRoles[];
    resolveDialog: ({ type, user }: DialogProps) => void;
}

export function getUserColumns({ programRoles, roles, resolveDialog }: UserRecordProps): ColumnDef<UserRecords>[] {
    return [
        {
            accessorKey: 'name',
            header: () => <div className="text-left font-medium">Name</div>,
            cell: ({ row }) => {
                const firstName = row.original.first_name;
                const lastName = row.original.last_name;
                const email = row.original.email;

                return (
                    <div className="flex items-center gap-3 py-1">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                            <User className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                                {firstName} {lastName}
                            </span>
                            <span className="text-sm text-gray-500">{email}</span>
                        </div>
                    </div>
                );
            },
            enableGlobalFilter: true,
        },
        {
            accessorFn: (row) => row.roles?.role_name,
            accessorKey: 'role_name',
            header: () => <div className="text-center font-medium">Role</div>,
            cell: ({ row }) => {
                const roleName = row.getValue('role_name') as string;

                return (
                    <div className="text-center">
                        {roleName ? (
                            <Badge
                                variant="secondary"
                                className="rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
                            >
                                {roleName}
                            </Badge>
                        ) : (
                            <span className="text-sm text-gray-400 italic">Unassigned</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'programs',
            header: () => <div className="text-center font-medium">Programs</div>,
            cell: ({ row }) => {
                const role = row.original.roles?.role_name || '';
                let programs =
                    row.original.areas?.map((p) => {
                        const regex = /\b[A-Z]/g;
                        const program = p.levels.programs?.program_name.match(regex)?.join('') || '';
                        const degree_type = p.levels.programs?.degree_type.match(regex)?.join('') || '';
                        return {
                            program_name: degree_type + program,
                            color: p.levels.programs?.color || 'gray',
                        };
                    }) || [];

                programs = programs.filter((program, index, self) => index === self.findIndex((p) => p.program_name === program.program_name));

                const isFullPrivilege = role === 'Coordinator' || role === 'Admin';

                return (
                    <div className="flex w-full flex-wrap items-center justify-center gap-1.5 text-center">
                        {programs.length > 0 ? (
                            programs.map((program) => (
                                <Badge
                                    key={program.program_name}
                                    variant="secondary"
                                    className={`rounded-md bg-gray-100 px-5 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-200 ${program.color}`}
                                    style={{
                                        // borderColor: program.color,
                                        // backgroundColor: `${program.color}/15`,
                                    }}
                                >
                                    <Circle className={`h-0.5 w-0.5 bg-${program.color}-500 rounded-full`} strokeWidth={0} />
                                    {program.program_name}
                                </Badge>
                            ))
                        ) : (
                            <span className="w-full text-center text-sm text-gray-400">{isFullPrivilege ? 'All Programs' : 'None'}</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'areas',
            header: () => <div className="text-center font-medium">Areas</div>,
            cell: ({ row }) => {
                const areas = row.original.areas || [];
                const role = row.original.roles?.role_name || '';
                const isFullPrivilege = role === 'Coordinator' || role === 'Admin';

                return (
                    <div className="flex w-full min-w-3xs flex-wrap justify-center gap-2">
                        {areas.length > 0 ? (
                            areas.map((area, idx) => (
                                <Badge
                                    key={idx}
                                    variant="outline"
                                    className="items-center bg-gray-100 rounded-md border-none px-5 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
                                >
                                    <Circle className={`h-0.5 w-0.5 bg-${area?.levels.programs.color}-500 rounded-full`} strokeWidth={0} />

                                    Area {area.area_number}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-sm text-gray-400">{isFullPrivilege ? 'All Areas' : 'None'}</span>
                        )}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: () => <div className="text-right font-medium">Actions</div>,
            cell: ({ row }) => (
                <div className="flex justify-end">
                    <UserTableActions user={row.original} resolveDialog={resolveDialog} />
                </div>
            ),
        },
    ];
}
