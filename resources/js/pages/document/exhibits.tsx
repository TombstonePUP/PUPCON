import DocumentExhibitDialog from '@/components/dialogs/exhibits/document/document-exhibit-dialog';
import ExhibitContainerDrawer from '@/components/dialogs/exhibits/exhibit-container-dialog';
import { RenderExhibitDialog } from '@/components/dialogs/exhibits/exihibt-dialog-renderer';
import ExhibitOutlineDialogRenderer from '@/components/dialogs/exhibits/outline/exhibit-outline-dialog-renderer';
import { PageTitle } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { ExhibitOutlines, Exhibits } from '@/types/exhibits';
import { Head } from '@inertiajs/react';
import { BadgePlus, Folder, FolderOpen, GalleryHorizontalEnd, MoreVertical, Plus } from 'lucide-react';
import { useState } from 'react';

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
            <PageTitle
                title="Exhibits"
                description="Manage all content related to the Exhibit page and its documents."
                icon={<GalleryHorizontalEnd className="size-5" />}
                actions={
                    <Button variant="noborder" onClick={() => setTimeout(() => openDialog('exhibit', 'add'), 50)}>
                        <BadgePlus className="h-4 w-4" />
                        <span className="hidden xl:inline">Add Exhibit</span>
                    </Button>
                }
            />

            {/* --- Exhibits Grid --- */}
            <div className="flex gap-6">
                {exhibits.length > 0 ? (
                    <div className="grid w-full grid-cols-2 gap-6 xl:grid-cols-4">
                        {exhibits.map((exhibit, index) => {
                            const handleCardClick = () => {
                                if (exhibit.container) {
                                    setTimeout(() => openDialog('outline', 'edit', exhibit), 50);
                                } else if (exhibit.exhibit_outlines && exhibit.exhibit_outlines.length > 0) {
                                    setTimeout(() => openDialog('document', 'view', null, exhibit.exhibit_outlines[0]), 50);
                                } else {
                                    setTimeout(() => openDialog('document', 'add', exhibit), 50);
                                }
                            };

                            return (
                                <div
                                    key={index}
                                    onClick={handleCardClick}
                                    className="group border-border bg-card hover:border-primary h-fit cursor-pointer overflow-hidden rounded-xl border transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between gap-3 p-4">
                                        <div className="flex min-w-0 flex-1 gap-3">
                                            <div className="border-border bg-muted group-hover:text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-lg font-semibold">
                                                {index + 1}
                                            </div>
                                            <div className="flex min-w-0 flex-1 flex-col">
                                                <h3 className="text-foreground truncate text-base font-semibold">{exhibit.exhibit_name}</h3>
                                                <div className="text-muted-foreground flex items-center text-sm">
                                                    <Folder className="h-4 w-4 shrink-0" />
                                                    <span className="text-muted-foreground ml-2 truncate text-xs">
                                                        {exhibit.container
                                                            ? exhibit.exhibit_outlines?.length || 0
                                                            : exhibit.exhibit_outlines[0]?.exhibit_files
                                                              ? exhibit.exhibit_outlines.length
                                                              : 0}{' '}
                                                        file/s
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="hover:bg-muted h-8 w-8 rounded-full p-0">
                                                        <MoreVertical className="text-muted-foreground h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40">
                                                    <DropdownMenuItem onClick={() => setTimeout(() => openDialog('exhibit', 'edit', exhibit), 50)}>
                                                        Edit Exhibit
                                                    </DropdownMenuItem>
                                                    {!exhibit.container && (
                                                        <>
                                                            <DropdownMenuItem
                                                                onClick={() => setTimeout(() => openDialog('document', 'add', exhibit))}
                                                            >
                                                                {exhibit.exhibit_outlines && exhibit.exhibit_outlines.length === 0
                                                                    ? 'Upload Document'
                                                                    : 'Update Document'}
                                                            </DropdownMenuItem>
                                                            {exhibit.exhibit_outlines && exhibit.exhibit_outlines.length > 0 && (
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        setTimeout(
                                                                            () =>
                                                                                openDialog(
                                                                                    'document',
                                                                                    'delete',
                                                                                    exhibit,
                                                                                    exhibit.exhibit_outlines[0],
                                                                                ),
                                                                            50,
                                                                        )
                                                                    }
                                                                >
                                                                    Delete Document
                                                                </DropdownMenuItem>
                                                            )}
                                                        </>
                                                    )}
                                                    <DropdownMenuItem onClick={() => setTimeout(() => openDialog('exhibit', 'delete', exhibit), 50)}>
                                                        Delete Exhibit
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex w-full flex-1 items-center justify-center">
                        <div className="border-border bg-muted/30 flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center">
                            <FolderOpen className="text-muted-foreground mb-4 h-16 w-16" />
                            <h3 className="text-foreground mb-2 text-lg font-semibold">No Exhibits Found</h3>
                            <p className="text-muted-foreground text-sm">There are no exhibits yet. Create your first exhibit to get started.</p>
                            <Button variant="noborder" className="mt-4" onClick={() => setTimeout(() => openDialog('exhibit', 'add'), 50)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Exhibit
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {dialog.type === 'exhibit' && dialog.action && (
                <RenderExhibitDialog type={dialog.action} exhibit={dialog.exhibit} onClose={closeDialog} />
            )}
            {dialog.type === 'outline' && dialog.action === 'edit' && <ExhibitContainerDrawer exhibit={dialog.exhibit} onClose={closeDialog} />}
            {dialog.type === 'document' && dialog.action !== 'view' && dialog.action !== 'delete' && (
                <DocumentExhibitDialog type={dialog.action} exhibit={dialog.exhibit} onClose={closeDialog} />
            )}
            {dialog.type === 'document' && (dialog.action === 'view' || dialog.action === 'delete') && (
                <ExhibitOutlineDialogRenderer type={dialog.action} outline={dialog.outline} onClose={closeDialog} />
            )}
        </AppLayout>
    );
}
