import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { Eye, Save } from 'lucide-react';
import React from 'react';

interface SectionFooterProps {
    onSave: () => void;
    onPreview: () => void;
    previewDescription?: string;
    previewUrl?: string;
}

const SectionFooter: React.FC<SectionFooterProps> = ({
    onSave,
    onPreview,
    previewDescription = 'Easily view your changes on the site.',
    previewUrl,
}) => {
    return (
        <div className="rounded-b-lg border-t border-gray-200 bg-gray-50 px-8 py-4">
            <div className="flex items-center justify-end gap-3">
                {onPreview && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                                <Eye className="h-4 w-4 text-gray-600" />
                                View
                            </Button>
                        </DialogTrigger>



                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-lg font-medium text-foreground">View Content</DialogTitle>
                                <DialogDescription className="text-sm text-muted-foreground">
                                    {previewDescription}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="my-0 rounded-md border border-yellow-100 bg-yellow-50 p-4">
                                <p className="text-sm text-yellow-800">
                                    <span className="mb-1 block font-semibold text-yellow-900">Note: Redirecting page!</span>
                                   This will open a new tab and take you to the section you edited.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3">
                                <DialogClose asChild>
                                    <Button className="cursor-pointer rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <DialogClose asChild>
                                    <Button
                                        onClick={() => {
                                            if (previewUrl) window.open(previewUrl, '_blank');
                                            else onPreview();
                                        }}
                                        className="cursor-pointer rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                                    >
                                        Continue to Page
                                    </Button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                <Button
                    onClick={onSave}
                    className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                >
                    <Save className="h-4 w-4" />
                    Save
                </Button>
            </div>
        </div>
    );
};

export default SectionFooter;
