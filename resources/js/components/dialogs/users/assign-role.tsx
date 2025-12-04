'use client';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AssignableAreas, AssignablePrograms, AssignableRoles, UserRecords } from '@/types/user-management';
import { useForm } from '@inertiajs/react';

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
                <form onSubmit={assignUserRole} className="space-y-8">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-lg font-medium text-gray-900">
                            {/* <User2 className="h-5 w-5 text-[#7f1414]" /> */}
                            Edit & Change Roles
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">Change roles assigned to the user</DialogDescription>
                    </DialogHeader>
                    <div>
                        <Label className="mb-1 block text-sm font-medium text-gray-900">
                            Assign Role
                            <Badge className="ml-2 transition-colors duration-200" variant="secondary">
                                required
                            </Badge>
                        </Label>
                        <RadioGroup
                            onValueChange={(value) => setData('assigned_role', Number(value))}
                            value={data.assigned_role !== null ? String(data.assigned_role) : undefined}
                            className="mt-4 grid grid-cols-2 gap-4"
                        >
                            {roles.map((role) => (
                                <div
                                    key={role.role_id}
                                    className="flex cursor-pointer items-center space-x-2 rounded-lg border px-4 py-3 transition-colors hover:border-[#7f1414] hover:bg-[#7f1414]/3"
                                >
                                    <RadioGroupItem value={String(role.role_id)} id={`role-${role.role_id}`} disabled={processing} />
                                    <Label htmlFor={`role-${role.role_id}`} className="w-full cursor-pointer text-sm font-normal">
                                        {role.role_name}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        <InputError message={errors.assigned_role} className="mt-1" />
                    </div>
                    {(data.assigned_role === roles.find((r) => r.role_name === 'Chairman')?.role_id ||
                        data.assigned_role === roles.find((r) => r.role_name === 'Accreditor')?.role_id) && (
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-900">Programs & Areas
                                    <Badge className="ml-2 transition-colors duration-200" variant="secondary">
                                        required
                                    </Badge>
                                </Label>
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
                                                        <div className="grid grid-cols-4 flex-wrap gap-2">
                                                            {program.levels?.areas?.length > 0 ? (
                                                                program.levels?.areas.map((area) => {
                                                                    const isAreaChecked = data.assigned_areas.includes(area.area_id);
                                                                    return (
                                                                        <label
                                                                            key={area.area_id}
                                                                            className="flex items-center space-x-2 rounded-lg border px-4 py-2 transition-colors hover:border-[#7f1414] hover:bg-[#7f1414]/3"
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                className="accent-ring mr-2 "
                                                                                value={area.area_id}
                                                                                checked={isAreaChecked}
                                                                                disabled={processing}
                                                                                onChange={(e) => onChangeArea(area, e)}
                                                                            />
                                                                            <div className='text-sm'>Area {area.area_number}</div>
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
