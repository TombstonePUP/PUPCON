import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Link, usePage } from '@inertiajs/react';
import React, { useRef, useState } from 'react';

type ItemType = {
    id: string;
    content?: string;
    area_number?: string;
    area_name?: string;
    area_id?: string;
    type?: 'text' | 'image';
    // Faculty specific fields
    image?: string;
    lastName?: string;
    firstName?: string;
    middleInitial?: string;
    position?: string;
};

type EditableGridProps = {
    mode: 'objectives' | 'gallery' | 'areas' | 'faculty';
    initialItems?: ItemType[];
    onAdd?: (content: string) => void | { areaNumber: string; areaName: string } | FacultyData | void;
    onEdit?: (id: string, newContent: string) => void | { areaNumber: string; areaName: string } | FacultyData | void;
    onRemove?: (id: string) => void;
    onUpload?: (file: File) => void;
    programName?: string;
};

type FacultyData = {
    image: string;
    lastName: string;
    firstName: string;
    middleInitial: string;
    position: string;
};

const EditableGrid: React.FC<EditableGridProps> = ({ mode = 'objectives', initialItems = [], onAdd, onEdit, onRemove, onUpload, programName }) => {
    const [items, setItems] = useState<ItemType[]>(initialItems);
    const [newContent, setNewContent] = useState('');
    const [newAreaNumber, setNewAreaNumber] = useState('');
    const [newAreaName, setNewAreaName] = useState('');
    const [isContentVisible, setIsContentVisible] = useState(true);
    const dialogCloseRef = useRef<HTMLButtonElement>(null);
    const { auth } = usePage().props;
    const role = auth.user.roles[0].role_name;

    console.log(programName);

    // Faculty state
    const [newFaculty, setNewFaculty] = useState<FacultyData>({
        image: '',
        lastName: '',
        firstName: '',
        middleInitial: '',
        position: '',
    });

    // Handle adding new items based on mode
    const handleAdd = () => {
        if (mode === 'areas') {
            if (newAreaNumber.trim() && newAreaName.trim()) {
                const newItem = {
                    id: Date.now().toString(),
                    area_number: newAreaNumber,
                    area_name: newAreaName,
                };
                setItems([...items, newItem]);
                if (onAdd) onAdd({ areaNumber: newAreaNumber, areaName: newAreaName } as any);
                setNewAreaNumber('');
                setNewAreaName('');
                // Close the dialog
                if (dialogCloseRef.current) dialogCloseRef.current.click();
            }
        } else if (mode === 'faculty') {
            if (newFaculty.lastName.trim() && newFaculty.firstName.trim()) {
                const newItem = {
                    id: Date.now().toString(),
                    image: newFaculty.image,
                    lastName: newFaculty.lastName,
                    firstName: newFaculty.firstName,
                    middleInitial: newFaculty.middleInitial,
                    position: newFaculty.position,
                };
                setItems([...items, newItem]);
                if (onAdd) onAdd(newFaculty as any);
                setNewFaculty({
                    image: '',
                    lastName: '',
                    firstName: '',
                    middleInitial: '',
                    position: '',
                });
                // Close the dialog
                if (dialogCloseRef.current) dialogCloseRef.current.click();
            }
        } else if (mode === 'objectives') {
            if (newContent.trim()) {
                const newItem = {
                    id: Date.now().toString(),
                    content: newContent,
                    type: 'text',
                };
                setItems([...items, newItem]);
                if (onAdd) onAdd(newContent);
                setNewContent('');
                // Close the dialog
                if (dialogCloseRef.current) dialogCloseRef.current.click();
            }
        }
    };

    // Handle editing items based on mode
    const handleEdit = (id: string, content: string, data?: any) => {
        if (mode === 'areas') {
            setItems(items.map((item) => (item.id === id ? { ...item, area_number: data.areaNumber, area_name: data.areaName } : item)));
            if (onEdit) onEdit(id, data);
        } else if (mode === 'faculty') {
            setItems(items.map((item) => (item.id === id ? { ...item, ...data } : item)));
            if (onEdit) onEdit(id, data);
        } else {
            setItems(items.map((item) => (item.id === id ? { ...item, content } : item)));
            if (onEdit) onEdit(id, content);
        }
    };

    // Handle removing items
    const handleRemove = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
        if (onRemove) onRemove(id);
    };

    // Handle file upload for gallery and faculty modes
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isFaculty = false) => {
        const file = e.target.files?.[0];
        if (file) {
            if (onUpload) {
                onUpload(file);
                // In a real app, you would handle the upload response
                // For demo purposes, we'll use a placeholder
                const imageUrl = URL.createObjectURL(file);
                if (isFaculty) {
                    setNewFaculty((prev) => ({ ...prev, image: imageUrl }));
                } else {
                    // For gallery mode, directly add the image
                    const newItem = {
                        id: Date.now().toString(),
                        content: imageUrl,
                        type: 'image',
                    };
                    setItems([...items, newItem]);
                    if (onAdd) onAdd(imageUrl);
                }
            }
        }
    };

    // Render the appropriate content based on item type
    const renderItemContent = (item: ItemType) => {
        switch (mode) {
            case 'areas':
                return (
                    <>
                        <h1 className="font-bold">{item.area_number}</h1>
                        <p className="text-[#858585]">{item.area_name}</p>
                    </>
                );
            case 'gallery':
                return (
                    <img
                        src={item.content}
                        className="h-full w-full rounded object-cover transition-all duration-300 group-hover:brightness-75"
                        alt="Gallery item"
                    />
                );
            case 'faculty':
                return (
                    <div className="flex flex-col items-center">
                        <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-gray-200">
                            <img
                                src={item.image || '/assets/images/placeholder-user.png'}
                                className="h-full w-full object-cover"
                                alt={`${item.firstName} ${item.lastName}`}
                            />
                        </div>
                        <div className="mt-3 text-center">
                            <h3 className="font-bold">
                                {item.lastName}, {item.firstName} {item.middleInitial}
                            </h3>
                            <p className="text-sm text-[#858585]">{item.position}</p>
                        </div>
                    </div>
                );
            default: // objectives
                return <p className="transition-all duration-300 group-hover:opacity-20">{item.content}</p>;
        }
    };

    // Render the appropriate add/edit dialog based on mode
    const renderDialogContent = (item?: ItemType) => {
        if (mode === 'areas') {
            return (
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
                        <Button variant="noborder"
                            onClick={() => {
                                if (item) {
                                    handleEdit(item.id, '', {
                                        areaNumber: newAreaNumber || item.area_number || '',
                                        areaName: newAreaName || item.area_name || '',
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
        } else if (mode === 'faculty') {
            return (
                <>
                    <div className="space-y-4">
                        <div className="flex flex-col items-center">
                            <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-gray-200">
                                <img
                                    src={item?.image || newFaculty.image || '/assets/images/placeholder-user.png'}
                                    className="h-full w-full object-cover"
                                    alt="Faculty member"
                                />
                            </div>
                            <label className="mt-2 cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                                Upload Image
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, true)} />
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    defaultValue={item?.lastName}
                                    onChange={(e) =>
                                        item
                                            ? setNewFaculty((prev) => ({ ...prev, lastName: e.target.value }))
                                            : setNewFaculty((prev) => ({ ...prev, lastName: e.target.value }))
                                    }
                                    className="mt-1 w-full rounded border p-2"
                                    placeholder="Enter last name"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    defaultValue={item?.firstName}
                                    onChange={(e) =>
                                        item
                                            ? setNewFaculty((prev) => ({ ...prev, firstName: e.target.value }))
                                            : setNewFaculty((prev) => ({ ...prev, firstName: e.target.value }))
                                    }
                                    className="mt-1 w-full rounded border p-2"
                                    placeholder="Enter first name"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Middle Initial</label>
                                <input
                                    type="text"
                                    defaultValue={item?.middleInitial}
                                    onChange={(e) =>
                                        item
                                            ? setNewFaculty((prev) => ({ ...prev, middleInitial: e.target.value }))
                                            : setNewFaculty((prev) => ({ ...prev, middleInitial: e.target.value }))
                                    }
                                    className="mt-1 w-full rounded border p-2"
                                    placeholder="Enter middle initial"
                                    maxLength={1}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Position</label>
                                <input
                                    type="text"
                                    defaultValue={item?.position}
                                    onChange={(e) =>
                                        item
                                            ? setNewFaculty((prev) => ({ ...prev, position: e.target.value }))
                                            : setNewFaculty((prev) => ({ ...prev, position: e.target.value }))
                                    }
                                    className="mt-1 w-full rounded border p-2"
                                    placeholder="Enter position"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-2 gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button
                            onClick={() => {
                                if (item) {
                                    handleEdit(item.id, '', {
                                        image: newFaculty.image || item.image || '',
                                        lastName: newFaculty.lastName || item.lastName || '',
                                        firstName: newFaculty.firstName || item.firstName || '',
                                        middleInitial: newFaculty.middleInitial || item.middleInitial || '',
                                        position: newFaculty.position || item.position || '',
                                    });
                                } else {
                                    handleAdd();
                                }
                            }}
                        >
                            {item ? 'Save' : 'Add Faculty'}
                        </Button>
                    </DialogFooter>
                </>
            );
        } else if (mode === 'objectives') {
            return (
                <>
                    <textarea
                        defaultValue={item?.content}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="focus:ring-ring min-h-[100px] w-full resize-y rounded border p-5 focus:ring-2 focus:outline-none"
                        placeholder="Enter objective sentence"
                        autoFocus
                    />
                    <DialogFooter className="mt-2 gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button
                            onClick={() => {
                                if (item) {
                                    handleEdit(item.id, newContent || item.content || '');
                                } else {
                                    handleAdd();
                                }
                            }}
                        >
                            {item ? 'Save' : 'Add'}
                        </Button>
                    </DialogFooter>
                </>
            );
        }
    };

    // Special render for gallery mode add button
    const renderGalleryAddButton = () => {
        return (
            <div className="relative flex h-[8vw] w-full items-center justify-center rounded border border-dashed bg-gray-50 p-1 text-sm font-medium transition-all duration-300 hover:bg-gray-100">
                <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center">
                    <PlusIcon />
                    <h1 className="text-[#B4B4B4]">Add Image</h1>
                    <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={(e) => handleFileUpload(e)} />
                </label>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Collapsible Header */}
            <button
                type="button"
                className="mt-2 rounded  p-1 text-center text-[1vw] font-bold text-white transition-colors bg-[#3b3a3a] group cursor-pointer"
                onClick={() => setIsContentVisible(!isContentVisible)}
            >
                <div className="flex items-center justify-between rounded-sm p-2 px-3">
                    <span className='flex-1 group-hover:scale-105 transition'>{mode.toUpperCase()}</span>
                    <span>{isContentVisible ? '−' : '+'}</span>
                </div>
            </button>

            {/* Content - conditionally rendered based on isContentVisible */}
            {isContentVisible && (
                <div
                    className={`${
                        mode === 'areas'
                            ? 'grid grid-cols-2 gap-3'
                            : mode === 'faculty'
                              ? 'grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4'
                              : 'flex flex-wrap gap-3'
                    }`}
                >

                    {/* Render items */}
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className={`group relative ${
                                mode === 'areas'
                                    ? 'rounded border p-7 hover:border-[#7f1414] border-[#7f1414]/20 hover:text-[#7f1414] transition'
                                    : mode === 'faculty'
                                      ? 'rounded-lg border p-4'
                                      : 'flex h-[13vw] min-w-[15vw] flex-1 items-center justify-center overflow-hidden rounded border bg-gray-50 p-1 transition-all duration-300 hover:bg-gray-100'
                            }`}
                        >
                            {mode === 'areas' ? (
                                <Link href={route('manage.area', {program_name: programName, area_id: item.area_id || item.id})} className="block  ">
                                    {renderItemContent(item)}
                                </Link>
                            ) : (
                                renderItemContent(item)
                            )}
                            <div
                                className={`absolute flex gap-2 ${
                                    mode === 'areas'
                                        ? 'top-2 right-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
                                        : mode === 'faculty'
                                          ? 'top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100'
                                          : 'inset-0 items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100'
                                }`}
                            >
                                {/* Edit button */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className={`${
                                                mode === 'areas' || mode === 'faculty'
                                                    ? 'h-8 w-8 rounded-full p-0 hover:bg-gray-200'
                                                    : 'flex h-8 w-8 items-center justify-center rounded bg-[#171717] text-white'
                                            }`}
                                            onClick={(e) => (mode === 'areas' || mode === 'faculty') && e.preventDefault()}
                                        >
                                            <EditIcon />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className={mode === 'faculty' ? 'max-w-md' : ''}>
                                        <DialogTitle>
                                            {item
                                                ? `Edit ${mode === 'areas' ? 'Area' : mode === 'faculty' ? 'Faculty' : 'Objective'}`
                                                : `Add ${mode === 'areas' ? 'Area' : mode === 'faculty' ? 'Faculty' : 'Objective'}`}
                                        </DialogTitle>
                                        <DialogDescription>{renderDialogContent(item)}</DialogDescription>
                                    </DialogContent>
                                </Dialog>

                                {/* Delete button */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            className={`${
                                                mode === 'areas' || mode === 'faculty'
                                                    ? 'h-8 w-8 rounded-full p-0'
                                                    : 'flex h-8 w-8 items-center justify-center rounded border-none'
                                            } border-none`}
                                            onClick={(e) => (mode === 'areas' || mode === 'faculty') && e.preventDefault()}
                                        >
                                            <TrashIcon />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogTitle>Are you sure?</DialogTitle>
                                        <DialogDescription>
                                            This will permanently remove this{' '}
                                            {mode === 'areas' ? 'area' : mode === 'faculty' ? 'faculty member' : 'objective'}.
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
                            </div>
                        </div>
                    ))}

                    {/* Add New Item */}
                    {mode === 'gallery' ? (
                        renderGalleryAddButton()
                    ) : (
                        <div
                            className={`${mode === 'areas' ? 'col-span-2' : mode === 'faculty' ? 'col-span-2 md:col-span-3 lg:col-span-4' : 'w-full'}`}
                        >
                            {(role === 'Admin' || role === 'Coordinator') && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className={`flex h-[8vw] w-full cursor-pointer flex-col rounded border border-dashed transition-colors duration-300 hover:bg-gray-50`}
                                        >
                                            <PlusIcon />
                                            <h1 className="text-[#B4B4B4]">
                                                {mode === 'areas' ? 'Add Area' : mode === 'faculty' ? 'Add Faculty Member' : 'Add Objective'}
                                            </h1>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className={mode === 'faculty' ? 'max-w-md' : ''}>
                                        <DialogTitle>Add {mode === 'areas' ? 'Area' : mode === 'faculty' ? 'Faculty Member' : 'Objective'}</DialogTitle>
                                        <DialogDescription>{renderDialogContent()}</DialogDescription>
                                        <DialogClose asChild>
                                            <button ref={dialogCloseRef} className="hidden" />
                                        </DialogClose>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Icon components (keep the same as before)
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
