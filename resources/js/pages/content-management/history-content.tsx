import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Eye, Pencil, Save } from 'lucide-react';
import React from 'react';



const HistoryContentSection: React.FC = () => {
    return (
        <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Section Page Title</h2>
                    <p className="text-sm text-gray-600">Configure content</p>
                </div>

                <div className="mb-10 grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                        <Input type="text" placeholder="Enter welcome title..." />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Subtitle</label>
                        <Input type="text" placeholder="Enter welcome subtitle..." />
                    </div>
                </div>
            </div>

            <div className="rounded-b-lg border-t border-gray-200 bg-gray-50 px-8 py-4">
                <div className="flex items-center justify-between">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                                <Eye className="h-4 w-4 text-gray-600" />
                                Preview
                            </button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Preview Content</DialogTitle>
                                <DialogDescription className="my-2 leading-relaxed">
                                    Clicking <strong>Preview</strong> will open a new tab in guest view so you can see how your changes look publicly.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex justify-end gap-3">
                                <DialogClose asChild>
                                    <button className="cursor-pointer rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                                        Cancel
                                    </button>
                                </DialogClose>

                                <button
                                    onClick={() => window.open('/about/vision-mission-goals', '_blank')}
                                    className="cursor-pointer rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#6b1010]"
                                >
                                    Continue to Preview
                                </button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <div className="flex gap-3">
                        <button className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100">
                            <Pencil className="h-4 w-4 text-gray-600" />
                            Edit
                        </button>

                        <button className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#6b1010]">
                            <Save className="h-4 w-4" />
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryContentSection;
