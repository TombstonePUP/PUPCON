import GalleryDialog from '@/components/dialogs/content/programs/gallery/gallery-dialog';
import ObjectiveDialog from '@/components/dialogs/content/programs/objectives/objective-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import { PerProgram, ProgramGalleryImages, ProgramObjectives } from '@/types';
import { useForm } from '@inertiajs/react';
import { Edit2, EditIcon, ImageIcon, Plus, Trash2, Upload, X } from 'lucide-react';
import { RefObject, useEffect, useState } from 'react';

interface ProgramSectionProps {
    program: PerProgram;
    overviewRef: RefObject<HTMLDivElement | null>;
    objectivesRef: RefObject<HTMLDivElement | null>;
    galleryRef: RefObject<HTMLDivElement | null>;
}

interface GalleryForm {
    gallery_id: number | null;
    image: File | null;
    previewUrl: string | null;
    caption: string;
}

interface ObjectiveForm {
    objective_id: number | null;
    title: string;
    description: string;
}

interface ProgramForm {
    banner: File | null;
    description: string;
    previewUrl: string | null;
    objectives: ObjectiveForm[];
    gallery: GalleryForm[];
}

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-gray-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

const ImageDisplay: React.FC<{ url: string | null; alt: string }> = ({ url, alt }) => {
    const [hasError, setHasError] = useState(false);
    useEffect(() => setHasError(false), [url]);

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

export default function ProgramSection({ program, overviewRef, objectivesRef, galleryRef }: ProgramSectionProps) {
    const [objectives, setObjectives] = useState<ProgramObjectives[]>(program.objectives || []);
    const [galleryItems, setGalleryItems] = useState<ProgramGalleryImages[]>(program.gallery || []);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'objective' | 'gallery' | null>(null);
    const [action, setAction] = useState<'add' | 'edit' | 'delete' | null>(null);

    const [selectedObjectiveId, setSelectedObjectiveId] = useState<number | null>();
    const [selectedGalleryId, setSelectedGalleryId] = useState<number | null>();
    const selectedObjective = objectives.find((obj) => obj.program_objective_id === selectedObjectiveId);
    const selectedGalleryItem = galleryItems.find((item) => item.program_gallery_id === selectedGalleryId);

    const { data, setData, post, errors, processing } = useForm<ProgramForm>({
        banner: null,
        description: program.program_description || '',
        previewUrl: program.program_image_path || null,
        objectives: objectives.map((obj) => ({
            objective_id: obj.program_objective_id,
            title: obj.objective_title,
            description: obj.objective_description,
        })),
        gallery: galleryItems.map((item) => ({
            gallery_id: item.program_gallery_id,
            image: null,
            previewUrl: item.image_path,
            caption: item.caption,
        })),
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setData({
                ...data,
                banner: file,
                previewUrl,
            });
        }
    };

    useEffect(() => {
        return () => {
            if (data.previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(data.previewUrl);
            }
        };
    }, [data.previewUrl]);

    const addObjective = () => {
        setSelectedObjectiveId(null);
        setDialogType('objective');
        setAction('add');
        setDialogOpen(true);
    };

    const editObjective = (obj: ProgramObjectives) => {
        setSelectedObjectiveId(obj.program_objective_id);
        setDialogType('objective');
        setAction('edit');
        setDialogOpen(true);
    };

    const saveObjective = (obj: ObjectiveForm) => {
        setObjectives((prev) => {
            const exists = prev.find((o) => o.program_objective_id === obj.objective_id);
            let updatedObjectives: ProgramObjectives[] = [];
            const objectiveData: ProgramObjectives = {
                program_objective_id: obj.objective_id || Date.now(), // Temporary ID for new objectives
                program_id: program.program_id,
                objective_title: obj.title,
                objective_description: obj.description,
            };
            if (exists) {
                updatedObjectives = prev.map((o) => (o.program_objective_id === objectiveData.program_objective_id ? objectiveData : o));
            } else {
                updatedObjectives = [...prev, objectiveData];
            }

            setData((prev) => {
                const objectiveForForm: ObjectiveForm = {
                    objective_id: objectiveData.program_objective_id,
                    title: obj.title,
                    description: obj.description,
                };

                let formObjectives;
                const formIndex = prev.objectives?.findIndex((f) => f.objective_id === obj.objective_id);

                if (formIndex !== undefined && formIndex !== -1) {
                    formObjectives = prev.objectives?.map((f, index) => (index === formIndex ? objectiveForForm : f));
                } else {
                    formObjectives = [...(prev.objectives ?? []), objectiveForForm];
                }

                return {
                    ...prev,
                    objectives: formObjectives,
                };
            });

            return updatedObjectives;
        });
    };

    const deleteObjective = (id: number) => {
        setObjectives((prev) => {
            const updated = prev.filter((o) => o.program_objective_id !== id);
            if (selectedObjectiveId === id) {
                setSelectedObjectiveId(null);
            }
            return updated;
        });
        setDialogOpen(false);
    };

    const addGallery = () => {
        setSelectedGalleryId(null);
        setDialogType('gallery');
        setAction('add');
        setDialogOpen(true);
    };

    const editGallery = (item: ProgramGalleryImages) => {
        setSelectedGalleryId(item.program_gallery_id);
        setDialogType('gallery');
        setAction('edit');
        setDialogOpen(true);
    };

    const saveGallery = (item: GalleryForm) => {
        setGalleryItems((prev) => {
            const current = prev ?? [];
            const existingIndex = current.findIndex((g) => g.program_gallery_id === item.gallery_id);
            let updatedList;
            let galleryForLocalState: ProgramGalleryImages; // Object for display (facilityList)

            // Local State Update
            galleryForLocalState = {
                program_gallery_id: item.gallery_id || 0,
                program_id: program.program_id,
                image_name: item.caption,
                image_path: item.previewUrl || '',
                caption: item.caption,
            };

            if (existingIndex !== -1) {
                updatedList = current.map((g) => (g.program_gallery_id === galleryForLocalState.program_gallery_id ? galleryForLocalState : g));
            } else {
                const newId = Math.max(0, ...current.map((g) => g.program_gallery_id || 0)) + 1;
                galleryForLocalState.program_gallery_id = newId; // Assign new ID to the local object
                updatedList = [...current, galleryForLocalState];
            }

            // Data Syncing
            setData((prevData) => {
                const galleryForForm: GalleryForm = {
                    gallery_id: galleryForLocalState.program_gallery_id,
                    image: item.image,
                    previewUrl: item.previewUrl,
                    caption: item.caption,
                };

                let formGallery;
                const formIndex = prevData.gallery?.findIndex((g) => g.gallery_id === galleryForLocalState.program_gallery_id);

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

            setSelectedGalleryId(galleryForLocalState.program_gallery_id);
            return updatedList;
        });
    };

    const deleteGallery = (id: number) => {
        setGalleryItems((prev) => {
            const updated = prev.filter((g) => g.program_gallery_id !== id);
            if (selectedGalleryId === id) {
                setSelectedGalleryId(null);
            }

            setData((prevData) => ({
                ...prevData,
                gallery: updated,
            }));
            return updated;
        });
        setDialogOpen(false);
    };

    const onSave = (e: React.MouseEvent<HTMLButtonElement>) => {
        post(route('manage.program.update.content', {
            program_id: program.program_id,
        }));
    };

    const preview = () => {
        window.open(
            route('manage.program', {
                program_name: program.program_link,
                level_id: program.level_id,
            }),
            '_blank',
        );
    };

    return (
        <>
            <div ref={overviewRef} className="scroll-mt-20 rounded-lg border border-gray-200 bg-white">
                <div className="p-8">
                    {/* --- Program Overview --- */}
                    <div className="">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Program Overview</h2>
                            <p className="text-sm text-gray-600">Manage program banner and description</p>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <Label className="mb-2 block text-sm font-medium text-gray-700">Program Image</Label>
                                <div className="mt-5 flex flex-col gap-3">
                                    {!data.previewUrl ? (
                                        <label className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-12 text-center transition-all duration-300 hover:border-[#7f1414]/70">
                                            <input type="file" className="hidden" accept="image/*" disabled={processing} onChange={handleImageChange} />
                                            <div className="flex flex-col items-center justify-center gap-4 pt-5 pb-6">
                                                <div className="relative">
                                                    <div className="rounded-fullopacity-20 absolute inset-0 animate-pulse"></div>
                                                    <div className="relative grid h-16 w-16 place-items-center rounded-full border-2 border-dashed transition-transform duration-300 group-hover:scale-105">
                                                        <Upload className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                </div>
                                                <div className="mt-4 text-center">
                                                    <p className="mb-1 text-lg font-semibold text-gray-700">Upload welcome banner</p>
                                                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                                                </div>
                                                <div className="mt-2 flex gap-2">
                                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">PNG</span>
                                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">JPG</span>
                                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">
                                                        Max 5MB
                                                    </span>
                                                </div>
                                            </div>
                                        </label>
                                    ) : (
                                        <div className="group relative">
                                            <img
                                                src={data.previewUrl}
                                                alt="Preview"
                                                className="h-80 w-full rounded-lg border border-gray-200 object-cover"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-lg bg-black/40 opacity-0 transition group-hover:opacity-100">
                                                <input
                                                    id="replace-image"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    disabled={processing}
                                                    onChange={handleImageChange}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="h-12 w-12 rounded-full bg-white p-0"
                                                    onClick={() => document.getElementById('replace-image')?.click()}
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
                                                            banner: null,
                                                            previewUrl: null,
                                                        })
                                                    }
                                                >
                                                    <Trash2 className="h-5 w-5 text-red-600" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                    <InputError message={errors.banner} />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="program_description" className="mb-2 block text-sm font-medium text-gray-700">
                                    Program Description
                                </Label>
                                <Textarea
                                    id="program_description"
                                    required
                                    defaultValue={program.program_description}
                                    onChange={(e) => {setData('description', e.target.value);}}
                                    placeholder="Provide a detailed description of the program..."
                                    autoResize
                                    disabled={processing}
                                    minHeight={120}
                                />
                                <InputError message={errors.description} />
                            </div>
                        </div>
                    </div>

                    <Separator className="my-10 bg-gray-200" />

                    {/* --- Program Objectives --- */}
                    <div ref={objectivesRef} className="scroll-mt-20">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Program Objectives</h2>
                            <p className="text-sm text-gray-600">Define learning outcomes and goals</p>
                        </div>
                        <div className="flex min-h-[300px] rounded-lg border border-gray-200">
                            <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-4">
                                <h4 className="mb-3 text-xs text-gray-500">Select an Objective</h4>
                                <div className="max-h-[250px] space-y-1 overflow-y-auto">
                                    {objectives?.length === 0 ? (
                                        <div className="flex h-[100px] items-center justify-center">
                                            <p className="text-center text-sm text-gray-500">No objectives added.</p>
                                        </div>
                                    ) : (
                                        objectives?.map((objective) => (
                                            <div
                                                key={objective.program_objective_id}
                                                onClick={() => setSelectedObjectiveId(objective.program_objective_id)}
                                                className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-3 transition-colors ${objective.program_objective_id === selectedObjectiveId
                                                    ? 'bg-[#7f1414]/4 text-[#7f1414]'
                                                    : 'text-gray-700 hover:bg-[#7f1414]/4'
                                                    }`}
                                            >
                                                <span className="truncate text-sm">{objective.objective_title}</span>
                                                <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100">
                                                    <ActionButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            editObjective(objective);
                                                        }}
                                                        className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                                    >
                                                        <EditIcon className="h-4 w-4" />
                                                    </ActionButton>
                                                    <ActionButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteObjective(objective.program_objective_id);
                                                        }}
                                                        className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </ActionButton>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="mt-4 border-t border-gray-200 pt-4">
                                    <Button onClick={() => addObjective()} variant="default" className="w-full">
                                        <Plus className="mr-2 h-4 w-4" /> Add Objective
                                    </Button>
                                </div>
                            </div>
                            <div className="w-2/3 p-6">
                                {selectedObjective ? (
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-semibold break-words text-gray-900">{selectedObjective.objective_title}</h4>
                                        <Separator />
                                        <h5 className="mb-2 text-sm font-semibold text-gray-700">Description</h5>
                                        <p className="text-sm whitespace-pre-wrap text-gray-700">{selectedObjective.objective_description}</p>
                                    </div>
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                                        <X className="mb-2 h-8 w-8" />
                                        <p className="font-medium">No Objective Selected</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator className="my-10 bg-gray-200" />

                    {/* --- Gallery --- */}
                    <div ref={galleryRef} className="scroll-mt-20">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Gallery of Excellence</h2>
                            <p className="text-sm text-gray-600">Showcase program facilities and activities</p>
                        </div>
                        <div className="flex min-h-[300px] rounded-lg border border-gray-200">
                            <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-4">
                                <h4 className="mb-3 text-xs text-gray-500">Select an Image</h4>
                                <div className="max-h-[250px] space-y-1 overflow-y-auto">
                                    {galleryItems?.length === 0 ? (
                                        <div className="flex h-[100px] items-center justify-center">
                                            <p className="text-center text-sm text-gray-500">No images added.</p>
                                        </div>
                                    ) : (
                                        galleryItems?.map((item) => (
                                            <div
                                                key={item.program_gallery_id}
                                                onClick={() => setSelectedGalleryId(item.program_gallery_id)}
                                                className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-3 transition-colors ${item.program_gallery_id === selectedGalleryId
                                                    ? 'bg-[#7f1414]/4 text-[#7f1414]'
                                                    : 'text-gray-700 hover:bg-[#7f1414]/4'
                                                    }`}
                                            >
                                                <span className="truncate text-sm">{item.caption}</span>
                                                <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100">
                                                    <ActionButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            editGallery(item);
                                                        }}
                                                        className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        <EditIcon className="h-4 w-4" />
                                                    </ActionButton>
                                                    <ActionButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteGallery(item.program_gallery_id);
                                                        }}
                                                        className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </ActionButton>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="mt-4 border-t border-gray-200 pt-4">
                                    <Button onClick={addGallery} variant="default" className="w-full">
                                        <Plus className="mr-2 h-4 w-4" /> Add Image
                                    </Button>
                                </div>
                            </div>
                            <div className="w-2/3 p-6">
                                {selectedGalleryItem ? (
                                    <div className="space-y-4">
                                        <ImageDisplay url={selectedGalleryItem.image_path} alt={selectedGalleryItem.image_name} />
                                        <h5 className="text-gray-70fs-auto0 mb-1 text-sm font-semibold">Caption</h5>
                                        <p className="text-sm text-gray-900">{selectedGalleryItem.caption}</p>
                                    </div>
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                                        <X className="mb-2 h-8 w-8" />
                                        <p className="font-medium">No Image Selected</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <SectionFooter onSave={onSave} onPreview={preview}/>
            </div>
            {dialogType === 'objective' && dialogOpen && (
                <ObjectiveDialog type={action} objective={selectedObjective} onClose={() => setDialogOpen(false)} onSave={saveObjective} />
            )}
            {dialogType === 'gallery' && dialogOpen && (
                <GalleryDialog type={action} gallery={selectedGalleryItem} onClose={() => setDialogOpen(false)} onSave={saveGallery} />
            )}
        </>
    );
}
