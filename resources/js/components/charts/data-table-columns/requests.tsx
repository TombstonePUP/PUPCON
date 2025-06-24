'use client';

import { Button } from '@/components/ui/button';
import { type FilesOverview } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export const columns: ColumnDef<FilesOverview>[] = [
    {
        accessorKey: 'file_type',
        header: ({ column }) => {
            return (
                <Button className="text-left" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Type
                    <ArrowUpDown className="ml-2 h-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue('file_type')} </div>;
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'outline',
        header: ({ column }) => {
            return (
                <Button className="text-left" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Outline
                    <ArrowUpDown className="ml-2 h-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue('outline')} </div>;
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'file_status',
        header: () => <div className="text-left">Status</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue('file_status')} </div>;
        },
        enableGlobalFilter: false,
    },
    {
        accessorKey: 'rejection_reason',
        header: () => <div className="text-left">Comments</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue('rejection_reason')} </div>;
        },
        enableGlobalFilter: true,
    },
];
