import { DocumentViewer } from '@/components/dialogs/documents/view-document';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import { CampusGallery, ContentPages } from '@/types/content';
import { useForm } from '@inertiajs/react';
import { Edit2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import WelcomeCarouselSection from './welcome/welcome-carousel';

interface WelcomeContentSectionProps {
    welcome_page: ContentPages;
    gallery: CampusGallery[];
}

interface PageForm {
    content_page_id: number;
    page: string;
    director_name: string;
    director_image: File | null;
    video_link?: string | null;
    video_title?: string | null;
    video_description?: string | null;
    previewUrl?: string | null;
    director_message: string;
    certificate_of_authenticity: File | null;
    file_previewUrl?: string | null;
}

interface GalleryForm {
    gallery_id: number;
    image: File | null;
    previewUrl?: string | null;
    description: string;
    carousel: boolean;
}

interface WelcomeForm {
    page: PageForm;
    gallery: GalleryForm[];
}

export default function WelcomeContentSection({ ...props }: WelcomeContentSectionProps) {
    const { welcome_page, gallery } = props;
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [viewerFileUrl, setViewerFileUrl] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm<WelcomeForm>({
        page: {
            content_page_id: welcome_page.content_page_id,
            page: welcome_page.page || 'Welcome',
            director_name: welcome_page.director_name || '',
            director_image: null,
            video_link: welcome_page.video_link || '',
            video_title: welcome_page.video_title || '',
            video_description: welcome_page.video_description || '',
            previewUrl: welcome_page.director_image_path || null,
            director_message: welcome_page.director_message || '',
            certificate_of_authenticity: null,
            file_previewUrl: welcome_page.certificate_of_authenticity || null,
        },
        gallery:
            gallery?.map((g) => ({
                gallery_id: g.gallery_id,
                image: null,
                carousel: g.carousel || false,
                previewUrl: g.image_path || '',
                description: g.description || '',
            })) || [],
    });

    const extractGroupedErrors = (errors: Record<string, string>, parentKey: string) => {
        const messages = Object.entries(errors)
            .filter(([key]) => key.startsWith(parentKey))
            .map(([, message]) => message);

        // Remove duplicate messages
        return [...new Set(messages)];
    };

    const gallery_errors = extractGroupedErrors(errors, 'gallery');

    const [isUploading, setIsUploading] = useState(false);

    const handleSave = () => {
        try {
            setIsUploading(true);
            post(route('content.welcome.update'), {
                onProgress: (progress) => {
                    if (progress?.percentage) {
                        toast.info('Uploading...', {
                            description: (
                                <div className="flex w-full items-center gap-1">
                                    <Progress value={progress.percentage} className="h-2 w-68" />
                                    <p className="text-right text-xs text-gray-500">{progress.percentage}%</p>
                                </div>
                            ),
                            id: 'uploading',
                        });
                    }
                },
                onSuccess: () => {
                    toast.dismiss('uploading');
                    setIsUploading(false);
                },
                onError: () => {
                    toast.dismiss('uploading');
                    setIsUploading(false);
                },
            });
        } catch (error) {
            toast.dismiss('uploading');
            toast.error('Unexpected error occurred', {
                description: 'Please check your connection or try again later.',
            });
            setIsUploading(false);
        }
    };

    const handlePreview = () => {
        window.open('/', '_blank');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setData({
                ...data,
                page: {
                    ...data.page,
                    director_image: file,
                    previewUrl,
                },
            });
        }
    };

    useEffect(() => {
        return () => {
            if (data.page?.previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(data.page?.previewUrl);
            }
        };
    }, [data.page?.previewUrl]);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        const previewUrl = file ? URL.createObjectURL(file) : null;

        setData('page', {
            ...data.page,
            certificate_of_authenticity: file,
            file_previewUrl: previewUrl,
        });
    };

    useEffect(() => {
        return () => {
            if (data.page?.file_previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(data.page.file_previewUrl);
            }
        };
    }, [data.page?.file_previewUrl]);

    const viewFile = (file: string) => {
        setViewerFileUrl(file);
        setIsViewerOpen(true);
    };

    const handleUpdateGallery = (galleryLocal: CampusGallery, gallery: GalleryForm) => {
        setData((prevData) => {
            const galleryForForm: GalleryForm = {
                gallery_id: galleryLocal.gallery_id,
                image: gallery.image,
                carousel: true,
                previewUrl: gallery.previewUrl,
                description: gallery.description,
            };

            let formGallery;
            const formIndex = prevData.gallery?.findIndex((g) => g.gallery_id === galleryForForm.gallery_id);

            if (formIndex !== undefined && formIndex !== -1) {
                formGallery = prevData.gallery?.map((g, index) => (index === formIndex ? galleryForForm : g));
            } else {
                formGallery = [...(prevData.gallery ?? []), galleryForForm];
            }

            return {
                ...prevData,
                gallery: formGallery,
            };
        });
    };

    const handleDeleteGallery = (id: number) => {
        setData((prev) => ({
            ...prev,
            gallery: prev.gallery.filter((gallery) => gallery.gallery_id !== id),
        }));
    };

    return (
        <>
            <div className="scroll-mt-6 rounded-lg border border-gray-200 bg-white">
                <div className="p-8">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Welcome Page</h2>
                        <p className="text-sm text-gray-600">Configure welcome page content</p>
                    </div>
                    {/* Gallery Pane */}
                    <h3 className="mb-4 text-base font-semibold text-gray-900">Campus Image Gallery</h3>
                    <WelcomeCarouselSection gallery={gallery} onUpdate={handleUpdateGallery} onDelete={handleDeleteGallery} />
                    {gallery_errors.length > 0 && (
                        <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-4">
                            <h4 className="mb-2 font-semibold text-red-700">Directors Section Errors</h4>
                            <ul className="ml-6 list-disc text-sm text-red-600">
                                {gallery_errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <Separator className="my-10 bg-gray-200" />

                    <div className="mb-6">
                        <h3 className="mb-4 text-base font-semibold text-gray-900">Campus Audio-Visual Presentation</h3>
                        <div className="grid gap-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-6">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">YouTube Link</label>
                                        <Input
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            value={data.page.video_link || ''}
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    page: {
                                                        ...data.page,
                                                        video_link: e.target.value,
                                                    },
                                                })
                                            }
                                            disabled={processing}
                                        />
                                        <InputError message={errors['page.video_link']} className="mt-2" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">Video Title</label>
                                        <Input
                                            placeholder="Enter video title..."
                                            value={data.page.video_title || ''}
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    page: {
                                                        ...data.page,
                                                        video_title: e.target.value,
                                                    },
                                                })
                                            }
                                            disabled={processing}
                                        />
                                        <InputError message={errors['page.video_title']} className="mt-2" />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Video Description</label>
                                    <Textarea
                                        className="flex-1"
                                        placeholder="Enter video description..."
                                        value={data.page.video_description || ''}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                page: {
                                                    ...data.page,
                                                    video_description: e.target.value,
                                                },
                                            })
                                        }
                                        disabled={processing}
                                    />
                                    <InputError message={errors['page.video_description']} className="mt-2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-10 bg-gray-200" />

                    <div className="mb-6">
                        <h3 className="mb-4 text-base font-semibold text-gray-900">Campus Audio-Visual Presentation</h3>

                        {/* Banner Upload */}
                        <div className="mb-8">
                            <div>
                                <div className="mt-5 mb-6 flex flex-col gap-3">
                                    <h3 className="text-sm font-medium text-gray-700">Director's Image</h3>

                                    {!data.page.previewUrl ? (
                                        <Label className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-12 text-center transition-all duration-300 hover:border-[#7f1414]/70">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg
                                                    className="mb-4 h-8 w-8 text-gray-500"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 20 16"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                    />
                                                </svg>
                                                <p className="text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">JPG, PNG, JPEG</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                        </Label>
                                    ) : (
                                        <div className="group relative">
                                            <img
                                                src={data.page.previewUrl}
                                                alt="Preview"
                                                className="h-48 w-full rounded-lg border border-gray-200 object-cover"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-lg bg-black/40 opacity-0 transition group-hover:opacity-100">
                                                <input
                                                    id="replace-directors-image"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="h-12 w-12 rounded-full bg-white p-0"
                                                    onClick={() => document.getElementById('replace-directors-image')?.click()}
                                                >
                                                    <Edit2 className="h-5 w-5 text-red-600" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="h-12 w-12 rounded-full bg-white p-0"
                                                    onClick={() =>
                                                        setData({
                                                            ...data,
                                                            page: {
                                                                ...data.page,
                                                                director_image: null,
                                                                previewUrl: null,
                                                            },
                                                        })
                                                    }
                                                >
                                                    <Trash2 className="h-5 w-5 text-red-600" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                    <InputError message={errors['page.director_image']} className="mt-2" />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Director's Name</label>
                                    <Input
                                        placeholder="Enter director's name..."
                                        value={data.page.director_name}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                page: {
                                                    ...data.page,
                                                    director_name: e.target.value,
                                                },
                                            })
                                        }
                                        disabled={processing}
                                    />
                                    <InputError message={errors['page.director_name']} className="mt-2" />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">Director's Message</label>
                                    <Textarea
                                        placeholder="Enter your message..."
                                        autoResize
                                        minHeight={100}
                                        maxHeight={250}
                                        value={data.page.director_message}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                page: {
                                                    ...data.page,
                                                    director_message: e.target.value,
                                                },
                                            })
                                        }
                                        disabled={processing}
                                    />
                                    <InputError message={errors['page.director_message']} className="mt-2" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Separator className="my-10 bg-gray-200" />

                    <div className="mb-6">
                        <h3 className="mb-4 text-base font-semibold text-gray-900">Certificate of Authenticity</h3>
                    </div>

                    <div>
                        {/* <Label className="mb-2 block text-sm font-medium text-gray-700">Upload Document</Label> */}
                        <div className="flex w-full items-center justify-center">
                            {!data.page.file_previewUrl ? (
                                <label
                                    className={`flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 ${isUploading ? 'pointer-events-none opacity-70' : 'cursor-pointer'
                                        }`}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                            className="mb-4 h-8 w-8 text-gray-500"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 16"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                            />
                                        </svg>
                                        <p className="text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-gray-500">PDF</p>
                                    </div>
                                    <input type="file" className="hidden" accept=".pdf" disabled={isUploading} onChange={onFileChange} />
                                </label>
                            ) : (
                                <div
                                    className={`flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 ${isUploading ? 'pointer-events-none opacity-70' : ''
                                        }`}
                                >
                                    <span className="text-sm font-semibold text-gray-700">Certificate of Authenticity</span>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            disabled={isUploading}
                                            onClick={() =>
                                                setData('page', {
                                                    ...data.page,
                                                    certificate_of_authenticity: null,
                                                    file_previewUrl: null,
                                                })
                                            }
                                        >
                                            Remove File
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            disabled={isUploading}
                                            onClick={() => viewFile(data.page.file_previewUrl!)}
                                        >
                                            View File
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <InputError message={errors['page.certificate_of_authenticity']} className="mt-2" />
                        </div>
                    </div>
                </div>
                <SectionFooter onSave={handleSave} onPreview={handlePreview} />
            </div>
            <DocumentViewer open={isViewerOpen} onOpenChange={setIsViewerOpen} fileUrl={viewerFileUrl || ''} title="Certificate of Authenticity" />
        </>
    );
}
