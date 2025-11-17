import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Edit2, Trash2 } from "lucide-react";
import { CampusGallery } from "@/types/content";

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

export function CampusGalleryDialog({...props}: CampusGalleryDialogProps) {
    const { gallery, type, onSave, onClose } = props;
    const [data, setData] = useState<GalleryForm>({
        gallery_id: gallery?.gallery_id || 0,
        image: null,
        previewUrl: gallery?.image_path || null,
        description: gallery?.description || '',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setData({ ...data, image: file, previewUrl });
        }
    };

    useEffect(() => {
        return () => {
            if (data.previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(data.previewUrl);
            }
        };
    }, [data.previewUrl]);

    const handleSubmit = () => {
        onSave(data);
        onClose();
    };

    return (
        <>
            <Dialog open={true} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-medium text-gray-900">
                            {type === 'edit' ? 'Edit Director' : 'Add New Gallery Photo'}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">
                            {type === 'edit'
                                ? 'Make changes to the gallery details below.'
                                : 'Fill out the details below to add a new Campus Gallery.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[70vh] overflow-y-auto pr-2">
                        <div>
                            <Label className="mb-2 block text-sm font-medium text-gray-700">Gallery Photo</Label>
                            {!data.previewUrl ? (
                                <Label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="mb-4 h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                            />
                                        </svg>
                                        <p className="text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">JPG, PNG, JPEG</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </Label>
                            ) : (
                                <div className="group relative">
                                    <img src={data.previewUrl} alt="Preview" className="h-48 w-full rounded-lg border border-gray-200 object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-lg bg-black/40 opacity-0 transition group-hover:opacity-100">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="replace-gallery-image"
                                            onChange={handleImageChange} // reuse your same handler
                                        />

                                        {/* Replace image button */}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-12 w-12 rounded-full bg-white p-0 transition-transform duration-200 hover:scale-110 hover:bg-red-50"
                                            size="lg"
                                            onClick={() => document.getElementById('replace-gallery-image')?.click()}
                                        >
                                            <Edit2 className="h-5 w-5 text-red-600" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-12 w-12 rounded-full bg-white p-0 transition-transform duration-200 hover:scale-110 hover:bg-red-50"
                                            size="lg"
                                            onClick={() =>
                                                setData({
                                                    ...data,
                                                    image: null,
                                                    previewUrl: null,
                                                })
                                            }
                                        >
                                            <Trash2 className="h-5 w-5 text-red-600" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        {/* <InputError message={errors['page.banner']} className="mt-2" /> */}
                        </div>

                        <div>
                            <Label className="mb-2 block text-sm font-medium text-gray-700">Caption</Label>
                            <Input
                                placeholder="Enter Gallery Description/Caption"
                                value={data.description}
                                onChange={(e) => setData({ ...data, description: e.target.value })}
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-6 flex justify-end space-x-2">
                        <DialogClose asChild>
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="noborder" onClick={handleSubmit}>
                            {type === 'edit' ? 'Save Changes' : 'Add Gallery'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
