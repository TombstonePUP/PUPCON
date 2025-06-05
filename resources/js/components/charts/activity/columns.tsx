"use client"

import { type UserRecords } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { MoreVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns: ColumnDef<UserRecords>[] = [
    {
        accessorKey: "activity_log_id",
    },
    {
        accessorKey: "name",
        header: () => <div className="text-left">Name</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue("Name")} </div>
        },
    },
    {
        accessorKey: "last_name",
        header: () => <div className="text-left">Last Name</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue("last_name")} </div>
        },
    },
    {
        accessorKey: "email",
        header: () => <div className="text-left">Email</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue("email")} </div>
        },
    },
    {
        accessorKey: "role",
        header: () => <div className="text-left">Role</div>,
        cell: ({ row }) => {
            return <div className="text-left w-32">
                <Badge variant="outline" className="px-1.5 text-muted-foreground">
                    {row.getValue("role")}
                </Badge>
            </div>
        },
    },
    {
        accessorKey: "program_roles",
        header: () => <div className="text-left">Program/s</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue("program_roles")} </div>
        },
    },
    {
        accessorKey: "area_roles",
        header: () => <div className="text-left">Area/s</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue("area_roles")} </div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];
