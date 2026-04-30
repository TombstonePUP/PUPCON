import ServicesSection from '@/components/content/other-services-section';
import InputError from '@/components/input-error';
import { PageTitle } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ContentPages, OtherServices } from '@/types/content';
import { Head, useForm } from '@inertiajs/react';
import { LibrarySquare } from 'lucide-react';
import React from 'react';

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

const OtherServicesPage = ({ ...props }: OtherServicesProps) => {
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
    };

    const handleSave = () => {
        post(route('other.services.update'));
    };

    const handlePreview = () => {
        window.open('/others', '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Other Services - Content Management" />
            <PageTitle
                title="Other Services"
                description='Manage all content related to the "Other services" page and its sub-sections.'
                icon={<LibrarySquare className="size-5" />}
            />

            <div className="flex gap-6">
                <div className="flex-1">
                    <Card>
                        <div className="p-8">
                            {/* Page overview */}
                            <div id="overview" ref={overviewRef} className="scroll-mt-20">
                                <div className="mb-6">
                                    <h2 className="text-foreground text-lg font-semibold">Other Services & Portals Page</h2>
                                    <p className="text-muted-foreground text-sm">Configure page content</p>
                                </div>

                                <div className="mb-10 grid grid-cols-1 gap-6">
                                    <div>
                                        <Label className="text-foreground mb-2 block text-sm font-medium">Title</Label>
                                        <Input
                                            type="text"
                                            placeholder="Enter page title..."
                                            disabled={processing}
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
                                        <Label className="text-foreground mb-2 block text-sm font-medium">Subtitle / Description</Label>
                                        <Textarea
                                            placeholder="Enter page subtitle..."
                                            disabled={processing}
                                            value={data.page.subtitle}
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
                                            minHeight={100}
                                        />
                                        <InputError message={errors['page.subtitle']} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-10" />

                            {/* Services & Portals */}
                            <div id="services" ref={servicesRef} className="scroll-mt-20">
                                <ServicesSection services={data.other_services} onUpdateServices={handleUpdateServices} />
                            </div>
                        </div>

                        <SectionFooter onSave={handleSave} onPreview={handlePreview} />
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default OtherServicesPage;
