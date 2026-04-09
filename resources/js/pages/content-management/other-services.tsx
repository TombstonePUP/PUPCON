import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ContentPages, OtherServices } from '@/types/content';
import { useForm, Head } from '@inertiajs/react';
import { LibrarySquare } from 'lucide-react';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import ServicesSection from '@/components/content/other-services-section';
import InputError from '@/components/input-error';
import { PageTitle } from '@/components/page-header';
import { Card } from '@/components/ui/card';

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

const OtherServicesSection = ({ ...props }: OtherServicesProps) => {
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

  const [activeSection, setActiveSection] = useState('overview');
  const overviewRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const sections = useMemo(() => [
    { id: 'overview', label: 'Page Overview', ref: overviewRef },
    { id: 'services', label: 'Services & Portals', ref: servicesRef },
  ], []);

  const [scrollLock, setScrollLock] = useState(false);
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>, sectionId: string) => {
    setScrollLock(true);
    setActiveSection(sectionId);

    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setTimeout(() => setScrollLock(false), 600);
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      if (scrollLock) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      if (section.ref.current) observer.observe(section.ref.current);
    });

    return () => {
      sections.forEach((section) => {
        if (section.ref.current) observer.unobserve(section.ref.current);
      });
    };
  }, [sections, scrollLock]);

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
              <div id="overview" ref={overviewRef} className="scroll-mt-20">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Other Services & Portals Page</h2>
                  <p className="text-sm text-muted-foreground">Configure page content</p>
                </div>

                <div className="mb-10 grid grid-cols-1 gap-6">
                  <div>
                    <Label className="mb-2 block text-sm font-medium text-foreground">Title</Label>
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
                    <Label className="mb-2 block text-sm font-medium text-foreground">Subtitle / Description</Label>
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
              </div>

              <Separator className="my-10" />

              <div id="services" ref={servicesRef} className="scroll-mt-20">
                <ServicesSection
                  services={data.other_services}
                  onUpdateServices={handleUpdateServices}
                />
              </div>
            </div>

            <SectionFooter onSave={handleSave} onPreview={handlePreview} />
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};


export default OtherServicesSection;
