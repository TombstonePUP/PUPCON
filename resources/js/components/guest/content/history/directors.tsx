import { DirectorsDialog } from '@/components/admin/dialogs/content/history/directors-dialog';
import { MasterDetailPanel } from '@/components/admin/master-detail-panel';
import { Separator } from '@/components/ui/separator';
import { CampusDirectors } from '@/types/content';
import { ImageIcon, UserRoundPlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface DirectorsForm {
    director_id: number;
    name: string;
    term_start_date: string;
    term_end_date: string;
    description: string;
    profile_image: File | null;
    previewUrl?: string | null;
}

interface DirectorsProps {
    directors: CampusDirectors[];
    onUpdateDirectors: (directorLocal: CampusDirectors, director: DirectorsForm) => void;
    onDeleteDirector: (id: number) => void;
    errors?: Record<string, string>;
}

const SharedPhotoPreview: React.FC<{ url: string | null; alt: string; heightClass?: string }> = ({ url, alt, heightClass = 'h-48' }) => {
    const [hasError, setHasError] = useState(false);
    useEffect(() => {
        setHasError(false);
    }, [url]);

    if (!url || hasError) {
        return (
            <div
                className={`w-full ${heightClass} animate-in fade-in-0 border-border bg-muted text-muted-foreground flex flex-col items-center justify-center rounded-md border`}
            >
                <ImageIcon className="text-muted-foreground/50 h-12 w-12" />
                <span className="mt-2 text-sm">No Image Available</span>
            </div>
        );
    }

    return (
        <img
            src={url}
            alt={alt}
            className={`w-full ${heightClass} animate-in fade-in-0 border-border bg-muted rounded-md border object-cover`}
            onError={() => setHasError(true)}
        />
    );
};

export function DirectorsSection({ directors, onUpdateDirectors, onDeleteDirector, errors = {} }: DirectorsProps) {
    const [directorsList, setDirectorsList] = useState<CampusDirectors[]>(directors ?? []);
    const [selectedDirectorId, setSelectedDirectorId] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<'add' | 'edit'>('add');

    const selectedDirector = directorsList.find((d) => d.director_id === selectedDirectorId) ?? null;

    const handleAddDirector = () => {
        setDialogAction('add');
        setDialogOpen(true);
        setSelectedDirectorId(null);
    };
    const handleEditDirector = (id: number | string) => {
        setDialogAction('edit');
        setDialogOpen(true);
        setSelectedDirectorId(Number(id));
    };

    const handleDelete = (id: number | string) => {
        setDirectorsList((prev) => {
            const updated = prev.filter((d) => d.director_id !== Number(id));
            onDeleteDirector(Number(id));
            if (selectedDirectorId === Number(id)) setSelectedDirectorId(null);
            return updated;
        });
    };

    const handleSave = (director: DirectorsForm) => {
        setDirectorsList((prev) => {
            const current = prev ?? [];
            const existingIndex = current.findIndex((d) => d.director_id === director.director_id);
            const directorForLocalState: CampusDirectors = {
                director_id: director.director_id,
                name: director.name,
                term_start_date: director.term_start_date,
                term_end_date: director.term_end_date,
                description: director.description,
                profile_image_path: director.previewUrl || '',
            };
            let updatedList: CampusDirectors[];
            if (existingIndex !== -1) {
                updatedList = current.map((d) => (d.director_id === directorForLocalState.director_id ? directorForLocalState : d));
            } else {
                const newId = Math.max(0, ...current.map((d) => d.director_id || 0)) + 1;
                directorForLocalState.director_id = newId;
                updatedList = [...current, directorForLocalState];
            }
            onUpdateDirectors(directorForLocalState, director);
            return updatedList;
        });
    };

    const getSelectedDirectorErrors = () => {
        const index = directorsList.findIndex((d) => d.director_id === selectedDirectorId);
        if (index === -1) return [];
        return Object.entries(errors)
            .filter(([key]) => key.startsWith(`directors.${index}.`))
            .map(([, msg]) => msg);
    };

    const listItems = directorsList.map((director, index) => ({
        id: director.director_id,
        label: director.name,
        hasError: !!(
            errors[`directors.${index}.name`] ||
            errors[`directors.${index}.term_start_date`] ||
            errors[`directors.${index}.term_end_date`] ||
            errors[`directors.${index}.description`] ||
            errors[`directors.${index}.image`]
        ),
    }));

    const selectedDirectorErrors = getSelectedDirectorErrors();

    const detail = selectedDirector ? (
        <div className="space-y-6">
            <div className="border-border overflow-hidden rounded-lg border">
                <SharedPhotoPreview url={selectedDirector.profile_image_path} alt={selectedDirector.profile_image_name ?? ''} />
            </div>
            <div>
                <h4 className="text-foreground text-lg font-semibold break-words">{selectedDirector.name}</h4>
                <p className="text-primary text-sm font-medium">
                    {selectedDirector.term_start_date}–{selectedDirector.term_end_date}
                </p>
            </div>
            <Separator />
            <div>
                <h5 className="text-foreground mb-2 text-sm font-semibold">Details</h5>
                <p className="text-muted-foreground text-sm">{selectedDirector.description}</p>
            </div>
            {selectedDirectorErrors.length > 0 && (
                <div className="bg-destructive/10 rounded-md p-4">
                    <h6 className="text-destructive mb-2 text-sm font-medium">Please address the following errors:</h6>
                    <ul className="text-destructive list-disc space-y-1 pl-5 text-sm">
                        {selectedDirectorErrors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    ) : null;

    return (
        <>
            <MasterDetailPanel
                title=""
                items={listItems}
                selectedId={selectedDirectorId}
                onSelect={(id) => setSelectedDirectorId(Number(id))}
                onAdd={handleAddDirector}
                onEdit={handleEditDirector}
                onDelete={handleDelete}
                emptyListIcon={UserRoundPlus}
                emptyListTitle="No presidents yet"
                addIcon={UserRoundPlus}
                addLabel="Add New President"
                detail={detail}
                emptyDetailTitle="No President Selected"
                emptyDetailDescription='Select a president on the left or click "Add New President" to start.'
            />
            {dialogOpen && (
                <DirectorsDialog director={selectedDirector} type={dialogAction} onClose={() => setDialogOpen(false)} onSave={handleSave} />
            )}
        </>
    );
}
