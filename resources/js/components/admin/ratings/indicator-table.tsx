import React from 'react';
import { Benchmark } from '@/types/admin/ratings';

interface IndicatorTableProps {
    benchmarks: Benchmark[];
    onViewDocument: (url: string, title: string) => void;
    mean: string | number;
}

export const IndicatorTable = ({ benchmarks, onViewDocument, mean }: IndicatorTableProps) => {
    return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-2 font-bold text-[#7f1414]">Indicators and Ratings</h4>
            <table className="w-full border-t border-gray-200 text-sm text-gray-700">
                <thead>
                    <tr className="bg-white">
                        <th className="px-3 py-3 text-left font-semibold">Indicators</th>
                        <th className="py-3 text-center font-semibold">Item Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {benchmarks.map((benchmark, idx) => (
                        <React.Fragment key={benchmark.id}>
                            <tr className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} transition hover:bg-gray-100`}>
                                <td className="border-t border-gray-200 px-3 py-2 align-top">
                                    <button
                                        onClick={() => onViewDocument(benchmark.pdfUrl, benchmark.text)}
                                        className="text-left text-gray-700 hover:text-[#7f1414] hover:underline"
                                    >
                                        {benchmark.text}
                                    </button>
                                    {benchmark.children && benchmark.children.length > 0 && (
                                        <ul className="mt-2 space-y-1 pl-6">
                                            {benchmark.children.map((child, cidx) => (
                                                <li
                                                    key={child.id}
                                                    className={`flex items-center justify-between text-sm text-gray-700 ${
                                                        cidx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                                    } rounded-md px-2 py-1`}
                                                >
                                                    <button
                                                        onClick={() => onViewDocument(child.pdfUrl, child.text)}
                                                        className="text-left hover:text-[#7f1414] hover:underline"
                                                    >
                                                        {child.text}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </td>
                                <td className="border-t border-gray-200 px-3 py-2 text-center font-semibold">1</td>
                            </tr>
                        </React.Fragment>
                    ))}
                    <tr className="bg-[#f7f7f7] font-semibold">
                        <td className="border-t border-gray-300 px-3 py-2 text-right">System – Implementation – Outcome Means</td>
                        <td className="border-t border-gray-300 px-3 py-2 text-center text-[#7f1414]">{mean}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
