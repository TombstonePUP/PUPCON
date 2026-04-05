import GalleryDialog from '@/components/dialogs/content/programs/gallery/gallery-dialog';
import ObjectiveDialog from '@/components/dialogs/content/programs/objectives/objective-dialog';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import SectionFooter from '@/components/ui/section-footer';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/text-area';
import { PerProgram, ProgramGalleryImages, ProgramObjectives } from '@/types';
import { useForm } from '@inertiajs/react';
import { CircleAlert, ClipboardList, Edit2, EditIcon, FilePlus2, ImageIcon, ImagePlus, Images, MousePointerClick, Plus, Trash2, Upload, X } from 'lucide-react';
import { RefObject, useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import ImageUploader from '@/components/image-uploader';
import { Card, CardTitle } from '@/components/ui/card';

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
};

export function EmptyState({ icon: Icon = MousePointerClick, title, description }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
      <div className="rounded-full bg-muted p-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground/80">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
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

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
  <button className={`p-1 text-muted-foreground transition-colors hover:text-foreground ${className}`} type="button" {...props}>
    {children}
  </button>
);

const ImageDisplay: React.FC<{ url: string | null; alt: string }> = ({ url, alt }) => {
  const [hasError, setHasError] = useState(false);
  useEffect(() => setHasError(false), [url]);

  if (!url || hasError) {
    return (
      <div className="animate-in fade-in-0 flex h-64 w-full flex-col items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
        <ImageIcon className="h-12 w-12 text-muted-foreground" />
        <span className="mt-2 text-sm">No Image Available</span>
      </div>
    );
  }
  return (
    <img
      src={url}
      alt={alt}
      className="animate-in fade-in-0 h-64 w-full rounded-md border border-border bg-muted object-cover"
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
    console.log('Saving program content...', data);
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
              <CardTitle className="text-lg font-semibold text-foreground">Program Overview</CardTitle>
              <p className="text-sm text-muted-foreground">Manage program banner and description</p>
            </div>
            <div className="space-y-6">
              <div>
                <Label className="mb-2 block text-sm font-medium text-foreground">Program Image</Label>
                <div className="flex flex-col gap-3">
                  {!data.previewUrl ? (
                    <label className="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-muted/30 p-12 text-center transition-all duration-300 hover:border-primary/70">
                      <input type="file" className="hidden" accept="image/*" disabled={processing} onChange={handleImageChange} />
                      <div className="flex flex-col items-center justify-center gap-4 pt-5 pb-6">
                        <div className="relative grid h-16 w-16 place-items-center rounded-full border-2 border-dashed border-border transition-transform duration-300 group-hover:scale-105">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="mt-4 text-center">
                          <p className="mb-2 text-lg font-semibold text-foreground">Upload Welcome Banner</p>
                          <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">PNG</span>
                          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">JPG</span>
                          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Max 5MB</span>
                        </div>
                      </div>
                    </label>
                  ) : (
                    <div className="group relative">
                      <img src={data.previewUrl} alt="Preview" className="h-80 w-full rounded-lg border border-border object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-lg bg-black/40 opacity-0 transition group-hover:opacity-100">
                        <input id="replace-image" type="file" accept="image/*" className="hidden" disabled={processing} onChange={handleImageChange} />
                        <Button type="button" variant="outline" className="h-12 w-12 rounded-full bg-card p-0" onClick={() => document.getElementById('replace-image')?.click()}>
                          <Edit2 className="h-5 w-5 text-destructive" />
                        </Button>
                        <Button type="button" variant="outline" className="h-12 w-12 rounded-full bg-card p-0" onClick={() => setData({ ...data, banner: null, previewUrl: null })}>
                          <Trash2 className="h-5 w-5 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )}
                  <InputError message={errors.banner} />
                </div>
              </div>
              <div>
                <Label htmlFor="program_description" className="mb-2 block text-sm font-medium text-foreground">
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
            <div className="mb-6">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
                Program Objectives
                {objectiveErrorCount > 0 && (
                  <Badge variant="destructive" className="rounded-full border-none px-1.75 py-0.5 text-sm font-medium">
                    {objectiveErrorCount}
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Define learning outcomes and goals</p>
            </div>
            <div className="flex min-h-[300px] rounded-lg border border-border">
              <div className="flex w-1/3 flex-col border-r border-border bg-muted/30 p-4">
                <h4 className="mb-3 text-xs text-muted-foreground">Select an Objective</h4>
                <div className="overflow-y-auto space-y-1 max-h-[250px]">
                  {objectives?.length === 0 ? (
                    <div className="h-[200px]">
                      <EmptyState icon={ClipboardList} title="No objectives added" />
                    </div>
                  ) : (
                    objectives?.map((objective, index) => (
                      <div
                        key={objective.program_objective_id}
                        onClick={() => setSelectedObjectiveId(objective.program_objective_id)}
                        className={`group flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 transition-colors ${objective.program_objective_id === selectedObjectiveId
                          ? 'border-primary/30 bg-primary/10 text-primary/95'
                          : 'border-border bg-background text-foreground hover:border-primary/20 hover:bg-primary/5'
                          }`}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="truncate text-sm">{objective.objective_title}</span>
                          {(errors[`objectives.${index}.title`] || errors[`objectives.${index}.description`]) && (
                            <CircleAlert className="inline-block h-4 w-4 shrink-0 text-destructive" />
                          )}
                        </div>
                        <div className="flex shrink-0 items-center space-x-0.5 opacity-0 group-hover:opacity-100">
                          <ActionButton
                            onClick={(e) => { e.stopPropagation(); editObjective(objective); }}
                            className="cursor-pointer rounded-md hover:bg-muted hover:text-foreground"
                          >
                            <EditIcon className="h-4 w-4" />
                          </ActionButton>
                          <ActionButton
                            onClick={(e) => { e.stopPropagation(); deleteObjective(objective.program_objective_id); }}
                            className="cursor-pointer rounded-md hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </ActionButton>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4 border-t border-border pt-4">
                  <Button onClick={() => addObjective()} variant="default" className="w-full text-xs">
                    <FilePlus2 className="h-4 w-4" />
                    <span className="hidden xl:inline">Add Objective</span>
                  </Button>
                </div>
              </div>

              <div className="w-2/3 p-6">
                {selectedObjective ? (
                  <div className="flex h-full flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <h4 className="break-words text-lg font-semibold text-foreground">{selectedObjective.objective_title}</h4>
                      <Separator />
                      <div className="rounded-md border border-border bg-muted/30 p-3">
                        <p className="mb-1 text-xs font-medium text-muted-foreground">Description</p>
                        <p className="whitespace-pre-wrap text-sm text-foreground">{selectedObjective.objective_description}</p>
                      </div>
                    </div>
                    {selectedObjectiveErrors.length > 0 && (
                      <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4">
                        <h4 className="mb-2 text-sm font-semibold text-destructive">Errors in this objective</h4>
                        <ul className="list-disc space-y-1 pl-5 text-sm text-destructive">
                          {selectedObjectiveErrors.map((msg, i) => <li key={i}>{msg}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <EmptyState
                    icon={MousePointerClick}
                    title="No objective selected"
                    description="Select an objective from the list to view details"
                  />
                )}
              </div>
            </div>
          </div>

          <Separator className="my-10" />

          {/* Gallery */}
          <div id="gallery" ref={galleryRef} className="scroll-mt-20">
            <div className="mb-6">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
                Gallery of Excellence
                {galleryErrorCount > 0 && (
                  <Badge variant="destructive" className="rounded-full border-none px-1.75 py-0.5 text-sm font-medium">
                    {galleryErrorCount}
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">Showcase program facilities and activities</p>
            </div>
            <div className="flex min-h-[300px] rounded-lg border border-border">
              <div className="w-1/3 border-r border-border bg-muted/30 p-4 flex flex-col">
                <h4 className="mb-3 text-xs text-muted-foreground">Select an Image</h4>
                <div className="overflow-y-auto space-y-1">
                  {galleryItems?.length === 0 ? (
                    <div className="h-[200px]">
                      <EmptyState icon={Images} title="No images added" />
                    </div>
                  ) : (
                    galleryItems?.map((item, index) => (
                      <div
                        key={item.program_gallery_id}
                        onClick={() => setSelectedGalleryId(item.program_gallery_id)}
                        className={`group flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 transition-colors ${item.program_gallery_id === selectedGalleryId
                          ? 'border-primary/30 bg-primary/10 text-primary/95'
                          : 'border-border bg-background text-foreground hover:border-primary/20 hover:bg-primary/5'
                          }`}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="truncate text-sm">{item.caption}</span>
                          {(errors[`gallery.${index}.image`] || errors[`gallery.${index}.caption`]) && (
                            <CircleAlert className="inline-block h-4 w-4 shrink-0 text-destructive" />
                          )}
                        </div>
                        <div className="flex shrink-0 items-center space-x-0.5 opacity-0 group-hover:opacity-100">
                          <ActionButton
                            onClick={(e) => { e.stopPropagation(); editGallery(item); }}
                            className="cursor-pointer rounded-md hover:bg-muted hover:text-foreground"
                          >
                            <EditIcon className="h-4 w-4" />
                          </ActionButton>
                          <ActionButton
                            onClick={(e) => { e.stopPropagation(); deleteGallery(item.program_gallery_id); }}
                            className="cursor-pointer rounded-md hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </ActionButton>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4 border-t border-border pt-4">
                  <Button onClick={addGallery} variant="default" className="w-full text-xs">
                    <ImagePlus className="h-4 w-4" />
                    <span className="hidden xl:inline">Add Image</span>
                  </Button>
                </div>
              </div>
              <div className="w-2/3 p-6">
                {selectedGalleryItem ? (
                  <div className="flex h-full flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <ImageDisplay url={selectedGalleryItem.image_path} alt={selectedGalleryItem.image_name} />
                      <div className="rounded-md border border-border bg-muted/30 p-3">
                        <p className="mb-1 text-xs font-medium text-muted-foreground">Caption</p>
                        <p className="text-sm text-foreground">{selectedGalleryItem.caption}</p>
                      </div>
                    </div>
                    {selectedGalleryErrors.length > 0 && (
                      <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4">
                        <h4 className="mb-2 text-sm font-semibold text-destructive">Errors in this image</h4>
                        <ul className="list-disc space-y-1 pl-5 text-sm text-destructive">
                          {selectedGalleryErrors.map((msg, i) => <li key={i}>{msg}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <EmptyState
                    icon={MousePointerClick}
                    title="No image selected"
                    description="Select an image from the list to preview"
                  />
                )}
              </div>
            </div>
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
