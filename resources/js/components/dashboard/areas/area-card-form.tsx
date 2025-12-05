import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AreaFormCategory, AreaForms, Program, ProgramAreas } from '@/types';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, CircleDashed, DownloadIcon, Edit, FileUp, FileX, Info, MoreVertical, Plus, Trash2, XCircle } from 'lucide-react';

interface AreaFormDialogParams {
    type: 'view' | 'upload' | 'add' | 'delete-form' | 'delete' | 'rejected';
    form?: AreaForms;
    forms?: AreaForms[];
}

type AreaCardsProps = {
    program: Program;
    area: ProgramAreas;
    forms: AreaForms[];
    resolveFormDialog: (params: AreaFormDialogParams) => void;
};

function StatusIcon({ form }: { form: AreaForms }) {
    const status = form.file_status?.status_name;

    if (!form.file_name) {
        return <CircleDashed className="text-muted-foreground/60 h-8 w-8 flex-shrink-0" />;
    }
    if (status === 'Rejected') {
        return <XCircle className="text-destructive h-8 w-8 flex-shrink-0" />;
    }
    if (status === 'Approved') {
        return <CheckCircle2 className="h-8 w-8 flex-shrink-0 text-green-600" />;
    }
    return <CheckCircle2 className="h-8 w-8 flex-shrink-0 text-blue-600" />;
}

export default function AreaCards({ program, area, forms, resolveFormDialog }: AreaCardsProps) {
    const { auth } = usePage().props;
    const role = auth.user.roles.role_name;
    const download = (form: AreaForms) => {
        const url = route('manage.area.download.area.form.file', {
            program_id: program.program_id,
            level_id: program.levels[0]?.accreditation_level_id,
            area_id: area.area_id,
            form_id: form.area_form_id,
        });

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {forms.map((card) => {
                const canUploadOrUpdate = !area.archive;
                const canDownload = !!card.file_name;
                const canComment = card.file_status?.status_name === 'Rejected' && !area.archive;
                const canDeleteFile = !!card.file_path && !area.archive;
                const canDeleteForm = (role === 'Admin' || role === 'Coordinator') && !area.archive;
                return (
                    <div
                        key={card.area_form_id}
                        className="group bg-card relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg border p-6 transition-all duration-300 hover:border-red-800"
                        onClick={() => resolveFormDialog({ type: 'view', form: card })}
                    >
                        <div className="flex flex-grow items-center gap-6 overflow-hidden">
                            <div className="rounded-lg bg-gray-100 p-2">
                                <StatusIcon form={card} />
                            </div>
                            <div>
                                <h1 className="text-card-foreground flex-grow truncate text-base font-semibold">
                                    {(card.area_form_category as AreaFormCategory | undefined)?.category_name}
                                </h1>
                                <h1 className="font-base flex-grow truncate text-sm text-gray-700">Area form</h1>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 rounded-full p-0 hover:bg-gray-200">
                                    <MoreVertical className="inline-block h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuLabel>Document</DropdownMenuLabel>
                                {canUploadOrUpdate && (
                                    <DropdownMenuItem
                                        className="justify-left flex cursor-pointer flex-row items-center gap-3"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setTimeout(() => resolveFormDialog({ type: 'upload', form: card }), 50);
                                        }}
                                    >
                                        {card.file_path ? (
                                            <>
                                                <Edit className="inline-block h-4 w-4" />
                                                Update
                                            </>
                                        ) : (
                                            <>
                                                <FileUp className="inline-block h-4 w-4" />
                                                Upload
                                            </>
                                        )}
                                    </DropdownMenuItem>
                                )}
                                {canDownload && (
                                    <DropdownMenuItem
                                        className="justify-left flex cursor-pointer flex-row items-center gap-3"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            download(card);
                                        }}
                                    >
                                        <DownloadIcon className="inline-block h-4 w-4" />
                                        Download
                                    </DropdownMenuItem>
                                )}
                                {card.file_status?.status_name === 'Rejected' && !area.archive && (
                                    <DropdownMenuItem
                                        className="justify-left flex cursor-pointer flex-row items-center gap-3"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setTimeout(() => resolveFormDialog({ type: 'rejected', form: card }), 50);
                                        }}
                                    >
                                        <Info className="inline-block h-4 w-4" />
                                        Comments
                                    </DropdownMenuItem>
                                )}
                                {canDeleteFile && (
                                    <DropdownMenuItem
                                        variant="destructive"
                                        className="justify-left flex cursor-pointer flex-row items-center gap-3"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setTimeout(() => resolveFormDialog({ type: 'delete', form: card }), 50);
                                        }}
                                    >
                                        <FileX className="inline-block h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                )}
                                {canDeleteForm && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>Form</DropdownMenuLabel>

                                        <DropdownMenuItem
                                            variant="destructive"
                                            className="justify-left flex cursor-pointer flex-row items-center gap-3"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setTimeout(() => resolveFormDialog({ type: 'delete-form', form: card }), 50);
                                            }}
                                        >
                                            <Trash2 className="inline-block h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            })}

            {forms.length < 3 &&
                (role === 'Admin' || role === 'Coordinator') &&
                program.levels[0]?.is_active &&
                program.levels[0]?.remarks === 'Ongoing Survey' &&
                !area.archive && (
                    <Button
                        variant="outline"
                        className="border-muted-foreground/40 bg-card text-muted-foreground/80 hover:border-muted-foreground/80 hover:bg-muted/50 hover:text-muted-foreground flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 transition-colors"
                        onClick={() => resolveFormDialog({ type: 'add' })}
                    >
                        <Plus className="h-8 w-8" />
                        <p className="text-sm font-medium">Add Form</p>
                    </Button>
                )}
        </div>
    );
}
