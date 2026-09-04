'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ActivityLogs } from '@/types/dashboard';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export const columns: ColumnDef<ActivityLogs>[] = [
    {
        accessorKey: 'type', // ← was 'log_type'
        header: () => null,
        cell: () => null,
        enableHiding: false,
        enableGlobalFilter: false,
        filterFn: (row, id, value: string[]) => {
            const rowValue = (row.getValue(id) as string)?.toLowerCase();
            return value.map((v) => v.toLowerCase()).includes(rowValue);
        },
    },
    {
        accessorKey: 'full_name',
        header: () => <div className="text-muted-foreground text-left">Name</div>,
        cell: ({ row }) => <span className="text-foreground font-medium">{row.getValue('full_name')}</span>,
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'description',
        header: () => <div className="text-muted-foreground text-left">Description</div>,
        cell: ({ row }) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="text-muted-foreground block cursor-default truncate text-sm capitalize">{row.getValue('description')}</span>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="start">
                        <p>{row.getValue('description')}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'activity',
        header: () => <div className="text-muted-foreground text-center">Activity</div>,
        cell: ({ row }) => {
            const status = row.getValue('activity') as string;

            const variantMap: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
                upload: 'success',
                approve: 'success',
                revert: 'warning',
                update: 'warning',
                reject: 'destructive',
            };

            const variant = variantMap[status?.toLowerCase()] ?? 'secondary';

            return (
                <div className="flex justify-center">
                    <Badge variant={variant} className="rounded-full px-3 py-0.5 capitalize">
                        {status}
                    </Badge>
                </div>
            );
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'activity_date',
        header: ({ column }) => (
            <Button
                className="text-muted-foreground hover:text-foreground bg-transparent p-0 text-left text-sm hover:bg-transparent"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Date
                <ArrowUpDown className="h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const raw = row.getValue('activity_date') as string;
            const date = raw ? new Date(raw).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
            }) : raw;
            return <span className="text-foreground text-sm">{date}</span>;
        },
        enableGlobalFilter: true,
    },
];
