import { MasterDetailPanel } from '@/components/admin/master-detail-panel';
import { Input } from '@/components/ui/input';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Administration, ContentPages } from '@/types/content';
import { useForm } from '@inertiajs/react';
import { ImageIcon, UserRoundPlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { AdministrationDialog } from '@/components/admin/dialogs/content/admin-dialog';
import InputError from '@/components/input-error';

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
    type: string;
    profile?: File | null;
    previewUrl?: string | null;
}

interface AdministrationForm {
    page?: PageForm;
    officials?: OfficialsForm[];
}

const OfficialPhoto: React.FC<{ url: string | null; alt: string }> = ({ url, alt }) => {
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
            position: official.position || '',
            type: official.type || '',
            profile: null,
            previewUrl: official.profile_picture_path || null,
        })),
    });

    const getSelectedOfficialIndex = () => {
        return officialsList?.findIndex((o) => o.administration_id === selectedOfficialId);
    };

    const getSelectedOfficialErrors = () => {
        const index = getSelectedOfficialIndex();
        if (index === -1 || index === undefined) return [];

        return Object.entries(errors)
            .filter(([key]) => key.startsWith(`officials.${index}.`))
            .map(([, msg]) => msg);
    };

    const selectedOfficialErrors = getSelectedOfficialErrors();

    const officialErrorCount = errors ? Object.keys(errors).filter((key) => key.startsWith('officials.')).length : 0;

    const selectedOfficial = officialsList.find((o) => o.administration_id === selectedOfficialId) ?? null;

    const handlePreview = () => {
        window.open('/about/administration', '_blank');
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
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleSave = (formData: OfficialsForm) => {
        setOfficialsList((prev) => {
            const current = prev ?? [];
            const existingIndex = current.findIndex((o) => o.administration_id === formData.administration_id);
            let updatedList;
            let officialForLocalState: Administration;

            officialForLocalState = {
                administration_id: formData.administration_id ?? 0,
                first_name: formData.first_name,
                middle_name: formData.middle_name || null,
                last_name: formData.last_name,
                suffix: formData.suffix || null,
                position: formData.position,
                type: formData.type,
                profile_picture_path: formData.previewUrl || null,
            };

            if (existingIndex !== -1) {
                updatedList = current.map((o) => (o.administration_id === officialForLocalState.administration_id ? officialForLocalState : o));
            } else {
                const newId = Math.max(0, ...current.map((o) => o.administration_id || 0)) + 1;
                officialForLocalState.administration_id = newId;
                updatedList = [...current, officialForLocalState];
            }

            setData((prevData) => {
                const officialForForm: OfficialsForm = {
                    administration_id: officialForLocalState.administration_id,
                    first_name: officialForLocalState.first_name,
                    middle_name: officialForLocalState.middle_name || '',
                    last_name: officialForLocalState.last_name,
                    suffix: officialForLocalState.suffix || '',
                    type: officialForLocalState.type || '',
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

    // Derived list items for MasterDetailPanel
    const listItems = officialsList.map((official, index) => ({
        id: official.administration_id,
        label: [
            official.first_name,
            official.middle_name ? official.middle_name[0] + '.' : '',
            official.last_name,
            official.suffix ? ', ' + official.suffix : '',
            '—',
            official.position,
        ]
            .filter(Boolean)
            .join(' '),
        hasError: !!(
            errors[`officials.${index}.first_name`] ||
            errors[`officials.${index}.last_name`] ||
            errors[`officials.${index}.position`] ||
            errors[`officials.${index}.type`] ||
            errors[`officials.${index}.profile`]
        ),
    }));

    // Detail panel content
    const detail = selectedOfficial ? (
        <div className="space-y-6">
            <div className="border-border overflow-hidden rounded-lg border">
                <OfficialPhoto url={selectedOfficial.profile_picture_path} alt={selectedOfficial.profile_picture_name} />
            </div>

            <div>
                <h4 className="text-foreground text-xl font-semibold break-words">
                    {selectedOfficial.first_name} {selectedOfficial.middle_name ? selectedOfficial.middle_name[0] + '. ' : ''}
                    {selectedOfficial.last_name}
                    {selectedOfficial.suffix ? ', ' + selectedOfficial.suffix : ''}
                </h4>
                <p className="text-destructive text-sm font-normal">{selectedOfficial.type} Official</p>
                <p className="text-muted-foreground text-sm font-normal">{selectedOfficial.position}</p>
            </div>

            {selectedOfficialErrors.length > 0 && (
                <div className="border-destructive/40 bg-destructive/10 rounded-md border p-4">
                    <h4 className="text-destructive mb-2 text-sm font-semibold">Errors in this official</h4>
                    <ul className="text-destructive list-disc space-y-1 pl-5 text-sm">
                        {selectedOfficialErrors.map((msg, i) => (
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
                    <h2 className="text-foreground text-lg font-semibold">University Administration Page</h2>
                    <p className="text-muted-foreground text-sm">Configure content</p>
                </div>

                {/* Page title / subtitle inputs */}
                <div className="mb-10 grid gap-6 md:grid-cols-2">
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

                <Separator className="my-10" />

                {/* Officials master-detail panel */}
                <MasterDetailPanel
                    title="University Officials"
                    description="Manage and preview each official's profile."
                    errorCount={officialErrorCount}
                    items={listItems}
                    selectedId={selectedOfficialId}
                    onSelect={(id) => setSelectedOfficialId(Number(id))}
                    onAdd={handleAddClick}
                    onEdit={(id) => {
                        const official = officialsList.find((o) => o.administration_id === Number(id));
                        if (official) handleEditClick(official);
                    }}
                    onDelete={(id) => handleDelete(Number(id))}
                    emptyListIcon={UserRoundPlus}
                    emptyListTitle="No officials yet"
                    addIcon={UserRoundPlus}
                    addLabel="Add New Official"
                    detail={detail}
                    emptyDetailTitle="No Official Selected"
                    emptyDetailDescription='Select an official on the left or click "Add New Official" to start.'
                />
            </div>

            <SectionFooter onSave={handleSubmit} onPreview={handlePreview} />

            {dialogOpen && (
                <AdministrationDialog type={dialogType} official={selectedOfficial} onClose={() => setDialogOpen(false)} onSave={handleSave} />
            )}
        </div>
    );
};

export default AdministrationSection;
