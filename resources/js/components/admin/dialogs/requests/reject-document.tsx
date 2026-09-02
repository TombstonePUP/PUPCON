import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/text-area';
import { FilesOverview } from '@/types';
import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

interface FileForm {
    file_id: number;
    file_type: string;
    rejection_reason?: string;
}

interface DocumentRequestForm {
    file: FileForm[];
}

interface RejectRequestProps {
    file: FilesOverview[];
    onClose: () => void;
}

export default function RejectRequest({ file, onClose }: RejectRequestProps) {
    const [rejectionComment, setRejectionComment] = React.useState('');
    const { setData, post, processing, reset } = useForm<DocumentRequestForm>({
        file: [],
    });

    useEffect(() => {
        setData(
            'file',
            file.map((f) => ({
                file_id: f.file_id,
                file_type: f.file_type,
                rejection_reason: rejectionComment,
            })),
        );
    }, [file, rejectionComment, setData]);

    const rejectDocument = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('rejectDocument'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const rawFileType = file.length! > 0 ? file[0].file_type : '';
    const rawOutline = file.length! > 0 ? file[0].outline : '';

    const isAreaType = rawFileType.startsWith('area');

    let formattedAreaName;

    if (!isAreaType) {
        const areaParameterPart = rawFileType.replace(/Area-(\d+)-Parameter-([A-Z])/, 'Area $1 - Parameter $2');

        formattedAreaName = `${areaParameterPart}: ${rawOutline}`;
    } else if (isAreaType) {
        const parts = rawOutline.split('-');
        const reportName = parts.pop();
        const rawTopic = parts.join('-');
        const formattedTopic = rawTopic
            .replace(/-/g, ' ')
            .toLowerCase()
            .split(' ')
            .map((word) => {
                if (['and', 'or', 'of', 'a', 'the', 'in', 'for', 'with'].includes(word) && word !== rawTopic.toLowerCase().split(' ')[0]) {
                    return word;
                }
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(' ');

        formattedAreaName = `${reportName}: ${formattedTopic}`;
    } else {
        formattedAreaName = 'Uncategorized';
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-foreground text-lg font-medium">Reject Document</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        {file.length === 0 ? formattedAreaName : 'Comments for Rejecting Files'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={rejectDocument}>
                    <div className="mb-2">
                        <Label className="text-foreground mb-2 block text-sm font-medium">Rejection Comments</Label>
                        <Textarea
                            autoResize
                            id="rejection_reason"
                            required
                            autoFocus
                            tabIndex={1}
                            value={rejectionComment}
                            onChange={(e) => setRejectionComment(e.target.value)}
                            rows={4}
                            disabled={processing}
                            placeholder="Enter comments here..."
                            className=""
                        />
                        <InputError className="mt-2" />
                    </div>
                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button tabIndex={3} variant="outline" onClick={onClose} disabled={processing}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button tabIndex={4} variant={'noborder'} disabled={processing}>
                            Reject
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
