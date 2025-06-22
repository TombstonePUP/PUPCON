"use client"

import { ParameterOutlineCategory, type ParameterOutlines } from '@/types';
import { Link } from '@inertiajs/react';
import { CheckCircle2Icon, Eye, Trash2 } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
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
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface OutlineProps {
    outlines: ParameterOutlines[];
    program?: string;
    area_id?: number;
    outlineCategory?: ParameterOutlineCategory[];
}

interface ParameterOutlineForm {
    // parameter_outline_id?: number; // Optional for adding new outlines
    parameter_outline_category_id: number;
    outline_number: string | number;
    outline_description: string;
    container: boolean;
    area_file_id?: number | null;
    outline_file?: null;
}

interface AreaFileForm {
    area_file_id?: number;
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

export function RecursiveOutlineForm({ outlines, program, area_id, outlineCategory}: OutlineProps) {
    const {
        data: dataOutline,
        setData: setOutlineData,
        delete: destroyOutline,
        post: updateOutline,
        processing: processingOutline,
        errors: errorsOutline,
        reset: resetOutline,
    } = useForm<ParameterOutlineForm>({
        // parameter_outline_id: undefined,
        parameter_outline_category_id: null,
        outline_number: undefined,
        outline_description: undefined,
        container: undefined,
        area_file_id: undefined,
        outline_file: null,
    });


    const deleteOutline = (outline_id: number) => {
        destroyOutline(route('manage.area.deleteOutline', [program, area_id, outline_id]), {
            onSuccess: () => {
                console.log('Outline deleted successfully');
            },
        });
    };

    const editOutline = (e: React.FormEvent) => {
        console.log(dataOutline.outline_file);
        e.preventDefault();

        updateOutline(route('manage.area.updateOutline', [program, area_id, dataOutline.parameter_outline_id]), {
            onProgress: (e) => console.log(e.percentage),
            forceFormData: true,
            onSuccess: () => {
                resetOutline('parameter_outline_id', 'parameter_outline_category_id', 'outline_number', 'outline_description', 'container', 'outline_file');
            },
        });
    };

    const [showIframe, setShowIframe] = useState(false);

    const handleViewPDF = () => {
        setShowIframe(!showIframe);
    };

    console.log(outlines);
    return (
        <>
            <ul className="pl-[1vw]">
                {outlines.map((outline) => (
                    <li key={outline.parameter_outline_id}>
                            <Dialog>
                                <DialogTrigger asChild>
                                    {outline.container == true ? (
                                        <span className="cursor-pointer">
                                        {`${outline.initial}.${outline.outline_number}. ${outline.outline_description}`}
                                        </span>
                                    ) : (
                                        <span className="cursor-pointer underline">
                                        {`${outline.initial}.${outline.outline_number}. ${outline.outline_description}`}
                                        </span>
                                    )}
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black">Edit Outline</DialogTitle>
                                        <DialogDescription>
                                            {`${outline.initial}.${outline.outline_number}. ${outline.outline_description}`}
                                        </DialogDescription>
                                    </DialogHeader>

                                        <div className="flex flex-col gap-3 ">
                                            {/* Current Document Section */}
                                            <div>
                                                <h1 className='text-sm font-medium text-muted-foreground mb-1'>Current Document</h1>
                                                <div className="flex items-center gap-4 rounded border bg-gray-50 p-4">
                                                    <div className="flex-1">
                                                        {!outline.area_files && (
                                                            <p className="text-sm text-gray-600">No document uploaded</p>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={false}
                                                        onClick={handleViewPDF}
                                                        >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View PDF
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Edit Outline Number Section */}
                                            <form onSubmit={editOutline}>
                                            <div>
                                                <label className="text-muted-foreground mb-1 block text-sm font-medium">Outline Number</label>
                                                <input
                                                    id="outline_number"
                                                    type="text"
                                                    autoFocus
                                                    tabIndex={1}
                                                    value={dataOutline.outline_number}
                                                    onChange={(e) => setOutlineData('outline_number', e.target.value)}
                                                    disabled={processingOutline}
                                                    placeholder="1.1.3"
                                                    className="focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                />
                                                <InputError
                                                    message={errorsOutline.outline_number}
                                                    className="mt-2"
                                                />
                                            </div>

                                            {/* Edit Outline Section */}
                                            <div>
                                                <label className='text-sm font-medium text-muted-foreground mb-1'>Edit Outline Description</label>
                                                <textarea
                                                    id="outline_description"
                                                    autoFocus
                                                    tabIndex={2}
                                                    value={dataOutline.outline_description}
                                                    onChange={(e) => setOutlineData('outline_description', e.target.value)}
                                                    disabled={processingOutline}
                                                    className="min-h-[120px] text-sm w-full rounded border p-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 max-h-[20vw]"
                                                    placeholder="Enter new outline description..."
                                                />
                                                <InputError
                                                    message={errorsOutline.outline_description}
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-muted-foreground mb-1 block text-sm font-medium">
                                                    Outline Category
                                                </label>
                                                <select
                                                    className="bg-background focus:border-ring focus:ring-ring w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:outline-none"
                                                    id="parameter_outline_category_id"
                                                    tabIndex={3}
                                                    autoFocus
                                                    value={dataOutline.parameter_outline_category_id}
                                                    onChange={(e) => setOutlineData('parameter_outline_category_id', parseInt(e.target.value))}
                                                    disabled={processingOutline}
                                                >
                                                    <option value="">
                                                        Select Category
                                                    </option>
                                                    {outlineCategory?.map((category) => {
                                                        return (
                                                            <option
                                                                key={category.parameter_outline_category_id}
                                                                value={category.parameter_outline_category_id}
                                                            >
                                                                {category.category_name}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>

                                            <div className="flex cursor-pointer items-center">
                                                <label className="flex gap-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        className="accent-ring"
                                                        checked={dataOutline.container}
                                                        onChange={(e) => setOutlineData('container', e.target.checked)}
                                                    />
                                                    Outline Container
                                                </label>
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
                                                            <p className="text-xs text-gray-500">PDF</p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept=".pdf"
                                                            onChange={(e) => setOutlineData('outline_file', e.target.files[0])}
                                                        />
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex justify-between pt-4">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="destructive" type="button">
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete
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
                                                            <Button
                                                                variant="destructive"
                                                                disabled={processingOutline}
                                                                onClick={() => deleteOutline(outline.parameter_outline_id)}
                                                                // type="submit"
                                                            >
                                                                Delete Permanently
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>

                                                <div className="flex gap-2">
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <Button
                                                        variant="black"
                                                        type="submit"
                                                        onClick={(e) => setOutlineData('parameter_outline_id', outline.parameter_outline_id)}
                                                        disabled={processingOutline}
                                                    >
                                                        Save Changes
                                                    </Button>
                                                </div>
                                            </div>
                                    </form>
                                        </div>
                                </DialogContent>
                            </Dialog>
                        {outline.children && outline.children.length > 0 && (
                            <RecursiveOutlineForForm outlines={outline.children} />
                        )}
                    </li>
                ))}
            </ul>
            {showIframe && (
                <iframe
                    // src={outline.area_files?.file_path}
                    width="100%"
                    height="600"
                    className="mt-4 border rounded"
                ></iframe>
            )}
        </>
    );
}
