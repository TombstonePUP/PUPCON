import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/text-area';
import { CampusDirectors } from '@/types/content';
import { Edit2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DirectorsForm {
    director_id: number;
    name: string;
    term_start_date: string;
    term_end_date: string;
    description: string;
    profile_image: File | null;
    previewUrl?: string | null;
}

interface DirectorsDialogProps {
    director?: CampusDirectors;
    type: 'edit' | 'add';
    onSave: (director: DirectorsForm) => void;
    onClose: () => void;
}

export function DirectorsDialog({ ...props }: DirectorsDialogProps) {
    const { director, type, onSave, onClose } = props;
    const [data, setData] = useState<DirectorsForm>({
        director_id: director?.director_id || 0,
        name: director?.name || '',
        term_start_date: director?.term_start_date || '',
        term_end_date: director?.term_end_date || '',
        description: director?.description || '',
        profile_image: null,
        previewUrl: director?.profile_image_path || null,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setData({ ...data, profile_image: file, previewUrl });
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
                        <DialogTitle className="text-foreground text-lg font-medium">
                            {type === 'edit' ? 'Edit Director' : 'Add Director'}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm">
                            {type === 'edit' ? 'Make changes to the director details below.' : 'Fill out the details below to add a new director.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="max-h-[70vh] overflow-y-auto pr-2">
                            <div>
                                <Label className="text-foreground mb-2 block text-sm font-medium">President's Photo</Label>
                                {!data.previewUrl ? (
                                    <Label className="border-border bg-muted hover:bg-muted/80 flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg
                                                className="text-muted-foreground mb-4 h-8 w-8"
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
                                            <p className="text-muted-foreground text-sm">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">JPG, PNG, JPEG</p>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </Label>
                                ) : (
                                    <div className="group relative">
                                        <img
                                            src={data.previewUrl}
                                            alt="Preview"
                                            className="h-48 w-full rounded-lg border border-gray-200 object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-lg bg-black/40 opacity-0 transition group-hover:opacity-100">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                id="replace-director-image"
                                                onChange={handleImageChange} // reuse your same handler
                                            />

                                            {/* Replace image button */}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-12 w-12 rounded-full bg-white p-0 transition-transform duration-200 hover:scale-110 hover:bg-red-50"
                                                size="lg"
                                                onClick={() => document.getElementById('replace-director-image')?.click()}
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
                                                        profile_image: null,
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
                            <div className="mt-2 space-y-4">
                                <div>
                                    <Label className="text-foreground mb-2 block text-sm font-medium">
                                        Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        placeholder="Enter president's full name"
                                        value={data.name}
                                        onChange={(e) => setData({ ...data, name: e.target.value })}
                                        autoFocus
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="text-foreground mb-2 block text-sm font-medium">
                                        Year Started <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        placeholder="e.g., 1988-1992"
                                        value={data.term_start_date}
                                        onChange={(e) => setData({ ...data, term_start_date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="text-foreground mb-2 block text-sm font-medium">Year Ended</Label>
                                    <Input
                                        placeholder="e.g., 1988-1992"
                                        value={data.term_end_date}
                                        onChange={(e) => setData({ ...data, term_end_date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label className="text-foreground mb-2 block text-sm font-medium">
                                        Description / Details <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        placeholder="Enter details about their term..."
                                        value={data.description}
                                        onChange={(e) => setData({ ...data, description: e.target.value })}
                                        autoResize
                                        minHeight={100}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-6 flex justify-end space-x-2">
                            <DialogClose asChild>
                                <Button variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button variant="noborder" type="submit">
                                {type === 'edit' ? 'Save Changes' : 'Add Director'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
