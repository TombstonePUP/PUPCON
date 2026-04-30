import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/text-area';
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

interface TaskForceAreaOfficialDialogProps {
    chairman?: LocalTaskForce;
    action: 'add' | 'edit';
    onClose: () => void;
    onSave: (data: LtfChairmanForm) => void;
}

export default function TaskForceAreaOfficialDialog({ ...props }: TaskForceAreaOfficialDialogProps) {
    const { chairman, action, onClose, onSave } = props;
    const generate_id = () => {
        return Math.floor(Math.random() * 1000);
    };

    const [data, setData] = useState<LtfChairmanForm>({
        local_task_force_id: chairman?.local_task_force_id,
        area_name: chairman?.area_name || '',
        first_name: chairman?.first_name || '',
        last_name: chairman?.last_name || '',
        official: false,
        official_position: null,
        profile_image: null,
        previewUrl: chairman?.profile_image_path || null,
        members: chairman?.members
            ? chairman.members.map((member) => ({
                member_id: member.member_id,
                local_task_force_id: chairman.local_task_force_id,
                full_name: member.full_name,
                role: member.role,
            }))
            : [],
    });

    const [coChairmenText, setCoChairmenText] = useState(
        chairman?.members
            ?.filter((m) => m.role === 'Co-Chairman')
            .map((m) => m.full_name)
            .join('\n') || '',
    );

    const [membersText, setMembersText] = useState(
        chairman?.members
            ?.filter((m) => m.role === 'Member')
            .map((m) => m.full_name)
            .join('\n') || '',
    );

    const rebuildMembers = (oldMembers, newLines, role, localTaskForceId) => {
        const updated: MemberForm[] = [];

        for (let i = 0; i < newLines.length; i++) {
            const name = newLines[i].trim();
            if (!name) continue;

            if (oldMembers[i]) {
                // Existing member: KEEP id
                updated.push({
                    member_id: oldMembers[i].member_id,
                    full_name: name,
                    role: role,
                    local_task_force_id: localTaskForceId,
                });
            } else {
                // New member (no old record at this index)
                updated.push({
                    member_id: generate_id(),
                    full_name: name,
                    role: role,
                    local_task_force_id: localTaskForceId,
                });
            }
        }

        return updated;
    };

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
        const oldCo = data.members.filter((m) => m.role === 'Co-Chairman');
        const oldMembers = data.members.filter((m) => m.role === 'Member');

        const coNames = coChairmenText
            .split('\n')
            .map((n) => n.trim())
            .filter(Boolean);
        const memberNames = membersText
            .split('\n')
            .map((n) => n.trim())
            .filter(Boolean);

        const newCo = rebuildMembers(oldCo, coNames, 'Co-Chairman', data.local_task_force_id);
        const newMembers = rebuildMembers(oldMembers, memberNames, 'Member', data.local_task_force_id);

        const finalData = {
            ...data,
            members: [...newCo, ...newMembers],
        };

        setData(finalData);
        onSave(finalData);
        onClose();
    };

    return (
        <>
            <Dialog open={true} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-gray-900">
                            {action === 'edit' ? 'Edit Area Chairman' : 'Add New Area Chairman'}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Fill out the form below to {action === 'edit' ? 'update the area chairman details.' : 'add a new area chairman.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-foreground">Area Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        placeholder="e.g., Area I: Vision, Mission..."
                                        value={data.area_name}
                                        onChange={(e) => setData((prev) => ({ ...prev, area_name: e.target.value }))}
                                        autoFocus
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-foreground">Chairman First Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        placeholder="Enter first name..."
                                        value={data.first_name}
                                        onChange={(e) => setData((prev) => ({ ...prev, first_name: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-foreground">Chairman Last Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        placeholder="Enter last name..."
                                        value={data.last_name}
                                        onChange={(e) => setData((prev) => ({ ...prev, last_name: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-foreground">Chairman Photo</Label>
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
                                                    id="replace-chairman-image"
                                                    onChange={handleImageChange} // reuse your same handler
                                                />

                                                {/* Replace image button */}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="h-12 w-12 rounded-full bg-white p-0 transition-transform duration-200 hover:scale-110 hover:bg-red-50"
                                                    size="lg"
                                                    onClick={() => document.getElementById('replace-chairman-image')?.click()}
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
                            </div>

                            <div className="flex flex-col space-y-4">
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-foreground">Co-Chairmen (Optional)</Label>
                                    <Textarea
                                        placeholder="Enter one co-chairman name per line..."
                                        value={coChairmenText}
                                        onChange={(e) => setCoChairmenText(e.target.value)}
                                        autoResize
                                        minHeight={100}
                                    />
                                </div>

                                <div className="flex-1">
                                    <Label className="mb-2 block text-sm font-medium text-foreground">Members (Optional)</Label>
                                    <Textarea
                                        placeholder="Enter one member name per line..."
                                        value={membersText}
                                        onChange={(e) => setMembersText(e.target.value)}
                                        autoResize
                                        minHeight={150}
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
                            <Button type="submit" variant="noborder">
                                {action === 'edit' ? 'Update Chairman' : 'Add Chairman'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
