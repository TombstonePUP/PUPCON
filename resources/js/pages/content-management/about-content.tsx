import ImageUploader from '@/components/imageuploader';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/text-area';
import { Eye, Pencil, Save } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';

const AboutContent = () => {
    const [missionVision, setMissionVision] = useState({
        welcome_title: '',
        welcome_subtitle: '',
        mission: '',
        vision: '',
    });

    const [bannerFile, setBannerFile] = useState(null);

    const handleMissionVisionChange = (field, value) => {
        setMissionVision((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <AppLayout>
            <div className="flex h-full flex-1 flex-col gap-4 p-6">
                {/* Header Section */}
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Content Management</h1>
                        <p className="mt-1 text-sm text-gray-600">Manage mission and vision</p>
                    </div>
                </div>

                {/* Mission & Vision Section */}
                <div className="rounded-lg border border-gray-200 bg-white">
                    {/* Card Content */}
                    <div className="p-8">
                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Mission & Vision</h2>
                                <p className="text-sm text-gray-600">Configure mission and vision content</p>
                            </div>
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
                    </div>

                    {/* Save / Clear Footer */}
                    <div className="rounded-b-2xl border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <div className="flex items-center justify-between">
                            {/* Left side - Preview */}
                            <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                                <Eye className="h-4 w-4 text-gray-600" />
                                Preview
                            </button>

                            {/* Right side - Edit & Save */}
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                                    <Pencil className="h-4 w-4 text-gray-600" />
                                    Edit
                                </button>

                                <button className="flex items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#6b1010]">
                                    <Save className="h-4 w-4" />
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default AboutContent;