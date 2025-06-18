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
        accessorKey: 'activity',
        header: () => <div className="text-left">Activity</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue('activity')} </div>;
        },
    },
    {
        accessorKey: 'activity_date',
        header: ({ column }) => {
            return (
                <Button variant="ghost" className='text-left has-[>svg]:px-0 min-w-1' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Date
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue('activity_date')} </div>;
        },
        enableGlobalFilter: true,
    },
];
