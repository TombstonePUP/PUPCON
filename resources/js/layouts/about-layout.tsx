import PageHeader from '@/components/guest-page-header';
import PageAside from '@/components/page-aside';
import { ScrollIndicator } from '@/components/scroll-indicator';
import Layout from '@/layouts/landing-layout';
import { Head, usePoll } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface ContentPageLayoutProps {
  headTitle: string;
  title: string;
  breadcrumbs: { label: string; href: string }[];
  pageSections: { label: string; href: string }[];
  children: React.ReactNode;
}

const QUICK_LINKS = [
  { label: 'Vision, Mission & Goals', href: '/about/vision-mission-goals' },
  { label: 'History', href: '/about/history' },
  { label: 'Administration', href: '/about/administration' },
  { label: 'Facilities', href: '/about/facilities' },
  { label: 'Faculty & Staff', href: '/about/faculty-and-staff' },
  { label: 'Local Task Force', href: '/about/local-task-force' },
];

export default function ContentPageLayout({
  headTitle,
  title,
  breadcrumbs,
  pageSections,
  children,
}: ContentPageLayoutProps) {
  usePoll(5000);
  const scrollRef = useRef<HTMLElement>(null);


  // State
  const [activeSection, setActiveSection] = useState<string>('');

  // Add this useEffect for scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = pageSections.map((s) => s.href);
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            setActiveSection(sectionIds[i]);
            return;
          }
        }
      }
      setActiveSection(sectionIds[0] ?? '');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pageSections]);

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.getElementById(href)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <>
      <Head title={headTitle} />
      <Layout>
        <div className="bg-white text-gray-800">
          <PageHeader title={title} breadcrumbs={breadcrumbs} />

          <div className="mx-auto w-[75%] px-6 py-12 lg:flex lg:gap-8">
            <PageAside quickLinks={QUICK_LINKS} />

            <div className="relative flex-1 lg:w-3/4">
              <main
                ref={scrollRef}
                className="hide-scrollbar space-y-20 overflow-auto scroll-smooth"
              >
                {children}
              </main>

              <ScrollIndicator containerRef={scrollRef} />
            </div>


            {pageSections.length > 1 && (
              <div className='shrink-0 sticky top-24 self-start border border-gray-200 rounded-lg bg-white p-6 hidden lg:block'>
                <h2 className="mb-4 font-semibold text-[#7f1414ab]">ON THIS PAGE</h2>
                <nav className="space-y-1 ml-2">
                  {pageSections.map((item) => {
                    const isActive = activeSection === item.href;
                    return (
                      <a
                        key={item.href}
                        href={`#${item.href}`
                        }
                        onClick={(e) => handleSectionClick(e, item.href)}
                        className={`  block text-sm px-4 my-4 border-l-2 transition-all duration-150  ${isActive
                          ? 'border-[#7f1414]' : 'border-transparent text-gray-500 font-normal hover:text-gray-800 hover:border-gray-300'
                          }`}>
                        {item.label}
                      </a>
                    );
                  })}
                </nav>
              </div>
            )}

          </div>
        </div>
      </Layout >
    </>
  );
}