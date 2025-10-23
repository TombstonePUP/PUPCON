'use client';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Download } from 'lucide-react';

interface ImportParameterProps {
    program: string;
    area_id: number;
    onClose: () => void;
}

interface ImportParameterForm {
    document?: File | null;
}

export default function ImportParameter({ program, area_id, onClose }: ImportParameterProps) {
    const { data, setData, post, processing, errors, reset } = useForm<ImportParameterForm>({
        document: null,
    });
    const importParameter = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('manage.area.import.parameters', {
                program_name: program,
                area_id: area_id,
            }),
            {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            },
        );
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import Parameter</DialogTitle>
                </DialogHeader>
                <form onSubmit={importParameter} className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <h3 className="text-muted-foreground mb-1 text-sm font-medium">Import CSV</h3>
                        <div className="flex items-center justify-center rounded-2xl border bg-white p-6 shadow-sm">
                            <div className="text-center">
                                <h2 className="mb-2 text-xl font-semibold">CSV Template</h2>
                                <p className="text-muted-foreground mb-4 text-sm">Download the CSV template to import Parameters.</p>
                                <Button>
                                    <a
                                        href={route('manage.area.download.template', {
                                            program_name: program,
                                            area_id: area_id,
                                        })}
                                        className="flex flex-row items-center gap-2"
                                        download
                                    >
                                        <Download className="h-4 w-4" />
                                        Download Template
                                    </a>
                                </Button>
                            </div>
                        </div>
                        <div className="flex w-full items-center justify-center">
                            {!data.document ? (
                                <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
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
                                        <p className="text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PDF</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".csv"
                                        onChange={(e) => {
                                            const file = e.target.files ? e.target.files[0] : null;
                                            setData('document', file);
                                        }}
                                    />
                                </label>
                            ) : (
                                <div className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                                    <span className="text-sm font-semibold text-gray-700">{data.document.name}</span>
                                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setData('document', null)}>
                                        Remove File
                                    </Button>
                                </div>
                            )}
                            <InputError message={errors.document} className="mt-2" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button tabIndex={3} variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="noborder" type="submit" disabled={processing} tabIndex={4}>
                            Submit
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
