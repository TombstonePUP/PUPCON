import ImageUploader from '@/components/imageuploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { EditIcon, ImageIcon, Plus, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

type Official = {
    id: number;
    name: string;
    position: string;
    image_url: string | null;
};

const initialOfficials: Official[] = [
    {
        id: 1,
        name: 'Manuel M. Muhi D.Tech., ASEAN Engr.',
        position: 'University President',
        image_url: '/images/officials/muhi.png',
    },
    {
        id: 2,
        name: 'Alberto C. Guillo MS (Stat) MA (Econ)',
        position: 'Executive Vice President, Vice President for Planning and Finance (Concurrent)',
        image_url: '/images/officials/guillo.png',
    },
    {
        id: 3,
        name: 'Emanuel C. De Guzman Ph.D',
        position: 'Vice President for Academic Affairs',
        image_url: '/images/officials/deguzman.png',
    },
];

const getNewId = (arr: { id: number }[]) => (arr.length > 0 ? Math.max(...arr.map((item) => item.id)) + 1 : 1);

const OfficialPhoto: React.FC<{ url: string | null; alt: string }> = ({ url, alt }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [url]);

    if (!url || hasError) {
        return (
            <div className="animate-in fade-in-0 flex h-64 w-full flex-col items-center justify-center rounded-md border border-gray-200 bg-gray-100 text-gray-500">
                <ImageIcon className="h-12 w-12 text-gray-400" />
                <span className="mt-2 text-sm">No Image Available</span>
            </div>
        );
    }

    return (
        <img
            src={url}
            alt={alt}
            className="animate-in fade-in-0 h-64 w-full rounded-md border border-gray-200 bg-gray-100 object-cover"
            onError={() => setHasError(true)}
        />
    );
};

const AdminContentSection: React.FC = () => {
    const [pageData, setPageData] = useState({
        title: 'University Officials',
        subtitle: 'Meet the top officials managing PUP and driving university-wide initiatives.',
    });

    const [officials, setOfficials] = useState<Official[]>(initialOfficials);
    const [selectedOfficialId, setSelectedOfficialId] = useState<number | null>(initialOfficials[0]?.id || null);

    const [isOfficialModalOpen, setIsOfficialModalOpen] = useState(false);
    const [editingOfficial, setEditingOfficial] = useState<Official | null>(null);
    const [officialFormData, setOfficialFormData] = useState({
        name: '',
        position: '',
    });
    const [officialPhoto, setOfficialPhoto] = useState<File | null>(null);

    const selectedOfficial = officials.find((p) => p.id === selectedOfficialId);

    useEffect(() => {
        const blobUrls = officials.map((p) => p.image_url).filter((url) => url && url.startsWith('blob:')) as string[];

        return () => {
            blobUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [officials]);

    const handleChange = (field: string, value: string) => {
        setPageData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        console.log('Saving Administration Page...', { pageData, officials });
    };

    const handlePreview = () => {
        window.open('/about/administration', '_blank');
    };

    const resetOfficialForm = () => {
        setEditingOfficial(null);
        setOfficialFormData({ name: '', position: '' });
        setOfficialPhoto(null);
        setIsOfficialModalOpen(false);
    };

    const handleShowAddOfficialModal = () => {
        resetOfficialForm();
        setIsOfficialModalOpen(true);
    };

    const handleShowEditOfficialModal = (official: Official) => {
        setEditingOfficial(official);
        setOfficialFormData({
            name: official.name,
            position: official.position,
        });
        setOfficialPhoto(null);
        setIsOfficialModalOpen(true);
    };

    const handleDeleteOfficial = (id: number) => {
        if (window.confirm('Are you sure you want to delete this official?')) {
            const updatedOfficials = officials.filter((p) => p.id !== id);
            setOfficials(updatedOfficials);
            if (selectedOfficialId === id) {
                setSelectedOfficialId(updatedOfficials[0]?.id || null);
            }
        }
    };

    const handleConfirmSaveOfficial = () => {
        if (!officialFormData.name.trim() || !officialFormData.position.trim()) {
            alert('Name and Position cannot be empty.');
            return;
        }

        let newImageUrl: string | null = null;
        if (officialPhoto) {
            newImageUrl = URL.createObjectURL(officialPhoto);
        } else if (editingOfficial) {
            newImageUrl = editingOfficial.image_url;
        }

        if (editingOfficial) {
            const updatedOfficial = {
                ...editingOfficial,
                ...officialFormData,
                image_url: newImageUrl,
            };
            setOfficials(officials.map((p) => (p.id === editingOfficial.id ? updatedOfficial : p)));
        } else {
            const newId = getNewId(officials);
            const newOfficial: Official = {
                id: newId,
                ...officialFormData,
                image_url: newImageUrl,
            };
            setOfficials([...officials, newOfficial]);
            setSelectedOfficialId(newId);
        }
        resetOfficialForm();
    };

    return (
        <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">University Administration Page</h2>
                    <p className="text-sm text-gray-600">Configure content</p>
                </div>

                <div className="mb-10 grid gap-6 md:grid-cols-2">
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
                        <Input
                            type="text"
                            placeholder="Enter page subtitle..."
                            value={pageData.subtitle}
                            onChange={(e) => handleChange('subtitle', e.target.value)}
                        />
                    </div>
                </div>

                <Separator className="my-10 bg-gray-200" />

                {/* --- University Officials Section --- */}
                <div className="mb-6">
                    <h3 className="mb-4 text-base font-semibold text-gray-900">University Officials</h3>

                    <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                        {/* Left Pane: Official List */}
                        <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-6">
                            <h4 className="mb-3 text-xs text-gray-500">Select an Official</h4>
                            <div className="space-y-1">
                                {officials.map((official) => (
                                    <div
                                        key={official.id}
                                        onClick={() => {
                                            setSelectedOfficialId(official.id);
                                        }}
                                        className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-4 transition-colors ${
                                            official.id === selectedOfficialId ? 'bg-[#7f1414]/4' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="truncate text-sm">
                                            <span className={` ${official.id === selectedOfficialId ? 'font-normal text-red-900' : 'text-gray-700'}`}>
                                                {official.name}
                                            </span>
                                        </div>
                                        <div
                                            className={`flex items-center space-x-0.5 transition-opacity ${
                                                official.id === selectedOfficialId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                            }`}
                                        >
                                            <ActionButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShowEditOfficialModal(official);
                                                }}
                                                className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                            >
                                                <EditIcon className="h-4 w-4" />
                                            </ActionButton>
                                            <ActionButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteOfficial(official.id);
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
                                    onClick={handleShowAddOfficialModal}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add New Official
                                </Button>
                            </div>
                        </div>

                        {/* Right Pane: Official Details */}
                        <div className="w-2/3 p-6">
                            {!selectedOfficial ? (
                                <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                                    <X className="mb-2 h-8 w-8" />
                                    <p className="font-medium">No Official Selected</p>
                                    <p className="text-sm">Select an official on the left or click "Add New Official" to start.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="overflow-hidden rounded-lg border border-gray-100">
                                        <OfficialPhoto url={selectedOfficial.image_url} alt={selectedOfficial.name} />
                                    </div>

                                    <div>
                                        <h4 className="text-xl font-semibold break-words text-gray-900">{selectedOfficial.name}</h4>
                                        <p className="text-sm font-normal text-red-700">{selectedOfficial.position}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <SectionFooter onSave={handleSave} onPreview={handlePreview} />

            {/* --- Add/Edit Official Modal --- */}
            {isOfficialModalOpen && (
                <div data-state="open" className="animate-in fade-in-0 fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div data-state="open" className="animate-in fade-in-0 zoom-in-95 w-full max-w-lg rounded-lg bg-white p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">{editingOfficial ? 'Edit Official' : 'Add New Official'}</h3>
                            <button onClick={resetOfficialForm} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-6 max-h-[70vh] space-y-4 overflow-y-auto pr-2">
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Official's Photo</Label>
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
                                    placeholder="Enter official's full name"
                                    value={officialFormData.name}
                                    onChange={(e) => setOfficialFormData({ ...officialFormData, name: e.target.value })}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Position</Label>
                                <Input
                                    placeholder="e.g., University President"
                                    value={officialFormData.position}
                                    onChange={(e) => setOfficialFormData({ ...officialFormData, position: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={resetOfficialForm}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmSaveOfficial}
                                className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                            >
                                {editingOfficial ? 'Save Changes' : 'Add Official'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminContentSection;
