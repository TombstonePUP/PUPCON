import { Input } from '@/components/ui/input';
import SectionFooter from '@/components/ui/section-footer';
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/text-area';
import ImageUploader from '@/components/imageuploader';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { EditIcon, Plus, Trash2, X, ImageIcon, User } from 'lucide-react';
import { Label } from '@/components/ui/label';

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

type Official = {
    id: number;
    name: string;
    position: string;
    sub_position?: string | null;
    image_url: string | null;
};

type AreaMember = {
    id: number;
    name: string;
};

type CoChair = {
    id: number;
    name: string;
};

type TaskForceArea = {
    id: number;
    name: string;
    chairman_name: string;
    chairman_image_url: string | null;
    co_chairmen: CoChair[];
    members: AreaMember[];
    co_chairman_image_url: string | null;
};

const initialHeadOfficials: Official[] = [
    {
        id: 1,
        name: 'Dr. Cecilia Reyes-Alagon',
        position: 'Overall Chairman',
        sub_position: 'Campus Director',
        image_url: '/images/taskforce/alagon.png',
    },
    {
        id: 2,
        name: 'Asst. Prof. Maria Carina Paz-Corpuz',
        position: 'Accreditation Coordinator',
        sub_position: 'Quality Assurance Coordinator',
        image_url: '/images/taskforce/corpuz.png',
    },
];

const initialAreas: TaskForceArea[] = [
    {
        id: 1,
        name: 'Area I: Vision, Mission, Goals and Objectives',
        chairman_name: 'Elias Austria',
        chairman_image_url: '/images/taskforce/austria.png',
        co_chairmen: [{id: 1, name: 'Dr. Co Chair 1'}],
        members: [
            { id: 101, name: 'Assoc. Prof. Rizza Validez-De-Vera' },
            { id: 102, name: 'Inst. Raymond Ruiz' },
        ],
        co_chairman_image_url: null,
    },
    {
        id: 2,
        name: 'Area II: Faculty',
        chairman_name: 'Dr. Maria Elsa S. T. Ysulat',
        chairman_image_url: '/images/taskforce/ysulat.png',
        co_chairmen: [],
        members: [],
        co_chairman_image_url: null,
    },
];

const getNewId = (arr: { id: number }[]) => (arr.length > 0 ? Math.max(...arr.map(item => item.id)) + 1 : 1);

const OfficialPhoto: React.FC<{ url: string | null; alt: string; heightClass?: string }> = ({ url, alt, heightClass = 'h-64' }) => {
    const [hasError, setHasError] = useState(false);
    useEffect(() => { setHasError(false); }, [url]);

    if (!url || hasError) {
        return (
            <div className={`w-full ${heightClass} rounded-md bg-gray-100 border border-gray-200 flex flex-col items-center justify-center text-gray-500`}>
                <ImageIcon className="h-12 w-12 text-gray-400" />
                <span className="mt-2 text-sm">No Image</span>
            </div>
        );
    }
    return (
        <img
            src={url}
            alt={alt}
            className={`w-full ${heightClass} rounded-md object-cover bg-gray-100 border border-gray-200`}
            onError={() => setHasError(true)}
        />
    );
};

const LocalTaskForceContentSection: React.FC = () => {
    // --- State for main page ---
    const [pageData, setPageData] = useState({
        title: 'Local Task Force',
        subtitle: 'The Local Task Force at PUP San Juan Campus is dedicated to ensuring the safety and well-being of all students, faculty, and staff. Our team works collaboratively with local authorities and community organizations to address any issues that may arise on campus. We are committed to fostering a secure and supportive environment for everyone.',
    });

    // --- State for Head Officials ---
    const [headOfficials, setHeadOfficials] = useState(initialHeadOfficials);
    const [isHeadOfficialModalOpen, setIsHeadOfficialModalOpen] = useState(false);
    const [editingOfficial, setEditingOfficial] = useState<Official | null>(null);
    const [officialFormData, setOfficialFormData] = useState({ name: '', position: '', sub_position: '' });
    const [officialPhoto, setOfficialPhoto] = useState<File | null>(null);

    // --- State for Areas ---
    const [areas, setAreas] = useState<TaskForceArea[]>(initialAreas);

    // --- Area Modal State ---
    const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
    const [editingArea, setEditingArea] = useState<TaskForceArea | null>(null);
    const [areaFormData, setAreaFormData] = useState({ name: '', chairman_name: '', co_chairmen: '', members: '' });
    const [areaChairPhoto, setAreaChairPhoto] = useState<File | null>(null);

    const [selectedItem, setSelectedItem] = useState<{ type: 'official' | 'area', id: number | string }>({ type: 'official', id: 1 });

    const selectedOfficial = selectedItem.type === 'official' ? headOfficials.find(o => o.id === selectedItem.id) : null;
    const selectedArea = selectedItem.type === 'area' ? areas.find(a => a.id === selectedItem.id) : null;


    useEffect(() => {
        const officialUrls = headOfficials.map(o => o.image_url);
        const areaChairUrls = areas.map(a => a.chairman_image_url);
        const blobUrls = [...officialUrls, ...areaChairUrls]
            .filter(url => url && url.startsWith('blob:')) as string[];

        return () => {
            blobUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [headOfficials, areas]);

    // --- Page Handlers ---
    const handleChange = (field: string, value: string) => {
        setPageData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        console.log('Saving Local Task Force Page...', { pageData, headOfficials, areas });
    };

    const handlePreview = () => {
        window.open('/about/local-task-force', '_blank');
    };

    // --- Head Official CRUD Actions ---
    const resetHeadOfficialForm = () => {
        setEditingOfficial(null);
        setOfficialFormData({ name: '', position: '', sub_position: '' });
        setOfficialPhoto(null);
        setIsHeadOfficialModalOpen(false);
    };

    const handleShowAddHeadOfficialModal = () => {
        resetHeadOfficialForm();
        setIsHeadOfficialModalOpen(true);
    };

    const handleShowEditHeadOfficialModal = (official: Official) => {
        setEditingOfficial(official);
        setOfficialFormData({
            name: official.name,
            position: official.position,
            sub_position: official.sub_position || '',
        });
        setOfficialPhoto(null);
        setIsHeadOfficialModalOpen(true);
    };

    const handleDeleteHeadOfficial = (id: number) => {
        if (window.confirm('Are you sure you want to delete this head official?')) {
            const updatedOfficials = headOfficials.filter(o => o.id !== id);
            setHeadOfficials(updatedOfficials);
            if (selectedItem.type === 'official' && selectedItem.id === id) {
                setSelectedItem({ type: 'official', id: headOfficials[0]?.id || 0 });
            }
        }
    };

    const handleConfirmSaveHeadOfficial = () => {
        if (!officialFormData.name) return;

        let newImageUrl: string | null = null;
        if (officialPhoto) {
            newImageUrl = URL.createObjectURL(officialPhoto);
        } else if (editingOfficial) {
            newImageUrl = editingOfficial.image_url;
        }

        if (editingOfficial) {
            const updatedOfficial: Official = {
                ...editingOfficial,
                ...officialFormData,
                image_url: newImageUrl,
            };
            setHeadOfficials(headOfficials.map(o => o.id === editingOfficial.id ? updatedOfficial : o));
        } else {
            const newId = getNewId(headOfficials);
            const newOfficial: Official = {
                id: newId,
                ...officialFormData,
                image_url: newImageUrl,
            };
            setHeadOfficials([...headOfficials, newOfficial]);
            setSelectedItem({ type: 'official', id: newId });
        }
        resetHeadOfficialForm();
    };

    // --- Area CRUD Actions ---
    const resetAreaForm = () => {
        setEditingArea(null);
        setAreaFormData({ name: '', chairman_name: '', co_chairmen: '', members: '' });
        setAreaChairPhoto(null);
        setIsAreaModalOpen(false);
    };

    const handleShowAddAreaModal = () => {
        resetAreaForm();
        setIsAreaModalOpen(true);
    };

    const handleShowEditAreaModal = (area: TaskForceArea) => {
        setEditingArea(area);
        setAreaFormData({
            name: area.name,
            chairman_name: area.chairman_name,
            co_chairmen: area.co_chairmen.map(c => c.name).join('\n'),
            members: area.members.map(m => m.name).join('\n'),
        });
        setAreaChairPhoto(null);
        setIsAreaModalOpen(true);
    };

    const handleDeleteArea = (id: number) => {
        if (window.confirm('Are you sure you want to delete this area?')) {
            const updatedAreas = areas.filter(a => a.id !== id);
            setAreas(updatedAreas);
            if (selectedItem.type === 'area' && selectedItem.id === id) {
                setSelectedItem({ type: 'official', id: headOfficials[0]?.id || 0 });
            }
        }
    };

    const handleConfirmSaveArea = () => {
        if (!areaFormData.name || !areaFormData.chairman_name) {
            alert('Area Name and Chairman Name cannot be empty.');
            return;
        }

        let newChairImageUrl: string | null = null;
        if (areaChairPhoto) {
            newChairImageUrl = URL.createObjectURL(areaChairPhoto);
        } else if (editingArea) {
            newChairImageUrl = editingArea.chairman_image_url;
        }

        const newCoChairmen: CoChair[] = areaFormData.co_chairmen
            .split('\n')
            .filter(name => name.trim() !== '')
            .map((name, index) => ({
                id: getNewId(editingArea?.co_chairmen || []) + index,
                name: name.trim(),
            }));

        const newMembers: AreaMember[] = areaFormData.members
            .split('\n')
            .filter(name => name.trim() !== '')
            .map((name, index) => ({
                id: getNewId(editingArea?.members || []) + index,
                name: name.trim(),
            }));

        if (editingArea) {
            const updatedArea = {
                ...editingArea,
                name: areaFormData.name,
                chairman_name: areaFormData.chairman_name,
                chairman_image_url: newChairImageUrl,
                co_chairmen: newCoChairmen,
                members: newMembers,
            };
            setAreas(areas.map(a => a.id === editingArea.id ? updatedArea : a));
        } else {
            const newId = getNewId(areas);
            const newArea: TaskForceArea = {
                id: newId,
                name: areaFormData.name,
                chairman_name: areaFormData.chairman_name,
                chairman_image_url: newChairImageUrl,
                co_chairmen: newCoChairmen,
                members: newMembers,
                co_chairman_image_url: null,
            };
            setAreas([...areas, newArea]);
            setSelectedItem({ type: 'area', id: newId });
        }
        resetAreaForm();
    };

    return (
        <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Local Task Force Page</h2>
                    <p className="text-sm text-gray-600">Configure content</p>
                </div>

                <div className="mb-10 grid grid-cols-1 gap-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                        <Input
                            type="text"
                            placeholder="Enter page title..."
                            value={pageData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Subtitle / Description</label>
                        <Textarea
                            placeholder="Enter page subtitle..."
                            value={pageData.subtitle}
                            onChange={(e) => handleChange('subtitle', e.target.value)}
                            autoResize
                            minHeight={100}
                        />
                    </div>
                </div>

                <Separator className="my-10 bg-gray-200" />

                {/* --- Task Force Officials & Areas Section --- */}
                <div className="mb-6">
                    <h3 className="mb-4 text-base font-semibold text-gray-900">Task Force Officials & Areas</h3>

                    <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                        {/* Left Pane: Area List */}
                        <div className="w-1/2 border-r border-gray-200 bg-gray-50/50 p-6 flex flex-col justify-between">
                            {/* Top part: List */}
                            <div className="max-h-[400px] overflow-y-auto pr-2">
                                <h4 className="mb-3 text-xs text-gray-500">Head Officials</h4>
                                <div className="space-y-1 mb-4">
                                    {headOfficials.map((official) => (
                                        <div
                                            key={official.id}
                                            onClick={() => setSelectedItem({ type: 'official', id: official.id })}
                                            className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-3 transition-colors ${
                                                selectedItem.type === 'official' && selectedItem.id === official.id ? 'bg-[#7f1414]/4 ' : 'bg-white hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 truncate text-sm">
                                                <User className="h-4 w-4 flex-shrink-0 text-gray-500" />
                                                <span className={` ${selectedItem.type === 'official' && selectedItem.id === official.id ? 'font-normal text-red-900' : 'text-gray-700'}`}>
                                                    {official.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-0.5">
                                                <ActionButton
                                                    onClick={(e) => { e.stopPropagation(); handleShowEditHeadOfficialModal(official); }}
                                                    className="cursor-pointer rounded-md text-gray-400 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <EditIcon className="h-4 w-4" />
                                                </ActionButton>
                                                <ActionButton
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteHeadOfficial(official.id); }}
                                                    className="cursor-pointer rounded-md text-gray-400 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </ActionButton>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                <h4 className="my-3 text-xs text-gray-500">Task Force Areas</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {areas.map((area) => (
                                        <div
                                            key={area.id}
                                            onClick={() => setSelectedItem({ type: 'area', id: area.id })}
                                            className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-3 transition-colors ${
                                                selectedItem.type === 'area' && selectedItem.id === area.id ? 'bg-[#7f1414]/4 ' : 'bg-white  hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="truncate text-sm">
                                                <span className={` ${selectedItem.type === 'area' && selectedItem.id === area.id ? 'font-normal text-red-900' : 'text-gray-700'}`}>
                                                    {area.name}
                                                </span>
                                            </div>
                                            <div
                                                className={`flex items-center space-x-0.5 transition-opacity ${
                                                    selectedItem.type === 'area' && selectedItem.id === area.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                                }`}
                                            >
                                                <ActionButton
                                                    onClick={(e) => { e.stopPropagation(); handleShowEditAreaModal(area); }}
                                                    className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                                >
                                                    <EditIcon className="h-4 w-4" />
                                                </ActionButton>
                                                <ActionButton
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteArea(area.id); }}
                                                    className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </ActionButton>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom part: Add Buttons */}
                            <div className="mt-4 border-t border-gray-200 pt-4 space-y-2 flex gap-3">
                                <Button
                                    onClick={handleShowAddHeadOfficialModal}
                                    variant="outline"
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add Head Official
                                </Button>
                                <Button
                                    onClick={handleShowAddAreaModal}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add New Area
                                </Button>
                            </div>
                        </div>

                        {/* Right Pane: Area Details */}
                        <div className="w-1/2 p-6 overflow-y-auto max-h-[500px]">
                            {!selectedArea && !selectedOfficial && (
                                <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                                    <X className="mb-2 h-8 w-8" />
                                    <p className="font-medium">No Item Selected</p>
                                    <p className="text-sm">Select an item on the left to see details.</p>
                                </div>
                            )}

                           {/* --- Official Details --- */}
                            {selectedOfficial && (
                                <div className="space-y-6">
                                    <div className="rounded-lg overflow-hidden border border-gray-100">
                                        <OfficialPhoto url={selectedOfficial.image_url} alt={selectedOfficial.name} heightClass="h-72" />
                                    </div>
                                    <div className="border rounded-md p-8">
                                        <h4 className="text-lg font-medium text-gray-900 break-words">{selectedOfficial.name}</h4>
                                        <p className="text-xs font-normal text-gray-400">
                                            {selectedOfficial.position}
                                            {selectedOfficial.sub_position && `, ${selectedOfficial.sub_position}`}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* --- Area Details --- */}
                            {selectedArea && (
                                <div className="space-y-6">
                                    <div>
                                        <h5 className="mb-2 text-sm font-semibold text-gray-700">Chairman</h5>
                                        <div className="flex items-center gap-6 mt-2">
                                            <img
                                                src={selectedArea.chairman_image_url || 'https://placehold.co/100x100/eeeeee/7f1414?text=No+Photo'}
                                                alt={selectedArea.chairman_name}
                                                className="w-16 h-16 text-gray-300 rounded-sm object-cover bg-gray-100 border border-gray-200 flex-shrink-0"
                                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100/eeeeee/7f1414?text=No+Photo')}
                                            />
                                            <div>
                                                <h4 className="text-lg font-medium text-gray-900 break-words">{selectedArea.chairman_name}</h4>
                                                <p className="text-xs font-normal text-gray-700">{selectedArea.name}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- Co-Chairmen List --- */}
                                    {selectedArea.co_chairmen.length > 0 && (
                                        <div>
                                           <h5 className="mb-2 text-sm font-semibold text-gray-700">Co-chairman</h5>
                                            <div className="space-y-3 mt-2">
                                                {selectedArea.co_chairmen.map(coChair => (
                                                    <div key={coChair.id} className="flex items-center gap-4">
                                                        <div className="w-16 h-16 rounded-sm bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center">
                                                            <User className="h-8 w-8 text-gray-400" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-medium text-gray-900 break-words">{coChair.name}</h4>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <Separator className="bg-gray-200" />

                                    <div>
                                        <h5 className="mb-2 text-sm font-semibold text-gray-700">Members</h5>
                                        {selectedArea.members.length === 0 ? (
                                            <p className="text-sm text-gray-500 italic">No members added to this area.</p>
                                        ) : (
                                            <ul className="list-disc list-inside space-y-1">
                                                {selectedArea.members.map(member => (
                                                    <li key={member.id} className="text-sm text-gray-700">{member.name}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <SectionFooter onSave={handleSave} onPreview={handlePreview} />

            {/* ---  Head Official Modal --- */}
            {isHeadOfficialModalOpen && (
                <div data-state="open" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-in fade-in-0">
                    <div data-state="open" className="w-full max-w-lg rounded-lg bg-white p-6 animate-in fade-in-0 zoom-in-95">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingOfficial ? 'Edit Head Official' : 'Add Head Official'}
                            </h3>
                            <button onClick={resetHeadOfficialForm} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Photo</Label>
                                <ImageUploader
                                    initialImage={editingOfficial?.image_url || null}
                                    onImageChange={(file) => setOfficialPhoto(file as File)}
                                    uploadText="Upload photo"
                                    changeText="Change photo"
                                    sizeText="PNG, JPG (400x400 recommended)"
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Name</Label>
                                <Input
                                    placeholder="Enter full name"
                                    value={officialFormData.name}
                                    onChange={(e) => setOfficialFormData(prev => ({ ...prev, name: e.target.value }))}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Position</Label>
                                <Input
                                    placeholder="e.g., Overall Chairman"
                                    value={officialFormData.position}
                                    onChange={(e) => setOfficialFormData(prev => ({ ...prev, position: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Sub-Position (Optional)</Label>
                                <Input
                                    placeholder="e.g., Campus Director"
                                    value={officialFormData.sub_position || ''}
                                    onChange={(e) => setOfficialFormData(prev => ({ ...prev, sub_position: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                            <button type="button" onClick={resetHeadOfficialForm} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Cancel
                            </button>
                            <button type="button" onClick={handleConfirmSaveHeadOfficial} className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition">
                                {editingOfficial ? 'Save Changes' : 'Add Official'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Area Modal --- */}
            {isAreaModalOpen && (
                <div data-state="open" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-in fade-in-0">
                    <div data-state="open" className="w-full max-w-4xl rounded-lg bg-white p-6 animate-in fade-in-0 zoom-in-95">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingArea ? 'Edit Task Force Area' : 'Add New Task Force Area'}
                            </h3>
                            <button onClick={resetAreaForm} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Area Name</Label>
                                    <Input
                                        placeholder="e.g., Area I: Vision, Mission..."
                                        value={areaFormData.name}
                                        onChange={(e) => setAreaFormData(prev => ({ ...prev, name: e.target.value }))}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Chairman Name</Label>
                                    <Input
                                        placeholder="Enter chairman's full name"
                                        value={areaFormData.chairman_name}
                                        onChange={(e) => setAreaFormData(prev => ({ ...prev, chairman_name: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Chairman Photo</Label>
                                    <ImageUploader
                                        initialImage={editingArea?.chairman_image_url || null}
                                        onImageChange={(file) => setAreaChairPhoto(file as File)}
                                        uploadText="Upload photo"
                                        changeText="Change photo"
                                        sizeText="PNG, JPG (400x400)"
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4 flex flex-col">
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Co-Chairmen (Optional)</Label>
                                    <Textarea
                                        placeholder="Enter one co-chairman name per line..."
                                        value={areaFormData.co_chairmen}
                                        onChange={(e) => setAreaFormData(prev => ({ ...prev, co_chairmen: e.target.value }))}
                                        autoResize
                                        minHeight={100}
                                    />
                                </div>

                                <div className="flex-1">
                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Members</Label>
                                    <Textarea
                                        placeholder="Enter one member name per line..."
                                        value={areaFormData.members}
                                        onChange={(e) => setAreaFormData(prev => ({ ...prev, members: e.target.value }))}
                                        autoResize
                                        minHeight={150}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                            <button type="button" onClick={resetAreaForm} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Cancel
                            </button>
                            <button type="button" onClick={handleConfirmSaveArea} className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition">
                                {editingArea ? 'Save Changes' : 'Add Area'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocalTaskForceContentSection;

