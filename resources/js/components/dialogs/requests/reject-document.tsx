import React from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/text-area';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import { FilesOverview } from '@/types';

interface DocumentRequestForm {
    file_id: number;
    file_type: string;
    rejection_reason?: string;
}

interface RejectRequestProps {
    file: FilesOverview;
    onClose: () => void;
}

export default function RejectRequest({ file, onClose }: RejectRequestProps) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm<DocumentRequestForm>({
        file_id: file.file_id,
        file_type: file.file_type,
        rejection_reason: null,
    });

    const rejectDocument = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('rejectDocument', [data.file_id]), {
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    const rawFileType = file.file_type;
    const rawOutline = file.outline;

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
                    <DialogTitle className="text-lg font-medium text-gray-900">Reject Document</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">{formattedAreaName}</DialogDescription>
                </DialogHeader>
                <form onSubmit={rejectDocument}>
                    <div className="mb-2">
                        <Label className="mb-2 block text-sm font-medium text-gray-700">Rejection Comments</Label>
                        <Textarea
                            autoResize
                            id="rejection_reason"
                            required
                            autoFocus
                            tabIndex={1}
                            value={data.rejection_reason}
                            onChange={(e) => setData('rejection_reason', e.target.value)}
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
