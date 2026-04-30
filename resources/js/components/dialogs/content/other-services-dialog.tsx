import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/text-area';
import { OtherServices } from '@/types/content';
import { useState } from 'react';

interface ServicesDialogProps {
    type?: 'edit' | 'add';
    service?: OtherServices | null;
    onClose: () => void;
    onSave: (service: OtherServices) => void;
}

export default function ServicesDialog({ ...props }: ServicesDialogProps) {
    const { type, service, onClose, onSave } = props;
    const [data, setData] = useState<OtherServices>({
        service_id: service?.service_id || Date.now(),
        service_name: service?.service_name || '',
        description: service?.description || '',
        service_link: service?.service_link || '',
    });

    const handleSubmit = () => {
        onSave(data);
        onClose();
    };

    return (
        <>
            <Dialog open={true} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-foreground text-lg font-medium">{type === 'edit' ? 'Edit Service' : 'Add Service'}</DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm">
                            {type === 'edit' ? 'Make changes to the service details below.' : 'Fill out the details below to add a new service.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6 max-h-[70vh] space-y-4 overflow-y-auto pr-2">
                        <div>
                            <Label className="text-foreground mb-2 block text-sm font-medium">Title</Label>
                            <Input
                                placeholder="e.g., University Student Portal"
                                value={data.service_name}
                                onChange={(e) => setData({ ...data, service_name: e.target.value })}
                                autoFocus
                            />
                        </div>
                        <div>
                            <Label className="text-foreground mb-2 block text-sm font-medium">Description</Label>
                            <Textarea
                                placeholder="Enter a brief description..."
                                value={data.description}
                                onChange={(e) => setData({ ...data, description: e.target.value })}
                                autoResize
                                minHeight={80}
                            />
                        </div>
                        <div>
                            <Label className="text-foreground mb-2 block text-sm font-medium">URL (Link)</Label>
                            <Input
                                placeholder="https://studentportal.example.com"
                                value={data.service_link}
                                onChange={(e) => setData({ ...data, service_link: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex justify-end space-x-2">
                        <DialogClose asChild>
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="noborder" onClick={handleSubmit}>
                            {type === 'edit' ? 'Save Changes' : 'Add Service'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
