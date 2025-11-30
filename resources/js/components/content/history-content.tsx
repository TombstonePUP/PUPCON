import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import { CampusDirectors, CampusGallery, ContentPages } from '@/types/content';
import { useForm } from '@inertiajs/react';
import { Edit2, Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import InputError from '../input-error';
import { Label } from '../ui/label';
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
    const directors = history.directors;
    const gallery = history.gallery;
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
            directors?.map((d) => ({
                director_id: d.director_id,
                name: d.name || '',
                term_start_date: d.term_start_date || '',
                term_end_date: d.term_end_date || '',
                description: d.description || '',
                profile_image: null,
                previewUrl: d.profile_image_path || '',
            })) || [],
        gallery:
            gallery?.map((g) => ({
                gallery_id: g.gallery_id,
                image: null,
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

    const director_errors = extractGroupedErrors(errors, 'directors');
    const gallery_errors = extractGroupedErrors(errors, 'gallery');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setData({
                ...data,
                page: {
                    ...data.page,
                    banner: file,
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

            let formDirectors;
            const formIndex = prevData.directors?.findIndex((d) => d.director_id === directorForForm.director_id);

            if (formIndex !== undefined && formIndex !== -1) {
                formDirectors = prevData.directors?.map((d, index) => (index === formIndex ? directorForForm : d));
            } else {
                formDirectors = [...(prevData.directors ?? []), directorForForm];
            }

            return {
                ...prevData,
                directors: formDirectors,
            };
        });
    };

    const handleDeleteDirector = (id: number) => {
        setData((prev) => (
            {
                ...prev,
                directors: prev.directors.filter((director) => director.director_id !== id),
            }
        ));
    };

    const handleUpdateGallery = (galleryLocal: CampusGallery, gallery: GalleryForm) => {
        setData((prevData) => {
            const galleryForForm: GalleryForm = {
                gallery_id: galleryLocal.gallery_id,
                image: gallery.image,
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
        setData((prev) => (
            {
                ...prev,
                gallery: prev.gallery.filter((gallery) => gallery.gallery_id !== id),
            }
        ));
    };

    const handleSave = () => {
        console.log(data);
        post(route('content.history.update'), {});
    };

    const handlePreview = () => {
        window.open('/about/history', '_blank');
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
                            value={data.page.title}
                            onChange={(e) => setData('page.title', e.target.value)}
                        />
                        <InputError message={errors['page.title']} className="mt-2" />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Subtitle / Description</label>
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

                <div className="mb-8">
                    <h3 className="mb-2 text-sm font-medium text-gray-700">Banner</h3>
                    {!data.page.previewUrl ? (
                        <Label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="mb-4 h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
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
                            <img src={data.page.previewUrl} alt="Preview" className="h-48 w-full rounded-lg border border-gray-200 object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-lg bg-black/40 opacity-0 transition group-hover:opacity-100">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="replace-history-image"
                                    onChange={handleImageChange} // reuse your same handler
                                />

                                {/* Replace image button */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-12 w-12 rounded-full bg-white p-0 transition-transform duration-200 hover:scale-110 hover:bg-red-50"
                                    size="lg"
                                    onClick={() => document.getElementById('replace-history-image')?.click()}
                                >
                                    <Edit2 className="h-5 w-5 text-red-600" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-12 w-12 rounded-full bg-white p-0 transition-transform duration-200 hover:scale-110 hover:bg-red-50"
                                    size="lg"
                                    onClick={() =>
                                        setData({
                                            ...data,
                                            page: {
                                                ...data.page,
                                                banner: null,
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
                    <InputError message={errors['page.banner']} className="mt-2" />
                </div>

                <Separator className="my-10 bg-gray-200" />

                <div className="mb-6">
                    <h3 className="mb-4 text-base font-semibold text-gray-900">Past Presidents</h3>
                    <DirectorsSection
                        directors={directors}
                        onUpdateDirectors={handleUpdateDirectors}
                        onDeleteDirector={handleDeleteDirector}
                    />
                    {director_errors.length > 0 && (
                        <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-4">
                            <h4 className="mb-2 font-semibold text-red-700">Directors Section Errors</h4>
                            <ul className="ml-6 list-disc text-sm text-red-600">
                                {director_errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <Separator className="my-10 bg-gray-200" />

                <div className="mb-6">
                    <h3 className="mb-4 text-base font-semibold text-gray-900">Campus Gallery</h3>
                    <GallerySection
                        gallery={gallery}
                        onUpdateGallery={handleUpdateGallery}
                        onDeleteGallery={handleDeleteGallery}
                    />
                    {gallery_errors.length > 0 && (
                        <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-4">
                            <h4 className="mb-2 font-semibold text-red-700">Gallery Section Errors</h4>
                            <ul className="ml-6 list-disc text-sm text-red-600">
                                {gallery_errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <SectionFooter onSave={handleSave} onPreview={handlePreview} />
        </div>
    );
};

export default HistoryContentSection;
