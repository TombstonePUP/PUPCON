'use client';

import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
    const validProgramIds = programRoles.map((p) => p.program_id);
    const validAreaIds = programRoles.flatMap((p) => p.levels.areas ?? []).map((a) => a.area_id);

    const cleanedAssignedPrograms =
        user.areas?.map((a) => a.levels?.programs?.program_id)?.filter((id) => validProgramIds.includes(id)) || [];

    const cleanedAssignedAreas =
        user.areas?.map((a) => a.area_id)?.filter((id) => validAreaIds.includes(id)) || [];

    const { data, setData, patch, processing, errors, reset } = useForm<AssignUserRoleForm>({
        user_id: user.user_id,
        assigned_programs: cleanedAssignedPrograms,
        assigned_areas: cleanedAssignedAreas,
        assigned_role: user.roles?.role_id,
    });

    const assignUserRole = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('users.update.roles'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    /** -----------------------------
      FIXED: shadcn Checkbox handler
    ------------------------------*/
    const onChangeProgram = (program: AssignablePrograms, checked: boolean) => {
        if (checked) {
            setData('assigned_programs', [...data.assigned_programs, program.program_id]);
        } else {
            setData(
                'assigned_programs',
                data.assigned_programs.filter((id) => id !== program.program_id)
            );

            setData(
                'assigned_areas',
                data.assigned_areas.filter(
                    (areaId) => !program.levels.areas.some((a) => a.area_id === areaId)
                )
            );
        }
    };

    const onChangeArea = (area: AssignableAreas, checked: boolean) => {
        if (checked) {
            setData('assigned_areas', [...data.assigned_areas, area.area_id]);
        } else {
            setData(
                'assigned_areas',
                data.assigned_areas.filter((id) => id !== area.area_id)
            );
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl">
                <form onSubmit={assignUserRole} className="space-y-8">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-lg font-medium text-gray-900">Edit & Change Roles</DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">
                            Change roles assigned to the user
                        </DialogDescription>
                    </DialogHeader>

                    {/* Assign Role */}
                    <div>
                        <Label className="text-base font-medium text-gray-900">
                            Assign Role <span className="text-red-500">*</span>
                        </Label>

                        <RadioGroup
                            onValueChange={(value) => setData('assigned_role', Number(value))}
                            value={String(data.assigned_role)}
                            className="mt-4 grid grid-cols-2 gap-4"
                        >
                            {roles.map((role) => (
                                <div
                                    key={role.role_id}
                                    className="flex cursor-pointer items-center space-x-2 rounded-lg border px-4 py-3 transition-colors hover:border-[#7f1414] hover:bg-[#7f1414]/3"
                                >
                                    <RadioGroupItem
                                        value={String(role.role_id)}
                                        id={`role-${role.role_id}`}
                                        disabled={processing}
                                    />
                                    <Label htmlFor={`role-${role.role_id}`} className="w-full cursor-pointer text-sm font-normal">
                                        {role.role_name}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        <InputError message={errors.assigned_role} className="mt-2" />
                    </div>

                    {/* Assign Programs & Areas */}
                    {(data.assigned_role === roles.find((r) => r.role_name === 'Chairman')?.role_id ||
                        data.assigned_role === roles.find((r) => r.role_name === 'Accreditor')?.role_id) && (
                            <div className="bg-secondary/10 rounded-lg border p-6">
                                <Label className="text-base font-medium text-gray-900">
                                    Assign Programs & Areas <span className="text-red-500">*</span>
                                </Label>

                                <div className="mt-4 flex max-h-60 flex-col space-y-4 overflow-y-auto pr-2">
                                    {programRoles.map((program) => {
                                        const isProgramChecked = data.assigned_programs.includes(program.program_id);

                                        return (
                                            <div key={program.program_id} className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`program-${program.program_id}`}
                                                        checked={isProgramChecked}
                                                        disabled={processing}
                                                        onCheckedChange={(checked) =>
                                                            onChangeProgram(program, checked as boolean)
                                                        }
                                                        className="data-[state=checked]:border-[#7f1414] data-[state=checked]:bg-[#7f1414]"
                                                    />

                                                    <Label
                                                        htmlFor={`program-${program.program_id}`}
                                                        className="cursor-pointer text-sm font-medium capitalize"
                                                    >
                                                        {program.program_name}
                                                    </Label>
                                                </div>

                                                {isProgramChecked && (
                                                    <div className="ml-1 border-l pt-1 pl-6">
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-3">
                                                            {program.levels?.areas?.length > 0 ? (
                                                                program.levels.areas.map((area) => {
                                                                    const isAreaChecked = data.assigned_areas.includes(area.area_id);

                                                                    return (
                                                                        <div
                                                                            key={area.area_id}
                                                                            className="flex items-center space-x-2 rounded-lg border px-2 py-2 transition-colors hover:border-[#7f1414] hover:bg-[#7f1414]/3"
                                                                        >
                                                                            <Checkbox
                                                                                id={`area-${area.area_id}`}
                                                                                checked={isAreaChecked}
                                                                                disabled={processing}
                                                                                onCheckedChange={(checked) =>
                                                                                    onChangeArea(area, checked as boolean)
                                                                                }
                                                                                className="data-[state=checked]:border-[#7f1414] data-[state=checked]:bg-[#7f1414]"
                                                                            />

                                                                            <Label
                                                                                htmlFor={`area-${area.area_id}`}
                                                                                className="cursor-pointer text-sm font-normal whitespace-nowrap"
                                                                            >
                                                                                Area {area.area_number}
                                                                            </Label>
                                                                        </div>
                                                                    );
                                                                })
                                                            ) : (
                                                                <p className="col-span-3 text-sm text-gray-500 italic">
                                                                    No areas available for this program.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <InputError message={errors.assigned_areas} className="mt-2" />
                                <InputError message={errors.assigned_programs} className="mt-2" />
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
