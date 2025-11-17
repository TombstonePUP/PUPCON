import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import { EditIcon } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { Plus } from 'lucide-react';
import { X } from 'lucide-react';
import { CampusGallery } from "@/types/content";
import { CampusGalleryDialog } from '@/components/dialogs/content/history/campus-gallery-dialog';

interface GalleryForm {
    gallery_id: number;
    image: File | null;
    previewUrl?: string | null;
    description: string;
}

interface GalleryProps {
    gallery: CampusGallery[];
    onUpdateGallery: (gallery: CampusGallery, form: GalleryForm ) => void;
    onDeleteGallery: (id: number) => void,
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

export function GallerySection({...props}: GalleryProps) {
    const { gallery, onUpdateGallery, onDeleteGallery } = props;
    const [galleryList, setGalleryList] = useState<CampusGallery[]>(gallery);
    const [selectedGalleryId, setSelectedGalleryId] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<'add' | 'edit'>('add');

    const selectedGallery = galleryList.find((gallery: CampusGallery) => gallery.gallery_id === selectedGalleryId);

    useEffect(() => {
        setGalleryList(gallery ?? []);
    }, [gallery]);

    const handleAddGallery = () => {
        setDialogAction('add');
        setDialogOpen(true);
        setSelectedGalleryId(null);
    }

    const handleEditGallery = (galleryId: number) => {
        setDialogAction('edit');
        setDialogOpen(true);
        setSelectedGalleryId(galleryId);
    }

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
                description: gallery.description,
            };

            if (existingIndex !== -1) {
                updatedList = current.map((g) => (g.gallery_id === galleryForLocalState.gallery_id ? galleryForLocalState : g));
            } else {
                const newId = Math.max(0, ...current.map((g) => g.gallery_id || 0)) + 1;
                galleryForLocalState.gallery_id = newId; // Assign new ID to the local object
                updatedList = [...current, galleryForLocalState];
            }

            onUpdateGallery(galleryForLocalState, gallery);
            return updatedList;
        });
    };

    const handleDelete = (id: number) => {
        setGalleryList((prevTypes) => {
            const updatedList = prevTypes.filter((g) => g.gallery_id !== id);
            onDeleteGallery(id);
            if (selectedGalleryId === id) {
                setSelectedGalleryId(null);
            }
            return updatedList;
        });
    };

    return (
        <>
            <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                {/* Left Pane: Gallery List */}
                <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-6">
                    <h4 className="mb-3 text-xs text-gray-500">Select a Photo</h4>
                    <div className="space-y-1">
                        {galleryList.map((image) => (
                            <div
                                key={image.gallery_id}
                                onClick={() => {
                                    setSelectedGalleryId(image.gallery_id);
                                }}
                                className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-4 transition-colors ${image.gallery_id === selectedGalleryId ? 'bg-[#7f1414]/4' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="truncate text-sm">
                                    <span
                                        className={` ${image.gallery_id === selectedGalleryId ? 'font-normal text-red-900' : 'text-gray-700'}`}
                                    >
                                        {image.description}
                                    </span>
                                </div>
                                <div
                                    className={`flex items-center space-x-0.5 transition-opacity ${image.gallery_id === selectedGalleryId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                        }`}
                                >
                                    <ActionButton
                                        onClick={(e) => {
                                            handleEditGallery(image.gallery_id);
                                        }}
                                        className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                    >
                                        <EditIcon className="h-4 w-4" />
                                    </ActionButton>
                                    <ActionButton
                                        onClick={(e) => {
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
                            <Plus className="mr-2 h-4 w-4" /> Add New Photo
                        </Button>
                    </div>
                </div>

                {/* Right Pane: Gallery Photo Details */}
                <div className="w-2/3 p-6">
                    {!selectedGallery ? (
                        <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                            <X className="mb-2 h-8 w-8" />
                            <p className="font-medium">No Photo Selected</p>
                            <p className="text-sm">Select a photo on the left or click "Add New Photo" to start.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="overflow-hidden rounded-lg border border-gray-100">
                                <SharedPhotoPreview
                                    url={selectedGallery.image_path}
                                    alt={selectedGallery.image_name || 'Gallery Image'}
                                    heightClass="h-80"
                                />
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
            </div>
            {dialogOpen && (
                <CampusGalleryDialog
                    gallery={selectedGallery}
                    type={dialogAction}
                    onClose={() => setDialogOpen(false)}
                    onSave={handleSave}
                />
            )}
        </>
    );
}
