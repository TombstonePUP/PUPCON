import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Administration, ContentPages } from '@/types/content';
import { useForm } from '@inertiajs/react';
import { EditIcon, ImageIcon, Plus, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AdministrationDialog } from '../dialogs/content/admin-dialog';
import InputError from '../input-error';

interface AdministrationProps {
    admin_page: ContentPages;
    officials: Administration[];
}
interface PageForm {
    content_page_id?: number;
    title: string;
    subtitle: string;
    page: string;
}
interface OfficialsForm {
    administration_id?: number;
    first_name: string;
    middle_name?: string;
    last_name: string;
    suffix?: string;
    position: string;
    profile?: File | null;
    previewUrl?: string | null;
}
interface AdministrationForm {
    page?: PageForm;
    officials?: OfficialsForm[];
}

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

const OfficialPhoto: React.FC<{ url: string | null; alt: string }> = ({ url, alt }) => {
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

const AdministrationSection: React.FC = ({ ...props }: AdministrationProps) => {
    const { admin_page, officials } = props;
    const [officialsList, setOfficialsList] = useState<Administration[]>(officials ?? []);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');

    const [selectedOfficialId, setSelectedOfficialId] = useState<number | null>(null);

    const { data, setData, post, errors } = useForm<AdministrationForm>({
        page: {
            content_page_id: admin_page?.content_page_id,
            title: admin_page?.title,
            subtitle: admin_page?.subtitle,
            page: admin_page?.page || 'Administration',
        },
        officials: officialsList?.map((official) => ({
            administration_id: official.administration_id,
            first_name: official.first_name,
            middle_name: official.middle_name || '',
            last_name: official.last_name,
            suffix: official.suffix || '',
            profile: null,
            previewUrl: official.profile_picture_path || null,
        })),
    });

    const selectedOfficial = officialsList.find((o) => o.administration_id === selectedOfficialId) ?? null;

    const handlePreview = () => {
        window.open('/about/admin', '_blank');
    };

    const handleAddClick = () => {
        setDialogType('add');
        setSelectedOfficialId(null);
        setDialogOpen(true);
    };

    const handleEditClick = (official: Administration) => {
        setDialogType('edit');
        setSelectedOfficialId(official.administration_id);
        setDialogOpen(true);
    };

    const handleDelete = (officialId: number) => {
        setOfficialsList((prev) => {
            const updatedList = prev.filter((a) => a.administration_id !== officialId);

            setData((prevData) => ({
                ...prevData,
                officials: updatedList,
            }));

            return updatedList;
        });
    };

    const handleSubmit = () => {
        const finalData = {
            ...data,
            page: {
                ...data.page,
                content_page_id: admin_page?.content_page_id,
            },
        };
        post(route('content.administration.update'), {
            data: finalData,
            onSuccess: () => {
                // reset();
            },
        });
    };

    const handleSave = (formData: OfficialsForm) => {
        setOfficialsList((prev) => {
            const current = prev ?? [];
            const existingIndex = current.findIndex((o) => o.administration_id === formData.administration_id);
            let updatedList;
            let officialForLocalState: Administration; // Object for display (officialsList)

            // 1. Create the object for the local 'officialList' state
            // This uses the 'previewUrl' for immediate display.
            officialForLocalState = {
                administration_id: formData.administration_id ?? 0,
                first_name: formData.first_name,
                middle_name: formData.middle_name || null,
                last_name: formData.last_name,
                suffix: formData.suffix || null,
                position: formData.position,
                profile_picture_path: formData.previewUrl || null,
            };

            if (existingIndex !== -1) {
                updatedList = current.map((o) => (o.administration_id === officialForLocalState.administration_id ? officialForLocalState : o));
            } else {
                const newId = Math.max(0, ...current.map((o) => o.administration_id || 0)) + 1;
                officialForLocalState.administration_id = newId; // Assign new ID to the local object
                updatedList = [...current, officialForLocalState];
            }

            // 2. Sync with 'useForm' data for final submission
            setData((prevData) => {
                const officialForForm: OfficialsForm = {
                    administration_id: officialForLocalState.administration_id,
                    first_name: officialForLocalState.first_name,
                    middle_name: officialForLocalState.middle_name || '',
                    last_name: officialForLocalState.last_name,
                    suffix: officialForLocalState.suffix || '',
                    position: officialForLocalState.position,
                    profile: formData.profile || null,
                    previewUrl: officialForLocalState.profile_picture_path || null,
                };

                let formOfficials;
                const formIndex = prevData.officials?.findIndex((o) => o.administration_id === officialForLocalState.administration_id);

                if (formIndex !== undefined && formIndex !== -1) {
                    formOfficials = prevData.officials?.map((o, index) => (index === formIndex ? officialForForm : o));
                } else {
                    formOfficials = [...(prevData.officials ?? []), officialForForm];
                }

                return {
                    ...prevData,
                    officials: formOfficials,
                };
            });

            setSelectedOfficialId(officialForLocalState.administration_id);

            return updatedList;
        });
    };
    return (
        <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
            <div className="p-8">
                {/* --- Page Title/Description inputs (No changes) --- */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">University Administration Page</h2>
                    <p className="text-sm text-gray-600">Configure content</p>
                </div>
                <div className="mb-10 grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
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
                        <label className="mb-2 block text-sm font-medium text-gray-700">Subtitle</label>
                        <Input
                            type="text"
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
                        />
                        <InputError message={errors['page.subtitle']} className="mt-2" />
                    </div>
                </div>

                <Separator className="my-10 bg-gray-200" />

                {/* --- Campus Facilities Section --- */}
                <div className="mb-6">
                    <h3 className="mb-4 text-base font-semibold text-gray-900">University Officials</h3>
                    <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                        {/* Left Pane: Official List */}
                        <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-6">
                            <h4 className="mb-3 text-xs text-gray-500">Select an Official</h4>
                            <div className="space-y-1">
                                {officialsList.map((official) => (
                                    <div
                                        key={official.administration_id}
                                        onClick={() => {
                                            setSelectedOfficialId(official.administration_id);
                                        }}
                                        className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-4 transition-colors ${official.administration_id === selectedOfficialId ? 'bg-[#7f1414]/4' : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="truncate text-sm">
                                            <span
                                                className={` ${official.administration_id === selectedOfficialId ? 'font-normal text-red-900' : 'text-gray-700'}`}
                                            >
                                                {official.first_name} {official.middle_name ? official.middle_name[0] + ' ' : ''}
                                                {official.last_name} {official.suffix ? ', ' + official.suffix : ''} - {official.position}
                                            </span>
                                        </div>
                                        <div
                                            className={`flex items-center space-x-0.5 transition-opacity ${official.administration_id === selectedOfficialId
                                                ? 'opacity-100'
                                                : 'opacity-0 group-hover:opacity-100'
                                                }`}
                                        >
                                            <ActionButton
                                                onClick={(e) => {
                                                    // e.stopPropagation();
                                                    handleEditClick(official);
                                                }}
                                                className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                            >
                                                <EditIcon className="h-4 w-4" />
                                            </ActionButton>
                                            <ActionButton
                                                onClick={(e) => {
                                                    // e.stopPropagation();
                                                    handleDelete(official.administration_id);
                                                }}
                                                className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </ActionButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 border-t border-gray-200 pt-4">
                                <Button
                                    onClick={handleAddClick}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add New Official
                                </Button>
                            </div>
                        </div>

                        {/* Right Pane: Official Details */}
                        <div className="w-2/3 p-6">
                            {!selectedOfficial ? (
                                <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                                    <X className="mb-2 h-8 w-8" />
                                    <p className="font-medium">No Official Selected</p>
                                    <p className="text-sm">Select an official on the left or click "Add New Official" to start.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="overflow-hidden rounded-lg border border-gray-100">
                                        <OfficialPhoto
                                            url={selectedOfficial.profile_picture_path}
                                            alt={selectedOfficial.profile_picture_name}
                                        />
                                    </div>

                                    <div>
                                        <h4 className="text-xl font-semibold break-words text-gray-900">
                                            {selectedOfficial.first_name} {selectedOfficial.middle_name ? selectedOfficial.middle_name[0] + ' ' : ''}
                                            {selectedOfficial.last_name} {selectedOfficial.suffix ? ', ' + selectedOfficial.suffix : ''}
                                        </h4>
                                        <p className="text-sm font-normal text-red-700">{selectedOfficial.position}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <SectionFooter onSave={handleSubmit} onPreview={handlePreview} />
            {dialogOpen && (
                <AdministrationDialog
                    type={dialogType}
                    official={selectedOfficial}
                    onClose={() => setDialogOpen(false)}
                    onSave={handleSave} />
            )}
        </div>
    );
};

export default AdministrationSection;
