'use client';

import { DataTableViewOptions } from '@/components/column-toggle';
import { DataTablePagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

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
            {/* --- UPDATED: Consistent padding --- */}
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="h-8 max-w-sm"
                />
                <div className="ml-auto">
                    <DataTableViewOptions table={table} />
                </div>
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
        <Tabs defaultValue="active" className="w-full flex-col justify-start">
            {/* --- UPDATED: Consistent padding --- */}
            <div className="flex items-center gap-3 py-4">
                <Input
                    placeholder="Search..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="h-8 max-w-sm"
                />
                <TabsList className="inline-flex h-8 rounded-md border border-gray-300 bg-whitw p-0.2">
                    <TabsTrigger
                        value="active"
                        onClick={() => setTab('active')}
                        className="h-full flex-1 rounded-md rounded-r-none border-0 bg-transparent px-6 text-gray-300 transition-all duration-200 ease-out hover:text-gray-500 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=inactive]:cursor-pointer"
                    >
                        Active
                        <Badge className="ml-2 transition-colors duration-200" variant="secondary">
                            {data.filter((d) => d.is_active).length}
                        </Badge>
                    </TabsTrigger>

                    <TabsTrigger
                        value="inactive"
                        onClick={() => setTab('inactive')}
                        className="h-full flex-1 rounded-md border-0 bg-transparent px-6 text-gray-300 transition-all duration-200 ease-out hover:text-gray-500 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=inactive]:cursor-pointer rounded-l-none "
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

            <TabsContent value={tab} className="data-[state=active]:animate-in data-[state=active]:fade-in-0 duration-300">
                <div className="mb-4 rounded-md border">
                    <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
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

export function DocumentRequestDataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [tab, setTab] = React.useState<'pending' | 'approved' | 'rejected'>('pending');

    const filteredData = React.useMemo(() => {
        // @ts-ignore
        return data.filter((file) => file.file_status === tab.charAt(0).toUpperCase() + tab.slice(1));
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
        <Tabs defaultValue="pending" className="w-full flex-col justify-start">
            <div className="flex items-center gap-3 py-4">
                <Input
                    placeholder="Search..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="h-8 max-w-sm"
                />
                <TabsList className="inline-flex h-8 rounded-md border border-gray-300 bg-white p-0.2">
  <TabsTrigger
    value="pending"
    onClick={() => setTab('pending')}
    className="h-full flex-1 rounded-md rounded-r-none border-0 bg-transparent px-6 text-gray-300 transition-all duration-200 ease-out hover:text-gray-500 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=inactive]:cursor-pointer"
  >
    Pending
    <Badge className="ml-2 transition-colors duration-200" variant="secondary">
      {data.filter((d) => d.file_status === 'Pending').length}
    </Badge>
  </TabsTrigger>

  <TabsTrigger
    value="approved"
    onClick={() => setTab('approved')}
    className="h-full flex-1 rounded-none border-0 bg-transparent px-6 text-gray-300 transition-all duration-200 ease-out hover:text-gray-500 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=inactive]:cursor-pointer"
  >
    Approved
    <Badge className="ml-2 transition-colors duration-200" variant="secondary">
      {data.filter((d) => d.file_status === 'Approved').length}
    </Badge>
  </TabsTrigger>

  <TabsTrigger
    value="rejected"
    onClick={() => setTab('rejected')}
    className="h-full flex-1 rounded-md rounded-l-none border-0 bg-transparent px-6 text-gray-300 transition-all duration-200 ease-out hover:text-gray-500 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=inactive]:cursor-pointer"
  >
    Rejected
    <Badge className="ml-2 transition-colors duration-200" variant="secondary">
      {data.filter((d) => d.file_status === 'Rejected').length}
    </Badge>
  </TabsTrigger>
</TabsList>
                <div className="ml-auto">
                    <DataTableViewOptions table={table} />
                </div>
            </div>
            <TabsContent value={tab} className="data-[state=active]:animate-in data-[state=active]:fade-in-0 duration-300">
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
        <Tabs defaultValue="document" className="w-full flex-col justify-start gap-6">
            <div className="flex items-center gap-3 py-4">
                <Input
                    placeholder="Search..."
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="h-8 max-w-sm"
                />
                <TabsList className="space-x-2 bg-transparent p-0">
                    <TabsTrigger
                        value="document"
                        onClick={() => setTab('document')}
                        className="border-input hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-muted data-[state=active]:text-accent-foreground h-10 border bg-transparent px-4"
                    >
                        Documents
                        <Badge className="ml-2" variant="secondary">
                            {/* @ts-ignore */}
                            {data.filter((d) => d.log_type === 'Document').length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                        value="content"
                        onClick={() => setTab('content')}
                        className="border-input hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-muted data-[state=active]:text-accent-foreground h-10 border bg-transparent px-4"
                    >
                        Content
                        <Badge className="ml-2" variant="secondary">
                            {data.filter((d) => d.log_type === 'Content').length}
                        </Badge>
                    </TabsTrigger>
                </TabsList>
                <div className="ml-auto">
                    <DataTableViewOptions table={table} />
                </div>
            </div>

            <TabsContent value={tab} className="data-[state=active]:animate-in data-[state=active]:fade-in-0 duration-300">
                <div className="mb-4 rounded-md border">
                    <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
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
