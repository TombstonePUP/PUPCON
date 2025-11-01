import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import { EditIcon, Plus, Trash2, X } from 'lucide-react';
import React, { useState } from 'react'; 

type Item = {
    id: number;
    description: string;
    sort_order: number; 
};
type Pillar = {
    id: number;
    title: string;
    sort_order: number; 
    items: Item[];
};

type CampusGoal = {
    id: number;
    sort_order: number;
    title: string;
    description: string;
    title_filipino: string;
    description_filipino: string;
};

const handleSave = () => {
    console.log('Saving Vision, Mission, Intro, etc...');
};

const handlePreview = () => {
    window.open('/about/vision-mission-goals', '_blank');
};

const initialPillars: Pillar[] = [
    {
        id: 1,
        title: 'Teaching and Learning',
        sort_order: 1,
        items: [
            { id: 101, description: 'World-class faculty members', sort_order: 1 },
            { id: 102, description: 'Cutting-edge research facilities', sort_order: 2 },
        ],
    },
    {
        id: 2,
        title: 'Research and Extension',
        sort_order: 2,
        items: [{ id: 201, description: 'Leadership training programs', sort_order: 1 }],
    },
    {
        id: 3,
        title: 'Internal Governance',
        sort_order: 3,
        items: [],
    },
];

const initialCampusGoals: CampusGoal[] = [
    {
        id: 1,
        sort_order: 1,
        title: 'Academic Excellence',
        description:
            'To promote and strengthen academic excellence to be able to produce globally competitive, socioeconomically responsible, and culturally and gender-inclusive graduates.',
        title_filipino: 'Adhikain 1: Kahusayang Pang-Akademiko',
        description_filipino:
            '– Upang itaguyod at palakasin ang kahusayang pang-akademiko upang magluwal ng mga propesyunal na mayroong pandaigdigang kakayahan, may mapanagutang sosyo-ekonomikal, pangkultural at pangkasariang pagbuo.',
    },
    {
        id: 2,
        sort_order: 2,
        title: 'Empowered Faculty Members and Employees',
        description:
            'To uplift the knowledge, skills, values and wellness of faculty members and employees through relevant capacity building by intensifying partnership with government agencies, private institutions, and individuals.',
        title_filipino: 'Adhikain 2: Pinahusay na mga Miyembro ng Guro at Empleyado',
        description_filipino:
            '– Upang iangat ang kaalaman, kasanayan, halaga, at kapakanan ng mga miyembro ng guro at empleyado sa pamamagitan ng may-katuturang pagpapalakas ng kakayahan sa pamamagitan ng pagpapaigting ng pakikipagtulungan sa mga ahensya ng gobyerno, pribadong institusyon, at mga indibidwal.',
    },
];

const getNewId = (arr: { id: number }[]) => (arr.length > 0 ? Math.max(...arr.map((item) => item.id)) + 1 : 1);

const VmgoContentSection: React.FC = () => {
    // --- Pillar State ---
    const [pillars, setPillars] = useState<Pillar[]>(initialPillars);
    const [selectedPillarId, setSelectedPillarId] = useState<number | null>(initialPillars[0]?.id || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAddPillarModalOpen, setIsAddPillarModalOpen] = useState(false);
    const [newPillarTitle, setNewPillarTitle] = useState('');
    const [addingItemToPillarId, setAddingItemToPillarId] = useState<number | null>(null);
    const [newItemDescription, setNewItemDescription] = useState('');
    const [isEditPillarModalOpen, setIsEditPillarModalOpen] = useState(false);
    const [editingPillar, setEditingPillar] = useState<Pillar | null>(null);
    const [editPillarTitle, setEditPillarTitle] = useState('');
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [editItemDescription, setEditItemDescription] = useState('');

    const selectedPillar = pillars.find((p) => p.id === selectedPillarId);
    const selectedPillarIndex = pillars.findIndex((p) => p.id === selectedPillarId);

    const [campusGoals, setCampusGoals] = useState<CampusGoal[]>(initialCampusGoals);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<CampusGoal | null>(null);
    const [selectedGoalId, setSelectedGoalId] = useState<number | null>(initialCampusGoals[0]?.id || null);

    const [goalFormData, setGoalFormData] = useState<Omit<CampusGoal, 'id' | 'sort_order'>>({
        title: '',
        description: '',
        title_filipino: '',
        description_filipino: '',
    });

    const selectedGoal = campusGoals.find((g) => g.id === selectedGoalId);
    const selectedGoalIndex = campusGoals.findIndex((g) => g.id === selectedGoalId);


    const handleConfirmAddPillar = () => {
        if (!newPillarTitle.trim()) {
            alert('Pillar title cannot be empty.');
            return;
        }

        const newSortOrder = pillars.length > 0 ? Math.max(...pillars.map((p) => p.sort_order)) + 1 : 1;
        const newId = getNewId(pillars);

        const newPillar: Pillar = {
            id: newId,
            title: newPillarTitle,
            sort_order: newSortOrder,
            items: [],
        };

        setPillars([...pillars, newPillar]);
        setSelectedPillarId(newPillar.id);
        setIsAddPillarModalOpen(false);
        setNewPillarTitle('');
    };

    const addPillar = () => setIsAddPillarModalOpen(true);

    const deletePillar = (id: number) => {
        const updatedPillars = pillars.filter((p) => p.id !== id);
        setPillars(updatedPillars);
        if (selectedPillarId === id) {
            setSelectedPillarId(updatedPillars[0]?.id || null);
        }
    };

    const handleShowEditPillarModal = (pillar: Pillar) => {
        setEditingPillar(pillar);
        setEditPillarTitle(pillar.title);
        setIsEditPillarModalOpen(true);
    };

    const handleCancelEditPillar = () => {
        setIsEditPillarModalOpen(false);
        setEditingPillar(null);
        setEditPillarTitle('');
    };

    const handleConfirmEditPillar = () => {
        if (!editPillarTitle.trim() || !editingPillar) {
            alert('Pillar title cannot be empty.');
            return;
        }

        const updatedPillar: Pillar = { ...editingPillar, title: editPillarTitle };

        setPillars(pillars.map((p) => (p.id === updatedPillar.id ? updatedPillar : p)));
        handleCancelEditPillar();
    };


    const handleShowAddItemForm = () => {
        setAddingItemToPillarId(selectedPillar!.id);
        handleCancelEditItem();
    };

    const handleCancelAddItem = () => {
        setAddingItemToPillarId(null);
        setNewItemDescription('');
    };

    const handleConfirmAddItem = () => {
        if (!newItemDescription.trim() || !addingItemToPillarId) {
            alert('Item description cannot be empty.');
            return;
        }

        const pillar = pillars.find((p) => p.id === addingItemToPillarId);
        if (!pillar) return;

        const newSortOrder = pillar.items.length > 0 ? Math.max(...pillar.items.map((item) => item.sort_order)) + 1 : 1;
        const allItems = pillars.flatMap((p) => p.items);
        const newId = getNewId(allItems);

        const newItem: Item = {
            id: newId,
            description: newItemDescription,
            sort_order: newSortOrder,
        };

        setPillars(
            pillars.map((p) => {
                if (p.id === addingItemToPillarId) {
                    return { ...p, items: [...p.items, newItem] };
                }
                return p;
            }),
        );
        handleCancelAddItem();
    };

    const deleteItem = (pillarId: number, itemId: number) => {
        setPillars(
            pillars.map((p) => {
                if (p.id === pillarId) {
                    return { ...p, items: p.items.filter((item) => item.id !== itemId) };
                }
                return p;
            }),
        );
    };

    const handleShowEditItemForm = (item: Item) => {
        setEditingItemId(item.id);
        setEditItemDescription(item.description);
        handleCancelAddItem();
    };

    const handleCancelEditItem = () => {
        setEditingItemId(null);
        setEditItemDescription('');
    };

    const handleConfirmEditItem = () => {
        if (!editItemDescription.trim() || !editingItemId) {
            alert('Item description cannot be empty.');
            return;
        }

        const updatedItem: Item = {
            ...pillars.flatMap((p) => p.items).find((i) => i.id === editingItemId)!,
            description: editItemDescription,
        };

        setPillars(
            pillars.map((p) => {
                if (p.id === selectedPillar!.id) {
                    return {
                        ...p,
                        items: p.items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
                    };
                }
                return p;
            }),
        );
        handleCancelEditItem();
    };


    const resetGoalForm = () => {
        setGoalFormData({
            title: '',
            description: '',
            title_filipino: '',
            description_filipino: '',
        });
        setEditingGoal(null);
        setIsGoalModalOpen(false);
    };

    const handleShowAddGoalModal = () => {
        resetGoalForm();
        setIsGoalModalOpen(true);
    };

    const handleShowEditGoalModal = (goal: CampusGoal) => {
        setEditingGoal(goal);
        setGoalFormData({
            title: goal.title,
            description: goal.description,
            title_filipino: goal.title_filipino,
            description_filipino: goal.description_filipino,
        });
        setIsGoalModalOpen(true);
    };

    const handleDeleteGoal = (id: number) => {
        if (window.confirm('Are you sure you want to delete this campus goal?')) {
            const updatedGoals = campusGoals.filter((goal) => goal.id !== id);
            setCampusGoals(updatedGoals);
            if (selectedGoalId === id) {
                setSelectedGoalId(updatedGoals[0]?.id || null);
            }
        }
    };

    const handleConfirmSaveGoal = () => {
        if (!goalFormData.title.trim() || !goalFormData.description.trim()) {
            alert('Title and Description cannot be empty.');
            return;
        }

        if (editingGoal) {
            const updatedGoal = { ...editingGoal, ...goalFormData };
            setCampusGoals(campusGoals.map((goal) => (goal.id === editingGoal.id ? updatedGoal : goal)));
        } else {
            const newSortOrder = campusGoals.length > 0 ? Math.max(...campusGoals.map((g) => g.sort_order)) + 1 : 1;
            const newId = getNewId(campusGoals);
            const newGoal: CampusGoal = {
                id: newId,
                sort_order: newSortOrder,
                ...goalFormData,
            };
            setCampusGoals([...campusGoals, newGoal]);
            setSelectedGoalId(newId); 
        }
        resetGoalForm();
    };

    const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
        <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
            {children}
        </button>
    );

    return (
        <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Vision, Mission, and Goals Page</h2>
                    <p className="text-sm text-gray-600">Configure content</p>
                </div>

                <div className="mb-8">
                    <h3 className="mb-4 text-base font-semibold text-gray-900">Page Content</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Introduction</label>
                            <Textarea
                                placeholder="Enter your page introduction..."
                                autoResize
                                minHeight={100}
                                maxHeight={250}
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                            <Textarea
                                placeholder="Enter your page description..."
                                autoResize
                                minHeight={100}
                                maxHeight={250}
                            />
                        </div>
                    </div>
                </div>

                <Separator className="my-10 bg-gray-200" />

                <div className="mb-8">
                    <h3 className="mb-4 text-base font-semibold text-gray-900">Vision & Mission</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Vision</label>
                            <Textarea
                                placeholder="Enter vision..."
                                autoResize
                                minHeight={100}
                                maxHeight={250}
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">Mission</label>
                            <Textarea
                                placeholder="Enter mission..."
                                autoResize
                                minHeight={100}
                                maxHeight={250}
                            />
                        </div>
                    </div>
                </div>

                <Separator className="my-10 bg-gray-200" />

                <div className="mb-6">
                    <h3 className="mb-4 text-base font-semibold text-gray-900">University Development Plan</h3>
                    <div className="grid gap-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-6">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">YouTube Link</label>
                                    <Input placeholder="https://www.youtube.com/watch?v=..." />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Video Title</label>
                                    <Input placeholder="Enter video title..." />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-2 block text-sm font-medium text-gray-700">Video Description</label>
                                <Textarea className="flex-1" placeholder="Enter video description..." />
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-10 bg-gray-200" />

                {/* --- University Strategic Goals --- */}
                <div className="mb-6">
                    <h3 className="mb-4 text-base font-semibold text-gray-900">University Strategic Goals</h3>
                    <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                        {/* Left Pane: Pillar List */}
                        <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-6">
                            <h4 className="mb-3 text-xs text-gray-500">Select a Pillar</h4>
                            <div className="space-y-1">
                                {pillars.map((pillar, index) => (
                                    <div
                                        key={pillar.id}
                                        onClick={() => {
                                            setSelectedPillarId(pillar.id);
                                            handleCancelAddItem();
                                            handleCancelEditItem();
                                        }}
                                        className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-4 transition-colors ${
                                            pillar.id === selectedPillarId ? 'bg-[#7f1414]/4' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="truncate text-sm">
                                            <div
                                                className={` ${pillar.id === selectedPillarId ? 'font-normal text-red-900' : 'text-gray-700'} flex gap-2 truncate`}
                                            >
                                                <div className={`font-normal ${pillar.id === selectedPillarId ? 'text-red-800' : 'text-red-600/70'}`}>
                                                    {index + 1}
                                                </div>
                                                {'    '}
                                                <div className="truncate">{pillar.title}</div>
                                            </div>
                                        </div>

                                        <div
                                            className={`flex items-center space-x-0.5 transition-opacity ${
                                                pillar.id === selectedPillarId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                            }`}
                                        >
                                            <ActionButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShowEditPillarModal(pillar);
                                                }}
                                                className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                            >
                                                <EditIcon className="h-4 w-4" />
                                            </ActionButton>
                                            <ActionButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deletePillar(pillar.id);
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
                                    onClick={addPillar}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add New Pillar
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
                                    <h4 className="mb-1 truncate text-lg font-medium text-gray-900">{selectedPillar.title}</h4>
                                    <p className="mb-6 truncate text-xs font-normal text-gray-600">
                                        List of the Pillar {selectedPillarIndex + 1} Items
                                    </p>

                                    {/* List of Items */}
                                    <div className="max-h-[250px] space-y-4 overflow-y-auto pr-2">
                                        {selectedPillar.items.length === 0 && addingItemToPillarId !== selectedPillar.id && (
                                            <p className="text-sm text-gray-500 italic">No items have been added to this pillar yet.</p>
                                        )}

                                        {selectedPillar.items.map((item) => (
                                            <div key={item.id}>
                                                {/* --- EXISTING ITEM DISPLAY --- */}
                                                <div
                                                    className={`group cursor-pointer items-center justify-between rounded-md border border-gray-100 bg-white p-2 transition-all hover:border-red-200 ${editingItemId === item.id ? 'hidden' : 'flex'}`}
                                                >
                                                    <span className="flex-1 px-2 text-sm text-gray-700">{item.description}</span>
                                                    <div className="flex items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                        <ActionButton onClick={() => handleShowEditItemForm(item)}>
                                                            <EditIcon className="h-4 w-4" />
                                                        </ActionButton>
                                                        <ActionButton
                                                            onClick={() => deleteItem(selectedPillar.id, item.id)}
                                                            className="hover:text-red-500"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </ActionButton>
                                                    </div>
                                                </div>

                                                {/* --- INLINE EDIT FORM --- */}
                                                <div
                                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${editingItemId === item.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} `}
                                                >
                                                    <div className="rounded-md border border-gray-200 bg-white p-6">
                                                        <label className="mb-2 block text-sm font-medium text-gray-700">Edit Item Description</label>
                                                        <Textarea
                                                            placeholder="Enter item description..."
                                                            value={editItemDescription}
                                                            onChange={(e) => setEditItemDescription(e.target.value)}
                                                            autoFocus
                                                            autoResize
                                                            minHeight={80}
                                                        />
                                                        <div className="mt-4 flex justify-end space-x-3">
                                                            <button
                                                                type="button"
                                                                onClick={handleCancelEditItem}
                                                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={handleConfirmEditItem}
                                                                className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                                                            >
                                                                Save Changes
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* --- Inline Add Item Form --- */}
                                    <div className="mt-6">
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${addingItemToPillarId === selectedPillar.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'} `}
                                        >
                                            <div className="rounded-md border border-gray-200 bg-white p-6">
                                                <label className="mb-2 block text-sm font-medium text-gray-700">New Item Description</label>
                                                <Textarea
                                                    placeholder="Enter item description..."
                                                    value={newItemDescription}
                                                    onChange={(e) => setNewItemDescription(e.target.value)}
                                                    autoFocus
                                                    autoResize
                                                    minHeight={80}
                                                />
                                                <div className="mt-4 flex justify-end space-x-3">
                                                    <Button
                                                        type="button"
                                                        onClick={handleCancelAddItem}
                                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={handleConfirmAddItem}
                                                        className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                                                    >
                                                        Save Item
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            className={`transition-all duration-300 ease-in-out ${addingItemToPillarId === selectedPillar.id || editingItemId !== null ? 'invisible max-h-0 opacity-0' : 'max-h-[100px] opacity-100'} `}
                                        >
                                            <Button
                                                onClick={handleShowAddItemForm}
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

                <Separator className="my-10 bg-gray-200" />

                <div className="mb-6">
                    <h3 className="mb-4 text-base font-semibold text-gray-900">PUP San Juan Campus Goals</h3>

                    <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                        {/* Left Pane: Goal List */}
                        <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-6">
                            <h4 className="mb-3 text-xs text-gray-500">Select a Goal</h4>
                            <div className="space-y-1">
                                {campusGoals.map((goal, index) => (
                                    <div
                                        key={goal.id}
                                        onClick={() => {
                                            setSelectedGoalId(goal.id);
                                        }}
                                        className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-4 transition-colors ${
                                            goal.id === selectedGoalId ? 'bg-[#7f1414]/4' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="truncate text-sm">
                                            <div
                                                className={` ${goal.id === selectedGoalId ? 'font-normal text-red-900' : 'text-gray-700'} flex gap-2 truncate`}
                                            >
                                                <div className={`font-normal ${goal.id === selectedGoalId ? 'text-red-800' : 'text-red-600/70'}`}>
                                                    {index + 1}
                                                </div>
                                                {'    '}
                                                <div className="truncate">{goal.title}</div>
                                            </div>
                                        </div>

                                        <div
                                            className={`flex items-center space-x-0.5 transition-opacity ${
                                                goal.id === selectedGoalId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                            }`}
                                        >
                                            <ActionButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShowEditGoalModal(goal);
                                                }}
                                                className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                            >
                                                <EditIcon className="h-4 w-4" />
                                            </ActionButton>
                                            <ActionButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteGoal(goal.id);
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
                                    onClick={handleShowAddGoalModal}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add New Goal
                                </Button>
                            </div>
                        </div>

                        {/* Right Pane: Goal Details */}
                        <div className="w-2/3 p-6">
                            {!selectedGoal ? (
                                <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                                    <X className="mb-2 h-8 w-8" />
                                    <p className="font-medium">No Goal Selected</p>
                                    <p className="text-sm">Select a goal on the left or click "Add New Goal" to start.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="mb-1 text-lg font-semibold break-words text-gray-900">{selectedGoal.title}</h4>
                                        <p className="text-xs font-normal text-gray-600">Goal {selectedGoalIndex + 1} - English Details</p>
                                        <p className="mt-2 text-sm text-gray-700">{selectedGoal.description}</p>
                                    </div>

                                    <Separator className="bg-gray-200" />

                                    <div>
                                        <h4 className="mb-1 text-lg font-semibold break-words text-gray-900">{selectedGoal.title_filipino}</h4>
                                        <p className="text-xs font-normal text-gray-600">Goal {selectedGoalIndex + 1} - Filipino Details</p>
                                        <p className="mt-2 text-sm text-gray-700 italic">{selectedGoal.description_filipino}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Add Pillar Modal --- */}
            {isAddPillarModalOpen && (
                <div className="animate-in fade-in-0 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="animate-in fade-in-0 zoom-in-95 w-full max-w-md rounded-lg bg-white p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Add New Pillar</h3>
                            <button
                                onClick={() => setIsAddPillarModalOpen(false)}
                                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="mt-6">
                            <label className="mb-2 block text-sm font-medium text-gray-700">Pillar Title</label>
                            <Input
                                placeholder="e.g., Teaching and Learning"
                                value={newPillarTitle}
                                onChange={(e) => setNewPillarTitle(e.target.value)}
                                autoFocus
                            />
                            <p className="mt-2 text-xs text-gray-500">This will be added as Pillar {pillars.length + 1}.</p>
                        </div>
                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setIsAddPillarModalOpen(false)}
                                className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAddPillar}
                                className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                            >
                                Add Pillar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- EDIT PILLAR MODAL --- */}
            {isEditPillarModalOpen && (
                <div className="animate-in fade-in-0 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="animate-in fade-in-0 zoom-in-95 w-full max-w-md rounded-lg bg-white p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Pillar Title</h3>
                            <button onClick={handleCancelEditPillar} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="mt-6">
                            <label className="mb-2 block text-sm font-medium text-gray-700">Pillar Title</label>
                            <Input
                                placeholder="e.g., Teaching and Learning"
                                value={editPillarTitle}
                                onChange={(e) => setEditPillarTitle(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleCancelEditPillar}
                                className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmEditPillar}
                                className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- ADD/EDIT CAMPUS GOAL MODAL --- */}
            {isGoalModalOpen && (
                <div className="animate-in fade-in-0 fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="animate-in fade-in-0 zoom-in-95 w-full max-w-2xl rounded-lg bg-white p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">{editingGoal ? 'Edit Campus Goal' : 'Add New Campus Goal'}</h3>
                            <button onClick={resetGoalForm} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Form Grid */}
                        <div className="mt-6 grid max-h-[70vh] grid-cols-1 gap-6 overflow-y-auto pr-2 md:grid-cols-2">
                            {/* English Column */}
                            <div className="space-y-6">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Title (English)</label>
                                    <Input
                                        placeholder="e.g., Academic Excellence"
                                        value={goalFormData.title}
                                        onChange={(e) => setGoalFormData({ ...goalFormData, title: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Description (English)</label>
                                    <Textarea
                                        placeholder="Enter English description..."
                                        value={goalFormData.description}
                                        onChange={(e) => setGoalFormData({ ...goalFormData, description: e.target.value })}
                                        autoResize
                                        minHeight={150}
                                        maxHeight={300}
                                    />
                                </div>
                            </div>

                            {/* Filipino Column */}
                            <div className="space-y-6">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Title (Filipino)</label>
                                    <Input
                                        placeholder="e.g., Kahusayang Pang-Akademiko"
                                        value={goalFormData.title_filipino}
                                        onChange={(e) => setGoalFormData({ ...goalFormData, title_filipino: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Description (Filipino)</label>
                                    <Textarea
                                        placeholder="Enter Filipino description..."
                                        value={goalFormData.description_filipino}
                                        onChange={(e) => setGoalFormData({ ...goalFormData, description_filipino: e.target.value })}
                                        autoResize
                                        minHeight={150}
                                        maxHeight={300}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={resetGoalForm}
                                className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmSaveGoal}
                                className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                            >
                                {editingGoal ? 'Save Changes' : 'Add Goal'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <SectionFooter onSave={handleSave} onPreview={handlePreview} />
        </div>
    );
};

export default VmgoContentSection;
