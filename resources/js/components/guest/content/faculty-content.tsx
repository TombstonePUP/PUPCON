import { MasterDetailPanel } from '@/components/admin/master-detail-panel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import { ContentPages, FacultyStaff } from '@/types/content';
import { useForm } from '@inertiajs/react';
import { ImageIcon, UserRoundPlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FacultyDialog } from '@/components/admin/dialogs/content/faculty-dialog';
import InputError from '@/components/input-error';

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

const FacultyPhoto: React.FC<{ url: string | null; alt: string }> = ({ url, alt }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [url]);

    if (!url || hasError) {
        return (
            <div className="animate-in fade-in-0 border-border bg-muted text-muted-foreground flex h-64 w-full flex-col items-center justify-center rounded-md border">
                <ImageIcon className="h-12 w-12" />
                <span className="mt-2 text-sm">No Image Available</span>
            </div>
        );
    }

    return (
        <img
            src={url}
            alt={alt}
            className="animate-in fade-in-0 border-border bg-muted h-64 w-full rounded-md border object-cover"
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

    const selectedFaculty = faculties.find((f) => f.faculty_staff_id === selectedFacultyId) ?? null;

    const { data, setData, post, errors } = useForm<FacultyForm>({
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
            const facultyForLocalState: FacultyStaff = {
                faculty_staff_id: facultyData.faculty_staff_id,
                first_name: facultyData.first_name,
                middle_name: facultyData.middle_name || '',
                last_name: facultyData.last_name,
                personnel_type: facultyData.personnel_type || '',
                status: facultyData.status,
                program_id: facultyData.program_id || null,
                program_coordinator: facultyData.program_coordinator,
                image_path: facultyData.previewUrl || null,
            };

            if (existingIndex !== -1) {
                updatedList = current.map((f) => (f.faculty_staff_id === facultyForLocalState.faculty_staff_id ? facultyForLocalState : f));
            } else {
                const newId = Math.max(0, ...current.map((f) => f.faculty_staff_id || 0)) + 1;
                facultyForLocalState.faculty_staff_id = newId;
                updatedList = [...current, facultyForLocalState];
            }

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

    // Derived list items for MasterDetailPanel
    const listItems = faculties.map((member, index) => ({
        id: member.faculty_staff_id,
        label: [member.first_name, member.middle_name ? member.middle_name[0] + '.' : '', member.last_name].filter(Boolean).join(' '),
        hasError: !!(
            errors[`faculties.${index}.first_name`] ||
            errors[`faculties.${index}.last_name`] ||
            errors[`faculties.${index}.status`] ||
            errors[`faculties.${index}.personnel_type`] ||
            errors[`faculties.${index}.program_coordinator`] ||
            errors[`faculties.${index}.faculty_image`]
        ),
    }));

    // Detail panel content
    const detail = selectedFaculty ? (
        <div className="space-y-6">
            <div className="border-border overflow-hidden rounded-lg border">
                <FacultyPhoto url={selectedFaculty.image_path} alt={selectedFaculty.image_name} />
            </div>

            <div>
                <h4 className="text-foreground text-lg font-semibold break-words">
                    {selectedFaculty.first_name} {selectedFaculty.middle_name ? selectedFaculty.middle_name + ' ' : ''}
                    {selectedFaculty.last_name}
                </h4>
                {selectedFaculty.programs?.program_name && (
                    <h6 className="text-foreground text-sm font-semibold break-words">{selectedFaculty.programs.program_name}</h6>
                )}
                <p className="text-destructive text-sm font-normal">{selectedFaculty.status}</p>
            </div>

            {selectedFacultyErrors.length > 0 && (
                <div className="border-destructive/40 bg-destructive/10 rounded-md border p-4">
                    <h4 className="text-destructive mb-2 text-sm font-semibold">Errors in this member</h4>
                    <ul className="text-destructive list-disc space-y-1 pl-5 text-sm">
                        {selectedFacultyErrors.map((msg, i) => (
                            <li key={i}>{msg}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    ) : null;

    return (
        <div className="border-border bg-background scroll-mt-6 rounded-lg border">
            <div className="p-8">
                {/* Page header */}
                <div className="mb-6">
                    <h2 className="text-foreground text-lg font-semibold">Faculty & Staff Page</h2>
                    <p className="text-muted-foreground text-sm">Configure page content</p>
                </div>

                {/* Page title / subtitle & quote inputs */}
                <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Left column: Title & Subtitle */}
                    <div className="space-y-6">
                        <div>
                            <label className="text-foreground mb-2 block text-sm font-medium">Title</label>
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
                            <label className="text-foreground mb-2 block text-sm font-medium">Subtitle</label>
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

                    {/* Right column: Quote section */}
                    <div className="border-border bg-muted/30 flex flex-col rounded-lg border p-6">
                        <div className="flex flex-1 flex-col space-y-6">
                            <div>
                                <Label className="text-foreground mb-2 block text-sm font-medium">Author</Label>
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
                                <Label className="text-foreground mb-2 block text-sm font-medium">Quote Text</Label>
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

                <Separator className="my-10" />

                {/* Faculty & Staff master-detail panel */}
                <MasterDetailPanel
                    title="Faculty & Staff Members"
                    description="Manage and preview each faculty or staff member."
                    errorCount={facultiesErrorCount}
                    items={listItems}
                    selectedId={selectedFacultyId}
                    onSelect={(id) => setSelectedFacultyId(Number(id))}
                    onAdd={handleAddClick}
                    onEdit={(id) => {
                        const faculty = faculties.find((f) => f.faculty_staff_id === Number(id));
                        if (faculty) handleEditClick(faculty);
                    }}
                    onDelete={(id) => handleDelete(Number(id))}
                    emptyListIcon={UserRoundPlus}
                    emptyListTitle="No members yet"
                    addIcon={UserRoundPlus}
                    addLabel="Add New Member"
                    detail={detail}
                    emptyDetailTitle="No Member Selected"
                    emptyDetailDescription="Select a member on the left to see details."
                />
            </div>

            <SectionFooter onSave={handleSubmit} onPreview={handlePreview} />

            {dialogOpen && dialogType && (
                <FacultyDialog type={dialogType} faculty={selectedFaculty} onClose={() => setDialogOpen(false)} onSave={handleSave} />
            )}
        </div>
    );
};

export default FacultySection;
