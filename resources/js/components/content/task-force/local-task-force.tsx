import TaskForceAreaOfficialDialog from '@/components/dialogs/content/task-force-area-official-dialog';
import TaskForceOfficialDialog from '@/components/dialogs/content/task-force-official-dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LocalTaskForce } from '@/types/content';
import { CircleAlert, EditIcon, ImageIcon, Plus, Trash2, User, X } from 'lucide-react';
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
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
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
                className={`w-full ${heightClass} flex flex-col items-center justify-center rounded-md border border-gray-200 bg-gray-100 text-gray-500`}
            >
                <ImageIcon className="h-12 w-12 text-gray-400" />
                <span className="mt-2 text-sm">No Image</span>
            </div>
        );
    }
    return (
        <img
            src={url}
            alt={alt}
            className={`w-full ${heightClass} rounded-md border border-gray-200 bg-gray-100 object-cover`}
            onError={() => setHasError(true)}
        />
    );
};

export default function LocalTaskForceContentSection({ ...props }: LocalTaskForceContentSectionProps) {
    const { local_task_force, onUpdateTaskForceOfficial, onDeleteTaskForceOfficial, errors } = props;
    const [localTaskForceList, setLocalTaskForceList] = useState(
        local_task_force.map((ltf, index) => ({
            ...ltf,
            __index: index, // ← store original Laravel index
        })),
    );
    const [chairmenList, setChairmenList] = useState<LocalTaskForce[]>([]);
    const [officialsList, setOfficialsList] = useState<LocalTaskForce[]>([]);
    const [selectedItem, setSelectedItem] = useState<{ type: 'chairman' | 'official'; id: number | null }>({ type: 'chairman', id: null });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'chairman' | 'official'>('chairman');
    const [dialogAction, setDialogAction] = useState<'add' | 'edit'>('add');

    const selectedChairman = selectedItem.type === 'chairman' ? chairmenList.find((ltf) => ltf.local_task_force_id === selectedItem.id) : null;
    const selectedOfficial = selectedItem.type === 'official' ? officialsList.find((ltf) => ltf.local_task_force_id === selectedItem.id) : null;
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
            let officialForLocalState: LocalTaskForce; // Object for display (facilityList)

            // Local State Update
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
                officialForLocalState.local_task_force_id = newId; // Assign new ID to the local object
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
            .map(([_, msg]) => msg);
    };

    const selectedErrors = getSelectedTaskForceErrors();

    return (
        <>
            <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                {/* Left Pane: Area List */}
                <div className="flex w-1/2 flex-col justify-between border-r border-gray-200 bg-gray-50/50 p-6">
                    {/* Top part: List */}
                    <div className="max-h-[400px] overflow-y-auto pr-2">
                        <h4 className="mb-3 text-xs text-gray-500">Head Officials</h4>
                        <div className="mb-4 space-y-1">
                            {officialsList.map((official) => (
                                <div
                                    key={official.local_task_force_id}
                                    onClick={() => setSelectedItem({ type: 'official', id: official.local_task_force_id })}
                                    className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-3 transition-colors ${selectedItem.type === 'official' && selectedItem.id === official.local_task_force_id
                                        ? 'bg-[#7f1414]/4'
                                        : 'bg-white hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 truncate text-sm">
                                        <User className="h-4 w-4 flex-shrink-0 text-gray-500" />
                                        <span
                                            className={` ${selectedItem.type === 'official' && selectedItem.id === official.local_task_force_id ? 'font-normal text-red-900' : 'text-gray-700'}`}
                                        >
                                            {official.first_name} {official.last_name}
                                        </span>
                                        {(errors[`chairmen.${official.__index}.first_name`] || errors[`chairmen.${official.__index}.last_name`]) && (
                                            <CircleAlert className="inline-block h-4 w-4 text-red-600" />
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-0.5">
                                        <ActionButton
                                            onClick={(e) => {
                                                handleEditOfficial(official.local_task_force_id);
                                            }}
                                            className="cursor-pointer rounded-md text-gray-400 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <EditIcon className="h-4 w-4" />
                                        </ActionButton>
                                        <ActionButton
                                            onClick={(e) => {
                                                handleDeleteOfficial(official.local_task_force_id);
                                            }}
                                            className="cursor-pointer rounded-md text-gray-400 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </ActionButton>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Separator />

                        <h4 className="my-3 text-xs text-gray-500">Task Force Areas</h4>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                            {chairmenList.map((chairman) => (
                                <div
                                    key={chairman.local_task_force_id}
                                    onClick={() => setSelectedItem({ type: 'chairman', id: chairman.local_task_force_id })}
                                    className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-3 transition-colors ${selectedItem.type === 'chairman' && selectedItem.id === chairman.local_task_force_id
                                        ? 'bg-[#7f1414]/4'
                                        : 'bg-white hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="truncate text-sm">
                                        <span
                                            className={` ${selectedItem.type === 'chairman' && selectedItem.id === chairman.local_task_force_id ? 'font-normal text-red-900' : 'text-gray-700'}`}
                                        >
                                            {chairman.area_name}
                                        </span>
                                        {(errors[`chairmen.${chairman.__index}.first_name`] ||
                                            errors[`chairmen.${chairman.__index}.last_name`] ||
                                            errors[`chairmen.${chairman.__index}.area_name`]) && (
                                                <CircleAlert className="inline-block h-4 w-4 text-red-600" />
                                            )}
                                    </div>
                                    <div
                                        className={`flex items-center space-x-0.5 transition-opacity ${selectedItem.type === 'chairman' && selectedItem.id === chairman.local_task_force_id
                                            ? 'opacity-100'
                                            : 'opacity-0 group-hover:opacity-100'
                                            }`}
                                    >
                                        <ActionButton
                                            onClick={(e) => {
                                                handleEditChairman(chairman.local_task_force_id);
                                            }}
                                            className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                        >
                                            <EditIcon className="h-4 w-4" />
                                        </ActionButton>
                                        <ActionButton
                                            onClick={(e) => {
                                                handleDeleteChairman(chairman.local_task_force_id);
                                            }}
                                            className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </ActionButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom part: Add Buttons */}
                    <div className="mt-4 flex flex-col gap-3 space-y-2 border-t border-gray-200 pt-4">
                        <Button
                            onClick={handleAddOfficial}
                            variant="outline"
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Head Official
                        </Button>
                        <Button
                            onClick={handleAddChairman}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add New Area
                        </Button>
                    </div>
                </div>

                {/* Right Pane: Area Details */}
                <div className="max-h-[500px] w-1/2 overflow-y-auto p-6">
                    {!selectedChairman && !selectedOfficial && (
                        <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                            <X className="mb-2 h-8 w-8" />
                            <p className="font-medium">No Item Selected</p>
                            <p className="text-sm">Select an item on the left to see details.</p>
                        </div>
                    )}

                    {/* --- Official Details --- */}
                    {selectedOfficial && (
                        <div className="space-y-6">
                            <div className="overflow-hidden rounded-lg border border-gray-100">
                                <OfficialPhoto
                                    url={selectedOfficial.profile_image_path}
                                    alt={selectedOfficial.profile_image_name}
                                    heightClass="h-72"
                                />
                            </div>
                            <div className="rounded-md border p-8">
                                <h4 className="text-lg font-medium break-words text-gray-900">
                                    {selectedOfficial.first_name} {selectedOfficial.last_name}
                                </h4>
                                <p className="text-xs font-normal text-gray-400">{selectedOfficial.official_position}</p>
                            </div>
                            {selectedOfficial && selectedErrors.length > 0 && (
                                <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-4">
                                    <h4 className="mb-2 text-sm font-semibold text-red-600">Errors in this Official</h4>
                                    <ul className="list-disc space-y-1 pl-5 text-sm text-red-600">
                                        {selectedErrors.map((msg, i) => (
                                            <li key={i}>{msg}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- Area Details --- */}
                    {selectedChairman && (
                        <div className="space-y-6">
                            <div>
                                <h5 className="mb-2 text-sm font-semibold text-gray-700">Chairman</h5>
                                <div className="mt-2 flex items-center gap-6">
                                    <img
                                        src={selectedChairman.profile_image_path || 'https://placehold.co/100x100/eeeeee/7f1414?text=No+Photo'}
                                        alt={selectedChairman.profile_image_name}
                                        className="h-16 w-16 flex-shrink-0 rounded-sm border border-gray-200 bg-gray-100 object-cover text-gray-300"
                                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100/eeeeee/7f1414?text=No+Photo')}
                                    />
                                    <div>
                                        <h4 className="text-lg font-medium break-words text-gray-900">
                                            {selectedChairman.first_name} {selectedChairman.last_name}
                                        </h4>
                                        <p className="text-xs font-normal text-gray-700">{selectedChairman.area_name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* --- Co-Chairmen List --- */}
                            {coChairmenList?.length > 0 && (
                                <div>
                                    <h5 className="mb-2 text-sm font-semibold text-gray-700">Co-chairman</h5>
                                    <div className="mt-2 space-y-3">
                                        {coChairmenList?.map((coChair) => (
                                            <div key={coChair.member_id} className="flex items-center gap-4">
                                                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-sm border border-gray-200 bg-gray-100">
                                                    <User className="h-8 w-8 text-gray-400" />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-medium break-words text-gray-900">{coChair.full_name}</h4>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Separator className="bg-gray-200" />

                            <div>
                                <h5 className="mb-2 text-sm font-semibold text-gray-700">Members</h5>
                                {membersList?.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">No members added to this area.</p>
                                ) : (
                                    <ul className="list-inside list-disc space-y-1">
                                        {membersList?.map((member) => (
                                            <li key={member.member_id} className="text-sm text-gray-700">
                                                {member.full_name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {selectedChairman && selectedErrors.length > 0 && (
                                <div className="mt-4 rounded-md border border-red-300 bg-red-50 p-4">
                                    <h4 className="mb-2 text-sm font-semibold text-red-600">Errors in this Chairman</h4>
                                    <ul className="list-disc space-y-1 pl-5 text-sm text-red-600">
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
