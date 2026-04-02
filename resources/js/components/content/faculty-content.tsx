import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import { ContentPages, FacultyStaff } from '@/types/content';
import { useForm } from '@inertiajs/react';
import { CircleAlert, EditIcon, ImageIcon, Plus, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FacultyDialog } from '../dialogs/content/faculty-dialog';
import InputError from '../input-error';
import { Badge } from '../ui/badge';

interface FacultyProps {
    faculty_page: ContentPages;
    faculty_members: FacultyStaff[];
}

interface PageForm {
    content_page_id?: number;
    title: string;
    page: string;
    subtitle: string;
    author?: string;
    quote?: string;
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

interface FacultyForm {
    page?: PageForm;
    faculties?: FacultiesForm[];
}

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

const FacultyPhoto: React.FC<{ url: string | null; alt: string }> = ({ url, alt }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [url]);

    if (!url || hasError) {
        return (
            <div className="animate-in fade-in-0 flex h-64 w-full flex-col items-center justify-center rounded-md border border-gray-200 bg-gray-100 text-gray-500">
                <ImageIcon className="h-12 w-12 text-gray-400" />
                <span className="mt-2 text-sm">No Image Available</span>
            </div>
        );
    }

    return (
        <img
            src={url}
            alt={alt}
            className="animate-in fade-in-0 h-64 w-full rounded-md border border-gray-200 bg-gray-100 object-cover"
            onError={() => setHasError(true)}
        />
    );
};

const FacultySection: React.FC = ({ ...props }: FacultyProps) => {
    const { faculty_page, faculty_members } = props;
    const [faculties, setFaculties] = useState<FacultyStaff[]>(faculty_members);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit' | null>(null);

    const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null);

    const selectedFaculty = faculties.find((f) => f.faculty_staff_id === selectedFacultyId);

    const { data, setData, post, processing, errors, reset } = useForm<FacultyForm>({
        page: {
            content_page_id: faculty_page?.content_page_id,
            page: faculty_page?.page || 'Faculty & Staff',
            title: faculty_page?.title || '',
            subtitle: faculty_page?.subtitle || '',
            author: faculty_page?.author || '',
            quote: faculty_page?.quote || '',
        },
        faculties: faculties || [],
    });

    const getSelectedFacultyIndex = () => {
        return faculties?.findIndex((f) => f.faculty_staff_id === selectedFacultyId);
    };

    const getSelectedFacultyErrors = () => {
        const index = getSelectedFacultyIndex();
        if (index === -1 || index === undefined) return [];

        return Object.entries(errors)
            .filter(([key]) => key.startsWith(`faculties.${index}.`))
            .map(([, msg]) => msg);
    };

    const selectedFacultyErrors = getSelectedFacultyErrors();

    const facultiesErrorCount = errors ? Object.keys(errors).filter((key) => key.startsWith('faculties.')).length : 0;

    const handlePreview = () => {
        window.open('/about/faculty-and-staff', '_blank');
    };

    const handleAddClick = () => {
        setDialogType('add');
        setSelectedFacultyId(null);
        setDialogOpen(true);
    };

    const handleEditClick = (faculty: FacultyStaff) => {
        setDialogType('edit');
        setSelectedFacultyId(faculty.faculty_staff_id);
        setDialogOpen(true);
    };

    const handleDelete = (facultyId: number) => {
        setFaculties((prev) => {
            const updatedList = prev.filter((f) => f.faculty_staff_id !== facultyId);

            setData((prevData) => ({
                ...prevData,
                faculties: updatedList,
            }));

            return updatedList;
        });
    };

    const handleSave = (facultyData: FacultiesForm) => {
        setFaculties((prev) => {
            const current = prev ?? [];
            const existingIndex = current.findIndex((f) => f.faculty_staff_id === facultyData.faculty_staff_id);
            let updatedList;
            let facultyForLocalState: FacultyStaff;

            // Local State Update
            facultyForLocalState = {
                faculty_staff_id: facultyData.faculty_staff_id,
                first_name: facultyData.first_name,
                middle_name: facultyData.middle_name || '',
                last_name: facultyData.last_name,
                personnel_type: facultyData.personnel_type || '',
                status: facultyData.status, // or any default status
                program_id: facultyData.program_id || null,
                program_coordinator: facultyData.program_coordinator,
                image_path: facultyData.previewUrl || null,
            };

            if (existingIndex !== -1) {
                updatedList = current.map((f) => (f.faculty_staff_id === facultyForLocalState.faculty_staff_id ? facultyForLocalState : f));
            } else {
                const newId = Math.max(0, ...current.map((f) => f.faculty_staff_id || 0)) + 1;
                facultyForLocalState.faculty_staff_id = newId; // Assign new ID to the local object
                updatedList = [...current, facultyForLocalState];
            }

            // Data Syncing
            setData((prevData) => {
                const facultyForForm: FacultiesForm = {
                    faculty_staff_id: facultyForLocalState.faculty_staff_id,
                    first_name: facultyForLocalState.first_name,
                    middle_name: facultyForLocalState.middle_name || '',
                    last_name: facultyForLocalState.last_name,
                    personnel_type: facultyForLocalState.personnel_type || '',
                    status: facultyForLocalState.status,
                    program_id: facultyForLocalState.program_id || null,
                    program_coordinator: facultyForLocalState.program_coordinator,
                    image_path: facultyForLocalState.image_path || null,
                    faculty_image: facultyData.faculty_image || null,
                    previewUrl: facultyForLocalState.image_path || null,
                };

                let formFaculties;
                const formIndex = prevData.faculties?.findIndex((f) => f.faculty_staff_id === facultyForLocalState.faculty_staff_id);

                if (formIndex !== undefined && formIndex !== -1) {
                    formFaculties = prevData.faculties?.map((f, index) => (index === formIndex ? facultyForForm : f));
                } else {
                    formFaculties = [...(prevData.faculties ?? []), facultyForForm];
                }

                return {
                    ...prevData,
                    faculties: formFaculties,
                };
            });

            setSelectedFacultyId(facultyForLocalState.faculty_staff_id);

            return updatedList;
        });
    };

    const handleSubmit = () => {
        post(route('content.faculty_staff.update'), {
            onSuccess: () => {
                // Optionally reset form or show success message
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Faculty & Staff Page</h2>
                    <p className="text-sm text-gray-600">Configure page content</p>
                </div>

                {/* --- Page Title/Subtitle & Quote Section --- */}
                <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Left Column: Title & Subtitle */}
                    <div className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">Title</label>
                            <Input
                                type="text"
                                placeholder="Enter page title..."
                                value={data.page?.title}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        page: {
                                            ...data.page,
                                            title: e.target.value,
                                        },
                                    })
                                }
                            />
                            <InputError message={errors['page.title']} className="mt-2" />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">Subtitle</label>
                            <Textarea
                                placeholder="Enter page subtitle..."
                                value={data.page?.subtitle}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        page: {
                                            ...data.page,
                                            subtitle: e.target.value,
                                        },
                                    })
                                }
                                autoResize
                                minHeight={150}
                            />
                            <InputError message={errors['page.subtitle']} className="mt-2" />
                        </div>
                    </div>

                    {/* Right Column: Quote Section */}
                    <div className="flex flex-col rounded-lg border border-gray-200 bg-gray-50/50 p-6">
                        <div className="flex flex-1 flex-col space-y-6">
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-foreground">Author</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter author's name and title..."
                                    value={data.page?.author}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            page: {
                                                ...data.page,
                                                author: e.target.value,
                                            },
                                        })
                                    }
                                />
                                <InputError message={errors['page.author']} className="mt-2" />
                            </div>
                            <div className="flex-1">
                                <Label className="mb-2 block text-sm font-medium text-foreground">Quote Text</Label>
                                <Textarea
                                    placeholder="Enter quote..."
                                    value={data.page?.quote}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            page: {
                                                ...data.page,
                                                quote: e.target.value,
                                            },
                                        })
                                    }
                                    autoResize
                                    minHeight={100}
                                    className="flex-1"
                                />
                                <InputError message={errors['page.quote']} className="mt-2" />
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-10 bg-gray-200" />

                {/* --- Faculty List Section --- */}
                <div className="mb-6">
                    <h3 className="mb-4 text-base font-semibold text-gray-900">
                        Faculty & Staff Members
                        {facultiesErrorCount > 0 && (
                            <Badge variant="destructive" className="rounded-full border-none px-1.75 py-0.5 text-sm font-medium">
                                {facultiesErrorCount}
                            </Badge>
                        )}
                    </h3>

                    <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                        <div className="flex w-2/3 flex-col justify-between border-r border-gray-200 bg-gray-50/50 p-6">
                            <div>
                                <h4 className="mb-3 text-xs text-gray-500">Select a Member</h4>
                                <div className="grid max-h-[400px] grid-cols-1 gap-2 overflow-y-auto pr-2 md:grid-cols-3">
                                    {faculties.map((member, index) => (
                                        <div
                                            key={member.faculty_staff_id}
                                            onClick={() => {
                                                setSelectedFacultyId(member.faculty_staff_id);
                                            }}
                                            className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-3 transition-colors ${
                                                member.faculty_staff_id === selectedFacultyId
                                                    ? 'bg-[#7f1414]/4'
                                                    : 'border-gray-100 bg-white hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="truncate text-sm">
                                                <span
                                                    className={` ${member.faculty_staff_id === selectedFacultyId ? 'font-normal text-red-900' : 'text-gray-700'}`}
                                                >
                                                    {member.first_name} {member.middle_name ? member.middle_name[0] + '. ' : ''}
                                                    {member.last_name}
                                                </span>
                                                {(errors[`faculties.${index}.first_name`] ||
                                                    errors[`faculties.${index}.last_name`] ||
                                                    errors[`faculties.${index}.status`] ||
                                                    errors[`faculties.${index}.personnel_type`] ||
                                                    errors[`faculties.${index}.status`] ||
                                                    errors[`faculties.${index}.program_coordinator`] ||
                                                    errors[`faculties.${index}.faculty_image`]) && (
                                                        <CircleAlert className="inline-block h-4 w-4 text-red-600" />
                                                )}
                                            </div>
                                            <div
                                                className={`flex items-center space-x-0.5 transition-opacity ${
                                                    member.faculty_staff_id === selectedFacultyId
                                                        ? 'opacity-100'
                                                        : 'opacity-0 group-hover:opacity-100'
                                                }`}
                                            >
                                                <ActionButton
                                                    onClick={(e) => {
                                                        handleEditClick(member);
                                                    }}
                                                    className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                                >
                                                    <EditIcon className="h-4 w-4" />
                                                </ActionButton>
                                                <ActionButton
                                                    onClick={(e) => {
                                                        handleDelete(member.faculty_staff_id);
                                                    }}
                                                    className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </ActionButton>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 border-t border-gray-200 pt-4">
                                <Button
                                    onClick={handleAddClick}
                                    className="flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-4 py-2 text-sm font-medium text-white transition"
                                >
                                    <Plus className="h-4 w-4" /> Add New Member
                                </Button>
                            </div>
                        </div>

                        {/* Right Pane: Faculty Details */}
                        <div className="w-1/3 p-6">
                            {!selectedFaculty ? (
                                <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                                    <X className="mb-2 h-8 w-8" />
                                    <p className="font-medium">No Member Selected</p>
                                    <p className="text-sm">Select a member on the left to see details.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="overflow-hidden rounded-lg border border-gray-100">
                                        <FacultyPhoto url={selectedFaculty.image_path} alt={selectedFaculty.image_name} />
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold break-words text-gray-900">
                                            {selectedFaculty.first_name} {selectedFaculty.middle_name ? selectedFaculty.middle_name + ' ' : ''}
                                            {selectedFaculty.last_name}
                                        </h4>
                                        <h6 className="text-lg font-semibold break-words text-gray-900">{selectedFaculty.programs?.program_name}</h6>
                                        <p className="text-sm font-normal text-red-700">{selectedFaculty.status}</p>
                                    </div>
                                    {selectedFacultyErrors.length > 0 && (
                                        <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-4">
                                            <h4 className="mb-2 text-sm font-semibold text-red-600">Errors in this Gallery</h4>
                                            <ul className="list-disc space-y-1 pl-5 text-sm text-red-600">
                                                {selectedFacultyErrors.map((msg, i) => (
                                                    <li key={i}>{msg}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <SectionFooter onSave={handleSubmit} onPreview={handlePreview} />
            {dialogOpen && dialogType && (
                <FacultyDialog type={dialogType} faculty={selectedFaculty} onClose={() => setDialogOpen(false)} onSave={handleSave} />
            )}
        </div>
    );
};

export default FacultySection;
