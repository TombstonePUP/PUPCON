"use client"

import { type ParameterOutlines } from '@/types';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface OutlineProps {
    outlines: ParameterOutlines[];
}

function sortOutlinesByNumber(outlines) {
    return outlines.slice().sort((a, b) => {
        const aParts = a.outline_number.split('.').map(Number);
        const bParts = b.outline_number.split('.').map(Number);
        const len = Math.max(aParts.length, bParts.length);
        for (let i = 0; i < len; i++) {
            const aVal = aParts[i] ?? 0;
            const bVal = bParts[i] ?? 0;
            if (aVal !== bVal) return aVal - bVal;
        }
        return 0;
    });
}

export function buildOutlineTree({outlines}: OutlineProps) {
    const sortedOutlines = sortOutlinesByNumber(outlines);
    const outlineMap = new Map();
    const rootOutlines = [];

    sortedOutlines.forEach((outline) => {
        outlineMap.set(outline.parameter_outline_id, { ...outline, children: [] });
    });

    sortedOutlines.forEach(outline => {
        if (outline.parent_outline_id) {
            const parent = outlineMap.get(outline.parent_outline_id);
            if (parent) {
                parent.children.push(outlineMap.get(outline.parameter_outline_id));
            }
        } else {
            rootOutlines.push(outlineMap.get(outline.parameter_outline_id));
        }
    });
    return rootOutlines;
}

export function RecursiveOutline({ outlines }: OutlineProps) {
    return (
        <>
            <ul className="pl-[1vw]">
                {outlines.map((outline) => (
                    <li key={outline.parameter_outline_id}>
                        {!outline.container ? (
                            <a className="cursor-pointer underline">
                                {outline.initial}.
                                {outline.outline_number}.
                                {outline.outline_description}
                            </a>
                        ) : (
                            <span>
                                {outline.initial}.
                                {outline.outline_number}.
                                {outline.outline_description}
                            </span>
                        )}
                        {outline.children && outline.children.length > 0 && (
                            <RecursiveOutline outlines={outline.children} />
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
}

export function RecursiveOutlineForm({ outlines }: OutlineProps) {
    return (
        <>
            <ul className="pl-[1vw]">
                {outlines.map((outline) => (
                    <li key={outline.parameter_outline_id}>
                        {!outline.container ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <a className="cursor-pointer underline">
                                        S.1. The institution has a system of determining the Vision and Mission.
                                    </a>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black">Edit Outline</DialogTitle>
                                        <DialogDescription>Parameter A - Systems - Inputs and Processes</DialogDescription>
                                    </DialogHeader>

                                    <div className="flex flex-col gap-3 ">
                                        {/* Current Document Section */}
                                        <div>
                                            <h1 className='text-sm font-medium text-muted-foreground mb-1'>Current Document</h1>
                                            <div className="flex items-center gap-4 rounded border bg-gray-50 p-4">
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-600">No document uploaded</p>
                                                    {/* When document exists:
                                                    <p className="font-medium">vision_mission_system.pdf</p>
                                                    <p className="text-sm text-gray-500">Uploaded on Jan 15, 2023</p>
                                                    */}
                                                </div>
                                                <Button variant="outline" size="sm" disabled={true}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View PDF
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Edit Outline Section */}
                                        <div>
                                            <h3 className='text-sm font-medium text-muted-foreground mb-1'>Edit Outline Content</h3>
                                            <textarea
                                                className="min-h-[120px] text-sm w-full rounded border p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 max-h-[20vw]"
                                                defaultValue="The institution has a system of determining the Vision and Mission."
                                                placeholder="Enter outline description..."
                                            />
                                        </div>

                                        {/* Upload File Section */}
                                        <div className="space-y-2">
                                            <h3 className='text-sm font-medium text-muted-foreground mb-1'>Upload Document</h3>
                                            <div className="flex w-full items-center justify-center">
                                                <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <svg
                                                            className="mb-4 h-8 w-8 text-gray-500"
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 20 16"
                                                        >
                                                            <path
                                                                stroke="currentColor"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                            />
                                                        </svg>
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">Click to upload</span> or drag and
                                                            drop
                                                        </p>
                                                        <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                                                    </div>
                                                    <input type="file" className="hidden" accept=".pdf" />
                                                </label>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-between pt-4">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                        Remove Outline
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle>Confirm Removal</DialogTitle>
                                                        <DialogDescription>
                                                            Are you sure you want to permanently remove this outline and all
                                                            associated documents?
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline">Cancel</Button>
                                                        </DialogClose>
                                                        <Button variant="destructive">Delete Permanently</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                            <div className="flex gap-2">
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <Button variant="black" type="submit">
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ) : (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <span>
                                        S.1. The institution has a system of determining the Vision and Mission.
                                    </span>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black">Edit Outline</DialogTitle>
                                        <DialogDescription>Parameter A - Systems - Inputs and Processes</DialogDescription>
                                    </DialogHeader>

                                    <div className="flex flex-col gap-3 ">
                                        {/* Current Document Section */}
                                        <div>
                                            <h1 className='text-sm font-medium text-muted-foreground mb-1'>Current Document</h1>
                                            <div className="flex items-center gap-4 rounded border bg-gray-50 p-4">
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-600">No document uploaded</p>
                                                    {/* When document exists:
                                                    <p className="font-medium">vision_mission_system.pdf</p>
                                                    <p className="text-sm text-gray-500">Uploaded on Jan 15, 2023</p>
                                                    */}
                                                </div>
                                                <Button variant="outline" size="sm" disabled={true}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View PDF
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Edit Outline Section */}
                                        <div>
                                            <h3 className='text-sm font-medium text-muted-foreground mb-1'>Edit Outline Content</h3>
                                            <textarea
                                                className="min-h-[120px] text-sm w-full rounded border p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 max-h-[20vw]"
                                                defaultValue="The institution has a system of determining the Vision and Mission."
                                                placeholder="Enter outline description..."
                                            />
                                        </div>

                                        {/* Upload File Section */}
                                        <div className="space-y-2">
                                            <h3 className='text-sm font-medium text-muted-foreground mb-1'>Upload Document</h3>
                                            <div className="flex w-full items-center justify-center">
                                                <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <svg
                                                            className="mb-4 h-8 w-8 text-gray-500"
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 20 16"
                                                        >
                                                            <path
                                                                stroke="currentColor"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                            />
                                                        </svg>
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">Click to upload</span> or drag and
                                                            drop
                                                        </p>
                                                        <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                                                    </div>
                                                    <input type="file" className="hidden" accept=".pdf" />
                                                </label>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-between pt-4">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                        Remove Outline
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-md">
                                                    <DialogHeader>
                                                        <DialogTitle>Confirm Removal</DialogTitle>
                                                        <DialogDescription>
                                                            Are you sure you want to permanently remove this outline and all
                                                            associated documents?
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <DialogClose asChild>
                                                            <Button variant="outline">Cancel</Button>
                                                        </DialogClose>
                                                        <Button variant="destructive">Delete Permanently</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>

                                            <div className="flex gap-2">
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <Button variant="black" type="submit">
                                                    Save Changes
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                        {outline.children && outline.children.length > 0 && (
                            <RecursiveOutlineForForm outlines={outline.children} />
                        )}
                    </li>
                ))}
            </ul>
        </>
    );
}
