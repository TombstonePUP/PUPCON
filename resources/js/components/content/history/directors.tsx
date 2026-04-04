import { DirectorsDialog } from '@/components/dialogs/content/history/directors-dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CampusDirectors } from '@/types/content';
import { CircleAlert, EditIcon, ImageIcon, Plus, Trash2, X } from 'lucide-react';
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
    errors?: Record<string, string>; // new prop for errors
}

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

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

export function DirectorsSection({ ...props }: DirectorsProps) {
    const { directors, onUpdateDirectors, onDeleteDirector, errors } = props;
    const [directorsList, setDirectorsList] = useState<CampusDirectors[]>(directors);
    const [selectedDirectorId, setSelectedDirectorId] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<'add' | 'edit'>('add');

    const selectedDirector = directorsList.find((director: CampusDirectors) => director.director_id === selectedDirectorId);

    /* useEffect(() => {
        setDirectorsList(directors ?? []);
    }, [directors]); */

    const handleAddDirector = () => {
        setDialogAction('add');
        setDialogOpen(true);
        setSelectedDirectorId(null);
    };

    const handleEditDirector = (directorId: number) => {
        setDialogAction('edit');
        setDialogOpen(true);
        setSelectedDirectorId(directorId);
    };

    const handleSave = (director: DirectorsForm) => {
        setDirectorsList((prev) => {
            const current = prev ?? [];
            const existingIndex = current.findIndex((d) => d.director_id === director.director_id);
            let updatedList;
            let directorForLocalState: CampusDirectors; // Object for display (facilityList)

            // Local State Update
            directorForLocalState = {
                director_id: director.director_id,
                name: director.name,
                term_start_date: director.term_start_date,
                term_end_date: director.term_end_date,
                description: director.description,
                profile_image_path: director.previewUrl || '',
            };

            if (existingIndex !== -1) {
                updatedList = current.map((d) => (d.director_id === directorForLocalState.director_id ? directorForLocalState : d));
            } else {
                const newId = Math.max(0, ...current.map((d) => d.director_id || 0)) + 1;
                directorForLocalState.director_id = newId; // Assign new ID to the local object
                updatedList = [...current, directorForLocalState];
            }

            console.log(updatedList);
            onUpdateDirectors(directorForLocalState, director);
            return updatedList;
        });
    };

    const handleDelete = (id: number) => {
        setDirectorsList((prevTypes) => {
            const updatedList = prevTypes.filter((d) => d.director_id !== id);
            onDeleteDirector(id);
            if (selectedDirectorId === id) {
                setSelectedDirectorId(null);
            }
            return updatedList;
        });
    };

    const getSelectedDirectorIndex = () => {
        return directorsList?.findIndex((o) => o.director_id === selectedDirectorId);
    };

    const getSelectedDirectorErrors = () => {
        const index = getSelectedDirectorIndex();
        if (index === -1 || index === undefined) return [];

        // const safeErrors = errors ?? {}; // <-- ensure it's never undefined

        return Object.entries(errors)
            .filter(([key]) => key.startsWith(`directors.${index}.`))
            .map(([, msg]) => msg);
    };

    const selectedDirectorErrors = getSelectedDirectorErrors();

    return (
        <>
            <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                {/* Left Pane: President List */}
                <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-6">
                    <h4 className="mb-3 text-xs text-gray-500">Select a President</h4>
                    <div className="space-y-1">
                        {directorsList?.map((director, index) => (
                            <div
                                key={director.director_id}
                                onClick={() => {
                                    setSelectedDirectorId(director.director_id);
                                }}
                                className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-4 transition-colors ${director.director_id === selectedDirectorId ? 'bg-[#7f1414]/4' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="truncate text-sm">
                                    <span
                                        className={` ${director.director_id === selectedDirectorId ? 'font-normal text-red-900' : 'text-gray-700'}`}
                                    >
                                        {director.name}
                                    </span>
                                    {(errors[`directors.${index}.name`] ||
                                        errors[`directors.${index}.term_start_date`] ||
                                        errors[`directors.${index}.term_end_date`] ||
                                        errors[`directors.${index}.description`] ||
                                        errors[`directors.${index}.image`]) && (
                                            <CircleAlert className="inline-block h-4 w-4 text-red-600" />
                                    )}
                                </div>
                                <div
                                    className={`flex items-center space-x-0.5 transition-opacity ${director.director_id === selectedDirectorId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                        }`}
                                >
                                    <ActionButton
                                        onClick={(e) => {
                                            handleEditDirector(director.director_id);
                                        }}
                                        className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                    >
                                        <EditIcon className="h-4 w-4" />
                                    </ActionButton>
                                    <ActionButton
                                        onClick={(e) => {
                                            handleDelete(director.director_id);
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
                            onClick={handleAddDirector}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                        >
                            <Plus className="mr-2 h-4 w-4" /> <p className="truncate">Add New President</p>
                        </Button>
                    </div>
                </div>

                {/* Right Pane: President Details */}
                <div className="w-2/3 p-6">
                    {!selectedDirector ? (
                        <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                            <X className="mb-2 h-8 w-8" />
                            <p className="font-medium">No President Selected</p>
                            <p className="text-sm">Select a president on the left or click "Add New President" to start.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="overflow-hidden rounded-lg border border-gray-100">
                                <SharedPhotoPreview url={selectedDirector.profile_image_path} alt={selectedDirector.profile_image_name ?? ''} />
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold break-words text-gray-900">{selectedDirector.name}</h4>
                                <p className="text-sm font-medium text-red-700">
                                    {selectedDirector.term_start_date}-{selectedDirector.term_end_date}
                                </p>
                            </div>

                            <Separator className="bg-gray-200" />

                            <div>
                                <h5 className="mb-2 text-sm font-semibold text-foreground">Details</h5>
                                <p className="text-sm text-gray-700">{selectedDirector.description}</p>
                            </div>
                            {selectedDirectorErrors.length > 0 && (
                                <div className="rounded-md bg-red-50 p-4">
                                    <h6 className="mb-2 text-sm font-medium text-red-800">Please address the following errors:</h6>
                                    <ul className="list-disc space-y-1 pl-5 text-sm text-red-700">
                                        {selectedDirectorErrors.map((error, idx) => (
                                            <li key={idx}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {dialogOpen && (
                <DirectorsDialog director={selectedDirector ?? null} type={dialogAction} onClose={() => setDialogOpen(false)} onSave={handleSave} />
            )}
        </>
    );
}
