'use client';

import { DataTableViewOptions } from '@/components/column-toggle';
import { DataTablePagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FilesOverview } from '@/types';
import React from 'react';
import DocumentRequestActions from '../request-table-actions';

interface DialogProps {
    type: 'aprove' | 'reject' | 'revert' | null;
    file: FilesOverview | FilesOverview[];
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    resolveDialog: ({ type, file }: DialogProps) => void;
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [tab, setTab] = React.useState<'Content' | 'Users' | 'Files'>('Files');

    const filteredData = React.useMemo(() => {
        if (tab === 'Content') {
            return data.filter((log) => log.type === 'Content');
        }
        if (tab === 'Users') {
            return data.filter((log) => log.type === 'Users');
        }
        if (tab === 'Files') {
            return data.filter((log) => log.type === 'Files');
        }
        return data;
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
        <Tabs defaultValue="Files" className="w-full space-y-4">
            <div className="flex items-center gap-3">
                <Input
                    placeholder="Search..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="h-8 max-w-sm"
                />
                <TabsList className="inline-flex h-8 rounded-md border border-gray-300 bg-white p-0.5">
                    <TabsTrigger
                        value="Files"
                        onClick={() => setTab('Files')}
                        className="h-full flex-1 rounded-md border-0 bg-transparent px-6 text-gray-300 transition-all duration-200 ease-out hover:text-gray-500 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=inactive]:cursor-pointer"
                    >
                        Files
                        <Badge className="ml-2 transition-colors duration-200" variant="secondary">
                            {data.filter((d) => d.type === 'Files').length}
                        </Badge>
                    </TabsTrigger>


                    <TabsTrigger
                        value="Users"
                        onClick={() => setTab('Users')}
                        className="h-full flex-1 rounded-md border-0 bg-transparent px-6 text-gray-300 transition-all duration-200 ease-out hover:text-gray-500 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=inactive]:cursor-pointer"
                    >
                        Users
                        <Badge className="ml-2 transition-colors duration-200" variant="secondary">
                            {data.filter((d) => d.type === 'Users').length}
                        </Badge>
                    </TabsTrigger>


                    <TabsTrigger
                        value="Content"
                        onClick={() => setTab('Content')}
                        className="h-full flex-1 rounded-md border-0 bg-transparent px-6 text-gray-300 transition-all duration-200 ease-out hover:text-gray-500 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=inactive]:cursor-pointer"
                    >
                        Content
                        <Badge className="ml-2 transition-colors duration-200" variant="secondary">
                            {data.filter((d) => d.type === 'Content').length}
                        </Badge>
                    </TabsTrigger>
                </TabsList>
                <div className="ml-auto">
                    <DataTableViewOptions table={table} />
                </div>
            </div>
            <TabsContent value={tab} className="data-[state=active]:animate-in data-[state=active]:fade-in-0 m-0">
                <div className="rounded-lg border">
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
                                        {row.getVisibleCells().map((cell, index) => {
                                            const isAreasColumn = cell.column.id === 'areas';
                                            const cellClasses = isAreasColumn ? 'mx-auto h-full' : '';
                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    className={`px-4 py-3.5 w-xs ${cellClasses} ${index === 0 ? 'pl-6' : ''} ${index === row.getVisibleCells().length - 1 ? 'pr-6' : ''}`}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-muted-foreground h-32 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-6">
                    <DataTablePagination table={table} />
                </div>
            </TabsContent>
        </Tabs>
    );
}

export function UsersDataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [tab, setTab] = React.useState<'active' | 'inactive'>('active');

    const filteredData = React.useMemo(() => {
        // @ts-ignore
        if (tab === 'active') {
            // @ts-ignore
            return data.filter((user) => user.is_active);
        }
        // @ts-ignore
        if (tab === 'inactive') {
            // @ts-ignore
            return data.filter((user) => !user.is_active);
        }
        return data;
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
        <Tabs defaultValue="active" className="w-full space-y-4">
            <div className="flex items-center gap-3">
                <Input
                    placeholder="Search..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="h-8 max-w-sm"
                />
                <TabsList className="inline-flex h-8 rounded-md border border-gray-300 bg-white p-0.5">
                    <TabsTrigger
                        value="active"
                        onClick={() => setTab('active')}
                        className="h-full flex-1 rounded-md border-0 bg-transparent px-6 text-gray-300 transition-all duration-200 ease-out hover:text-gray-500 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=inactive]:cursor-pointer"
                    >
                        Active
                        <Badge className="ml-2 transition-colors duration-200" variant="secondary">
                            {data.filter((d) => d.is_active).length}
                        </Badge>
                    </TabsTrigger>

                    <TabsTrigger
                        value="inactive"
                        onClick={() => setTab('inactive')}
                        className="h-full flex-1 rounded-md border-0 bg-transparent px-6 text-gray-300 transition-all duration-200 ease-out hover:text-gray-500 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=inactive]:cursor-pointer"
                    >
                        Inactive
                        <Badge className="ml-2 transition-colors duration-200" variant="secondary">
                            {data.filter((d) => !d.is_active).length}
                        </Badge>
                    </TabsTrigger>
                </TabsList>
                <div className="ml-auto">
                    <DataTableViewOptions table={table} />
                </div>
            </div>

            <TabsContent value={tab} className="data-[state=active]:animate-in data-[state=active]:fade-in-0 m-0">
                <div className="rounded-lg border">
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
                                        {row.getVisibleCells().map((cell, index) => {
                                            const isAreasColumn = cell.column.id === 'areas';
                                            const cellClasses = isAreasColumn ? 'mx-auto h-full' : '';
                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    className={`px-4 py-3.5 ${cellClasses} ${index === 0 ? 'pl-6' : ''} ${index === row.getVisibleCells().length - 1 ? 'pr-6' : ''}`}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-muted-foreground h-32 h-full text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-6">
                    <DataTablePagination table={table} />
                </div>
            </TabsContent>
        </Tabs>
    );
}

export function DocumentRequestDataTable<TData, TValue>({ columns, data, resolveDialog }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [tab, setTab] = React.useState<'pending' | 'approved' | 'rejected' | 'all'>('all');
    const [rowSelection, setRowSelection] = useState({});

    const filteredData = React.useMemo(() => {
        // @ts-ignore
        if (tab.toLowerCase() === 'all') {
            return data;
        }
        return data.filter((file) => file.file_status === tab.charAt(0).toUpperCase() + tab.slice(1));
    }, [data, tab]);

    const processedData = React.useMemo(
        () =>
            filteredData.map((item, index) => ({
                ...item,
                _uniqueId: `${item.file_id}-${index}`,
            })),
        [filteredData],
    );

    const table = useReactTable({
        data: filteredData,
        columns,
        onRowSelectionChange: setRowSelection,
        getRowId: (row) => row._uniqueId,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
            sorting,
            rowSelection,
        },
    });

    const selectedFiles = table.getSelectedRowModel().rows.map((row) => row.original) as FilesOverview[];

    return (
        <Tabs defaultValue="all" className="w-full space-y-4">
            <div className="flex items-center gap-3">
                <Input
                    placeholder="Search..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="h-8 max-w-sm"
                />
                <TabsList className="inline-flex h-8 rounded-md border border-gray-300 bg-white p-0.5">
                    <TabsTrigger
                        value="all"
                        onClick={() => setTab('all')}
                        className="h-full flex-1 border-0 bg-transparent px-6 text-gray-300 transition-all duration-200 ease-out hover:text-gray-500 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=inactive]:cursor-pointer"
                    >
                        All
                        <Badge className="ml-2 transition-colors duration-200" variant="secondary">
                            {data.length}
                        </Badge>
                    </TabsTrigger>

                    <TabsTrigger
                        value="pending"
                        onClick={() => setTab('pending')}
                        className="h-full flex-1 border-0 bg-transparent px-6 text-gray-300 transition-all duration-200 ease-out hover:text-gray-500 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=inactive]:cursor-pointer"
                    >
                        Pending
                        <Badge className="ml-2 transition-colors duration-200" variant="secondary">
                            {data.filter((d) => d.file_status === 'Pending').length}
                        </Badge>
                    </TabsTrigger>

                    <TabsTrigger
                        value="approved"
                        onClick={() => setTab('approved')}
                        className="h-full flex-1 border-0 bg-transparent px-6 text-gray-300 transition-all duration-200 ease-out hover:text-gray-500 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=inactive]:cursor-pointer"
                    >
                        Approved
                        <Badge className="ml-2 transition-colors duration-200" variant="secondary">
                            {data.filter((d) => d.file_status === 'Approved').length}
                        </Badge>
                    </TabsTrigger>

                    <TabsTrigger
                        value="rejected"
                        onClick={() => setTab('rejected')}
                        className="h-full flex-1 border-0 bg-transparent px-6 text-gray-300 transition-all duration-200 ease-out hover:text-gray-500 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=inactive]:cursor-pointer"
                    >
                        Rejected
                        <Badge className="ml-2 transition-colors duration-200" variant="secondary">
                            {data.filter((d) => d.file_status === 'Rejected').length}
                        </Badge>
                    </TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                    <DataTableViewOptions table={table} />
                    <DocumentRequestActions file={selectedFiles} resolveDialog={resolveDialog} />
                </div>
            </div>
            <TabsContent value={tab} className="data-[state=active]:animate-in data-[state=active]:fade-in-0 m-0">
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader className="bg-muted/50 sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                    {headerGroup.headers.map((header, index) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className={`h-12 px-4 font-medium ${index === 0 ? 'pl-8' : ''} ${index === headerGroup.headers.length - 1 ? 'pr-8' : ''}`}
                                            >
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
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                        className="hover:bg-muted/50 border-b transition-colors"
                                    >
                                        {row.getVisibleCells().map((cell, index) => (
                                            <TableCell
                                                key={cell.id}
                                                className={`px-4 py-3.5 ${index === 0 ? 'pl-8' : ''} ${index === row.getVisibleCells().length - 1 ? 'pr-8' : ''}`}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-muted-foreground h-32 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-6">
                    <DataTablePagination table={table} />
                </div>
            </TabsContent>
        </Tabs>
    );
}

export function ActivityLogDataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [tab, setTab] = React.useState<'document' | 'content'>('document');

    const filteredData = React.useMemo(() => {
        // @ts-ignore
        return data.filter((log) => log.log_type.toLowerCase() === tab.charAt(0).toUpperCase() + tab.slice(1).toLowerCase());
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
        <Tabs defaultValue="document" className="w-full space-y-4">
            <div className="flex items-center gap-3">
                <Input
                    placeholder="Search..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="h-8 max-w-sm"
                />
                <TabsList className="h-9 space-x-2 bg-transparent p-0">
                    <TabsTrigger
                        value="document"
                        onClick={() => setTab('document')}
                        className="border-input hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-muted data-[state=active]:text-accent-foreground h-9 items-center gap-2 rounded-md border bg-transparent px-4 text-sm font-medium transition-all"
                    >
                        Documents
                        <Badge className="ml-1 h-5 min-w-[20px] px-1.5 text-xs font-medium" variant="secondary">
                            {/* @ts-ignore */}
                            {data.filter((d) => d.log_type === 'Document').length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                        value="content"
                        onClick={() => setTab('content')}
                        className="border-input hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-muted data-[state=active]:text-accent-foreground h-9 items-center gap-2 rounded-md border bg-transparent px-4 text-sm font-medium transition-all"
                    >
                        Content
                        <Badge className="ml-1 h-5 min-w-[20px] px-1.5 text-xs font-medium" variant="secondary">
                            {data.filter((d) => d.log_type === 'Content').length}
                        </Badge>
                    </TabsTrigger>
                </TabsList>
                <div className="ml-auto">
                    <DataTableViewOptions table={table} />
                </div>
            </div>

            <TabsContent value={tab} className="data-[state=active]:animate-in data-[state=active]:fade-in-0 m-0">
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader className="bg-muted/50 sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="h-12 px-4 font-medium">
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
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="px-4 py-3.5">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="text-muted-foreground h-32 text-center">
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
