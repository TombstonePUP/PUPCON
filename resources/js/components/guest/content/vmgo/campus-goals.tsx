import CampusGoalDialog from '@/components/admin/dialogs/content/campus-goal-dialog';
import { MasterDetailPanel } from '@/components/admin/master-detail-panel';
import { Separator } from '@/components/ui/separator';
import { CampusGoals } from '@/types/content';
import { Target } from 'lucide-react';
import { useState } from 'react';

interface CampusGoalsSectionProps {
    campus_goals: CampusGoals[];
    updateCampusGoals: (goals: CampusGoals[]) => void;
    errors?: Record<string, string>;
}

export default function CampusGoalsSection({ campus_goals, updateCampusGoals, errors = {} }: CampusGoalsSectionProps) {
    const [goalsList, setGoalsList] = useState<CampusGoals[]>(campus_goals ?? []);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [action, setAction] = useState<'add' | 'edit'>('add');
    const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);

    const selectedGoal = goalsList.find((g) => g.goal_id === selectedGoalId) ?? null;

    const handleAddGoal = () => {
        setDialogOpen(true);
        setAction('add');
        setSelectedGoalId(null);
    };

    const handleEditGoal = (id: number | string) => {
        setDialogOpen(true);
        setAction('edit');
        setSelectedGoalId(Number(id));
    };

    const handleDeleteGoal = (id: number | string) => {
        setGoalsList((prev) => {
            const updated = prev.filter((g) => g.goal_id !== id);
            updateCampusGoals(updated);
            if (selectedGoalId === id) setSelectedGoalId(null);
            return updated;
        });
    };

    const handleSaveGoal = (goal: CampusGoals) => {
        setGoalsList((prev) => {
            let updated: CampusGoals[];
            if (action === 'edit' && selectedGoalId !== null) {
                updated = prev.map((g) => (g.goal_id === selectedGoalId ? goal : g));
            } else {
                updated = [...prev, goal];
                setSelectedGoalId(goal.goal_id);
            }
            updateCampusGoals(updated);
            return updated;
        });
    };

    const goalsErrorCount = Object.keys(errors).filter((k) => k.startsWith('campus_goals.')).length;

    const selectedGoalIndex = goalsList.findIndex((g) => g.goal_id === selectedGoalId);
    const selectedGoalErrors =
        selectedGoalIndex >= 0 ? Object.entries(errors).filter(([key]) => key.startsWith(`campus_goals.${selectedGoalIndex}`)) : [];

    const listItems = goalsList.map((goal, index) => ({
        id: goal.goal_id,
        label: goal.goal_title_eng,
        hasError: Object.keys(errors).some((k) => k.startsWith(`campus_goals.${index}.`)),
    }));

    const detail = selectedGoal ? (
        <div className="space-y-6">
            <div>
                <h4 className="text-foreground mb-1 text-lg font-semibold break-words">{selectedGoal.goal_title_eng}</h4>
                <p className="text-muted-foreground text-xs">English Details</p>
                <p className="text-foreground mt-2 text-sm">{selectedGoal.goal_desc_eng}</p>
            </div>

            <Separator />

            <div>
                <h4 className="text-foreground mb-1 text-lg font-semibold break-words">{selectedGoal.goal_title_fil}</h4>
                <p className="text-muted-foreground text-xs">Filipino Details</p>
                <p className="text-foreground mt-2 text-sm italic">{selectedGoal.goal_desc_fil}</p>
            </div>

            {selectedGoalErrors.length > 0 && (
                <div className="bg-destructive/10 text-destructive space-y-1 rounded p-2 text-sm">
                    <p className="font-semibold">Errors:</p>
                    {selectedGoalErrors.map(([key, message]) => (
                        <p key={key}>• {message}</p>
                    ))}
                </div>
            )}
        </div>
    ) : null;

    return (
        <>
            <MasterDetailPanel
                title="PUP San Juan Campus Goals"
                description="Manage campus goals in English and Filipino"
                errorCount={goalsErrorCount}
                items={listItems}
                selectedId={selectedGoalId}
                onSelect={(id) => setSelectedGoalId(Number(id))}
                onAdd={handleAddGoal}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
                emptyListIcon={Target}
                emptyListTitle="No goals yet"
                addIcon={Target}
                addLabel="Add New Goal"
                detail={detail}
                emptyDetailTitle="No Goal Selected"
                emptyDetailDescription='Select a goal on the left or click "Add New Goal" to start.'
            />

            {dialogOpen && (
                <CampusGoalDialog
                    type={action}
                    goal={action === 'edit' ? selectedGoal : null}
                    onClose={() => setDialogOpen(false)}
                    onSave={handleSaveGoal}
                />
            )}
        </>
    );
}
