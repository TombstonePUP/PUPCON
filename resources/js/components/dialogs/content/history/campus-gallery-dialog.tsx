import { ImageUpload } from '@/components/image-upload'; // adjust path as needed
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CampusGallery } from '@/types/content';
import { useState } from 'react';

interface GalleryForm {
    gallery_id: number;
    image: File | null;
    previewUrl?: string | null;
    description: string;
}

interface CampusGalleryDialogProps {
    gallery?: CampusGallery;
    type: 'edit' | 'add';
    onSave: (gallery: GalleryForm) => void;
    onClose: () => void;
}

export function CampusGalleryDialog(props: CampusGalleryDialogProps) {
    const { gallery, type, onSave, onClose } = props;

    const [data, setData] = useState<GalleryForm>({
        gallery_id: gallery?.gallery_id || 0,
        image: null,
        previewUrl: gallery?.image_path || null,
        description: gallery?.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-foreground text-lg font-medium">
                        {type === 'edit' ? 'Edit Gallery' : 'Add New Gallery Photo'}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        {type === 'edit' ? 'Update the gallery photo or caption.' : 'Fill out the details to add a new Campus Gallery photo.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto">
                        <div>
                            <Label className="text-foreground mb-2 block text-sm font-medium">
                                Gallery Photo <span className="text-destructive">*</span>
                            </Label>
                            <ImageUpload
                                value={data.image}
                                previewUrl={data.previewUrl ?? null}
                                onChange={(file, url) => setData((prev) => ({ ...prev, image: file, previewUrl: url }))}
                                onRemove={() => setData((prev) => ({ ...prev, image: null, previewUrl: null }))}
                                label="Upload Gallery Photo"
                                aspectRatio={1}
                                inputId="campus-gallery-img"
                            />
                        </div>

                        <div>
                            <Label className="text-foreground mb-2 block text-sm font-medium">
                                Caption <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                placeholder="Enter gallery description / caption"
                                value={data.description}
                                onChange={(e) => setData((prev) => ({ ...prev, description: e.target.value }))}
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6 flex justify-end space-x-2">
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="noborder">
                            {type === 'edit' ? 'Save Changes' : 'Add Gallery'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
