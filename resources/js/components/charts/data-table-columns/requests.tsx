import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { type FilesOverview } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { DocumentViewer } from '@/components/dialogs/documents/view-document';

interface DocumentRequestForm {
    file_id: number;
    file_type: string;
    rejection_reason?: string;
}

export const columns: ColumnDef<FilesOverview>[] = [
    {
        accessorKey: 'file_type',
        header: ({ column }) => (
            <Button className="text-left" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Type
                <ArrowUpDown className="ml-2 h-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const fileType = row.getValue('file_type') as string;
            const capitalized = fileType.charAt(0).toUpperCase() + fileType.slice(1).toLowerCase();
            return <div className="text-left">{capitalized}</div>;
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'outline',
        header: ({ column }) => (
            <Button className="text-left" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Outline
                <ArrowUpDown className="ml-2 h-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const [dialogOpen, setDialogOpen] = useState(false);
            return (
                <>
                    <div className="text-left">
                        <Button variant="link" onClick={() => setDialogOpen(true)}>
                            {row.getValue('outline')}
                        </Button>
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
        header: () => <div className="text-left">Status</div>,
        cell: ({ row }) => <div className="text-left">{row.getValue('file_status')}</div>,
        enableGlobalFilter: false,
    },
    {
        accessorKey: 'rejection_reason',
        header: () => <div className="text-left">Comments</div>,
        cell: ({ row }) => <div className="text-left">{row.getValue('rejection_reason')}</div>,
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'uploaded_by',
        header: () => <div className="text-left">Uploaded By</div>,
        cell: ({ row }) => <div className="text-left">{row.getValue('uploaded_by')}</div>,
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'uploaded_at',
        header: ({ column }) => (
            <Button className="text-left" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                Uploaded At
                <ArrowUpDown className="ml-2 h-4" />
            </Button>
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
            return <div className="text-left">{formattedDate}</div>;
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
                                <DropdownMenuItem className='cursor-pointer' onClick={approveDocument}>Approve</DropdownMenuItem>
                            )}
                            {row.original.file_status !== 'Pending' && (
                                <DropdownMenuItem className='cursor-pointer' onClick={() => setRevertDialogOpen(true)}>Revert</DropdownMenuItem>
                            )}
                            {row.original.file_status !== 'Rejected' && (
                                <DropdownMenuItem className='cursor-pointer' onClick={() => setRejectDialogOpen(true)} variant="destructive">
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
                                <label className="text-muted-foreground mb-1 block text-sm font-medium w-100">
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
                                    {row.original.file_type.charAt(0).toUpperCase() + row.original.file_type.slice(1).toLowerCase()} - {row.original.outline}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={rejectDocument}>
                                <div className='mb-2'>
                                    <label className="text-muted-foreground mb-1 block text-sm font-medium w-100">
                                        Rejection Comments
                                    </label>
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
                                        <Button
                                            tabIndex={3}
                                            variant="outline"
                                            onClick={() => setRejectDialogOpen(false)}
                                            disabled={processingDocs}
                                        >
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
