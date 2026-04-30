import { DataTableFacetedFilter } from '@/components/admin/data-table-components/data-table-faceted-filter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type Table } from '@tanstack/react-table';
import { Settings2, X } from 'lucide-react';
import React from 'react';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type DataTableToolbarProps<TData> = {
    table: Table<TData>;
    searchPlaceholder?: string;
    searchKey?: string;
    filters?: {
        columnId: string;
        title: string;
        options: {
            label: string;
            value: string;
            icon?: React.ComponentType<{ className?: string | undefined }>; // ← add | undefined
        }[];
    }[];
};

export function DataTableToolbar<TData>({ table, searchPlaceholder = 'Filter...', searchKey, filters = [] }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0 || table.getState().globalFilter;

    return (
        <div className="mb-2 flex w-full items-center justify-between gap-2">
            <div className="flex gap-y-2 py-2 sm:flex-row sm:items-center sm:space-x-2">
                {searchKey ? (
                    <Input
                        placeholder={searchPlaceholder}
                        value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
                        onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
                        className="bg-card h-8 w-[150px] text-xs lg:w-[250px]"
                    />
                ) : (
                    <Input
                        placeholder={searchPlaceholder}
                        value={table.getState().globalFilter ?? ''}
                        onChange={(event) => table.setGlobalFilter(event.target.value)}
                        className="bg-card h-8 w-[150px] text-xs lg:w-[250px]"
                    />
                )}
            </div>
            <div className="flex gap-2">
                <div className="flex gap-x-2">
                    {filters.map((filter) => {
                        const column = table.getColumn(filter.columnId);
                        if (!column) return null;
                        return <DataTableFacetedFilter key={filter.columnId} column={column} title={filter.title} options={filter.options} />;
                    })}
                </div>
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            table.resetColumnFilters();
                            table.setGlobalFilter('');
                        }}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ms-2 h-4 w-4" />
                    </Button>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="bg-card hidden h-8 lg:flex">
                            <Settings2 />
                            View
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[150px]">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {table
                            .getAllColumns()
                            .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
