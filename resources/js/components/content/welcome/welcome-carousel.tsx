import { CampusGalleryDialog } from '@/components/dialogs/content/history/campus-gallery-dialog';
import { Button } from '@/components/ui/button';
import { CampusGallery } from '@/types/content';
import { CircleAlert, EditIcon, ImageIcon, Plus, Trash2, X } from 'lucide-react';
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
    errors?: Record<string, string>; // new prop for errors
}

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

const SharedPhotoPreview: React.FC<{ url: string | null; alt: string; heightClass?: string }> = ({ url, alt, heightClass = 'h-48' }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [url]);

    if (!url || hasError) {
        return (
            <div
                className={`w-full ${heightClass} animate-in fade-in-0 flex flex-col items-center justify-center rounded-md border border-gray-200 bg-gray-100 text-gray-500`}
            >
                <ImageIcon className="h-12 w-12 text-gray-400" />
                <span className="mt-2 text-sm">No Image Available</span>
            </div>
        );
    }

    return (
        <img
            src={url}
            alt={alt}
            className={`w-full ${heightClass} animate-in fade-in-0 rounded-md border border-gray-200 bg-gray-100 object-cover`}
            onError={() => setHasError(true)}
        />
    );
};

export default function WelcomeCarouselSection({ ...props }: WelcomeCarouselProps) {
    const { gallery, onUpdate, onDelete, errors } = props;
    const [galleryList, setGalleryList] = React.useState<CampusGallery[]>(gallery);

    const [selectedGalleryId, setSelectedGalleryId] = React.useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogAction, setDialogAction] = React.useState<'add' | 'edit'>('add');

    const selectedGallery = galleryList?.find((g) => g.gallery_id === selectedGalleryId);

    const getSelectedGalleryIndex = () => {
        return galleryList?.findIndex((o) => o.gallery_id === selectedGalleryId);
    };

    const getSelectedGalleryErrors = () => {
        const index = getSelectedGalleryIndex();
        if (index === -1 || index === undefined) return [];

        return Object.entries(errors)
            .filter(([key]) => key.startsWith(`gallery.${index}.`))
            .map(([, msg]) => msg);
    };

    const selectedGalleryErrors = getSelectedGalleryErrors();

    const handleAddGallery = () => {
        setDialogAction('add');
        setDialogOpen(true);
        setSelectedGalleryId(null);
    };

    const handleEditGallery = (galleryId: number) => {
        setDialogAction('edit');
        setDialogOpen(true);
        setSelectedGalleryId(galleryId);
    };

    const handleSave = (gallery: GalleryForm) => {
        setGalleryList((prev) => {
            const current = prev ?? [];
            const existingIndex = current.findIndex((g) => g.gallery_id === gallery.gallery_id);
            let updatedList;
            let galleryForLocalState: CampusGallery;

            // Local State Update
            galleryForLocalState = {
                gallery_id: gallery.gallery_id,
                image_path: gallery.previewUrl || '',
                carousel: true,
                description: gallery.description,
            };

            if (existingIndex !== -1) {
                updatedList = current.map((g) => (g.gallery_id === galleryForLocalState.gallery_id ? galleryForLocalState : g));
            } else {
                const newId = Math.max(0, ...current.map((g) => g.gallery_id || 0)) + 1;
                galleryForLocalState.gallery_id = newId; // Assign new ID to the local object
                updatedList = [...current, galleryForLocalState];
            }
            onUpdate(galleryForLocalState, gallery);
            return updatedList;
        });
    };

    const handleDelete = (id: number) => {
        setGalleryList((prevTypes) => {
            const updatedList = prevTypes.filter((g) => g.gallery_id !== id);
            onDelete(id);
            if (selectedGalleryId === id) {
                setSelectedGalleryId(null);
            }
            return updatedList;
        });
    };

    return (
        <div className="flex min-h-[400px] rounded-lg border border-gray-200">
            {/* Left Pane */}
            <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-6">
                <h4 className="mb-3 text-xs text-gray-500">Select an image</h4>
                <div className="space-y-1">
                    {galleryList?.map((image, index) => (
                        <div
                            key={image.gallery_id}
                            onClick={() => {
                                setSelectedGalleryId(image.gallery_id);
                            }}
                            className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-4 transition-colors ${image.gallery_id === selectedGalleryId ? 'bg-[#7f1414]/4' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <div className="truncate text-sm">
                                <span className={` ${image.gallery_id === selectedGalleryId ? 'font-normal text-red-900' : 'text-gray-700'}`}>
                                    {image.description}
                                </span>
                                {(errors[`gallery.${index}.image`] || errors[`gallery.${index}.description`]) && (
                                    <CircleAlert className="inline-block h-4 w-4 text-red-600" />
                                )}
                            </div>
                            <div
                                className={`flex items-center space-x-0.5 transition-opacity ${image.gallery_id === selectedGalleryId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                    }`}
                            >
                                <ActionButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditGallery(image.gallery_id);
                                    }}
                                    className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                >
                                    <EditIcon className="h-4 w-4" />
                                </ActionButton>
                                <ActionButton
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(image.gallery_id);
                                    }}
                                    className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </ActionButton>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 border-t border-gray-200 pt-4">
                    <Button
                        onClick={handleAddGallery}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                    >
                        <Plus className="mr-2 h-4 w-4" /> <p className="truncate">Add New Image</p>
                    </Button>
                </div>
            </div>

            {/* Right Pane */}
            <div className="w-full p-6">
                {!selectedGallery ? (
                    <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                        <X className="mb-2 h-8 w-8" />
                        <p className="font-medium">No Image Selected</p>
                        <p className="text-sm">Select an image on the left or click "Add New Image" to start.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="overflow-hidden rounded-lg border border-gray-100">
                            <SharedPhotoPreview
                                url={selectedGallery.image_path}
                                alt={selectedGallery.image_name || 'Gallery Image'}
                                heightClass="h-80"
                            />
                            {selectedGalleryErrors.length > 0 && (
                                <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-4">
                                    <h4 className="mb-2 text-sm font-semibold text-red-600">Errors in this Gallery</h4>
                                    <ul className="list-disc space-y-1 pl-5 text-sm text-red-600">
                                        {selectedGalleryErrors.map((msg, i) => (
                                            <li key={i}>{msg}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {selectedGallery.description && (
                            <div>
                                <h5 className="mb-2 text-sm font-semibold text-gray-700">Caption</h5>
                                <p className="text-sm text-gray-700">{selectedGallery.description}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {dialogOpen && (
                <CampusGalleryDialog gallery={selectedGallery} type={dialogAction} onClose={() => setDialogOpen(false)} onSave={handleSave} />
            )}
        </div>
    );
}
