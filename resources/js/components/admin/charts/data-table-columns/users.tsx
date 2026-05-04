'use client';

import { Badge } from '@/components/ui/badge';
import { UserTableActions } from '@/components/admin/user-table-actions';
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
            accessorFn: (row) => `${row.first_name} ${row.last_name} ${row.email}`,
            header: () => <div className="text-muted-foreground text-left font-medium">Name</div>,
            cell: ({ row }) => {
                const firstName = row.original.first_name;
                const lastName = row.original.last_name;
                const email = row.original.email;

                return (
                    <div className="flex items-center gap-3 py-1">
                        <div className="bg-muted text-muted-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                            <User className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-foreground font-medium">
                                {firstName} {lastName}
                            </span>
                            <span className="text-muted-foreground text-sm">{email}</span>
                        </div>
                    </div>
                );
            },
            enableGlobalFilter: true,
        },
        {
            accessorFn: (row) => row.roles?.role_name ?? '',
            accessorKey: 'role_name',
            header: () => <div className="text-muted-foreground font-medium">Role</div>,
            filterFn: (row, id, value: string[]) => {
                return value.includes(row.getValue(id) as string);
            },
            cell: ({ row }) => {
                const roleName = row.getValue('role_name') as string;
                return roleName ? (
                    <Badge variant="secondary" className="rounded-md text-xs font-medium">
                        {roleName}
                    </Badge>
                ) : (
                    <span className="text-muted-foreground text-sm italic">Unassigned</span>
                );
            },
        },
        {
            accessorFn: (row) => row.areas?.map((a) => a.levels.programs?.program_name).filter(Boolean) ?? [],
            accessorKey: 'programs',
            enableGlobalFilter: true,
            header: () => <div className="text-muted-foreground font-medium">Programs</div>,
            filterFn: (row, id, value: string[]) => {
                const programs = row.getValue(id) as string[];
                return value.some((v) => programs.includes(v));
            },
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
                    <div className="flex w-full flex-wrap gap-1.5">
                        {programs.length > 0 ? (
                            programs.map((program) => (
                                <Badge key={program.program_name} variant="secondary" className="gap-1.5 rounded-md text-xs font-medium">
                                    <Circle className="h-2 w-2 fill-current" />
                                    {program.program_name}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground text-sm">{isFullPrivilege ? 'All Programs' : 'None'}</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'areas',
            enableGlobalFilter: true,
            accessorFn: (row) => row.areas?.map((a) => `Area ${a.area_number}`).join(' ') ?? '',
            header: () => <div className="text-muted-foreground text-center font-medium">Areas</div>,
            cell: ({ row }) => {
                const areas = row.original.areas || [];
                const role = row.original.roles?.role_name || '';
                const isFullPrivilege = role === 'Coordinator' || role === 'Admin';

                return (
                    <div className="flex w-full min-w-3xs flex-wrap justify-center gap-2">
                        {areas.length > 0 ? (
                            areas.map((area, idx) => (
                                <Badge key={idx} variant="outline" className="gap-1.5 rounded-md text-xs font-medium">
                                    <Circle className="h-2 w-2 fill-current" />
                                    Area {area.area_number}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground text-sm">{isFullPrivilege ? 'All Areas' : 'None'}</span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: 'is_active',
            header: () => null,
            cell: () => null,
            enableHiding: true,
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex justify-end">
                    <UserTableActions user={row.original} resolveDialog={resolveDialog} />
                </div>
            ),
        },
    ];
}

export function getUserFilterOptions(roles: AssignableRoles[], programRoles: AssignablePrograms[]) {
    return {
        roleOptions: roles.map((r) => ({ label: r.role_name, value: r.role_name })),
        programOptions: programRoles.map((p) => ({ label: p.program_name, value: p.program_name })),
    };
}
