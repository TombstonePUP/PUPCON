'use client';

import { DocumentViewer } from '@/components/dialogs/documents/view-document';
import { ParameterOutlineCategory, type ParameterOutlines } from '@/types';
import { Circle, CircleCheckIcon, CircleDashedIcon, CircleDot, CircleDotDashedIcon, CircleXIcon, } from 'lucide-react';
import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface DialogParams {
    type: 'view-document' | 'upload-document' | 'delete-document' | 'add-benchmark' | 'edit-benchmark' | 'delete-benchmark';
    benchmark: ParameterOutlines;
}

interface OutlineProps {
    outlines: ParameterOutlines[];
    program?: string;
    area_id?: number;
    outlineCategory?: ParameterOutlineCategory[];
    resolveDialog: ({ type, benchmark }: DialogParams) => void;
}

interface OutlineNode extends ParameterOutlines {
    children: OutlineNode[];
}

export function buildOutlineTree({ outlines }: { outlines: ParameterOutlines[] }): OutlineNode[] {
    // Sort outlines by their outline_number to ensure proper hierarchy
    const sortedOutlines = outlines.sort((a, b) => {
        const aNum = a.outline_number || '';
        const bNum = b.outline_number || '';

        // Split by dots and compare each part numerically
        const aParts = aNum.split('.').map((part) => parseInt(part) || 0);
        const bParts = bNum.split('.').map((part) => parseInt(part) || 0);

        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aVal = aParts[i] || 0;
            const bVal = bParts[i] || 0;
            if (aVal !== bVal) {
                return aVal - bVal;
            }
        }
        return 0;
    });

    const tree: OutlineNode[] = [];
    const nodeMap = new Map<string, OutlineNode>();

    // Create all nodes first
    sortedOutlines.forEach((outline) => {
        const node: OutlineNode = {
            ...outline,
            children: [],
        };
        nodeMap.set(outline.outline_number || '', node);
    });

    // Build the hierarchy
    sortedOutlines.forEach((outline) => {
        const outlineNumber = outline.outline_number || '';
        const node = nodeMap.get(outlineNumber)!;

        // Find parent by checking if this is a sub-outline
        const parts = outlineNumber.split('.');

        if (parts.length > 1) {
            // This is a sub-outline (e.g., "1.1", "1.2", "2.1.1")
            // Find the parent by removing the last part
            const parentNumber = parts.slice(0, -1).join('.');
            const parentNode = nodeMap.get(parentNumber);

            if (parentNode) {
                parentNode.children.push(node);
            } else {
                // If parent not found, add to root
                tree.push(node);
            }
        } else {
            // This is a root outline (e.g., "1", "2", "A")
            tree.push(node);
        }
    });

    return tree;
}

export function RecursiveOutline({ outlines }: OutlineProps) {
    const { auth } = usePage().props;
    const role = auth?.user?.roles?.role_name;
    const isAccreditor = role === "Accreditor";

    const [showDocumentViewer, setShowDocumentViewer] = useState(false);
    const [currentDocumentUrl, setCurrentDocumentUrl] = useState('');
    const [currentDocumentTitle, setCurrentDocumentTitle] = useState('');
    const [ratings, setRatings] = useState<Record<number, number | "N/A">>({});
    const [mean, setMean] = useState<string>("—");

    const handleViewPDF = (outline) => {
        if (outline.area_files?.file_path) {
            setCurrentDocumentUrl(outline.area_files.file_path);
            setCurrentDocumentTitle(
                `${outline.initial}.${outline.outline_number}. ${outline.outline_description}`
            );
            setShowDocumentViewer(true);
        }
    };

    const handleRatingChange = (outlineId: number, value: string) => {
        setRatings((prev) => {
            const newRatings = { ...prev, [outlineId]: value === "N/A" ? "N/A" : Number(value) };

            // compute average of numeric ratings
            const numericValues = Object.values(newRatings)
                .filter((v): v is number => typeof v === "number" && !isNaN(v));

            const avg =
                numericValues.length > 0
                    ? (numericValues.reduce((a, b) => a + b, 0) / numericValues.length).toFixed(2)
                    : "—";

            setMean(avg);
            return newRatings;
        });
    };

    return (
        <>
            <DocumentViewer
                open={showDocumentViewer}
                onOpenChange={setShowDocumentViewer}
                fileUrl={currentDocumentUrl}
                title={currentDocumentTitle}
            />

            <ul className="pl-[1vw] flex flex-col gap-1">
                {outlines.map((outline) => (
                    <li key={outline.parameter_outline_id}>
                        <div className="flex flex-col gap-1">
                            <div className='flex items-center'>
                                {/* Outline label */}
                                {!outline.container ? (
                                    <a
                                        className="cursor-pointer underline text-[#7f1414] hover:text-red-700"
                                        onClick={() => handleViewPDF(outline)}
                                    >
                                        {outline.initial}.{outline.outline_number}.{" "}
                                        {outline.outline_description}
                                    </a>
                                ) : (
                                    <span className="font-medium">
                                        {outline.initial}.{outline.outline_number}.{" "}
                                        {outline.outline_description}
                                    </span>
                                )}

                                {/* Accreditor rating (only for non-container outlines) */}
                                {isAccreditor && !outline.container && (
                                    <div className="flex items-center gap-2 ml-6 mt-1">
                                        {/* <label className="text-sm text-gray-600">Rating:</label> */}
                                        <select
                                            className="rounded-md border px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#7f1414]"
                                            value={ratings[outline.parameter_outline_id] ?? "N/A"}
                                            onChange={(e) =>
                                                handleRatingChange(outline.parameter_outline_id, e.target.value)
                                            }
                                        >
                                            <option value="N/A">N/A</option>
                                            {[0, 1, 2, 3, 4, 5].map((num) => (
                                                <option key={num} value={num}>
                                                    {num}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                            {/* Recursive children */}
                            {outline.children && outline.children.length > 0 && (
                                <RecursiveOutline outlines={outline.children} />
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {/* Mean display (Accreditor only) */}
            {isAccreditor && (
                <div className="mt-3 text-right text-sm font-semibold text-gray-800">
                    Mean Rating:{" "}
                    <span className="text-[#7f1414]">{mean ?? "—"}</span>
                </div>
            )}
        </>
    );
}


export function RecursiveOutlineForm({ outlines, resolveDialog }: OutlineProps) {
    const { auth } = usePage().props;
    const role = auth.user.roles.role_name;

    const FileStatus = ({ outline }) => {
        const status = outline.area_files?.file_status?.status_name;

        const renderStatus = (icon: React.ReactNode, color: string, tooltip: string) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className={`flex flex-row gap-1 italic ${color} cursor-default`}>
                            {icon}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );

        if (status === 'Rejected') {
            return renderStatus(
                <CircleXIcon className='size-4 mt-0.5' />,
                'text-red-600',
                'Rejected',
            );
        } else if (status === 'Approved') {
            return renderStatus(
                <CircleCheckIcon className='size-4 mt-0.5' />,
                'text-green-600',
                'Approved',
            );
        } else if (status === 'Pending') {
            return renderStatus(
                <CircleDotDashedIcon className='size-4 mt-0.5' />,
                'text-gray-700',
                'Pending',
            );
        } else {
            return renderStatus(
                <CircleDashedIcon className='size-4 mt-0.5' />,
                'text-gray-700',
                'Empty Benchmark',
            );
        }
    };

    return (
        <>
            <ul className="pl-[1vw] flex flex-col gap-2">
                {outlines.map((outline) => (
                    <li key={outline.parameter_outline_id}>
                        {outline.container ? (
                            <span className='font-medium flex gap-2'><p className='font-bold text-center w-4 opacity-50'>-</p> {`${outline.initial}.${outline.outline_number}. ${outline.outline_description}`}</span>
                        ) : (
                            <ContextMenu>
                                <ContextMenuTrigger
                                    className="flex flex-row gap-2 items-center">
                                    <FileStatus outline={outline} />
                                    <a
                                        onClick={(e) => {
                                            if (e.button == 0) {
                                                e.preventDefault();
                                                setTimeout(() => resolveDialog({ type: 'view-document', benchmark: outline }), 50);
                                            }
                                        }}
                                        className={
                                            `cursor-pointer underline`
                                        }
                                    >
                                        {`${outline.initial}.${outline.outline_number}. ${outline.outline_description}`}
                                    </a>
                                </ContextMenuTrigger>
                                <ContextMenuContent>
                                    <ContextMenuItem
                                        className="cursor-pointer"
                                        onSelect={() => {
                                            setTimeout(() => resolveDialog({ type: 'upload-document', benchmark: outline }), 50);
                                        }}
                                    >
                                        {outline.area_files ? 'Update Document' : 'Upload Document'}
                                    </ContextMenuItem>
                                    {(role !== 'Chairman' && role !== 'Accreditor') && (
                                        <ContextMenuItem
                                            className="cursor-pointer"
                                            onSelect={() => {
                                                setTimeout(() => resolveDialog({ type: 'edit-benchmark', benchmark: outline }), 50);
                                            }}
                                        >
                                            Edit Benchmark
                                        </ContextMenuItem>
                                    )}
                                    <ContextMenuSeparator />
                                    {outline.area_files && (
                                        <ContextMenuItem
                                            className="cursor-pointer"
                                            onSelect={() => {
                                                setTimeout(() => resolveDialog({ type: 'delete-document', benchmark: outline }), 50);
                                            }}
                                        >
                                            Delete Document
                                        </ContextMenuItem>
                                    )}
                                    {(role !== 'Chairman' && role !== 'Accreditor') && (
                                        <ContextMenuItem
                                            className="cursor-pointer"
                                            onSelect={() => {
                                                setTimeout(() => resolveDialog({ type: 'delete-benchmark', benchmark: outline }), 50);
                                            }}
                                        >
                                            Delete Benchmark
                                        </ContextMenuItem>
                                    )}
                                </ContextMenuContent>
                            </ContextMenu>
                        )}
                        {outline.children && outline.children.length > 0 && <RecursiveOutlineForm outlines={outline.children} />}
                    </li>
                ))}
            </ul>
        </>
    );
}
