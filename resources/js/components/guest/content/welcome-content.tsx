import { DocumentViewer } from '@/components/admin/dialogs/documents/view-document';
import { ImageUpload } from '@/components/admin/image-upload'; // adjust path as needed
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import { CampusGallery, ContentPages } from '@/types/content';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
                                    <p className="text-muted-foreground text-right text-xs">{progress.percentage}%</p>
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
                preserveScroll: true,
                preserveState: true,
            });
        } catch (error) {
            toast.dismiss('uploading');
            toast.error('Unexpected error occurred', { description: 'Please check your connection or try again later.' });
            setIsUploading(false);
        }
    };

    const handlePreview = () => window.open('/', '_blank');

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        const previewUrl = file ? URL.createObjectURL(file) : null;
        setData('page', { ...data.page, certificate_of_authenticity: file, file_previewUrl: previewUrl });
    };

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
            return { ...prevData, gallery: formGallery };
        });
    };

    const handleDeleteGallery = (id: number) => {
        setData((prev) => ({ ...prev, gallery: prev.gallery.filter((gallery) => gallery.gallery_id !== id) }));
    };

    return (
        <>
            <Card className="scroll-mt-6">
                <div className="p-8">
                    <WelcomeCarouselSection gallery={gallery} onUpdate={handleUpdateGallery} onDelete={handleDeleteGallery} errors={errors} />

                    <Separator className="my-10" />

                    {/* Video Section */}
                    <div className="mb-6">
                        <h3 className="text-foreground mb-4 text-base font-semibold">Campus Audio-Visual Presentation</h3>
                        <div className="grid gap-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-foreground mb-2 block text-sm font-medium">YouTube Link</label>
                                        <Input
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            value={data.page.video_link || ''}
                                            onChange={(e) => setData({ ...data, page: { ...data.page, video_link: e.target.value } })}
                                            disabled={processing}
                                        />
                                        <InputError message={errors['page.video_link']} className="mt-2" />
                                    </div>
                                    <div>
                                        <label className="text-foreground mb-2 block text-sm font-medium">Video Title</label>
                                        <Input
                                            placeholder="Enter video title..."
                                            value={data.page.video_title || ''}
                                            onChange={(e) => setData({ ...data, page: { ...data.page, video_title: e.target.value } })}
                                            disabled={processing}
                                        />
                                        <InputError message={errors['page.video_title']} className="mt-2" />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-foreground mb-2 block text-sm font-medium">Video Description</label>
                                    <Textarea
                                        autoResize
                                        className="flex-1"
                                        placeholder="Enter video description..."
                                        value={data.page.video_description || ''}
                                        onChange={(e) => setData({ ...data, page: { ...data.page, video_description: e.target.value } })}
                                        disabled={processing}
                                    />
                                    <InputError message={errors['page.video_description']} className="mt-2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-10" />

                    {/* Director Section */}
                    <div className="mb-6">
                        <div className="mb-8">
                            <div className="mt-5 mb-6 flex flex-col gap-3">
                                <h3 className="text-foreground text-sm font-medium">Director's Image</h3>
                                <ImageUpload
                                    value={data.page.director_image}
                                    previewUrl={data.page.previewUrl ?? null}
                                    onChange={(file, url) =>
                                        setData((prev) => ({
                                            ...prev,
                                            page: { ...prev.page, director_image: file, previewUrl: url },
                                        }))
                                    }
                                    onRemove={() =>
                                        setData((prev) => ({
                                            ...prev,
                                            page: { ...prev.page, director_image: null, previewUrl: null },
                                        }))
                                    }
                                    label="Upload Director's Image"
                                    aspectRatio={1}
                                    disabled={processing}
                                    error={errors['page.director_image']}
                                    inputId="director-image"
                                />
                            </div>

                            <div className="flex gap-4 space-y-6">
                                <div className="flex-1">
                                    <label className="text-foreground mb-2 block text-sm font-medium">
                                        Director's Name <span className="text-destructive">*</span>
                                    </label>
                                    <Input
                                        placeholder="Enter director's name..."
                                        value={data.page.director_name}
                                        onChange={(e) => setData({ ...data, page: { ...data.page, director_name: e.target.value } })}
                                        disabled={processing}
                                    />
                                    <InputError message={errors['page.director_name']} className="mt-2" />
                                </div>
                                <div className="flex-2">
                                    <label className="text-foreground mb-2 block text-sm font-medium">
                                        Director's Message <span className="text-destructive">*</span>
                                    </label>
                                    <Textarea
                                        placeholder="Enter your message..."
                                        autoResize
                                        minHeight={100}
                                        maxHeight={250}
                                        value={data.page.director_message}
                                        onChange={(e) => setData({ ...data, page: { ...data.page, director_message: e.target.value } })}
                                        disabled={processing}
                                        className="w-full"
                                    />
                                    <InputError message={errors['page.director_message']} className="mt-2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="my-10" />

                    {/* Certificate of Authenticity — kept as-is (PDF, not an image) */}
                    <div className="mb-6">
                        <h3 className="text-foreground mb-4 text-base font-semibold">Certificate of Authenticity</h3>
                        <div className="flex w-full items-center justify-center">
                            {!data.page.file_previewUrl ? (
                                <label
                                    className={`border-border bg-muted hover:bg-muted/80 flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed ${isUploading ? 'pointer-events-none opacity-70' : 'cursor-pointer'}`}
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                            className="text-muted-foreground mb-4 h-8 w-8"
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
                                        <p className="text-muted-foreground text-sm">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-muted-foreground text-xs">PDF</p>
                                    </div>
                                    <input type="file" className="hidden" accept=".pdf" disabled={isUploading} onChange={onFileChange} />
                                </label>
                            ) : (
                                <div
                                    className={`border-border bg-muted hover:bg-muted/80 flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed ${isUploading ? 'pointer-events-none opacity-70' : ''}`}
                                >
                                    <span className="text-foreground text-sm font-semibold">Certificate of Authenticity</span>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="mt-2"
                                            disabled={isUploading}
                                            onClick={() =>
                                                setData('page', { ...data.page, certificate_of_authenticity: null, file_previewUrl: null })
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
            </Card>

            <DocumentViewer open={isViewerOpen} onOpenChange={setIsViewerOpen} fileUrl={viewerFileUrl || ''} title="Certificate of Authenticity" />
        </>
    );
}
