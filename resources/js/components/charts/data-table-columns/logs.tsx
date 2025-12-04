'use client';

import { Button } from '@/components/ui/button';
import { ActivityLogs } from '@/types/dashboard';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpCircleIcon, ArrowUpDown, CircleFadingPlus, LucideUpload, Trash2Icon } from 'lucide-react';

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
        accessorKey: 'description',
        header: () => <div className="text-left">Description</div>,
        cell: ({ row }) => {
            /* const areaString = row.getValue('area') as String;
            const lowered = areaString.toLowerCase();
            const areaFormat = lowered.charAt(0).toUpperCase() + lowered.slice(1).toLowerCase(); */

            return <div className="text-left"> {row.getValue('description')} </div>;
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'activity',
        header: () => <div className="text-left">Activity</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue('activity')} </div>;
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'type',
        header: () => <div className="text-left">Type</div>,
        cell: ({ row }) => {
            return <div className="w-sm truncate text-left text-gray-900"> {row.getValue('type')} </div>;
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'activity_date',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="min-w-1 text-left has-[>svg]:px-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Date
                    <ArrowUpDown className="h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = (row.getValue('activity_date') as string).replace(',', ', ');
            return <div className="text-left">{date}</div>;
        },
        enableGlobalFilter: true,
    },
];
