'use client';

import { useState } from 'react'; // Import useState for tab control

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { AssignableAreas, AssignablePrograms, AssignableRoles } from '@/types/user-management';
import { useForm } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

type Tab = 'account' | 'access';

export function AddUser({ programRoles, roles, onClose }: AddUserProps) {
    const [activeTab, setActiveTab] = useState<Tab>('account');

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<NewUserForm>({
        first_name: '',
        last_name: '',
        email: '',
        assigned_programs: [],
        assigned_areas: [],
        assigned_role: null,
    });

    const chairmanRoleId = roles.find((r) => r.role_name === 'Chairman')?.role_id;
    const accreditorRoleId = roles.find((r) => r.role_name === 'Accreditor')?.role_id;
    const showProgramAreas = data.assigned_role === chairmanRoleId || data.assigned_role === accreditorRoleId;

    const handleNext = () => {
        let isValid = true;
        clearErrors(['first_name', 'last_name', 'email']);

        if (!data.first_name) {
            errors.first_name = 'The first name field is required.';
            isValid = false;
        }
        if (!data.last_name) {
            errors.last_name = 'The last name field is required.';
            isValid = false;
        }
        if (!data.email) {
            errors.email = 'The email field is required.';
            isValid = false;
        }

        if (isValid) {
            setActiveTab('access');
        } else {
            toast.error('Please complete all required personal information fields.');
        }
    };

    const addNewUser = (e: React.FormEvent) => {
        e.preventDefault();

        if (activeTab === 'access' && data.assigned_role === null) {
            clearErrors('assigned_role');
            errors.assigned_role = 'The assigned role field is required.';
            toast.error('Please assign a role to the user.');
            return;
        }

        post(route('users.store'), {
            onSuccess: () => {
                reset();
                onClose();
                toast.success('User successfully created and temporary password emailed.');
            },
            onError: (err) => {
                if (err.first_name || err.last_name || err.email) {
                    setActiveTab('account');
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
            setData(
                'assigned_areas',
                data.assigned_areas.filter((areaId) => !program.levels.areas.some((a) => a.area_id === areaId)),
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
            <DialogContent className="sm:max-w-xl">
                <form onSubmit={addNewUser}>
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-lg font-medium text-gray-900">Add New User</DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">
                            {activeTab === 'account' ? " Enter the user's personal details." : ' Assign the role and access permissions.'}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Stepper Tabs */}
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Tab)} className="w-full">
                        {/* Tab List */}
                        <TabsList className="bg-secondary mb-6 grid h-auto w-full grid-cols-2 p-0 shadow-none">
                            <div
                                className={`rounded-lg p-2 text-center font-medium transition-all duration-300 ${activeTab === 'account' ? 'text-primary-foreground bg-[#7f1414]' : 'bg-secondary text-muted-foreground'}`}
                            >
                                Personal Information
                            </div>
                            <div
                                className={`rounded-lg p-2 text-center font-medium transition-all duration-300 ${activeTab === 'access' ? 'text-primary-foreground bg-[#7f1414]' : 'bg-secondary text-muted-foreground'}`}
                            >
                                Access & Role
                            </div>
                        </TabsList>

                        {/* -------------------- Personal Information -------------------- */}
                        <TabsContent value="account">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="first_name">
                                            First Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="first_name"
                                            type="text"
                                            tabIndex={1}
                                            autoFocus
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            disabled={processing}
                                            placeholder="e.g., Jane"
                                        />
                                        <InputError message={errors.first_name} />
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="last_name">
                                            Last Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="last_name"
                                            type="text"
                                            tabIndex={2}
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
                                        tabIndex={3}
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        disabled={processing}
                                        placeholder="e.g., jane.doe@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="mt-12 rounded-md border border-blue-100 bg-blue-50 p-4">
                                    <p className="text-sm text-blue-800">
                                        {/* <span className="mb-1 block font-semibold text-red-900">Note</span> */}
                                        Please check your mail inbox for the email we sent containing your user credentials.
                                    </p>
                                </div>
                            </div>
                        </TabsContent>

                        {/* -------------------- Access & Role -------------------- */}
                        <TabsContent value="access" className="space-y-8">
                            <div>
                                <Label className="text-base font-medium text-gray-900">
                                    Assign Role{' '}
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
                                <InputError message={errors.assigned_role} className="mt-2" />
                            </div>

                            {showProgramAreas && (
                                <div className="bg-secondary/10 rounded-lg border p-6">
                                    <Label className="text-base font-medium text-gray-900">
                                        Assign Programs & Areas{' '}
                                        <Badge className="ml-2 transition-colors duration-200" variant="secondary">
                                            required
                                        </Badge>
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
                                                            onCheckedChange={(checked) => onChangeProgram(program, checked as boolean)}
                                                            className="data-[state=checked]:border-[#7f1414] data-[state=checked]:bg-[#7f1414]"
                                                        />
                                                        <Label
                                                            htmlFor={`program-${program.program_id}`}
                                                            className="cursor-pointer text-sm font-medium"
                                                        >
                                                            {program.program_name}
                                                        </Label>
                                                    </div>

                                                    {isProgramChecked && (
                                                        <div className="ml-1 border-l pt-1 pl-6">
                                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-3">
                                                                {program.levels.areas?.length > 0 ? (
                                                                    program.levels.areas?.map((area) => {
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
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="mt-6">
                        {activeTab === 'access' && (
                            <Button variant="outline" type="button" onClick={() => setActiveTab('account')}>
                                Back
                            </Button>
                        )}

                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => onClose()}>
                                Cancel
                            </Button>
                        </DialogClose>

                        {activeTab === 'account' ? (
                            <Button type="button" onClick={handleNext} disabled={processing}>
                                Next Step
                            </Button>
                        ) : (
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating User...' : 'Create User'}
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
