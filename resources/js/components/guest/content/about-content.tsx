import OrganizationsSection from '@/components/guest/content/organizations/organization-section';
import { Input } from '@/components/ui/input';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { ContentPages, OrganizationTypes } from '@/types/content';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import ImageUpload from '../image-upload';
import InputError from '../input-error';

interface AboutProps {
    about_page: ContentPages;
    org_types: OrganizationTypes[];
}

interface PageForm {
    content_page_id?: number;
    title: string;
    subtitle: string;
    address: string;
    phone_number: string;
    banner?: File | null;
    previewUrl?: string | null;
}

interface AboutForm {
    page: PageForm;
    org_types: OrganizationTypes[];
}

const AboutSection = ({ about_page, org_types }: AboutProps) => {
    const { data, setData, post, errors, processing } = useForm<AboutForm>({
        page: {
            content_page_id: about_page?.content_page_id,
            page: about_page?.page || 'About',
            title: about_page?.title || '',
            subtitle: about_page?.subtitle || '',
            address: about_page?.address || '',
            phone_number: about_page?.phone_number || '',
            banner: null,
            previewUrl: about_page?.image_path || null,
        },
        org_types: org_types || [],
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setData({
                ...data,
                page: {
                    ...data.page,
                    banner: file,
                    previewUrl,
                },
            });
        }
    };

    const extractOrgTypeErrors = (errors: Record<string, string>) => {
        return Object.entries(errors)
            .filter(([key]) => {
                // Must start with org_types
                if (!key.startsWith('org_types.')) return false;

                // Exclude nested organizations keys
                return !key.includes('.organizations.');
            })
            .map(([, message]) => message);
    };

    const orgTypeErrors = extractOrgTypeErrors(errors);

    useEffect(() => {
        return () => {
            if (data.page?.previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(data.page?.previewUrl);
            }
        };
    }, [data.page?.previewUrl]);

    const handleUpdateOrgTypes = (updatedOrgTypes: OrganizationTypes[]) => {
        setData({
            ...data,
            org_types: updatedOrgTypes,
        });
    };

    const handleSave = () => {
        post(route('content.about.update'), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handlePreview = () => {
        window.open('/about', '_blank');
    };

    return (
        <div className="border-border bg-card scroll-mt-6 rounded-lg border">
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-foreground text-lg font-semibold">About Page</h2>
                    <p className="text-muted-foreground text-sm">Configure main about page content</p>
                </div>

                {/* Title & Subtitle */}
                <div className="mb-10 grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="text-foreground mb-2 block text-sm font-medium">Title</label>
                        <Input
                            type="text"
                            value={data.page.title}
                            onChange={(e) => setData({ ...data, page: { ...data.page, title: e.target.value } })}
                            placeholder="Enter welcome title..."
                            disabled={processing}
                        />
                        <InputError message={errors['page.title']} className="mt-2" />
                    </div>
                    <div>
                        <label className="text-foreground mb-2 block text-sm font-medium">Subtitle</label>
                        <Input
                            type="text"
                            value={data.page.subtitle}
                            onChange={(e) => setData({ ...data, page: { ...data.page, subtitle: e.target.value } })}
                            placeholder="Enter welcome subtitle..."
                            disabled={processing}
                        />
                        <InputError message={errors['page.subtitle']} className="mt-2" />
                    </div>
                </div>

                {/* Banner Upload */}
                <div className="mb-8">
                    <h3 className="text-foreground mb-2 text-sm font-medium">Welcome Banner</h3>
                    <div className="mt-5">
                        <ImageUpload
                            value={data.page.banner}
                            previewUrl={data.page.previewUrl ?? null}
                            onChange={(file, url) =>
                                setData((prev) => ({
                                    ...prev,
                                    page: { ...prev.page, banner: file, previewUrl: url },
                                }))
                            }
                            onRemove={() =>
                                setData((prev) => ({
                                    ...prev,
                                    page: { ...prev.page, banner: null, previewUrl: null },
                                }))
                            }
                            label="Upload Welcome Banner"
                            aspectRatio={16 / 9}
                            disabled={processing}
                            error={errors['page.banner']}
                            inputId="welcome-banner"
                        />
                    </div>
                </div>

                <Separator className="my-10" />

                <OrganizationsSection org_types={data.org_types} onUpdateOrgTypes={handleUpdateOrgTypes} errors={errors} />
                {orgTypeErrors.length > 0 && (
                    <div className="border-destructive/30 bg-destructive/10 mt-4 rounded-md border p-4">
                        <h4 className="text-destructive mb-2 font-semibold">Organization Type Errors</h4>
                        <ul className="text-destructive ml-6 list-disc text-sm">
                            {orgTypeErrors.map((msg, index) => (
                                <li key={index}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <Separator className="my-10" />

                {/* Contact Info */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="text-foreground mb-2 block text-sm font-medium">Address</label>
                        <Input
                            type="text"
                            value={data.page.address}
                            onChange={(e) => setData({ ...data, page: { ...data.page, address: e.target.value } })}
                            placeholder="Enter campus address..."
                            disabled={processing}
                        />
                        <InputError message={errors['page.address']} className="mt-2" />
                    </div>
                    <div>
                        <label className="text-foreground mb-2 block text-sm font-medium">Phone number</label>
                        <Input
                            type="text"
                            value={data.page.phone_number}
                            onChange={(e) => setData({ ...data, page: { ...data.page, phone_number: e.target.value } })}
                            placeholder="Enter phone number..."
                            disabled={processing}
                        />
                        <InputError message={errors['page.phone_number']} className="mt-2" />
                    </div>
                </div>
            </div>

            <SectionFooter onSave={handleSave} onPreview={handlePreview} />
        </div>
    );
};

export default AboutSection;
