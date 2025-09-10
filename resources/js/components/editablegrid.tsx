import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Link, usePage } from '@inertiajs/react';
import React, { useRef, useState } from 'react';

type AreaItem = {
    id: string;
    area_number: string;
    area_name: string;
    area_id?: string;
};

type EditableGridProps = {
    initialItems?: AreaItem[];
    onAdd?: (data: { areaNumber: string; areaName: string }) => void;
    onEdit?: (id: string, data: { areaNumber: string; areaName: string }) => void;
    onRemove?: (id: string) => void;
    programName?: string;
};

const EditableGrid: React.FC<EditableGridProps> = ({ initialItems = [], onAdd, onEdit, onRemove, programName }) => {
    const [items, setItems] = useState<AreaItem[]>(initialItems);
    const [newAreaNumber, setNewAreaNumber] = useState('');
    const [newAreaName, setNewAreaName] = useState('');
    const dialogCloseRef = useRef<HTMLButtonElement>(null);
    const { auth } = usePage().props;
    const role = auth.user.roles[0].role_name;

    // Handle add
    const handleAdd = () => {
        if (newAreaNumber.trim() && newAreaName.trim()) {
            const newItem = {
                id: Date.now().toString(),
                area_number: newAreaNumber,
                area_name: newAreaName,
            };
            setItems([...items, newItem]);
            if (onAdd) onAdd({ areaNumber: newAreaNumber, areaName: newAreaName });
            setNewAreaNumber('');
            setNewAreaName('');
            if (dialogCloseRef.current) dialogCloseRef.current.click();
        }
    };

    // Handle edit
    const handleEdit = (id: string, data: { areaNumber: string; areaName: string }) => {
        setItems(items.map((item) => (item.id === id ? { ...item, area_number: data.areaNumber, area_name: data.areaName } : item)));
        if (onEdit) onEdit(id, data);
    };

    // Handle remove
    const handleRemove = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
        if (onRemove) onRemove(id);
    };

    // Render dialog
    const renderDialogContent = (item?: AreaItem) => (
        <>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Area Number</label>
                    <input
                        type="text"
                        defaultValue={item?.area_number}
                        onChange={(e) => setNewAreaNumber(e.target.value)}
                        className="mt-1 w-full rounded border p-2"
                        placeholder="Enter area number"
                        autoFocus={!item}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Area Name</label>
                    <input
                        type="text"
                        defaultValue={item?.area_name}
                        onChange={(e) => setNewAreaName(e.target.value)}
                        className="mt-1 w-full rounded border p-2"
                        placeholder="Enter area name"
                    />
                </div>
            </div>
            <DialogFooter className="mt-2 gap-2">
                <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button
                    variant="noborder"
                    onClick={() => {
                        if (item) {
                            handleEdit(item.id, {
                                areaNumber: newAreaNumber || item.area_number,
                                areaName: newAreaName || item.area_name,
                            });
                        } else {
                            handleAdd();
                        }
                    }}
                >
                    {item ? 'Save' : 'Add Area'}
                </Button>
            </DialogFooter>
        </>
    );

    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
                {/* Items */}
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="group relative rounded border p-7 border-[#7f1414]/20 hover:border-[#7f1414] hover:text-[#7f1414] transition"
                    >
                        <Link href={route('manage.area', { program_name: programName, area_id: item.area_id || item.id })}>
                            <h1 className="font-bold">{item.area_number}</h1>
                            <p className="text-[#858585]">{item.area_name}</p>
                        </Link>
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            {/* Edit */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-8 w-8 rounded-full p-0 hover:bg-gray-200"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <EditIcon />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Edit Area</DialogTitle>
                                    <DialogDescription>{renderDialogContent(item)}</DialogDescription>
                                </DialogContent>
                            </Dialog>
                            {/* Delete */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        className="h-8 w-8 rounded-full p-0 border-none"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <TrashIcon />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Are you sure?</DialogTitle>
                                    <DialogDescription>This will permanently remove this area.</DialogDescription>
                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button variant="secondary">Cancel</Button>
                                        </DialogClose>
                                        <Button variant="destructive" onClick={() => handleRemove(item.id)}>
                                            Remove
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                ))}

                {/* Add Area */}
                {(role === 'Admin' || role === 'Coordinator') && (
                    <div className="col-span-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex h-[8vw] w-full cursor-pointer flex-col rounded border border-dashed transition-colors duration-300 hover:bg-gray-50"
                                >
                                    <PlusIcon />
                                    <h1 className="text-[#B4B4B4]">Add Area</h1>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>Add Area</DialogTitle>
                                <DialogDescription>{renderDialogContent()}</DialogDescription>
                                <DialogClose asChild>
                                    <button ref={dialogCloseRef} className="hidden" />
                                </DialogClose>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>
        </div>
    );
};

// Icons
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
);

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const PlusIcon = () => (
    <svg className="size-10 text-[#B4B4B4]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default EditableGrid;
