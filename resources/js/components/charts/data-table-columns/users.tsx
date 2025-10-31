"use client"

import { AssignablePrograms, AssignableRoles, type UserRecords } from "@/types/user-management"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Circle } from "lucide-react"
import { UserTableActions } from "@/components/user-table-actions"

// Don't Remove this shit, it bugs out when it is removed
const programColors: Record<string, string> = {
    "Communication": "border-red-500",
    "Information Technology": "border-blue-500",
    "Business": "border-yellow-500",
    "Engineering": "border-green-500",
};

interface DialogProps {
    type: 'add' | 'assign' | 'disable' | 'enable' | null;
    user: UserRecords;
}

interface UserRecordProps {
    programRoles: AssignablePrograms[];
    roles: AssignableRoles[];
    resolveDialog: ({type, user}: DialogProps) => void;
}

// export const columns: ColumnDef<UserRecords>[] = [
export function getUserColumns({programRoles, roles, resolveDialog}: UserRecordProps): ColumnDef<UserRecords>[] {
    return [
        {
            accessorKey: "first_name",
            header: () => <div className="text-left">First Name</div>,
            cell: ({ row }) => {
                return <div className="text-left"> {row.getValue("first_name")} </div>
            },
            enableGlobalFilter: true,
        },
        {
            accessorKey: "last_name",
            header: () => <div className="text-left">Last Name</div>,
            cell: ({ row }) => {
                return <div className="text-left"> {row.getValue("last_name")} </div>
            },
            enableGlobalFilter: true,
        },
        {
            accessorKey: "email",
            header: () => <div className="text-left">Email</div>,
            cell: ({ row }) => {
                return <div className="text-left"> {row.getValue("email")} </div>
            },
            enableGlobalFilter: true,
        },
        {
            accessorFn: (row) => row.roles?.role_name,
            accessorKey: "role_name",
            header: () => <div className="text-left">Role</div>,
            cell: ({ row }) => {
                return <div className="text-left w-32">
                    {row.getValue("role_name") ?
                        <Badge variant="outline" className="px-1.5 text-muted-foreground">
                            {row.getValue("role_name")}
                        </Badge>
                        : <span className="text-xs text-gray-500 italic">No Role Assigned</span>
                    }
                </div>
            },
        },
        {
            accessorKey: "programs",
            header: () => <div className="text-left">Program/s</div>,
            cell: ({ row }) => {
                const role = row.original.roles?.role_name || '';
                let programs = row.original.areas?.map(p => {
                    const regex = /\b[A-Z]/g;
                    const program = p.levels.programs?.program_name.match(regex).join('');
                    const degree_type = p.levels.programs?.degree_type.match(regex).join('');
                    return {
                        program_name: degree_type + program,
                        color: p.levels.programs?.color || "gray",
                    };
                }) || [];

                programs = programs.filter(
                    (program, index, self) =>
                        index === self.findIndex(p => p.program_name === program.program_name)
                );

                return (
                    <div className="flex flex-wrap gap-1 text-left">
                        {programs.length > 0 ? programs.map((program) => (
                            <Badge
                                key={program.program_name}
                                variant="outline"
                                className={`px-1.5 text-muted-foreground border-${program.color}-500`}
                            >
                                <Circle fill={`${program.color}`} strokeWidth={0}/>
                                {program.program_name}
                            </Badge>
                        )):
                            <span className="text-xs text-gray-500 italic">
                                {role === "Coordinator" || role === "Admin" ?
                                    "Full Privileges"
                                    : "No Programs Assigned" }
                            </span>
                        }
                    </div>
                );
            },
        },
        {
            accessorKey: "areas",
            header: () => <div className="text-left">Area/s</div>,
            cell: ({ row }) => {
                // const areas: string[] = row.getValue("area_name")?.replace(/[{}"]/g, "").split("} {").flatMap(a => a.split(",")).map(a => a.trim()) || [];
                const areas = row.original.areas || [];
                const role = row.original.roles?.role_name || '';

                return (
                    <div className="flex flex-wrap gap-1 text-left">
                        {areas.length > 0 ? areas.map((area, idx) => (
                            <Badge
                                key={idx}
                                variant="outline"
                                className={`1px-1.5 text-muted-foreground border-${area?.levels.programs.color}-500`}
                            >
                                Area {area.area_number}
                            </Badge>
                        )) : <span className="text-xs text-gray-500 italic">
                                {role === "Coordinator" || role === "Admin" ?
                                    "Full Privileges"
                                    : "No Areas Assigned" }
                            </span>}
                    </div>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) =>
                <UserTableActions
                    user={row.original}
                    resolveDialog={resolveDialog}
                />
        },
    ]
}
