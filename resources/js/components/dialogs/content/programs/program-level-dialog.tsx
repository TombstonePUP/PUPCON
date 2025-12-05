import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PerProgramUnderSurvey } from '@/types';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface ProgramLevelDialogProps {
    programs: PerProgramUnderSurvey[];
    onClose: () => void;
    selected_program_id?: number;
}

interface ProgramLevelForm {
    program_id: number;
    program_name?: string;
    new_level: string;
}

export default function ProgramLevelDialog({ programs, onClose, selected_program_id }: ProgramLevelDialogProps) {
    const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
    const selectedProgram = programs.find((p) => p.program_id === selectedProgramId);
    const level = selectedProgram?.latest_level?.level;
    const { data, setData, post, reset, processing, errors } = useForm<ProgramLevelForm>({
        program_name: '',
    });

    useEffect(() => {
        setSelectedProgramId(selected_program_id ?? null);
    }, [selected_program_id]);

    useEffect(() => {
        if (selectedProgramId) {
            const program = programs.find((p) => p.program_id === selectedProgramId);
            setData('program_name', program?.program_name ?? '');
        }
    }, [selectedProgramId, programs, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('manage.level.store', { program_id: selectedProgram?.program_id }), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };
    console.log(programs);

    const programList = programs.filter((p) => !p.under_survey && p.is_active && ((p.latest_level?.level ?? -1) < 4 || p.latest_level?.remarks === 'Passed'));

    /* const newLevels = [
        { value: '0', label: 'Preliminary' },
        { value: '1', label: 'Level 1' },
        { value: '2', label: 'Level 2' },
        { value: '3', label: 'Level 3' },
        { value: '4', label: 'Level 4' },
    ].filter((l) => Number(l.value) >= (level ?? 0)); */

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium text-gray-900">Start a survey</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">Start a new accreditation level for an existing program.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <Label className="mb-2 block text-sm font-medium text-gray-700">Program</Label>
                        <Select
                            value={selectedProgramId ? String(selectedProgramId) : ''}
                            onValueChange={(value) => {
                                const programId = Number(value);
                                setSelectedProgramId(programId);
                                const program = programs.find((p) => p.program_id === programId);
                                setData('program_name', program?.program_name);
                            }}
                            disabled={processing}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a program" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* {programList.map((program) => (
                                    <SelectItem value={String(program.program_id)}>
                                        {program.degree_type.match(/\b[A-Z]/g)}
                                        { }
                                        {' in '}
                                        {program.program_name}
                                    </SelectItem>
                                ))} */}
                                
                                  {programList.length > 0 ? (
                                    programList.map((program) => (
                                        <SelectItem
                                            key={program.program_id}
                                            value={String(program.program_id)}
                                        >
                                            {program.degree_type.match(/\b[A-Z]/g)?.join('')}
                                            {' in '}
                                            {program.program_name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value='' disabled>No programs available</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.program_name} />
                    </div>
                    {/* <div className="grid grid-cols-2 gap-4">
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
                            <Select value={data.new_level} onValueChange={(value) => setData('new_level', value)} disabled={processing}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {newLevels.map((lvl) => (
                                        <SelectItem key={lvl.value} value={lvl.value}>
                                            {lvl.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <InputError message={errors.new_level} />
                    </div> */}
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
