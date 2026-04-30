import { CampusGalleryDialog } from '@/components/admin/dialogs/content/history/campus-gallery-dialog';
import { MasterDetailPanel } from '@/components/admin/master-detail-panel';
import { CampusGallery } from '@/types/content';
import { ImageIcon, ImagePlus, Images, MousePointerClick } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface GalleryForm {
    gallery_id: number;
    image: File | null;
    previewUrl?: string | null;
    description: string;
    carousel: boolean;
}

interface WelcomeCarouselProps {
    gallery: CampusGallery[];
    onUpdate: (gallery: CampusGallery, form: GalleryForm) => void;
    onDelete: (id: number) => void;
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
                className={`w-full ${heightClass} animate-in fade-in-0 border-border bg-muted/30 text-muted-foreground flex flex-col items-center justify-center rounded-md border`}
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
            className={`w-full ${heightClass} animate-in fade-in-0 border-border bg-muted/30 rounded-md border object-cover`}
            onError={() => setHasError(true)}
        />
    );
};

export default function WelcomeCarouselSection({ gallery, onUpdate, onDelete, errors = {} }: WelcomeCarouselProps) {
    const [galleryList, setGalleryList] = React.useState<CampusGallery[]>(gallery);
    const [selectedGalleryId, setSelectedGalleryId] = React.useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogAction, setDialogAction] = React.useState<'add' | 'edit'>('add');

    const selectedGallery = galleryList.find((g) => g.gallery_id === selectedGalleryId);

    const getSelectedGalleryIndex = () => galleryList.findIndex((g) => g.gallery_id === selectedGalleryId);

    const getSelectedGalleryErrors = () => {
        const index = getSelectedGalleryIndex();
        if (index === -1) return [];
        return Object.entries(errors)
            .filter(([key]) => key.startsWith(`gallery.${index}.`))
            .map(([, msg]) => msg);
    };

    const selectedGalleryErrors = getSelectedGalleryErrors();

    const galleryErrorCount = galleryList.reduce((count, _, index) => {
        const hasError = Object.keys(errors).some((key) => key.startsWith(`gallery.${index}.`));
        return hasError ? count + 1 : count;
    }, 0);

    const handleAddGallery = () => {
        setDialogAction('add');
        setSelectedGalleryId(null);
        setDialogOpen(true);
    };

    const handleEditGallery = (galleryId: number) => {
        setDialogAction('edit');
        setSelectedGalleryId(galleryId);
        setDialogOpen(true);
    };

    const handleSave = (form: GalleryForm) => {
        setGalleryList((prev) => {
            const existingIndex = prev.findIndex((g) => g.gallery_id === form.gallery_id);
            const localItem: CampusGallery = {
                gallery_id: form.gallery_id,
                image_path: form.previewUrl || '',
                carousel: true,
                description: form.description,
            };

            let updatedList: CampusGallery[];
            if (existingIndex !== -1) {
                updatedList = prev.map((g) => (g.gallery_id === localItem.gallery_id ? localItem : g));
            } else {
                const newId = Math.max(0, ...prev.map((g) => g.gallery_id || 0)) + 1;
                localItem.gallery_id = newId;
                updatedList = [...prev, localItem];
            }

            onUpdate(localItem, form);
            return updatedList;
        });
    };

    const handleDelete = (id: number) => {
        setGalleryList((prev) => {
            const updated = prev.filter((g) => g.gallery_id !== id);
            onDelete(id);
            if (selectedGalleryId === id) setSelectedGalleryId(null);
            return updated;
        });
    };

    return (
        <>
            <MasterDetailPanel
                title="Welcome Carousel"
                description="Manage the gallery images shown in the welcome carousel"
                errorCount={galleryErrorCount}
                items={galleryList.map((item, index) => ({
                    id: item.gallery_id,
                    label: item.description || `Image ${index + 1}`,
                    hasError: !!(errors[`gallery.${index}.image`] || errors[`gallery.${index}.description`]),
                }))}
                selectedId={selectedGalleryId}
                onSelect={(id) => setSelectedGalleryId(id as number)}
                onAdd={handleAddGallery}
                onEdit={(id) => handleEditGallery(id as number)}
                onDelete={(id) => handleDelete(id as number)}
                emptyListIcon={Images}
                emptyListTitle="No images added"
                addIcon={ImagePlus}
                addLabel="Add Image"
                emptyDetailIcon={MousePointerClick}
                emptyDetailTitle="No image selected"
                emptyDetailDescription="Select an image from the list to preview"
                detail={
                    selectedGallery ? (
                        <div className="flex h-full flex-col justify-between gap-4">
                            <div className="space-y-3">
                                <SharedPhotoPreview
                                    url={selectedGallery.image_path}
                                    alt={selectedGallery.image_name || 'Gallery Image'}
                                    heightClass="h-80"
                                />
                                {selectedGallery.description && (
                                    <div className="border-border bg-muted/30 rounded-md border p-3">
                                        <p className="text-muted-foreground mb-1 text-xs font-medium">Caption</p>
                                        <p className="text-foreground text-sm">{selectedGallery.description}</p>
                                    </div>
                                )}
                            </div>
                            {selectedGalleryErrors.length > 0 && (
                                <div className="border-destructive/20 bg-destructive/10 rounded-md border p-4">
                                    <h4 className="text-destructive mb-2 text-sm font-semibold">Errors in this image</h4>
                                    <ul className="text-destructive list-disc space-y-1 pl-5 text-sm">
                                        {selectedGalleryErrors.map((msg, i) => (
                                            <li key={i}>{msg}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : null
                }
            />

            {dialogOpen && (
                <CampusGalleryDialog gallery={selectedGallery} type={dialogAction} onClose={() => setDialogOpen(false)} onSave={handleSave} />
            )}
        </>
    );
}
