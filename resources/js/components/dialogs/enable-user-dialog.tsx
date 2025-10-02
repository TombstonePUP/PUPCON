"use client"
import { User, UserMinus } from "lucide-react"
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

interface EnableUserDialogProps {
    user: UserRecords;
    onClose: () => void;
}

export function EnableUserDialog({ user, onClose }: EnableUserDialogProps) {
    const {
        data,
        patch,
        reset,
    } = useForm<{ user_id: number }>({
        user_id: user.user_id,
    });

    const enableUser = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route("users.enable"), {
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
                        <User className="h-5 w-5 text-[#7f1414]" />
                        Enable User
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to enable this user?
                    </DialogDescription>
                </DialogHeader>
                <Label className="text-sm text-muted-foreground">
                    This action will enable the user account. The user will be able to access the system again.
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
                        onClick={enableUser}
                    >
                        Enable
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

