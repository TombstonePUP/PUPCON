'use client';

import { DocumentViewer } from '@/components/dialogs/documents/view-document';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AreaParameters, ParameterOutlineCategory, type ParameterOutlines } from '@/types';
import { usePage } from '@inertiajs/react';
import { Circle, CircleCheckIcon, CircleDashedIcon, CircleDotDashedIcon, CircleXIcon } from 'lucide-react';
import { useState } from 'react';

interface DocDialogParams {
    type: 'view' | 'upload' | 'delete';
    benchmark: ParameterOutlines;
}

interface BenchDialogParams {
    type: 'add' | 'edit' | 'delete';
    benchmark: ParameterOutlines;
    parameter?: AreaParameters;
}

interface OutlineProps {
    outlines: ParameterOutlines[];
    program?: string;
    area_id?: number;
    outlineCategory?: ParameterOutlineCategory[];
    resolveDocDialog: ({ type, benchmark }: DocDialogParams) => void;
    resolveBenchDialog: ({ type, benchmark, parameter }: BenchDialogParams) => void;
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
    const isAccreditor = role === 'Accreditor';

    const [showDocumentViewer, setShowDocumentViewer] = useState(false);
    const [currentDocumentUrl, setCurrentDocumentUrl] = useState('');
    const [currentDocumentTitle, setCurrentDocumentTitle] = useState('');
    const [ratings, setRatings] = useState<Record<number, number | 'N/A'>>({});
    const [mean, setMean] = useState<string>('—');

    const handleViewPDF = (outline) => {
        if (outline.area_files?.file_path) {
            setCurrentDocumentUrl(outline.area_files.file_path);
            setCurrentDocumentTitle(`${outline.initial}.${outline.outline_number}. ${outline.outline_description}`);
            setShowDocumentViewer(true);
        }
    };

    const handleRatingChange = (outlineId: number, value: string) => {
        setRatings((prev) => {
            const newRatings = { ...prev, [outlineId]: value === 'N/A' ? 'N/A' : Number(value) };

            // compute average of numeric ratings
            const numericValues = Object.values(newRatings).filter((v): v is number => typeof v === 'number' && !isNaN(v));

            const avg = numericValues.length > 0 ? (numericValues.reduce((a, b) => a + b, 0) / numericValues.length).toFixed(2) : '—';

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

            <ul className="flex flex-col gap-1 pl-[1vw]">
                {outlines.map((outline) => (
                    <li key={outline.parameter_outline_id}>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center">
                                {/* Outline label */}
                                {!outline.container ? (
                                    <a className="cursor-pointer text-[#7f1414] underline hover:text-red-700" onClick={() => handleViewPDF(outline)}>
                                        {outline.initial}.{outline.outline_number}. {outline.outline_description}
                                    </a>
                                ) : (
                                    <span className="font-medium">
                                        {outline.initial}.{outline.outline_number}. {outline.outline_description}
                                    </span>
                                )}

                                {/* Accreditor rating (only for non-container outlines) */}
                                {isAccreditor && !outline.container && (
                                    <div className="mt-1 ml-6 flex items-center gap-2">
                                        {/* <label className="text-sm text-gray-600">Rating:</label> */}
                                        <select
                                            className="rounded-md border px-2 py-1 text-xs focus:ring-1 focus:ring-[#7f1414] focus:outline-none"
                                            value={ratings[outline.parameter_outline_id] ?? 'N/A'}
                                            onChange={(e) => handleRatingChange(outline.parameter_outline_id, e.target.value)}
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
                            {outline.children && outline.children.length > 0 && <RecursiveOutline outlines={outline.children} />}
                        </div>
                    </li>
                ))}
            </ul>

            {/* Mean display (Accreditor only) */}
            {isAccreditor && (
                <div className="mt-3 text-right text-sm font-semibold text-gray-800">
                    Mean Rating: <span className="text-[#7f1414]">{mean ?? '—'}</span>
                </div>
            )}
        </>
    );
}

export function RecursiveOutlineForm({ outlines, resolveDocDialog, resolveBenchDialog }: OutlineProps) {
    const { auth } = usePage().props;
    const role = auth.user.roles.role_name;

    const FileStatus = ({ outline }) => {
        const status = outline.area_files?.file_status?.status_name;

        const renderStatus = (icon: React.ReactNode, color: string, tooltip: string) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className={`flex flex-row gap-1 italic ${color} cursor-default`}>{icon}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{tooltip}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );

        if (status === 'Rejected') {
            return renderStatus(<CircleXIcon className="mt-0.5 size-4" />, 'text-red-600', 'Rejected');
        } else if (status === 'Approved') {
            return renderStatus(<CircleCheckIcon className="mt-0.5 size-4" />, 'text-green-600', 'Approved');
        } else if (status === 'Pending') {
            return renderStatus(<CircleDotDashedIcon className="mt-0.5 size-4" />, 'text-gray-700', 'Pending');
        } else {
            return renderStatus(<CircleDashedIcon className="mt-0.5 size-4" />, 'text-gray-700', 'Empty Benchmark');
        }
    };

    return (
        <>
            <ul className="flex flex-col gap-2 pl-[1vw]">
                {outlines.map((outline) => (
                    <li key={outline.parameter_outline_id}>
                        <ContextMenu>
                            <ContextMenuTrigger className="flex flex-row items-center gap-2">
                                {outline.container ? (
                                    <>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="flex cursor-default flex-row gap-1 italic">
                                                        <Circle className="mt-0.5 size-4" />
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Benchmark Container</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <span className="flex gap-2 font-medium cursor-pointer">
                                            {`${outline.initial}.${outline.outline_number}. ${outline.outline_description}`}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <FileStatus outline={outline} />
                                        <a
                                            onClick={(e) => {
                                                if (e.button === 0) {
                                                    e.preventDefault();
                                                    setTimeout(() => resolveDocDialog({ type: 'view', benchmark: outline }), 50);
                                                }
                                            }}
                                            className="cursor-pointer underline"
                                        >
                                            {`${outline.initial}.${outline.outline_number}. ${outline.outline_description}`}
                                        </a>
                                    </>
                                )}
                            </ContextMenuTrigger>

                            <ContextMenuContent>
                                {!outline.container && (
                                    <ContextMenuItem
                                        className="cursor-pointer"
                                        onSelect={() => {
                                            setTimeout(() => resolveDocDialog({ type: 'upload', benchmark: outline }), 50);
                                        }}
                                    >
                                        {outline.area_files ? 'Update Document' : 'Upload Document'}
                                    </ContextMenuItem>
                                )}

                                {role !== 'Chairman' && role !== 'Accreditor' && (
                                    <>
                                        <ContextMenuItem
                                            className="cursor-pointer"
                                            onSelect={() => {
                                                setTimeout(() => resolveBenchDialog({ type: 'edit', benchmark: outline }), 100);
                                            }}
                                        >
                                            Edit {outline.container ? 'Container' : 'Benchmark'}
                                        </ContextMenuItem>

                                        <ContextMenuSeparator />

                                        <ContextMenuItem
                                            className="cursor-pointer"
                                            onSelect={() => {
                                                setTimeout(() => resolveBenchDialog({ type: 'delete', benchmark: outline }), 50);
                                            }}
                                        >
                                            Delete {outline.container ? 'Container' : 'Benchmark'}
                                        </ContextMenuItem>
                                    </>
                                )}

                                {!outline.container && outline.area_files && (
                                    <ContextMenuItem
                                        className="cursor-pointer"
                                        onSelect={() => {
                                            setTimeout(() => resolveDocDialog({ type: 'delete', benchmark: outline }), 50);
                                        }}
                                    >
                                        Delete Document
                                    </ContextMenuItem>
                                )}
                            </ContextMenuContent>
                        </ContextMenu>
                        {outline.children && outline.children.length > 0 && <RecursiveOutlineForm outlines={outline.children} />}
                    </li>
                ))}
            </ul>
        </>
    );
}
