import { DocumentViewer } from '@/components/dialogs/documents/view-document';
import InputError from '@/components/input-error';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/text-area';
import { type FilesOverview } from '@/types';
import { useForm, usePoll } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MessageSquareOff, MessageSquareText, MoreVertical } from 'lucide-react';
import React, { useState } from 'react';

interface DocumentRequestForm {
    file_id: number;
    file_type: string;
    rejection_reason?: string;
}

export const columns: ColumnDef<FilesOverview>[] = [
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
            usePoll(
                2000,
                {},
                {
                    keepAlive: true,
                },
            );
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
            usePoll(
                2000,
                {},
                {
                    keepAlive: true,
                },
            );
            const [dialogOpen, setDialogOpen] = useState(false);
            return (
                <>
                    <div className="text-left">
                        <div
                            onClick={() => setDialogOpen(true)}
                            className="w-sm cursor-pointer truncate text-gray-900 underline transition-colors hover:text-[#7f1414]"
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
        header: () => <div className="text-left text-gray-700">Status</div>,
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
                <div className="text-left">
                    <Badge className={`rounded-full px-3 py-0.5 text-xs font-medium capitalize ${variantColor}`}>{statusText}</Badge>
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
                            <DialogTitle>Rejection Comments</DialogTitle>
                            <DialogDescription>Comments for rejected document</DialogDescription>
                        </DialogHeader>
                        <div>
                            <Textarea className="min-h-[100px] text-black" disabled>
                                {rejectionReason}
                            </Textarea>
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
                <Button className="ml-2 text-left " variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
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
            const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
            const [revertDialogOpen, setRevertDialogOpen] = useState(false);
            const {
                data: dataDocs,
                setData: setDocsData,
                post: postDocs,
                processing: processingDocs,
                errors: errorsDocs,
                reset: resetDocs,
            } = useForm<DocumentRequestForm>({
                file_id: row.original.file_id,
                file_type: row.original.file_type,
                rejection_reason: null,
            });

            const approveDocument = (e: React.FormEvent) => {
                e.preventDefault();
                postDocs(route('approveDocument', [dataDocs.file_id]), {
                    onSuccess: () => resetDocs(),
                });
            };

            const rejectDocument = (e: React.FormEvent) => {
                e.preventDefault();
                setRejectDialogOpen(false);
                postDocs(route('rejectDocument', [dataDocs.file_id]), {
                    onSuccess: () => resetDocs(),
                });
            };

            const revertDocument = (e: React.FormEvent) => {
                e.preventDefault();
                setRevertDialogOpen(false);
                postDocs(route('revertDocument', [dataDocs.file_id]), {
                    onSuccess: () => resetDocs(),
                });
            };

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="ghost" className="data-[state=open]:bg-muted text-muted-foreground flex size-8" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                            {row.original.file_status !== 'Approved' && (
                                <DropdownMenuItem className="cursor-pointer" onClick={approveDocument}>
                                    Approve
                                </DropdownMenuItem>
                            )}
                            {row.original.file_status !== 'Pending' && (
                                <DropdownMenuItem className="cursor-pointer" onClick={() => setRevertDialogOpen(true)}>
                                    Revert
                                </DropdownMenuItem>
                            )}
                            {row.original.file_status !== 'Rejected' && (
                                <DropdownMenuItem className="cursor-pointer" onClick={() => setRejectDialogOpen(true)} variant="destructive">
                                    Reject
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Revert Dialog */}
                    <Dialog open={revertDialogOpen} onOpenChange={setRevertDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Reset</DialogTitle>
                                <DialogDescription>Reset Document Status</DialogDescription>
                            </DialogHeader>
                            <div>
                                <label className="text-muted-foreground mb-1 block w-100 text-sm font-medium">
                                    Do you want to reset the status of this Document?
                                </label>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button tabIndex={3} variant="outline" onClick={() => setRevertDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button tabIndex={4} onClick={revertDocument}>
                                    Revert
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Reject Dialog */}
                    <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Reject Document</DialogTitle>
                                <DialogDescription>
                                    {row.original.file_type.charAt(0).toUpperCase() + row.original.file_type.slice(1).toLowerCase()} -{' '}
                                    {row.original.outline}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={rejectDocument}>
                                <div className="mb-2">
                                    <label className="text-muted-foreground mb-1 block w-100 text-sm font-medium">Rejection Comments</label>
                                    <textarea
                                        id="rejection_reason"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        value={dataDocs.rejection_reason}
                                        onChange={(e) => setDocsData('rejection_reason', e.target.value)}
                                        disabled={processingDocs}
                                        placeholder="Enter comments here..."
                                        className="focus:border-ring focus:ring-ring min-h-[100px] w-full resize-y rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                    />
                                    <InputError className="mt-2" />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button tabIndex={3} variant="outline" onClick={() => setRejectDialogOpen(false)} disabled={processingDocs}>
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button tabIndex={4} variant={'noborder'} disabled={processingDocs}>
                                        Reject
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </>
            );
        },
    },
];
