'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserRecords } from '@/types/user-management';
import { useForm } from '@inertiajs/react';

interface DisableUserDialogProps {
    user: UserRecords;
    onClose: () => void;
}

export function DisableUser({ user, onClose }: DisableUserDialogProps) {
    const { data, patch, reset } = useForm<{ user_id: number }>({
        user_id: user.user_id,
    });

    const disableUser = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('users.disable'), {
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
                    <DialogTitle className="text-lg font-medium text-gray-900">
                        {/* <User className="h-5 w-5 text-[#7f1414]" /> */}
                        Disable User
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">Are you sure you want to disable this user?</DialogDescription>
                </DialogHeader>

                <div className="my-0 rounded-md border border-red-100 bg-red-50 p-4">
                    <p className="text-sm text-red-800">
                        <span className="mb-1 block font-semibold text-red-900">Note: Important Action!</span>
                        This action only disables the user account. The user data will still be stored in the database.
                    </p>
                </div>
                <DialogFooter className="space-x-2">
                    <DialogClose asChild>
                        <Button variant="outline" tabIndex={1}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button variant="noborder" tabIndex={2} onClick={disableUser}>
                        Disable
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
