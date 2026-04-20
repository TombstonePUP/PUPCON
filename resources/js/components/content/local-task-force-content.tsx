import TaskForceAreaOfficialDialog from '@/components/dialogs/content/task-force-area-official-dialog';
import TaskForceOfficialDialog from '@/components/dialogs/content/task-force-official-dialog';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LocalTaskForce } from '@/types/content';
import { CircleAlert, EditIcon, ImageIcon, MousePointerClick, Plus, Trash2, User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MemberForm {
    member_id?: number;
    local_task_force_id: number;
    full_name: string;
    role?: string | null;
    local_task_force?: LtfChairmanForm;
}

interface LtfChairmanForm {
    local_task_force_id?: number;
    area_name?: string;
    first_name: string;
    last_name: string;
    official: boolean;
    official_position?: string | null;
    profile_image: File | null;
    previewUrl?: string | null;
    members: MemberForm[];
}

interface LocalTaskForceContentSectionProps {
    local_task_force: LocalTaskForce[];
    onUpdateTaskForceOfficial: (chairmanLocal: LocalTaskForce, chairman: LtfChairmanForm) => void;
    onDeleteTaskForceOfficial: (id: number) => void;
    errors?: Record<string, string>;
}

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`text-muted-foreground hover:text-foreground rounded-md p-1 transition-colors ${className}`} type="button" {...props}>
        {children}
    </button>
);

const OfficialPhoto: React.FC<{ url: string | null; alt: string; heightClass?: string }> = ({ url, alt, heightClass = 'h-64' }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [url]);

    if (!url || hasError) {
        return (
            <div
                className={`flex w-full ${heightClass} border-border bg-muted text-muted-foreground flex-col items-center justify-center rounded-md border`}
            >
                <ImageIcon className="h-12 w-12" />
                <span className="mt-2 text-sm">No Image</span>
            </div>
        );
    }

    return (
        <img
            src={url}
            alt={alt}
            className={`w-full ${heightClass} border-border bg-muted rounded-md border object-cover`}
            onError={() => setHasError(true)}
        />
    );
};

export default function LocalTaskForceContentSection({ ...props }: LocalTaskForceContentSectionProps) {
    const { local_task_force, onUpdateTaskForceOfficial, onDeleteTaskForceOfficial, errors } = props;

    const [localTaskForceList, setLocalTaskForceList] = useState(
        local_task_force.map((ltf, index) => ({
            ...ltf,
            __index: index,
        })),
    );
    const [chairmenList, setChairmenList] = useState<LocalTaskForce[]>([]);
    const [officialsList, setOfficialsList] = useState<LocalTaskForce[]>([]);
    const [selectedItem, setSelectedItem] = useState<{
        type: 'chairman' | 'official';
        id: number | null;
    }>({ type: 'chairman', id: null });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'chairman' | 'official'>('chairman');
    const [dialogAction, setDialogAction] = useState<'add' | 'edit'>('add');

    const selectedChairman =
        selectedItem.type === 'chairman' ? (chairmenList.find((ltf) => ltf.local_task_force_id === selectedItem.id) ?? null) : null;

    const selectedOfficial =
        selectedItem.type === 'official' ? (officialsList.find((ltf) => ltf.local_task_force_id === selectedItem.id) ?? null) : null;

    const coChairmenList = selectedChairman ? selectedChairman.members?.filter((member) => member.role === 'Co-Chairman') : [];

    const membersList = selectedChairman ? selectedChairman.members?.filter((member) => member.role === 'Member') : [];

    useEffect(() => {
        setChairmenList(localTaskForceList.filter((ltf) => !ltf.official) ?? []);
        setOfficialsList(localTaskForceList.filter((ltf) => ltf.official) ?? []);
    }, [localTaskForceList]);

    const handleAddOfficial = () => {
        setDialogType('official');
        setDialogAction('add');
        setDialogOpen(true);
        setSelectedItem({ type: 'official', id: null });
    };

    const handleEditOfficial = (id: number) => {
        setDialogType('official');
        setDialogAction('edit');
        setDialogOpen(true);
        setSelectedItem({ type: 'official', id });
    };

    const handleDeleteOfficial = (id: number) => {
        setLocalTaskForceList((prevTypes) => {
            const updatedList = prevTypes.filter((o) => o.local_task_force_id !== id);
            onDeleteTaskForceOfficial(id);
            if (selectedItem.id === id) {
                setSelectedItem({ type: 'official', id: null });
            }
            return updatedList;
        });
    };

    const handleAddChairman = () => {
        setDialogType('chairman');
        setDialogAction('add');
        setDialogOpen(true);
        setSelectedItem({ type: 'chairman', id: null });
    };

    const handleEditChairman = (id: number) => {
        setDialogType('chairman');
        setDialogAction('edit');
        setDialogOpen(true);
        setSelectedItem({ type: 'chairman', id });
    };

    const handleDeleteChairman = (id: number) => {
        setLocalTaskForceList((prevTypes) => {
            const updatedList = prevTypes.filter((l) => l.local_task_force_id !== id);
            onDeleteTaskForceOfficial(id);
            if (selectedItem.id === id) {
                setSelectedItem({ type: 'chairman', id: null });
            }
            return updatedList;
        });
    };

    const handleSaveLocalTaskForce = (official: LtfChairmanForm) => {
        setLocalTaskForceList((prev) => {
            const current = prev ?? [];
            const existingIndex = current.findIndex((o) => o.local_task_force_id === official.local_task_force_id);
            let updatedList;
            let officialForLocalState: LocalTaskForce;

            officialForLocalState = {
                local_task_force_id: official.local_task_force_id!,
                area_name: official.area_name,
                first_name: official.first_name,
                last_name: official.last_name,
                official: official.official,
                official_position: official.official_position || null,
                profile_image_path: official.previewUrl || '',
                members:
                    official.members?.map((member) => ({
                        member_id: member.member_id || 0,
                        local_task_force_id: member.local_task_force_id,
                        full_name: member.full_name,
                        role: member.role || null,
                    })) || [],
            };

            if (existingIndex !== -1) {
                updatedList = current.map((o) =>
                    o.local_task_force_id === officialForLocalState.local_task_force_id ? { ...officialForLocalState, __index: o.__index } : o,
                );
            } else {
                const newId = Math.max(0, ...current.map((o) => o.local_task_force_id || 0)) + 1;
                officialForLocalState.local_task_force_id = newId;
                updatedList = [...current, { ...officialForLocalState, __index: current.length }];
            }

            onUpdateTaskForceOfficial(officialForLocalState, official);
            return updatedList;
        });
    };

    const getSelectedTaskForceIndex = () => {
        const current = localTaskForceList.find((ltf) => ltf.local_task_force_id === selectedItem.id);
        return current?.__index ?? -1;
    };

    const getSelectedTaskForceErrors = () => {
        const current = getSelectedTaskForceIndex() !== -1 ? localTaskForceList.find((ltf) => ltf.local_task_force_id === selectedItem.id) : null;

        if (!current) return [];

        const index = current.__index;

        return Object.entries(errors ?? {})
            .filter(([key]) => key.startsWith(`chairmen.${index}.`))
            .map(([, msg]) => msg);
    };

    const selectedErrors = getSelectedTaskForceErrors();

    return (
        <>
            <div className="border-border flex min-h-[400px] rounded-lg border">
                {/* Left pane: two lists + two add buttons */}
                <div className="border-border bg-muted/30 flex w-1/2 flex-col justify-between border-r p-6">
                    <div className="max-h-[400px] overflow-y-auto pr-2">
                        {/* Head Officials list */}
                        <h4 className="text-muted-foreground mb-3 text-xs">Head Officials</h4>
                        <div className="mb-4 space-y-1">
                            {officialsList.length === 0 ? (
                                <p className="text-muted-foreground py-2 text-center text-xs italic">No head officials added.</p>
                            ) : (
                                officialsList.map((official) => {
                                    const isSelected = selectedItem.type === 'official' && selectedItem.id === official.local_task_force_id;
                                    return (
                                        <div
                                            key={official.local_task_force_id}
                                            onClick={() =>
                                                setSelectedItem({
                                                    type: 'official',
                                                    id: official.local_task_force_id,
                                                })
                                            }
                                            className={`group flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 transition-colors ${
                                                isSelected
                                                    ? 'border-primary/30 bg-primary/10 text-primary/95'
                                                    : 'border-border bg-background text-foreground hover:border-primary/20 hover:bg-primary/5'
                                            }`}
                                        >
                                            <div className="flex min-w-0 items-center gap-2 truncate text-sm">
                                                <User className="text-muted-foreground h-4 w-4 shrink-0" />
                                                <span className="truncate">
                                                    {official.first_name} {official.last_name}
                                                </span>
                                                {(errors?.[`chairmen.${official.__index}.first_name`] ||
                                                    errors?.[`chairmen.${official.__index}.last_name`]) && (
                                                    <CircleAlert className="text-destructive inline-block h-4 w-4 shrink-0" />
                                                )}
                                            </div>
                                            <div className="flex shrink-0 items-center space-x-0.5 opacity-0 group-hover:opacity-100">
                                                <ActionButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditOfficial(official.local_task_force_id);
                                                    }}
                                                    className="hover:bg-muted"
                                                >
                                                    <EditIcon className="h-4 w-4" />
                                                </ActionButton>
                                                <ActionButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteOfficial(official.local_task_force_id);
                                                    }}
                                                    className="hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </ActionButton>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <Separator />

                        {/* Task Force Areas list */}
                        <h4 className="text-muted-foreground my-3 text-xs">Task Force Areas</h4>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {chairmenList.length === 0 ? (
                                <p className="text-muted-foreground col-span-2 py-2 text-center text-xs italic">No areas added.</p>
                            ) : (
                                chairmenList.map((chairman) => {
                                    const isSelected = selectedItem.type === 'chairman' && selectedItem.id === chairman.local_task_force_id;
                                    return (
                                        <div
                                            key={chairman.local_task_force_id}
                                            onClick={() =>
                                                setSelectedItem({
                                                    type: 'chairman',
                                                    id: chairman.local_task_force_id,
                                                })
                                            }
                                            className={`group flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 transition-colors ${
                                                isSelected
                                                    ? 'border-primary/30 bg-primary/10 text-primary/95'
                                                    : 'border-border bg-background text-foreground hover:border-primary/20 hover:bg-primary/5'
                                            }`}
                                        >
                                            <div className="min-w-0 truncate text-sm">
                                                <span className="truncate">{chairman.area_name}</span>
                                                {(errors?.[`chairmen.${chairman.__index}.first_name`] ||
                                                    errors?.[`chairmen.${chairman.__index}.last_name`] ||
                                                    errors?.[`chairmen.${chairman.__index}.area_name`]) && (
                                                    <CircleAlert className="text-destructive inline-block h-4 w-4 shrink-0" />
                                                )}
                                            </div>
                                            <div className="flex shrink-0 items-center space-x-0.5 opacity-0 group-hover:opacity-100">
                                                <ActionButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditChairman(chairman.local_task_force_id);
                                                    }}
                                                    className="hover:bg-muted"
                                                >
                                                    <EditIcon className="h-4 w-4" />
                                                </ActionButton>
                                                <ActionButton
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteChairman(chairman.local_task_force_id);
                                                    }}
                                                    className="hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </ActionButton>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Add buttons */}
                    <div className="border-border mt-4 flex flex-col gap-2 border-t pt-4">
                        <Button onClick={handleAddOfficial} variant="outline" className="w-full">
                            <Plus className="h-4 w-4" />
                            Add Head Official
                        </Button>
                        <Button onClick={handleAddChairman} variant="default" className="w-full">
                            <Plus className="h-4 w-4" />
                            Add New Area
                        </Button>
                    </div>
                </div>

                {/* Right pane: detail view */}
                <div className="max-h-[500px] w-1/2 overflow-y-auto p-6">
                    {!selectedChairman && !selectedOfficial && (
                        <EmptyState icon={MousePointerClick} title="No item selected" description="Select an item on the left to see details." />
                    )}

                    {/* Official details */}
                    {selectedOfficial && (
                        <div className="space-y-6">
                            <div className="border-border overflow-hidden rounded-lg border">
                                <OfficialPhoto
                                    url={selectedOfficial.profile_image_path}
                                    alt={selectedOfficial.profile_image_name}
                                    heightClass="h-72"
                                />
                            </div>

                            <div className="border-border rounded-md border p-8">
                                <h4 className="text-foreground text-lg font-medium break-words">
                                    {selectedOfficial.first_name} {selectedOfficial.last_name}
                                </h4>
                                <p className="text-muted-foreground text-xs font-normal">{selectedOfficial.official_position}</p>
                            </div>

                            {selectedErrors.length > 0 && (
                                <div className="border-destructive/40 bg-destructive/10 rounded-md border p-4">
                                    <h4 className="text-destructive mb-2 text-sm font-semibold">Errors in this official</h4>
                                    <ul className="text-destructive list-disc space-y-1 pl-5 text-sm">
                                        {selectedErrors.map((msg, i) => (
                                            <li key={i}>{msg}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Area / Chairman details */}
                    {selectedChairman && (
                        <div className="space-y-6">
                            <div>
                                <h5 className="text-foreground mb-2 text-sm font-semibold">Chairman</h5>
                                <div className="mt-2 flex items-center gap-6">
                                    <img
                                        src={selectedChairman.profile_image_path || 'https://placehold.co/100x100/eeeeee/888888?text=No+Photo'}
                                        alt={selectedChairman.profile_image_name}
                                        className="border-border bg-muted h-16 w-16 shrink-0 rounded-sm border object-cover"
                                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100/eeeeee/888888?text=No+Photo')}
                                    />
                                    <div>
                                        <h4 className="text-foreground text-lg font-medium break-words">
                                            {selectedChairman.first_name} {selectedChairman.last_name}
                                        </h4>
                                        <p className="text-muted-foreground text-xs font-normal">{selectedChairman.area_name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Co-chairmen */}
                            {coChairmenList?.length > 0 && (
                                <div>
                                    <h5 className="text-foreground mb-2 text-sm font-semibold">Co-chairman</h5>
                                    <div className="mt-2 space-y-3">
                                        {coChairmenList.map((coChair) => (
                                            <div key={coChair.member_id} className="flex items-center gap-4">
                                                <div className="border-border bg-muted flex h-16 w-16 shrink-0 items-center justify-center rounded-sm border">
                                                    <User className="text-muted-foreground h-8 w-8" />
                                                </div>
                                                <h4 className="text-foreground text-lg font-medium break-words">{coChair.full_name}</h4>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Separator />

                            {/* Members */}
                            <div>
                                <h5 className="text-foreground mb-2 text-sm font-semibold">Members</h5>
                                {membersList?.length === 0 ? (
                                    <p className="text-muted-foreground text-sm italic">No members added to this area.</p>
                                ) : (
                                    <ul className="list-inside list-disc space-y-1">
                                        {membersList?.map((member) => (
                                            <li key={member.member_id} className="text-foreground text-sm">
                                                {member.full_name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {selectedErrors.length > 0 && (
                                <div className="border-destructive/40 bg-destructive/10 rounded-md border p-4">
                                    <h4 className="text-destructive mb-2 text-sm font-semibold">Errors in this chairman</h4>
                                    <ul className="text-destructive list-disc space-y-1 pl-5 text-sm">
                                        {selectedErrors.map((msg, i) => (
                                            <li key={i}>{msg}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {dialogOpen && dialogType === 'chairman' && (
                <TaskForceAreaOfficialDialog
                    action={dialogAction}
                    chairman={selectedChairman ?? null}
                    onClose={() => setDialogOpen(false)}
                    onSave={handleSaveLocalTaskForce}
                />
            )}
            {dialogOpen && dialogType === 'official' && (
                <TaskForceOfficialDialog
                    action={dialogAction}
                    official={selectedOfficial ?? null}
                    onClose={() => setDialogOpen(false)}
                    onSave={handleSaveLocalTaskForce}
                />
            )}
        </>
    );
}
