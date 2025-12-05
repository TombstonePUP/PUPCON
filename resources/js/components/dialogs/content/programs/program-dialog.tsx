import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PerProgramUnderSurvey } from "@/types";
import { useForm } from "@inertiajs/react";
import InputError from "@/components/input-error";

interface ProgramDialogProps {
    program?: PerProgramUnderSurvey;
    type?: "add" | "edit" | "delete";
    onClose: () => void;
}

interface ProgramForm {
    program_id?: number;
    degree_type: string;
    program_name: string;
}

export default function ProgramDialog({ ...props }: ProgramDialogProps) {
    const { program, type, onClose } = props;

    const { data, setData, post, patch, processing, errors } = useForm<ProgramForm>({
        program_id: program?.program_id || null,
        degree_type: program?.degree_type || "",
        program_name: program?.program_name || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (type === "edit") {
            patch(route('manage.program.update', { program_id: data.program_id }), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route('manage.program.store'), {
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-lg font-medium text-gray-900">{type === "edit" ? "Edit Program" : "Add New Program"}</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                        {type === "edit"
                            ? "Make changes to the program details below."
                            : "Fill out the details below to add a new program."}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <Label className="mb-2 block text-sm font-medium text-gray-700">Degree Type <span className="text-red-500">*</span></Label>
                        <Select
                            value={data.degree_type}
                            onValueChange={(value) => setData("degree_type", value)}
                            disabled={processing}
                        >
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
                        <Label className="mb-2 block text-sm font-medium text-gray-700">Program Name <span className="text-red-500">*</span></Label>
                        <Input
                            type="text"
                            className="w-full"
                            placeholder="e.g., Computer Science, Business Administration"
                            value={data.program_name}
                            onChange={(e) => setData("program_name", e.target.value)}
                            autoFocus
                            disabled={processing}
                        />
                        <InputError message={errors.program_name} />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button variant="noborder" onClick={handleSubmit} disabled={processing}>
                        {type === "edit" ? "Save Changes" : "Add Program"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
