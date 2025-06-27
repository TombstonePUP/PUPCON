/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { type FilesOverview } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import InputError from '@/components/input-error';

interface DocumentRequestForm {
    file_id: number;
    file_type: string;
    rejection_reason?: string;
}

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
            const [dialogOpen, setDialogOpen] = useState(false);
            return (
            <>
                <div className="text-left">
                    <Button variant="link" onClick={() => setDialogOpen(true)}>
                        {row.getValue('outline')}
                    </Button>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Viewingsahsahs</DialogTitle>
                            <DialogDescription>Viewing hsasah</DialogDescription>
                        </DialogHeader>
                        <div>
                        </div>
                    </DialogContent>
                </Dialog>
            </>
            );
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
    {
        id: 'actons',
        cell: ({row}) => {
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
                file_type: '',
                rejection_reason: null,
            });

            const approveDocument = (e: React.FormEvent) => {
                e.preventDefault();
                postDocs(route('approveDocument', [dataDocs.file_id]), {
                    onSuccess: () => {
                        resetDocs();
                    },
                });
            }

            const rejectDocument = (e: React.FormEvent) => {
                e.preventDefault();
                postDocs(route('rejectDocument', [dataDocs.file_id]), {
                    onSuccess: () => {
                        resetDocs();
                    },
                });
            }

            const revertDocument = (e: React.FormEvent) => {
                console.log(dataDocs);
                setRevertDialogOpen(false);
                e.preventDefault();
                postDocs(route('revertDocument', [dataDocs.file_id]), {
                    onSuccess: () => {
                        resetDocs();
                    },
                });
            }

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button
                                variant="ghost"
                                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                                size="icon"
                            >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                            <DropdownMenuItem>Approve</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setRevertDialogOpen(true)}>Revert</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setRejectDialogOpen(true)} variant="destructive">Reject</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog open={revertDialogOpen} onOpenChange={setRevertDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Reset</DialogTitle>
                                <DialogDescription>Reset Document Status</DialogDescription>
                            </DialogHeader>
                            <div>
                                <label className="text-muted-foreground mb-1 block text-sm font-medium w-100">Do you want to reset the status of this Document?</label>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button tabIndex={3} variant="outline" onClick={() => setRevertDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button tabIndex={4} onClick={
                                    (e) => {
                                        // setDocsData('file_id', row.original.file_id)
                                        revertDocument(e);
                                    }}
                                >
                                    Revert
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Reject Document</DialogTitle>
                                <DialogDescription>Documennt</DialogDescription>
                            </DialogHeader>
                            <form>
                                <div>
                                    <label className="text-muted-foreground mb-1 block text-sm font-medium w-100">Rejection Comments</label>
                                    <textarea
                                        id="outline_description"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        // value=
                                        // onChange=
                                        // disabled=
                                        placeholder="Enter outline description"
                                        className="focus:border-ring focus:ring-ring min-h-[100px] w-100 resize-y rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                    />
                                    <InputError
                                        // message={errorsOutline.outline_description}
                                        className="mt-2"
                                    />
                                </div>
                            </form>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button tabIndex={3} variant="outline" onClick={() => setRejectDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button tabIndex={4}>
                                    Reject
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            );
        },
    },
];

