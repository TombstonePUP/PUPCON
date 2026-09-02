import { FacilitiesDialog } from '@/components/admin/dialogs/content/facilities-dialog';
import { MasterDetailPanel } from '@/components/admin/master-detail-panel';
import { Input } from '@/components/ui/input';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import { ContentPages, Facilities } from '@/types/content';
import { useForm } from '@inertiajs/react';
import { Building2, ImageIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import InputError from '@/components/input-error';

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

const FacilityPhoto: React.FC<{ url: string | null; alt: string }> = ({ url, alt }) => {
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

const FacilitiesSection: React.FC = ({ ...props }: FacilitiesProps) => {
    const { facilities, facility_page } = props;
    const [facilityList, setFacilityList] = useState<Facilities[]>(facilities ?? []);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'add' | 'edit'>('add');
    const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(null);

    const { data, setData, post, errors } = useForm<FacilitiesForm>({
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

    const getSelectedFacilityIndex = () => {
        return facilityList?.findIndex((f) => f.facility_id === selectedFacilityId);
    };

    const getSelectedFacilityErrors = () => {
        const index = getSelectedFacilityIndex();
        if (index === -1 || index === undefined) return [];

        return Object.entries(errors)
            .filter(([key]) => key.startsWith(`facilities.${index}.`))
            .map(([, msg]) => msg);
    };

    const selectedFacilityErrors = getSelectedFacilityErrors();

    const facilitiesErrorCount = errors ? Object.keys(errors).filter((key) => key.startsWith('facilities.')).length : 0;

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
        post(route('content.facilities.update'), {
            onSuccess: () => {
                // reset();
            },
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleSave = (formData: FacilityForm) => {
        setFacilityList((prev) => {
            const current = prev ?? [];
            const existingIndex = current.findIndex((f) => f.facility_id === formData.facility_id);
            let updatedList;
            const facilityForLocalState: Facilities = {
                facility_id: formData.facility_id ?? 0,
                facility_name: formData.facility_name,
                description: formData.description,
                image_path: formData.previewUrl || null,
            };

            if (existingIndex !== -1) {
                updatedList = current.map((f) => (f.facility_id === facilityForLocalState.facility_id ? facilityForLocalState : f));
            } else {
                const newId = Math.max(0, ...current.map((f) => f.facility_id || 0)) + 1;
                facilityForLocalState.facility_id = newId;
                updatedList = [...current, facilityForLocalState];
            }

            setData((prevData) => {
                const facilityForForm: FacilityForm = {
                    facility_id: facilityForLocalState.facility_id,
                    facility_name: formData.facility_name,
                    description: formData.description,
                    facility_image: formData.facility_image,
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

    // Derived list items for MasterDetailPanel
    const listItems = facilityList.map((facility, index) => ({
        id: facility.facility_id,
        label: facility.facility_name,
        hasError: !!(
            errors[`facilities.${index}.facility_name`] ||
            errors[`facilities.${index}.description`] ||
            errors[`facilities.${index}.facility_image`]
        ),
    }));

    // Detail panel content
    const detail = selectedFacility ? (
        <div className="space-y-6">
            <div className="border-border overflow-hidden rounded-lg border">
                <FacilityPhoto url={selectedFacility.image_path} alt={selectedFacility.image_name} />
            </div>

            <div>
                <h4 className="text-foreground text-lg font-semibold break-words">{selectedFacility.facility_name}</h4>
            </div>

            <Separator />

            <div>
                <h5 className="text-foreground mb-2 text-sm font-semibold">Description</h5>
                <p className="text-muted-foreground text-sm">{selectedFacility.description}</p>
            </div>

            {selectedFacilityErrors.length > 0 && (
                <div className="border-destructive/40 bg-destructive/10 rounded-md border p-4">
                    <h4 className="text-destructive mb-2 text-sm font-semibold">Errors in this facility</h4>
                    <ul className="text-destructive list-disc space-y-1 pl-5 text-sm">
                        {selectedFacilityErrors.map((msg, i) => (
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
                    <h2 className="text-foreground text-lg font-semibold">Facilities Page</h2>
                    <p className="text-muted-foreground text-sm">Configure page content</p>
                </div>

                {/* Page title / description inputs */}
                <div className="mb-10 grid grid-cols-1 gap-6">
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
                        <label className="text-foreground mb-2 block text-sm font-medium">Subtitle / Description</label>
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

                <Separator className="my-10" />

                {/* Facilities master-detail panel */}
                <MasterDetailPanel
                    title="Campus Facilities"
                    description="Manage and preview each campus facility."
                    errorCount={facilitiesErrorCount}
                    items={listItems}
                    selectedId={selectedFacilityId}
                    onSelect={(id) => setSelectedFacilityId(Number(id))}
                    onAdd={handleAddClick}
                    onEdit={(id) => {
                        const facility = facilityList.find((f) => f.facility_id === Number(id));
                        if (facility) handleEditClick(facility);
                    }}
                    onDelete={(id) => handleDelete(Number(id))}
                    emptyListIcon={Building2}
                    emptyListTitle="No facilities yet"
                    addIcon={Building2}
                    addLabel="Add New Facility"
                    detail={detail}
                    emptyDetailTitle="No Facility Selected"
                    emptyDetailDescription='Select a facility on the left or click "Add New Facility" to start.'
                />
            </div>

            <SectionFooter onSave={handleSubmit} onPreview={handlePreview} />

            {dialogOpen && (
                <FacilitiesDialog type={dialogType} facility={selectedFacility} onClose={() => setDialogOpen(false)} onSave={handleSave} />
            )}
        </div>
    );
};

export default FacilitiesSection;
