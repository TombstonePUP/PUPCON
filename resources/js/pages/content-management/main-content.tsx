import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { InfoIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';

// Section Imports
import AboutPageSection from './about-content';
import AdminContentSection from './admin-content';
import FacultyContentSection from './faculty-content';
import HistoryContentSection from './history-content';
import LocalTaskForceContentSection from './localtaskforce-content';
import VmgoContentSection from './vmgo-content';
import FacilitiesSection from '@/components/content/facilities-content';
import { Administration, ContentPages, Facilities, FacultyStaff, OrganizationTypes } from '@/types/content';
import AdministrationSection from '@/components/content/admin-content';
import AboutSection from '@/components/content/about-content';
import FacultySection from '@/components/content/faculty-content';

interface MainContentProps {
    pages: ContentPages;
    org_types: OrganizationTypes[];
    officials: Administration[];
    faculties: FacultyStaff[];
    facilities: Facilities[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Content Management',
        href: `/main-content`,
    },
];

const PlaceholderSection: React.FC<{ title: string }> = ({ title }) => (
    <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
        <div className="p-8">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600">This section is not yet implemented.</p>
        </div>
    </div>
);

const MainContent = ({...props}: MainContentProps) => {
    const [activeSection, setActiveSection] = useState('about');
    const {pages, officials, facilities, org_types, faculties} = props;

    console.log('Pages data in MainContent:', pages);

    const admin_page = pages.find((page: ContentPages) => page.page === "Administration") ?? null;
    const facility_page = pages.find((page: ContentPages) => page.page === "Facilities")?? null;
    const about_page = pages.find((page: ContentPages) => page.page === "About")?? null;
    const faculty_page = pages.find((page: ContentPages) => page.page === "Faculty & Staff") ?? null;

    const aboutRef = useRef(null);
    const vmgoRef = useRef(null);
    const historyRef = useRef(null);
    const administrationRef = useRef(null);
    const facultiesRef = useRef(null);
    const facilitiesRef = useRef(null);
    const localTaskForceRef = useRef(null);

    // --- THIS SCROLLS TO THE CLICKED SECTION ---
    const scrollToSection = (ref, sectionId) => {
        setActiveSection(sectionId);
        if (ref.current) {
            ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    const sections = [
        { id: 'about', label: 'About', ref: aboutRef },
        { id: 'vmgo', label: 'Vision, Mission & Goals', ref: vmgoRef },
        { id: 'history', label: 'History', ref: historyRef },
        { id: 'administration', label: 'Administration', ref: administrationRef },
        { id: 'faculties', label: 'Faculty & Staff', ref: facultiesRef },
        { id: 'facilities', label: 'Facilities', ref: facilitiesRef },
        { id: 'task-force', label: 'Local Task Force', ref: localTaskForceRef },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex flex-col gap-4 p-6">
                {/* Header Section */}
                <div id="header" className="mb-2 rounded-lg border border-gray-200 bg-white p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#7f1414]">
                            <InfoIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-2">
                            <h1 className="text-xl font-semibold text-gray-900">Campus Information</h1>
                            <p className="text-sm text-gray-500">Manage all content related to the "About" page and its sub-sections.</p>
                        </div>
                    </div>
                </div>

                {/* Main Content with Sidebar */}
                <div className="flex gap-6">
                    <div className="flex-1">
                        <div className="space-y-6">
                            <div ref={aboutRef} className="scroll-mt-6">
                                <AboutSection
                                    about_page={about_page}
                                    org_types={org_types}
                                />
                            </div>

                            <div ref={vmgoRef} className="scroll-mt-6">
                                <VmgoContentSection />
                            </div>

                            <div ref={historyRef} className="scroll-mt-6">
                                <HistoryContentSection />
                            </div>

                            <div ref={administrationRef} className="scroll-mt-6">
                                {/*<AdminContentSection />*/}
                                <AdministrationSection
                                    admin_page={admin_page}
                                    officials={officials}
                                />
                            </div>

                            <div ref={facultiesRef} className="scroll-mt-6">
                            {/*<FacultyContentSection />*/}
                                <FacultySection
                                    faculty_page={faculty_page}
                                    faculty_members={faculties}
                                />
                            </div>

                            <div ref={facilitiesRef} className="scroll-mt-6">
                                <FacilitiesSection
                                    facility_page={facility_page}
                                    facilities={facilities}
                                />
                            </div>

                            <div ref={localTaskForceRef} className="scroll-mt-6">
                                <LocalTaskForceContentSection />
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar - Quick Links */}
                    <div className="w-64 shrink-0">
                        <div className="sticky top-6">
                            <div className="rounded-lg border border-gray-200 bg-white p-4">
                                <h3 className="mb-4 text-sm font-semibold text-gray-900">Quick Links</h3>
                                <nav className="space-y-1">
                                    {sections.map((section) => (
                                        <button
                                            key={section.id}
                                            onClick={() => scrollToSection(section.ref, section.id)}
                                            className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${activeSection === section.id ? 'bg-[#7f1414] text-white' : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {section.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default MainContent;
