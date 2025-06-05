"use client"

import { type ActivityLogs } from "@/types"
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

export const columns: ColumnDef<ActivityLogs>[] = [
    /* {
        accessorKey: "activity_log_id",
    }, */
    {
        accessorKey: "full_name",
        header: () => <div className="text-left">Name</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue("full_name")} </div>
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: "area",
        header: () => <div className="text-left">Area</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue("area")} </div>
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: "program",
        header: () => <div className="text-left">Program</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue("program")} </div>
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: "file_name",
        header: () => <div className="text-left">File</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue("file_name")} </div>
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: "activity",
        header: () => <div className="text-left">Activity</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue("activity")} </div>
        },
    },
    {
        accessorKey: "activity_date",
        header: () => <div className="text-left">Date</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue("activity_date")} </div>
        },
        enableGlobalFilter: true,
    },
];
