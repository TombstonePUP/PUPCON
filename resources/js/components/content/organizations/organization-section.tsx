import { OrganizationDialog } from '@/components/dialogs/content/organization-dialog';
import { OrganizationTypeDialog } from '@/components/dialogs/content/organization-type-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Organizations, OrganizationTypes } from '@/types/content';
import { CircleAlert, EditIcon, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OrganizationsSectionProps {
  org_types: OrganizationTypes[];
  onUpdateOrgTypes: (org_type: OrganizationTypes[]) => void;
  errors?: Record<string, string>;
}

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
  <button className={`p-1 text-muted-foreground transition-colors hover:text-foreground ${className}`} type="button" {...props}>
    {children}
  </button>
);

const OrganizationsSection = ({ ...props }: OrganizationsSectionProps) => {
  const { org_types, onUpdateOrgTypes, errors } = props;
  const [orgTypes, setOrgTypes] = useState<OrganizationTypes[]>(org_types ?? []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'org_type' | 'org'>('org_type');
  const [dialogAction, setDialogAction] = useState<'add' | 'edit'>('add');
  const [selectedOrgTypeId, setSelectedOrgTypeId] = useState<number | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const selectedOrgType = orgTypes.find((t) => t.type_id === selectedOrgTypeId) ?? null;
  const selectedOrg = selectedOrgType?.organizations?.find((o) => o.organization_id === selectedOrgId) ?? null;

  useEffect(() => { setOrgTypes(org_types ?? []); }, [org_types]);

  const handleAddOrgType = () => { setDialogType('org_type'); setDialogAction('add'); setDialogOpen(true); setSelectedOrgTypeId(null); };
  const handleEditOrgType = (type: OrganizationTypes) => { setDialogType('org_type'); setDialogAction('edit'); setDialogOpen(true); setSelectedOrgTypeId(type.type_id); };

  const handleSaveOrgType = (orgType: OrganizationTypes) => {
    setOrgTypes((prevTypes) => {
      let updatedTypes: OrganizationTypes[];
      if (dialogAction === 'edit' && selectedOrgTypeId !== null) {
        updatedTypes = prevTypes.map((type) => (type.type_id === selectedOrgTypeId ? { ...type, ...orgType } : type));
      } else {
        const newType: OrganizationTypes = { type_id: orgType.type_id || Date.now(), type_name: orgType.type_name, organizations: [] };
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
      if (selectedOrgTypeId === id) setSelectedOrgTypeId(null);
      onUpdateOrgTypes(updatedTypes);
      return updatedTypes;
    });
  };

  const handleAddOrg = () => { setDialogType('org'); setDialogAction('add'); setDialogOpen(true); setSelectedOrgId(null); };
  const handleEditOrg = (org: Organizations) => { setDialogType('org'); setDialogAction('edit'); setDialogOpen(true); setSelectedOrgId(org.organization_id); };

  const handleSaveOrg = (org: Organizations) => {
    setOrgTypes((prev) => {
      const updated = prev.map((type) => {
        if (type.type_id !== selectedOrgTypeId) return type;
        let updatedOrgs: Organizations[];
        if (dialogAction === 'edit' && selectedOrg) {
          updatedOrgs = type.organizations?.map((o) => (o.organization_id === selectedOrg.organization_id ? { ...o, ...org } : o));
        } else {
          const newOrg: Organizations = { organization_id: Date.now(), type_id: type.type_id, organization_name: org.organization_name!, affiliation: org.affiliation || '' };
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
        type.type_id === selectedOrgTypeId ? { ...type, organizations: type.organizations?.filter((org) => org.organization_id !== id) } : type,
      );
      onUpdateOrgTypes(updatedTypes);
      return updatedTypes;
    });
  };

  const orgErrorCount = Object.keys(errors).filter((key) => key.startsWith('org_types.')).length;

  const getOrgErrors = (typeIndex: number, orgIndex: number) => {
    if (!errors) return [];
    return Object.keys(errors).filter((key) => key.startsWith(`org_types.${typeIndex}.organizations.${orgIndex}.`));
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="flex items-center gap-3 text-lg font-semibold text-foreground">
          Campus Organizations
          {orgErrorCount > 0 && (
            <Badge variant="destructive" className="rounded-full border-none px-1.75 py-0.5 text-sm font-medium">
              {orgErrorCount}
            </Badge>
          )}
        </h2>
        <p className="text-sm text-muted-foreground">Manage academic and non-academic organizations</p>
      </div>

      <div className="flex min-h-[400px] rounded-lg border border-border">
        {/* Left Pane */}
        <div className="w-1/3 border-r border-border bg-muted/30 p-4 flex flex-col">
          <h4 className="mb-3 text-xs text-muted-foreground">Select an Organization Type</h4>
          <div className="space-y-1 overflow-y-auto flex-1">
            {orgTypes.map((type, index) => (
              <div
                key={type.type_id}
                onClick={() => setSelectedOrgTypeId(type.type_id)}
                className={`group flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 transition-colors ${type.type_id === selectedOrgTypeId
                    ? 'border-primary/30 bg-primary/10 text-primary/95'
                    : 'border-border bg-background text-foreground hover:border-primary/20 hover:bg-primary/5'
                  }`}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-sm">{type.type_name}</span>
                  {Object.keys(errors).some((key) => key.startsWith(`org_types.${index}.`)) && (
                    <CircleAlert className="inline-block h-4 w-4 shrink-0 text-destructive" />
                  )}
                </div>
                <div className={`flex shrink-0 items-center space-x-0.5 transition-opacity ${type.type_id === selectedOrgTypeId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <ActionButton onClick={() => handleEditOrgType(type)} className="cursor-pointer rounded-md hover:bg-muted hover:text-foreground">
                    <EditIcon className="h-4 w-4" />
                  </ActionButton>
                  <ActionButton onClick={() => handleDeleteOrgType(type.type_id)} className="cursor-pointer rounded-md hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </ActionButton>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <Button onClick={handleAddOrgType} variant="default" className="w-full text-xs">
              <Plus className="h-4 w-4" />
              <span className="hidden xl:inline">Add New Type</span>
            </Button>
          </div>
        </div>

        {/* Right Pane */}
        <div className="w-2/3 p-6">
          {!selectedOrgType ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="rounded-full bg-muted p-4">
                <X className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-2 text-sm font-medium text-foreground/80">No Type Selected</p>
              <p className="text-xs text-muted-foreground">Select a type on the left or add a new one.</p>
            </div>
          ) : (
            <>
              <h4 className="mb-6 truncate text-lg font-medium text-foreground">{selectedOrgType.type_name}</h4>
              <div className="max-h-[300px] space-y-2 overflow-y-auto pr-2">
                {!selectedOrgType?.organizations?.length ? (
                  <p className="text-sm italic text-muted-foreground">No organizations added to this type yet.</p>
                ) : (
                  selectedOrgType?.organizations?.map((org, orgIndex) => {
                    const hasErrors = getOrgErrors(orgTypes.findIndex((t) => t.type_id === selectedOrgTypeId), orgIndex).length > 0;
                    return (
                      <div key={org.organization_id}>
                        <div className="group flex items-start justify-between rounded-md border border-border bg-background p-3 px-6 transition-all hover:border-destructive/20">
                          <div className="flex items-center gap-2">
                            <div>
                              <span className="block text-sm font-medium text-foreground">{org.organization_name}</span>
                              <span className="text-xs text-muted-foreground">{org.affiliation}</span>
                            </div>
                            {hasErrors && <CircleAlert className="h-4 w-4 text-destructive" />}
                          </div>
                          <div className="flex shrink-0 items-center space-x-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                            <ActionButton onClick={() => handleEditOrg(org)} className="cursor-pointer rounded-md hover:bg-muted hover:text-foreground">
                              <EditIcon className="h-4 w-4" />
                            </ActionButton>
                            <ActionButton onClick={() => handleDeleteOrg(org.organization_id)} className="cursor-pointer rounded-md hover:bg-destructive/10 hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </ActionButton>
                          </div>
                        </div>
                        {getOrgErrors(orgTypes.findIndex((t) => t.type_id === selectedOrgTypeId), orgIndex).map((errorKey) => (
                          <p key={errorKey} className="mt-1 text-xs text-destructive">{errors[errorKey]}</p>
                        ))}
                      </div>
                    );
                  })
                )}
              </div>
              <div className="mt-6">
                <Button onClick={handleAddOrg} variant="outline" className="text-xs">
                  <Plus className="h-4 w-4" />
                  New Organization
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {dialogOpen && dialogType === 'org_type' && (
        <OrganizationTypeDialog type={dialogAction} orgType={selectedOrgType} onClose={() => setDialogOpen(false)} onSave={handleSaveOrgType} />
      )}
      {dialogOpen && dialogType === 'org' && (
        <OrganizationDialog type={dialogAction} org={selectedOrg} selectedOrgType={selectedOrgType!} onClose={() => setDialogOpen(false)} onSave={handleSaveOrg} />
      )}
    </>
  );
};

export default OrganizationsSection;