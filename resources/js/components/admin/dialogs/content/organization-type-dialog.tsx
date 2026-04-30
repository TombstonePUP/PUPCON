import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OrganizationTypes } from '@/types/content';
import { useState } from 'react';

interface OrganizationTypeDialogProps {
    type: 'edit' | 'add';
    orgType: OrganizationTypes | null;
    onClose: () => void;
    onSave: (orgType: OrganizationTypes) => void;
}

export function OrganizationTypeDialog({ ...props }: OrganizationTypeDialogProps) {
    const { type, orgType, onClose, onSave } = props;

    const [data, setData] = useState<OrganizationTypes>({
        type_id: orgType?.type_id || 0,
        type_name: orgType?.type_name || '',
    });

    const handleSubmit = () => {
        onSave(data);
        onClose();
    };
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-foreground text-lg font-medium">{type === 'edit' ? 'Edit Org. Type' : 'Add Org. Type'}</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        {type === 'edit'
                            ? 'Make changes to the organization type details below.'
                            : 'Fill out the details below to add a new organization type.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-2">
                        <div className="mt-6">
                            <Label className="text-foreground mb-2 block text-sm font-medium">
                                Type Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                placeholder="e.g., Academic Organizations"
                                value={data.type_name}
                                onChange={(e) => setData({ ...data, type_name: e.target.value })}
                                required
                                autoFocus
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
                            {type === 'edit' ? 'Save Changes' : 'Add Type'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
