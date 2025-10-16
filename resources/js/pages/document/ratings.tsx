import React, { useState } from "react";
import {
    CheckCircle,
    FileText,
    Calendar,
    Award,
    ChevronDown,
    ChevronRight,
    Download,
    FileSpreadsheet,
    Check,
    AlertCircle,
} from "lucide-react";
import AccreditorLayout from '@/layouts/accreditor-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { DocumentViewer } from '@/components/dialogs/documents/view-document';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PerProgramUnderSurvey } from '@/types';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Ratings',
        href: `/manage-ratings`,
    },
];

interface ProgramsProps {
    programs: PerProgramUnderSurvey[];
}

export default function Ratings() {
    const [expandedAreas, setExpandedAreas] = useState({});
    const [expandedParameters, setExpandedParameters] = useState({});
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerFile, setViewerFile] = useState({ url: "", title: "" });
    const [exportDropdown, setExportDropdown] = useState({});
    const [exportAreaDropdown, setExportAreaDropdown] = useState({});
    const [ratings, setRatings] = useState({});
    const [means, setMeans] = useState({});
    const [selectedLevels, setSelectedLevels] = useState({});

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
                            id: "A",
                            label: "Program Goals and Objectives",
                            status: "approved",
                            benchmarks: [
                                {
                                    id: 1,
                                    category: "S",
                                    text: "S.4. The Goals are clearly stated, and are consistent with the Mission of the Institution.",
                                    pdfUrl: "/docs/goals.pdf"
                                },
                                {
                                    id: 2,
                                    category: "S",
                                    text: "S.5. The Objectives of the program clearly state the expected outcomes in terms of competencies (skills and knowledge), values, and other attributes of the graduates which include the development of:",
                                    pdfUrl: "/docs/objectives.pdf",
                                    children: [
                                        {
                                            id: 3,
                                            category: "S",
                                            text: "S.5.1. technical skills in Hotel and Restaurant Management/TM/HM/TrM;",
                                            pdfUrl: "/docs/skills.pdf"
                                        },
                                        {
                                            id: 4,
                                            category: "S",
                                            text: "S.5.2. scientific habit thought;",
                                            pdfUrl: "/docs/habit.pdf"
                                        }
                                    ]
                                },
                                {
                                    id: 5,
                                    category: "I",
                                    text: "I.7. Implementation aligns with institutional goals.",
                                    pdfUrl: "/docs/implementation.pdf"
                                },
                                {
                                    id: 6,
                                    category: "O",
                                    text: "O.10. Graduates exhibit competencies aligned with program objectives.",
                                    pdfUrl: "/docs/outcomes.pdf"
                                }
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
        const childRatings = children
            .map((child) => parseFloat(ratings[`${areaId}-${paramId}-${child.id}`]))
            .filter((v) => !isNaN(v));

        if (childRatings.length === 0) return "—";

        const avg =
            childRatings.reduce((sum, val) => sum + val, 0) / childRatings.length;

        return avg.toFixed(2);
    };


    // Helpers
    const openViewer = (fileUrl, title) => {
        setViewerFile({ url: fileUrl, title });
        setViewerOpen(true);
    };

    const toggleArea = (areaId) =>
        setExpandedAreas((prev) => ({ ...prev, [areaId]: !prev[areaId] }));
    const toggleParameter = (paramId) =>
        setExpandedParameters((prev) => ({ ...prev, [paramId]: !prev[paramId] }));

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

        console.log(`Exporting "${program.program_name}" as ${type.toUpperCase()}`);

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
        const area = programs.flatMap(p => p.assigned_areas).find(a => a.id === areaId);
        if (!area) return;

        console.log(`Exporting "${area.area_name}" as ${type.toUpperCase()}`);
        alert(`Exporting ${area.area_name} as ${type.toUpperCase()}`);

        setExportAreaDropdown((prev) => ({ ...prev, [areaId]: false }));
    };


    // Close dropdowns when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            const exportButtons = document.querySelectorAll(".export-dropdown");
            let clickedInside = false;
            exportButtons.forEach((btn) => {
                if (btn.contains(event.target)) clickedInside = true;
            });
            if (!clickedInside) setExportDropdown({});
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);


    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800 border-green-300";
            case "in_progress":
                return "bg-blue-100 text-blue-800 border-blue-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "completed":
                return "Completed";
            case "in_progress":
                return "In Progress";
            default:
                return "Pending";
        }
    };

    const getParameterStatusIcon = (status) => {
        switch (status) {
            case "approved":
                return <Check className="h-4 w-4 text-green-600" />;
            case "needs_revision":
                return <AlertCircle className="h-4 w-4 text-amber-600" />;
            default:
                return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
        }
    };

    const getParameterStatusBadge = (status) => {
        switch (status) {
            case "approved":
                return "bg-green-100 text-green-700 border-green-300";
            case "needs_revision":
                return "bg-amber-100 text-amber-700 border-amber-300";
            default:
                return "bg-gray-100 text-gray-600 border-gray-300";
        }
    };

    const getParameterStatusText = (status) => {
        switch (status) {
            case "approved":
                return "Approved";
            case "needs_revision":
                return "Needs Revision";
            default:
                return "Pending Review";
        }
    };

    const handleRatingChange = (key, value) => {
        setRatings((prev) => {
            const newRatings = { ...prev, [key]: value };
            const [areaId, paramId] = key.split("-").slice(0, 2);
            const paramKey = `${areaId}-${paramId}`;
            const paramRatings = Object.entries(newRatings)
                .filter(([k]) => k.startsWith(paramKey))
                .map(([, v]) => v)
                .filter((v) => v !== "N/A" && v !== "" && !isNaN(v))
                .map(Number);
            const paramMean =
                paramRatings.length > 0
                    ? (
                        paramRatings.reduce((a, b) => a + b, 0) / paramRatings.length
                    ).toFixed(2)
                    : "—";
            setMeans((prevMeans) => {
                const updated = { ...prevMeans, [paramKey]: paramMean };
                const areaMeans = Object.entries(updated)
                    .filter(([k]) => k.startsWith(areaId + "-"))
                    .map(([, v]) => parseFloat(v))
                    .filter((v) => !isNaN(v));
                const areaMean =
                    areaMeans.length > 0
                        ? (areaMeans.reduce((a, b) => a + b, 0) / areaMeans.length).toFixed(2)
                        : "—";
                updated[areaId] = areaMean;
                return updated;
            });
            return newRatings;
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ratings" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Results & Ratings</h1>
                        <p className="mt-1 text-sm text-gray-600">View all program results and ratings</p>
                    </div>
                </div>

                {/* Programs Grid */}
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                    {/* Program Means Summary Section */}
                    <section className="mb-12 rounded-xl border border-gray-200 bg-white shadow-sm p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-[#7f1414]">Overall Program Means</h2>

                            {/* Export All Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="noborder"
                                    >
                                        <Download className="h-4 w-4" /> Export Program Means
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <FileSpreadsheet className="h-4 w-4 text-green-600 mr-2" />
                                        Excel
                                    </DropdownMenuItem>
                                    <DropdownMenuItem >
                                        <FileText className="h-4 w-4 text-red-600 mr-2" />
                                        PDF
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>

                        {/* Table of Program Means */}
                        <table className="w-full text-sm text-gray-700 overflow-hidden">
                            <thead className="bg-[#7f1414]/10">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold">Program Name</th>
                                    <th className="px-4 py-3 text-center font-semibold">Accreditation Level</th>
                                    <th className="text-center px-4 py-3 font-semibold">Program Mean</th>
                                    <th className="text-center px-4 py-3 font-semibold">Export Area Means</th> {/* New Column */}
                                </tr>
                            </thead>
                            <tbody>
                                {programs.map((program, idx) => {
                                    const areaIds = program.assigned_areas.map((a) => a.id);
                                    const areaMeans = areaIds
                                        .map((id) => parseFloat(means[id]))
                                        .filter((v) => !isNaN(v));
                                    const programMean =
                                        areaMeans.length > 0
                                            ? (areaMeans.reduce((a, b) => a + b, 0) / areaMeans.length).toFixed(2)
                                            : "—";

                                    return (
                                        <tr
                                            key={program.id}
                                            className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                } border-t border-gray-200`}
                                        >
                                            <td className="px-4 py-3">{program.program_name}</td>
                                            <td className="px-4 py-3 text-center font-semibold">
                                                {selectedLevels[program.id] || program.accreditation_level}
                                            </td>
                                            <td className="px-4 py-3 text-center font-semibold text-[#7f1414]">
                                                {programMean}
                                            </td>

                                            {/* Export Column */}
                                            <td className="px-4 py-3 text-center flex  justify-center">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="noborder">
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {/* <DropdownMenuLabel>Export {program.program_name}</DropdownMenuLabel> */}
                                                        <DropdownMenuItem >
                                                            <FileSpreadsheet className="h-4 w-4 text-green-600 mr-2" />
                                                            Excel
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem >
                                                            <FileText className="h-4 w-4 text-red-600 mr-2" />
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
                    {/* Programs */}
                    <section>
                        {programs.map((program) => {
                            // 🔹 Compute Program Mean
                            const areaIds = program.assigned_areas.map((a) => a.id);
                            const areaMeans = areaIds
                                .map((id) => parseFloat(means[id]))
                                .filter((v) => !isNaN(v));

                            const programMean =
                                areaMeans.length > 0
                                    ? (areaMeans.reduce((a, b) => a + b, 0) / areaMeans.length).toFixed(2)
                                    : "—";

                            return (
                                <div
                                    key={program.id}
                                    className="mb-6 rounded-xl border border-gray-200 bg-white"
                                >
                                    <div className="border-b border-gray-100 bg-[#7f1414]/5 p-6 flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-[#7f1414]">
                                            {program.program_name}
                                        </h3>
                                        <Select
                                            onValueChange={(value) =>
                                                setSelectedLevels((prev) => ({ ...prev, [program.id]: value }))
                                            }
                                        >
                                            <SelectTrigger className="w-fit gap-2 bg-white">
                                                <SelectValue
                                                    placeholder={`Level ${program.accreditation_level}`}
                                                />
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
                                            <div
                                                key={area.id}
                                                className="mb-4 rounded-lg border border-gray-200 bg-gray-50"
                                            >
                                                <button
                                                    onClick={() => toggleArea(area.id)}
                                                    className="flex w-full items-center justify-between p-4 text-left hover:bg-white hover:rounded-lg"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {expandedAreas[area.id] ? (
                                                            <ChevronDown className="h-5 w-5 text-gray-500" />
                                                        ) : (
                                                            <ChevronRight className="h-5 w-5 text-gray-500" />
                                                        )}
                                                        <h4 className="font-semibold text-gray-900">
                                                            {area.area_name}
                                                        </h4>
                                                        <span
                                                            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                                                                area.status
                                                            )}`}
                                                        >
                                                            {getStatusText(area.status)}
                                                        </span>
                                                    </div>

                                                    {/* Export Dropdown */}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                onClick={(e) => e.stopPropagation()}
                                                                variant="noborder"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                                Export
                                                            </Button>
                                                        </DropdownMenuTrigger>

                                                        <DropdownMenuContent align="end">
                                                            {/* <DropdownMenuLabel>Export {area.area_name}</DropdownMenuLabel> */}
                                                            <DropdownMenuItem onClick={() => handleAreaExport(area.id, "excel")}>
                                                                <FileSpreadsheet className="h-4 w-4 text-green-600 mr-2" />
                                                                Export as Excel
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleAreaExport(area.id, "pdf")}>
                                                                <FileText className="h-4 w-4 text-red-600 mr-2" />
                                                                Export as PDF
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </button>

                                                {expandedAreas[area.id] && (
                                                    <div className="border-t border-gray-200 bg-white p-4 rounded-b-lg">
                                                        {area.parameters.map((param) => (
                                                            <div
                                                                key={param.id}
                                                                className="mb-3 rounded-lg border border-gray-200"
                                                            >
                                                                <button
                                                                    onClick={() =>
                                                                        toggleParameter(`${area.id}-${param.id}`)
                                                                    }
                                                                    className="flex w-full items-center justify-between p-3 hover:bg-gray-50 hover:rounded-lg"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        {expandedParameters[`${area.id}-${param.id}`] ? (
                                                                            <ChevronDown className="h-4 w-4 text-gray-500" />
                                                                        ) : (
                                                                            <ChevronRight className="h-4 w-4 text-gray-500" />
                                                                        )}
                                                                        {getParameterStatusIcon(param.status)}
                                                                        <span className="font-medium text-[#7f1414]">
                                                                            Parameter {param.id}
                                                                        </span>
                                                                        <span className="text-gray-600">{param.label}</span>
                                                                    </div>
                                                                    <span
                                                                        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getParameterStatusBadge(
                                                                            param.status
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
                                                                            <table className="w-full text-sm text-gray-700 border-t border-gray-200">
                                                                                <thead>
                                                                                    <tr className="bg-white">
                                                                                        <th className="text-left font-semibold py-3 px-3">
                                                                                            Indicators
                                                                                        </th>
                                                                                        <th className="text-center font-semibold py-3">
                                                                                            Item Rating
                                                                                        </th>
                                                                                    </tr>
                                                                                </thead>

                                                                                <tbody>
                                                                                    {param.benchmarks.map((benchmark, idx) => (
                                                                                        <React.Fragment key={benchmark.id}>
                                                                                            <tr
                                                                                                className={`
                                                                                ${idx % 2 === 0
                                                                                                        ? "bg-gray-50"
                                                                                                        : "bg-white"
                                                                                                    }
                                                                                hover:bg-gray-100 transition
                                                                            `}
                                                                                            >
                                                                                                <td className="px-3 py-2 align-top border-t border-gray-200">
                                                                                                    <button
                                                                                                        onClick={() =>
                                                                                                            openViewer(
                                                                                                                benchmark.pdfUrl,
                                                                                                                benchmark.text
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
                                                                                                                            className={`
                                                                                                            flex items-center justify-between text-sm text-gray-700 
                                                                                                            ${cidx % 2 === 0
                                                                                                                                    ? "bg-gray-50"
                                                                                                                                    : "bg-white"
                                                                                                                                } 
                                                                                                            rounded-md px-2 py-1
                                                                                                        `}
                                                                                                                        >
                                                                                                                            <button
                                                                                                                                onClick={() =>
                                                                                                                                    openViewer(
                                                                                                                                        child.pdfUrl,
                                                                                                                                        child.text
                                                                                                                                    )
                                                                                                                                }
                                                                                                                                className="text-left hover:text-[#7f1414] hover:underline"
                                                                                                                            >
                                                                                                                                {child.text}
                                                                                                                            </button>
                                                                                                                        </li>
                                                                                                                    )
                                                                                                                )}
                                                                                                            </ul>
                                                                                                        )}
                                                                                                </td>

                                                                                                <td className="px-3 py-2 text-center border-t border-gray-200 font-semibold">
                                                                                                    1
                                                                                                </td>
                                                                                            </tr>
                                                                                        </React.Fragment>
                                                                                    ))}

                                                                                    {/* Parameter mean */}
                                                                                    <tr className="bg-[#f7f7f7] font-semibold">
                                                                                        <td className="px-3 py-2 text-right border-t border-gray-300">
                                                                                            System – Implementation – Outcome Means
                                                                                        </td>
                                                                                        <td className="px-3 py-2 text-center border-t border-gray-300 text-[#7f1414]">
                                                                                            {means[`${area.id}-${param.id}`] ?? "—"}
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
                                                            Parameter Mean:{" "}
                                                            <span className="text-[#7f1414]">
                                                                {means[`${area.id}`] ?? "—"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Program Mean (added below all areas) */}
                                        <div className="mt-6 text-right border-t border-gray-300 pt-4 text-base font-bold text-gray-900">
                                            Program Mean:{" "}
                                            <span className="text-[#7f1414]">{programMean}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </section>


                </div>

                <DocumentViewer
                    open={viewerOpen}
                    onOpenChange={setViewerOpen}
                    fileUrl={viewerFile.url}
                    title={viewerFile.title}
                />
            </div>
        </AppLayout >
    );
}
