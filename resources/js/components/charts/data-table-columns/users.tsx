"use client"

import { AssignablePrograms, AssignableRoles, type UserRecords } from "@/types/user-management"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Circle, User } from "lucide-react"
import { UserTableActions } from "@/components/user-table-actions"

interface DialogProps {
    type: 'add' | 'assign' | 'disable' | 'enable' | null;
    user: UserRecords;
}

interface UserRecordProps {
    programRoles: AssignablePrograms[];
    roles: AssignableRoles[];
    resolveDialog: ({type, user}: DialogProps) => void;
}

export function getUserColumns({programRoles, roles, resolveDialog}: UserRecordProps): ColumnDef<UserRecords>[] {
    return [
        {
            accessorKey: "name",
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
                            <span className="text-xs text-gray-500">{email}</span>
                        </div>
                    </div>
                );
            },
            enableGlobalFilter: true,
        },
        {
            accessorFn: (row) => row.roles?.role_name,
            accessorKey: "role_name",
            header: () => <div className="text-left font-medium">Role</div>,
            cell: ({ row }) => {
                const roleName = row.getValue("role_name") as string;
                
                return (
                    <div className="text-left">
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
            accessorKey: "programs",
            header: () => <div className="text-left font-medium">Programs</div>,
            cell: ({ row }) => {
                const role = row.original.roles?.role_name || '';
                let programs = row.original.areas?.map(p => {
                    const regex = /\b[A-Z]/g;
                    const program = p.levels.programs?.program_name.match(regex)?.join('') || '';
                    const degree_type = p.levels.programs?.degree_type.match(regex)?.join('') || '';
                    return {
                        program_name: degree_type + program,
                        color: p.levels.programs?.color || "gray",
                    };
                }) || [];

                programs = programs.filter(
                    (program, index, self) =>
                        index === self.findIndex(p => p.program_name === program.program_name)
                );

                const isFullPrivilege = role === "Coordinator" || role === "Admin";

                return (
                    <div className="flex flex-wrap gap-1.5 text-left ">
                        {programs.length > 0 ? (
                            programs.map((program) => (
                                <Badge
                                    key={program.program_name}
                                    variant="secondary"
                                    className="rounded-md bg-gray-100 px-5 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
                                    style={{ 
                                        borderColor: program.color,
                                        backgroundColor: `${program.color}15`
                                    }}
                                >
                                    <Circle 
                                        className="h-0.5 w-0.5" 
                                        fill={program.color} 
                                        strokeWidth={0}
                                    />
                                    {program.program_name}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-sm text-gray-400 italic">
                                {isFullPrivilege ? "All Programs" : "None"}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "areas",
            header: () => <div className="text-left font-medium">Areas</div>,
            cell: ({ row }) => {
                const areas = row.original.areas || [];
                const role = row.original.roles?.role_name || '';
                const isFullPrivilege = role === "Coordinator" || role === "Admin";

                return (
                    <div className="flex flex-wrap gap-1.5 text-left">
                        {areas.length > 0 ? (
                            areas.map((area, idx) => (
                                <Badge
                                    key={idx}
                                    variant="outline"
                                    className="rounded-md bg-gray-100 px-5 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-200 border-none"
                                    style={{ 
                                        backgroundColor: `${area?.levels.programs.color}15`
                                    }}
                                >
                                    Area {area.area_number}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-sm text-gray-400 italic">
                                {isFullPrivilege ? "All Areas" : "None"}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: () => <div className="text-right font-medium">Actions</div>,
            cell: ({ row }) => (
                <div className="flex justify-end">
                    <UserTableActions
                        user={row.original}
                        resolveDialog={resolveDialog}
                    />
                </div>
            ),
        },
    ];
}