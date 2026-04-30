import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Organizations, OrganizationTypes } from '@/types/content';
import { useState } from 'react';

interface OrganizationDialogProps {
    type?: 'edit' | 'add';
    org?: Organizations | null;
    selectedOrgType: OrganizationTypes;
    onClose: () => void;
    onSave: (org: Organizations) => void;
}

export function OrganizationDialog({ ...props }: OrganizationDialogProps) {
    const { type, org, selectedOrgType, onClose, onSave } = props;
    const [data, setData] = useState<Organizations>({
        organization_id: org?.organization_id || 0,
        organization_name: org?.organization_name || '',
        affiliation: org?.affiliation || '',
        type_id: selectedOrgType.type_id,
    });

    const handleSubmit = () => {
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-foreground text-lg font-medium">
                        {type === 'edit' ? 'Edit Organization' : 'Add Organization'}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        {type === 'edit'
                            ? 'Make changes to the organization details below.'
                            : 'Fill out the details below to add a new organization.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-2">
                        <div>
                            <Label className="text-foreground mb-2 block text-sm font-medium">Organization Name</Label>
                            <Input
                                placeholder="Enter organization name"
                                value={data.organization_name}
                                onChange={(e) => setData({ ...data, organization_name: e.target.value })}
                                autoFocus
                            />
                        </div>
                        <div>
                            <Label className="text-foreground mb-2 block text-sm font-medium">Affiliation</Label>
                            <Input
                                placeholder="e.g., BS Information Technology"
                                value={data.affiliation}
                                onChange={(e) => setData({ ...data, affiliation: e.target.value })}
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
                            {type === 'edit' ? 'Save Changes' : 'Add Organization'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
