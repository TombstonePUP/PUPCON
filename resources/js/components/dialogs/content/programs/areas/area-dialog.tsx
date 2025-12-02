import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/text-area';
import { AccreditationLevels, Program, ProgramAreas } from '@/types';
import { useForm } from '@inertiajs/react';
import { Edit2, Trash2, Upload } from 'lucide-react';
import { useEffect } from 'react';

interface AreaDialogProps {
    type?: 'add' | 'edit';
    area?: ProgramAreas;
    program: Program;
    level: AccreditationLevels;
    onClose: () => void;
}

interface AreaForm {
    area_id?: number;
    area_number: string;
    area_name: string;
    area_description?: string;
    area_image?: File;
    previewUrl?: string;
}

export default function AreaDialog({ type, area, program, level, onClose }: AreaDialogProps) {
    const { data, setData, post, patch, processing, errors } = useForm<AreaForm>({
        area_id: area?.area_id || undefined,
        area_number: area?.area_number || '',
        area_name: area?.area_name || '',
        area_description: area?.area_description || '',
        area_image: undefined,
        previewUrl: area?.area_image_path || '',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setData({
                ...data,
                area_image: file,
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (type === 'edit') {
            post(
                route('manage.area.update', {
                    program_id: program.program_id,
                    level_id: level.accreditation_level_id,
                    area_id: area?.area_id,
                }),
                {
                    onSuccess: () => onClose(),
                },
            );
        } else {
            post(
                route('manage.area.store', {
                    program_id: program.program_id,
                    level_id: level.accreditation_level_id,
                }),
                {
                    onSuccess: () => onClose(),
                },
            );
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-4xl'>
                <DialogHeader>
                    <DialogTitle className="mb-4 text-lg font-medium text-gray-900">{type === 'edit' ? 'Edit Area' : 'Add New Area'}</DialogTitle>
                    <DialogDescription className="flex flex-col text-sm text-gray-500">
                        {type === 'edit' ? 'Editing in ' : ' Adding in '} {program.program_name}
                        <span className="font-medium">{level?.level === 0 ? 'Preliminary Survey Visit' : 'Accreditation Level ' + level.level}</span>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 space-y-4">
                    <div className="flex gap-8">
                        {!data.previewUrl ? (
                            <label className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-12 text-center transition-all duration-300 hover:border-[#7f1414]/70 w-xl">
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                <div className="flex flex-col items-center justify-center gap-4 pt-5 pb-6">
                                    <div className="relative">
                                        <div className="rounded-fullopacity-20 absolute inset-0 animate-pulse"></div>
                                        <div className="relative grid h-16 w-16 place-items-center rounded-full border-2 border-dashed transition-transform duration-300 group-hover:scale-105">
                                            <Upload className="h-6 w-6 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className="mb-1 text-lg font-semibold text-gray-700">Upload area banner</p>
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
                                    <input id="area-replace-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-12 w-12 rounded-full bg-white p-0"
                                        onClick={() => document.getElementById('area-replace-image')?.click()}
                                    >
                                        <Edit2 className="h-5 w-5 text-red-600" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-12 w-12 rounded-full bg-white p-0"
                                        onClick={(e) =>
                                            setData({
                                                ...data,
                                                area_image: undefined,
                                                previewUrl: '',
                                            })
                                        }
                                    >
                                        <Trash2 className="h-5 w-5 text-red-600" />
                                    </Button>
                                </div>
                            </div>
                        )}
                        <div className='flex flex-col gap-4'>
                            <div></div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Area Number (numeric numbers only)</Label>
                                <Input
                                    type="text"
                                    value={data.area_number}
                                    onChange={(e) => setData('area_number', e.target.value)}
                                    placeholder="e.g., 1, 2 ,3"
                                    disabled={processing}
                                />
                                <InputError message={errors.area_number} className="mt-1" />
                            </div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Area Name</Label>
                                <Input
                                    type="text"
                                    value={data.area_name}
                                    onChange={(e) => setData('area_name', e.target.value)}
                                    placeholder="Enter area name"
                                    disabled={processing}
                                />
                                <InputError message={errors.area_name} className="mt-1" />
                            </div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Area Description</Label>
                                <Textarea
                                    value={data.area_description}
                                    onChange={(e) => setData('area_description', e.target.value)}
                                    placeholder="Enter area description"
                                    disabled={processing}
                                />
                                <InputError message={errors.area_description} className="mt-1" />
                            </div>

                            <div className="my-0 mt-6 rounded-md border border-blue-100 bg-blue-50 p-4">
                                <p className="text-sm text-blue-800">
                                    <span className="mb-1 block font-semibold text-blue-900">Note</span>
                                    In the <span>area number</span> field, make sure to use numeric numbers to avoid issues.
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-2 gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" variant="noborder" disabled={processing}>
                            {type === 'edit' ? 'Update Area' : 'Add Area'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
