import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AreaFormCategory, AreaForms, Program } from '@/types';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, CircleDashed, DownloadIcon, Edit, FileUp, FileX, Info, MoreVertical, Plus, Trash2, XCircle } from 'lucide-react';

interface AreaFormDialogParams {
    type: 'view' | 'upload' | 'add' | 'delete-form' | 'delete' | 'rejected';
    form?: AreaForms;
    forms?: AreaForms[];
}

type AreaCardsProps = {
    program: Program;
    area_id: number;
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

export default function AreaCards({ program, area_id, forms, resolveFormDialog }: AreaCardsProps) {
    const { auth } = usePage().props;
    const role = auth.user.roles.role_name;
    const download = (form: AreaForms) => {
        const url = route('manage.area.download.area.form.file', {
            program_name: program.program_link,
            level_id: program.levels[0]?.accreditation_level_id,
            area_id: area_id,
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
            {forms.map((card) => (
                <div
                    key={card.area_form_id}
                    className="group bg-card relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg border p-6 transition-all duration-300"
                    onClick={() => resolveFormDialog({ type: 'view', form: card })}
                >
                    <div className="flex flex-grow items-center gap-4 overflow-hidden">
                        <StatusIcon form={card} />
                        <h1 className="text-card-foreground flex-grow truncate text-base font-semibold">
                            {(card.area_form_category as AreaFormCategory | undefined)?.category_name}
                        </h1>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 rounded-full p-0 hover:bg-gray-200">
                                <MoreVertical className="inline-block h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuLabel>Document</DropdownMenuLabel>
                            <DropdownMenuItem
                                className="justify-left flex cursor-pointer flex-row items-center gap-3"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    resolveFormDialog({ type: 'upload', form: card });
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
                            {card.file_name && (
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
                            {card.file_status?.status_name === 'Rejected' && (
                                <DropdownMenuItem
                                    className="justify-left flex cursor-pointer flex-row items-center gap-3"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resolveFormDialog({ type: 'rejected', form: card });
                                    }}
                                >
                                    <Info className="inline-block h-4 w-4" />
                                    Comments
                                </DropdownMenuItem>
                            )}
                            {card.file_path && (
                                <DropdownMenuItem
                                    variant="destructive"
                                    className="justify-left flex cursor-pointer flex-row items-center gap-3"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resolveFormDialog({ type: 'delete', form: card });
                                    }}
                                >
                                    <FileX className="inline-block h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            )}
                            {(role === 'Admin' || role === 'Coordinator') && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>Form</DropdownMenuLabel>

                                    <DropdownMenuItem
                                        variant="destructive"
                                        className="justify-left flex cursor-pointer flex-row items-center gap-3"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            resolveFormDialog({ type: 'delete-form', form: card });
                                        }}
                                    >
                                        <Trash2 className="inline-block h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* --- Overlay --- */}
                    {/* <div className="bg-background/70 absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-lg opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                        {card.file_name && (
                            <>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="bg-background/90 h-9 w-9 rounded-full"
                                    onClick={() => resolveFormDialog({ type: 'view', form: card })}
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="bg-background/90 h-9 w-9 rounded-full"
                                    onClick={() => download(card)}
                                >
                                    <DownloadIcon className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                        <Button
                            variant="outline"
                            size="icon"
                            className="bg-background/90 h-9 w-9 rounded-full"
                            onClick={() => resolveFormDialog({ type: 'upload', form: card })}
                        >
                            {card.file_name ? <Edit className="h-4 w-4" /> : <FileUp className="h-4 w-4" />}
                        </Button>
                        {card.file_name && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="bg-background/90 h-9 w-9 rounded-full"
                                onClick={() => resolveFormDialog({ type: 'delete', form: card })}
                            >
                                <FileX className="text-destructive h-4 w-4" />
                            </Button>
                        )}
                        {(role === 'Admin' || role === 'Coordinator') && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="bg-background/90 h-9 w-9 rounded-full"
                                onClick={() => resolveFormDialog({ type: 'delete-form', form: card })}
                            >
                                <Trash2 className="text-destructive h-4 w-4" />
                            </Button>
                        )}
                        {card.file_status?.status_name === 'Rejected' && (
                            <Button
                                variant="outline"
                                size="icon"
                                className="bg-background/90 h-9 w-9 rounded-full"
                                onClick={() => resolveFormDialog({ type: 'rejected', form: card })}
                            >
                                <Info className="text-destructive h-4 w-4" />
                            </Button>
                        )}
                    </div> */}
                </div>
            ))}

            {forms.length < 3 &&
                (role === 'Admin' || role === 'Coordinator') &&
                program.levels[0]?.is_active &&
                program.levels[0]?.remarks === 'Ongoing Survey' && (
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
