import { PageTitle } from '@/components/admin/page-header';
import AppLayout from '@/layouts/admin/app-layout';
import type { BreadcrumbItem } from '@/types';
import { InfoIcon } from 'lucide-react';
import { useMemo, useRef } from 'react';

// Section Imports
import AboutSection from '@/components/guest/content/about-content';
import AdministrationSection from '@/components/guest/content/admin-content';
import FacilitiesSection from '@/components/guest/content/facilities-content';
import FacultySection from '@/components/guest/content/faculty-content';
import HistorySection from '@/components/guest/content/history-content';
import LocalTaskForceSection from '@/components/guest/content/local-task-force-content';
import VmgoSection from '@/components/guest/content/vmgo-content';
import WelcomeSection from '@/components/guest/content/welcome-content';

import TableOfContents from '@/components/guest/table-of-contents';
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
    welcome_gallery: CampusGallery[];
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
    const { pages, officials, facilities, org_types, faculties, history, local_task_force, vmgo_data, welcome_gallery } = props;

    const about_page = pages.find((page: ContentPages) => page.page === 'About') ?? null;
    const history_page = pages.find((page: ContentPages) => page.page === 'History') ?? null;
    const admin_page = pages.find((page: ContentPages) => page.page === 'Administration') ?? null;
    const faculty_page = pages.find((page: ContentPages) => page.page === 'Faculty & Staff') ?? null;
    const facility_page = pages.find((page: ContentPages) => page.page === 'Facilities') ?? null;
    const ltf_page = pages.find((page: ContentPages) => page.page === 'Local Task Force') ?? null;
    const vmgo_page = pages.find((page: ContentPages) => page.page === 'Vision, Mission & Goals') ?? null;
    const welcome_page = pages.find((page: ContentPages) => page.page === 'Welcome') ?? null;

    const aboutRef = useRef(null);
    const vmgoRef = useRef(null);
    const historyRef = useRef(null);
    const administrationRef = useRef(null);
    const facultiesRef = useRef(null);
    const facilitiesRef = useRef(null);
    const localTaskForceRef = useRef(null);
    const welcomeLandingRef = useRef(null);



    const sections = useMemo(
        () => [
            { id: 'welcome-landing', label: 'Home', ref: welcomeLandingRef },
            { id: 'about', label: 'About', ref: aboutRef },
            { id: 'vmgo', label: 'Vision, Mission & Goals', ref: vmgoRef },
            { id: 'history', label: 'History', ref: historyRef },
            { id: 'administration', label: 'Administration', ref: administrationRef },
            { id: 'facilities', label: 'Facilities', ref: facilitiesRef }, // ✅ Moved here
            { id: 'faculties', label: 'Faculty & Staff', ref: facultiesRef }, // ✅ Moved after facilities
            { id: 'task-force', label: 'Local Task Force', ref: localTaskForceRef },
        ],
        [],
    );



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Campus Information - Content Management" />
            <PageTitle
                title="Campus Information"
                description='Manage all content related to the "About" page and its sub-sections.'
                icon={<InfoIcon className="size-5" />}
            />

            {/* Main Content with Sidebar */}
            <div className="flex gap-6">
                <div className="flex-1">
                    <div className="space-y-6">
                        {/* Welcome Landing */}
                        <div id="welcome-landing" ref={welcomeLandingRef} className="scroll-mt-20">
                            <WelcomeSection welcome_page={welcome_page} gallery={welcome_gallery} />
                        </div>

                        {/* About */}
                        <div id="about" ref={aboutRef} className="scroll-mt-20">
                            <AboutSection about_page={about_page} org_types={org_types} />
                        </div>

                        {/* VMGO */}
                        <div id="vmgo" ref={vmgoRef} className="scroll-mt-20">
                            <VmgoSection vmgo_page={vmgo_page} vmgo_data={vmgo_data} />
                        </div>

                        {/* History */}
                        <div id="history" ref={historyRef} className="scroll-mt-20">
                            <HistorySection history_page={history_page} history={history} />
                        </div>

                        {/* Administration */}
                        <div id="administration" ref={administrationRef} className="scroll-mt-20">
                            <AdministrationSection admin_page={admin_page} officials={officials} />
                        </div>

                        {/* Facilities - */}
                        <div id="facilities" ref={facilitiesRef} className="scroll-mt-20">
                            <FacilitiesSection facility_page={facility_page} facilities={facilities} />
                        </div>

                        {/* Faculty & Staff - */}
                        <div id="faculties" ref={facultiesRef} className="scroll-mt-20">
                            <FacultySection faculty_page={faculty_page} faculty_members={faculties} />
                        </div>

                        {/* Local Task Force */}
                        <div id="task-force" ref={localTaskForceRef} className="scroll-mt-20">
                            <LocalTaskForceSection ltf_page={ltf_page} local_task_force={local_task_force} />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Quick Links */}
                <TableOfContents sections={sections} />
            </div>
        </AppLayout>
    );
};

export default MainContent;
