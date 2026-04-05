import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FilesOverview } from '@/types';
import { useForm } from '@inertiajs/react';
import { MoreVertical } from 'lucide-react';
import { useEffect } from 'react';

interface DialogProps {
  type: 'approve' | 'reject' | 'revert' | null;
  file: FilesOverview | FilesOverview[];
}

interface DocumentRequestActionsProps {
  file: FilesOverview | FilesOverview[];
  resolveDialog: ({ type, file }: DialogProps) => void;
}

interface FileForm {
  file_id: number;
  file_type: string;
  rejection_reason?: string;
}

interface DocumentRequestForm {
  file: FileForm[];
}

export default function DocumentRequestActions({ file, resolveDialog }: DocumentRequestActionsProps) {
  const files = Array.isArray(file) ? file : [file];
  const canApprove = files.some((f) => f.file_status !== 'Approved');
  const canRevert = files.some((f) => f.file_status !== 'Pending');
  const canReject = files.some((f) => f.file_status !== 'Rejected');

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={files.length > 1 ? 'outline' : 'ghost'}
            className="border-0 p-1 data-[state=open]:bg-transparent h-8 w-8 ms-auto"
            size="icon"
            disabled={!canApprove && !canRevert && !canReject}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          {canApprove && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                // e.stopPropagation();
                // approveDocument(e);
                setTimeout(() => resolveDialog?.({ type: 'approve', file: files }), 50);
              }}
            >
              Approve
            </DropdownMenuItem>
          )}
          {canRevert && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setTimeout(() => resolveDialog?.({ type: 'revert', file: files }), 50);
              }}
            >
              Revert
            </DropdownMenuItem>
          )}
          {canReject && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setTimeout(() => resolveDialog?.({ type: 'reject', file: files }), 50);
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
