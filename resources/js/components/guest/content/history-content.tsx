import { ImageUpload } from '@/components/admin/image-upload'; // adjust path as needed
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import { CampusDirectors, CampusGallery, ContentPages } from '@/types/content';
import { useForm } from '@inertiajs/react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DirectorsSection } from './history/directors';
import { GallerySection } from './history/gallery';

interface History {
    directors: CampusDirectors[];
    gallery: CampusGallery[];
}
interface HistoryContentSectionProps {
    history_page: ContentPages;
    history: History;
}
interface PageForm {
    content_page_id?: number;
    page: string;
    title: string;
    description: string;
    banner?: File | null;
    previewUrl?: string | null;
}
interface DirectorsForm {
    director_id: number;
    name: string;
    term_start_date: number;
    term_end_date: number;
    description: string;
    profile_image: File | null;
    previewUrl?: string | null;
}
interface GalleryForm {
    gallery_id: number;
    image: File | null;
    previewUrl?: string | null;
    description: string;
}
interface HistoryForm {
    page: PageForm;
    directors: DirectorsForm[];
    gallery: GalleryForm[];
}

const HistoryContentSection: React.FC = ({ ...props }: HistoryContentSectionProps) => {
    const { history, history_page } = props;
    const { data, setData, post, errors } = useForm<HistoryForm>({
        page: {
            content_page_id: history_page?.content_page_id,
            page: history_page?.page || 'History',
            title: history_page?.title || '',
            description: history_page?.description || '',
            banner: null,
            previewUrl: history_page?.image_path || null,
        },
        directors:
            history.directors?.map((d) => ({
                director_id: d.director_id,
                name: d.name || '',
                term_start_date: d.term_start_date || '',
                term_end_date: d.term_end_date || '',
                description: d.description || '',
                profile_image: null,
                previewUrl: d.profile_image_path || '',
            })) || [],
        gallery:
            history.gallery?.map((g) => ({
                gallery_id: g.gallery_id,
                image: null,
                previewUrl: g.image_path || '',
                description: g.description || '',
            })) || [],
    });

    const handleUpdateDirectors = (directorLocal: CampusDirectors, director: DirectorsForm) => {
        setData((prevData) => {
            const directorForForm: DirectorsForm = {
                director_id: directorLocal.director_id,
                name: director.name,
                term_start_date: director.term_start_date,
                term_end_date: director.term_end_date,
                description: director.description,
                profile_image: director.profile_image,
                previewUrl: director.previewUrl,
            };
            const formIndex = prevData.directors?.findIndex((d) => d.director_id === directorForForm.director_id);
            const formDirectors =
                formIndex !== undefined && formIndex !== -1
                    ? prevData.directors?.map((d, i) => (i === formIndex ? directorForForm : d))
                    : [...(prevData.directors ?? []), directorForForm];
            return { ...prevData, directors: formDirectors };
        });
    };

    const handleDeleteDirector = (id: number) => setData((prev) => ({ ...prev, directors: prev.directors.filter((d) => d.director_id !== id) }));

    const handleUpdateGallery = (galleryLocal: CampusGallery, gallery: GalleryForm) => {
        setData((prevData) => {
            const galleryForForm: GalleryForm = {
                gallery_id: galleryLocal.gallery_id,
                image: gallery.image,
                previewUrl: gallery.previewUrl,
                description: gallery.description,
            };
            const formIndex = prevData.gallery?.findIndex((g) => g.gallery_id === galleryForForm.gallery_id);
            const formGallery =
                formIndex !== undefined && formIndex !== -1
                    ? prevData.gallery?.map((g, i) => (i === formIndex ? galleryForForm : g))
                    : [...(prevData.gallery ?? []), galleryForForm];
            return { ...prevData, gallery: formGallery };
        });
    };

    const handleDeleteGallery = (id: number) => setData((prev) => ({ ...prev, gallery: prev.gallery.filter((g) => g.gallery_id !== id) }));

    const handleSave = () => post(route('content.history.update'), { preserveScroll: true, preserveState: true });
    const handlePreview = () => window.open('/about/history', '_blank');

    const directorErrorCount = Object.keys(errors).filter((key) => key.startsWith('directors.')).length;
    const galleryErrorCount = Object.keys(errors).filter((key) => key.startsWith('gallery.')).length;

    return (
        <div className="border-border bg-card scroll-mt-6 rounded-lg border">
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-foreground text-lg font-semibold">History Page</h2>
                    <p className="text-muted-foreground text-sm">Configure page title, subtitle, and banner</p>
                </div>

                <div className="mb-10 grid grid-cols-1 gap-6">
                    <div>
                        <label className="text-foreground mb-2 block text-sm font-medium">Title</label>
                        <Input
                            type="text"
                            placeholder="Enter history page title..."
                            value={data.page.title}
                            onChange={(e) => setData('page.title', e.target.value)}
                        />
                        <InputError message={errors['page.title']} className="mt-2" />
                    </div>
                    <div>
                        <label className="text-foreground mb-2 block text-sm font-medium">Subtitle / Description</label>
                        <Textarea
                            placeholder="Enter history page subtitle or description..."
                            value={data.page.description}
                            onChange={(e) => setData('page.description', e.target.value)}
                            autoResize
                            minHeight={100}
                        />
                        <InputError message={errors['page.description']} className="mt-2" />
                    </div>
                </div>

                {/* Banner */}
                <div className="mb-8">
                    <h3 className="text-foreground mb-2 text-sm font-medium">Banner</h3>
                    <div className="mt-5">
                        <ImageUpload
                            value={data.page.banner ?? null}
                            previewUrl={data.page.previewUrl ?? null}
                            onChange={(file, url) => setData((prev) => ({ ...prev, page: { ...prev.page, banner: file, previewUrl: url } }))}
                            onRemove={() => setData((prev) => ({ ...prev, page: { ...prev.page, banner: null, previewUrl: null } }))}
                            label="Upload Banner"
                            aspectRatio={16 / 9}
                            error={errors['page.banner']}
                            inputId="history-banner"
                        />
                    </div>
                </div>

                <Separator className="my-10" />

                {/* Past Presidents */}
                <div className="mb-6">
                    <h3 className="text-foreground mb-4 flex items-center gap-3 text-base font-semibold">
                        Past Presidents
                        {directorErrorCount > 0 && (
                            <Badge variant="destructive" className="rounded-full border-none px-1.75 py-0.5 text-sm font-medium">
                                {directorErrorCount}
                            </Badge>
                        )}
                    </h3>
                    <DirectorsSection
                        directors={history.directors}
                        onUpdateDirectors={handleUpdateDirectors}
                        onDeleteDirector={handleDeleteDirector}
                        errors={errors}
                    />
                </div>

                <Separator className="my-10" />

                {/* Campus Gallery */}
                <div className="mb-6">
                    <h3 className="text-foreground mb-4 flex items-center gap-3 text-base font-semibold">
                        Campus Gallery
                        {galleryErrorCount > 0 && (
                            <Badge variant="destructive" className="rounded-full border-none px-1.75 py-0.5 text-sm font-medium">
                                {galleryErrorCount}
                            </Badge>
                        )}
                    </h3>
                    <GallerySection
                        gallery={history.gallery}
                        onUpdateGallery={handleUpdateGallery}
                        onDeleteGallery={handleDeleteGallery}
                        errors={errors}
                    />
                </div>
            </div>

            <SectionFooter onSave={handleSave} onPreview={handlePreview} />
        </div>
    );
};

export default HistoryContentSection;
