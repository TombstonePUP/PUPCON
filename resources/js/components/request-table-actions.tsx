import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FilesOverview } from '@/types';
import { useForm } from '@inertiajs/react';
import { MoreVertical } from 'lucide-react';

interface DialogProps {
    type: 'aprove' | 'reject' | 'revert' | null;
    file: FilesOverview;
}

interface DocumentRequestActionsProps {
    file: FilesOverview;
    resolveDialog: ({ type, file }: DialogProps) => void;
}

export default function DocumentRequestActions({ file, resolveDialog }: DocumentRequestActionsProps) {
    const { data, setData, post, processing, errors, reset } = useForm<DocumentRequestForm>({
        file_id: file.file_id,
        file_type: file.file_type,
    });

    const approveDocument = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('approveDocument', [data.file_id]), {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="data-[state=open]:bg-muted text-muted-foreground flex size-8" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    {file.file_status !== 'Approved' && (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                approveDocument(e);
                            }}
                        >
                            Approve
                        </DropdownMenuItem>
                    )}
                    {file.file_status !== 'Pending' && (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                                setTimeout(() => resolveDialog({ type: 'revert', file: file }), 50);
                            }}
                        >
                            Revert
                        </DropdownMenuItem>
                    )}
                    {file.file_status !== 'Rejected' && (
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                                setTimeout(() => resolveDialog({ type: 'reject', file: file }), 50);
                            }}
                            variant="destructive"
                        >
                            Reject
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
