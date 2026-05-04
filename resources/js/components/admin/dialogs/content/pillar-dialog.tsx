import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pillars } from '@/types/content';
import { useState } from 'react';

interface PillarDialogProps {
    type?: 'edit' | 'add';
    pillar?: Pillars | null;
    onClose: () => void;
    onSave: (pillar: Pillars) => void;
}

export default function PillarDialog({ ...props }: PillarDialogProps) {
    const { type, pillar, onClose, onSave } = props;
    const [data, setData] = useState<Pillars>({
        pillar_id: pillar?.pillar_id || Date.now(),
        pillar_title: pillar?.pillar_title || '',
    });

    const handleSubmit = () => {
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-foreground text-lg font-medium">{type === 'edit' ? 'Edit Pillar' : 'Add Pillar'}</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        {type === 'edit' ? 'Make changes to the pillar details below.' : 'Fill out the details below to add a new pillar.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="mt-1">
                        <label className="text-foreground mb-1 block text-sm font-medium">
                            Pillar Title <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="e.g., Teaching and Learning"
                            value={data.pillar_title}
                            onChange={(e) => setData({ ...data, pillar_title: e.target.value })}
                            required
                            autoFocus
                        />
                        <p className="mt-2 text-xs text-gray-500">This will be added as a new Pillar.</p>
                    </div>
                    <DialogFooter className="flex justify-end space-x-2">
                        <DialogClose asChild>
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="noborder" type="submit">
                            {type === 'edit' ? 'Save Changes' : 'Add Pillar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
