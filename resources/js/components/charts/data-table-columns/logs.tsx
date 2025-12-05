'use client';

import { Button } from '@/components/ui/button';
import { ActivityLogs } from '@/types/dashboard';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpCircleIcon, ArrowUpDown, CircleFadingPlus, LucideUpload, Trash2Icon, User, UserCircle2Icon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<ActivityLogs>[] = [
    /* {
        accessorKey: "activity_log_id",
    }, */
    {
        accessorKey: 'full_name',
        header: () => <div className="ml-4 text-left text-gray-700 p-0">Name</div>,
        cell: ({ row }) => {
            return (

                <div className="flex items-left gap-3 ml-6">
                    {/* <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                            <User className="h-4 w-4" />
                        </div> */}
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                            {row.getValue("full_name")}
                        </span>

                    </div>
                </div>
            );
        },

        enableGlobalFilter: true,
    },
    {
        accessorKey: 'description',
        header: () => <div className="text-left text-gray-700">Description</div>,
        cell: ({ row }) => {
            /* const areaString = row.getValue('area') as String;
            const lowered = areaString.toLowerCase();
            const areaFormat = lowered.charAt(0).toUpperCase() + lowered.slice(1).toLowerCase(); */

            return (

                <div className="text-left w-sm truncate text-sm text-gray-500 capitalize ">
                    <TooltipProvider >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="cursor-default">
                                    {row.getValue("description")}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="start" >
                                <p>{row.getValue("description")}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

            );
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'activity',
        header: () => <div className="text-center text-gray-700">Activity</div>,
        cell: ({ row }) => {
            const status = row.getValue('activity') as string;
            let variantColor;
            let statusText = status;

            switch (status) {
                case 'Upload':
                    variantColor = 'bg-green-100 text-green-700 border-green-200';
                    break;
                case 'Revert':
                    variantColor = 'bg-yellow-100 text-yellow-700 border-yellow-200';
                    break;
                case 'Reject':
                    variantColor = 'bg-red-100 text-red-700 border-red-200';
                    break;
                default:
                    variantColor = 'bg-gray-100 text-gray-700 border-gray-200';
                    statusText = status;
            }

            return (
                <div className="text-center">
                    <Badge className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize hover:bg-gray-100 ${variantColor}`}>
                        {statusText}
                    </Badge>
                </div>
            );
        },
        enableGlobalFilter: true,
    },
    // {
    //     accessorKey: 'type',
    //     header: () => <div className="text-left text-gray-700">Type</div>,
    //     cell: ({ row }) => {
    //         return <div className="w-sm truncate text-left text-gray-900"> {row.getValue('type')} </div>;
    //     },
    //     enableGlobalFilter: true,
    // },
    {
        accessorKey: 'activity_date',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="min-w-1 text-left has-[>svg]:px-0 "
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
