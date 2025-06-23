'use client';

import { Button } from '@/components/ui/button';
import { type ActivityLogs } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export const columns: ColumnDef<ActivityLogs>[] = [
    /* {
        accessorKey: "activity_log_id",
    }, */
    {
        accessorKey: 'full_name',
        header: () => <div className="text-left">Name</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue('full_name')} </div>;
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'area',
        header: () => <div className="text-left">Area</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue('area')} </div>;
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'program',
        header: () => <div className="text-left">Program</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue('program')} </div>;
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'file_name',
        header: () => <div className="text-left">File</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue('file_name')} </div>;
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'activity_date',
        header: ({ column }) => {
            return (
                <Button className="text-left w-[10px]" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Date
                    <ArrowUpDown className="ml-2 h-4" />
                </Button>
            );
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'activity_status',
        header: ({ column }) => {
            return (
                <Button className="text-left w-[10px]" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Status
                    <ArrowUpDown className="ml-2 h-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue('activity_status')} </div>;
        },
        enableGlobalFilter: true,
    },
];
