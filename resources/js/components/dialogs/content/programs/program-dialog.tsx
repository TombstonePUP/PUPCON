import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PerProgramUnderSurvey } from '@/types';
import { useForm } from '@inertiajs/react';
import { Check } from 'lucide-react';

interface ProgramDialogProps {
    program?: PerProgramUnderSurvey;
    type?: 'add' | 'edit' | 'delete';
    onClose: () => void;
    programs?: PerProgramUnderSurvey[];
}

interface ProgramForm {
    program_id?: number;
    degree_type: string;
    program_name: string;
    color: string;
}

export default function ProgramDialog({ ...props }: ProgramDialogProps) {
    const { program, type, onClose, programs } = props;
    console.log('ProgramDialog props:', program);

    const { data, setData, post, patch, processing, errors } = useForm<ProgramForm>({
        program_id: program?.program_id || null,
        degree_type: program?.degree_type || '',
        program_name: program?.program_name || '',
        color: program?.color || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (type === 'edit') {
            patch(route('manage.program.update', { program_id: data.program_id }), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route('manage.program.store'), {
                onSuccess: () => onClose(),
            });
        }
    };

    const colors = [
        'red',
        'orange',
        'amber',
        'yellow',
        'lime',
        'green',
        'emerald',
        'teal',
        'cyan',
        'sky',
        'blue',
        'indigo',
        'violet',
        'purple',
        'fuchsia',
        'pink',
        'rose',
        'slate',
        'gray',
        'zinc',
        'neutral',
        'stone',
    ];

    const availableColors = colors.filter((color) => {
        const isColorTaken = programs?.some((p) => p.color === color && p.program_id !== program?.program_id);
        return !isColorTaken;
    });

    const colorClasses: Record<string, string> = {
        red: 'bg-red-500',
        orange: 'bg-orange-500',
        amber: 'bg-amber-500',
        yellow: 'bg-yellow-500',
        lime: 'bg-lime-500',
        green: 'bg-green-500',
        emerald: 'bg-emerald-500',
        teal: 'bg-teal-500',
        cyan: 'bg-cyan-500',
        sky: 'bg-sky-500',
        blue: 'bg-blue-500',
        indigo: 'bg-indigo-500',
        violet: 'bg-violet-500',
        purple: 'bg-purple-500',
        fuchsia: 'bg-fuchsia-500',
        pink: 'bg-pink-500',
        rose: 'bg-rose-500',
        slate: 'bg-slate-500',
        gray: 'bg-gray-500',
        zinc: 'bg-zinc-500',
        neutral: 'bg-neutral-500',
        stone: 'bg-stone-500',
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium text-foreground">{type === 'edit' ? 'Edit Program' : 'Add New Program'}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {type === 'edit' ? 'Make changes to the program details below.' : 'Fill out the details below to add a new program.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                    <div className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <Label className="mb-2 block text-sm font-medium text-foreground">
                                Degree Type <span className="text-red-500">*</span>
                            </Label>
                            <Select value={data.degree_type} onValueChange={(value) => setData('degree_type', value)} disabled={processing}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select degree type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Bachelor of Science">Bachelor of Science</SelectItem>
                                    <SelectItem value="Bachelor of Secondary Education">Bachelor of Secondary Education</SelectItem>
                                    <SelectItem value="Diploma">Diploma</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.degree_type} />
                        </div>
                        <div className="space-y-2">
                            <Label className="mb-2 block text-sm font-medium text-foreground">
                                Program Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                className="w-full"
                                placeholder="e.g., Computer Science, Business Administration"
                                value={data.program_name}
                                onChange={(e) => setData('program_name', e.target.value)}
                                autoFocus
                                disabled={processing}
                            />
                            <InputError message={errors.program_name} />
                        </div>
                        <div className="space-y-2">
                            <Label className="mb-2 block text-sm font-medium text-foreground">
                                Color <span className="text-red-500">*</span>
                            </Label>
                            <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
                                {availableColors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setData('color', color)}
                                        disabled={processing}
                                        className={`relative h-10 w-10 rounded-lg transition-all hover:scale-110 focus:ring-2 focus:ring-[#7f1414] focus:ring-offset-2 focus:outline-none ${
                                            colorClasses[color]
                                        } ${data.color === color ? 'ring-2 ring-[#7f1414] ring-offset-2' : ''}`}
                                        title={color.charAt(0).toUpperCase() + color.slice(1)}
                                    >
                                        {data.color === color && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Check className="h-5 w-5 text-white drop-shadow-md" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            {data.color && (
                                <p className="text-xs text-gray-500">
                                    Selected: <span className="font-medium capitalize">{data.color}</span>
                                </p>
                            )}
                            <InputError message={errors.color} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="noborder" type="submit" disabled={processing}>
                            {type === 'edit' ? 'Save Changes' : 'Add Program'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
