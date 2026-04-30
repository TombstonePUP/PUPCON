import { Input } from '@/components/ui/input';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import { CampusGoals, ContentPages, Pillars, Vmgo } from '@/types/content';
import { useForm } from '@inertiajs/react';
import React from 'react';
import InputError from '../input-error';
import CampusGoalsSection from './vmgo/campus-goals';
import PillarsSection from './vmgo/pillars';

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
    video_link: string;
    video_title: string;
    video_description: string;
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
            content_page_id: vmgo_page?.content_page_id || 0,
            page: vmgo_page?.page || 'Vision, Mission & Goals',
            title: vmgo_page?.title || '',
            description: vmgo_page?.description || '',
            video_link: vmgo_page?.video_link || '',
            video_title: vmgo_page?.video_title || '',
            video_description: vmgo_page?.video_description || '',
        },
        campus_goals: vmgo_data.campus_goals || [],
        pillars: vmgo_data.pillars || [],
        vmgo: {
            vmgo_id: vmgo_data.vmgo?.vmgo_id || Date.now(),
            vision: vmgo_data.vmgo?.vision || '',
            mission: vmgo_data.vmgo?.mission || '',
        },
    });

    const extractShallowErrors = (errors: Record<string, string>, parentKey: string) => {
        return Object.entries(errors)
            .filter(([key]) => {
                // must start with parentKey + index, but not deeper
                const regex = new RegExp(`^${parentKey}\\.\\d+\\.[^.]+$`);
                return regex.test(key);
            })
            .map(([, message]) => message);
    };

    const pillar_errors = extractShallowErrors(errors, 'pillars');

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
        post(route('content.vmgo.update'), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handlePreview = () => {
        window.open('/about/vision-mission-goals', '_blank');
    };

    return (
        <div className="border-border bg-card scroll-mt-6 rounded-lg border">
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-foreground text-lg font-semibold">Vision, Mission, and Goals Page</h2>
                    <p className="text-muted-foreground text-sm">Configure content</p>
                </div>

                <div className="mb-8">
                    <h3 className="text-foreground mb-4 text-base font-semibold">Page Content</h3>
                    <div className="grid gap-6 md:grid-cols-1">
                        <div>
                            <label className="text-foreground mb-2 block text-sm font-medium">Title</label>
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
                            <label className="text-foreground mb-2 block text-sm font-medium">Description</label>
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

                <Separator className="bg-border my-10" />

                <div className="mb-8">
                    <h3 className="text-foreground mb-4 text-base font-semibold">Vision & Mission</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="text-foreground mb-2 block text-sm font-medium">
                                Vision <span className="text-red-500">*</span>
                            </label>
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
                                            vision: e.target.value,
                                        },
                                    })
                                }
                                disabled={processing}
                            />
                            <InputError message={errors['vmgo.vision']} className="mt-2" />
                        </div>
                        <div>
                            <label className="text-foreground mb-2 block text-sm font-medium">
                                Mission <span className="text-red-500">*</span>
                            </label>
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
                                            mission: e.target.value,
                                        },
                                    })
                                }
                                disabled={processing}
                            />
                            <InputError message={errors['vmgo.mission']} className="mt-2" />
                        </div>
                    </div>
                </div>

                <Separator className="bg-border my-10" />

                <div className="mb-6">
                    <h3 className="text-foreground mb-4 text-base font-semibold">University Development Plan</h3>
                    <div className="grid gap-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-foreground mb-2 block text-sm font-medium">YouTube Link</label>
                                    <Input
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        value={data.page.video_link || ''}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                page: {
                                                    ...data.page,
                                                    video_link: e.target.value,
                                                },
                                            })
                                        }
                                        disabled={processing}
                                    />
                                    <InputError message={errors['page.video_link']} className="mt-2" />
                                </div>
                                <div>
                                    <label className="text-foreground mb-2 block text-sm font-medium">Video Title</label>
                                    <Input
                                        placeholder="Enter video title..."
                                        value={data.page.video_title || ''}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                page: {
                                                    ...data.page,
                                                    video_title: e.target.value,
                                                },
                                            })
                                        }
                                        disabled={processing}
                                    />
                                    <InputError message={errors['page.video_title']} className="mt-2" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-foreground mb-2 block text-sm font-medium">Video Description</label>
                                <Textarea
                                    className="flex-1"
                                    placeholder="Enter video description..."
                                    value={data.page.video_description || ''}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            page: {
                                                ...data.page,
                                                video_description: e.target.value,
                                            },
                                        })
                                    }
                                    disabled={processing}
                                />
                                <InputError message={errors['page.video_description']} className="mt-2" />
                            </div>
                        </div>
                    </div>
                </div>
                <Separator className="bg-border my-10" />
                {/* --- University Strategic Goals --- */}
                <PillarsSection pillars={data.pillars} updatePillars={handleUpdatePillars} errors={errors} />
                {pillar_errors.length > 0 && (
                    <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-4">
                        <h4 className="mb-2 font-semibold text-red-700">Pillar Sections</h4>
                        <ul className="ml-6 list-disc text-sm text-red-600">
                            {pillar_errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <Separator className="bg-border my-10" />
                {/* --- University Campus Goals --- */}
                <CampusGoalsSection campus_goals={data.campus_goals} updateCampusGoals={handleUpdateCampusGoals} errors={errors} />
                {/*campus_goal_errors.length > 0 && (
                    <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-4">
                        <h4 className="mb-2 font-semibold text-red-700">Gallery Section Errors</h4>
                        <ul className="ml-6 list-disc text-sm text-red-600">
                            {campus_goal_errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )*/}
            </div>
            <SectionFooter onSave={handleSave} onPreview={handlePreview} />
        </div>
    );
};

export default VmgoContentSection;
