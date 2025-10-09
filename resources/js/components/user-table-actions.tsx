"use client"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserRecords } from "@/types/user-management"

interface dialogProps {
    type: 'add' | 'assign' | 'disable' | 'enable' | null;
    user: UserRecords;
}

interface UserActionsProps {
    user: UserRecords;
    resolveDialog: ({type, user}: dialogProps) => void;
}

export function UserTableActions({ user, resolveDialog}: UserActionsProps) {
    const userStatus = user.is_active;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-10 space-y-1">
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => resolveDialog({type: 'assign', user: user})}
                >
                    Edit Privileges
                </DropdownMenuItem>
                {userStatus ? (
                    <DropdownMenuItem
                        className="cursor-pointer"
                        variant="destructive"
                        onClick={() => resolveDialog({type: 'disable', user: user})}
                    >
                        Disable User
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        className="cursot-pointer"
                        variant="default"
                        onClick={() => resolveDialog({type: 'enable', user: user})}
                    >
                        Enable User
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
