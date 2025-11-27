import ExhibitOutlineDialogRenderer from '@/components/dialogs/exhibits/outline/exhibit-outline-dialog-renderer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { ExhibitOutlines, Exhibits } from '@/types/exhibits';
import { EditIcon, Eye, FolderOpen, Plus, Trash2Icon, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ExhibitContainerDialogProps {
    exhibit: Exhibits;
    onClose: () => void;
}

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

export default function ExhibitContainerDialog({ exhibit, onClose }: ExhibitContainerDialogProps) {
    const [outlines, setOutlines] = useState<ExhibitOutlines[]>(exhibit.exhibit_outlines || []);
    const [category, setCategory] = useState<string[]>(() => Array.from(new Set(outlines.map((outline) => outline.category))));
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const filteredOutlines: ExhibitOutlines[] = selectedCategory ? outlines.filter((outline) => outline.category === selectedCategory) : [];

    const [dialog, setDialog] = useState<{
        type: 'outline' | null;
        action: 'add' | 'edit' | 'delete' | 'view' | null;
        outline?: ExhibitOutlines | null;
    }>({ type: null, action: null });

    const openDialog = (type: 'outline', action: 'add' | 'edit' | 'delete' | 'view', outline?: ExhibitOutlines | null) => {
        setDialog({ type, action, outline });
    };

    const closeDialog = () => {
        setDialog({ type: null, action: null, outline: null });
    };

    useEffect(() => {
        setOutlines(exhibit.exhibit_outlines || []);
        setCategory(Array.from(new Set((exhibit.exhibit_outlines || []).map((outline) => outline.category))));
    }, [exhibit.exhibit_outlines]);

    return (
        <>
            <Dialog open={true} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-5xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-medium text-gray-900">{exhibit.exhibit_name}</DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">Manage Documents in this Exhibit</DialogDescription>
                    </DialogHeader>

                    {outlines.length === 0 ? (
                        <div className="flex min-h-[400px] rounded-lg">
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <FolderOpen />
                                    </EmptyMedia>
                                    <EmptyTitle>No Outlines Found</EmptyTitle>
                                    <EmptyDescription>
                                        There are no outlines in this exhibit. Please add a new outline to get started.
                                    </EmptyDescription>
                                </EmptyHeader>
                                <EmptyContent>
                                    <Button onClick={() => openDialog('outline', 'add')}>Add Outline</Button>
                                </EmptyContent>
                            </Empty>
                        </div>
                    ) : (
                        <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                            {/* Left Pane */}
                            <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-6">
                                <h4 className="mb-3 text-xs text-gray-500">Select a category</h4>
                                <div className="space-y-1">
                                    {category?.map((cat) => (
                                        <div
                                            className={`group flex cursor-pointer items-center justify-between rounded-md ${cat === selectedCategory ? 'bg-[#7f1414]/4' : 'text-gray-700 hover:bg-gray-100'} p-2 px-4 transition-colors`}
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                        >
                                            <span className="truncate text-sm font-normal text-red-900">{cat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Pane */}
                            <div className="w-2/3 p-6">
                                {!selectedCategory ? (
                                    <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                                        <X className="mb-2 h-8 w-8" />
                                        <p className="font-medium">No Type Selected</p>
                                        <p className="text-sm">Select a type on the left or add a new one.</p>
                                    </div>
                                ) : (
                                    <>
                                        <h4 className="mb-6 truncate text-lg font-medium text-gray-900">{selectedCategory}</h4>
                                        <div className="max-h-[300px] space-y-3 overflow-y-auto pr-2">
                                            {!filteredOutlines.length ? (
                                                <p className="text-sm text-gray-500 italic">No documents found in this category.</p>
                                            ) : (
                                                filteredOutlines.map((outline) => (
                                                    <div className="group flex items-start justify-between rounded-md border border-gray-100 bg-white p-3 px-6 transition-all hover:border-red-200">
                                                        <div>
                                                            <span className="text-sm font-medium text-gray-900">{outline.outline_description}</span>
                                                        </div>
                                                        <div className="flex flex-shrink-0 items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                            <ActionButton
                                                                className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                                                onClick={() => openDialog('outline', 'view', outline)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </ActionButton>
                                                            <ActionButton
                                                                className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                                                onClick={() => openDialog('outline', 'edit', outline)}
                                                            >
                                                                <EditIcon className="h-4 w-4" />
                                                            </ActionButton>

                                                            <ActionButton
                                                                className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-red-700"
                                                                onClick={() => openDialog('outline', 'delete', outline)}
                                                            >
                                                                <Trash2Icon className="h-4 w-4" />
                                                            </ActionButton>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        {outlines.length > 0 && (
                            <Button
                                variant="noborder"
                                onClick={() => openDialog('outline', 'add')}
                            >
                                <Plus className="mr-1 h-4 w-4" />
                                New Outline
                            </Button>
                        )}
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {dialog.type === 'outline' && (
                <ExhibitOutlineDialogRenderer type={dialog.action} exhibit={exhibit} outline={dialog.outline || null} onClose={closeDialog} />
            )}
        </>
    );
}
// const [newCategory, setNewCategory] = useState<string>('');
{
    /*<div className="flex items-center space-x-0.5 opacity-100 transition-opacity">
    <ActionButton
        onClick={(e) => {
            e.stopPropagation();
            setIsDialogOpen(true);
        }}
    >
        <EditIcon className="h-4 w-4" />
    </ActionButton>
    <ActionButton
        onClick={(e) => {
            e.stopPropagation();
            handleDeleteCategory(cat);
        }}
    >
        <Trash2Icon className="h-4 w-4" />
    </ActionButton>
</div>*/
}
/* <div className="mt-4 border-gray-200 pt-4">
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger className="w-full">
            <Button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition">
                <Plus className="mr-2 h-4 w-4" /> New Category
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="text-lg font-medium text-gray-900">Create New Category</DialogTitle>
                <DialogDescription className="text-sm text-gray-500">Create a new category within an exhibit</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
                <Label className="mb-2 block text-sm font-medium text-gray-700">Category Name</Label>
                <Input
                    type="text"
                    autoFocus
                    tabIndex={1}
                    placeholder="ex. Syllabus for BSHM"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
            </div>
            <DialogFooter className="mt-2">
                <DialogClose asChild>
                    <Button type="button" variant="outline" id="add-card-dialog-close">
                        Cancel
                    </Button>
                </DialogClose>
                <Button
                    type="submit"
                    className="border-none"
                    onClick={() => {
                        addCategory();
                        setIsDialogOpen(false);
                    }}
                >
                    Create
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</div>; */
