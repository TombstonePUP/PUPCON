"use client"
import { MoreVertical, UserMinus, User2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useForm, usePage } from "@inertiajs/react"
import { toast } from "sonner"
import { AssignablePrograms, AssignableRoles, UserRecords } from "@/types/user-management"
import InputError from "./input-error"

interface EditUserForm {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface AssignUserRoleForm {
    user_id: number;
    assigned_programs?: number[];
    assigned_areas?: number[];
    assigned_role?: number;
}

interface UserActionsProps {
    user: UserRecords;
    programRoles: AssignablePrograms[];
    roles: AssignableRoles[];
}

export function UserTableActions({ user, programRoles, roles }: UserActionsProps) {
    const [assignUserDialogOpen, setAssignUserDialogOpen] = useState(false);
    const [disableUserDialogOpen, setDisableUserDialogOpen] = useState(false);

    const {
        data: assignRoleData,
        setData: setAssignRoleData,
        patch: patchAssignRole,
        processing: processingAssignRole,
        errors: errorsAssignRole,
        reset: resetAssignRole,
    } = useForm<AssignUserRoleForm>({
        user_id: user.user_id,
        assigned_programs: [],
        assigned_areas: [],
        assigned_role: null,
    });

    const {
        data: disableUserData,
        patch: patchDisableUser,
        // errors: errorsDisableUser,
        reset: resetDisableUser,
    } = useForm<{ user_id: number }>({
        user_id: user.user_id,
    });

    const assignUserRole = (e: React.FormEvent) => {
        e.preventDefault();
        patchAssignRole(route("users.update.roles"), {
            onSuccess: () => {
                resetAssignRole();
                setAssignUserDialogOpen(false);
            },
        });
    };

    const disableUser = (e: React.FormEvent) => {
        e.preventDefault();
        patchDisableUser(route("users.disable", { user_id: disableUserData.user_id }), {
            onSuccess: () => {
                resetDisableUser();
                setDisableUserDialogOpen(false);
            },
        });
    };


    const onChangeProgram = (program: AssignablePrograms, e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            // Add program
            setAssignRoleData("assigned_programs", [...assignRoleData.assigned_programs, program.program_id]);
        } else {
            // Remove program
            setAssignRoleData(
                "assigned_programs",
                assignRoleData.assigned_programs.filter(id => id !== program.program_id)
            );
            // Remove areas under this program
            setAssignRoleData(
                "assigned_areas",
                assignRoleData.assigned_areas.filter(
                    areaId => !program.areas.some(a => a.area_id === areaId)
                )
            );
        }
    }
    const onChangeArea = (area: AssignedAreas, e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            // Add area
            setAssignRoleData("assigned_areas", [...assignRoleData.assigned_areas, area.area_id]);
        } else {
            // Remove area
            setAssignRoleData(
                "assigned_areas",
                assignRoleData.assigned_areas.filter(id => id !== area.area_id)
            );
        }
    }
    return (
        <>
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
                        onClick={() => setAssignUserDialogOpen(true)}
                    >
                        Edit Privileges
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="cursor-pointer"
                        variant="destructive"
                        onClick={() => setDisableUserDialogOpen(true)}
                    >
                        Disable User
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {/* Assign Role Dialog */}
            {/* <Dialog open={assignUserDialogOpen} onOpenChange={setAssignUserDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='flex items-center gap-2'>
                            <User2 className="h-5 w-5 text-[#7f1414]" />
                            Assign Roles
                        </DialogTitle>
                        <DialogDescription>
                            Assign a role to the user
                        </DialogDescription>
                    </DialogHeader>
                        <div>
                            <Label className="mb-1 block text-sm font-medium mb-2">Programs & Areas</Label>
                            <div className="flex flex-col gap-3">
                                {programRoles.map(program => {
                                    const isProgramChecked = assignRoleData.assigned_programs.includes(program.program_id);
                                    return (
                                        <div key={program.program_id}>
                                            <label className="flex items-center gap-3 text-sm mb-0 font-normal text-foreground">
                                                <input
                                                    type="checkbox"
                                                    className="accent-ring"
                                                    value={program.program_id}
                                                    checked={isProgramChecked}
                                                    onChange={(e) => onChangeProgram(program, e)}
                                                />
                                                {program.program_name}
                                            </label>

                                            {isProgramChecked && (
                                                <div className="ml-6 mt-2">
                                                    <div className="grid grid-cols-5 gap-2 flex-wrap">
                                                        {program.areas?.length > 0 ? (
                                                            program.areas.map(area => {
                                                                const isAreaChecked = assignRoleData.assigned_areas.includes(area.area_id);
                                                                return (
                                                                    <label
                                                                        key={area.area_id}
                                                                        className="flex items-center gap-2 text-sm mb-0 font-normal text-foreground"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="accent-ring ml-2"
                                                                            value={area.area_id}
                                                                            checked={isAreaChecked}
                                                                            onChange={(e) => onChangeArea(area, e)}
                                                                        />
                                                                        Area {area.area_number}
                                                                    </label>
                                                                );
                                                            })
                                                        ) : (
                                                            <div className="col-span-5 text-sm text-gray-500 italic">
                                                                No areas available
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <Label className="mb-1 block text-sm font-medium">
                                Assign Role
                                <Label className='text-[#7f1414]' >*</Label>
                            </Label>
                            <div className="grid grid-cols-3 gap-2">
                                {roles.map(role => (
                                    <label
                                        key={role.role_id}
                                        className="flex items-center gap-2 text-sm mb-0 font-normal text-foreground whitespace-nowrap">
                                        <input
                                            type="radio"
                                            name="assigned_role"
                                            value={role.role_id}
                                            onChange={() => setNewUserData("assigned_role", role.role_id)}
                                            className="accent-ring " />
                                            {role.role_name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="noborder">Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog> */}
            {/* Disable User Dialog */}
            <Dialog open={disableUserDialogOpen} onOpenChange={setDisableUserDialogOpen}>
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
        </>
    )
}
