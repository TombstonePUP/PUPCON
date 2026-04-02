'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ActivityLogs } from '@/types/dashboard';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export const columns: ColumnDef<ActivityLogs>[] = [
  {
    accessorKey: 'type',        // ← was 'log_type'
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
    header: () => <div className="text-left text-muted-foreground">Name</div>,
    cell: ({ row }) => (
      <span className="font-medium text-foreground">
        {row.getValue('full_name')}
      </span>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: 'description',
    header: () => <div className="text-left text-muted-foreground">Description</div>,
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="block max-w-sm truncate cursor-default text-sm text-muted-foreground capitalize">
              {row.getValue('description')}
            </span>
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
    header: () => <div className="text-center text-muted-foreground">Activity</div>,
    cell: ({ row }) => {
      const status = row.getValue('activity') as string;

      const variantMap: Record<string, string> = {
        Upload: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
        Revert: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
        Reject: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
      };

      const variantColor = variantMap[status] ?? 'bg-muted text-muted-foreground border-border';

      return (
        <div className="flex justify-center">
          <Badge className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize border ${variantColor}`}>
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
        variant="ghost"
        className="px-0 text-muted-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Date
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = (row.getValue('activity_date') as string).replace(',', ', ');
      return <span className="text-sm text-foreground">{date}</span>;
    },
    enableGlobalFilter: true,
  },
];