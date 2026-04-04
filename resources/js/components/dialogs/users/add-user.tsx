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
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { useState } from 'react';
import { User2, ArrowLeft, CheckCircle2 } from 'lucide-react';

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
    const [step, setStep] = useState<'form' | 'summary'>('form');
    const [localErrors, setLocalErrors] = useState<{ [key: string]: string }>({});

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

    const handleReviewDetails = () => {
        setLocalErrors({});
        const newErrors: { [key: string]: string } = {};

        if (!data.first_name) newErrors.first_name = 'First name is required.';
        if (!data.last_name) newErrors.last_name = 'Last name is required.';
        if (!data.email) newErrors.email = 'Email is required.';
        if (data.assigned_role === null) newErrors.assigned_role = 'Please assign a role.';

        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (Object.keys(newErrors).length > 0) {
            setLocalErrors(newErrors);
            toast.error('Please complete all required fields.');
            return;
        }

        setStep('summary');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('users.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
            onError: () => {
                toast.error('Failed to create user. Please check the form for errors.');
                setStep('form');
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
                    (areaId) => !program.levels?.areas?.some((a) => a.area_id === areaId),
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
            <DialogContent className={`transition-all duration-300 max-h-[90vh] overflow-y-auto ${step === 'form' ? 'sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl' : 'sm:max-w-xl md:max-w-2xl'}`}>
                <form onSubmit={handleSubmit} noValidate>
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-lg font-medium text-foreground">
                            {step === 'form' ? 'Add New User' : 'Review User Details'}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            {step === 'form' 
                                ? "Fill in the user's details and assign their role and access permissions."
                                : "Please verify the information below before finalizing user creation."}
                        </DialogDescription>
                    </DialogHeader>

                    {step === 'form' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start relative">
                            {/* ── Left Column: Personal Info & Note ── */}
                            <div className="space-y-6 md:sticky md:top-0">
                                {/* ── Personal Information ── */}
                                <section className="space-y-4">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                                        Personal Information
                                    </h3>

                                    <div className="space-y-4 rounded-lg border px-4 py-4">
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
                                                <InputError message={errors.first_name || localErrors.first_name} />
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
                                                <InputError message={errors.last_name || localErrors.last_name} />
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
                                            <InputError message={errors.email || localErrors.email} />
                                        </div>
                                    </div>
                                </section>

                                {/* ── Info note ── */}
                                <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
                                    <p className="text-sm">
                                        After the user is created, they will receive an email with their
                                        login credentials.
                                    </p>
                                </div>
                            </div>

                            {/* ── Right Column: Roles & Accessibility ── */}
                            <div className="space-y-6">
                                {/* ── Role Assignment ── */}
                                <section className="space-y-4">
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                                        Role &amp; Access
                                    </h3>

                                    <div className="space-y-2">
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
                                        <InputError message={errors.assigned_role || localErrors.assigned_role} />
                                    </div>

                                    {/* ── Programs & Areas (conditional) ── */}
                                    {showProgramAreas && (
                                        <div className="rounded-lg border bg-secondary/10 p-4 space-y-3">
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
                                                                    {(program.levels?.areas?.length ?? 0) > 0 ? (
                                                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                                                                            {program.levels.areas!.map(
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
                            </div>
                        </div>
                    ) : (
                        /* ── Step 2: Summary / Receipt ── */
                        <div className="rounded-xl border border-secondary bg-secondary/5 p-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex border-b border-border/60 pb-5 mb-5 gap-4 items-center">
                                <div className="flex size-14 rounded-full border border-dashed border-[#7f1414] items-center justify-center text-[#7f1414] bg-[#7f1414]/5 shrink-0">
                                    <User2 className="size-6" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-foreground leading-none">{data.first_name} {data.last_name}</h4>
                                    <p className="text-sm text-muted-foreground mt-1.5">{data.email}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div>
                                    <span className="text-[11px] tracking-wider uppercase font-semibold text-muted-foreground">Assigned Role</span>
                                    <div className="flex items-center gap-2 mt-1.5 font-medium text-foreground text-sm">
                                        <CheckCircle2 className="size-4 text-green-600" />
                                        {roles.find(r => r.role_id === data.assigned_role)?.role_name || 'N/A'}
                                    </div>
                                </div>

                                {showProgramAreas && data.assigned_programs.length > 0 && (
                                     <div>
                                        <span className="text-[11px] tracking-wider uppercase font-semibold text-muted-foreground">Granted Access Rights</span>
                                        <ul className="mt-2.5 space-y-3">
                                            {programRoles.filter(p => data.assigned_programs.includes(p.program_id)).map(program => (
                                                <li key={program.program_id} className="text-sm rounded-md border border-border/50 bg-background px-3 py-2.5">
                                                    <span className="font-semibold text-foreground/90">{program.program_name}</span>
                                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                                        {(program.levels?.areas?.filter(a => data.assigned_areas.includes(a.area_id)).length ?? 0) > 0 
                                                          ? program.levels.areas!.filter(a => data.assigned_areas.includes(a.area_id)).map(a => (
                                                              <span key={a.area_id} className="inline-flex items-center rounded-md bg-secondary/80 px-2 py-1 text-xs font-medium text-secondary-foreground border border-black/5">
                                                                Area {a.area_number}
                                                              </span>
                                                            ))
                                                          : <span className="inline-flex items-center rounded-md bg-red-50/50 px-2 py-1 text-xs font-medium text-red-700 border border-red-100">No specific areas assigned</span>
                                                        }
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                     </div>
                                )}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="mt-6">
                        {step === 'form' ? (
                            <>
                                <DialogClose asChild>
                                    <Button variant="outline" type="button" onClick={onClose}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="button" onClick={handleReviewDetails}>
                                    Review Details
                                </Button>
                            </>
                        ) : (
                            <div className="w-full flex justify-between gap-3">
                                <Button variant="outline" type="button" onClick={() => setStep('form')} disabled={processing}>
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-[#7f1414] hover:bg-[#7f1414]/90 text-white">
                                    {processing ? 'Creating...' : 'Confirm & Create User'}
                                </Button>
                            </div>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}