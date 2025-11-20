import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/text-area';
import { CampusGoals } from '@/types/content';
import { useState } from 'react';

interface CampusGoalDialogProps {
    type?: 'edit' | 'add';
    goal?: CampusGoals | null;
    onClose: () => void;
    onSave: (goal: CampusGoals) => void;
}

export default function CampusGoalDialog({ ...props }: CampusGoalDialogProps) {
    const { type, goal, onClose, onSave } = props;
    const [data, setData] = useState<CampusGoals>({
        goal_id: goal?.goal_id || Date.now(),
        goal_title_eng: goal?.goal_title_eng || '',
        goal_desc_eng: goal?.goal_desc_eng || '',
        goal_title_fil: goal?.goal_title_fil || '',
        goal_desc_fil: goal?.goal_desc_fil || '',
    });

    const handleSubmit = () => {
        onSave(data);
        onClose();
    };

    return (
        <>
            <Dialog open={true} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-medium text-gray-900">
                            {type === 'edit' ? 'Edit Campus Goal' : 'Add Campus Goal'}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">
                            {type === 'edit'
                                ? 'Make changes to the campus goal details below.'
                                : 'Fill out the details below to add a new campus goal.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6 grid max-h-[70vh] grid-cols-1 gap-6 overflow-y-auto pr-2 md:grid-cols-2">
                        <div className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Title (English)</label>
                                <Input
                                    placeholder="e.g., Academic Excellence"
                                    value={data.goal_title_eng}
                                    onChange={(e) => setData({ ...data, goal_title_eng: e.target.value })}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Description (English)</label>
                                <Textarea
                                    placeholder="Enter English description..."
                                    value={data.goal_desc_eng}
                                    onChange={(e) => setData({ ...data, goal_desc_eng: e.target.value })}
                                    autoResize
                                    minHeight={150}
                                    maxHeight={300}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Title (Filipino)</label>
                                <Input
                                    placeholder="e.g., Kahusayang Pang-Akademiko"
                                    value={data.goal_title_fil}
                                    onChange={(e) => setData({ ...data, goal_title_fil: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Description (Filipino)</label>
                                <Textarea
                                    placeholder="Enter Filipino description..."
                                    value={data.goal_desc_fil}
                                    onChange={(e) => setData({ ...data, goal_desc_fil: e.target.value })}
                                    autoResize
                                    minHeight={150}
                                    maxHeight={300}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-6 flex justify-end space-x-2">
                        <DialogClose asChild>
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="noborder" onClick={handleSubmit}>
                            {type === 'edit' ? 'Save Changes' : 'Add Campus Goal'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
