import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Administration } from '@/types/content';
import { Edit2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AdministrationDialogProps {
    official?: Administration;
    type: 'edit' | 'add';
    onSave: (official: OfficialForm) => void;
    onClose: () => void;
}

interface OfficialForm {
    administration_id?: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    suffix?: string;
    type: string;
    position: string;
    profile?: File | null;
    previewUrl?: string | null;
}

export function AdministrationDialog({ official, type, onSave, onClose }: AdministrationDialogProps) {
    const [data, setData] = useState<OfficialForm>({
        administration_id: official?.administration_id || 0,
        first_name: official?.first_name || '',
        middle_name: official?.middle_name || '',
        last_name: official?.last_name || '',
        suffix: official?.suffix || '',
        position: official?.position || '',
        type: official?.type || '',
        profile: null,
        previewUrl: official?.profile_picture_path || null,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setData({ ...data, profile: file, previewUrl });
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
                    <DialogTitle className="text-lg font-medium text-foreground">{type === 'edit' ? 'Edit Official' : 'Add Official'}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {type === 'edit'
                            ? `Modify the details of "${official?.first_name}${official?.last_name}".`
                            : 'Fill in the details to add a new official.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-2">
                        <div>
                            {!data.previewUrl ? (
                                <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted hover:bg-muted/80">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                            className="mb-4 h-8 w-8 text-muted-foreground"
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
                                </label>
                            ) : (
                                <div className="group relative">
                                    <img src={data.previewUrl} alt="Preview" className="h-48 w-full rounded-lg border border-gray-200 object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-lg bg-black/40 opacity-0 transition group-hover:opacity-100">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="replace-admin-image"
                                            onChange={handleImageChange} // reuse your same handler
                                        />

                                        {/* Replace image button */}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-12 w-12 rounded-full bg-white p-0 transition-transform duration-200 hover:scale-110 hover:bg-red-50"
                                            size="lg"
                                            onClick={() => document.getElementById('replace-admin-image')?.click()}
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
                                                    profile: null,
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
                            <Label className="mb-2 block text-sm font-medium text-foreground">First Name <span className="text-red-500">*</span></Label>
                            <Input
                                placeholder="e.g., Juan"
                                value={data.first_name}
                                onChange={(e) => setData({ ...data, first_name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Label className="mb-2 block text-sm font-medium text-foreground">Middle Name</Label>
                            <Input
                                placeholder="e.g., Santos"
                                value={data.middle_name}
                                onChange={(e) => setData({ ...data, middle_name: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label className="mb-2 block text-sm font-medium text-foreground">Last Name <span className="text-red-500">*</span></Label>
                            <Input
                                placeholder="e.g., Dela Cruz"
                                value={data.last_name}
                                onChange={(e) => setData({ ...data, last_name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Label className="mb-2 block text-sm font-medium text-foreground">Suffix</Label>
                            <Input
                                placeholder="e.g., Sr., Jr., III"
                                value={data.suffix}
                                onChange={(e) => setData({ ...data, suffix: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label className="mb-2 block text-sm font-medium text-foreground">Official Type <span className="text-red-500">*</span></Label>
                            <Select value={data.type ? String(data.type) : ''} onValueChange={(value) => setData({ ...data, type: value })} required>
                                <SelectTrigger className="w-full" tabIndex={3}>
                                    <SelectValue placeholder="Select Official" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem key={'University'} value={'University'}>
                                            University Official
                                        </SelectItem>
                                        <SelectItem key={'Campus'} value={'Campus'}>
                                            Campus Official
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label className="mb-2 block text-sm font-medium text-foreground">Position <span className="text-red-500">*</span></Label>
                            <Input
                                placeholder="e.g., President"
                                value={data.position}
                                onChange={(e) => setData({ ...data, position: e.target.value })}
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
                            {type === 'edit' ? 'Save Changes' : 'Add Official'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
