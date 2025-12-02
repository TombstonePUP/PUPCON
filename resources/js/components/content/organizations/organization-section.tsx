import { OrganizationDialog } from '@/components/dialogs/content/organization-dialog';
import { OrganizationTypeDialog } from '@/components/dialogs/content/organization-type-dialog';
import { Button } from '@/components/ui/button';
import { Organizations, OrganizationTypes } from '@/types/content';
import { EditIcon, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OrganizationsSectionProps {
    org_types: OrganizationTypes[];
    onUpdateOrgTypes: (org_type: OrganizationTypes[]) => void;
}

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

const OrganizationsSection = ({ ...props }: OrganizationsSectionProps) => {
    const { org_types, onUpdateOrgTypes } = props;
    const [orgTypes, setOrgTypes] = useState<OrganizationTypes[]>(org_types ?? []);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'org_type' | 'org'>('org_type');
    const [dialogAction, setDialogAction] = useState<'add' | 'edit'>('add');

    const [selectedOrgTypeId, setSelectedOrgTypeId] = useState<number | null>(null);
    const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
    const selectedOrgType = orgTypes.find((t) => t.type_id === selectedOrgTypeId) ?? null;
    const selectedOrg = selectedOrgType?.organizations?.find((o) => o.organization_id === selectedOrgId) ?? null;

    useEffect(() => {
        setOrgTypes(org_types ?? []);
    }, [org_types]);

    const handleAddOrgType = () => {
        setDialogType('org_type');
        setDialogAction('add');
        setDialogOpen(true);
        setSelectedOrgTypeId(null);
    };

    const handleEditOrgType = (type: OrganizationTypes) => {
        setDialogType('org_type');
        setDialogAction('edit');
        setDialogOpen(true);
        setSelectedOrgTypeId(type.type_id);
    };

    const handleSaveOrgType = (orgType: OrganizationTypes) => {
        setOrgTypes((prevTypes) => {
            let updatedTypes: OrganizationTypes[];
            if (dialogAction === 'edit' && selectedOrgTypeId !== null) {
                updatedTypes = prevTypes.map((type) => (type.type_id === selectedOrgTypeId ? { ...type, ...orgType } : type));
            } else {
                const newType: OrganizationTypes = {
                    type_id: orgType.type_id || Date.now(),
                    type_name: orgType.type_name,
                    organizations: [],
                };
                updatedTypes = [...prevTypes, newType];
                setSelectedOrgTypeId(newType.type_id);
            }
            onUpdateOrgTypes(updatedTypes);
            return updatedTypes;
        });
    };

    const handleDeleteOrgType = (id: number) => {
        setOrgTypes((prevTypes) => {
            const updatedTypes = prevTypes.filter((type) => type.type_id !== id);
            if (selectedOrgTypeId === id) {
                setSelectedOrgTypeId(null);
            }
            onUpdateOrgTypes(updatedTypes);
            return updatedTypes;
        });
    };

    const handleAddOrg = () => {
        setDialogType('org');
        setDialogAction('add');
        setDialogOpen(true);
        setSelectedOrgId(null);
    };

    const handleEditOrg = (org: Organizations) => {
        setDialogType('org');
        setDialogAction('edit');
        setDialogOpen(true);
        setSelectedOrgId(org.organization_id);
    };

    const handleSaveOrg = (org: Organizations) => {
        setOrgTypes((prev) => {
            const updated = prev.map((type) => {
                if (type.type_id !== selectedOrgTypeId) return type;
                let updatedOrgs: Organizations[];
                if (dialogAction === 'edit' && selectedOrg) {
                    updatedOrgs = type.organizations?.map((o) => (o.organization_id === selectedOrg.organization_id ? { ...o, ...org } : o));
                } else {
                    // Add new org
                    const newOrg: Organizations = {
                        organization_id: Date.now(),
                        type_id: type.type_id,
                        organization_name: org.organization_name!,
                        affiliation: org.affiliation || '',
                    };
                    updatedOrgs = [...(type.organizations ?? []), newOrg];
                }

                return { ...type, organizations: updatedOrgs };
            });

            onUpdateOrgTypes(updated);
            return updated;
        });
    };

    const handleDeleteOrg = (id: number) => {
        setOrgTypes((prevTypes) => {
            const updatedTypes = prevTypes.map((type) =>
                type.type_id === selectedOrgTypeId
                    ? {
                        ...type,
                        organizations: type.organizations?.filter((org) => org.organization_id !== id),
                    }
                    : type,
            );
            onUpdateOrgTypes(updatedTypes);
            return updatedTypes;
        });
    };

    return (
        <>
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Campus Organizations</h2>
                <p className="text-sm text-gray-600">Manage academic and non-academic organizations</p>
            </div>

            {/* --- Master Layout for Orgs --- */}
            <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                {/* Left Pane: Org Type List */}
                <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-6">
                    <h4 className="mb-3 text-xs text-gray-500">Select an Organization Type</h4>
                    <div className="space-y-1">
                        {orgTypes.map((type) => (
                            <div
                                key={type.type_id}
                                onClick={() => setSelectedOrgTypeId(type.type_id)}
                                className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-4 transition-colors ${type.type_id === selectedOrgTypeId ? 'bg-[#7f1414]/4' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <span
                                    className={`truncate text-sm ${type.type_id === selectedOrgTypeId ? 'font-normal text-red-900' : 'text-gray-700'}`}
                                >
                                    {type.type_name}
                                </span>
                                <div
                                    className={`flex items-center space-x-0.5 transition-opacity ${type.type_id === selectedOrgTypeId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                >
                                    <ActionButton
                                        onClick={() => {
                                            handleEditOrgType(type);
                                        }}
                                        className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                    >
                                        <EditIcon className="h-4 w-4" />
                                    </ActionButton>
                                    <ActionButton
                                        onClick={() => {
                                            handleDeleteOrgType(type.type_id);
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
                            onClick={handleAddOrgType}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                        >
                            <Plus className="mr-2 h-4 w-4" /> <p className='truncate'>Add New Type</p>
                        </Button>
                    </div>
                </div>

                {/* Right Pane: Organization List */}
                <div className="w-2/3 p-6">
                    {!selectedOrgType ? (
                        <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                            <X className="mb-2 h-8 w-8" />
                            <p className="font-medium">No Type Selected</p>
                            <p className="text-sm">Select a type on the left or add a new one.</p>
                        </div>
                    ) : (
                        <>
                            <h4 className="mb-6 truncate text-lg font-medium text-gray-900">{selectedOrgType.type_name}</h4>
                            <div className="max-h-[300px] space-y-3 overflow-y-auto pr-2">
                                {!selectedOrgType?.organizations?.length ? (
                                    <p className="text-sm text-gray-500 italic">No organizations added to this type yet.</p>
                                ) : (
                                    selectedOrgType?.organizations?.map((org) => (
                                        <div
                                            key={org.organization_id}
                                            className="group flex items-start justify-between rounded-md border border-gray-100 bg-white p-3 px-6 transition-all hover:border-red-200"
                                        >
                                            <div>
                                                <span className="block text-sm font-medium text-gray-900">{org.organization_name}</span>
                                                <span className="text-xs text-gray-500">{org.affiliation}</span>
                                            </div>
                                            <div className="flex flex-shrink-0 items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <ActionButton onClick={() => handleEditOrg(org)}>
                                                    <EditIcon className="h-4 w-4" />
                                                </ActionButton>
                                                <ActionButton onClick={() => handleDeleteOrg(org.organization_id)} className="hover:text-red-500">
                                                    <Trash2 className="h-4 w-4" />
                                                </ActionButton>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="mt-6">
                                <Button
                                    onClick={handleAddOrg}
                                    className="flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-8 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                >
                                    <Plus className="h-4 w-4" />
                                    New Organization
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {dialogOpen && dialogType === 'org_type' && (
                <OrganizationTypeDialog
                    type={dialogAction}
                    orgType={selectedOrgType}
                    onClose={() => setDialogOpen(false)}
                    onSave={handleSaveOrgType}
                />
            )}
            {dialogOpen && dialogType === 'org' && (
                <OrganizationDialog
                    type={dialogAction}
                    org={selectedOrg}
                    selectedOrgType={selectedOrgType!}
                    onClose={() => setDialogOpen(false)}
                    onSave={handleSaveOrg}
                />
            )}
        </>
    );
};

export default OrganizationsSection;
