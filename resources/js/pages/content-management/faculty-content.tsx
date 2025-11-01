import { Input } from '@/components/ui/input';
import SectionFooter from '@/components/ui/section-footer';
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/text-area';
import ImageUploader from '@/components/imageuploader';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { EditIcon, Plus, Trash2, X, ImageIcon, QuoteIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

type FacultyMember = {
    id: number;
    name: string; 
    position: string;
    image_url: string | null;
    sort_order: number;
};

const initialFaculty: FacultyMember[] = [
    {
        id: 1,
        name: 'Alfeo Mendoza',
        position: 'Part Time',
        image_url: '/images/faculty/mendoza.png', 
        sort_order: 1,
    },
    {
        id: 2,
        name: 'Alfred Pagalilawan',
        position: 'Full Time',
        image_url: '/images/faculty/pagalilawan.png', 
        sort_order: 2,
    },
    {
        id: 3,
        name: 'Angeline Pabilona',
        position: 'Full Time',
        image_url: '/images/faculty/pabilona.png', 
        sort_order: 3,
    },
    {
        id: 4,
        name: 'Elias Austria',
        position: 'Full Time',
        image_url: null,
        sort_order: 4,
    },
    {
        id: 5,
        name: 'Noel Gagolinan',
        position: 'Full Time',
        image_url: null,
        sort_order: 5,
    },
];

const getNewId = (arr: { id: number }[]) => (arr.length > 0 ? Math.max(...arr.map(item => item.id)) + 1 : 1);

const FacultyPhoto: React.FC<{ url: string | null; alt: string }> = ({ url, alt }) => {
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
            className="w-full h-64 rounded-md object-cover bg-gray-100 border-gray-200 animate-in fade-in-0"
            onError={() => setHasError(true)}
        />
    );
};

const FacultyContentSection: React.FC = () => {
    const [pageData, setPageData] = useState({
        title: 'Meet the Minds Behind Our Success',
        subtitle: 'Our faculty members are not just teachers–they\'re mentors, innovators, and lifelong learners committed to shaping the future.',
    });

    const [quoteData, setQuoteData] = useState({
        text: 'Education is not preparation for life; education is life itself.',
        author: 'John Dewey, American Philosopher & Educator',
    });

    const [faculty, setFaculty] = useState<FacultyMember[]>(initialFaculty);
    const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(initialFaculty[0]?.id || null);
    
    const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
    const [editingFaculty, setEditingFaculty] = useState<FacultyMember | null>(null);
    const [facultyFormData, setFacultyFormData] = useState({
        name: '',
        position: '',
    });
    const [facultyPhoto, setFacultyPhoto] = useState<File | null>(null);

    const selectedFaculty = faculty.find((p) => p.id === selectedFacultyId);

    // Cleanup Blob URLs
    useEffect(() => {
        const blobUrls = faculty
            .map(p => p.image_url)
            .filter(url => url && url.startsWith('blob:')) as string[];
        
        return () => {
            blobUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [faculty]);

    const handleChange = (field: string, value: string) => {
        setPageData(prev => ({ ...prev, [field]: value }));
    };

    const handleQuoteChange = (field: string, value: string) => {
        setQuoteData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        console.log('Saving Faculty Page...', { pageData, quoteData, faculty });
    };

    const handlePreview = () => {
        window.open('/about/faculty', '_blank');
    };

    // --- Faculty CRUD Actions ---
    const resetFacultyForm = () => {
        setEditingFaculty(null);
        setFacultyFormData({ name: '', position: '' });
        setFacultyPhoto(null);
        setIsFacultyModalOpen(false);
    };

    const handleShowAddFacultyModal = () => {
        resetFacultyForm();
        setIsFacultyModalOpen(true);
    };

    const handleShowEditFacultyModal = (member: FacultyMember) => {
        setEditingFaculty(member);
        setFacultyFormData({
            name: member.name,
            position: member.position,
        });
        setFacultyPhoto(null);
        setIsFacultyModalOpen(true);
    };

    const handleDeleteFaculty = (id: number) => {
        if (window.confirm('Are you sure you want to delete this faculty member?')) {
            const updatedFaculty = faculty.filter(p => p.id !== id);
            setFaculty(updatedFaculty);
            if (selectedFacultyId === id) {
                setSelectedFacultyId(updatedFaculty[0]?.id || null);
            }
        }
    };

    const handleConfirmSaveFaculty = () => {
        if (!facultyFormData.name.trim() || !facultyFormData.position.trim()) {
            alert('Name and Position cannot be empty.');
            return;
        }
        
        let newImageUrl: string | null = null;
        if (facultyPhoto) {
            newImageUrl = URL.createObjectURL(facultyPhoto);
        } else if (editingFaculty) {
            newImageUrl = editingFaculty.image_url;
        }

        if (editingFaculty) {
            const updatedMember = {
                ...editingFaculty,
                ...facultyFormData,
                image_url: newImageUrl,
            };
            setFaculty(faculty.map(p => p.id === editingFaculty.id ? updatedMember : p));
        } else {
            const newSortOrder = faculty.length > 0 ? Math.max(...faculty.map(p => p.sort_order)) + 1 : 1;
            const newId = getNewId(faculty);
            const newMember: FacultyMember = {
                id: newId,
                sort_order: newSortOrder,
                ...facultyFormData,
                image_url: newImageUrl,
            };
            setFaculty([...faculty, newMember]);
            setSelectedFacultyId(newId);
        }
        resetFacultyForm();
    };


    return (
        <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Faculty & Staff Page</h2>
                    <p className="text-sm text-gray-600">Configure page content</p>
                </div>

                {/* --- Page Title/Subtitle & Quote Section --- */}
                <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Left Column: Title & Subtitle */}
                    <div className="space-y-6">
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
                            <label className="mb-2 block text-sm font-medium text-gray-700">Subtitle</label>
                            <Textarea
                                placeholder="Enter page subtitle..."
                                value={pageData.subtitle}
                                onChange={(e) => handleChange('subtitle', e.target.value)}
                                autoResize
                                minHeight={150}
                            />
                        </div>
                    </div>

                    {/* Right Column: Quote Section */}
                    <div className="rounded-lg border border-gray-200 p-6 bg-gray-50/50 flex flex-col">
                        <div className="flex flex-col flex-1 space-y-6">
                              <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Author</Label>
                                <Input 
                                    type="text" 
                                    placeholder="Enter author's name and title..." 
                                    value={quoteData.author}
                                    onChange={(e) => handleQuoteChange('author', e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Quote Text</Label>
                                <Textarea
                                    placeholder="Enter quote..."
                                    value={quoteData.text}
                                    onChange={(e) => handleQuoteChange('text', e.target.value)}
                                    autoResize
                                    minHeight={100}
                                    className="flex-1"
                                />
                            </div>
                          
                        </div>
                    </div>
                </div>


                <Separator className="my-10 bg-gray-200" />

                {/* --- Faculty List Section --- */}
                <div className="mb-6">
                    <h3 className="mb-4 text-base font-semibold text-gray-900">Faculty & Staff Members</h3>

                    <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                        <div className="w-2/3 border-r border-gray-200 bg-gray-50/50 p-6 flex flex-col justify-between">
                            <div>
                                <h4 className="mb-3 text-xs text-gray-500">Select a Member</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-2">
                                    {faculty.map((member) => (
                                        <div
                                            key={member.id}
                                            onClick={() => {
                                                setSelectedFacultyId(member.id);
                                            }}
                                            className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-3 transition-colors ${
                                                member.id === selectedFacultyId ? 'bg-[#7f1414]/4' : 'bg-white  border-gray-100 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div className="truncate text-sm">
                                                <span className={` ${member.id === selectedFacultyId ? 'font-normal text-red-900' : 'text-gray-700'}`}>
                                                    {member.name}
                                                </span>
                                            </div>
                                            <div
                                                className={`flex items-center space-x-0.5 transition-opacity ${
                                                    member.id === selectedFacultyId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                                }`}
                                            >
                                                <ActionButton
                                                    onClick={(e) => { e.stopPropagation(); handleShowEditFacultyModal(member); }}
                                                    className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                                >
                                                    <EditIcon className="h-4 w-4" />
                                                </ActionButton>
                                                <ActionButton
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteFaculty(member.id); }}
                                                    className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </ActionButton>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mt-4 border-t border-gray-200 pt-4">
                                <Button
                                    onClick={handleShowAddFacultyModal}
                                    className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-4 py-2 text-sm font-medium text-white transition h-9"
                                >
                                    <Plus className="h-4 w-4" /> Add New Member
                                </Button>
                            </div>
                        </div>

                        {/* Right Pane: Faculty Details */}
                        <div className="w-1/3 p-6">
                            {!selectedFaculty ? (
                                <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                                    <X className="mb-2 h-8 w-8" />
                                    <p className="font-medium">No Member Selected</p>
                                    <p className="text-sm">Select a member on the left to see details.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="rounded-lg overflow-hidden border border-gray-100 ">
                                        <FacultyPhoto url={selectedFaculty.image_url} alt={selectedFaculty.name} />
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 break-words">{selectedFaculty.name}</h4>
                                        <p className="text-sm font-normal text-red-700">{selectedFaculty.position}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <SectionFooter onSave={handleSave} onPreview={handlePreview} />

            {/* --- Add/Edit Faculty Modal --- */}
            {isFacultyModalOpen && (
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
                                {editingFaculty ? 'Edit Faculty Member' : 'Add New Faculty Member'}
                            </h3>
                            <button onClick={resetFacultyForm} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Photo</Label>
                                <ImageUploader
                                    initialImage={editingFaculty?.image_url || null}
                                    onImageChange={(file) => setFacultyPhoto(file as File)}
                                    uploadText="Upload photo"
                                    changeText="Change photo"
                                    sizeText="PNG, JPG (400x400 recommended)"
                                />
                            </div>

                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Name</Label>
                                <Input
                                    placeholder="Enter full name"
                                    value={facultyFormData.name}
                                    onChange={(e) => setFacultyFormData({ ...facultyFormData, name: e.target.value })}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Position / Role</Label>
                                <Input
                                    placeholder="e.g., Full Time, Part Time"
                                    value={facultyFormData.position}
                                    onChange={(e) => setFacultyFormData({ ...facultyFormData, position: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                            <button type="button" onClick={resetFacultyForm} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                Cancel
                            </button>
                            <button type="button" onClick={handleConfirmSaveFaculty} className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition">
                                {editingFaculty ? 'Save Changes' : 'Add Member'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacultyContentSection;

