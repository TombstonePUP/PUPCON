import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ContentPages, OtherServices } from '@/types/content';
import { useForm } from '@inertiajs/react';
import { EditIcon, LibrarySquare, Link, Plus, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import ServicesSection from '@/components/content/other-services-section';
import InputError from '@/components/input-error';

interface OtherServicesProps {
    services_page: ContentPages;
    services: OtherServices[];
}

interface OtherServicesForm {
    page: ContentPages;
    other_services: OtherServices[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Other services',
        href: `/other-services`,
    },
];

const OtherServicesSection: React.FC = ({...props}: OtherServicesProps) => {
    const { services_page, services } = props;
    const { data, setData, post, errors, processing } = useForm<OtherServicesForm>({
        page: {
            content_page_id: services_page?.content_page_id || Date.now(),
            page: services_page?.page || 'Other Services',
            title: services_page?.title,
            subtitle: services_page?.subtitle || '',
        },
        other_services: services?.map((service) => ({
            service_id: service.service_id || Date.now(),
            service_name: service.service_name || '',
            description: service.description || '',
            service_link: service.service_link || '',
        })),
    });

    const handleUpdateServices = (updatedServices: OtherServices[]) => {
        setData('other_services', updatedServices);
    }

    const handleSave = () => {
        post(route('other.services.update'));
    };

    const handlePreview = () => {
        window.open('/others', '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 p-6">
                {/* Header Section */}
                <div className="mb-2 rounded-lg border border-gray-200 bg-white p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#7f1414]">
                            <LibrarySquare className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-2">
                            <h1 className="text-xl font-semibold text-gray-900">Other Services</h1>
                            <p className="text-sm text-gray-500">Manage all content related to the "Other services" page and its sub-sections.</p>
                        </div>
                    </div>
                </div>
                <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
                    <div className="p-8">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Other Services & Portals Page</h2>
                            <p className="text-sm text-gray-600">Configure page content</p>
                        </div>

                        <div className="mb-10 grid grid-cols-1 gap-6">
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Title</Label>
                                <Input
                                    type="text"
                                    placeholder="Enter page title..."
                                    disabled={processing}
                                    value={data.page.title}
                                    onChange={(e) => setData({
                                        ...data,
                                        page: {
                                            ...data.page,
                                            title: e.target.value,
                                        },
                                    })}
                                />
                                <InputError message={errors['page.title']} className="mt-2" />
                            </div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Subtitle / Description</Label>
                                <Textarea
                                    placeholder="Enter page subtitle..."
                                    disabled={processing}
                                    value={data.page.subtitle}
                                    onChange={(e) => setData({
                                        ...data,
                                        page: {
                                            ...data.page,
                                            subtitle: e.target.value,
                                        },
                                    })}
                                    autoResize
                                    minHeight={100}
                                />
                                <InputError message={errors['page.subtitle']} className="mt-2" />
                            </div>
                        </div>

                        <Separator className="my-10 bg-gray-200" />
                        {/* --- Services & Portals Section --- */}
                        <ServicesSection
                            services={data.other_services}
                            onUpdateServices={handleUpdateServices}
                        />
                    </div>

                    <SectionFooter onSave={handleSave} onPreview={handlePreview} />
                </div>
            </div>
        </AppLayout>
    );
};

export default OtherServicesSection;
