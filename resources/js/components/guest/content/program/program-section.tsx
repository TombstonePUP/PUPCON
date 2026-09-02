import GalleryDialog from '@/components/admin/dialogs/content/programs/gallery/gallery-dialog';
import ObjectiveDialog from '@/components/admin/dialogs/content/programs/objectives/objective-dialog';
import ImageUpload from '@/components/admin/image-upload';
import InputError from '@/components/input-error';
import { MasterDetailPanel } from '@/components/admin/master-detail-panel';
import { Card, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import { PerProgram, ProgramGalleryImages, ProgramObjectives } from '@/types';
import { useForm } from '@inertiajs/react';
import { ClipboardList, FilePlus2, ImageIcon, ImagePlus, Images, MousePointerClick } from 'lucide-react';
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
    previewUrl?: string | null;
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

const ImageDisplay: React.FC<{ url: string | null; alt: string }> = ({ url, alt }) => {
    const [hasError, setHasError] = useState(false);
    useEffect(() => setHasError(false), [url]);

    if (!url || hasError) {
        return (
            <div className="animate-in fade-in-0 border-border bg-muted text-muted-foreground flex h-64 w-full flex-col items-center justify-center rounded-md border">
                <ImageIcon className="text-muted-foreground h-12 w-12" />
                <span className="mt-2 text-sm">No Image Available</span>
            </div>
        );
    }
    return (
        <img
            src={url}
            alt={alt}
            className="animate-in fade-in-0 border-border bg-muted h-64 w-full rounded-md border object-cover"
            onError={() => setHasError(true)}
        />
    );
};

export default function ProgramSection({ program, overviewRef, objectivesRef, galleryRef }: ProgramSectionProps) {
    const [objectives, setObjectives] = useState<ProgramObjectives[]>(program.objectives || []);
    const [galleryItems, setGalleryItems] = useState<ProgramGalleryImages[]>(program.gallery || []);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'objective' | 'gallery' | null>(null);
    const [action, setAction] = useState<'add' | 'edit' | undefined>(undefined);

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

    const objectiveErrorCount = Object.keys(errors).filter((key) => key.startsWith('objectives.')).length;

    const getSelectedObjectiveIndex = () => {
        return data.objectives?.findIndex((o) => o.objective_id === selectedObjectiveId);
    };

    const getSelectedObjectiveErrors = () => {
        const index = getSelectedObjectiveIndex();
        if (index === -1 || index === undefined) return [];

        return Object.entries(errors)
            .filter(([key]) => key.startsWith(`objectives.${index}.`))
            .map(([, msg]) => msg);
    };

    const selectedObjectiveErrors = getSelectedObjectiveErrors();

    const galleryErrorCount = Object.keys(errors).filter((key) => key.startsWith('gallery.')).length;

    const getSelectedGalleryIndex = () => {
        return data.gallery?.findIndex((o) => o.gallery_id === selectedGalleryId);
    };

    const getSelectedGalleryErrors = () => {
        const index = getSelectedGalleryIndex();
        if (index === -1 || index === undefined) return [];

        return Object.entries(errors)
            .filter(([key]) => key.startsWith(`gallery.${index}.`))
            .map(([, msg]) => msg);
    };

    const selectedGalleryErrors = getSelectedGalleryErrors();

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
            const formObjectives = updated.map((o) => ({
                objective_id: o.program_objective_id,
                title: o.objective_title,
                description: o.objective_description,
            }));

            setData((prevData) => ({
                ...prevData,
                objectives: formObjectives,
            }));

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
            const galleryForLocalState: ProgramGalleryImages = {
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

            const formGallery = updated.map((item) => ({
                gallery_id: item.program_gallery_id,
                image: null,
                previewUrl: item.image_path,
                caption: item.caption,
            }));

            setData((prevData) => ({
                ...prevData,
                gallery: formGallery,
            }));

            return updated;
        });
        setDialogOpen(false);
    };

    const onSave = () => {
        post(
            route('manage.program.update.content', {
                program_id: program.program_id,
            }),
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const preview = () => {
        window.open(
            route('programs.show', {
                program_name: program.program_link,
            }),
            '_blank',
        );
    };

    return (
        <>
            <Card>
                <div className="p-8">
                    {/* Program Overview */}
                    <div id="overview" ref={overviewRef} className="scroll-mt-20">
                        <div className="mb-6">
                            <CardTitle className="text-foreground text-lg font-semibold">Program Overview</CardTitle>
                            <p className="text-muted-foreground text-sm">Manage program banner and description</p>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <Label className="text-foreground mb-2 block text-sm font-medium">Program Image</Label>
                                <ImageUpload
                                    value={data.banner}
                                    previewUrl={data.previewUrl}
                                    onChange={(file, url) => {
                                        setData((prev) => ({ ...prev, banner: file, previewUrl: url }));
                                    }}
                                    onRemove={() => {
                                        setData((prev) => ({ ...prev, banner: null, previewUrl: null }));
                                    }}
                                    label="Upload Welcome Banner"
                                    aspectRatio={16 / 9}
                                    disabled={processing}
                                    error={errors.banner}
                                    inputId="program-banner"
                                />
                            </div>
                            <div>
                                <Label htmlFor="program_description" className="text-foreground mb-2 block text-sm font-medium">
                                    Program Description
                                </Label>
                                <Textarea
                                    id="program_description"
                                    required
                                    defaultValue={program.program_description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Provide a detailed description of the program..."
                                    autoResize
                                    disabled={processing}
                                    minHeight={120}
                                />
                                <InputError message={errors.description} />
                            </div>
                        </div>
                    </div>

                    <Separator className="my-10" />

                    {/* Program Objectives */}
                    <div id="objectives" ref={objectivesRef} className="scroll-mt-20">
                        <MasterDetailPanel
                            title="Program Objectives"
                            description="Define learning outcomes and goals"
                            errorCount={objectiveErrorCount}
                            items={objectives.map((obj, index) => ({
                                id: obj.program_objective_id,
                                label: obj.objective_title,
                                hasError: !!(errors[`objectives.${index}.title`] || errors[`objectives.${index}.description`]),
                            }))}
                            selectedId={selectedObjectiveId ?? null}
                            onSelect={(id) => setSelectedObjectiveId(id as number)}
                            onAdd={addObjective}
                            onEdit={(id) => editObjective(objectives.find((o) => o.program_objective_id === id)!)}
                            onDelete={(id) => deleteObjective(id as number)}
                            emptyListIcon={ClipboardList}
                            emptyListTitle="No objectives added"
                            addIcon={FilePlus2}
                            addLabel="Add Objective"
                            emptyDetailIcon={MousePointerClick}
                            emptyDetailTitle="No objective selected"
                            emptyDetailDescription="Select an objective from the list to view details"
                            detail={
                                selectedObjective ? (
                                    <div className="flex h-full flex-col justify-between gap-4">
                                        <div className="space-y-3">
                                            <h4 className="text-foreground text-lg font-semibold break-words">{selectedObjective.objective_title}</h4>
                                            <Separator />
                                            <div className="border-border bg-muted/30 rounded-md border p-3">
                                                <p className="text-muted-foreground mb-1 text-xs font-medium">Description</p>
                                                <p className="text-foreground text-sm whitespace-pre-wrap">
                                                    {selectedObjective.objective_description}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedObjectiveErrors.length > 0 && (
                                            <div className="border-destructive/20 bg-destructive/10 rounded-md border p-4">
                                                <h4 className="text-destructive mb-2 text-sm font-semibold">Errors in this objective</h4>
                                                <ul className="text-destructive list-disc space-y-1 pl-5 text-sm">
                                                    {selectedObjectiveErrors.map((msg, i) => (
                                                        <li key={i}>{msg}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ) : null
                            }
                        />
                    </div>

                    <Separator className="my-10" />

                    {/* Gallery */}
                    <div id="gallery" ref={galleryRef} className="scroll-mt-20">
                        <MasterDetailPanel
                            title="Gallery of Excellence"
                            description="Showcase program facilities and activities"
                            errorCount={galleryErrorCount}
                            items={galleryItems.map((item, index) => ({
                                id: item.program_gallery_id,
                                label: item.caption,
                                hasError: !!(errors[`gallery.${index}.image`] || errors[`gallery.${index}.caption`]),
                            }))}
                            selectedId={selectedGalleryId ?? null}
                            onSelect={(id) => setSelectedGalleryId(id as number)}
                            onAdd={addGallery}
                            onEdit={(id) => editGallery(galleryItems.find((g) => g.program_gallery_id === id)!)}
                            onDelete={(id) => deleteGallery(id as number)}
                            emptyListIcon={Images}
                            emptyListTitle="No images added"
                            addIcon={ImagePlus}
                            addLabel="Add Image"
                            emptyDetailIcon={MousePointerClick}
                            emptyDetailTitle="No image selected"
                            emptyDetailDescription="Select an image from the list to preview"
                            detail={
                                selectedGalleryItem ? (
                                    <div className="flex h-full flex-col justify-between gap-4">
                                        <div className="space-y-3">
                                            <ImageDisplay url={selectedGalleryItem.image_path} alt={selectedGalleryItem.image_name} />
                                            <div className="border-border bg-muted/30 rounded-md border p-3">
                                                <p className="text-muted-foreground mb-1 text-xs font-medium">Caption</p>
                                                <p className="text-foreground text-sm">{selectedGalleryItem.caption}</p>
                                            </div>
                                        </div>
                                        {selectedGalleryErrors.length > 0 && (
                                            <div className="border-destructive/20 bg-destructive/10 rounded-md border p-4">
                                                <h4 className="text-destructive mb-2 text-sm font-semibold">Errors in this image</h4>
                                                <ul className="text-destructive list-disc space-y-1 pl-5 text-sm">
                                                    {selectedGalleryErrors.map((msg, i) => (
                                                        <li key={i}>{msg}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ) : null
                            }
                        />
                    </div>
                </div>
                <SectionFooter onSave={onSave} onPreview={program.under_survey ? preview : null} />
            </Card>
            {dialogType === 'objective' && dialogOpen && (
                <ObjectiveDialog
                    type={action}
                    objective={selectedObjective}
                    nextObjectiveNumber={objectives.length + 1} // ← ADD THIS
                    onClose={() => setDialogOpen(false)}
                    onSave={saveObjective}
                />
            )}
            {dialogType === 'gallery' && dialogOpen && (
                <GalleryDialog type={action} gallery={selectedGalleryItem} onClose={() => setDialogOpen(false)} onSave={saveGallery} />
            )}
        </>
    );
}
