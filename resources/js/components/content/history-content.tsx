import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import { CampusDirectors, CampusGallery, ContentPages } from '@/types/content';
import { useForm } from '@inertiajs/react';
import { Edit2, Trash2, Upload } from 'lucide-react';
import React, { useEffect } from 'react';
import InputError from '../input-error';
import { Label } from '../ui/label';
import { DirectorsSection } from './history/directors';
import { GallerySection } from './history/gallery';
import { Badge } from '../ui/badge';

interface History { directors: CampusDirectors[]; gallery: CampusGallery[]; }
interface HistoryContentSectionProps { history_page: ContentPages; history: History; }
interface PageForm { content_page_id?: number; page: string; title: string; description: string; banner?: File | null; previewUrl?: string | null; }
interface DirectorsForm { director_id: number; name: string; term_start_date: number; term_end_date: number; description: string; profile_image: File | null; previewUrl?: string | null; }
interface GalleryForm { gallery_id: number; image: File | null; previewUrl?: string | null; description: string; }
interface HistoryForm { page: PageForm; directors: DirectorsForm[]; gallery: GalleryForm[]; }

const HistoryContentSection: React.FC = ({ ...props }: HistoryContentSectionProps) => {
    const { history, history_page } = props;
    const { data, setData, post, errors } = useForm<HistoryForm>({
        page: { content_page_id: history_page?.content_page_id, page: history_page?.page || 'History', title: history_page?.title || '', description: history_page?.description || '', banner: null, previewUrl: history_page?.image_path || null },
        directors: history.directors?.map((d) => ({ director_id: d.director_id, name: d.name || '', term_start_date: d.term_start_date || '', term_end_date: d.term_end_date || '', description: d.description || '', profile_image: null, previewUrl: d.profile_image_path || '' })) || [],
        gallery: history.gallery?.map((g) => ({ gallery_id: g.gallery_id, image: null, previewUrl: g.image_path || '', description: g.description || '' })) || [],
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { const previewUrl = URL.createObjectURL(file); setData({ ...data, page: { ...data.page, banner: file, previewUrl } }); }
    };

    useEffect(() => { return () => { if (data.page?.previewUrl?.startsWith('blob:')) URL.revokeObjectURL(data.page?.previewUrl); }; }, [data.page?.previewUrl]);

    const handleUpdateDirectors = (directorLocal: CampusDirectors, director: DirectorsForm) => {
        setData((prevData) => {
            const directorForForm: DirectorsForm = { director_id: directorLocal.director_id, name: director.name, term_start_date: director.term_start_date, term_end_date: director.term_end_date, description: director.description, profile_image: director.profile_image, previewUrl: director.previewUrl };
            let formDirectors;
            const formIndex = prevData.directors?.findIndex((d) => d.director_id === directorForForm.director_id);
            if (formIndex !== undefined && formIndex !== -1) { formDirectors = prevData.directors?.map((d, index) => (index === formIndex ? directorForForm : d)); }
            else { formDirectors = [...(prevData.directors ?? []), directorForForm]; }
            return { ...prevData, directors: formDirectors };
        });
    };

    const handleDeleteDirector = (id: number) => setData((prev) => ({ ...prev, directors: prev.directors.filter((d) => d.director_id !== id) }));

    const handleUpdateGallery = (galleryLocal: CampusGallery, gallery: GalleryForm) => {
        setData((prevData) => {
            const galleryForForm: GalleryForm = { gallery_id: galleryLocal.gallery_id, image: gallery.image, previewUrl: gallery.previewUrl, description: gallery.description };
            let formGallery;
            const formIndex = prevData.gallery?.findIndex((g) => g.gallery_id === galleryForForm.gallery_id);
            if (formIndex !== undefined && formIndex !== -1) { formGallery = prevData.gallery?.map((g, index) => (index === formIndex ? galleryForForm : g)); }
            else { formGallery = [...(prevData.gallery ?? []), galleryForForm]; }
            return { ...prevData, gallery: formGallery };
        });
    };

    const handleDeleteGallery = (id: number) => setData((prev) => ({ ...prev, gallery: prev.gallery.filter((g) => g.gallery_id !== id) }));
    const handleSave = () => post(route('content.history.update'), { preserveScroll: true, preserveState: true });
    const handlePreview = () => window.open('/about/history', '_blank');

    const directorErrorCount = Object.keys(errors).filter((key) => key.startsWith('directors.')).length;
    const galleryErrorCount = Object.keys(errors).filter((key) => key.startsWith('gallery.')).length;

    return (
        <div className="scroll-mt-6 rounded-lg border border-border bg-card">
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-foreground">History Page</h2>
                    <p className="text-sm text-muted-foreground">Configure page title, subtitle, and banner</p>
                </div>

                <div className="mb-10 grid grid-cols-1 gap-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">Title</label>
                        <Input type="text" placeholder="Enter history page title..." value={data.page.title} onChange={(e) => setData('page.title', e.target.value)} />
                        <InputError message={errors['page.title']} className="mt-2" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-foreground">Subtitle / Description</label>
                        <Textarea placeholder="Enter history page subtitle or description..." value={data.page.description} onChange={(e) => setData('page.description', e.target.value)} autoResize minHeight={100} />
                        <InputError message={errors['page.description']} className="mt-2" />
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="mb-2 text-sm font-medium text-foreground">Banner</h3>
                    {!data.page.previewUrl ? (
                        <Label className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-muted/30 p-12 text-center transition-all duration-300 hover:border-primary/70 flex flex-col items-center">
                            <div className="flex flex-col items-center justify-center gap-4">
                                <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-dashed border-border transition-transform duration-300 group-hover:scale-105">
                                    <Upload className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="mb-1 text-base font-semibold text-foreground">Upload Banner</p>
                                    <p className="text-sm text-muted-foreground">JPG, PNG, JPEG</p>
                                </div>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </Label>
                    ) : (
                        <div className="group relative overflow-hidden rounded-lg">
                            <img src={data.page.previewUrl} alt="Preview" className="h-48 w-full object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-foreground/40 opacity-0 transition group-hover:opacity-100">
                                <input type="file" accept="image/*" className="hidden" id="replace-history-image" onChange={handleImageChange} />
                                <Button type="button" variant="outline" className="h-12 w-12 rounded-full bg-background p-0" onClick={() => document.getElementById('replace-history-image')?.click()}>
                                    <Edit2 className="h-5 w-5 text-destructive" />
                                </Button>
                                <Button type="button" variant="outline" className="h-12 w-12 rounded-full bg-background p-0" onClick={() => setData({ ...data, page: { ...data.page, banner: null, previewUrl: null } })}>
                                    <Trash2 className="h-5 w-5 text-destructive" />
                                </Button>
                            </div>
                        </div>
                    )}
                    <InputError message={errors['page.banner']} className="mt-2" />
                </div>

                <Separator className="my-10" />

                <div className="mb-6">
                    <h3 className="mb-4 flex items-center gap-3 text-base font-semibold text-foreground">
                        Past Presidents
                        {directorErrorCount > 0 && (
                            <Badge variant="destructive" className="rounded-full border-none px-1.75 py-0.5 text-sm font-medium">{directorErrorCount}</Badge>
                        )}
                    </h3>
                    <DirectorsSection directors={history.directors} onUpdateDirectors={handleUpdateDirectors} onDeleteDirector={handleDeleteDirector} errors={errors} />
                </div>

                <Separator className="my-10" />

                <div className="mb-6">
                    <h3 className="mb-4 flex items-center gap-3 text-base font-semibold text-foreground">
                        Campus Gallery
                        {galleryErrorCount > 0 && (
                            <Badge variant="destructive" className="rounded-full border-none px-1.75 py-0.5 text-sm font-medium">{galleryErrorCount}</Badge>
                        )}
                    </h3>
                    <GallerySection gallery={history.gallery} onUpdateGallery={handleUpdateGallery} onDeleteGallery={handleDeleteGallery} errors={errors} />
                </div>
            </div>
            <SectionFooter onSave={handleSave} onPreview={handlePreview} />
        </div>
    );
};

export default HistoryContentSection;