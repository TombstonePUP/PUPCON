import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type ItemType = {
    id: string;
    content: string;
    type: 'text' | 'image';
};

type EditableGridProps = {
    mode: 'objectives' | 'gallery';
    initialItems?: ItemType[];
    onAdd?: (content: string) => void;
    onEdit?: (id: string, newContent: string) => void;
    onRemove?: (id: string) => void;
    onUpload?: (file: File) => void;
};

const EditableGrid: React.FC<EditableGridProps> = ({ mode = 'objectives', initialItems = [], onAdd, onEdit, onRemove, onUpload }) => {
    const [items, setItems] = useState<ItemType[]>(initialItems);
    const [newContent, setNewContent] = useState('');

    const handleAdd = () => {
        if (newContent.trim()) {
            const newItem = {
                id: Date.now().toString(),
                content: newContent,
                type: mode === 'objectives' ? 'text' : 'image',
            };
            setItems([...items, newItem]);
            onAdd?.(newContent);
            setNewContent('');
        }
    };

    const handleEdit = (id: string, content: string) => {
        setItems(items.map((item) => (item.id === id ? { ...item, content } : item)));
        onEdit?.(id, content);
    };

    const handleRemove = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
        onRemove?.(id);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload?.(file);
            // For gallery mode, we'd typically upload the file and get a URL back
            // Then add it to the items array
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Header */}
            {mode === 'gallery' && (
                <h1 className="mt-10 rounded border p-1 text-center text-[1vw] font-black text-white">
                    <div className="rounded bg-[#3b3a3a] p-2">GALLERY</div>
                </h1>
            )}

            {/* Items Grid */}
            <div className="flex flex-wrap gap-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="group relative flex h-[13vw] min-w-[15vw] flex-1 items-center justify-center overflow-hidden rounded border bg-gray-50 p-1 transition-all duration-300 hover:bg-gray-100"
                    >
                        {item.type === 'text' ? (
                            <>
                                <p className="transition-all duration-300 group-hover:opacity-20">{item.content}</p>
                                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="flex h-8 w-8 items-center justify-center rounded border-none shadow-md">
                                                <TrashIcon />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle>Are you sure?</DialogTitle>
                                            <DialogDescription>
                                                This will permanently remove this {mode === 'objectives' ? 'objective' : 'image'}.
                                            </DialogDescription>
                                            <form className="space-y-6">
                                                <DialogFooter className="gap-2">
                                                    <DialogClose asChild>
                                                        <Button variant="secondary">Cancel</Button>
                                                    </DialogClose>
                                                    <Button variant="destructive" onClick={() => handleRemove(item.id)}>
                                                        Remove
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="flex h-8 w-8 items-center justify-center rounded bg-[#171717] text-white shadow-md">
                                                <EditIcon />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle>Edit {mode === 'objectives' ? 'Objective' : 'Image'}</DialogTitle>
                                            <DialogDescription>
                                                <textarea
                                                    value={item.content}
                                                    onChange={(e) => setNewContent(e.target.value)}
                                                    className="focus:ring-ring min-h-[100px] w-full resize-y rounded border p-5 focus:ring-2 focus:outline-none"
                                                    placeholder={`Enter ${mode === 'objectives' ? 'objective' : 'image description'}`}
                                                />
                                            </DialogDescription>
                                            <form className="space-y-6">
                                                <DialogFooter className="gap-2">
                                                    <DialogClose asChild>
                                                        <Button variant="secondary">Cancel</Button>
                                                    </DialogClose>
                                                    <Button variant="black" onClick={() => handleEdit(item.id, newContent)}>
                                                        Save
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </>
                        ) : (
                            <>
                                <img
                                    src={item.content}
                                    className="h-full w-full rounded object-cover transition-all duration-300 group-hover:brightness-75"
                                    alt="Gallery item"
                                />
                                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="flex h-8 w-8 items-center justify-center rounded border-none shadow-md">
                                                <TrashIcon />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle>Are you sure?</DialogTitle>
                                            <DialogDescription>This will permanently remove the image from the gallery.</DialogDescription>
                                            <form className="space-y-6">
                                                <DialogFooter className="gap-2">
                                                    <DialogClose asChild>
                                                        <Button variant="secondary">Cancel</Button>
                                                    </DialogClose>
                                                    <Button variant="destructive" onClick={() => handleRemove(item.id)}>
                                                        Remove
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>

                                    <Button
                                        variant="ghost"
                                        className="flex h-8 w-8 items-center justify-center rounded bg-[#171717] text-white shadow-md"
                                        asChild
                                    >
                                        <label>
                                            <EditIcon />
                                            <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileUpload} />
                                        </label>
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {/* Add New Item */}
                <div className={mode === 'objectives' ? 'w-full' : ''}>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                className={`flex cursor-pointer flex-col rounded border border-dashed transition-colors duration-300 ${
                                    mode === 'objectives' ? 'h-[8vw] w-full' : 'h-[13vw] min-w-[15vw]'
                                }`}
                            >
                                <PlusIcon />
                                <h1 className="text-[#B4B4B4]">{mode === 'objectives' ? 'Add Objective' : 'Add Image'}</h1>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Add {mode === 'objectives' ? 'Objective' : 'Image'}</DialogTitle>
                            <DialogDescription>
                                {mode === 'objectives' ? (
                                    <textarea
                                        value={newContent}
                                        onChange={(e) => setNewContent(e.target.value)}
                                        className="focus:ring-ring min-h-[100px] w-full resize-y rounded border p-5 focus:ring-2 focus:outline-none"
                                        placeholder="Enter objective sentence"
                                        autoFocus
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <label
                                            htmlFor="image-upload"
                                            className="flex cursor-pointer flex-col items-center justify-center gap-3 text-[#858585]"
                                        >
                                            <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-dashed border-[#B4B4B4]">
                                                <UploadIcon />
                                            </div>
                                            <div>
                                                <p className="text-[#B4B4B4]">Upload gallery image</p>
                                                <p className="text-muted-foreground text-sm">PNG, JPG up to 5MB</p>
                                            </div>
                                        </label>
                                        <input
                                            id="image-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/png, image/jpeg"
                                            onChange={handleFileUpload}
                                        />
                                    </div>
                                )}
                            </DialogDescription>
                            <form className="space-y-6">
                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button variant="secondary">Cancel</Button>
                                    </DialogClose>
                                    {mode === 'objectives' && (
                                        <Button variant="black" onClick={handleAdd}>
                                            Add
                                        </Button>
                                    )}
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

// Icon components for cleaner code
const TrashIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
);

const EditIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const PlusIcon = () => (
    <svg className="size-10 text-[#B4B4B4]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const UploadIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B4B4B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v12" />
        <path d="m17 8-5-5-5 5" />
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    </svg>
);

export default EditableGrid;
