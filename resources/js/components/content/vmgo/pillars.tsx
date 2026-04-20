import PillarDialog from '@/components/dialogs/content/pillar-dialog';
import { MasterDetailPanel } from '@/components/master-detail-panel';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/text-area';
import { PillarItems, Pillars } from '@/types/content';
import { CircleAlert, EditIcon, FolderPlus, ListPlus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PillarSectionProps {
    pillars?: Pillars[];
    updatePillars: (updatedPillars: Pillars[]) => void;
    errors?: Record<string, string>;
}

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`text-muted-foreground hover:text-foreground p-1 transition-colors ${className}`} type="button" {...props}>
        {children}
    </button>
);

export default function PillarsSection({ pillars, updatePillars, errors = {} }: PillarSectionProps) {
    const [pillarList, setPillarList] = useState<Pillars[]>(pillars ?? []);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [action, setAction] = useState<'add' | 'edit'>('add');
    const [selectedPillarId, setSelectedPillarId] = useState<number | null>(null);
    const [selectedPillarItemId, setSelectedPillarItemId] = useState<number | null>(null);

    const selectedPillar = pillarList?.find((p) => p.pillar_id === selectedPillarId) ?? null;
    const selectedPillarItem = selectedPillar?.pillar_items?.find((i) => i.item_id === selectedPillarItemId) ?? null;

    const [addingNewItem, setAddingNewItem] = useState(false);
    const [editingItem, setEditingItem] = useState(false);
    const [data, setData] = useState<PillarItems>({
        item_id: selectedPillarItem?.item_id ?? 0,
        pillar_id: selectedPillar?.pillar_id ?? 0,
        item_description: selectedPillarItem?.item_description ?? '',
    });

    const handleAddPillar = () => {
        setAction('add');
        setDialogOpen(true);
        setSelectedPillarId(null);
    };

    const handleEditPillar = (id: number | string) => {
        setAction('edit');
        setDialogOpen(true);
        setSelectedPillarId(Number(id));
    };

    const handleDeletePillar = (id: number | string) => {
        setPillarList((prev) => {
            const updated = prev.filter((p) => p.pillar_id !== Number(id));
            updatePillars(updated);
            if (selectedPillarId === Number(id)) setSelectedPillarId(null);
            return updated;
        });
    };

    const handleSavePillar = (pillarData: Pillars) => {
        setPillarList((prev) => {
            let updated: Pillars[];
            if (action === 'edit' && selectedPillarId !== null) {
                updated = prev.map((p) => (p.pillar_id === selectedPillarId ? { ...p, ...pillarData } : p));
            } else {
                const newPillar: Pillars = { pillar_id: pillarData.pillar_id, pillar_title: pillarData.pillar_title, pillar_items: [] };
                updated = [...prev, newPillar];
                setSelectedPillarId(newPillar.pillar_id);
            }
            updatePillars(updated);
            return updated;
        });
    };

    const handleAddPillarItem = () => {
        setAddingNewItem(true);
        setSelectedPillarItemId(null);
        setData({ item_id: Date.now(), pillar_id: selectedPillar?.pillar_id ?? 0, item_description: '' });
    };

    const handleEditPillarItem = (item: PillarItems) => {
        setEditingItem(true);
        setSelectedPillarItemId(item.item_id);
        setData({ item_id: item.item_id, pillar_id: item.pillar_id, item_description: item.item_description });
    };

    const handleDeletePillarItem = (pillarId: number, itemId: number) => {
        setPillarList((prev) => {
            const updated = prev.map((p) =>
                p.pillar_id === pillarId ? { ...p, pillar_items: p.pillar_items?.filter((i) => i.item_id !== itemId) ?? [] } : p,
            );
            updatePillars(updated);
            return updated;
        });
    };

    const handleSavePillarItem = () => {
        if (!selectedPillar) return;
        setPillarList((prev) => {
            const updated = prev.map((p) => {
                if (p.pillar_id !== selectedPillar.pillar_id) return p;
                let items: PillarItems[] = p.pillar_items ? [...p.pillar_items] : [];
                if (editingItem && selectedPillarItemId !== null) {
                    items = items.map((i) => (i.item_id === selectedPillarItemId ? { ...i, ...data } : i));
                } else {
                    items.push({ ...data });
                }
                return { ...p, pillar_items: items };
            });
            updatePillars(updated);
            return updated;
        });
        setEditingItem(false);
        setAddingNewItem(false);
        setSelectedPillarItemId(null);
        setData({ item_id: 0, pillar_id: selectedPillar.pillar_id, item_description: '' });
    };

    const pillarErrorCount = Object.keys(errors).filter((k) => k.startsWith('pillars.')).length;

    const getPillarErrors = (pillarIndex: number, itemIndex: number) =>
        Object.keys(errors).filter((k) => k.startsWith(`pillars.${pillarIndex}.pillar_items.${itemIndex}.`));

    const selectedPillarIndex = pillarList.findIndex((p) => p.pillar_id === selectedPillarId);

    const listItems = pillarList.map((pillar, index) => ({
        id: pillar.pillar_id,
        label: pillar.pillar_title,
        hasError: Object.keys(errors).some((k) => k.startsWith(`pillars.${index}.`)),
    }));

    const detail = selectedPillar ? (
        <>
            <h4 className="text-foreground mb-1 truncate text-lg font-medium">{selectedPillar.pillar_title}</h4>
            <p className="text-muted-foreground mb-6 text-xs">List of Pillar Items</p>

            <div className="max-h-[250px] space-y-4 overflow-y-auto pr-2">
                {!selectedPillar.pillar_items?.length && (
                    <p className="text-muted-foreground text-sm italic">No items have been added to this pillar yet.</p>
                )}
                {selectedPillar.pillar_items?.map((item, itemIndex) => {
                    const hasErrors = getPillarErrors(selectedPillarIndex, itemIndex).length > 0;
                    return (
                        <div key={item.item_id}>
                            {/* Row */}
                            <div
                                className={`group border-border bg-background hover:border-destructive/20 flex items-center justify-between rounded-md border p-2 transition-all ${selectedPillarItemId === item.item_id ? 'hidden' : 'flex'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-foreground flex-1 px-2 text-sm">{item.item_description}</span>
                                    {hasErrors && <CircleAlert className="text-destructive h-4 w-4" />}
                                </div>
                                <div className="flex items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                                    <ActionButton onClick={() => handleEditPillarItem(item)} className="hover:bg-muted rounded-md">
                                        <EditIcon className="h-4 w-4" />
                                    </ActionButton>
                                    <ActionButton
                                        onClick={() => handleDeletePillarItem(selectedPillar.pillar_id, item.item_id)}
                                        className="hover:bg-destructive/10 hover:text-destructive rounded-md"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </ActionButton>
                                </div>
                            </div>

                            {/* Row errors */}
                            {getPillarErrors(selectedPillarIndex, itemIndex).map((errorKey) => (
                                <p key={errorKey} className="text-destructive mt-1 text-xs">
                                    {errors[errorKey]}
                                </p>
                            ))}

                            {/* Inline edit form */}
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${selectedPillarItemId === item.item_id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="border-border bg-background rounded-md border p-6">
                                    <label className="text-foreground mb-2 block text-sm font-medium">Edit Item Description</label>
                                    <Textarea
                                        placeholder="Enter item description..."
                                        value={data.item_description}
                                        onChange={(e) => setData({ ...data, item_description: e.target.value })}
                                        autoFocus
                                        autoResize
                                        minHeight={80}
                                    />
                                    <div className="mt-4 flex justify-end gap-3">
                                        <Button type="button" variant="outline" onClick={() => setSelectedPillarItemId(null)}>
                                            Cancel
                                        </Button>
                                        <Button type="button" onClick={handleSavePillarItem}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Inline add form */}
            <div className="mt-6">
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${addingNewItem ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <div className="border-border bg-background rounded-md border p-6">
                        <label className="text-foreground mb-2 block text-sm font-medium">New Item Description</label>
                        <Textarea
                            placeholder="Enter item description..."
                            value={data.item_description}
                            onChange={(e) => setData({ ...data, item_description: e.target.value })}
                            autoFocus
                            autoResize
                            minHeight={80}
                        />
                        <div className="mt-4 flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => setAddingNewItem(false)}>
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleSavePillarItem}>
                                Save Item
                            </Button>
                        </div>
                    </div>
                </div>

                <div className={`transition-all duration-300 ${addingNewItem ? 'invisible max-h-0 opacity-0' : 'max-h-[100px] opacity-100'}`}>
                    <Button type="button" variant="outline" className="text-xs" onClick={handleAddPillarItem}>
                        <ListPlus className="h-4 w-4" />
                        Add New Item
                    </Button>
                </div>
            </div>
        </>
    ) : null;

    return (
        <>
            <MasterDetailPanel
                title="University Strategic Goals"
                errorCount={pillarErrorCount}
                items={listItems}
                selectedId={selectedPillarId}
                onSelect={(id) => setSelectedPillarId(Number(id))}
                onAdd={handleAddPillar}
                onEdit={handleEditPillar}
                onDelete={handleDeletePillar}
                emptyListIcon={FolderPlus}
                emptyListTitle="No pillars yet"
                addIcon={FolderPlus}
                addLabel="Add New Pillar"
                detail={detail}
                emptyDetailTitle="No Pillar Selected"
                emptyDetailDescription='Select a pillar on the left or click "Add New Pillar" to start.'
            />

            {dialogOpen && (
                <PillarDialog
                    type={action}
                    pillar={action === 'edit' ? selectedPillar : null}
                    onClose={() => setDialogOpen(false)}
                    onSave={handleSavePillar}
                />
            )}
        </>
    );
}
