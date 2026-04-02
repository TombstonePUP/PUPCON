import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ExhibitOutlines, Exhibits } from '@/types/exhibits';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ExhibitOutlineForm {
    outline_id?: number;
    category: string;
    exhibit_id: number;
    outline_description: string;
    file: File | null;
    previewFile: string | null;
}

interface ExhibitOutlineDialogProps {
    category?: string[];
    outline?: ExhibitOutlines | null;
    exhibit?: Exhibits | null;
    type: 'add' | 'edit';
    onClose: () => void;
    onUpdate?: (outline: ExhibitOutlines) => void;
}

function getUpdatedFilePath(outline: ExhibitOutlines | null, exhibit: Exhibits | null, category: string, description: string) {
    if (!outline?.exhibit_files || !exhibit) return null;

    const slugify = (text: string) => text.toLowerCase().trim().replace(/\s+/g, '_'); // lowercase + replace spaces with _

    const exhibitNameSlug = slugify(exhibit.exhibit_name);
    const categorySlug = slugify(category);
    const descriptionSlug = slugify(description);

    return `/storage/exhibits/${exhibitNameSlug}/${categorySlug}/${descriptionSlug}.pdf`;
}

export default function ExhibitOutlineDialog({ outline, type, exhibit, onClose, onUpdate }: ExhibitOutlineDialogProps) {
    const [isUploading, setIsUploading] = useState(false);
    const { data, setData, post, errors, processing, reset } = useForm<ExhibitOutlineForm>({
        outline_id: outline?.exhibit_outline_id || undefined,
        category: outline?.category || '',
        exhibit_id: outline?.exhibit_id || exhibit?.exhibit_id || 0,
        outline_description: outline?.outline_description || '',
        file: null,
        previewFile: outline?.previewFile || null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsUploading(true);
            post(route('exhibit.outline.file.upload'), {
                onProgress: (progress) => {
                    if (progress?.percentage) {
                        toast.info('Uploading...', {
                            description: (
                                <div className="flex w-full items-center gap-1">
                                    <Progress value={progress.percentage} className="h-2 w-68" />
                                    <p className="text-right text-xs text-gray-500">{progress.percentage}%</p>
                                </div>
                            ),
                            id: 'uploading',
                        });
                    }
                },
                onSuccess: () => {
                    setIsUploading(false);
                    const updatedFilePath = data.file
                        ? URL.createObjectURL(data.file) // new uploaded file
                        : getUpdatedFilePath(outline ?? null, exhibit ?? null, data.category, data.outline_description); // moved file path
                    const outlineToUpdate: ExhibitOutlines = {
                        exhibit_outline_id: data.outline_id || Date.now(),
                        category: data.category,
                        outline_description: data.outline_description,
                        exhibit_files: data.file
                            ? {
                                file_name: data.file.name,
                                file_path: URL.createObjectURL(data.file),
                            }
                            : {
                                file_name: data.outline_description,
                                file_path: updatedFilePath || '',
                            },
                        exhibit_id: data.exhibit_id,
                    };

                    console.log('outlineToUpdate: ', outlineToUpdate);
                    if (onUpdate) onUpdate(outlineToUpdate);
                    console.log(data);
                    reset();
                    onClose();
                },

                onError: (errors) => {
                    toast.dismiss('uploading');
                    toast.error('Failed to upload document', {
                        description: errors.document ?? 'There was an error uploading the document.',
                    });
                    setIsUploading(false);
                },
            });
        } catch (error) {
            toast.dismiss('uploading');
            toast.error('Unexpected error occurred', {
                description: error instanceof Error ? error.message : 'An unexpected error occurred during upload.',
            });
            setIsUploading(false);
        }
    };
    // console.log('test: ' + category);

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="space-y-6 sm:max-w-lg">
                <DialogHeader className="flex flex-col items-start text-left">
                    <DialogTitle className="text-lg font-medium text-foreground">
                        {type === 'add' ? 'Add Exhibit Outline' : 'Edit Exhibit Outline'}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {type === 'add'
                            ? 'Fill out the form below to add a new exhibit outline.'
                            : 'Update the details of the exhibit outline below.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="m-0">
                    <div className="flex w-full flex-col items-center justify-center">
                        <Label className="mb-2 w-full text-left text-sm font-medium text-foreground">Upload PDF File</Label>
                        {!data.file ? (
                            <label
                                className={`flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted hover:bg-muted/80 ${isUploading ? 'pointer-events-none opacity-70' : 'cursor-pointer'
                                    }`}
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg
                                        className="mb-4 h-8 w-8 text-gray-500"
                                        aria-hidden="true"
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
                                    <p className="text-xs text-gray-500">PDF</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".pdf"
                                    disabled={isUploading || processing}
                                    onChange={(e) => {
                                        const file = e.target.files ? e.target.files[0] : null;
                                        setData('file', file);
                                    }}
                                />
                            </label>
                        ) : (
                            <div
                                className={`flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted hover:bg-muted/80 ${isUploading ? 'pointer-events-none opacity-70' : ''
                                    }`}
                            >
                                <span className="text-sm font-semibold text-gray-700">{data.file.name}</span>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    disabled={isUploading}
                                    onClick={() => setData('file', null)}
                                >
                                    Remove File
                                </Button>
                            </div>
                        )}
                        <InputError message={errors.file} className="mt-2" />
                    </div>
                    <div className="grid w-full gap-4 py-4">
                        <div className="space-y-2">
                            <Label className="mb-2 block text-sm font-medium text-foreground">Category</Label>

                            <input
                                type="text"
                                id="category"
                                value={data.category}
                                onChange={(e) => setData({ ...data, category: e.target.value })}
                                placeholder="Enter category"
                                disabled={isUploading || processing}
                                className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:outline-none sm:text-sm"
                            />

                            <InputError message={errors.category} />
                        </div>
                    </div>

                    <div>
                        <div>
                            <Label htmlFor="outline_description" className="mb-2 block text-sm font-medium text-foreground">
                                Outline Description
                            </Label>
                            <input
                                type="text"
                                id="outline_description"
                                placeholder="Enter outline description"
                                value={data.outline_description}
                                onChange={(e) => setData({ ...data, outline_description: e.target.value })}
                                disabled={isUploading || processing}
                                className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-1 focus:outline-none sm:text-sm"
                            />
                            <InputError message={errors.outline_description} className="mt-2" />
                        </div>
                    </div>
                    <DialogFooter className="mt-10 sm:justify-end">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" id="exhibit-outline-dialog-close">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" className="border-none" disabled={isUploading || processing}>
                            {type === 'add' ? 'Add Outline' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
