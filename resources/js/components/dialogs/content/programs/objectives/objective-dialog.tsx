import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/text-area';
import { ProgramObjectives } from '@/types';
import { useState } from 'react';

interface ObjectiveForm {
    objective_id: number | null;
    title: string;
    description: string;
}

interface ObjectiveDialogProps {
    type?: 'add' | 'edit';
    onClose: () => void;
    onSave: (obj: ObjectiveForm) => void;
    objective?: ProgramObjectives;
    nextObjectiveNumber?: number; // ← NEW
}

export default function ObjectiveDialog({ type, onClose, onSave, objective, nextObjectiveNumber }: ObjectiveDialogProps) {
    const [data, setData] = useState<ObjectiveForm>({
        objective_id: objective?.program_objective_id || null,
        title:
            type === "add"
                ? `Objective ${nextObjectiveNumber ?? 1}`               // ← AUTO-GENERATED TITLE
                : objective?.objective_title || '',
        description: objective?.objective_description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{type === 'edit' ? 'Edit Objective' : 'Add Objective'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Objective Title</Label>
                        <Input
                            className="mt-2"
                            type="text"
                            // required
                            value={data.title}                               // ← switched to value
                            onChange={(e) => setData({ ...data, title: e.target.value })}
                            disabled
                        />
                    </div>

                    <div>
                        <Label>Description <span className="text-red-500">*</span></Label>
                        <Textarea
                            className="mt-2"
                            // required
                            value={data.description}
                            onChange={(e) => setData({ ...data, description: e.target.value })}
                            placeholder="Describe the learning objective..."
                            required
                            autoResize
                        />
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" variant="noborder">
                            {type === 'edit' ? 'Save Changes' : 'Add Objective'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
