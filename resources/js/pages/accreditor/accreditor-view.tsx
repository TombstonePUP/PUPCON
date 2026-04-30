'use client';

import { DocumentViewer } from '@/components/dialogs/documents/view-document';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import AccreditorLayout from '@/layouts/accreditor-layout';
import { Head } from '@inertiajs/react';
import { AlertCircle, Check, ChevronDown, ChevronRight, Download, FileSpreadsheet, FileText } from 'lucide-react';
import React, { useState } from 'react';

export default function AccreditorDashboard() {
    const [expandedAreas, setExpandedAreas] = useState({});
    const [expandedParameters, setExpandedParameters] = useState({});
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerFile, setViewerFile] = useState({ url: '', title: '' });
    const [exportDropdown, setExportDropdown] = useState({});
    const [exportAreaDropdown, setExportAreaDropdown] = useState({});
    const [ratings, setRatings] = useState({});
    const [means, setMeans] = useState({});
    const [selectedLevels, setSelectedLevels] = useState({});

    const accreditor = {
        name: 'Dr. Maria Santos',
        role: 'AACCUP Accreditor',
        specialty: 'Engineering Programs',
    };

    const programs = [
        {
            id: 1,
            program_name: 'Bachelor of Science in Computer Science',
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
                            label: 'Program Goals and Objectives',
                            status: 'approved',
                            benchmarks: [
                                {
                                    id: 1,
                                    category: 'S',
                                    text: 'S.4. The Goals are clearly stated, and are consistent with the Mission of the Institution.',
                                    pdfUrl: '/docs/goals.pdf',
                                },
                                {
                                    id: 2,
                                    category: 'S',
                                    text: 'S.5. The Objectives of the program clearly state the expected outcomes in terms of competencies (skills and knowledge), values, and other attributes of the graduates which include the development of:',
                                    pdfUrl: '/docs/objectives.pdf',
                                    children: [
                                        {
                                            id: 3,
                                            category: 'S',
                                            text: 'S.5.1. technical skills in Hotel and Restaurant Management/TM/HM/TrM;',
                                            pdfUrl: '/docs/skills.pdf',
                                        },
                                        {
                                            id: 4,
                                            category: 'S',
                                            text: 'S.5.2. scientific habit thought;',
                                            pdfUrl: '/docs/habit.pdf',
                                        },
                                    ],
                                },
                                {
                                    id: 5,
                                    category: 'I',
                                    text: 'I.7. Implementation aligns with institutional goals.',
                                    pdfUrl: '/docs/implementation.pdf',
                                },
                                {
                                    id: 6,
                                    category: 'O',
                                    text: 'O.10. Graduates exhibit competencies aligned with program objectives.',
                                    pdfUrl: '/docs/outcomes.pdf',
                                },
                            ],
                        },
                    ],
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
                                // Systems
                                { id: 1, text: 'S.2.01. Percentage of faculty with doctoral degrees.', pdfUrl: '/docs/faculty-qualifications.pdf' },
                                { id: 2, text: 'S.3.04. Accreditation compliance for faculty ranks.', pdfUrl: '/docs/accreditation.pdf' },
                                { id: 3, text: 'S.5.06. Consistent professional portfolio updates.', pdfUrl: '/docs/portfolio.pdf' },

                                // Implementation
                                { id: 4, text: 'I.5.15. Continuous professional development programs.', pdfUrl: '/docs/dev-programs.pdf' },
                                { id: 5, text: 'I.6.19. Peer mentoring systems implemented.', pdfUrl: '/docs/mentorship.pdf' },
                                { id: 6, text: 'I.7.21. Faculty training on new technologies.', pdfUrl: '/docs/training.pdf' },

                                // Outcome/s
                                { id: 7, text: 'O.7.25. Improved instructional quality outcomes.', pdfUrl: '/docs/instruction.pdf' },
                                { id: 8, text: 'O.8.28. Increased research publication output.', pdfUrl: '/docs/research.pdf' },
                                { id: 9, text: 'O.9.30. Faculty award recognitions increased yearly.', pdfUrl: '/docs/awards.pdf' },
                            ],
                        },
                        {
                            id: 'B',
                            label: 'Faculty Development',
                            status: 'pending',
                            benchmarks: [
                                // Systems
                                { id: 1, text: 'S.1.1. Development plan is aligned with VMGO.', pdfUrl: '/docs/faculty-plan.pdf' },
                                { id: 2, text: 'S.1.2. Resources allocated for continuous training.', pdfUrl: '/docs/training-budget.pdf' },

                                // Implementation
                                { id: 3, text: 'I.1.4. Training schedules implemented bi-annually.', pdfUrl: '/docs/schedule.pdf' },
                                { id: 4, text: 'I.1.5. Collaboration with external institutions established.', pdfUrl: '/docs/collab.pdf' },

                                // Outcome/s
                                { id: 5, text: 'O.2.7. Faculty performance evaluation improved by 15%.', pdfUrl: '/docs/evaluation.pdf' },
                                { id: 6, text: 'O.2.8. More faculty members promoted internally.', pdfUrl: '/docs/promotions.pdf' },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 2,
            program_name: 'Bachelor of Science in Information Technology',
            accreditation_level: 2,
            campus: 'Main Campus',
            assigned_areas: [
                {
                    id: 3,
                    area_name: 'Area IV: Support to Students',
                    status: 'completed',
                    progress: 100,
                    parameters: [
                        {
                            id: 'A',
                            label: 'Student Services',
                            status: 'approved',
                            benchmarks: [
                                { id: 1, text: 'S.1.11. Counseling office provides regular sessions.', pdfUrl: '/docs/counseling.pdf' },
                                { id: 2, text: 'S.2.12. Career center conducts job fairs annually.', pdfUrl: '/docs/jobfair.pdf' },
                                { id: 3, text: 'I.3.13. Workshops and seminars organized quarterly.', pdfUrl: '/docs/workshops.pdf' },
                                { id: 4, text: 'O.4.14. Student satisfaction surveys show 90% positive rating.', pdfUrl: '/docs/survey.pdf' },
                                { id: 5, text: 'O.5.15. Employment rate of graduates exceeds 85%.', pdfUrl: '/docs/employment.pdf' },
                            ],
                        },
                    ],
                },
            ],
        },
    ];

    const computeParentMean = (areaId, paramId, children) => {
        const childRatings = children.map((child) => parseFloat(ratings[`${areaId}-${paramId}-${child.id}`])).filter((v) => !isNaN(v));

        if (childRatings.length === 0) return '—';

        const avg = childRatings.reduce((sum, val) => sum + val, 0) / childRatings.length;

        return avg.toFixed(2);
    };

    // Helpers
    const openViewer = (fileUrl, title) => {
        setViewerFile({ url: fileUrl, title });
        setViewerOpen(true);
    };

    const toggleArea = (areaId) => setExpandedAreas((prev) => ({ ...prev, [areaId]: !prev[areaId] }));
    const toggleParameter = (paramId) => setExpandedParameters((prev) => ({ ...prev, [paramId]: !prev[paramId] }));

    // Toggle Export Dropdown per program
    const toggleExport = (programId) => {
        setExportDropdown((prev) => {
            const updated = {};
            Object.keys(prev).forEach((key) => {
                updated[key] = false; // close all other dropdowns
            });
            updated[programId] = !prev[programId]; // toggle the clicked one
            return updated;
        });
    };

    // Handle Export Actions (Excel/PDF)
    const handleExport = (programId, type) => {
        const program = programs.find((p) => p.id === programId);
        if (!program) return;

        alert(` Exporting ${program.program_name} as ${type.toUpperCase()}`);

        setExportDropdown((prev) => ({ ...prev, [programId]: false }));
    };

    // Toggle Export Dropdown per area
    const toggleAreaExport = (areaId) => {
        setExportAreaDropdown((prev) => {
            const updated = {};
            Object.keys(prev).forEach((key) => {
                updated[key] = false; // close all other dropdowns
            });
            updated[areaId] = !prev[areaId]; // toggle clicked area
            return updated;
        });
    };

    // Handle Export Actions for areas
    const handleAreaExport = (areaId, type) => {
        const area = programs.flatMap((p) => p.assigned_areas).find((a) => a.id === areaId);
        if (!area) return;

        alert(`Exporting ${area.area_name} as ${type.toUpperCase()}`);

        setExportAreaDropdown((prev) => ({ ...prev, [areaId]: false }));
    };

    // Close dropdowns when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            const exportButtons = document.querySelectorAll('.export-dropdown');
            let clickedInside = false;
            exportButtons.forEach((btn) => {
                if (btn.contains(event.target)) clickedInside = true;
            });
            if (!clickedInside) setExportDropdown({});
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed':
                return 'Completed';
            case 'in_progress':
                return 'In Progress';
            default:
                return 'Pending';
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
            case 'approved':
                return 'Approved';
            case 'needs_revision':
                return 'Needs Revision';
            default:
                return 'Pending Review';
        }
    };

    const handleRatingChange = (key, value) => {
        setRatings((prev) => {
            const newRatings = { ...prev, [key]: value };
            const [areaId, paramId] = key.split('-').slice(0, 2);
            const paramKey = `${areaId}-${paramId}`;
            const paramRatings = Object.entries(newRatings)
                .filter(([k]) => k.startsWith(paramKey))
                .map(([, v]) => v)
                .filter((v) => v !== 'N/A' && v !== '' && !isNaN(v))
                .map(Number);
            const paramMean = paramRatings.length > 0 ? (paramRatings.reduce((a, b) => a + b, 0) / paramRatings.length).toFixed(2) : '—';
            setMeans((prevMeans) => {
                const updated = { ...prevMeans, [paramKey]: paramMean };
                const areaMeans = Object.entries(updated)
                    .filter(([k]) => k.startsWith(areaId + '-'))
                    .map(([, v]) => parseFloat(v))
                    .filter((v) => !isNaN(v));
                const areaMean = areaMeans.length > 0 ? (areaMeans.reduce((a, b) => a + b, 0) / areaMeans.length).toFixed(2) : '—';
                updated[areaId] = areaMean;
                return updated;
            });
            return newRatings;
        });
    };

    return (
        <>
            <Head title="Accreditor Form">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <AccreditorLayout>
                <div className="min-h-screen bg-gray-50">
                    <div className="mx-auto w-[85%] max-w-7xl px-6 py-12">
                        <section className="mb-12 rounded-xl border border-[#7f1414]/25 bg-gradient-to-br from-white to-gray-50 p-8">
                            <h1 className="mb-2 text-3xl font-bold text-[#7f1414]">Welcome back, {accreditor.name}</h1>
                            <p className="text-lg text-gray-700">
                                {accreditor.role} • {accreditor.specialty}
                            </p>
                            <p className="text-gray-600">
                                You have been assigned to evaluate {programs.length} program
                                {programs.length > 1 ? 's' : ''}.
                            </p>
                        </section>

                        {/* Programs */}
                        <section>
                            {programs.map((program) => {
                                // 🔹 Compute Program Mean
                                const areaIds = program.assigned_areas.map((a) => a.id);
                                const areaMeans = areaIds.map((id) => parseFloat(means[id])).filter((v) => !isNaN(v));

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
                                                            <SelectItem key={num} value={num.toString()}>
                                                                {num}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Areas */}
                                        <div className="p-6">
                                            {program.assigned_areas.map((area) => (
                                                <div key={area.id} className="mb-4 rounded-lg border border-gray-200 bg-gray-50">
                                                    <button
                                                        onClick={() => toggleArea(area.id)}
                                                        className="flex w-full items-center justify-between p-4 text-left hover:rounded-lg hover:bg-white"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {expandedAreas[area.id] ? (
                                                                <ChevronDown className="h-5 w-5 text-gray-500" />
                                                            ) : (
                                                                <ChevronRight className="h-5 w-5 text-gray-500" />
                                                            )}
                                                            <h4 className="font-semibold text-gray-900">{area.area_name}</h4>
                                                            <span
                                                                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                                                                    area.status,
                                                                )}`}
                                                            >
                                                                {getStatusText(area.status)}
                                                            </span>
                                                        </div>

                                                        {/* Export Dropdown */}
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button onClick={(e) => e.stopPropagation()} variant="noborder">
                                                                    <Download className="h-4 w-4" />
                                                                    Export
                                                                </Button>
                                                            </DropdownMenuTrigger>

                                                            <DropdownMenuContent align="end">
                                                                {/* <DropdownMenuLabel>Export {area.area_name}</DropdownMenuLabel> */}
                                                                <DropdownMenuItem onClick={() => handleAreaExport(area.id, 'excel')}>
                                                                    <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                                                                    Export as Excel
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleAreaExport(area.id, 'pdf')}>
                                                                    <FileText className="mr-2 h-4 w-4 text-red-600" />
                                                                    Export as PDF
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </button>

                                                    {expandedAreas[area.id] && (
                                                        <div className="border-t border-gray-200 bg-white p-4">
                                                            {area.parameters.map((param) => (
                                                                <div key={param.id} className="mb-3 rounded-lg border border-gray-200">
                                                                    <button
                                                                        onClick={() => toggleParameter(`${area.id}-${param.id}`)}
                                                                        className="flex w-full items-center justify-between p-3 hover:rounded-lg hover:bg-gray-50"
                                                                    >
                                                                        <div className="flex items-center gap-3">
                                                                            {expandedParameters[`${area.id}-${param.id}`] ? (
                                                                                <ChevronDown className="h-4 w-4 text-gray-500" />
                                                                            ) : (
                                                                                <ChevronRight className="h-4 w-4 text-gray-500" />
                                                                            )}
                                                                            {getParameterStatusIcon(param.status)}
                                                                            <span className="font-medium text-[#7f1414]">Parameter {param.id}</span>
                                                                            <span className="text-gray-600">{param.label}</span>
                                                                        </div>
                                                                        <span
                                                                            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getParameterStatusBadge(
                                                                                param.status,
                                                                            )}`}
                                                                        >
                                                                            {getParameterStatusText(param.status)}
                                                                        </span>
                                                                    </button>

                                                                    {expandedParameters[`${area.id}-${param.id}`] && (
                                                                        <div className="space-y-4 p-3">
                                                                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                                                                <h4 className="mb-2 font-bold text-[#7f1414]">
                                                                                    Indicators and Ratings
                                                                                </h4>

                                                                                {/* Table */}
                                                                                <table className="w-full border-t border-gray-200 text-sm text-gray-700">
                                                                                    <thead>
                                                                                        <tr className="bg-white">
                                                                                            <th className="px-3 py-3 text-left font-semibold">
                                                                                                Indicators
                                                                                            </th>
                                                                                            <th className="py-3 text-center font-semibold">
                                                                                                Item Rating
                                                                                            </th>
                                                                                        </tr>
                                                                                    </thead>

                                                                                    <tbody>
                                                                                        {param.benchmarks.map((benchmark, idx) => (
                                                                                            <React.Fragment key={benchmark.id}>
                                                                                                <tr
                                                                                                    className={` ${
                                                                                                        idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                                                                                    } transition hover:bg-gray-100`}
                                                                                                >
                                                                                                    <td className="border-t border-gray-200 px-3 py-2 align-top">
                                                                                                        <button
                                                                                                            onClick={() =>
                                                                                                                openViewer(
                                                                                                                    benchmark.pdfUrl,
                                                                                                                    benchmark.text,
                                                                                                                )
                                                                                                            }
                                                                                                            className="text-left text-gray-700 hover:text-[#7f1414] hover:underline"
                                                                                                        >
                                                                                                            {benchmark.text}
                                                                                                        </button>

                                                                                                        {/* Nested children */}
                                                                                                        {benchmark.children &&
                                                                                                            benchmark.children.length > 0 && (
                                                                                                                <ul className="mt-2 space-y-1 pl-6">
                                                                                                                    {benchmark.children.map(
                                                                                                                        (child, cidx) => (
                                                                                                                            <li
                                                                                                                                key={child.id}
                                                                                                                                className={`flex items-center justify-between text-sm text-gray-700 ${
                                                                                                                                    cidx % 2 === 0
                                                                                                                                        ? 'bg-gray-50'
                                                                                                                                        : 'bg-white'
                                                                                                                                } rounded-md px-2 py-1`}
                                                                                                                            >
                                                                                                                                <button
                                                                                                                                    onClick={() =>
                                                                                                                                        openViewer(
                                                                                                                                            child.pdfUrl,
                                                                                                                                            child.text,
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                    className="text-left hover:text-[#7f1414] hover:underline"
                                                                                                                                >
                                                                                                                                    {child.text}
                                                                                                                                </button>
                                                                                                                                <select
                                                                                                                                    className="ml-4 rounded-md border-none bg-transparent text-center focus:ring-0 focus:outline-none"
                                                                                                                                    value={
                                                                                                                                        ratings[
                                                                                                                                            `${area.id}-${param.id}-${child.id}`
                                                                                                                                        ] || 'N/A'
                                                                                                                                    }
                                                                                                                                    onChange={(e) =>
                                                                                                                                        handleRatingChange(
                                                                                                                                            `${area.id}-${param.id}-${child.id}`,
                                                                                                                                            e.target
                                                                                                                                                .value,
                                                                                                                                        )
                                                                                                                                    }
                                                                                                                                >
                                                                                                                                    <option value="N/A">
                                                                                                                                        N/A
                                                                                                                                    </option>
                                                                                                                                    {[
                                                                                                                                        0, 1, 2, 3, 4,
                                                                                                                                        5,
                                                                                                                                    ].map((num) => (
                                                                                                                                        <option
                                                                                                                                            key={num}
                                                                                                                                            value={
                                                                                                                                                num
                                                                                                                                            }
                                                                                                                                        >
                                                                                                                                            {num}
                                                                                                                                        </option>
                                                                                                                                    ))}
                                                                                                                                </select>
                                                                                                                            </li>
                                                                                                                        ),
                                                                                                                    )}
                                                                                                                </ul>
                                                                                                            )}
                                                                                                    </td>

                                                                                                    <td className="border-t border-gray-200 px-3 py-2 text-center font-semibold">
                                                                                                        {benchmark.children &&
                                                                                                        benchmark.children.length > 0 ? (
                                                                                                            computeParentMean(
                                                                                                                area.id,
                                                                                                                param.id,
                                                                                                                benchmark.children,
                                                                                                            )
                                                                                                        ) : (
                                                                                                            <select
                                                                                                                className="rounded-md border-none bg-transparent text-center focus:ring-0 focus:outline-none"
                                                                                                                value={
                                                                                                                    ratings[
                                                                                                                        `${area.id}-${param.id}-${benchmark.id}`
                                                                                                                    ] || 'N/A'
                                                                                                                }
                                                                                                                onChange={(e) =>
                                                                                                                    handleRatingChange(
                                                                                                                        `${area.id}-${param.id}-${benchmark.id}`,
                                                                                                                        e.target.value,
                                                                                                                    )
                                                                                                                }
                                                                                                            >
                                                                                                                <option value="N/A">N/A</option>
                                                                                                                {[0, 1, 2, 3, 4, 5].map((num) => (
                                                                                                                    <option key={num} value={num}>
                                                                                                                        {num}
                                                                                                                    </option>
                                                                                                                ))}
                                                                                                            </select>
                                                                                                        )}
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </React.Fragment>
                                                                                        ))}

                                                                                        {/* Parameter mean */}
                                                                                        <tr className="bg-[#f7f7f7] font-semibold">
                                                                                            <td className="border-t border-gray-300 px-3 py-2 text-right">
                                                                                                System – Implementation – Outcome Means
                                                                                            </td>
                                                                                            <td className="border-t border-gray-300 px-3 py-2 text-center text-[#7f1414]">
                                                                                                {means[`${area.id}-${param.id}`] ?? '—'}
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}

                                                            {/* Area Mean */}
                                                            <div className="mt-4 text-right text-sm font-semibold text-gray-800">
                                                                Parameter Mean: <span className="text-[#7f1414]">{means[`${area.id}`] ?? '—'}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}

                                            {/* Program Mean (added below all areas) */}
                                            <div className="mt-6 border-t border-gray-300 pt-4 text-right text-base font-bold text-gray-900">
                                                Program Mean: <span className="text-[#7f1414]">{programMean}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </section>
                        {/* Program Means Summary Section */}
                        <section className="mt-12 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-[#7f1414]">Overall Program Means</h2>

                                {/* Export All Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="noborder">
                                            <Download className="h-4 w-4" /> Export Program Means
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                                            Excel
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <FileText className="mr-2 h-4 w-4 text-red-600" />
                                            PDF
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Table of Program Means */}
                            <table className="w-full overflow-hidden text-sm text-gray-700">
                                <thead className="bg-[#7f1414]/10">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-semibold">Program Name</th>
                                        <th className="px-4 py-3 text-center font-semibold">Accreditation Level</th>
                                        <th className="px-4 py-3 text-center font-semibold">Program Mean</th>
                                        <th className="px-4 py-3 text-center font-semibold">Export Area Means</th> {/* New Column */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {programs.map((program, idx) => {
                                        const areaIds = program.assigned_areas.map((a) => a.id);
                                        const areaMeans = areaIds.map((id) => parseFloat(means[id])).filter((v) => !isNaN(v));
                                        const programMean =
                                            areaMeans.length > 0 ? (areaMeans.reduce((a, b) => a + b, 0) / areaMeans.length).toFixed(2) : '—';

                                        return (
                                            <tr key={program.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-t border-gray-200`}>
                                                <td className="px-4 py-3">{program.program_name}</td>
                                                <td className="px-4 py-3 text-center font-semibold">
                                                    {selectedLevels[program.id] || program.accreditation_level}
                                                </td>
                                                <td className="px-4 py-3 text-center font-semibold text-[#7f1414]">{programMean}</td>

                                                {/* Export Column */}
                                                <td className="flex justify-center px-4 py-3 text-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="noborder">
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            {/* <DropdownMenuLabel>Export {program.program_name}</DropdownMenuLabel> */}
                                                            <DropdownMenuItem>
                                                                <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                                                                Excel
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <FileText className="mr-2 h-4 w-4 text-red-600" />
                                                                PDF
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </section>
                    </div>

                    <DocumentViewer open={viewerOpen} onOpenChange={setViewerOpen} fileUrl={viewerFile.url} title={viewerFile.title} />
                </div>
            </AccreditorLayout>
        </>
    );
}
