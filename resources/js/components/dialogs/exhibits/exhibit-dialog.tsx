'use client';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Exhibits } from '@/types/exhibits';
import { useForm } from '@inertiajs/react';
import { Edit2, HelpCircleIcon, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

interface ExhibitDialogProps {
    type: 'add' | 'edit';
    exhibit?: Exhibits | null;
    onClose: () => void;
}

interface ExhibitForm {
    exhibit_id?: number;
    exhibit_name: string;
    image?: File | null;
    previewUrl?: string | null;
    container?: boolean;
}

export default function ExhibitDialog({ type, exhibit, onClose }: ExhibitDialogProps) {
    const { data, setData, post, patch, processing, errors } = useForm<ExhibitForm>({
        exhibit_id: exhibit ? exhibit.exhibit_id : undefined,
        exhibit_name: exhibit ? exhibit.exhibit_name : '',
        image: null,
        previewUrl: exhibit ? exhibit.image_path : null,
        container: exhibit ? exhibit.container : false,
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('exhibits.store'), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium text-foreground">{type === 'add' ? 'Add New Exhibit' : 'Edit Exhibit'}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {type === 'add' ? 'Fill out the details below to create a new exhibit.' : 'Make changes to the exhibit details below.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <Label className="mb-2 block text-sm font-medium text-gray-700">Exhibit Image</Label>
                            {!data.previewUrl ? (
                                <Label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
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
                                        <p className="text-sm text-muted-foreground">
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
                                            id="replace-exhibit-image"
                                            onChange={handleImageChange} // reuse your same handler
                                        />

                                        {/* Replace image button */}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-12 w-12 rounded-full bg-white p-0 transition-transform duration-200 hover:scale-110 hover:bg-red-50"
                                            size="lg"
                                            onClick={() => document.getElementById('replace-exhibit-image')?.click()}
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
                            <InputError message={errors.image} className="mt-2" />
                        </div>
                        <div>
                            <Label className="mb-2 block text-sm font-medium text-gray-700">Exhibit Title  <span className="text-red-500">*</span></Label>
                            <Input
                                type="text"
                                required
                                placeholder="e.g., Student Handbook"
                                value={data.exhibit_name}
                                onChange={(e) => setData({ ...data, exhibit_name: e.target.value })}
                                disabled={processing}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 transition-colors focus:border-[#7f1414] focus:ring-1 focus:ring-[#7f1414]"
                            />
                            <InputError message={errors.exhibit_name} className="mt-2" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Switch
                                id="is-container-mode"
                                checked={data.container}
                                onCheckedChange={(checked) => setData({ ...data, container: checked })}
                                disabled={processing}
                            />
                            <Label
                                htmlFor="is-container-mode"
                                className="block text-sm leading-none font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Exhibit Container
                            </Label>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="flex cursor-default items-center gap-1 italic">
                                            <HelpCircleIcon className="h-auto w-4 text-red-800" />
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent className='text-center'>Enable this switch to allow uploading multiple files in this category.</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <DialogFooter className="pt-4">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" variant={'noborder'} disabled={processing}>
                                {type === 'edit' ? 'Save Changes' : 'Add Exhibit'}
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
