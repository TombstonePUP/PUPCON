import { Input } from '@/components/ui/input';
import SectionFooter from '@/components/ui/section-footer';
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/text-area';
import ImageUploader from '@/components/imageuploader';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { EditIcon, Plus, Trash2, X, ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

type Facility = {
    id: number;
    name: string;
    description: string;
    image_url: string | null;
};

const initialFacilities: Facility[] = [
    {
        id: 1,
        name: 'Library',
        description: 'PUP San Juan now uses a computerized library system to improve service efficiency. It allows users to locate resources, borrow books and...',
        image_url: '/images/facilities/library.png',
    },
    {
        id: 2,
        name: 'Conference Room',
        description: 'The Conference Room is a space accessible to faculty members and students— designed for meetings, presentations, and collaborative...',
        image_url: '/images/facilities/conference-room.png', 
    },
    {
        id: 3,
        name: 'Computer Laboratories',
        description: 'The Computer Laboratory provides students with access to computers for quizzes, defenses, and other activities requiring multiple workstations. It...',
        image_url: '/images/facilities/comlab.png',
    },
];

const getNewId = (arr: { id: number }[]) => (arr.length > 0 ? Math.max(...arr.map(item => item.id)) + 1 : 1);

const FacilityPhoto: React.FC<{ url: string | null; alt: string }> = ({ url, alt }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [url]);

    if (!url || hasError) {
        return (
            <div className="w-full h-64 rounded-md bg-gray-100 border border-gray-200 flex flex-col items-center justify-center text-gray-500 animate-in fade-in-0">
                <ImageIcon className="h-12 w-12 text-gray-400" />
                <span className="mt-2 text-sm">No Image Available</span>
            </div>
        );
    }

    return (
        <img 
            src={url} 
            alt={alt}
            className="w-full h-64 rounded-md object-cover bg-gray-100 border border-gray-200 animate-in fade-in-0"
            onError={() => setHasError(true)}
        />
    );
};


const FacilitiesContentSection: React.FC = () => {
    const [pageData, setPageData] = useState({
        title: 'Campus Facilities',
        subtitle: 'PUP San Juan Campus is equipped with modern facilities designed to support academic excellence and student development. Our state-of-the-art infrastructure provides an optimal learning environment for all students, faculty, and staff. Explore our comprehensive range of facilities that make learning engaging, collaborative, and effective.',
    });

    const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
    const [selectedFacilityId, setSelectedFacilityId] = useState<number | null>(initialFacilities[0]?.id || null);
    
    const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false);
    const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
    const [facilityFormData, setFacilityFormData] = useState({
        name: '',
        description: '',
    });
    const [facilityPhoto, setFacilityPhoto] = useState<File | null>(null);

    const selectedFacility = facilities.find((p) => p.id === selectedFacilityId);

    useEffect(() => {
        const blobUrls = facilities
            .map(p => p.image_url)
            .filter(url => url && url.startsWith('blob:')) as string[];
        
        return () => {
            blobUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [facilities]);

    const handleChange = (field: string, value: string) => {
        setPageData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        console.log('Saving Facilities Page...', { pageData, facilities });
    };

    const handlePreview = () => {
        window.open('/about/facilities', '_blank'); 
    };

    const resetFacilityForm = () => {
        setEditingFacility(null);
        setFacilityFormData({ name: '', description: '' });
        setFacilityPhoto(null);
        setIsFacilityModalOpen(false);
    };

    const handleShowAddFacilityModal = () => {
        resetFacilityForm();
        setIsFacilityModalOpen(true);
    };

    const handleShowEditFacilityModal = (facility: Facility) => {
        setEditingFacility(facility);
        setFacilityFormData({
            name: facility.name,
            description: facility.description,
        });
        setFacilityPhoto(null);
        setIsFacilityModalOpen(true);
    };

    const handleDeleteFacility = (id: number) => {
        if (window.confirm('Are you sure you want to delete this facility?')) {
            const updatedFacilities = facilities.filter(p => p.id !== id);
            setFacilities(updatedFacilities);
            if (selectedFacilityId === id) {
                setSelectedFacilityId(updatedFacilities[0]?.id || null);
            }
        }
    };

    const handleConfirmSaveFacility = () => {
        if (!facilityFormData.name.trim()) {
            alert('Facility Name cannot be empty.');
            return;
        }
        
        let newImageUrl: string | null = null;
        if (facilityPhoto) {
            newImageUrl = URL.createObjectURL(facilityPhoto);
        } else if (editingFacility) {
            newImageUrl = editingFacility.image_url;
        }

        if (editingFacility) {
            const updatedFacility = {
                ...editingFacility,
                ...facilityFormData,
                image_url: newImageUrl,
            };
            setFacilities(facilities.map(p => p.id === editingFacility.id ? updatedFacility : p));
        } else {
            const newId = getNewId(facilities);
            const newFacility: Facility = {
                id: newId,
                ...facilityFormData,
                image_url: newImageUrl,
            };
            setFacilities([...facilities, newFacility]);
            setSelectedFacilityId(newId);
        }
        resetFacilityForm();
    };


    return (
        <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Facilities Page</h2>
                    <p className="text-sm text-gray-600">Configure page content</p>
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
                            // @ts-ignore
                            autoResize
                            minHeight={100}
                        />
                    </div>
                </div>

                <Separator className="my-10 bg-gray-200" />

                {/* --- Campus Facilities Section --- */}
                <div className="mb-6">
                    <h3 className="mb-4 text-base font-semibold text-gray-900">Campus Facilities</h3>

                    <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                        {/* Left Pane: Facility List */}
                        <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-6">
                            <h4 className="mb-3 text-xs text-gray-500">Select a Facility</h4>
                            <div className="space-y-1">
                                {facilities.map((facility) => (
                                    <div
                                        key={facility.id}
                                        onClick={() => {
                                            setSelectedFacilityId(facility.id);
                                        }}
                                        className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-4 transition-colors ${
                                            facility.id === selectedFacilityId ? 'bg-[#7f1414]/4' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="truncate text-sm">
                                            <span className={` ${facility.id === selectedFacilityId ? 'font-normal text-red-900' : 'text-gray-700'}`}>
                                                {facility.name}
                                            </span>
                                        </div>
                                        <div
                                            className={`flex items-center space-x-0.5 transition-opacity ${
                                                facility.id === selectedFacilityId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                            }`}
                                        >
                                            <ActionButton
                                                onClick={(e) => { e.stopPropagation(); handleShowEditFacilityModal(facility); }}
                                                className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                            >
                                                <EditIcon className="h-4 w-4" />
                                            </ActionButton>
                                            <ActionButton
                                                onClick={(e) => { e.stopPropagation(); handleDeleteFacility(facility.id); }}
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
                                    onClick={handleShowAddFacilityModal}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add New Facility
                                </Button>
                            </div>
                        </div>

                        {/* Right Pane: Facility Details */}
                        <div className="w-2/3 p-6">
                            {!selectedFacility ? (
                                <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                                    <X className="mb-2 h-8 w-8" />
                                    <p className="font-medium">No Facility Selected</p>
                                    <p className="text-sm">Select a facility on the left or click "Add New Facility" to start.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="rounded-lg overflow-hidden border border-gray-100">
                                        <FacilityPhoto url={selectedFacility.image_url} alt={selectedFacility.name} />
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 break-words">{selectedFacility.name}</h4>
                                    </div>

                                    <Separator className="bg-gray-200" />
                                    
                                    <div>
                                        <h5 className="mb-2 text-sm font-semibold text-gray-700">Description</h5>
                                        <p className="text-sm text-gray-700">{selectedFacility.description}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <SectionFooter onSave={handleSave} onPreview={handlePreview} />

            {/* --- Add/Edit Facility Modal --- */}
            {isFacilityModalOpen && (
                <div 
                    data-state="open"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-in fade-in-0"
                >
                    <div 
                        data-state="open"
                        className="w-full max-w-lg rounded-lg bg-white p-6 animate-in fade-in-0 zoom-in-95"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingFacility ? 'Edit Facility' : 'Add New Facility'}
                            </h3>
                            <button onClick={resetFacilityForm} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Facility Photo</Label>
                                <ImageUploader
                                    initialImage={editingFacility?.image_url || null}
                                    onImageChange={(file) => setFacilityPhoto(file as File)}
                                    uploadText="Upload photo"
                                    changeText="Change photo"
                                    sizeText="PNG, JPG"
                                />
                            </div>

                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Facility Name</Label>
                                <Input
                                    placeholder="e.g., Library"
                                    value={facilityFormData.name}
                                    onChange={(e) => setFacilityFormData({ ...facilityFormData, name: e.target.value })}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Description</Label>
                                <Textarea
                                    placeholder="Enter a description for the facility..."
                                    value={facilityFormData.description}
                                    onChange={(e) => setFacilityFormData({ ...facilityFormData, description: e.target.value })}
                                    autoResize
                                    minHeight={100}
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                            <button type="button" onClick={resetFacilityForm} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Cancel
                            </button>
                            <button type="button" onClick={handleConfirmSaveFacility} className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition">
                                {editingFacility ? 'Save Changes' : 'Add Facility'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacilitiesContentSection;

