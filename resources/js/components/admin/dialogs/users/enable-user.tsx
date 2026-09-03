'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserRecords } from '@/types/user-management';
import { useForm } from '@inertiajs/react';

interface EnableUserDialogProps {
    user: UserRecords;
    onClose: () => void;
}

export function EnableUser({ user, onClose }: EnableUserDialogProps) {
    const { data, patch, reset } = useForm<{ user_id: number }>({
        user_id: user.user_id,
    });

    const enableUser = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('users.enable'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-foreground text-lg font-medium">
                        {/* <User className="h-5 w-5 text-[#7f1414]" /> */}
                        Enable User
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">Are you sure you want to enable this user?</DialogDescription>
                </DialogHeader>

                <div className="border-info/30 bg-info/10 text-info-foreground mt-12 rounded-md border p-4">
                    <p className="text-sm">This action will enable the user account. The user will be able to access the system again.</p>
                </div>

                <DialogFooter className="space-x-2">
                    <DialogClose asChild>
                        <Button variant="outline" tabIndex={1}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button variant="noborder" tabIndex={2} onClick={enableUser}>
                        Enable
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
