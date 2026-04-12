import { DocumentViewer } from '@/components/dialogs/documents/view-document';
import DocumentRequestActions from '@/components/request-table-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Textarea } from '@/components/ui/text-area';
import { type FilesOverview } from '@/types';
import { usePoll } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MessageSquareOff, MessageSquareText } from 'lucide-react';
import { useState } from 'react';

interface DialogProps {
  type: 'approve' | 'reject' | 'revert' | null;
  file: FilesOverview[];
}

interface DocumentRecordProps {
  resolveDialog: ({ type, file }: DialogProps) => void;
}

const getAcronym = (text: string) => {
  const ignore = ['of', 'and', 'the', 'in'];
  return text
    .split(' ')
    .filter(word => !ignore.includes(word.toLowerCase()))
    .map(word => word[0])
    .join('')
    .toUpperCase();
};

export function getRequestsColumns({ resolveDialog }: DocumentRecordProps): ColumnDef<FilesOverview>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="cursor-pointer border-border transition-colors hover:border-muted-foreground data-[state=checked]:border-primary data-[state=checked]:bg-primary"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="mr-4 cursor-pointer border-border transition-colors hover:border-muted-foreground data-[state=checked]:border-primary data-[state=checked]:bg-primary"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'file_type',
      header: ({ column }) => (
        <Button
          className="text-left text-muted-foreground bg-transparent hover:bg-transparent hover:text-foreground p-0 text-sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Benchmark Type
          <ArrowUpDown className="h-4" />
        </Button>
      ),
      cell: ({ row }) => {
        usePoll(5000);
        const filePath = row.original.file_path;
        const pathSegments = filePath.split('/').filter(Boolean);
        let rawSegment = '';

        if (filePath.includes('/files/')) {
          const fileNameWithExt = pathSegments[pathSegments.length - 1];
          rawSegment = fileNameWithExt.split('.').slice(0, -1).join('.');
        } else {
          rawSegment = pathSegments[pathSegments.length - 2];
        }

        const cleanedPath = rawSegment.replace(/_/g, ' ');
        const finalPathName =
          cleanedPath.charAt(0).toUpperCase() + cleanedPath.slice(1);

        const fileType = row.getValue('file_type') as string;
        const cleanedData = fileType.replace(/-/g, ' ');

        let subjectPart = '';
        let segmentPart = '';
        let levelPart = '';

        const regex = /(.*?)\s(Level\s\d)\s(.*)/i;
        const match = cleanedData.match(regex);

        if (match) {
          subjectPart = match[1].trim();
          levelPart = match[2];
          const rawSegmentDetail = match[3];

          if (rawSegmentDetail.includes('Area')) {
            const parts = rawSegmentDetail.split(' ');
            if (rawSegmentDetail.includes('area forms')) {
              segmentPart = parts[0] + ' ' + parts[1];
            } else {
              segmentPart =
                parts[0] + ' ' + parts[1] + ' > ' + parts[2] + ' ' + parts[3];
            }
          } else {
            segmentPart = rawSegmentDetail
              .split(' ')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');
          }
        } else {
          subjectPart = cleanedData;
          segmentPart = 'N/A';
          levelPart = '';
        }

        return (
          <div className="text-left">
            <div className="mb-0 flex items-center justify-between text-sm">
              <div className="font-md mr-2 grow truncate capitalize text-foreground">
                {segmentPart === 'N/A' ? subjectPart : segmentPart}
              </div>
            </div>
            <div
              className={`truncate text-xs text-muted-foreground ${subjectPart === 'exhibits' ? 'hidden' : ''}`}
            >
              {getAcronym(subjectPart)}
            </div>
          </div>
        );
      },
      enableGlobalFilter: true,
    },
    {
      accessorKey: 'outline',
      header: ({ column }) => (
        <Button
          className="text-left text-muted-foreground bg-transparent hover:bg-transparent hover:text-foreground p-0 text-sm"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          <div>Benchmark Name</div>
          <ArrowUpDown className="h-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const [dialogOpen, setDialogOpen] = useState(false);
        const origpath = row.original.file_path ?? '';

        const segments = origpath.split('/');
        const hasNoCategory = segments.includes('no_category');

        const prefix = hasNoCategory
          ? ''
          : (origpath
            .split('/')
            .pop()
            ?.match(/^[A-Za-z0-9](?:\.\d+)+\./)?.[0] ?? '');

        return (
          <>
            <div className="text-left">
              <div
                onClick={() => setDialogOpen(true)}
                className="max-w-sm cursor-pointer truncate text-foreground underline transition-colors hover:text-primary"
              >
                {prefix + ' ' + row.getValue('outline')}
              </div>
            </div>
            <DocumentViewer
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              fileUrl={row.original.file_path}
              title={row.getValue('outline') as string}
            />
          </>
        );
      },
      enableGlobalFilter: true,
    },
    {
      accessorKey: 'file_status',
      header: () => <div className="text-muted-foreground">Status</div>,
      cell: ({ row }) => {
        const status = row.getValue('file_status') as string;

        const variantMap: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
          approved: 'success',
          pending: 'warning',
          'in review': 'warning',
          rejected: 'destructive',
        };

        const variant = variantMap[status?.toLowerCase()] ?? 'secondary';
        const statusText = variant === 'secondary' ? 'Unknown' : status;

        return (
          <div>
            <Badge variant={variant} className="rounded-full px-3 py-0.5 capitalize">
              {statusText}
            </Badge>
          </div>
        );
      },
      enableGlobalFilter: false,
    },
    {
      accessorKey: 'rejection_reason',
      header: () => <div className="text-left text-muted-foreground">Comments</div>,
      cell: ({ row }) => {
        const rejectionReason = row.getValue('rejection_reason') as string | null;

        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="none" disabled={!rejectionReason} className="p-0 text-left">
                {rejectionReason ? (
                  <div className="flex items-center gap-1 rounded-lg border border-border px-3 py-1">
                    <MessageSquareText className="h-4 w-4 text-primary" />
                    <div>view</div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 rounded-lg border border-border px-3 py-1">
                    <MessageSquareOff className="h-4 w-4 text-muted-foreground" />
                    <div>none</div>
                  </div>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-lg font-medium text-foreground">
                  Rejection Comments
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Comments for rejected document
                </DialogDescription>
              </DialogHeader>
              <div>
                <Textarea className="min-h-[100px] text-foreground" disabled autoResize>
                  {rejectionReason}
                </Textarea>
              </div>
              <div className="my-0 rounded-md border border-destructive/20 bg-destructive/10 p-4">
                <p className="text-sm text-destructive">
                  To proceed, please resubmit or re-upload the document after making
                  the necessary adjustments.
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" tabIndex={1}>
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      },
      enableGlobalFilter: true,
    },
    {
      accessorKey: 'uploaded_by',
      header: () => <div className="text-left text-muted-foreground">Uploaded By</div>,
      cell: ({ row }) => (
        <div className="text-left text-foreground">{row.getValue('uploaded_by')}</div>
      ),
      enableGlobalFilter: true,
    },
    {
      accessorKey: 'uploaded_at',
      header: ({ column }) => (
        <div>
          <Button
            className="text-left text-muted-foreground bg-transparent hover:bg-transparent hover:text-foreground p-0 text-sm"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date Uploaded
            <ArrowUpDown className="h-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const uploadedAt = new Date(row.getValue('uploaded_at') as string);
        const formattedDate = uploadedAt.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        return <div className="text-left">{formattedDate}</div>;
      },
      enableGlobalFilter: false,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DocumentRequestActions file={[row.original]} resolveDialog={resolveDialog} />
        </div>
      ),
    },
  ];
}