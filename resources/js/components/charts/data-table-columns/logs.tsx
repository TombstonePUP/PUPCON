'use client';

import { Button } from '@/components/ui/button';
import { type ActivityLogs } from '@/types';
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
        accessorKey: 'area',
        header: () => <div className="text-left">Area</div>,
        cell: ({ row }) => {
            const areaString = row.getValue('area') as String;
            const lowered = areaString.toLowerCase();
            const areaFormat = lowered.charAt(0).toUpperCase() + lowered.slice(1).toLowerCase();

            return <div className="text-left"> {areaFormat} </div>;
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
            return <div className="w-sm truncate text-left text-gray-900"> {row.getValue('file_name')} </div>;
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'activity',
        header: () => <div className="text-left">Activity</div>,
        cell: ({ row }) => {
            const activityString = row.getValue('activity');

            const ActivityIconMap = {
                'Upload Document': ArrowUpCircleIcon,
                'Delete Document': Trash2Icon,
                'Update Document': CircleFadingPlus,
            };

            const IconComponent = ActivityIconMap[activityString] || LucideUpload;

            return (
                <div className="flex items-center gap-2 text-left">
                    <IconComponent className="h-5 w-5" />
                    {activityString}
                </div>
            );
        },
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
