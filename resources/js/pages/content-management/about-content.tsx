import ImageUploader from '@/components/imageuploader';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/text-area';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Eye, FileText, Pencil, Plus, Save } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
                                            <div className="py-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        {/* <h3 className="mb-2 text-sm font-medium text-gray-700">Welcome Banner</h3> */}
                                                    </div>

                                                    {/* Add Organization Button + Dialog */}
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <button className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#6b1010]">
                                                                <Plus className="h-4 w-4" />
                                                                Add Organization
                                                            </button>
                                                        </DialogTrigger>

                                                        <DialogContent className="sm:max-w-md">
                                                            <DialogHeader>
                                                                <DialogTitle>Add Organization</DialogTitle>
                                                            </DialogHeader>

                                                            <Tabs defaultValue="academic" className="mb-4 w-full">
                                                                <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1">
                                                                    <TabsTrigger value="academic" className="data-[state=active]:bg-white">
                                                                        Academic
                                                                    </TabsTrigger>
                                                                    <TabsTrigger value="non-academic" className="data-[state=active]:bg-white">
                                                                        Non-Academic
                                                                    </TabsTrigger>
                                                                </TabsList>
                                                            </Tabs>

                                                            <div className="space-y-4">
                                                                <div>
                                                                    <Label className="text-sm font-medium text-gray-700">Organization Name</Label>
                                                                    <Input placeholder="Enter organization name" className="mt-1.5" />
                                                                </div>
                                                                <div>
                                                                    <Label className="text-sm font-medium text-gray-700">Program</Label>
                                                                    <Input placeholder="Enter corresponding program" className="mt-1.5" />
                                                                </div>
                                                                <Button className="mt-2 w-full">Add Organization</Button>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="space-y-6 p-6 border-2 rounded-xl">
                                                <div>
                                                    <div className="mb-3 flex items-center gap-2 ">
                                                        <h4 className="text-sm font-semibold text-gray-900">Academic Organizations</h4>
                                                    </div>
                                                    <ul className="space-y-2 text-sm">
                                                        <li className="flex items-center justify-between rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-transparent p-3 transition-all hover:border-blue-300">
                                                            <div>
                                                                <span className="font-medium text-gray-900">Example Academic Org</span>
                                                                <span className="mx-2 text-gray-300">—</span>
                                                                <span className="text-blue-600">BSIT</span>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div>
                                                    <div className="mb-3 flex items-center gap-2">
                                                        <h4 className="text-sm font-semibold text-gray-900">Non-Academic Organizations</h4>
                                                    </div>
                                                    <ul className="space-y-2 text-sm">
                                                        <li className="flex items-center justify-between rounded-lg border border-purple-100 bg-gradient-to-r from-purple-50 to-transparent p-3 transition-all hover:border-purple-300">
                                                            <div>
                                                                <span className="font-medium text-gray-900">Example Non-Academic Org</span>
                                                                <span className="mx-2 text-gray-300">—</span>
                                                                <span className="text-purple-600">Sports Club</span>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="rounded-b-lg border-t border-gray-200 bg-gray-50 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        {/* Preview Button with Dialog */}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                                                    <Eye className="h-4 w-4 text-gray-600" />
                                                    Preview
                                                </button>
                                            </DialogTrigger>

                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Preview Content</DialogTitle>
                                                    <DialogDescription className="my-2 leading-relaxed">
                                                        Clicking <strong>Preview</strong> will open a new tab in guest view so you can see how your
                                                        changes look publicly.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div>
                                                    <div className="flex justify-end gap-3">
                                                        <DialogClose asChild>
                                                            <button className="cursor-pointer rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                                                                Cancel
                                                            </button>
                                                        </DialogClose>

                                                        <button
                                                            onClick={() => {
                                                                window.open('/about/vision-mission-goals', '_blank');
                                                            }}
                                                            className="cursor-pointer rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#6b1010]"
                                                        >
                                                            Continue to Preview
                                                        </button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        {/* Edit + Save Buttons */}
                                        <div className="flex gap-3">
                                            <button className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                                                <Pencil className="h-4 w-4 text-gray-600" />
                                                Edit
                                            </button>

                                            <button className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#6b1010]">
                                                <Save className="h-4 w-4" />
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mission & Vision Section */}
                            <div ref={missionVisionRef} className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
                                <div className="p-8">
                                    <div className="mb-6">
                                        <h2 className="text-lg font-semibold text-gray-900">Mission & Vision</h2>
                                        <p className="text-sm text-gray-600">Configure mission and vision content</p>
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

                                    {/* Mission & Vision Textareas */}
                                    <div className="grid gap-8 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Mission</label>
                                            <Textarea
                                                autoResize
                                                value={missionVision.mission}
                                                onChange={(e) => handleMissionVisionChange('mission', e.target.value)}
                                                placeholder="Enter mission content..."
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Vision</label>
                                            <Textarea
                                                autoResize
                                                value={missionVision.vision}
                                                onChange={(e) => handleMissionVisionChange('vision', e.target.value)}
                                                placeholder="Enter vision content..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="rounded-b-lg border-t border-gray-200 bg-gray-50 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        {/* Preview Button with Dialog */}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                                                    <Eye className="h-4 w-4 text-gray-600" />
                                                    Preview
                                                </button>
                                            </DialogTrigger>

                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Preview Content</DialogTitle>
                                                    <DialogDescription className="my-2 leading-relaxed">
                                                        Clicking <strong>Preview</strong> will open a new tab in guest view so you can see how your
                                                        changes look publicly.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div>
                                                    <div className="flex justify-end gap-3">
                                                        <DialogClose asChild>
                                                            <button className="cursor-pointer rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                                                                Cancel
                                                            </button>
                                                        </DialogClose>

                                                        <button
                                                            onClick={() => {
                                                                window.open('/about/vision-mission-goals', '_blank');
                                                            }}
                                                            className="cursor-pointer rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#6b1010]"
                                                        >
                                                            Continue to Preview
                                                        </button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        {/* Edit + Save Buttons */}
                                        <div className="flex gap-3">
                                            <button className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                                                <Pencil className="h-4 w-4 text-gray-600" />
                                                Edit
                                            </button>

                                            <button className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#6b1010]">
                                                <Save className="h-4 w-4" />
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* History Section - Placeholder */}
                            <div ref={historyRef} className="scroll-mt-6 rounded-lg border border-gray-200 bg-white p-8">
                                <h2 className="text-lg font-semibold text-gray-900">History</h2>
                                <p className="mt-2 text-sm text-gray-600">Content coming soon...</p>
                            </div>

                            {/* Administration Section - Placeholder */}
                            <div ref={adminRef} className="scroll-mt-6 rounded-lg border border-gray-200 bg-white p-8">
                                <h2 className="text-lg font-semibold text-gray-900">UDP Plan</h2>
                                <p className="mt-2 text-sm text-gray-600">Content coming soon...</p>
                            </div>

                            {/* Strategic Goals Section - Placeholder */}
                            <div ref={strategicGoalsRef} className="scroll-mt-6 rounded-lg border border-gray-200 bg-white p-8">
                                <h2 className="text-lg font-semibold text-gray-900">Strategic Goals</h2>
                                <p className="mt-2 text-sm text-gray-600">Content coming soon...</p>
                            </div>

                            {/* Campus Goals Section - Placeholder */}
                            <div ref={campusGoalsRef} className="scroll-mt-6 rounded-lg border border-gray-200 bg-white p-8">
                                <h2 className="text-lg font-semibold text-gray-900">Campus Goals</h2>
                                <p className="mt-2 text-sm text-gray-600">Content coming soon...</p>
                            </div>

                            {/* Faculties Section - Placeholder */}
                            <div ref={facultiesRef} className="scroll-mt-6 rounded-lg border border-gray-200 bg-white p-8">
                                <h2 className="text-lg font-semibold text-gray-900">Faculty & Staffs</h2>
                                <p className="mt-2 text-sm text-gray-600">Content coming soon...</p>
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
                                            className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                                                activeSection === section.id ? 'bg-[#7f1414] text-white' : 'text-gray-700 hover:bg-gray-100'
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
