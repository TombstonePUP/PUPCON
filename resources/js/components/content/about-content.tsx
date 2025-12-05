import OrganizationsSection from '@/components/content/organizations/organization-section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { ContentPages, OrganizationTypes } from '@/types/content';
import { useForm } from '@inertiajs/react';
import { Edit2, Trash2, Upload } from 'lucide-react';
import { useEffect } from 'react';
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
        <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">About Page</h2>
                    <p className="text-sm text-gray-600">Configure main about page content</p>
                </div>

                {/* Title & Subtitle */}
                <div className="mb-10 grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                        <Input
                            type="text"
                            value={data.page.title}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    page: { ...data.page, title: e.target.value },
                                })
                            }
                            placeholder="Enter welcome title..."
                            disabled={processing}
                        />
                        <InputError message={errors['page.title']} className="mt-2" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Subtitle</label>
                        <Input
                            type="text"
                            value={data.page.subtitle}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    page: { ...data.page, subtitle: e.target.value },
                                })
                            }
                            placeholder="Enter welcome subtitle..."
                            disabled={processing}
                        />
                        <InputError message={errors['page.subtitle']} className="mt-2" />
                    </div>
                </div>

                {/* Banner Upload */}
                <div className="mb-8">
                    <h3 className="mb-2 text-sm font-medium text-gray-700">Welcome Banner</h3>

                    <div className="mt-5 flex flex-col gap-3">
                        {!data.page.previewUrl ? (
                            <label className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-12 text-center transition-all duration-300 hover:border-[#7f1414]/70">
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                <div className="flex flex-col items-center justify-center gap-4 pt-5 pb-6">
                                    <div className="relative">
                                        <div className="rounded-fullopacity-20 absolute inset-0 animate-pulse"></div>
                                        <div className="relative grid h-16 w-16 place-items-center rounded-full border-2 border-dashed transition-transform duration-300 group-hover:scale-105">
                                            <Upload className="h-6 w-6 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className="mb-1 text-lg font-semibold text-gray-700">Upload Welcome Banner</p>
                                        {/* <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p> */}
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">PNG</span>
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">JPG</span>
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">Max 5MB</span>
                                    </div>
                                </div>
                            </label>
                        ) : (
                            <div className="group relative">
                                <img
                                    src={data.page.previewUrl}
                                    alt="Preview"
                                    className="h-48 w-full rounded-lg border border-gray-200 object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-lg bg-black/40 opacity-0 transition group-hover:opacity-100">
                                    <input id="replace-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-12 w-12 rounded-full bg-white p-0"
                                        onClick={() => document.getElementById('replace-image')?.click()}
                                        disabled={processing}
                                    >
                                        <Edit2 className="h-5 w-5 text-red-600" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-12 w-12 rounded-full bg-white p-0"
                                        onClick={() =>
                                            setData({
                                                ...data,
                                                page: { ...data.page, banner: null, previewUrl: null },
                                            })
                                        }
                                        disabled={processing}
                                    >
                                        <Trash2 className="h-5 w-5 text-red-600" />
                                    </Button>
                                </div>
                            </div>
                        )}
                        <InputError message={errors['page.banner']} className="mt-2" />
                    </div>
                </div>

                <Separator className="my-10 bg-gray-200" />

                <OrganizationsSection org_types={data.org_types} onUpdateOrgTypes={handleUpdateOrgTypes} errors={errors} />
                {orgTypeErrors.length > 0 && (
                    <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-4">
                        <h4 className="mb-2 font-semibold text-red-700">Organization Type Errors</h4>
                        <ul className="ml-6 list-disc text-sm text-red-600">
                            {orgTypeErrors.map((msg, index) => (
                                <li key={index}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <Separator className="my-10 bg-gray-200" />

                {/* Contact Info */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Address</label>
                        <Input
                            type="text"
                            value={data.page.address}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    page: { ...data.page, address: e.target.value },
                                })
                            }
                            placeholder="Enter campus address..."
                            disabled={processing}
                        />
                        <InputError message={errors['page.address']} className="mt-2" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Phone number</label>
                        <Input
                            type="text"
                            value={data.page.phone_number}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    page: { ...data.page, phone_number: e.target.value },
                                })
                            }
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
