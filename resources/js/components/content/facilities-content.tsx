import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import { ContentPages, Facilities } from '@/types/content';
import { useForm } from '@inertiajs/react';
import { EditIcon, ImageIcon, Plus, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FacilitiesDialog } from '@/components/dialogs/content/facilities-dialog';
import InputError from '../input-error';

interface FacilitiesProps {
    facility_page: ContentPages;
    facilities: Facilities[];
}
interface PageForm {
    content_page_id?: number;
    page: string;
    title: string;
    description: string;
}
interface FacilityForm {
    facility_id?: number;
    facility_name: string;
    description: string;
    facility_image?: File | null;
    previewUrl?: string | null;
}
interface FacilitiesForm {
    page?: PageForm;
    facilities?: FacilityForm[];
}

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

const FacilityPhoto: React.FC<{ url: string | null; alt: string }> = ({ url, alt }) => {
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

const FacilitiesSection: React.FC = ({ ...props }: FacilitiesProps) => {
    const { facilities, facility_page } = props;
    const [facilityList, setFacilityList] = useState<Facilities[]>(facilities ?? []);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');

    const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<FacilitiesForm>({
        page: {
            content_page_id: facility_page?.content_page_id,
            title: facility_page?.title,
            description: facility_page?.description,
            page: facility_page?.page || 'Facilities',
        },
        facilities: facilityList?.map((facility) => ({
            facility_id: facility.facility_id,
            facility_name: facility.facility_name,
            description: facility.description || '',
            facility_image: null,
        })),
    });

    const selectedFacility = facilityList.find((f) => f.facility_id === selectedFacilityId) ?? null;

    const handlePreview = () => {
        window.open('/about/facilities', '_blank');
    };

    const handleAddClick = () => {
        setDialogType('add');
        setSelectedFacilityId(null);
        setDialogOpen(true);
    };

    const handleEditClick = (facility: Facilities) => {
        setDialogType('edit');
        setSelectedFacilityId(facility.facility_id);
        setDialogOpen(true);
    };

    const handleDelete = (facilityId: number) => {
        setFacilityList((prev) => {
            const updatedList = prev.filter((f) => f.facility_id !== facilityId);

            setData((prevData) => ({
                ...prevData,
                facilities: updatedList,
            }));

            return updatedList;
        });
    };

    const handleSubmit = () => {
        console.log('page:', facility_page);
        console.log('Facilities being submitted:', data.page);
        post(route('content.facilities.update'), {
            onSuccess: () => {
                // reset();
            }
        });
    };

    const handleSave = (formData: FacilityForm) => {
        setFacilityList((prev) => {
            const current = prev ?? [];
            const existingIndex = current.findIndex((f) => f.facility_id === formData.facility_id);
            let updatedList;
            let facilityForLocalState: Facilities; // Object for display (facilityList)

            // Local State Update
            facilityForLocalState = {
                facility_id: formData.facility_id ?? 0,
                facility_name: formData.facility_name,
                description: formData.description,
                image_path: formData.previewUrl || null, // <- Use the previewUrl here for local display
            };

            if (existingIndex !== -1) {
                updatedList = current.map((f) => (f.facility_id === facilityForLocalState.facility_id ? facilityForLocalState : f));
            } else {
                const newId = Math.max(0, ...current.map((f) => f.facility_id || 0)) + 1;
                facilityForLocalState.facility_id = newId; // Assign new ID to the local object
                updatedList = [...current, facilityForLocalState];
            }

            // Data Syncing
            setData((prevData) => {
                const facilityForForm: FacilityForm = {
                    facility_id: facilityForLocalState.facility_id, // Use the assigned ID
                    facility_name: formData.facility_name,
                    description: formData.description,
                    facility_image: formData.facility_image, // <- Use the actual File object here
                };

                let formFacilities;
                const formIndex = prevData.facilities?.findIndex((f) => f.facility_id === facilityForLocalState.facility_id);

                if (formIndex !== undefined && formIndex !== -1) {
                    formFacilities = prevData.facilities?.map((f, index) => (index === formIndex ? facilityForForm : f));
                } else {
                    formFacilities = [...(prevData.facilities ?? []), facilityForForm];
                }

                return {
                    ...prevData,
                    facilities: formFacilities,
                };
            });

            setSelectedFacilityId(facilityForLocalState.facility_id);

            return updatedList;
        });
    };
    return (
        <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
            <div className="p-8">
                {/* --- Page Title/Description inputs (No changes) --- */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Facilities Page</h2>
                    <p className="text-sm text-gray-600">Configure page content</p>
                </div>
                <div className="mb-10 grid grid-cols-1 gap-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                        <Input
                            type="text"
                            placeholder="Enter page title..."
                            value={data.page.title}
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
                        <label className="mb-2 block text-sm font-medium text-gray-700">Subtitle / Description</label>
                        <Textarea
                            placeholder="Enter page subtitle..."
                            value={data.page?.description}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    page: {
                                        ...data.page,
                                        description: e.target.value,
                                    },
                                })
                            }
                            autoResize
                            minHeight={100}
                        />
                        <InputError message={errors['page.description']} className="mt-2" />
                    </div>
                </div>

                <Separator className="my-10 bg-gray-200" />

                {/* --- Campus Facilities Section --- */}
                <div className="mb-6">
                    <h3 className="mb-4 text-base font-semibold text-gray-900">Campus Facilities</h3>
                    <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                        <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-6">
                            <h4 className="mb-3 text-xs text-gray-500">Select a Facility</h4>
                            <div className="space-y-1">
                                {facilityList?.map((facility) => (
                                    <div
                                        key={facility.facility_id}
                                        onClick={() => {
                                            setSelectedFacilityId(facility.facility_id);
                                        }}
                                        className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-4 transition-colors ${facility.facility_id === selectedFacility?.facility_id
                                            ? 'bg-[#7f1414]/4'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="truncate text-sm">
                                            <span
                                                className={` ${facility.facility_id === selectedFacility?.facility_id ? 'font-normal text-red-900' : 'text-gray-700'}`}
                                            >
                                                {facility.facility_name}
                                            </span>
                                        </div>
                                        <div
                                            className={`flex items-center space-x-0.5 transition-opacity ${facility.facility_id === selectedFacility?.facility_id
                                                ? 'opacity-100'
                                                : 'opacity-0 group-hover:opacity-100'
                                                }`}
                                        >
                                            <ActionButton
                                                onClick={() => {
                                                    handleEditClick(facility);
                                                }}
                                                className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                            >
                                                <EditIcon className="h-4 w-4" />
                                            </ActionButton>
                                            <ActionButton
                                                onClick={() => handleDelete(facility.facility_id)}
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
                                    <Plus className="mr-2 h-4 w-4" /> Add New Facility
                                </Button>
                            </div>
                        </div>

                        {/* Right Pane: Facility Details */}
                        <div className="w-2/3 p-6">
                            {selectedFacility === null ? (
                                <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                                    <X className="mb-2 h-8 w-8" />
                                    <p className="font-medium">No Facility Selected</p>
                                    <p className="text-sm">Select a facility on the left or click "Add New Facility" to start.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="overflow-hidden rounded-lg border border-gray-100">
                                        <FacilityPhoto url={selectedFacility.image_path} alt={selectedFacility.image_name} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold break-words text-gray-900">{selectedFacility.facility_name}</h4>
                                    </div>
                                    <Separator className="bg-gray-200" />
                                    <div>
                                        <h5 className="mb-2 text-sm font-semibold text-gray-700">Description</h5>
                                        <p className="text-sm text-gray-700">{selectedFacility.description}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <SectionFooter onSave={handleSubmit} onPreview={handlePreview} />
            {dialogOpen && (
                <FacilitiesDialog type={dialogType} facility={selectedFacility} onClose={() => setDialogOpen(false)} onSave={handleSave} />
            )}
        </div>
    );
};

export default FacilitiesSection;
