"use client"
import { UserMinus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useForm } from "@inertiajs/react"
import { UserRecords } from "@/types/user-management"

interface DisableUserDialogProps {
  user: UserRecords;
  onClose: () => void;
}

export function DisableUser({ user, onClose }: DisableUserDialogProps) {
    const {
        data,
        patch,
        reset,
    } = useForm<{ user_id: number }>({
        user_id: user.user_id,
    });

    const disableUser = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route("users.disable"), {
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
                    <DialogTitle className='flex items-center gap-2'>
                        <UserMinus className="h-5 w-5 text-[#7f1414]" />
                        Disable User
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to disable this user?
                    </DialogDescription>
                </DialogHeader>
                <Label className="text-sm text-muted-foreground">
                    This action only disables the user account. The user data will still be stored in the database.
                </Label>
                <DialogFooter className="space-x-2">
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            tabIndex={1}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        variant="noborder"
                        tabIndex={2}
                        onClick={disableUser}
                    >
                        Disable
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
