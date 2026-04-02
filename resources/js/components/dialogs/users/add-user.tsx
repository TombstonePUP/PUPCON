'use client';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AssignableAreas, AssignablePrograms, AssignableRoles } from '@/types/user-management';
import * as Collapsible from '@radix-ui/react-collapsible';
import { useForm } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AddUserProps {
    programRoles: AssignablePrograms[];
    roles: AssignableRoles[];
    onClose: () => void;
}

interface NewUserForm {
    first_name: string;
    last_name: string;
    email: string;
    assigned_programs: number[];
    assigned_areas: number[];
    assigned_role: number | null;
}

export function AddUser({ programRoles, roles, onClose }: AddUserProps) {
    const [personalOpen, setPersonalOpen] = useState(true);

    const { data, setData, post, processing, errors, reset } = useForm<NewUserForm>({
        first_name: '',
        last_name: '',
        email: '',
        assigned_programs: [],
        assigned_areas: [],
        assigned_role: null,
    });

    const chairmanRoleId = roles.find((r) => r.role_name === 'Chairman')?.role_id;
    const accreditorRoleId = roles.find((r) => r.role_name === 'Accreditor')?.role_id;
    const showProgramAreas =
        data.assigned_role === chairmanRoleId || data.assigned_role === accreditorRoleId;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('users.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
            onError: (errs) => {
                // Auto-expand personal info section if those fields have errors
                if (errs.first_name || errs.last_name || errs.email) {
                    setPersonalOpen(true);
                }
                toast.error('Failed to create user. Please check the form for errors.');
            },
        });
    };

    const onChangeProgram = (program: AssignablePrograms, checked: boolean) => {
        if (checked) {
            setData('assigned_programs', [...data.assigned_programs, program.program_id]);
        } else {
            setData(
                'assigned_programs',
                data.assigned_programs.filter((id) => id !== program.program_id),
            );
            // Also remove areas that belong to this program
            setData(
                'assigned_areas',
                data.assigned_areas.filter(
                    (areaId) => !program.levels.areas.some((a) => a.area_id === areaId),
                ),
            );
        }
    };

    const onChangeArea = (area: AssignableAreas, checked: boolean) => {
        if (checked) {
            setData('assigned_areas', [...data.assigned_areas, area.area_id]);
        } else {
            setData(
                'assigned_areas',
                data.assigned_areas.filter((id) => id !== area.area_id),
            );
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} noValidate>
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-lg font-medium text-foreground">
                            Add New User
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Fill in the user's details and assign their role and access permissions.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* ── Personal Information (Collapsible) ── */}
                        <Collapsible.Root open={personalOpen} onOpenChange={setPersonalOpen}>
                            <Collapsible.Trigger asChild>
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between rounded-lg border bg-secondary/30 px-4 py-3 text-left transition-colors hover:bg-secondary/50"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
                                            Personal Information
                                        </span>
                                        {(errors.first_name || errors.last_name || errors.email) && (
                                            <span className="inline-flex h-2 w-2 rounded-full bg-red-500" />
                                        )}
                                    </div>
                                    <ChevronDown
                                        className="h-4 w-4 text-muted-foreground transition-transform duration-200"
                                        style={{ transform: personalOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                    />
                                </button>
                            </Collapsible.Trigger>

                            <Collapsible.Content className="overflow-hidden data-[state=open]:animate-none">
                                <div className="space-y-4 rounded-b-lg border border-t-0 px-4 py-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="first_name">
                                                First Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="first_name"
                                                type="text"
                                                autoFocus
                                                value={data.first_name}
                                                onChange={(e) => setData('first_name', e.target.value)}
                                                disabled={processing}
                                                placeholder="e.g., Jane"
                                            />
                                            <InputError message={errors.first_name} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="last_name">
                                                Last Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="last_name"
                                                type="text"
                                                value={data.last_name}
                                                onChange={(e) => setData('last_name', e.target.value)}
                                                disabled={processing}
                                                placeholder="e.g., Doe"
                                            />
                                            <InputError message={errors.last_name} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email Address <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={processing}
                                            placeholder="e.g., jane.doe@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>
                            </Collapsible.Content>
                        </Collapsible.Root>

                        {/* ── Role Assignment ── */}
                        <section className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                                Role &amp; Access
                            </h3>

                            <div className="space-y-2">
                                <Label>
                                    Assign Role <span className="text-red-500">*</span>
                                </Label>
                                <RadioGroup
                                    onValueChange={(value) =>
                                        setData('assigned_role', Number(value))
                                    }
                                    value={
                                        data.assigned_role !== null
                                            ? String(data.assigned_role)
                                            : undefined
                                    }
                                    className="grid grid-cols-2 gap-3"
                                >
                                    {roles.map((role) => (
                                        <div
                                            key={role.role_id}
                                            className="flex cursor-pointer items-center space-x-2 rounded-lg border px-4 py-3 transition-colors hover:border-[#7f1414] hover:bg-[#7f1414]/5"
                                        >
                                            <RadioGroupItem
                                                value={String(role.role_id)}
                                                id={`role-${role.role_id}`}
                                                disabled={processing}
                                            />
                                            <Label
                                                htmlFor={`role-${role.role_id}`}
                                                className="w-full cursor-pointer text-sm font-normal"
                                            >
                                                {role.role_name}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                                <InputError message={errors.assigned_role} />
                            </div>

                            {/* ── Programs & Areas (conditional) ── */}
                            {showProgramAreas && (
                                <div className="rounded-lg border bg-secondary/10 p-4 space-y-3">
                                    <Label>
                                        Assign Programs &amp; Areas{' '}
                                        <span className="text-red-500">*</span>
                                    </Label>

                                    <div className="max-h-56 overflow-y-auto space-y-4 pr-1">
                                        {programRoles.map((program) => {
                                            const isProgramChecked = data.assigned_programs.includes(
                                                program.program_id,
                                            );
                                            return (
                                                <div key={program.program_id} className="space-y-2">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`program-${program.program_id}`}
                                                            checked={isProgramChecked}
                                                            disabled={processing}
                                                            onCheckedChange={(checked) =>
                                                                onChangeProgram(
                                                                    program,
                                                                    checked as boolean,
                                                                )
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
                                                        <div className="ml-6 border-l pl-4 pt-1">
                                                            {program.levels.areas?.length > 0 ? (
                                                                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                                                                    {program.levels.areas.map(
                                                                        (area) => {
                                                                            const isAreaChecked =
                                                                                data.assigned_areas.includes(
                                                                                    area.area_id,
                                                                                );
                                                                            return (
                                                                                <div
                                                                                    key={area.area_id}
                                                                                    className="flex items-center space-x-2 rounded-md border px-2 py-2 transition-colors hover:border-[#7f1414] hover:bg-[#7f1414]/5"
                                                                                >
                                                                                    <Checkbox
                                                                                        id={`area-${area.area_id}`}
                                                                                        checked={
                                                                                            isAreaChecked
                                                                                        }
                                                                                        disabled={
                                                                                            processing
                                                                                        }
                                                                                        onCheckedChange={(
                                                                                            checked,
                                                                                        ) =>
                                                                                            onChangeArea(
                                                                                                area,
                                                                                                checked as boolean,
                                                                                            )
                                                                                        }
                                                                                        className="data-[state=checked]:border-[#7f1414] data-[state=checked]:bg-[#7f1414]"
                                                                                    />
                                                                                    <Label
                                                                                        htmlFor={`area-${area.area_id}`}
                                                                                        className="cursor-pointer text-sm font-normal whitespace-nowrap"
                                                                                    >
                                                                                        Area{' '}
                                                                                        {
                                                                                            area.area_number
                                                                                        }
                                                                                    </Label>
                                                                                </div>
                                                                            );
                                                                        },
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm italic text-muted-foreground">
                                                                    No areas available for this
                                                                    program.
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <InputError message={errors.assigned_areas} />
                                    <InputError message={errors.assigned_programs} />
                                </div>
                            )}
                        </section>

                        {/* ── Info note ── */}
                        <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
                            <p className="text-sm">
                                After the user is created, they will receive an email with their
                                login credentials.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button variant="outline" type="button" onClick={onClose}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create User'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}