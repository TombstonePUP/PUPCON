import React, { useState } from 'react';
import { CheckCircle, FileText, Calendar, Award, ChevronDown, ChevronRight, Download, FileSpreadsheet, X, Check, AlertCircle } from 'lucide-react';

export default function AccreditorDashboard() {
    const [expandedAreas, setExpandedAreas] = useState({});
    const [expandedParameters, setExpandedParameters] = useState({});
    const [pdfDialog, setPdfDialog] = useState({ open: false, url: '', title: '' });
    const [exportDropdown, setExportDropdown] = useState({});

    const accreditor = {
        name: 'Dr. Maria Santos',
        role: 'AACCUP Accreditor',
        specialty: 'Engineering Programs'
    };

    const programs = [
        {
            id: 1,
            program_name: 'Bachelor of Science in Computer Science',
            degree_type: 'Undergraduate',
            accreditation_level: 3,
            campus: 'Main Campus',
            assigned_areas: [
                {
                    id: 1,
                    area_name: 'Area I: Vision, Mission, Goals and Objectives',
                    status: 'pending',
                    progress: 0,
                    parameters: [
                        {
                            id: 'A',
                            label: 'Campus Buildings',
                            status: 'approved',
                            benchmarks: [
                                { id: 1, text: 'Building infrastructure meets safety standards', pdfUrl: '/docs/safety-standards.pdf' },
                                { id: 2, text: 'Adequate classroom space for student population', pdfUrl: '/docs/classroom-specs.pdf' },
                                { id: 3, text: 'Accessibility compliance for PWD', pdfUrl: '/docs/pwd-compliance.pdf' }
                            ]
                        },
                        {
                            id: 'B',
                            label: 'Library Resources',
                            status: 'pending',
                            benchmarks: [
                                { id: 1, text: 'Book collection meets minimum requirements', pdfUrl: '/docs/library-standards.pdf' },
                                { id: 2, text: 'Digital resources and database subscriptions', pdfUrl: '/docs/digital-resources.pdf' }
                            ]
                        },
                        {
                            id: 'C',
                            label: 'Laboratory Facilities',
                            status: 'needs_revision',
                            benchmarks: [
                                { id: 1, text: 'Computer lab equipment specifications', pdfUrl: '/docs/lab-equipment.pdf' },
                                { id: 2, text: 'Lab maintenance and upgrade schedule', pdfUrl: '/docs/maintenance.pdf' }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    area_name: 'Area II: Faculty',
                    status: 'in_progress',
                    progress: 45,
                    parameters: [
                        {
                            id: 'A',
                            label: 'Faculty Qualifications',
                            status: 'approved',
                            benchmarks: [
                                { id: 1, text: 'Percentage of faculty with doctoral degrees', pdfUrl: '/docs/faculty-qualifications.pdf' },
                                { id: 2, text: 'Faculty specialization alignment', pdfUrl: '/docs/specializations.pdf' }
                            ]
                        },
                        {
                            id: 'B',
                            label: 'Faculty Development',
                            status: 'pending',
                            benchmarks: [
                                { id: 1, text: 'Professional development programs', pdfUrl: '/docs/dev-programs.pdf' }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 2,
            program_name: 'Bachelor of Science in Information Technology',
            degree_type: 'Undergraduate',
            accreditation_level: 2,
            campus: 'Main Campus',
            assigned_areas: [
                {
                    id: 4,
                    area_name: 'Area IV: Support to Students',
                    status: 'completed',
                    progress: 100,
                    parameters: [
                        {
                            id: 'A',
                            label: 'Student Services',
                            status: 'approved',
                            benchmarks: [
                                { id: 1, text: 'Counseling services availability', pdfUrl: '/docs/counseling.pdf' }
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    const toggleArea = (areaId) => {
        setExpandedAreas(prev => ({ ...prev, [areaId]: !prev[areaId] }));
    };

    const toggleParameter = (parameterId) => {
        setExpandedParameters(prev => ({ ...prev, [parameterId]: !prev[parameterId] }));
    };

    const toggleExport = (programId) => {
        setExportDropdown(prev => ({ ...prev, [programId]: !prev[programId] }));
    };

    const handleExport = (programId, format) => {
        alert(`Exporting Program ${programId} as ${format.toUpperCase()}`);
        setExportDropdown({});
    };

    const openPdfDialog = (url, title) => {
        setPdfDialog({ open: true, url, title });
    };

    const closePdfDialog = () => {
        setPdfDialog({ open: false, url: '', title: '' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-300';
            case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed': return 'Completed';
            case 'in_progress': return 'In Progress';
            default: return 'Pending';
        }
    };

    const getParameterStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <Check className="h-4 w-4 text-green-600" />;
            case 'needs_revision':
                return <AlertCircle className="h-4 w-4 text-amber-600" />;
            default:
                return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
        }
    };

    const getParameterStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-700 border-green-300';
            case 'needs_revision':
                return 'bg-amber-100 text-amber-700 border-amber-300';
            default:
                return 'bg-gray-100 text-gray-600 border-gray-300';
        }
    };

    const getParameterStatusText = (status) => {
        switch (status) {
            case 'approved': return 'Approved';
            case 'needs_revision': return 'Needs Revision';
            default: return 'Pending Review';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto w-[85%] max-w-7xl px-6 py-12">
                {/* Welcome Section */}
                <section className="mb-12 rounded-xl border border-[#7f1414]/25 bg-gradient-to-br from-white to-gray-50 p-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold text-[#7f1414]">
                                Welcome back, {accreditor.name}
                            </h1>
                            <p className="mb-1 text-lg text-gray-700">
                                {accreditor.role} • {accreditor.specialty}
                            </p>
                            <p className="leading-relaxed text-gray-600">
                                You have been assigned to evaluate {programs.length} program{programs.length > 1 ? 's' : ''} for AACCUP accreditation.
                            </p>
                        </div>
                        <div className="hidden lg:block">
                            <Award className="h-24 w-24 text-[#7f1414]/20" />
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-[#7f1414]/10 p-2">
                                    <FileText className="h-5 w-5 text-[#7f1414]" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {programs.reduce((sum, p) => sum + p.assigned_areas.length, 0)}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Areas</div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-green-100 p-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {programs.reduce((sum, p) => sum + p.assigned_areas.filter(a => a.status === 'completed').length, 0)}
                                    </div>
                                    <div className="text-sm text-gray-600">Completed</div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-blue-100 p-2">
                                    <Calendar className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {programs.reduce((sum, p) => sum + p.assigned_areas.filter(a => a.status === 'in_progress').length, 0)}
                                    </div>
                                    <div className="text-sm text-gray-600">In Progress</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Programs Section */}
                <section>
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">Your Assigned Programs</h2>

                    <div className="space-y-6">
                        {programs.map((program) => (
                            <div
                                key={program.id}
                                className="rounded-xl border border-gray-200 bg-white shadow-sm"
                            >
                                {/* Program Header */}
                                <div className="border-b border-gray-100 bg-gradient-to-r from-[#7f1414]/5 to-transparent p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="rounded-full bg-[#7f1414] px-3 py-1 text-xs font-semibold text-white">
                                                    {program.degree_type}
                                                </span>
                                                <span className="rounded-full border border-[#7f1414] px-3 py-1 text-xs font-semibold text-[#7f1414]">
                                                    Level {program.accreditation_level}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">{program.program_name}</h3>
                                            <p className="text-sm text-gray-600">{program.campus}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-sm text-gray-600">Areas Assigned</div>
                                                <div className="text-2xl font-bold text-[#7f1414]">{program.assigned_areas.length}</div>
                                            </div>
                                            {/* Export Dropdown */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => toggleExport(program.id)}
                                                    className="flex items-center gap-2 rounded-lg bg-[#7f1414] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#6a1111]"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Export
                                                </button>
                                                {exportDropdown[program.id] && (
                                                    <div className="absolute right-0 top-full z-10 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg">
                                                        <button
                                                            onClick={() => handleExport(program.id, 'excel')}
                                                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                        >
                                                            <FileSpreadsheet className="h-4 w-4 text-green-600" />
                                                            Export as Excel
                                                        </button>
                                                        <button
                                                            onClick={() => handleExport(program.id, 'pdf')}
                                                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                        >
                                                            <FileText className="h-4 w-4 text-red-600" />
                                                            Export as PDF
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Areas List */}
                                <div className="p-6">
                                    <div className="space-y-3">
                                        {program.assigned_areas.map((area) => (
                                            <div key={area.id} className="rounded-lg border border-gray-200 bg-gray-50">
                                                {/* Area Header - Clickable */}
                                                <button
                                                    onClick={() => toggleArea(area.id)}
                                                    className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-white"
                                                >
                                                    <div className="flex flex-1 items-center gap-3">
                                                        {expandedAreas[area.id] ? (
                                                            <ChevronDown className="h-5 w-5 text-gray-500" />
                                                        ) : (
                                                            <ChevronRight className="h-5 w-5 text-gray-500" />
                                                        )}
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3">
                                                                <h4 className="font-semibold text-gray-900">{area.area_name}</h4>
                                                                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(area.status)}`}>
                                                                    {getStatusText(area.status)}
                                                                </span>
                                                            </div>
                                                            {area.status !== 'pending' && (
                                                                <div className="mt-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="h-2 w-48 overflow-hidden rounded-full bg-gray-200">
                                                                            <div
                                                                                className="h-full bg-[#7f1414] transition-all duration-500"
                                                                                style={{ width: `${area.progress}%` }}
                                                                            />
                                                                        </div>
                                                                        <span className="text-xs font-medium text-gray-600">{area.progress}%</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>

                                                {/* Parameters - Expanded Content */}
                                                {expandedAreas[area.id] && (
                                                    <div className="border-t border-gray-200 bg-white p-4">
                                                        <div className="space-y-2">
                                                            {area.parameters.map((param) => (
                                                                <div key={param.id} className="rounded-lg border border-gray-200">
                                                                    {/* Parameter Header */}
                                                                    <button
                                                                        onClick={() => toggleParameter(`${area.id}-${param.id}`)}
                                                                        className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-gray-50"
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            {expandedParameters[`${area.id}-${param.id}`] ? (
                                                                                <ChevronDown className="h-4 w-4 text-gray-500" />
                                                                            ) : (
                                                                                <ChevronRight className="h-4 w-4 text-gray-500" />
                                                                            )}
                                                                            {getParameterStatusIcon(param.status)}
                                                                            <span className="font-medium text-gray-900">
                                                                                Parameter {param.id}
                                                                            </span>
                                                                            <span className="text-gray-600">{param.label}</span>
                                                                        </div>
                                                                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getParameterStatusBadge(param.status)}`}>
                                                                            {getParameterStatusText(param.status)}
                                                                        </span>
                                                                    </button>

                                                                    {/* Benchmarks - Expanded Content */}
                                                                    {expandedParameters[`${area.id}-${param.id}`] && (
                                                                        <div className="border-t border-gray-200 bg-gray-50 p-4">
                                                                            <h5 className="mb-3 text-sm font-semibold text-gray-700">Benchmarks:</h5>
                                                                            <ul className="space-y-2">
                                                                                {param.benchmarks.map((benchmark) => (
                                                                                    <li key={benchmark.id} className="flex items-start gap-2">
                                                                                        <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#7f1414]" />
                                                                                        <button
                                                                                            onClick={() => openPdfDialog(benchmark.pdfUrl, benchmark.text)}
                                                                                            className="flex-1 text-left text-sm text-gray-700 transition-colors hover:text-[#7f1414] hover:underline"
                                                                                        >
                                                                                            {benchmark.text}
                                                                                        </button>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* PDF Dialog */}
            {pdfDialog.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="relative w-full max-w-4xl rounded-xl bg-white shadow-2xl" style={{ height: '85vh' }}>
                        {/* Dialog Header */}
                        <div className="flex items-center justify-between border-b border-gray-200 p-4">
                            <h3 className="text-lg font-semibold text-gray-900">{pdfDialog.title}</h3>
                            <button
                                onClick={closePdfDialog}
                                className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        {/* PDF Viewer */}
                        <div className="p-4" style={{ height: 'calc(85vh - 80px)' }}>
                            <div className="flex h-full items-center justify-center rounded-lg bg-gray-100">
                                <div className="text-center">
                                    <FileText className="mx-auto mb-3 h-16 w-16 text-gray-400" />
                                    <p className="text-sm text-gray-600">PDF Viewer</p>
                                    <p className="text-xs text-gray-500 mt-1">Document: {pdfDialog.url}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}