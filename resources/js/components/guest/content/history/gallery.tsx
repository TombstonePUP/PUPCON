import { CampusGalleryDialog } from '@/components/admin/dialogs/content/history/campus-gallery-dialog';
import { MasterDetailPanel } from '@/components/admin/master-detail-panel';
import { CampusGallery } from '@/types/content';
import { ImageIcon, Images } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface GalleryForm {
    gallery_id: number;
    image: File | null;
    previewUrl?: string | null;
    description: string;
}

interface GalleryProps {
    gallery: CampusGallery[];
    onUpdateGallery: (gallery: CampusGallery, form: GalleryForm) => void;
    onDeleteGallery: (id: number) => void;
    errors?: Record<string, string>;
}

const SharedPhotoPreview: React.FC<{ url: string | null; alt: string; heightClass?: string }> = ({ url, alt, heightClass = 'h-48' }) => {
    const [hasError, setHasError] = useState(false);
    useEffect(() => {
        setHasError(false);
    }, [url]);

    if (!url || hasError) {
        return (
            <div
                className={`w-full ${heightClass} animate-in fade-in-0 border-border bg-muted text-muted-foreground flex flex-col items-center justify-center rounded-md border`}
            >
                <ImageIcon className="text-muted-foreground/50 h-12 w-12" />
                <span className="mt-2 text-sm">No Image Available</span>
            </div>
        );
    }

    return (
        <img
            src={url}
            alt={alt}
            className={`w-full ${heightClass} animate-in fade-in-0 border-border bg-muted rounded-md border object-cover`}
            onError={() => setHasError(true)}
        />
    );
};

export function GallerySection({ gallery, onUpdateGallery, onDeleteGallery, errors = {} }: GalleryProps) {
    const [galleryList, setGalleryList] = useState<CampusGallery[]>(gallery ?? []);
    const [selectedGalleryId, setSelectedGalleryId] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<'add' | 'edit'>('add');

    const selectedGallery = galleryList?.find((g) => g.gallery_id === selectedGalleryId) ?? null;

    const handleAddGallery = () => {
        setDialogAction('add');
        setDialogOpen(true);
        setSelectedGalleryId(null);
    };
    const handleEditGallery = (id: number | string) => {
        setDialogAction('edit');
        setDialogOpen(true);
        setSelectedGalleryId(Number(id));
    };

    const handleDelete = (id: number | string) => {
        setGalleryList((prev) => {
            const updated = prev.filter((g) => g.gallery_id !== Number(id));
            onDeleteGallery(Number(id));
            if (selectedGalleryId === Number(id)) setSelectedGalleryId(null);
            return updated;
        });
    };

    const handleSave = (gallery: GalleryForm) => {
        setGalleryList((prev) => {
            const current = prev ?? [];
            const existingIndex = current.findIndex((g) => g.gallery_id === gallery.gallery_id);
            const galleryForLocalState: CampusGallery = {
                gallery_id: gallery.gallery_id,
                image_path: gallery.previewUrl || '',
                description: gallery.description,
            };
            let updatedList: CampusGallery[];
            if (existingIndex !== -1) {
                updatedList = current.map((g) => (g.gallery_id === galleryForLocalState.gallery_id ? galleryForLocalState : g));
            } else {
                const newId = Math.max(0, ...current.map((g) => g.gallery_id || 0)) + 1;
                galleryForLocalState.gallery_id = newId;
                updatedList = [...current, galleryForLocalState];
            }
            onUpdateGallery(galleryForLocalState, gallery);
            return updatedList;
        });
    };

    const getSelectedGalleryErrors = () => {
        const index = galleryList.findIndex((g) => g.gallery_id === selectedGalleryId);
        if (index === -1) return [];
        return Object.entries(errors)
            .filter(([key]) => key.startsWith(`gallery.${index}.`))
            .map(([, msg]) => msg);
    };

    const listItems = galleryList.map((image, index) => ({
        id: image.gallery_id,
        label: image.description,
        hasError: !!(errors[`gallery.${index}.image`] || errors[`gallery.${index}.description`]),
    }));

    const selectedGalleryErrors = getSelectedGalleryErrors();

    const detail = selectedGallery ? (
        <div className="space-y-6">
            <div className="border-border overflow-hidden rounded-lg border">
                <SharedPhotoPreview url={selectedGallery.image_path} alt={selectedGallery.image_name || 'Gallery Image'} heightClass="h-80" />
            </div>
            {selectedGalleryErrors.length > 0 && (
                <div className="border-destructive/30 bg-destructive/10 rounded-md border p-4">
                    <h4 className="text-destructive mb-2 text-sm font-semibold">Errors in this Gallery</h4>
                    <ul className="text-destructive list-disc space-y-1 pl-5 text-sm">
                        {selectedGalleryErrors.map((msg, i) => (
                            <li key={i}>{msg}</li>
                        ))}
                    </ul>
                </div>
            )}
            {selectedGallery.description && (
                <div>
                    <h5 className="text-foreground mb-2 text-sm font-semibold">Caption</h5>
                    <p className="text-muted-foreground text-sm">{selectedGallery.description}</p>
                </div>
            )}
        </div>
    ) : null;

    return (
        <>
            <MasterDetailPanel
                title=""
                items={listItems}
                selectedId={selectedGalleryId}
                onSelect={(id) => setSelectedGalleryId(Number(id))}
                onAdd={handleAddGallery}
                onEdit={handleEditGallery}
                onDelete={handleDelete}
                emptyListIcon={Images}
                emptyListTitle="No photos yet"
                addIcon={Images}
                addLabel="Add New Photo"
                detail={detail}
                emptyDetailTitle="No Photo Selected"
                emptyDetailDescription='Select a photo on the left or click "Add New Photo" to start.'
            />
            {dialogOpen && (
                <CampusGalleryDialog gallery={selectedGallery} type={dialogAction} onClose={() => setDialogOpen(false)} onSave={handleSave} />
            )}
        </>
    );
}
