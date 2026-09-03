import { ImageUpload } from '@/components/admin/image-upload'; // adjust path as needed
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProgramGalleryImages } from '@/types';
import { useState } from 'react';

interface GalleryForm {
    gallery_id: number | null;
    image: File | null;
    previewUrl: string | null;
    caption: string;
}

interface GalleryDialogProps {
    type?: 'add' | 'edit';
    onClose: () => void;
    onSave: (item: GalleryForm) => void;
    gallery?: ProgramGalleryImages;
}

export default function GalleryDialog({ type, onClose, onSave, gallery }: GalleryDialogProps) {
    const [data, setData] = useState<GalleryForm>({
        gallery_id: gallery?.program_gallery_id || null,
        image: null,
        previewUrl: gallery?.image_path || null,
        caption: gallery?.caption || '',
    });

    const handleSubmit = () => {
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{type === 'edit' ? 'Edit Gallery Image' : 'Add Gallery Image'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <ImageUpload
                        value={data.image}
                        previewUrl={data.previewUrl}
                        onChange={(file, url) => setData((prev) => ({ ...prev, image: file, previewUrl: url }))}
                        onRemove={() => setData((prev) => ({ ...prev, image: null, previewUrl: null }))}
                        label="Upload Gallery Image"
                        aspectRatio={1}
                        inputId="gallery-dialog-img"
                    />

                    <div>
                        <Label>
                            Caption <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            className="mt-2"
                            type="text"
                            value={data.caption}
                            onChange={(e) => setData((prev) => ({ ...prev, caption: e.target.value }))}
                            placeholder="Image caption"
                            required
                        />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="noborder">
                            {type === 'edit' ? 'Save Changes' : 'Add Image'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
