import { Input } from '@/components/ui/input';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import { CampusGoals, ContentPages, Pillars, Vmgo } from '@/types/content';
import { useForm } from '@inertiajs/react';
import React from 'react';
import InputError from '../input-error';
import PillarsSection from './vmgo/pillars';
import CampusGoalsSection from './vmgo/campus-goals';

interface VmgoData {
    campus_goals: CampusGoals[];
    pillars: Pillars[];
    vmgo: Vmgo;
}

interface VmgoContentSectionProps {
    vmgo_page: ContentPages;
    vmgo_data: VmgoData;
}

interface VmgoPageForm {
    content_page_id: number;
    page: string;
    title: string;
    description: string;
}

interface VmgoForm {
    page: VmgoPageForm;
    campus_goals: CampusGoals[];
    pillars: Pillars[];
    vmgo: Vmgo;
}

const VmgoContentSection: React.FC = ({ ...props }: VmgoContentSectionProps) => {
    const { vmgo_page, vmgo_data } = props;
    const { data, setData, post, errors, processing } = useForm<VmgoForm>({
        page: {
            content_page_id: vmgo_page.content_page_id,
            page: vmgo_page.page || 'Vision Mission & Goals',
            title: vmgo_page.title || '',
            description: vmgo_page.description || '',
        },
        campus_goals: vmgo_data.campus_goals || [],
        pillars: vmgo_data.pillars || [],
        vmgo: {
            vmgo_id: vmgo_data.vmgo?.vmgo_id || Date.now(),
            vision: vmgo_data.vmgo?.vision || '',
            mission: vmgo_data.vmgo?.mission || '',
            avp_link: vmgo_data.vmgo?.avp_link || null,
            avp_title: vmgo_data.vmgo?.avp_title || null,
            avp_description: vmgo_data.vmgo?.avp_description || null,
        },
    });

    const handleUpdateCampusGoals = (updatedGoals: CampusGoals[]) => {
        setData({
            ...data,
            campus_goals: updatedGoals,
        });
    };

    const handleUpdatePillars = (updatedPillars: Pillars[]) => {
        setData({
            ...data,
            pillars: updatedPillars,
        });
    };

    const handleSave = () => {
        console.log('Submitting VMGO Data:', data);
        post(route('content.vmgo.update'));
    };

    const handlePreview = () => {
        window.open('/about/vision-mission-goals', '_blank');
    };

    return (
        <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Vision, Mission, and Goals Page</h2>
                    <p className="text-sm text-gray-600">Configure content</p>
                </div>

                <div className="mb-8">
                    <h3 className="mb-4 text-base font-semibold text-gray-900">Page Content</h3>
                    <div className="grid gap-6 md:grid-cols-1">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                            <Input
                                type="text"
                                value={data.page.title}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        page: { ...data.page, title: e.target.value },
                                    })
                                }
                                placeholder="Enter Page title..."
                                disabled={processing}
                            />
                            <InputError message={errors['page.title']} className="mt-2" />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                            <Textarea
                                placeholder="Enter your page description..."
                                autoResize
                                minHeight={100}
                                maxHeight={250}
                                value={data.page.description}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        page: { ...data.page, description: e.target.value },
                                    })
                                }
                                disabled={processing}
                            />
                            <InputError message={errors['page.description']} className="mt-2" />
                        </div>
                    </div>
                </div>

                <Separator className="my-10 bg-gray-200" />

                <div className="mb-8">
                    <h3 className="mb-4 text-base font-semibold text-gray-900">Vision & Mission</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Vision</label>
                            <Textarea
                                placeholder="Enter vision..."
                                autoResize
                                minHeight={100}
                                maxHeight={250}
                                value={data.vmgo.vision}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        vmgo: {
                                            ...data.vmgo,
                                            vision: e.target.value
                                        },
                                    })
                                }
                                disabled={processing}
                            />
                            <InputError message={errors['vmgo.vision']} className="mt-2" />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Mission</label>
                            <Textarea
                                placeholder="Enter mission..."
                                autoResize
                                minHeight={100}
                                maxHeight={250}
                                value={data.vmgo.mission}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        vmgo: {
                                            ...data.vmgo,
                                            mission: e.target.value
                                        },
                                    })
                                }
                                disabled={processing}
                            />
                            <InputError message={errors['vmgo.mission']} className="mt-2" />
                        </div>
                    </div>
                </div>

                <Separator className="my-10 bg-gray-200" />

                <div className="mb-6">
                    <h3 className="mb-4 text-base font-semibold text-gray-900">University Development Plan</h3>
                    <div className="grid gap-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-6">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">YouTube Link</label>
                                    <Input
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        value={data.vmgo.avp_link || ''}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                vmgo: {
                                                    ...data.vmgo,
                                                    avp_link: e.target.value
                                                },
                                            })
                                        }
                                        disabled={processing}
                                    />
                                    <InputError message={errors['vmgo.avp_link']} className="mt-2" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Video Title</label>
                                    <Input
                                        placeholder="Enter video title..."
                                        value={data.vmgo.avp_title || ''}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                vmgo: {
                                                    ...data.vmgo,
                                                    avp_title: e.target.value
                                                },
                                            })
                                        }
                                        disabled={processing}
                                    />
                                    <InputError message={errors['vmgo.avp_title']} className="mt-2" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 block text-sm font-medium text-gray-700">Video Description</label>
                                <Textarea
                                    className="flex-1"
                                    placeholder="Enter video description..."
                                    value={data.vmgo.avp_description || ''}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            vmgo: {
                                                ...data.vmgo,
                                                avp_description: e.target.value
                                            },
                                        })
                                    }
                                    disabled={processing}
                                />
                                <InputError message={errors['vmgo.avp_description']} className="mt-2" />
                            </div>
                        </div>
                    </div>
                </div>
                <Separator className="my-10 bg-gray-200" />
                {/* --- University Strategic Goals --- */}
                <PillarsSection
                    pillars={data.pillars}
                    updatePillars={handleUpdatePillars}
                />

                <Separator className="my-10 bg-gray-200" />
                {/* --- University Campus Goals --- */}
                <CampusGoalsSection
                    campus_goals={data.campus_goals}
                    updateCampusGoals={handleUpdateCampusGoals}
                />
                <SectionFooter onSave={handleSave} onPreview={handlePreview} />
            </div>
        </div>
    );
};

export default VmgoContentSection;
