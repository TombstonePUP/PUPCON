import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocalTaskForce } from '@/types/content';
import { Edit2, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface MemberForm {
    member_id?: number;
    local_task_force_id: number;
    full_name: string;
    role?: string | null;
    local_task_force?: LtfChairmanForm;
}

interface LtfChairmanForm {
    local_task_force_id?: number;
    area_name?: string;
    first_name: string;
    last_name: string;
    official: boolean;
    official_position?: string | null;
    profile_image: File | null;
    previewUrl?: string | null;
    members: MemberForm[];
}

interface TaskForceOfficialDialogProps {
    official?: LocalTaskForce;
    action: 'add' | 'edit';
    onClose: () => void;
    onSave: (data: LtfChairmanForm) => void;
}
export default function TaskForceOfficialDialog({ ...props }: TaskForceOfficialDialogProps) {
    const { official, action, onClose, onSave } = props;
    const [data, setData] = useState<LtfChairmanForm>({
        local_task_force_id: official?.local_task_force_id,
        area_name: official?.area_name || null,
        first_name: official?.first_name || '',
        last_name: official?.last_name || '',
        official: true,
        official_position: official?.official_position || '',
        profile_image: null,
        previewUrl: official?.profile_image_path || null,
        members: official?.members
            ? official.members.map((member) => ({
                member_id: member.member_id,
                local_task_force_id: member.local_task_force_id,
                full_name: member.full_name,
            }))
            : [],
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
                        <DialogTitle>{action === 'add' ? 'Add Task Force Official' : 'Edit Task Force Official'}</DialogTitle>
                        <DialogDescription className="mt-2">
                            {action === 'add'
                                ? 'Fill out the form below to add a new task force official.'
                                : 'Update the details of the task force official below.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-foreground">Photo</Label>
                                {!data.previewUrl ? (
                                    <Label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted hover:bg-muted/80">
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
                                                id="replace-official-image"
                                                onChange={handleImageChange} // reuse your same handler
                                            />

                                            {/* Replace image button */}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-12 w-12 rounded-full bg-white p-0 transition-transform duration-200 hover:scale-110 hover:bg-red-50"
                                                size="lg"
                                                onClick={() => document.getElementById('replace-official-image')?.click()}
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
                            </div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-foreground">First Name</Label>
                                <Input
                                    placeholder="Enter first name"
                                    value={data.first_name}
                                    onChange={(e) => setData((prev) => ({ ...prev, first_name: e.target.value }))}
                                    autoFocus
                                    required
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-foreground">Last Name</Label>
                                <Input
                                    placeholder="Enter last name"
                                    value={data.last_name}
                                    onChange={(e) => setData((prev) => ({ ...prev, last_name: e.target.value }))}
                                    autoFocus
                                    required
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-foreground">Position</Label>
                                <Input
                                    placeholder="e.g., Overall Chairman"
                                    value={data.official_position}
                                    onChange={(e) => setData((prev) => ({ ...prev, official_position: e.target.value }))}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" variant="noborder">
                                {action === 'edit' ? 'Save Changes' : 'Add Official'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
