"use client";

import { User2 } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import { AssignableAreas, AssignablePrograms, AssignableRoles } from '@/types/user-management';

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
    assigned_role: number;
}

export function AddUser({ programRoles, roles, onClose }: AddUserProps) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm<NewUserForm>({
        first_name: '',
        last_name: '',
        email: '',
        assigned_programs: [],
        assigned_areas: [],
        assigned_role: null,
    });

    const addNewUser = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'), {
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
                data.assigned_areas.filter(
                    areaId => !program.levels.areas.some((a) => a.area_id === areaId)),
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
            <DialogContent className="sm:max-w-2xl">
                <form>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <User2 className="h-5 w-5 text-[#7f1414]" />
                            Add User
                        </DialogTitle>
                        <DialogDescription>Fill in the details to create a new account</DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="account" className="mt-3 mb-3 w-full">
                        <TabsList className="mb-4 w-full">
                            <TabsTrigger value="account">Information</TabsTrigger>
                            <TabsTrigger value="access">Access</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-2">
                                    <div className="flex flex-1 flex-col gap-2">
                                        <Label>
                                            First Name
                                            <Label className="text-[#7f1414]">*</Label>
                                        </Label>
                                        <input
                                            id="first_name"
                                            type="text"
                                            tabIndex={1}
                                            autoFocus
                                            value={data.first_name}
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            disabled={processing}
                                            className="bg-background focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                            placeholder="Enter first name"
                                        />
                                        <InputError message={errors.first_name} className="mt-1" />
                                    </div>
                                    <div className="flex flex-1 flex-col gap-2">
                                        <Label>
                                            Last Name
                                            <Label className="text-[#7f1414]">*</Label>
                                        </Label>
                                        <input
                                            id="last_name"
                                            type="text"
                                            tabIndex={2}
                                            autoFocus
                                            value={data.last_name}
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            disabled={processing}
                                            className="bg-background focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                            placeholder="Enter last name"
                                        />
                                        <InputError message={errors.last_name} className="mt-1" />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="email" className="mb-2 flex items-center gap-2">
                                        Email Address
                                        <Label className="text-[#7f1414]">*</Label>
                                    </Label>
                                    <input
                                        id="email"
                                        type="email"
                                        tabIndex={3}
                                        autoFocus
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        disabled={processing}
                                        className="bg-background focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                        placeholder="Enter email address"
                                    />
                                    <InputError message={errors.email} className="mt-1" />
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="access" className="flex flex-col gap-5 overflow-x-auto">
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
                                                onChange={() => setData('assigned_role', role.role_id)}
                                                className="accent-ring"
                                            />
                                            {role.role_name}
                                        </label>
                                    ))}
                                </div>
                                <InputError message={errors.assigned_role} className="mt-1" />
                            </div>
                            {(data.assigned_role === 3 || data.assigned_role === 4) && (
                                <div>
                                    <Label className="mb-1 mb-2 block text-sm font-medium">
                                        Programs & Areas
                                        <Label className="text-[#7f1414]">*</Label>
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

                                                    {/* Show areas only if program is checked */}
                                                    {isProgramChecked && (
                                                        <div className="mt-2 ml-6">
                                                            <div className="grid grid-cols-5 flex-wrap gap-2">
                                                                {program.levels.areas?.length > 0 ? (
                                                                    program.levels.areas.map((area) => {
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
                        </TabsContent>
                        <label className="mt-2 text-sm text-gray-500">A temporary password will be emailed to the user.</label>
                    </Tabs>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={() => onClose()}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="noborder" type="submit" onClick={addNewUser}>
                            Submit
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
