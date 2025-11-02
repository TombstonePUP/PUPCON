import ImageUploader from '@/components/imageuploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/text-area';
import { EditIcon, ImageIcon, Plus, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

type President = {
    id: number;
    name: string;
    years_served: string;
    description: string;
    image_url: string | null;
};

type GalleryImage = {
    id: number;
    image_url: string;
    caption: string;
};

const initialPresidents: President[] = [
    {
        id: 1,
        name: 'Dr. Nemesio E. Prudente',
        years_served: '1988-1992',
        description: 'Led the first accreditation process and expanded the campus facilities.',
        image_url: '/images/presidents/prudente.png',
    },
    {
        id: 2,
        name: 'Dr. Zenaida A. Olonan',
        years_served: '1992-1998',
        description: 'Focused on curriculum development and community extension programs.',
        image_url: '/images/presidents/olonan.png',
    },
];

const initialGalleryImages: GalleryImage[] = [
    { id: 1, image_url: '/images/gallery/sample1.jpg', caption: 'Freshmen Orientation 2023' },
    { id: 2, image_url: '/images/gallery/sample2.jpg', caption: 'Campus Intramurals' },
    { id: 3, image_url: '/images/gallery/sample3.jpg', caption: '' },
];

const getNewId = (arr: { id: number }[]) => (arr.length > 0 ? Math.max(...arr.map((item) => item.id)) + 1 : 1);

const SharedPhotoPreview: React.FC<{ url: string | null; alt: string; heightClass?: string }> = ({ url, alt, heightClass = 'h-48' }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [url]);

    if (!url || hasError) {
        return (
            <div
                className={`w-full ${heightClass} animate-in fade-in-0 flex flex-col items-center justify-center rounded-md border border-gray-200 bg-gray-100 text-gray-500`}
            >
                <ImageIcon className="h-12 w-12 text-gray-400" />
                <span className="mt-2 text-sm">No Image Available</span>
            </div>
        );
    }

    return (
        <img
            src={url}
            alt={alt}
            className={`w-full ${heightClass} animate-in fade-in-0 rounded-md border border-gray-200 bg-gray-100 object-cover`}
            onError={() => setHasError(true)}
        />
    );
};

const HistoryContentSection: React.FC = () => {
    const [historyData, setHistoryData] = useState({
        title: 'Our History',
        subtitle:
            'The Polytechnic University of the Philippines San Juan Campus has been committed to democratizing education in the heart of NCR since 2008. From humble beginnings to becoming a recognized center of academic excellence, our journey reflects dedication to quality education and community service.',
    });
    const [bannerFile, setBannerFile] = useState<File | null>(null);

    const [presidents, setPresidents] = useState<President[]>(initialPresidents);
    const [selectedPresidentId, setSelectedPresidentId] = useState<number | null>(initialPresidents[0]?.id || null);

    const [isPresidentModalOpen, setIsPresidentModalOpen] = useState(false);
    const [editingPresident, setEditingPresident] = useState<President | null>(null);
    const [presidentFormData, setPresidentFormData] = useState<Omit<President, 'id' | 'image_url'>>({
        name: '',
        years_served: '',
        description: '',
    });
    const [presidentPhoto, setPresidentPhoto] = useState<File | null>(null);

    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(initialGalleryImages);
    const [selectedGalleryImageId, setSelectedGalleryImageId] = useState<number | null>(initialGalleryImages[0]?.id || null);

    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
    const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null);
    const [galleryFormData, setGalleryFormData] = useState({
        imageFile: null as File | null,
        caption: '',
    });

    const [hymnData, setHymnData] = useState({
        title_filipino: 'Sintang Paaralan',
        lyrics_filipino: `Sintang Paaralan
Tanglaw ka ng bayan
Pandayan ng isip ng kabataan
Kami ay dumating nang salat sa yaman
Hanap na dunong ay iyong alay
Ang layunin mong makatao
Dinarangal ang Pilipino
Ang iyong aral, diwa, adhikang taglay
PUP, aming gabay
Paaralang dakila
PUP, pinagpala

Gagamitin ang karunungan
Mula sa iyo, para sa bayan
Ang iyong aral, diwa, adhikang taglay
PUP, aming gabay
Paaralang dakila
PUP, pinagpala`,
        title_english: 'Beloved University',
        lyrics_english: `O, beloved University
Beacon of the nation
Forge of the youthful mind
We came lacking in wealth
Seeking wisdom, your gift...
(English lyrics placeholder)
`,
    });

    const selectedPresident = presidents.find((p) => p.id === selectedPresidentId);
    const selectedGalleryImage = galleryImages.find((g) => g.id === selectedGalleryImageId);

    useEffect(() => {
        const presidentBlobUrls = presidents.map((p) => p.image_url).filter((url) => url && url.startsWith('blob:')) as string[];

        const galleryBlobUrls = galleryImages.map((g) => g.image_url).filter((url) => url && url.startsWith('blob:')) as string[];

        const allBlobUrls = [...presidentBlobUrls, ...galleryBlobUrls];

        return () => {
            allBlobUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [presidents, galleryImages]);

    const handleChange = (field: string, value: string) => {
        setHistoryData((prev) => ({ ...prev, [field]: value }));
    };

    const handleHymnChange = (field: string, value: string) => {
        setHymnData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        console.log('Saving History Section...', { historyData, bannerFile, presidents, galleryImages, hymnData });
    };

    const handlePreview = () => {
        window.open('/about/history', '_blank');
    };

    // President CRUD Actions
    const resetPresidentForm = () => {
        setEditingPresident(null);
        setPresidentFormData({ name: '', years_served: '', description: '' });
        setPresidentPhoto(null);
        setIsPresidentModalOpen(false);
    };

    const handleShowAddPresidentModal = () => {
        resetPresidentForm();
        setIsPresidentModalOpen(true);
    };

    const handleShowEditPresidentModal = (president: President) => {
        setEditingPresident(president);
        setPresidentFormData({
            name: president.name,
            years_served: president.years_served,
            description: president.description,
        });
        setPresidentPhoto(null);
        setIsPresidentModalOpen(true);
    };

    const handleDeletePresident = (id: number) => {
        if (window.confirm('Are you sure you want to delete this president?')) {
            const updatedPresidents = presidents.filter((p) => p.id !== id);
            setPresidents(updatedPresidents);
            if (selectedPresidentId === id) {
                setSelectedPresidentId(updatedPresidents[0]?.id || null);
            }
        }
    };

    const handleConfirmSavePresident = () => {
        if (!presidentFormData.name.trim() || !presidentFormData.years_served.trim()) {
            alert('Name and Years Served cannot be empty.');
            return;
        }

        let newImageUrl: string | null = null;
        if (presidentPhoto) {
            newImageUrl = URL.createObjectURL(presidentPhoto);
        } else if (editingPresident) {
            newImageUrl = editingPresident.image_url;
        }

        if (editingPresident) {
            const updatedPresident: President = {
                ...editingPresident,
                ...presidentFormData,
                image_url: newImageUrl,
            };
            setPresidents(presidents.map((p) => (p.id === editingPresident.id ? updatedPresident : p)));
        } else {
            const newId = getNewId(presidents);
            const newPresident: President = {
                id: newId,
                ...presidentFormData,
                image_url: newImageUrl,
            };
            setPresidents([...presidents, newPresident]);
            setSelectedPresidentId(newId);
        }
        resetPresidentForm();
    };

    // Gallery CRUD Actions
    const resetGalleryForm = () => {
        setEditingGalleryImage(null);
        setGalleryFormData({ imageFile: null, caption: '' });
        setIsGalleryModalOpen(false);
    };

    const handleShowAddGalleryModal = () => {
        resetGalleryForm();
        setIsGalleryModalOpen(true);
    };

    const handleShowEditGalleryModal = (image: GalleryImage) => {
        setEditingGalleryImage(image);
        setGalleryFormData({ imageFile: null, caption: image.caption });
        setIsGalleryModalOpen(true);
    };

    const handleDeleteGalleryImage = (id: number) => {
        if (window.confirm('Are you sure you want to delete this photo?')) {
            const updatedImages = galleryImages.filter((g) => g.id !== id);
            setGalleryImages(updatedImages);
            if (selectedGalleryImageId === id) {
                setSelectedGalleryImageId(updatedImages[0]?.id || null);
            }
        }
    };

    const handleConfirmSaveGalleryImage = () => {
        const { imageFile, caption } = galleryFormData;

        if (!imageFile && !editingGalleryImage) {
            alert('Please upload an image.');
            return;
        }

        let newImageUrl: string | null = null;
        if (imageFile) {
            newImageUrl = URL.createObjectURL(imageFile);
        } else if (editingGalleryImage) {
            newImageUrl = editingGalleryImage.image_url;
        }

        if (editingGalleryImage) {
            const updatedImage: GalleryImage = {
                ...editingGalleryImage,
                image_url: newImageUrl!,
                caption: caption,
            };
            setGalleryImages(galleryImages.map((g) => (g.id === editingGalleryImage.id ? updatedImage : g)));
        } else {
            const newId = getNewId(galleryImages);
            const newImage: GalleryImage = {
                id: newId,
                image_url: newImageUrl!,
                caption: caption,
            };
            setGalleryImages([...galleryImages, newImage]);
            setSelectedGalleryImageId(newId);
        }
        resetGalleryForm();
    };

    return (
        <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">History Page</h2>
                    <p className="text-sm text-gray-600">Configure page title, subtitle, and banner</p>
                </div>

                <div className="mb-10 grid grid-cols-1 gap-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                        <Input
                            type="text"
                            placeholder="Enter history page title..."
                            value={historyData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Subtitle / Description</label>
                        <Textarea
                            placeholder="Enter history page subtitle or description..."
                            value={historyData.subtitle}
                            onChange={(e) => handleChange('subtitle', e.target.value)}
                            // @ts-ignore
                            autoResize
                            minHeight={100}
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="mb-2 block text-sm font-medium text-gray-700">History Banner</h3>
                    <ImageUploader
                        initialImage="/images/sample-history-banner.png"
                        onImageChange={(file) => setBannerFile(file as File)}
                        uploadText="Upload history banner"
                        changeText="Change banner"
                        sizeText="PNG, JPG up to 5MB"
                    />
                </div>

                <Separator className="my-10 bg-gray-200" />

                <div className="mb-6">
                    <h3 className="mb-4 text-base font-semibold text-gray-900">Past Presidents</h3>

                    <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                        {/* Left Pane: President List */}
                        <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-6">
                            <h4 className="mb-3 text-xs text-gray-500">Select a President</h4>
                            <div className="space-y-1">
                                {presidents.map((president, index) => (
                                    <div
                                        key={president.id}
                                        onClick={() => {
                                            setSelectedPresidentId(president.id);
                                        }}
                                        className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-4 transition-colors ${
                                            president.id === selectedPresidentId ? 'bg-[#7f1414]/4' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="truncate text-sm">
                                            <span
                                                className={` ${president.id === selectedPresidentId ? 'font-normal text-red-900' : 'text-gray-700'}`}
                                            >
                                                {president.name}
                                            </span>
                                        </div>
                                        <div
                                            className={`flex items-center space-x-0.5 transition-opacity ${
                                                president.id === selectedPresidentId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                            }`}
                                        >
                                            <ActionButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShowEditPresidentModal(president);
                                                }}
                                                className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                            >
                                                <EditIcon className="h-4 w-4" />
                                            </ActionButton>
                                            <ActionButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeletePresident(president.id);
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
                                    onClick={handleShowAddPresidentModal}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add New President
                                </Button>
                            </div>
                        </div>

                        {/* Right Pane: President Details */}
                        <div className="w-2/3 p-6">
                            {!selectedPresident ? (
                                <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                                    <X className="mb-2 h-8 w-8" />
                                    <p className="font-medium">No President Selected</p>
                                    <p className="text-sm">Select a president on the left or click "Add New President" to start.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="overflow-hidden rounded-lg border border-gray-100">
                                        <SharedPhotoPreview url={selectedPresident.image_url} alt={selectedPresident.name} />
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold break-words text-gray-900">{selectedPresident.name}</h4>
                                        <p className="text-sm font-medium text-red-700">{selectedPresident.years_served}</p>
                                    </div>

                                    <Separator className="bg-gray-200" />

                                    <div>
                                        <h5 className="mb-2 text-sm font-semibold text-gray-700">Details</h5>
                                        <p className="text-sm text-gray-700">{selectedPresident.description}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Separator className="my-10 bg-gray-200" />

                {/* Campus Gallery Section */}
                <div className="mb-6">
                    <h3 className="mb-4 text-base font-semibold text-gray-900">Campus Gallery</h3>

                    <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                        {/* Left Pane: Gallery List */}
                        <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-6">
                            <h4 className="mb-3 text-xs text-gray-500">Select a Photo</h4>
                            <div className="space-y-1">
                                {galleryImages.map((image, index) => (
                                    <div
                                        key={image.id}
                                        onClick={() => {
                                            setSelectedGalleryImageId(image.id);
                                        }}
                                        className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-4 transition-colors ${
                                            image.id === selectedGalleryImageId ? 'bg-[#7f1414]/4' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="truncate text-sm">
                                            <span
                                                className={` ${image.id === selectedGalleryImageId ? 'font-normal text-red-900' : 'text-gray-700'}`}
                                            >
                                                {image.caption || `Image ${index + 1}`}
                                            </span>
                                        </div>
                                        <div
                                            className={`flex items-center space-x-0.5 transition-opacity ${
                                                image.id === selectedGalleryImageId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                            }`}
                                        >
                                            <ActionButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShowEditGalleryModal(image);
                                                }}
                                                className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                            >
                                                <EditIcon className="h-4 w-4" />
                                            </ActionButton>
                                            <ActionButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteGalleryImage(image.id);
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
                                    onClick={handleShowAddGalleryModal}
                                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add New Photo
                                </Button>
                            </div>
                        </div>

                        {/* Right Pane: Gallery Photo Details */}
                        <div className="w-2/3 p-6">
                            {!selectedGalleryImage ? (
                                <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                                    <X className="mb-2 h-8 w-8" />
                                    <p className="font-medium">No Photo Selected</p>
                                    <p className="text-sm">Select a photo on the left or click "Add New Photo" to start.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="overflow-hidden rounded-lg border border-gray-100">
                                        <SharedPhotoPreview
                                            url={selectedGalleryImage.image_url}
                                            alt={selectedGalleryImage.caption || 'Gallery Image'}
                                            heightClass="h-80"
                                        />
                                    </div>

                                    {selectedGalleryImage.caption && (
                                        <div>
                                            <h5 className="mb-2 text-sm font-semibold text-gray-700">Caption</h5>
                                            <p className="text-sm text-gray-700">{selectedGalleryImage.caption}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- PUP Hymn Section --- */}
                <Separator className="my-10 bg-gray-200" />
                <div className="mb-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-900">PUP Hymn</h3>
                        <Tabs defaultValue="filipino" className="w-auto">
                            <TabsList className="grid grid-cols-2">
                                <TabsTrigger value="filipino" className="data-[state=active]:bg-[#7f1414] data-[state=active]:text-white">
                                    Filipino
                                </TabsTrigger>
                                <TabsTrigger value="english" className="data-[state=active]:bg-[#7f1414] data-[state=active]:text-white">
                                    English
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <Tabs defaultValue="filipino" className="w-full">
                        {/* This TabsList is hidden, but it controls the content */}
                        <TabsList className="hidden">
                            <TabsTrigger value="filipino">Filipino</TabsTrigger>
                            <TabsTrigger value="english">English</TabsTrigger>
                        </TabsList>

                        <TabsContent value="filipino" className="data-[state=active]:animate-in data-[state=active]:fade-in-0 mt-4">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Title (Filipino)</Label>
                                    <Input
                                        placeholder="Enter Filipino title..."
                                        value={hymnData.title_filipino}
                                        onChange={(e) => handleHymnChange('title_filipino', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Lyrics (Filipino)</Label>
                                    <Textarea
                                        placeholder="Enter Filipino lyrics..."
                                        value={hymnData.lyrics_filipino}
                                        onChange={(e) => handleHymnChange('lyrics_filipino', e.target.value)}
                                        // @ts-ignore
                                        autoResize
                                        minHeight={200}
                                        className="font-mono"
                                    />
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="english" className="data-[state=active]:animate-in data-[state=active]:fade-in-0 mt-4">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Title (English)</Label>
                                    <Input
                                        placeholder="Enter English title..."
                                        value={hymnData.title_english}
                                        onChange={(e) => handleHymnChange('title_english', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block text-sm font-medium text-gray-700">Lyrics (English)</Label>
                                    <Textarea
                                        placeholder="Enter English lyrics..."
                                        value={hymnData.lyrics_english}
                                        onChange={(e) => handleHymnChange('lyrics_english', e.target.value)}
                                        // @ts-ignore
                                        autoResize
                                        minHeight={200}
                                        className="font-mono"
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <SectionFooter onSave={handleSave} onPreview={handlePreview} />

            {/* President Modal */}
            {isPresidentModalOpen && (
                <div data-state="open" className="animate-in fade-in-0 fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div data-state="open" className="animate-in fade-in-0 zoom-in-95 w-full max-w-lg rounded-lg bg-white p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">{editingPresident ? 'Edit President' : 'Add New President'}</h3>
                            <button onClick={resetPresidentForm} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-6 max-h-[70vh] space-y-4 overflow-y-auto pr-2">
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">President's Photo</Label>
                                <ImageUploader
                                    initialImage={editingPresident?.image_url || null}
                                    onImageChange={(file) => setPresidentPhoto(file as File)}
                                    uploadText="Upload photo"
                                    changeText="Change photo"
                                    sizeText="PNG, JPG (600x400 recommended)"
                                />
                            </div>

                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Name</Label>
                                <Input
                                    placeholder="Enter president's full name"
                                    value={presidentFormData.name}
                                    onChange={(e) => setPresidentFormData({ ...presidentFormData, name: e.target.value })}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Years Served</Label>
                                <Input
                                    placeholder="e.g., 1988-1992"
                                    value={presidentFormData.years_served}
                                    onChange={(e) => setPresidentFormData({ ...presidentFormData, years_served: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Description / Details</Label>
                                <Textarea
                                    placeholder="Enter details about their term..."
                                    value={presidentFormData.description}
                                    onChange={(e) => setPresidentFormData({ ...presidentFormData, description: e.target.value })}
                                    autoResize
                                    minHeight={100}
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={resetPresidentForm}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmSavePresident}
                                className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                            >
                                {editingPresident ? 'Save Changes' : 'Add President'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Gallery Photo Modal */}
            {isGalleryModalOpen && (
                <div data-state="open" className="animate-in fade-in-0 fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div data-state="open" className="animate-in fade-in-0 zoom-in-95 w-full max-w-lg rounded-lg bg-white p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingGalleryImage ? 'Edit Gallery Photo' : 'Add New Gallery Photo'}
                            </h3>
                            <button onClick={resetGalleryForm} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-6 max-h-[70vh] space-y-4 overflow-y-auto pr-2">
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Gallery Photo</Label>
                                <ImageUploader
                                    initialImage={editingGalleryImage?.image_url || null}
                                    onImageChange={(file) => setGalleryFormData((prev) => ({ ...prev, imageFile: file as File }))}
                                    uploadText="Upload photo"
                                    changeText="Change photo"
                                    sizeText="PNG, JPG up to 5MB"
                                />
                            </div>

                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Caption (Optional)</Label>
                                <Input
                                    placeholder="Enter an optional caption..."
                                    value={galleryFormData.caption}
                                    onChange={(e) => setGalleryFormData((prev) => ({ ...prev, caption: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={resetGalleryForm}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmSaveGalleryImage}
                                className="flex cursor-pointer items-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                            >
                                {editingGalleryImage ? 'Save Changes' : 'Add to Gallery'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoryContentSection;
