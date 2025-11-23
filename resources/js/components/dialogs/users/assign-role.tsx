'use client';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AssignableAreas, AssignablePrograms, AssignableRoles, UserRecords } from '@/types/user-management';
import { useForm } from '@inertiajs/react';
import { User2 } from 'lucide-react';

interface AssignRoleDialogProps {
    user: UserRecords;
    programRoles: AssignablePrograms[];
    roles: AssignableRoles[];
    onClose: () => void;
}

interface AssignUserRoleForm {
    user_id: number;
    assigned_programs: number[];
    assigned_areas: number[];
    assigned_role: number;
}

export function AssignRole({ user, programRoles, roles, onClose }: AssignRoleDialogProps) {
    const { data, setData, patch, processing, errors, reset } = useForm<AssignUserRoleForm>({
        user_id: user.user_id,
        assigned_programs: user.areas?.map((area) => area.levels?.programs?.program_id) || [],
        assigned_areas: user.areas?.map((a) => a.area_id) || [],
        assigned_role: user.roles?.role_id || null,
    });

    const assignUserRole = (e: React.FormEvent) => {
        console.log(data);
        e.preventDefault();
        patch(route('users.update.roles'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const onChangeProgram = (program: AssignablePrograms, e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            // Add program
            setData('assigned_programs', [...data.assigned_programs, program.program_id]);
        } else {
            // Remove program
            setData(
                'assigned_programs',
                data.assigned_programs.filter((id) => id !== program.program_id),
            );
            // Remove areas under this program
            setData(
                'assigned_areas',
                data.assigned_areas.filter((areaId) => !program.levels.areas.some((a) => a.area_id === areaId)),
            );
        }
    };

    const onChangeArea = (area: AssignableAreas, e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            // Add area
            setData('assigned_areas', [...data.assigned_areas, area.area_id]);
        } else {
            // Remove area
            setData(
                'assigned_areas',
                data.assigned_areas.filter((id) => id !== area.area_id),
            );
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <form onSubmit={assignUserRole} className="space-y-2">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <User2 className="h-5 w-5 text-[#7f1414]" />
                            Assign Roles
                        </DialogTitle>
                        <DialogDescription>Assign a role to the user</DialogDescription>
                    </DialogHeader>
                    <div>
                        <Label className="mb-1 block text-sm font-medium">
                            Assign Role
                            <Label className="text-[#7f1414]">*</Label>
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                            {roles.map((role) => (
                                <label
                                    key={role.role_id}
                                    className="text-foreground mb-0 flex items-center gap-2 text-sm font-normal whitespace-nowrap"
                                >
                                    <input
                                        type="radio"
                                        name="assigned_role"
                                        value={role.role_id}
                                        checked={data.assigned_role === role.role_id}
                                        onChange={() => {
                                            setData('assigned_role', role.role_id);
                                        }}
                                        disabled={processing}
                                        className="accent-ring"
                                    />
                                    {role.role_name}
                                </label>
                            ))}
                        </div>
                        <InputError message={errors.assigned_role} className="mt-1" />
                    </div>
                    {(data.assigned_role === roles.find((r) => r.role_name === 'Chairman')?.role_id ||
                        data.assigned_role === roles.find((r) => r.role_name === 'Accreditor')?.role_id) && (
                            <div>
                                <Label className="mb-1 mb-2 block text-sm font-medium">Programs & Areas</Label>
                                <div className="flex flex-col gap-3">
                                    {programRoles.map((program) => {
                                        const isProgramChecked = data.assigned_programs.includes(program.program_id);
                                        return (
                                            <div key={program.program_id}>
                                                <label className="text-foreground mb-0 flex items-center gap-3 text-sm font-normal">
                                                    <input
                                                        type="checkbox"
                                                        className="accent-ring"
                                                        value={program.program_id}
                                                        checked={isProgramChecked}
                                                        disabled={processing}
                                                        onChange={(e) => onChangeProgram(program, e)}
                                                    />
                                                    {program.program_name}
                                                </label>

                                                {isProgramChecked && (
                                                    <div className="mt-2 ml-6">
                                                        <div className="grid grid-cols-5 flex-wrap gap-2">
                                                            {program.levels?.areas?.length > 0 ? (
                                                                program.levels?.areas.map((area) => {
                                                                    const isAreaChecked = data.assigned_areas.includes(area.area_id);
                                                                    return (
                                                                        <label
                                                                            key={area.area_id}
                                                                            className="text-foreground mb-0 flex items-center gap-2 text-sm font-normal"
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                className="accent-ring ml-2"
                                                                                value={area.area_id}
                                                                                checked={isAreaChecked}
                                                                                disabled={processing}
                                                                                onChange={(e) => onChangeArea(area, e)}
                                                                            />
                                                                            Area {area.area_number}
                                                                        </label>
                                                                    );
                                                                })
                                                            ) : (
                                                                <div className="col-span-5 text-sm text-gray-500 italic">No areas available</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <InputError message={errors.assigned_areas} className="mt-1" />
                                <InputError message={errors.assigned_programs} className="mt-1" />
                            </div>
                        )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => onClose()}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="noborder" type="submit">
                            Submit
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
