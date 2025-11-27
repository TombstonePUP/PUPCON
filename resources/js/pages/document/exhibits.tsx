import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { router, usePoll } from '@inertiajs/react';
// import type { BreadcrumbItem } from '@/types';
import ExhibitContainerDialog from '@/components/dialogs/exhibits/exhibit-container-dialog';
import { RenderExhibitDialog } from '@/components/dialogs/exhibits/exihibt-dialog-renderer';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ExhibitOutlines, Exhibits } from '@/types/exhibits';
import { Head } from '@inertiajs/react';
import { Folder, GalleryHorizontalEnd, MoreVertical, Plus } from 'lucide-react';
import { useState } from 'react';
import DocumentExhibitDialog from '@/components/dialogs/exhibits/document/document-exhibit-dialog';
import { DocumentViewer } from '@/components/dialogs/documents/view-document';
import ExhibitOutlineDialogRenderer from '@/components/dialogs/exhibits/outline/exhibit-outline-dialog-renderer';

interface ExhibitAdminProps {
    exhibits: Exhibits[];
}

const staticBreadcrumbs = [
    {
        title: 'Exhibits',
        href: `/manage-exhibits`,
    },
];

export default function ExhibitAdmin({ exhibits }: ExhibitAdminProps) {
    /* usePoll(
        2000,
        {only: ['exhibits']},
    ); */
    const [dialog, setDialog] = useState<{
        type: 'exhibit' | 'outline' | 'document' | null;
        action: 'add' | 'edit' | 'delete' | 'view' | null;
        exhibit?: Exhibits | null;
        outline?: ExhibitOutlines | null;
    }>({ type: null, action: null });

    const openDialog = (
        type: 'exhibit' | 'outline' | 'document',
        action: 'add' | 'edit' | 'delete' | 'view',
        exhibit?: Exhibits | null,
        outline?: ExhibitOutlines | null,
    ) => {
        setDialog({ type, action, exhibit, outline });
    };

    const closeDialog = () => {
        setDialog({ type: null, action: null, exhibit: null, outline: null });
    };

    return (
        <AppLayout breadcrumbs={staticBreadcrumbs}>
            <Head title="Exhibits" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex gap-6">
                    <div id="header" className="mb-2 w-full rounded-lg border border-gray-200 bg-white p-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#7f1414]">
                                <GalleryHorizontalEnd className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-2">
                                <h1 className="text-xl font-semibold text-gray-900">Exhibits</h1>
                                <p className="text-sm text-gray-500">Manage all content related to the Exhibit page and its documents.</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* --- Exhibits Grid --- */}
                <div className="flex">
                    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {/* Static Card 1 */}
                        {exhibits.length > 0 ? (
                            exhibits.map((exhibit, index) => (
                                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:border-[#7f1414]">
                                    <div className="flex justify-between gap-3 border-gray-100 p-6">
                                        <div className="flex gap-3 border-gray-100">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-lg font-semibold text-[#7f1414]">
                                                {index + 1}
                                            </div>

                                            <div className="flex flex-col">
                                                <h3 className="truncate text-base font-semibold text-gray-900">{exhibit.exhibit_name}</h3>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Folder className="h-4 w-4" />
                                                    <span className="ml-2 text-xs text-gray-400">{exhibit.exhibit_outlines?.length || 0} Outlines</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <div className="align-center flex border-gray-100">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 rounded-full p-0 hover:bg-gray-200">
                                                            <MoreVertical className="h-4 w-4 text-gray-600" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40">
                                                        <DropdownMenuItem onClick={() => openDialog('exhibit', 'edit', exhibit)}>
                                                            Edit Exhibit
                                                        </DropdownMenuItem>
                                                        {!exhibit.container && (
                                                            <>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        openDialog(
                                                                            'document',
                                                                            'add',
                                                                            exhibit,
                                                                        )
                                                                    }
                                                                >
                                                                    {exhibit.exhibit_outlines && exhibit.exhibit_outlines.length === 0
                                                                        ? 'Upload Document'
                                                                        : 'Update Document'}
                                                                </DropdownMenuItem>
                                                                {exhibit.exhibit_outlines && exhibit.exhibit_outlines.length > 0 && (
                                                                    <>
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                openDialog(
                                                                                    'document',
                                                                                    'view',
                                                                                    null,
                                                                                    exhibit.exhibit_outlines[0],
                                                                                )
                                                                            }
                                                                        >
                                                                            View Document
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                openDialog(
                                                                                    'document',
                                                                                    'delete',
                                                                                    exhibit,
                                                                                    exhibit.exhibit_outlines[0],
                                                                                )
                                                                            }
                                                                        >
                                                                            Delete Document
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                        {exhibit.container && (
                                                            <DropdownMenuItem onClick={() => openDialog('outline', 'edit', exhibit)}>
                                                                Manage Outlines
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem onClick={() => openDialog('exhibit', 'delete', exhibit)}>
                                                            Delete Exhibit
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No exhibits found.</p>
                        )}
                    </div>

                    {/* Right Sidebar - Quick Links */}
                    <div className="w-64 shrink-0">
                        <div className="sticky top-6 space-y-4">
                            <div className="rounded-lg border border-gray-200 bg-white p-4">
                                <h3 className="mb-3 text-sm font-semibold text-gray-900">Exhibit Actions</h3>
                                <Button variant="noborder" className="w-full" onClick={() => openDialog('exhibit', 'add')}>
                                    <Plus className="h-6 w-6 text-white" />
                                    Add New Exhibit
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {dialog.type === 'exhibit' && dialog.action && (
                <RenderExhibitDialog type={dialog.action} exhibit={dialog.exhibit} onClose={closeDialog} />
            )}
            {dialog.type === 'outline' && dialog.action === 'edit' && (
                <ExhibitContainerDialog
                    exhibit={dialog.exhibit}
                    onClose={closeDialog}
            />)}
            {dialog.type === 'document' && (dialog.action !== 'view' && dialog.action !== 'delete')&& (
                <DocumentExhibitDialog
                    type={dialog.action}
                    exhibit={dialog.exhibit}
                    onClose={closeDialog}
                />
            )}
            {dialog.type === 'document' && (dialog.action === 'view' || dialog.action === 'delete')  && (
                <ExhibitOutlineDialogRenderer
                    type={dialog.action}
                    outline={dialog.outline}
                    onClose={closeDialog}
                />
            )}

        </AppLayout>
    );
}
