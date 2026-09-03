import React from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Program } from '@/types/admin/ratings';

interface ProgramMeansTableProps {
    programs: Program[];
    means: Record<string, string | number>;
    selectedLevels: Record<number, string>;
}

export const ProgramMeansTable = ({ programs, means, selectedLevels }: ProgramMeansTableProps) => {
    return (
        <section className="mb-12 rounded-xl border border-gray-200 bg-white p-8">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#7f1414]">Overall Program Means</h2>
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

            <table className="w-full overflow-hidden text-sm text-gray-700">
                <thead className="bg-[#7f1414]/10">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold">Program Name</th>
                        <th className="px-4 py-3 text-center font-semibold">Accreditation Level</th>
                        <th className="px-4 py-3 text-center font-semibold">Program Mean</th>
                        <th className="px-4 py-3 text-center font-semibold">Export Area Means</th>
                    </tr>
                </thead>
                <tbody>
                    {programs.map((program, idx) => {
                        const areaIds = program.assigned_areas.map((a) => a.id);
                        const areaMeans = areaIds.map((id) => parseFloat(String(means[id]))).filter((v) => !isNaN(v));
                        const programMean = areaMeans.length > 0 ? (areaMeans.reduce((a, b) => a + b, 0) / areaMeans.length).toFixed(2) : '—';

                        return (
                            <tr key={program.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-t border-gray-200`}>
                                <td className="px-4 py-3">{program.program_name}</td>
                                <td className="px-4 py-3 text-center font-semibold">
                                    {selectedLevels[program.id] || program.accreditation_level}
                                </td>
                                <td className="px-4 py-3 text-center font-semibold text-[#7f1414]">{programMean}</td>
                                <td className="flex justify-center px-4 py-3 text-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="noborder">
                                                <Download className="h-4 w-4" />
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
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </section>
    );
};
