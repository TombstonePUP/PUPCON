import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import { ContentPages, LocalTaskForce } from '@/types/content';
import { useForm } from '@inertiajs/react';
import React from 'react';
import LocalTaskForceContentSection from './task-force/local-task-force';

interface LocalTaskForceSectionProps {
    ltf_page: ContentPages;
    local_task_force: LocalTaskForce[];
}

interface PageForm {
    content_page_id: number;
    page: string;
    title: string;
    description: string;
}

interface MemberForm {
    member_id?: number;
    local_task_force_id: number;
    full_name: string;
    role?: string | null;
    local_task_force?: LtfChairmanForm;
}

interface LtfChairmanForm {
    local_task_force_id?: number;
    area_name: string;
    first_name: string;
    last_name: string;
    official: boolean;
    official_position?: string | null;
    profile_image: File | null;
    previewUrl?: string | null;
    members: MemberForm[];
}

interface LocalTaskForceForm {
    page: PageForm;
    chairmen: LtfChairmanForm[];
}

const LocalTaskForceSection: React.FC = ({ ...props }: LocalTaskForceSectionProps) => {
    const { ltf_page, local_task_force } = props;

    const { data, setData, post, errors } = useForm<LocalTaskForceForm>({
        page: {
            content_page_id: ltf_page?.content_page_id,
            page: ltf_page?.page || 'Local Task Force',
            title: ltf_page?.title || '',
            description: ltf_page?.description || '',
        },
        chairmen: local_task_force.map((ltf) => ({
            local_task_force_id: ltf.local_task_force_id,
            area_name: ltf.area_name,
            first_name: ltf.first_name,
            last_name: ltf.last_name,
            official: ltf.official || false,
            official_position: ltf.official_position || null,
            profile_image: null,
            previewUrl: ltf.profile_image_path || null,
            members: ltf.members
                ? ltf.members.map((member) => ({
                      member_id: member.member_id,
                      local_task_force_id: member.local_task_force_id,
                      full_name: member.full_name,
                      role: member.role || null,
                  }))
                : [],
        })),
    });

    const handleUpdateLocalTaskForce = (chairmanLocal: LocalTaskForce, chairman: LtfChairmanForm) => {
        setData((prevData) => {
            const chairmanForForm: LtfChairmanForm = {
                local_task_force_id: chairmanLocal.local_task_force_id,
                area_name: chairman.area_name,
                first_name: chairman.first_name,
                last_name: chairman.last_name,
                official: chairman.official,
                official_position: chairman.official_position,
                profile_image: chairman.profile_image,
                previewUrl: chairman.previewUrl,
                members: chairman.members,
            };

            let formChairman;
            const formIndex = prevData.chairmen?.findIndex((c) => c.local_task_force_id === chairmanForForm.local_task_force_id);

            if (formIndex !== undefined && formIndex !== -1) {
                formChairman = prevData.chairmen?.map((c, index) => (index === formIndex ? chairmanForForm : c));
            } else {
                formChairman = [...(prevData.chairmen ?? []), chairmanForForm];
            }

            return {
                ...prevData,
                chairmen: formChairman,
            };
        });
    };

    const handleDelete = (id: number) => {
        setData((prev) => ({
            ...prev,
            chairmen: prev.chairmen.filter((chairman) => chairman.local_task_force_id !== id),
        }));
    };

    const handleSubmit = () => {
        post(route('content.local_task_force.update'), {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handlePreview = () => {
        window.open('/about/local-task-force', '_blank');
    };

    const localTaskForceErrorCount = errors ? Object.keys(errors).filter((key) => key.startsWith('chairmen.')).length : 0;

    return (
        <div className="border-border bg-background scroll-mt-6 rounded-lg border">
            <div className="p-8">
                {/* Page header */}
                <div className="mb-6">
                    <h2 className="text-foreground text-lg font-semibold">Local Task Force Page</h2>
                    <p className="text-muted-foreground text-sm">Configure content</p>
                </div>

                {/* Page title / description inputs */}
                <div className="mb-10 grid grid-cols-1 gap-6">
                    <div>
                        <label className="text-foreground mb-2 block text-sm font-medium">Title</label>
                        <Input
                            type="text"
                            placeholder="Enter page title..."
                            value={data.page.title}
                            onChange={(e) => setData('page.title', e.target.value)}
                        />
                        <InputError message={errors['page.title']} className="mt-2" />
                    </div>
                    <div>
                        <label className="text-foreground mb-2 block text-sm font-medium">Subtitle / Description</label>
                        <Textarea
                            placeholder="Enter page subtitle..."
                            value={data.page.description}
                            onChange={(e) => setData('page.description', e.target.value)}
                            autoResize
                            minHeight={100}
                        />
                        <InputError message={errors['page.description']} className="mt-2" />
                    </div>
                </div>

                <Separator className="my-10" />

                {/* Task Force Officials & Areas */}
                <div className="mb-6">
                    <div className="mb-4 flex items-center gap-3">
                        <h3 className="text-foreground text-base font-semibold">Task Force Officials & Areas</h3>
                        {localTaskForceErrorCount > 0 && (
                            <span className="bg-destructive text-destructive-foreground inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
                                {localTaskForceErrorCount}
                            </span>
                        )}
                    </div>
                    <LocalTaskForceContentSection
                        local_task_force={local_task_force}
                        onUpdateTaskForceOfficial={handleUpdateLocalTaskForce}
                        onDeleteTaskForceOfficial={handleDelete}
                        errors={errors}
                    />
                </div>
            </div>

            <SectionFooter onSave={handleSubmit} onPreview={handlePreview} />
        </div>
    );
};

export default LocalTaskForceSection;
