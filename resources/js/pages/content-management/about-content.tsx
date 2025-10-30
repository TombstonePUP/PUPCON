import ImageUploader from '@/components/imageuploader';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SectionFooter from '@/components/ui/section-footer';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { FileText, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { Head } from '@inertiajs/react';

// Section Imports //
import { Button } from '@/components/ui/button';
import HistoryContentSection from './history-content';
import VmgoContentSection from './vmgo-content';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Content Management',
        href: `/about-content`,
    },
];

const AboutContent = () => {
    const [missionVision, setMissionVision] = useState({
        welcome_title: '',
        welcome_subtitle: '',
        mission: '',
        vision: '',
    });

    const [bannerFile, setBannerFile] = useState(null);
    const [activeSection, setActiveSection] = useState('mission-vision');

    // Refs for scrolling
    const missionVisionRef = useRef(null);
    const adminRef = useRef(null);
    const strategicGoalsRef = useRef(null);
    const campusGoalsRef = useRef(null);
    const facultiesRef = useRef(null);
    const historyRef = useRef(null);
    const facilitiesRef = useRef(null);

    const handleMissionVisionChange = (field, value) => {
        setMissionVision((prev) => ({ ...prev, [field]: value }));
    };

    const scrollToSection = (ref, sectionId) => {
        setActiveSection(sectionId);
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleSave = () => {
        console.log('Saving Vision & Mission section...');
    };

    const handlePreview = () => {
        window.open('/about/vision-mission-goals', '_blank');
    };

    const sections = [
        { id: 'mission-vision', label: 'Mission & Vision', ref: missionVisionRef },
        { id: 'history', label: 'History', ref: historyRef },
        { id: 'administration', label: 'Administration', ref: adminRef },
        { id: 'strategic-goals', label: 'Strategic Goals', ref: strategicGoalsRef },
        { id: 'campus-goals', label: 'Campus Goals', ref: campusGoalsRef },
        { id: 'faculties', label: 'Faculty & Staffs', ref: facultiesRef },
        { id: 'facilties', label: 'Facilities', ref: facilitiesRef },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Content Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-6">
                {/* Header Section */}
                <div className="mb-2 rounded-lg border border-gray-200 bg-white p-8">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#7f1414]">
                            <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-2">
                            <h1 className="text-2xl font-semibold text-gray-900">Content Management</h1>
                            <p className="text-sm text-gray-600">
                                Lagyan nito na lang sa iba kung matino tignan, mas balance tigna pag naka padding and border gaya sa per programs
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content with Sidebar */}
                <div className="flex gap-6">
                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="space-y-6">
                            {/* About Section */}
                            <div ref={missionVisionRef} className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
                                <div className="p-8">
                                    <div className="mb-6">
                                        <h2 className="text-lg font-semibold text-gray-900">About Page</h2>
                                        <p className="text-sm text-gray-600">Configure about page content</p>
                                    </div>

                                    {/* Welcome Title & Subtitle */}
                                    <div className="mb-10 grid gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                                            <Input
                                                type="text"
                                                value={missionVision.welcome_title}
                                                onChange={(e) => handleMissionVisionChange('welcome_title', e.target.value)}
                                                placeholder="Enter welcome title..."
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Subtitle</label>
                                            <Input
                                                type="text"
                                                value={missionVision.welcome_subtitle}
                                                onChange={(e) => handleMissionVisionChange('welcome_subtitle', e.target.value)}
                                                placeholder="Enter welcome subtitle..."
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-8 md:grid-cols-2">
                                        {/* Banner Image Upload */}
                                        <div className="mb-8 md:col-span-2">
                                            <h3 className="mb-2 text-sm font-medium text-gray-700">Welcome Banner</h3>
                                            <ImageUploader
                                                initialImage="/images/sample-banner.png"
                                                onImageChange={(file) => setBannerFile(file)}
                                                uploadText="Upload welcome banner"
                                                changeText="Change banner"
                                                sizeText="PNG, JPG up to 5MB"
                                            />
                                        </div>
                                    </div>

                                    {/* Organizations */}
                                    <div className="mb-8 md:col-span-2">
                                        <div className="overflow-hidden rounded-xl">
                                            {/* Header */}
                                            <div className="flex items-center justify-between py-4">
                                                <div>
                                                    {/* <h3 className="text-sm font-medium text-gray-700">Campus Organizations</h3> */}
                                                    {/* <p className="mt-1 text-xs text-gray-500">Manage academic and non-academic organizations</p> */}
                                                </div>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="noborder" size="default">
                                                            <Plus className="h-4 w-4" />
                                                            Add Organization
                                                        </Button>
                                                    </DialogTrigger>

                                                    <DialogContent className="overflow-hidden rounded-2xl p-0 sm:max-w-md">
                                                        <div className="rounded-2xl bg-white">
                                                            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div>
                                                                        <DialogTitle className="text-lg font-semibold text-gray-900">
                                                                            Add Organization
                                                                        </DialogTitle>
                                                                        <p className="text-sm text-gray-500">
                                                                            Add new academic or non-academic organization
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="p-6">
                                                                <Tabs defaultValue="academic" className="mb-4 w-full">
                                                                    <TabsList className="grid w-full grid-cols-2 gap-2 border-none bg-transparent">
                                                                        <TabsTrigger
                                                                            value="academic"
                                                                            className="rounded-lg border border-gray-200 bg-white px-2 py-2 font-medium text-gray-600 transition-all duration-200 hover:border-[#7f1414]/30 data-[state=active]:border-[#7f1414] data-[state=active]:bg-[#7f1414] data-[state=active]:text-white data-[state=active]:shadow-md"
                                                                        >
                                                                            Academic
                                                                        </TabsTrigger>
                                                                        <TabsTrigger
                                                                            value="non-academic"
                                                                            className="rounded-lg border border-gray-200 bg-white px-2 py-2 font-medium text-gray-600 transition-all duration-200 hover:border-[#7f1414]/30 data-[state=active]:border-[#7f1414] data-[state=active]:bg-[#7f1414] data-[state=active]:text-white data-[state=active]:shadow-md"
                                                                        >
                                                                            Non-Academic
                                                                        </TabsTrigger>
                                                                    </TabsList>
                                                                </Tabs>

                                                                <div className="space-y-4">
                                                                    <div>
                                                                        <Label className="text-sm font-medium text-gray-700">Organization Name</Label>
                                                                        <Input placeholder="Enter organization name" className="mt-1.5 text-sm" />
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-sm font-medium text-gray-700">Affiliation</Label>
                                                                        <Input
                                                                            placeholder="Enter affiliated program or leave blank"
                                                                            className="mt-1.5 text-sm"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-end gap-3 rounded-b-2xl border-t border-gray-200 bg-gray-50 px-6 py-4">
                                                                <DialogClose asChild>
                                                                    <Button className="cursor-pointer rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                                                                        Cancel
                                                                    </Button>
                                                                </DialogClose>
                                                                <Button className="flex items-center gap-2 rounded-lg bg-[#7f1414] px-4 py-2 text-sm font-medium text-white transition">
                                                                    <Save className="h-4 w-4" />
                                                                    Save
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>

                                            {/* Content */}
                                            <div className="space-y-4 rounded-xl border p-6 text-sm">
                                                {/* Academic Organizations */}
                                                <div className="group rounded-lg border border-gray-200 bg-white p-5 transition-all duration-300 hover:border-[#7f1414]/70">
                                                    <div className="mb-4 flex items-center justify-between">
                                                        <h4 className="text-base font-semibold text-gray-900">Academic Organizations</h4>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 transition hover:border-[#7f1414]/30 hover:bg-white">
                                                            <div>
                                                                <span className="block font-medium text-gray-900">
                                                                    Governing League of Information Technology Challengers
                                                                </span>
                                                                <span className="text-xs text-gray-500">BS Information Technology</span>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <button className="flex items-center gap-1 rounded-md border border-transparent px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-100 hover:text-[#7f1414]">
                                                                    <Pencil className="h-4 w-4" />
                                                                    Edit
                                                                </button>
                                                                <button className="flex items-center gap-1 rounded-md border border-transparent px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-100 hover:text-[#7f1414]">
                                                                    <Trash2 className="h-4 w-4" />
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Non-Academic Organizations */}
                                                <div className="group rounded-lg border border-gray-200 bg-white p-5 transition-all duration-300 hover:border-[#7f1414]/70">
                                                    <div className="mb-4 flex items-center justify-between">
                                                        <h4 className="text-base font-semibold text-gray-900">Non-Academic Organizations</h4>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 transition hover:border-[#7f1414]/30 hover:bg-white">
                                                            <div>
                                                                <span className="block font-medium text-gray-900">
                                                                    Commission on Athletics and Sports
                                                                </span>
                                                                <span className="text-xs text-gray-500">Athletics & Sports Club</span>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <button className="flex items-center gap-1 rounded-md border border-transparent px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-100 hover:text-[#7f1414]">
                                                                    <Pencil className="h-4 w-4" />
                                                                    Edit
                                                                </button>
                                                                <button className="flex items-center gap-1 rounded-md border border-transparent px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-100 hover:text-[#7f1414]">
                                                                    <Trash2 className="h-4 w-4" />
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 rounded-xl border p-6 text-sm">
                                        <div className="mb-6">
                                            <h2 className="text-lg font-semibold text-gray-900">Contact & Office Hours</h2>
                                            <p className="text-sm text-gray-600">Configure campus basic contact information</p>
                                        </div>

                                        {/* Welcome Title & Subtitle */}
                                        <div className="mb-10 grid gap-6 md:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700">Address</label>
                                                <Input
                                                    type="text"
                                                    value={missionVision.welcome_title}
                                                    onChange={(e) => handleMissionVisionChange('welcome_title', e.target.value)}
                                                    placeholder="Enter campus address..."
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700">Phone number</label>
                                                <Input
                                                    type="text"
                                                    value={missionVision.welcome_subtitle}
                                                    onChange={(e) => handleMissionVisionChange('welcome_subtitle', e.target.value)}
                                                    placeholder="Enter phone number..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <SectionFooter onSave={handleSave} onPreview={handlePreview} />
                            </div>

                            {/* PAGE IMPORT HERE */}
                            <VmgoContentSection />
                            <HistoryContentSection />
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

export default AboutContent;
