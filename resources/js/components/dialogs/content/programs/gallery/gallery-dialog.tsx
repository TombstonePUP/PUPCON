import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProgramGalleryImages } from '@/types';
import { useState, useEffect } from 'react';
import { Edit2, Trash2, Upload } from 'lucide-react';

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
    const [data, setData, errors] = useState<GalleryForm>({
        gallery_id: gallery?.program_gallery_id || null,
        image: null,
        previewUrl: gallery?.image_path || null,
        caption: gallery?.caption || '',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setData({
                ...data,
                image: file,
                previewUrl,
            });
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
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{type === 'edit' ? 'Edit Gallery Image' : 'Add Gallery Image'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mt-5 flex flex-col gap-3">
                        {!data.previewUrl ? (
                            <label className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-12 text-center transition-all duration-300 hover:border-[#7f1414]/70">
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                <div className="flex flex-col items-center justify-center gap-4 pt-5 pb-6">
                                    <div className="relative">
                                        <div className="rounded-fullopacity-20 absolute inset-0 animate-pulse"></div>
                                        <div className="relative grid h-16 w-16 place-items-center rounded-full border-2 border-dashed transition-transform duration-300 group-hover:scale-105">
                                            <Upload className="h-6 w-6 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className="mb-1 text-lg font-semibold text-gray-700">Upload welcome banner</p>
                                        <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">PNG</span>
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">JPG</span>
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">Max 5MB</span>
                                    </div>
                                </div>
                            </label>
                        ) : (
                            <div className="group relative">
                                <img src={data.previewUrl} alt="Preview" className="h-80 w-full rounded-lg border border-gray-200 object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-lg bg-black/40 opacity-0 transition group-hover:opacity-100">
                                    <input id="gallery-replace-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-12 w-12 rounded-full bg-white p-0"
                                        onClick={() => document.getElementById('gallery-replace-image')?.click()}
                                    >
                                        <Edit2 className="h-5 w-5 text-red-600" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-12 w-12 rounded-full bg-white p-0"
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
                    </div>
                    <div>
                        <Label>Caption</Label>
                        <Input
                            className="mt-2"
                            type="text"
                            required
                            value={data.caption}
                            onChange={(e) => setData({ ...data, caption: e.target.value })}
                            placeholder="Image caption"
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
