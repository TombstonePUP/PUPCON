import { DocumentViewer } from '@/components/dialogs/documents/view-document';
import DocumentRequestActions from '@/components/request-table-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/text-area';
import { type FilesOverview } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MessageSquareOff, MessageSquareText } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

interface DialogProps {
    type: 'aprove' | 'reject' | 'revert' | null;
    file: FilesOverview[];
}

interface DocumentRecordProps {
    resolveDialog: ({ type, file }: DialogProps) => void;
}

export function getRequestsColumns({ resolveDialog }: DocumentRecordProps): ColumnDef<FilesOverview>[] {
    return [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'file_type',
            header: ({ column }) => (
                <div className="flex items-center">
                    <div className="text-gray-700"> Benchmark Type</div>
                    <Button className="ml-2 text-left" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        <ArrowUpDown className="h-4" />
                    </Button>
                </div>
            ),
            cell: ({ row }) => {
                const filePath = row.original.file_path;
                const pathSegments = filePath.split('/').filter(Boolean);
                let rawSegment = '';

                if (filePath.includes('/files/')) {
                    const fileNameWithExt = pathSegments[pathSegments.length - 1];
                    rawSegment = fileNameWithExt.split('.').slice(0, -1).join('.');
                } else {
                    rawSegment = pathSegments[pathSegments.length - 2];
                }
                const cleanedPath = rawSegment.replace(/_/g, ' ');
                const finalPathName = cleanedPath.charAt(0).toUpperCase() + cleanedPath.slice(1);

                const fileType = row.getValue('file_type') as string;
                const cleanedData = fileType.replace(/-/g, ' ');
                const regex = /(.*?)\s(Parameter.*)/i;
                const match = cleanedData.match(regex);
                let areaPart = '';
                let parameterPart = '';

                if (match) {
                    areaPart = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
                    parameterPart = match[2].charAt(0).toUpperCase() + match[2].slice(1);
                } else {
                    areaPart = cleanedData.charAt(0).toUpperCase() + cleanedData.slice(1);
                    parameterPart = '';
                }
                return (
                    <div>
                        <div className="flex gap-2 text-left">
                            <div className="font-base">{areaPart}</div>
                            <div className="text-sm">{parameterPart}</div>
                        </div>
                        <div className="text-sm text-gray-500">{finalPathName}</div>
                    </div>
                );
            },
            enableGlobalFilter: true,
        },
        {
            accessorKey: 'outline',
            header: ({ column }) => (
                <div className="flex items-center">
                    <div className="text-gray-700"> Benchmark Name</div>
                    <Button className="ml-2 text-left" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                        <ArrowUpDown className="h-4" />
                    </Button>
                </div>
            ),
            cell: ({ row }) => {
                const [dialogOpen, setDialogOpen] = useState(false);
                return (
                    <>
                        <div className="text-left">
                            <div
                                onClick={() => setDialogOpen(true)}
                                className="max-w-sm cursor-pointer truncate text-gray-900 underline transition-colors hover:text-[#7f1414]"
                            >
                                {row.getValue('outline')}
                            </div>
                        </div>
                        <DocumentViewer
                            open={dialogOpen}
                            onOpenChange={setDialogOpen}
                            fileUrl={row.original.file_path}
                            title={row.getValue('outline') as string}
                        />
                    </>
                );
            },
            enableGlobalFilter: true,
        },
        {
            accessorKey: 'file_status',
            header: () => <div className="text-center text-gray-700">Status</div>,
            cell: ({ row }) => {
                const status = row.getValue('file_status') as string;
                let variantColor;
                let statusText = status;

                switch (status.toLowerCase()) {
                    case 'approved':
                        variantColor = 'bg-green-100 text-green-700 border-green-200';
                        break;
                    case 'pending':
                    case 'in review':
                        variantColor = 'bg-yellow-100 text-yellow-700 border-yellow-200';
                        break;
                    case 'rejected':
                        variantColor = 'bg-red-100 text-red-700 border-red-200';
                        break;
                    default:
                        variantColor = 'bg-gray-100 text-gray-700 border-gray-200';
                        statusText = 'Unknown';
                }

                return (
                    <div className="text-center">
                        <Badge className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize hover:bg-gray-100 ${variantColor}`}>
                            {statusText}
                        </Badge>
                    </div>
                );
            },
            enableGlobalFilter: false,
        },
        {
            accessorKey: 'rejection_reason',
            header: () => <div className="text-left text-gray-700">Comments</div>,
            cell: ({ row }) => {
                const rejectionReason = row.getValue('rejection_reason') as string | null;

                return (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="none" disabled={!rejectionReason} className="p-0 text-left">
                                {rejectionReason ? (
                                    <div className="flex items-center gap-1 rounded-lg border px-3 py-1">
                                        {' '}
                                        <MessageSquareText className="h-4 w-4 text-[#7f1414]" />
                                        <div>view</div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 rounded-lg border px-3 py-1">
                                        {' '}
                                        <MessageSquareOff className="h-4 w-4 text-gray-400" />
                                        <div>none</div>
                                    </div>
                                )}
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-lg font-medium text-gray-900">Rejection Comments</DialogTitle>
                                <DialogDescription className="text-sm text-gray-500">Comments for rejected document</DialogDescription>
                            </DialogHeader>
                            <div>
                                <Textarea className="min-h-[100px] text-black" disabled autoResize>
                                    {rejectionReason}
                                </Textarea>
                            </div>

                            <div className="my-0 rounded-md border border-red-100 bg-red-50 p-4">
                                <p className="text-sm text-red-800">
                                    To proceed, please resubmit or re-upload the document after making the necessary adjustments.{' '}
                                </p>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline" tabIndex={1}>
                                        Close
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                );
            },
            enableGlobalFilter: true,
        },
        {
            accessorKey: 'uploaded_by',
            header: () => <div className="text-left text-gray-700">Uploaded By</div>,
            cell: ({ row }) => <div className="text-left text-gray-900">{row.getValue('uploaded_by')}</div>,
            enableGlobalFilter: true,
        },
        {
            accessorKey: 'uploaded_at',
            header: ({ column }) => (
                <div className="flex items-center">
                    <div className="text-gray-700"> Date Uploaded</div>
                    <Button className="ml-2 text-left" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'dsc')}>
                        <ArrowUpDown className="h-4" />
                    </Button>
                </div>
            ),
            cell: ({ row }) => {
                const uploadedAt = new Date(row.getValue('uploaded_at') as string);
                const formattedDate = uploadedAt.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                });
                return <div className="text-left text-gray-700">{formattedDate}</div>;
            },
            enableGlobalFilter: false,
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                return (
                    <div className="flex justify-end">
                        <DocumentRequestActions file={[row.original]} resolveDialog={resolveDialog} />
                    </div>
                );
            },
        },
    ];
}
