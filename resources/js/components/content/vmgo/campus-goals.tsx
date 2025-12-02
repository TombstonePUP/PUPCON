import { CampusGoals } from "@/types/content";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EditIcon, Plus } from "lucide-react";
import { Trash2 } from "lucide-react";
import { X } from "lucide-react";
import { useState } from "react";
import CampusGoalDialog from "@/components/dialogs/content/campus-goal-dialog";

interface CampusGoalsSectionProps {
    campus_goals: CampusGoals[];
    updateCampusGoals: (goals: CampusGoals[]) => void;
}

const ActionButton: React.FC<React.ComponentProps<'button'>> = ({ children, className, ...props }) => (
    <button className={`p-1 text-gray-400 transition-colors hover:text-red-600 ${className}`} type="button" {...props}>
        {children}
    </button>
);

export default function CampusGoalsSection({ ...props }: CampusGoalsSectionProps) {
    const { campus_goals, updateCampusGoals } = props;
    const [goalsList, setGoalsList] = useState<CampusGoals[]>(campus_goals);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [action, setAction] = useState<'add' | 'edit'>('add');

    const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
    const selectedGoal = goalsList.find((goal) => goal.goal_id === selectedGoalId) || null;

    const handleAddGoal = () => {
        setDialogOpen(true);
        setAction('add');
        setSelectedGoalId(null);
    };

    const handleEditGoal = (goal: CampusGoals) => {
        setDialogOpen(true);
        setAction('edit');
        setSelectedGoalId(goal.goal_id);
    }

    const handleSaveGoal = (goal: CampusGoals) => {
        setGoalsList((prevGoals) => {
            let updatedGoals: CampusGoals[];
            if (action === 'edit' && selectedGoalId !== null) {
                updatedGoals = prevGoals.map((g) => (g.goal_id === selectedGoalId ? goal : g));
            } else {
                updatedGoals = [...prevGoals, goal];
                setSelectedGoalId(goal.goal_id);
            }
            updateCampusGoals(updatedGoals);
            return updatedGoals;
        });
    }

    const handleDeleteGoal = (id: number) => {
        setGoalsList((prevGoals) => {
            const updatedGoals = prevGoals.filter((goal) => goal.goal_id !== id);
            updateCampusGoals(updatedGoals);
            if (selectedGoalId === id) {
                setSelectedGoalId(null);
            }
            return updatedGoals;
        });
    };

    return (
        <>
            <div className="mb-6">
                <h3 className="mb-4 text-base font-semibold text-gray-900">PUP San Juan Campus Goals</h3>

                <div className="flex min-h-[400px] rounded-lg border border-gray-200">
                    {/* Left Pane: Goal List */}
                    <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 p-6">
                        <h4 className="mb-3 text-xs text-gray-500">Select a Goal</h4>
                        <div className="space-y-1">
                            {goalsList.map((goal, index) => (
                                <div
                                    key={goal.goal_id}
                                    onClick={() => {
                                        setSelectedGoalId(goal.goal_id);
                                    }}
                                    className={`group flex cursor-pointer items-center justify-between rounded-md p-2 px-4 transition-colors ${goal.goal_id === selectedGoalId ? 'bg-[#7f1414]/4' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="truncate text-sm">
                                        <div
                                            className={` ${goal.goal_id === selectedGoalId ? 'font-normal text-red-900' : 'text-gray-700'} flex gap-2 truncate`}
                                        >
                                            <div className={`font-normal ${goal.goal_id === selectedGoalId ? 'text-red-800' : 'text-red-600/70'}`}>
                                                {index + 1}
                                            </div>
                                            {'    '}
                                            <div className="truncate">{goal.goal_title_eng}</div>
                                        </div>
                                    </div>

                                    <div
                                        className={`flex items-center space-x-0.5 transition-opacity ${goal.goal_id === selectedGoalId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                            }`}
                                    >
                                        <ActionButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditGoal(goal);
                                            }}
                                            className="cursor-pointer rounded-md text-gray-200 hover:bg-red-50 hover:text-gray-700"
                                        >
                                            <EditIcon className="h-4 w-4" />
                                        </ActionButton>
                                        <ActionButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteGoal(goal.goal_id);
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
                                onClick={handleAddGoal}
                                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#7f1414] px-5 py-2 text-sm font-medium text-white transition"
                            >
                                <Plus className="mr-2 h-4 w-4" /> <p className="truncate">Add New Goal</p>
                            </Button>
                        </div>
                    </div>

                    {/* Right Pane: Goal Details */}
                    <div className="w-2/3 p-6">
                        {!selectedGoal ? (
                            <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
                                <X className="mb-2 h-8 w-8" />
                                <p className="font-medium">No Goal Selected</p>
                                <p className="text-sm">Select a goal on the left or click "Add New Goal" to start.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="mb-1 text-lg font-semibold break-words text-gray-900">{selectedGoal.goal_title_eng}</h4>
                                    <p className="text-xs font-normal text-gray-600">English Details</p>
                                    <p className="mt-2 text-sm text-gray-700">{selectedGoal.goal_desc_eng}</p>
                                </div>

                                <Separator className="bg-gray-200" />

                                <div>
                                    <h4 className="mb-1 text-lg font-semibold break-words text-gray-900">{selectedGoal.goal_title_fil}</h4>
                                    <p className="text-xs font-normal text-gray-600">Filipino Details</p>
                                    <p className="mt-2 text-sm text-gray-700 italic">{selectedGoal.goal_desc_fil}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
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
