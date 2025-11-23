import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PerProgramUnderSurvey } from '@/types';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

interface EndSurveyDialogProps {
    programs: PerProgramUnderSurvey[];
    onClose: () => void;
}

interface EndSurveyForm {
    program_name: string;
    accreditation_level_id: number;
    remarks: string;
    is_active: boolean;
}

export default function EndSurveyDialog({ programs, onClose }: EndSurveyDialogProps) {
    const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
    const selectedProgram = programs.find((p) => p.program_id === selectedProgramId);
    const level = selectedProgram?.levels[0]?.level;
    const { data, setData, patch, processing, errors } = useForm<EndSurveyForm>({
        program_name: '',
        accreditation_level_id: 0,
        remarks: '',
        is_active: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('manage.level.update', { program_id: selectedProgram?.program_id}), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium text-gray-900">End a Program Survey</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">Select a program to end its current survey.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <Label className="mb-2 block text-sm font-medium text-gray-700">Programs Under Survey</Label>
                        <Select
                            value={selectedProgramId ? String(selectedProgramId) : ''}
                            onValueChange={(value) => {
                                const programId = Number(value);
                                setSelectedProgramId(programId);

                                // Get the program immediately
                                const program = programs.find((p) => p.program_id === programId);
                                console.log(program);

                                setData({
                                    ...data,
                                    program_name: program?.program_name ?? '',
                                    accreditation_level_id: program?.levels[0]?.accreditation_level_id ?? 0,
                                });
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a program" />
                            </SelectTrigger>
                            <SelectContent>
                                {programs.map((program) => (
                                    <SelectItem value={String(program.program_id)}>{program.program_name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.program_name} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="mb-2 block text-sm font-medium text-gray-700">Current Status</Label>
                            <div className="flex h-10 w-full items-center rounded-md border border-gray-200 bg-gray-50 px-3">
                                <Input
                                    disabled
                                    value={level == null ? 'No Level' : level === 0 ? 'Preliminary Survey' : `Level ${level}`}
                                    className="border-0 bg-transparent p-0 focus:ring-0"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="mb-2 block text-sm font-medium text-gray-700">New Level</Label>
                            <Select value={data.remarks} onValueChange={(value) => setData('remarks', value)} disabled={processing}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Remarks" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pass">Pass</SelectItem>
                                    <SelectItem value="Fail">Fail</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <InputError message={errors.remarks} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={onClose} disabled={processing}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="noborder" type="submit" disabled={processing}>
                            Submit
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
