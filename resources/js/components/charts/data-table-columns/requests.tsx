import { DocumentViewer } from '@/components/dialogs/documents/view-document';
import DocumentRequestActions from '@/components/request-table-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { usePoll } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MessageSquareOff, MessageSquareText } from 'lucide-react';
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
                    className='cursor-pointer hover:border-red-400 transition-colors border-gray-700'
                />
            ),
            cell: ({ row }) => (
                <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" className='cursor-pointer hover:border-red-400 transition-colors border-gray-300 mr-4' />
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
                usePoll(5000);
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
                // console.log("orig ftype: " + row.original.file_type);

                const fileType = row.getValue('file_type') as string;
                const cleanedData = fileType.replace(/-/g, ' ');
                // console.log("cleaned ftype: " + fileType);

                let subjectPart = '';
                let segmentPart = '';
                let levelPart = '';

                const regex = /(.*?)\s(Level\s\d)\s(.*)/i;
                const match = cleanedData.match(regex);
                // console.log("match: " + match[1].trim());

                if (match) {
                    subjectPart = match[1].trim();

                    levelPart = match[2];

                    const rawSegmentDetail = match[3];

                    if (rawSegmentDetail.includes('Area')) {
                        const parts = rawSegmentDetail.split(' ');
                        // console.log(parts);

                        if((rawSegmentDetail.includes('area forms'))){
                            segmentPart =  parts[0] + ' ' + parts[1];
                        } else {
                             segmentPart = parts[0] + ' ' + parts[1] + ' > ' + parts[2] + ' ' + parts[3];
                        }
                        // segmentPart = parts[0] + ' ' + parts[1] + ' > ' + parts[2] + ' ' + parts[3];
                    } else {
                        segmentPart = rawSegmentDetail
                            .split(' ')
                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                            .join(' ');
                    }
                } else {
                    subjectPart = cleanedData;
                    segmentPart = 'N/A';
                    levelPart = '';
                }

                return (
                    <div className="w-xs text-left">
                        <div className="mb-0 flex items-center justify-between text-sm">
                            <div className="font-md mr-2 grow truncate text-gray-900 capitalize">{segmentPart === 'N/A' ? subjectPart : segmentPart}</div>

                            {/* {levelPart && (
                                <span className="min-w-fit rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-indigo-700">
                                    {levelPart}
                                </span>
                            )} */}
                        </div>

                        <div className={`truncate text-sm text-gray-500 capitalize ${subjectPart === 'exhibits' ? 'hidden' : ''}`}>{subjectPart}</div>

                        {/* <div className="text-xs text-gray-400 mt-1 italic">
            {finalPathName}
        </div>  */}
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
                const origpath = row.original.file_path ?? '';
                // console.log('raw: ' + origpath);

                const segments = origpath.split('/');
                const hasNoCategory = segments.includes('no_category');

                let prefix = '';

                if (hasNoCategory) {
                    prefix = '';
                } else {
                    prefix =
                        origpath
                            .split('/')
                            .pop()
                            ?.match(/^[A-Za-z0-9](?:\.\d+)+\./)?.[0] ?? '';
                }

                // console.log('prefix:', prefix);

                return (
                    <>
                        <div className="text-left">
                            <div
                                onClick={() => setDialogOpen(true)}
                                className="max-w-sm cursor-pointer truncate text-gray-900 underline transition-colors hover:text-[#7f1414]"
                            >
                                {prefix + ' ' + row.getValue('outline')}
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
                    <Button className="ml-2 text-left" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
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
