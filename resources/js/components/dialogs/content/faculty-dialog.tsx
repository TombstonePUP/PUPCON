import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Program } from '@/types';
import { FacultyStaff } from '@/types/content';
import { usePage } from '@inertiajs/react';
import { DialogClose } from '@radix-ui/react-dialog';
import { Edit2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FacultyDialogProps {
    type: 'edit' | 'add';
    faculty?: FacultyStaff;
    onSave: (faculty: FacultiesForm) => void;
    onClose: () => void;
}

interface FacultiesForm {
    faculty_staff_id?: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    personnel_type?: string;
    status: string;
    program_id?: number | null;
    program_coordinator: boolean;
    faculty_image?: File | null;
    image_path?: string | null;
    previewUrl?: string | null;
}

export function FacultyDialog({ ...props }: FacultyDialogProps) {
    const { type, faculty, onSave, onClose } = props;
    const { auth } = usePage().props;
    const programs = auth.programs;
    const [data, setData] = useState<FacultiesForm>({
        faculty_staff_id: faculty?.faculty_staff_id || 0,
        first_name: faculty?.first_name || '',
        middle_name: faculty?.middle_name || '',
        last_name: faculty?.last_name || '',
        personnel_type: faculty?.personnel_type || '',
        status: faculty?.status || '',
        program_id: faculty?.program_id ?? null,
        program_coordinator: faculty?.program_coordinator || false,
        faculty_image: null,
        image_path: faculty?.image_path || null,
        previewUrl: faculty?.image_path || null,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log('Selected file:', file);
        console.log(data);
        if (file) {
            const previewUrl = URL.createObjectURL(file);

            // Clean up previous blob URL
            if (data.previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(data.previewUrl);
            }

            setData({
                ...data,
                faculty_image: file,
                previewUrl,
                image_path: null, // optional: clear previous backend path
            });
        }
    };

    useEffect(() => {
        return () => {
            if (data.previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(data.previewUrl);
            }
        };
    }, [data.previewUrl]);

    const handleSubmit = () => {
        console.log('Submitting faculty data:', data);
        onSave(data);
        onClose();
    };

    console.log('Rendering FacultyDialog with data:', data);

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] w-3xl overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium text-gray-900">
                        {type === 'edit' ? 'Edit Faculty Member' : 'Add New Faculty Member'}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        {type === 'edit'
                            ? `Modify the details of "${faculty?.first_name} ${faculty?.last_name}".`
                            : 'Fill in the details to add a new faculty member.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="max-h-sm mt-6">
                        <div className="flex gap-8">
                            <div className="flex w-[50%] flex-col gap-4">
                                {!data.previewUrl ? (
                                    <Label className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg
                                                className="mb-4 h-8 w-8 text-gray-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 20 16"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                />
                                            </svg>
                                            <p className="text-sm text-gray-500">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">JPG, PNG, JPEG</p>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </Label>
                                ) : (
                                    <div className="group relative">
                                        <img
                                            src={data.previewUrl}
                                            alt="Preview"
                                            className="h-36 w-full rounded-lg border border-gray-200 object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-lg bg-black/40 opacity-0 transition group-hover:opacity-100">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                id="replace-faculty-image"
                                                onChange={handleImageChange} // reuse your same handler
                                            />

                                            {/* Replace image button */}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-12 w-12 rounded-full bg-white p-0 transition-transform duration-200 hover:scale-110 hover:bg-red-50"
                                                size="lg"
                                                onClick={() => document.getElementById('replace-faculty-image')?.click()}
                                            >
                                                <Edit2 className="h-5 w-5 text-red-600" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-12 w-12 rounded-full bg-white p-0 transition-transform duration-200 hover:scale-110 hover:bg-red-50"
                                                size="lg"
                                                onClick={() =>
                                                    setData({
                                                        ...data,
                                                        faculty_image: null,
                                                        previewUrl: null,
                                                    })
                                                }
                                            >
                                                <Trash2 className="h-5 w-5 text-red-600" />
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <Label className="mb-2 block w-full text-sm font-medium text-gray-700">First Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        placeholder="Enter First Name"
                                        value={data.first_name}
                                        onChange={(e) => setData({ ...data, first_name: e.target.value })}
                                        autoFocus
                                        className="w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Middle Name/Initial</Label>
                                    <Input
                                        placeholder="Enter Middle Name/Initial"
                                        value={data.middle_name}
                                        onChange={(e) => setData({ ...data, middle_name: e.target.value })}
                                        autoFocus

                                    />
                                </div>
                            </div>

                            <div className="mb-0 flex w-[50%] flex-col gap-4 pb-0">
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Last Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        placeholder="Enter Last Name"
                                        value={data.last_name}
                                        onChange={(e) => setData({ ...data, last_name: e.target.value })}
                                        autoFocus
                                        required
                                    />
                                </div>

                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Member Type <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={data.personnel_type || ''}
                                        onValueChange={(value) => setData((prev) => ({ ...prev, personnel_type: value }))}
                                        required
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {/* <SelectLabel>Type</SelectLabel> */}
                                                <SelectItem value="Faculty">Faculty</SelectItem>
                                                <SelectItem value="Staff">Staff</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Employment Status <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={data.status || ''}
                                        onValueChange={(value) => setData({ ...data, status: value })}
                                        required
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {/* <SelectLabel>Status</SelectLabel> */}
                                                <SelectItem key="Full Time" value="Full Time">
                                                    Full Time
                                                </SelectItem>
                                                <SelectItem key="Part Time" value="Part Time">
                                                    Part Time
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Program Affiliation</Label>
                                    <Select
                                        value={data.program_id === null ? 'null' : String(data.program_id)}
                                        onValueChange={(value) =>
                                            setData({
                                                ...data,
                                                program_id: value === 'null' ? null : Number(value),
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a Program" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {/* <SelectLabel>Programs</SelectLabel> */}
                                                <SelectItem key="none" value="null">
                                                    None
                                                </SelectItem>
                                                {programs &&
                                                    programs.map((program: Program) => (
                                                        <SelectItem key={program.program_id} value={String(program.program_id)}>
                                                            {program.program_name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {data.program_id !== null && data.program_id !== undefined && (
                                    <div className="flex items-center space-x-4">
                                        <Switch
                                            id="program-coordinator"
                                            checked={data.program_coordinator}
                                            onCheckedChange={(checked) =>
                                                setData({
                                                    ...data,
                                                    program_coordinator: data.program_id ? Boolean(checked) : false,
                                                })
                                            }
                                        />

                                        <Label htmlFor="program-coordinator" className="block text-sm font-medium text-gray-700">
                                            Program Coordinator
                                        </Label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-6 flex justify-end space-x-2">
                        <DialogClose asChild>
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="noborder" type="submit">
                            {type === 'edit' ? 'Save Changes' : 'Add Faculty Member'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
