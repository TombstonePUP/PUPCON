import { DocumentViewer } from '@/components/admin/dialogs/documents/view-document';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/admin/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertCircle, Check } from 'lucide-react';
import React, { useState } from 'react';

// Modular Components
import { ProgramMeansTable } from '@/components/admin/ratings/program-means-table';
import { AccreditationAreaView } from '@/components/admin/ratings/accreditation-area';
import { MOCK_PROGRAMS } from '@/components/admin/ratings/mock-data';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ratings',
        href: `/manage-ratings`,
    },
];

export default function Ratings() {
    const [expandedAreas, setExpandedAreas] = useState<Record<number, boolean>>({});
    const [expandedParameters, setExpandedParameters] = useState<Record<string, boolean>>({});
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerFile, setViewerFile] = useState({ url: '', title: '' });
    const [selectedLevels, setSelectedLevels] = useState<Record<number, string>>({});
    
    // In a real app, these would come from the server/API
    const [means] = useState<Record<string, string | number>>({
        '1-A': '4.50',
        '1': '4.50',
        '2-A': '4.20',
        '2': '4.20'
    });

    const toggleArea = (id: number) => {
        setExpandedAreas((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleParameter = (id: string) => {
        setExpandedParameters((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const openViewer = (url: string, title: string) => {
        setViewerFile({ url, title });
        setViewerOpen(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusText = (status: string) => status.replace('_', ' ').toUpperCase();

    const getParameterStatusIcon = (status: string) => {
        return status === 'approved' ? <Check className="h-4 w-4 text-green-600" /> : <AlertCircle className="h-4 w-4 text-yellow-600" />;
    };

    const getParameterStatusBadge = (status: string) => {
        return status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200';
    };

    const getParameterStatusText = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ratings Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <ProgramMeansTable 
                    programs={MOCK_PROGRAMS} 
                    means={means} 
                    selectedLevels={selectedLevels} 
                />

                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    <section>
                        {MOCK_PROGRAMS.map((program) => {
                            const areaIds = program.assigned_areas.map((a) => a.id);
                            const areaMeans = areaIds.map((id) => parseFloat(String(means[id]))).filter((v) => !isNaN(v));
                            const programMean = areaMeans.length > 0 ? (areaMeans.reduce((a, b) => a + b, 0) / areaMeans.length).toFixed(2) : '—';

                            return (
                                <div key={program.id} className="mb-6 rounded-xl border border-gray-200 bg-white">
                                    <div className="flex items-center justify-between border-b border-gray-100 bg-[#7f1414]/5 p-6">
                                        <h3 className="text-xl font-bold text-[#7f1414]">{program.program_name}</h3>
                                        <Select onValueChange={(value) => setSelectedLevels((prev) => ({ ...prev, [program.id]: value }))}>
                                            <SelectTrigger className="w-fit gap-2 bg-white">
                                                <SelectValue placeholder={`Level ${program.accreditation_level}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Level</SelectLabel>
                                                    {[1, 2, 3, 4, 5].map((num) => (
                                                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="p-6">
                                        {program.assigned_areas.map((area) => (
                                            <AccreditationAreaView 
                                                key={area.id}
                                                area={area}
                                                isExpanded={!!expandedAreas[area.id]}
                                                onToggle={() => toggleArea(area.id)}
                                                expandedParameters={expandedParameters}
                                                onToggleParameter={toggleParameter}
                                                means={means}
                                                onViewDocument={openViewer}
                                                getStatusColor={getStatusColor}
                                                getStatusText={getStatusText}
                                                getParameterStatusIcon={getParameterStatusIcon}
                                                getParameterStatusBadge={getParameterStatusBadge}
                                                getParameterStatusText={getParameterStatusText}
                                            />
                                        ))}
                                        <div className="mt-6 border-t border-gray-300 pt-4 text-right text-base font-bold text-gray-900">
                                            Program Mean: <span className="text-[#7f1414]">{programMean}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                </div>
                <DocumentViewer open={viewerOpen} onOpenChange={setViewerOpen} fileUrl={viewerFile.url} title={viewerFile.title} />
            </div>
        </AppLayout>
    );
}
