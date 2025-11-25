import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { InfoIcon } from 'lucide-react';
import { useRef, useState } from 'react';

// Section Imports
import AboutSection from '@/components/content/about-content';
import AdministrationSection from '@/components/content/admin-content';
import FacilitiesSection from '@/components/content/facilities-content';
import FacultySection from '@/components/content/faculty-content';
import HistorySection from '@/components/content/history-content';
import LocalTaskForceSection from '@/components/content/local-task-force-content';
import VmgoSection from '@/components/content/vmgo-content';
import WelcomeSection from '@/components/content/welcome-content';

import {
    Administration,
    CampusDirectors,
    CampusGallery,
    CampusGoals,
    ContentPages,
    Facilities,
    FacultyStaff,
    LocalTaskForce,
    OrganizationTypes,
    Pillars,
    Vmgo,
} from '@/types/content';
import { Head } from '@inertiajs/react';

interface History {
    directors: CampusDirectors[];
    gallery: CampusGallery[];
}

interface VisionMissionGoals {
    campus_goals: CampusGoals;
    pillars: Pillars[];
    vmgo: Vmgo;
}

interface MainContentProps {
    pages: ContentPages;
    org_types: OrganizationTypes[];
    officials: Administration[];
    faculties: FacultyStaff[];
    facilities: Facilities[];
    history: History;
    local_task_force: LocalTaskForce[];
    vmgo_data: VisionMissionGoals;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Content Management',
        href: `/main-content`,
    },
];

const MainContent = ({ ...props }: MainContentProps) => {
    const [activeSection, setActiveSection] = useState('welcome-landing');
    const { pages, officials, facilities, org_types, faculties, history, local_task_force, vmgo_data } = props;

    const about_page = pages.find((page: ContentPages) => page.page === 'About') ?? null;
    const history_page = pages.find((page: ContentPages) => page.page === 'History') ?? null;
    const admin_page = pages.find((page: ContentPages) => page.page === 'Administration') ?? null;
    const faculty_page = pages.find((page: ContentPages) => page.page === 'Faculty & Staff') ?? null;
    const facility_page = pages.find((page: ContentPages) => page.page === 'Facilities') ?? null;
    const ltf_page = pages.find((page: ContentPages) => page.page === 'Local Task Force') ?? null;
    const vmgo_page = pages.find((page: ContentPages) => page.page === 'Vision, Mission & Goals') ?? null;

    const aboutRef = useRef(null);
    const vmgoRef = useRef(null);
    const historyRef = useRef(null);
    const administrationRef = useRef(null);
    const facultiesRef = useRef(null);
    const facilitiesRef = useRef(null);
    const localTaskForceRef = useRef(null);
    const welcomeLandingRef = useRef(null);

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
        { id: 'welcome-landing', label: 'Home', ref: welcomeLandingRef },
        { id: 'about', label: 'About', ref: aboutRef },
        { id: 'vmgo', label: 'Vision, Mission & Goals', ref: vmgoRef },
        { id: 'history', label: 'History', ref: historyRef },
        { id: 'administration', label: 'Administration', ref: administrationRef },
        { id: 'facilities', label: 'Facilities', ref: facilitiesRef },
        { id: 'faculties', label: 'Faculty & Staff', ref: facultiesRef },
        { id: 'task-force', label: 'Local Task Force', ref: localTaskForceRef },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Campus Information - Content Management" />
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
                            {/* Temporary welcome holder section only */}
                            <div ref={welcomeLandingRef} className="scroll-mt-6">
                                <WelcomeSection />
                            </div>

                            <div ref={aboutRef} className="scroll-mt-6">
                                <AboutSection about_page={about_page} org_types={org_types} />
                            </div>

                            <div ref={vmgoRef} className="scroll-mt-6">
                                <VmgoSection vmgo_page={vmgo_page} vmgo_data={vmgo_data} />
                            </div>

                            <div ref={historyRef} className="scroll-mt-6">
                                <HistorySection history_page={history_page} history={history} />
                            </div>

                            <div ref={administrationRef} className="scroll-mt-6">
                                <AdministrationSection admin_page={admin_page} officials={officials} />
                            </div>

                            <div ref={facilitiesRef} className="scroll-mt-6">
                                <FacilitiesSection facility_page={facility_page} facilities={facilities} />
                            </div>

                            <div ref={facultiesRef} className="scroll-mt-6">
                                <FacultySection faculty_page={faculty_page} faculty_members={faculties} />
                            </div>

                            <div ref={localTaskForceRef} className="scroll-mt-6">
                                <LocalTaskForceSection ltf_page={ltf_page} local_task_force={local_task_force} />
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
