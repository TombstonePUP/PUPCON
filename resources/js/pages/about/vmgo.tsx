import ContentPageLayout from '@/layouts/about-layout';
import { CampusGoals, ContentPages, Pillars, Vmgo } from '@/types/content';
import { AlertCircle, Construction, Play } from 'lucide-react';

interface VMGOProps {
    page: ContentPages;
    campus_goals: CampusGoals[];
    pillars: Pillars[];
    vmgo: Vmgo;
}

// Fallback Empty State Component
const EmptyState = ({ title, description }: { title: string; description: string }) => (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
        <Construction className="mb-4 h-16 w-16 text-gray-400" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
    </div>
);

// Alert Component for missing critical data
const DataAlert = ({ message }: { message: string }) => (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
        <div>
            <p className="text-sm font-medium text-amber-900">Content Unavailable</p>
            <p className="mt-1 text-sm text-amber-700">{message}</p>
        </div>
    </div>
);

// Helper function to extract YouTube video ID from various URL formats
const extractYouTubeID = (url: string): string | null => {
    if (!url) return null;

    // Match youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (watchMatch) return watchMatch[1];

    // Match youtube.com/embed/VIDEO_ID
    const embedMatch = url.match(/youtube\.com\/embed\/([^?&\s]+)/);
    if (embedMatch) return embedMatch[1];

    // If it's already just the ID
    if (url.length === 11 && !url.includes('/')) return url;

    return null;
};

export default function VMGO({ page, campus_goals, pillars, vmgo }: VMGOProps) {
    const pageSections = [
        { label: 'Vision & Mission', href: 'vision-mission' },
        { label: 'University Goals', href: 'university-goals' },
        { label: 'Campus Goals', href: 'campus-goals' },
    ];

    // Check if data exists
    const hasVmgoData = vmgo && (vmgo.vision || vmgo.mission);
    const hasPillars = pillars && pillars.length > 0;
    const hasCampusGoals = campus_goals && campus_goals.length > 0;
    const hasAvpData = page && page.video_link && page.video_description;

    // Extract YouTube video ID
    const videoId = hasAvpData ? extractYouTubeID(page.video_link) : null;
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0` : null;
    const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : page.video_link;

    return (
        <ContentPageLayout
            headTitle="Vision, Mission and Goals - PUP San Juan"
            title="Mission, Vision, and Goals"
            breadcrumbs={[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'VMGO', href: '/about/vision-mission-goals' },
            ]}
            pageSections={pageSections}
        >
            {/* Introduction */}
            <section>
                <h1 className="mb-4 text-3xl font-bold text-[#7f1414]">{page?.title || 'Vision, Mission & Goals'}</h1>
                <p className="mb-6 leading-relaxed text-gray-700">
                    {page?.description || 'Explore our vision, mission, and strategic goals that guide our institution.'}
                </p>
            </section>

            {/* Vision & Mission */}
            <section id="vision-mission">
                <h2 className="mb-4 text-2xl font-semibold text-[#7f1414]">Vision & Mission</h2>

                {!hasVmgoData ? (
                    <DataAlert message="Vision and Mission content is currently being updated. Please check back later." />
                ) : (
                    <div className="mb-8 grid gap-6 lg:grid-cols-2">
                        {/* Vision */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm">
                            <h3 className="mb-4 text-xl font-semibold text-gray-900">Vision</h3>
                            <p className="text-gray-700">{vmgo?.vision || 'Vision statement is not available.'}</p>
                        </div>

                        {/* Mission */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm">
                            <h3 className="mb-4 text-xl font-semibold text-gray-900">Mission</h3>
                            <p className="text-gray-700">{vmgo?.mission || 'Mission statement is not available.'}</p>
                        </div>
                    </div>
                )}

                {/* Video Section with YouTube Embed */}
                {hasAvpData && embedUrl ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:border-[#7f1414] hover:shadow-lg">
                        <div className="grid gap-8 lg:grid-cols-5 lg:items-center">
                            {/* YouTube Video Embed */}
                            <div className="lg:col-span-3">
                                <div className="group relative aspect-video overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                                    <iframe
                                        className="h-full w-full"
                                        src={embedUrl}
                                        title={page?.video_title || 'University Development Plan'}
                                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        loading="lazy"
                                    ></iframe>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="lg:col-span-2">
                                <h3 className="mb-4 text-2xl font-bold text-[#7f1414]">{page?.video_title || 'University Development Plan'}</h3>
                                <p className="mb-6 leading-relaxed text-gray-700">{page.video_description}</p>

                                {/* Watch on YouTube Button */}
                                <a
                                    href={watchUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-2 rounded-lg bg-[#7f1414] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#a01818] hover:shadow-lg"
                                >
                                    <Play className="h-5 w-5 transition-transform group-hover:scale-110" />
                                    Watch on YouTube
                                </a>
                            </div>
                        </div>
                    </div>
                ) : (
                    <EmptyState
                        title="Video Content Coming Soon"
                        description="Our institutional video presentation will be available here shortly."
                    />
                )}
            </section>

            {/* University Strategic Goals */}
            <section id="university-goals">
                <h2 className="mb-2 text-2xl font-semibold text-[#7f1414]">University Strategic Goals</h2>
                <p className="mb-6 text-gray-600">Three fundamental pillars supporting our academic mission</p>

                {!hasPillars ? (
                    <EmptyState
                        title="Strategic Goals Being Finalized"
                        description="Our university strategic goals are currently under review and will be published soon."
                    />
                ) : (
                    <div className="grid gap-6 lg:grid-cols-3">
                        {pillars.map((pillar, pillarIndex) => (
                            <div key={pillarIndex} className="space-y-4">
                                {/* Pillar Header */}
                                <div className="rounded-xl bg-[#7f1414] p-6 text-center text-white">
                                    <h3 className="text-lg font-semibold">Pillar {pillarIndex + 1}</h3>
                                    <p className="text-sm">{pillar.pillar_title}</p>
                                </div>

                                {/* Goals */}
                                <div className="space-y-3">
                                    {pillar.pillar_items && pillar.pillar_items.length > 0 ? (
                                        pillar.pillar_items.map((goal) => (
                                            <div
                                                key={goal.item_id}
                                                className="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#7f1414] text-xs font-bold text-white">
                                                        {goal.item_id}
                                                    </div>
                                                    <p className="text-sm leading-relaxed text-gray-800">{goal.item_description}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
                                            <p className="text-muted-foreground text-sm">No goals defined for this pillar yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* PUP San Juan Goals */}
            <section id="campus-goals">
                <h2 className="mb-2 text-2xl font-semibold text-[#7f1414]">PUP San Juan Campus Goals</h2>
                <p className="mb-6 text-gray-600">Six strategic goals driving our campus excellence</p>

                {!hasCampusGoals ? (
                    <EmptyState
                        title="Campus Goals In Development"
                        description="Our campus-specific strategic goals are being developed and will be shared here once finalized."
                    />
                ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {campus_goals.map((goal, index) => {
                            // index starts at 0, so add 1 for display
                            const displayNumber = index + 1;

                            return (
                                <div
                                    key={goal.goal_id} // still use real ID for React key
                                    className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-150 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-sm"
                                >
                                    <div className="mb-4 flex items-start space-x-4">
                                        {/* Use displayNumber instead of goal.goal_id */}
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#7f1414] text-lg font-bold text-white">
                                            {displayNumber}
                                        </div>

                                        <div>
                                            <h3 className="mb-3 text-lg font-semibold text-gray-900">{goal.goal_title_eng}</h3>

                                            <p className="mb-4 leading-relaxed text-gray-700">{goal.goal_desc_eng}</p>

                                            <details className="group">
                                                <summary className="cursor-pointer text-sm font-medium text-[#7f1414] transition-colors hover:text-[#a01818]">
                                                    View in Filipino
                                                </summary>
                                                <div className="mt-3 rounded-lg bg-gray-50 p-4">
                                                    <p className="text-sm text-gray-600 italic">{goal.goal_desc_fil}</p>
                                                </div>
                                            </details>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </ContentPageLayout>
    );
}
