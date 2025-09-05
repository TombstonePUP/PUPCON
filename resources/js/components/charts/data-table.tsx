'use client';

import { DataTableViewOptions } from '@/components/column-toggle';
import { DataTablePagination } from '@/components/pagination';
import { Input } from '@/components/ui/input';
import { Badge } from "@/components/ui/badge"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        // globalFilterFn,
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
            sorting,
        },
    });

    return (
        <div>
            <div className="flex items-center py-4 pb-6">
                <Input placeholder="Search..." value={globalFilter ?? ''} onChange={(e) => setGlobalFilter(e.target.value)} className="max-w-sm" />
                <DataTableViewOptions table={table} />
            </div>
            <div className="mb-4 rounded-md border">
                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}

export function DocumentRequestDataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [tab, setTab] = React.useState<'pending' | 'approved' | 'rejected'>('pending');

    const filteredData = React.useMemo(() => {
        return data.filter(file => file.file_status === tab.charAt(0).toUpperCase() + tab.slice(1));
    }, [data, tab]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
            sorting,
        },
    });

    return (
        <Tabs
            defaultValue="pending"
            className="w-full flex-col justify-start"
        >
            <div className="flex items-center py-4 gap-3">
                <Input placeholder="Search..." value={globalFilter ?? ''} onChange={(e) => setGlobalFilter(e.target.value)} className="max-w-sm" />
                <TabsList>
                    <TabsTrigger value="pending" onClick={() => setTab('pending')}>
                        Pending <Badge variant="secondary">{data.filter(d => d.file_status === 'Pending').length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="approved" onClick={() => setTab('approved')}>
                        Approved <Badge variant="secondary">{data.filter(d => d.file_status === 'Approved').length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="rejected" onClick={() => setTab('rejected')}>
                        Rejected <Badge variant="secondary">{data.filter(d => d.file_status === 'Rejected').length}</Badge>
                    </TabsTrigger>
                </TabsList>
                <DataTableViewOptions table={table} />
            </div>
            <TabsContent
                value={tab}
            // className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
            >
                <div className="mb-4 rounded-md border">
                    <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <DataTablePagination table={table} />
            </TabsContent>
        </Tabs>
    );
}

export function ActivityLogDataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [tab, setTab] = React.useState<'document' | 'content'>('document');

    const filteredData = React.useMemo(() => {
        return data.filter(
            (log) =>
                log.log_type.toLowerCase() ===
                tab.charAt(0).toUpperCase() + tab.slice(1).toLowerCase()
        );
    }, [data, tab]);

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
            sorting,
        },
    });

    return (
        <Tabs defaultValue="document" className="w-full flex-col justify-start gap-6">
            <div className="flex items-center py-4 gap-3">
                <Input
                    placeholder="Search..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                />
                <TabsList>
                    <TabsTrigger value="document" onClick={() => setTab('document')}>
                        Documents{' '}
                        <Badge variant="secondary">
                            {data.filter((d) => d.log_type === 'Document').length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="content" onClick={() => setTab('content')}>
                        Content{' '}
                        <Badge variant="secondary">
                            {data.filter((d) => d.log_type === 'Content').length}
                        </Badge>
                    </TabsTrigger>
                </TabsList>
                <DataTableViewOptions table={table} />
            </div>

            <TabsContent value={tab}>
                <div className="mb-4 rounded-md border">
                    <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
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
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <DataTablePagination table={table} />
            </TabsContent>
        </Tabs>
    );
}
