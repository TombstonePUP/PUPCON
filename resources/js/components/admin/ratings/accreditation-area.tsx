import React from 'react';
import { ChevronDown, ChevronRight, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AccreditationArea } from '@/types/admin/ratings';
import { IndicatorTable } from './indicator-table';

interface AccreditationAreaProps {
    area: AccreditationArea;
    isExpanded: boolean;
    onToggle: () => void;
    expandedParameters: Record<string, boolean>;
    onToggleParameter: (paramId: string) => void;
    means: Record<string, string | number>;
    onViewDocument: (url: string, title: string) => void;
    getStatusColor: (status: string) => string;
    getStatusText: (status: string) => string;
    getParameterStatusIcon: (status: string) => React.ReactNode;
    getParameterStatusBadge: (status: string) => string;
    getParameterStatusText: (status: string) => string;
}

export const AccreditationAreaView = ({
    area,
    isExpanded,
    onToggle,
    expandedParameters,
    onToggleParameter,
    means,
    onViewDocument,
    getStatusColor,
    getStatusText,
    getParameterStatusIcon,
    getParameterStatusBadge,
    getParameterStatusText,
}: AccreditationAreaProps) => {
    return (
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50">
            <button
                onClick={onToggle}
                className="flex w-full items-center justify-between p-4 text-left hover:rounded-lg hover:bg-white"
            >
                <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
                    <h4 className="font-semibold text-gray-900">{area.area_name}</h4>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(area.status)}`}>
                        {getStatusText(area.status)}
                    </span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button onClick={(e) => e.stopPropagation()} variant="noborder">
                            <Download className="h-4 w-4" /> Export
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                            Export as Excel
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4 text-red-600" />
                            Export as PDF
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </button>

            {isExpanded && (
                <div className="border-t border-gray-200 bg-white p-4">
                    {area.parameters.map((param) => (
                        <div key={param.id} className="mb-3 rounded-lg border border-gray-200">
                            <button
                                onClick={() => onToggleParameter(`${area.id}-${param.id}`)}
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
                                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getParameterStatusBadge(param.status)}`}>
                                    {getParameterStatusText(param.status)}
                                </span>
                            </button>

                            {expandedParameters[`${area.id}-${param.id}`] && (
                                <div className="space-y-4 p-3">
                                    <IndicatorTable
                                        benchmarks={param.benchmarks}
                                        onViewDocument={onViewDocument}
                                        mean={means[`${area.id}-${param.id}`] ?? '—'}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="mt-4 text-right text-sm font-semibold text-gray-800">
                        Parameter Mean: <span className="text-[#7f1414]">{means[`${area.id}`] ?? '—'}</span>
                    </div>
                </div>
            )}
        </div>
    );
};
