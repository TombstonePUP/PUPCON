import PillarDialog from '@/components/dialogs/content/pillar-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/text-area';
import { PillarItems, Pillars } from '@/types/content';
import { CircleAlert, EditIcon, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface PillarSectionProps {
    pillars: Pillars[];
    updatePillars: (updatedPillars: Pillars[]) => void;
    errors?: Record<string, string>; // new prop for errors
}

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

export default function PillarsSection({ ...props }: PillarSectionProps) {
    const { pillars, updatePillars, errors } = props;
    const [pillarList, setPillarList] = useState<Pillars[]>(pillars);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [action, setAction] = useState<'add' | 'edit'>('add');

    const [selectedPillarId, setSelectedPillarId] = useState<number | null>(null);
    const [selectedPillarItemId, setSelectedPillarItemId] = useState<number | null>(null);
    const selectedPillar = pillarList.find((pillar) => pillar.pillar_id === selectedPillarId) || null;
    const selectedPillarItem = selectedPillar?.pillar_items?.find((item) => item.item_id === selectedPillarItemId) || null;

    const [addingNewItem, setAddingNewItem] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<boolean>(false);

    const [data, setData] = useState<PillarItems>({
        item_id: selectedPillarItem ? selectedPillarItem.item_id : 0,
        pillar_id: selectedPillar ? selectedPillar.pillar_id : 0,
        item_description: selectedPillarItem ? selectedPillarItem.item_description : '',
    });

    const handleAddPillar = () => {
        setAction('add');
        setDialogOpen(true);
        setSelectedPillarId(null);
    };

    const handleEditPillar = (pillar: Pillars) => {
        setAction('edit');
        setDialogOpen(true);
        setSelectedPillarId(pillar.pillar_id);
    };

    const handleSavePillar = (pillarData: Pillars) => {
        setPillarList((prevPillars) => {
            let updatedPillars: Pillars[];
            if (action === 'edit' && selectedPillarId !== null) {
                updatedPillars = prevPillars.map((pillar) => (pillar.pillar_id === selectedPillarId ? { ...pillar, ...pillarData } : pillar));
            } else {
                const newPillar: Pillars = {
                    pillar_id: pillarData.pillar_id,
                    pillar_title: pillarData.pillar_title,
                    pillar_items: [],
                };
                updatedPillars = [...prevPillars, newPillar];
                setSelectedPillarId(newPillar.pillar_id);
            }
            updatePillars(updatedPillars);
            return updatedPillars;
        });
    };

    const pillarErrorCount = Object.keys(errors).filter((key) => key.startsWith('pillars.')).length;

    const getPillarErrors = (pillarIndex: number, itemIndex: number) => {
        if (!errors) return [];
        return Object.keys(errors).filter((key) => key.startsWith(`pillars.${pillarIndex}.pillar_items.${pillarIndex}.`));
    };

    const handleDeletePillar = (pillarId: number) => {
        setPillarList((prevPillars) => {
            const updatedPillars = prevPillars.filter((pillar) => pillar.pillar_id !== pillarId);
            updatePillars(updatedPillars);
            if (selectedPillarId === pillarId) {
                setSelectedPillarId(null);
            }
            return updatedPillars;
        });
    };

    const handleAddPillarItem = () => {
        setAddingNewItem(true);
        setSelectedPillarItemId(null);
        setData({
            item_id: Date.now(),
            pillar_id: selectedPillar ? selectedPillar.pillar_id : 0,
            item_description: '',
        });
    };

    const handleEditPillarItem = (item: PillarItems) => {
        setEditingItem(true);
        setSelectedPillarItemId(item.item_id);
        setData({
            item_id: item.item_id,
            pillar_id: item.pillar_id,
            item_description: item.item_description,
        });
    };

    const handleDeletePillarItem = (pillarId: number, itemId: number) => {
        setPillarList((prevPillars) => {
            const updatedPillars = prevPillars.map((pillar) =>
                pillar.pillar_id === pillarId
                    ? {
                        ...pillar,
                        pillar_items: pillar.pillar_items?.filter((item) => item.item_id !== itemId) || [],
                    }
                    : pillar,
            );
            updatePillars(updatedPillars);
            return updatedPillars;
        });
    };

    const handleSavePillarItem = () => {
        if (!selectedPillar) return;

        setPillarList((prevPillars) => {
            const updatedPillars = prevPillars.map((pillar) => {
                if (pillar.pillar_id === selectedPillar.pillar_id) {
                    let updatedItems: PillarItems[] = pillar.pillar_items ? [...pillar.pillar_items] : [];
                    if (editingItem && selectedPillarItemId !== null) {
                        updatedItems = updatedItems.map((item) => (item.item_id === selectedPillarItemId ? { ...item, ...data } : item));
                    } else {
                        updatedItems.push({ ...data });
                    }
                    return { ...pillar, pillar_items: updatedItems };
                }
                return pillar;
            });
            updatePillars(updatedPillars);
            return updatedPillars;
        });

        setEditingItem(false);
        setAddingNewItem(false);
        setSelectedPillarItemId(null);
        setData({
            item_id: 0,
            pillar_id: selectedPillar.pillar_id,
            item_description: '',
        });
    };

    return (
        <>
            <div className="mb-6">
                <h3 className="mb-4 text-base font-semibold text-gray-900">University Strategic Goals</h3>
                <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                    {/* Left Pane: Pillar List */}
                    <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-6">
                        <h4 className="mb-3 text-xs text-gray-500">Select a Pillar</h4>
                        <div className="space-y-1">
                            {pillars.map((pillar, index) => (
                                <div
                                    key={pillar.pillar_id}
                                    onClick={() => {
                                        setSelectedPillarId(pillar.pillar_id);
                                    }}
                                    className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-4 transition-colors ${pillar.pillar_id === selectedPillarId ? 'bg-[#7f1414]/4' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="truncate text-sm">
                                        <div
                                            className={` ${pillar.pillar_id === selectedPillarId ? 'font-normal text-red-900' : 'text-gray-700'} flex gap-2 truncate`}
                                        >
                                            <div
                                                className={`font-normal ${pillar.pillar_id === selectedPillarId ? 'text-red-800' : 'text-red-600/70'}`}
                                            >
                                                {index + 1}
                                            </div>
                                            {'    '}
                                            <div className="truncate">{pillar.pillar_title}</div>
                                            {Object.keys(errors).some((key) => key.startsWith(`pillars.${index}.`)) && (
                                                <CircleAlert className="inline-block h-4 w-4 text-red-600" />
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className={`flex items-center space-x-0.5 transition-opacity ${pillar.pillar_id === selectedPillarId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                            }`}
                                    >
                                        <ActionButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditPillar(pillar);
                                            }}
                                            className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                        >
                                            <EditIcon className="h-4 w-4" />
                                        </ActionButton>
                                        <ActionButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeletePillar(pillar.pillar_id);
                                            }}
                                            className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </ActionButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 border-t border-gray-200 pt-4">
                            <Button
                                onClick={handleAddPillar}
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                            >
                                <Plus className="mr-2 h-4 w-4" /> <p className="truncate">Add New Pillar</p>
                            </Button>
                        </div>
                    </div>

                    {/* Right Pane: Pillar Details */}
                    <div className="w-2/3 p-6">
                        {!selectedPillar ? (
                            <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                                <X className="mb-2 h-8 w-8" />
                                <p className="font-medium">No Pillar Selected</p>
                                <p className="text-sm">Select a pillar on the left or click "Add New Pillar" to start.</p>
                            </div>
                        ) : (
                            <>
                                <h4 className="mb-1 truncate text-lg font-medium text-foreground">{selectedPillar.pillar_title}</h4>
                                <p className="mb-6 truncate text-xs font-normal text-gray-600">List of the Pillar Items</p>

                                {/* List of Items */}
                                <div className="max-h-[250px] space-y-4 overflow-y-auto pr-2">
                                    {selectedPillar.pillar_items?.length === 0 && (
                                        <p className="text-sm text-muted-foreground italic">No items have been added to this pillar yet.</p>
                                    )}

                                    {selectedPillar.pillar_items?.map((item, index) => {
                                        const hasErrors =
                                            getPillarErrors(
                                                pillars.findIndex((t) => t.pillar_id === selectedPillarId),
                                                index,
                                            ).length > 0;
                                        return (
                                            <div key={item.item_id}>
                                                <div
                                                    className={`group cursor-pointer items-center justify-between rounded-md border border-gray-100 bg-white p-2 transition-all hover:border-red-200 ${selectedPillarItemId === item.item_id ? 'hidden' : 'flex'}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex-1 px-2 text-sm text-gray-700">{item.item_description}</span>
                                                        {hasErrors && <CircleAlert className="h-4 w-4 text-red-600" />}
                                                    </div>
                                                    <div className="flex items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                        <ActionButton onClick={() => handleEditPillarItem(item)}>
                                                            <EditIcon className="h-4 w-4" />
                                                        </ActionButton>
                                                        <ActionButton
                                                            onClick={() => handleDeletePillarItem(selectedPillar.pillar_id, item.item_id)}
                                                            className="hover:text-red-500"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </ActionButton>
                                                    </div>
                                                </div>
                                                <div>
                                                    {getPillarErrors(
                                                        pillars.findIndex((t) => t.pillar_id === selectedPillarId),
                                                        index,
                                                    ).map((errorKey) => (
                                                        <p key={errorKey} className="mt-1 text-xs text-red-600">
                                                            {errors[errorKey]}
                                                        </p>
                                                    ))}
                                                </div>

                                                <div
                                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${selectedPillarItemId === item.item_id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} `}
                                                >
                                                    <div className="rounded-md border border-gray-200 bg-white p-6">
                                                        <label className="mb-2 block text-sm font-medium text-gray-700">Edit Item Description</label>
                                                        <Textarea
                                                            placeholder="Enter item description..."
                                                            value={data.item_description}
                                                            onChange={(e) => setData({ ...data, item_description: e.target.value })}
                                                            autoFocus
                                                            autoResize
                                                            minHeight={80}
                                                        />
                                                        <div className="mt-4 flex justify-end space-x-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => setSelectedPillarItemId(null)}
                                                                className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    handleSavePillarItem();
                                                                }}
                                                                className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                                                            >
                                                                Save Changes
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* --- Inline Add Item Form --- */}
                                <div className="mt-6">
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${addingNewItem ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} `}
                                    >
                                        <div className="rounded-md border border-gray-200 bg-white p-6">
                                            <label className="mb-2 block text-sm font-medium text-gray-700">New Item Description</label>
                                            <Textarea
                                                placeholder="Enter item description..."
                                                value={data.item_description}
                                                onChange={(e) => setData({ ...data, item_description: e.target.value })}
                                                autoFocus
                                                autoResize
                                                minHeight={80}
                                            />
                                            <div className="mt-4 flex justify-end space-x-3">
                                                <Button
                                                    type="button"
                                                    onClick={() => setAddingNewItem(false)}
                                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        handleSavePillarItem();
                                                    }}
                                                    className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                                                >
                                                    Save Item
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={`transition-all duration-300 ease-in-out ${addingNewItem ? 'invisible max-h-0 opacity-0' : 'max-h-[100px] opacity-100'} `}
                                    >
                                        <Button
                                            onClick={handleAddPillarItem}
                                            className="flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-8 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                        >
                                            <Plus className="h-4 w-4" /> Add New Item
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            {dialogOpen && (
                <PillarDialog
                    type={action}
                    pillar={action === 'edit' ? selectedPillar : null}
                    onClose={() => setDialogOpen(false)}
                    onSave={handleSavePillar}
                />
            )}
        </>
    );
}
