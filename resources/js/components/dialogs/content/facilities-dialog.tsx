import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/text-area';
import { Facilities } from '@/types/content';
import { Edit2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FacilitiesDialogProps {
    facility?: Facilities;
    type: 'edit' | 'add';
    onSave: (facility: FacilityForm) => void;
    onClose: () => void;
}

interface FacilityForm {
    facility_id?: number;
    facility_name: string;
    description: string;
    facility_image?: File | null;
    previewUrl?: string | null;
}

export function FacilitiesDialog({ facility, type, onSave, onClose }: FacilitiesDialogProps) {
    const [data, setData] = useState<FacilityForm>({
        facility_id: facility?.facility_id || 0,
        facility_name: facility?.facility_name || '',
        description: facility?.description || '',
        facility_image: null,
        previewUrl: facility?.image_path || null,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setData({ ...data, facility_image: file, previewUrl });
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
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium text-gray-900">{type === 'edit' ? 'Edit Facility' : 'Add Facility'}</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        {type === 'edit' ? `Modify the details of "${facility?.facility_name}".` : 'Fill in the details to add a new facility.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-2">
                        <div>
                            {!data.previewUrl ? (
                                <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                            className="mb-4 h-8 w-8 text-gray-500"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 16"
                                        >
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
                                </label>
                            ) : (
                                <div className="group relative">
                                    <img src={data.previewUrl} alt="Preview" className="h-48 w-full rounded-lg border border-gray-200 object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-lg bg-black/40 opacity-0 transition group-hover:opacity-100">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="replace-facilities-image"
                                            onChange={handleImageChange} // reuse your same handler
                                        />

                                        {/* Replace image button */}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-12 w-12 rounded-full bg-white p-0 transition-transform duration-200 hover:scale-110 hover:bg-red-50"
                                            size="lg"
                                            onClick={() => document.getElementById('replace-facilities-image')?.click()}
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
                                                    facility_image: null,
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
                            <Label className="mb-2 block text-sm font-medium text-gray-700">Facility Name <span className="text-red-500">*</span></Label>
                            <Input
                                placeholder="e.g., Library"
                                value={data.facility_name}
                                onChange={(e) => setData({ ...data, facility_name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Label className="mb-2 block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></Label>
                            <Textarea
                                placeholder="Enter a description for the facility..."
                                value={data.description}
                                onChange={(e) => setData({ ...data, description: e.target.value })}
                                autoResize
                                minHeight={100}
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6 flex justify-end space-x-2">
                        <DialogClose asChild>
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="noborder" type="submit">
                            {type === 'edit' ? 'Save Changes' : 'Add Facility'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
