'use client';

import { DataTablePagination } from '@/components/data-table-components/data-table-pagination';
import { DataTableToolbar } from '@/components/data-table-components/data-table-toolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FilesOverview } from '@/types';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { useState } from 'react';
import DocumentRequestActions from '../request-table-actions';

interface DialogProps {
    type: 'aprove' | 'reject' | 'revert' | null;
    file: FilesOverview | FilesOverview[];
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    resolveDialog?: ({ type, file }: DialogProps) => void;
}

function TableShell<TData, TValue>({
    table,
    columns,
    emptyMessage = 'No results.',
}: {
    table: ReturnType<typeof useReactTable<TData>>;
    columns: ColumnDef<TData, TValue>[];
    emptyMessage?: string;
}) {
    return (
        <div className="overflow-hidden rounded-lg border">
            <Table>
                <TableHeader className="bg-muted/50 sticky top-0 z-10">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="hover:bg-transparent">
                            {headerGroup.headers.map((header, index) => (
                                <TableHead
                                    key={header.id}
                                    className={`h-12 px-4 font-medium ${index === 0 ? 'pl-8' : ''} ${index === headerGroup.headers.length - 1 ? 'pr-8' : ''}`}
                                >
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                                className="hover:bg-muted/50 border-b transition-colors"
                            >
                                {row.getVisibleCells().map((cell, index) => (
                                    <TableCell
                                        key={cell.id}
                                        className={`px-4 py-3.5 ${cell.column.id === 'areas' ? 'mx-auto h-full' : ''} ${index === 0 ? 'pl-6' : ''} ${index === row.getVisibleCells().length - 1 ? 'pr-6' : ''}`}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length}>
                                <div className="text-muted-foreground h-16 flex items-center justify-center">
                                    {emptyMessage}
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        type: false,
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        globalFilterFn: 'includesString',
        state: { sorting, columnFilters, globalFilter, columnVisibility },
    });

    return (
        <div className="space-y-4">
            <DataTableToolbar
                table={table}
                searchPlaceholder="Search..."
                filters={[
                    {
                        columnId: 'type',
                        title: 'Type',
                        options: [
                            { label: 'Files', value: 'Files' },
                            { label: 'Users', value: 'Users' },
                            { label: 'Content', value: 'Content' },
                        ],
                    },
                ]}
            />
            <TableShell table={table} columns={columns} />
            <DataTablePagination table={table} />
        </div>
    );
}

export function UsersDataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        is_active: false,
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        globalFilterFn: 'includesString',
        state: { sorting, columnFilters, globalFilter, columnVisibility },
    });

    return (
        <div className="space-y-4">
            <DataTableToolbar
                table={table}
                searchPlaceholder="Search users..."
                filters={[
                    {
                        columnId: 'is_active',
                        title: 'Status',
                        options: [
                            { label: 'Active', value: 'true' },
                            { label: 'Inactive', value: 'false' },
                        ],
                    },
                ]}
            />
            <TableShell table={table} columns={columns} emptyMessage="No users." />
            <DataTablePagination table={table} />
        </div>
    );
}

export function DocumentRequestDataTable<TData, TValue>({ columns, data, resolveDialog }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        file_status: false,
    });

    const table = useReactTable({
        data,
        columns,
        onRowSelectionChange: setRowSelection,
        getRowId: (row, index) => `${row.file_id}-${index}`,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        globalFilterFn: 'includesString',
        state: { sorting, columnFilters, globalFilter, rowSelection, columnVisibility },
    });

    const selectedFiles = table.getSelectedRowModel().rows.map((row) => row.original) as FilesOverview[];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <DataTableToolbar
                    table={table}
                    searchPlaceholder="Search documents..."
                    filters={[
                        {
                            columnId: 'file_status',
                            title: 'Status',
                            options: [
                                { label: 'Pending', value: 'Pending' },
                                { label: 'Approved', value: 'Approved' },
                                { label: 'Rejected', value: 'Rejected' },
                            ],
                        },
                    ]}
                />
                {resolveDialog && <DocumentRequestActions file={selectedFiles} resolveDialog={resolveDialog} />}
            </div>
            <TableShell table={table} columns={columns} />
            <DataTablePagination table={table} />
        </div>
    );
}

export function ActivityLogDataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        type: false,
    });

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        globalFilterFn: 'includesString',
        state: { sorting, columnFilters, globalFilter, columnVisibility },
    });

    return (
        <div className="space-y-4">
            <DataTableToolbar
                table={table}
                searchPlaceholder="Search activity logs..."
                filters={[
                    {
                        columnId: 'type',
                        title: 'Type',
                        options: [
                            { label: 'Documents', value: 'Document' },
                            { label: 'Users', value: 'Users' },
                            { label: 'Content', value: 'Content' },
                        ],
                    },
                ]}
            />
            <TableShell table={table} columns={columns} />
            <DataTablePagination table={table} />
        </div>
    );
}