"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { Plus, Trash2, Edit } from "lucide-react";
import {  Link } from '@inertiajs/react';
import { useState } from "react";

type CardType = {
    id: string;
    type: 'ppp' | 'self-survey' | 'compliance';
    documentUrl?: string;
    documentName?: string;
};

type AreaCardsProps = {
    program: {
        program_name: string;
    };
    cards: CardType[];
    onAdd: (card: CardType) => void;
    onEdit: (id: string, card: Partial<CardType>) => void;
    onRemove: (id: string) => void;
};

export default function AreaCards({ program, cards, onAdd, onEdit, onRemove }: AreaCardsProps) {
    const [editingCard, setEditingCard] = useState<CardType | null>(null);

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const type = formData.get('cardType') as 'ppp' | 'self-survey' | 'compliance';
        const file = formData.get('document') as File;

        const newCard: CardType = {
            id: Date.now().toString(),
            type,
            documentUrl: file ? URL.createObjectURL(file) : undefined,
            documentName: file?.name
        };

        onAdd(newCard);
        (document.getElementById('add-card-dialog-close') as HTMLButtonElement)?.click();
        form.reset();
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCard) return;

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const type = formData.get('cardType') as 'ppp' | 'self-survey' | 'compliance';
        const file = formData.get('document') as File;

        const updatedCard: Partial<CardType> = {
            type,
            documentUrl: file ? URL.createObjectURL(file) : editingCard.documentUrl,
            documentName: file?.name || editingCard.documentName
        };

        onEdit(editingCard.id, updatedCard);
        setEditingCard(null);
        (document.getElementById('edit-card-dialog-close') as HTMLButtonElement)?.click();
        form.reset();
    };

    const handleRemoveCard = (id: string) => {
        onRemove(id);
    };

    const getCardTitle = (type: string) => {
        switch (type) {
            case 'ppp': return 'Program Performance Profile';
            case 'self-survey': return 'Self-Survey';
            case 'compliance': return 'Compliance Report';
            default: return '';
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 justify-center w-full">
                {/* Render existing cards */}
                {cards.map((card) => (
                    <div key={card.id} className="group relative grid w-fit place-items-center gap-1 rounded border p-2">
                        <img className="rounded w-full h-40 object-cover" src="/images/placeholder.png" alt="" />
                        <p className="mt-3 mb-[-0.3vw] text-center text-sm text-[#858585]">AACCUP | Level II</p>
                        <h1 className="w-80 text-center text-2xl leading-none font-black">
                            {getCardTitle(card.type)}
                        </h1>
                        <p className="my-5 text-center text-sm">{program.program_name}</p>
                        
                        {card.documentUrl ? (
                            <Link 
                                href={card.documentUrl} 
                                className="w-full text-right text-sm underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {card.documentName || 'View PDF'}
                            </Link>
                        ) : (
                            <div className="w-full text-right text-sm text-gray-400">No document</div>
                        )}

                        {/* Edit/Remove buttons (appear on hover) */}
                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                                        onClick={() => setEditingCard(card)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                            </Dialog>

                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button 
                                        variant="ghost" 
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black">Are you sure?</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to remove this {getCardTitle(card.type).toLowerCase()}?
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="outline">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button 
                                            type="button" 
                                            variant="destructive"
                                            onClick={() => handleRemoveCard(card.id)}
                                        >
                                            Remove
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                ))}

                {/* Placeholder cards for empty slots */}
                {cards.length === 0 && (
                    <>
                        {['ppp', 'self-survey', 'compliance'].map((type) => (
                            <div key={type} className="grid w-fit place-items-center gap-1 rounded border p-2 opacity-50">
                                <div className="w-64 h-40 bg-gray-100 rounded"></div>
                                <p className="mt-3 mb-[-0.3vw] text-center text-sm text-[#858585]">AACCUP | Level II</p>
                                <h1 className="w-80 text-center text-2xl leading-none font-black">
                                    {getCardTitle(type)}
                                </h1>
                                <p className="my-5 text-center text-sm">{program.program_name}</p>
                                <div className="w-full text-right text-sm text-gray-400">No document</div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Add Card Form */}
            <div className="border p-2 rounded grid place-items-center w-full gap-1">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button 
                            variant="ghost" 
                            className="flex flex-col items-center gap-1 h-full w-full p-4 hover:bg-gray-50"
                        >
                            <div className="rounded-full border-2 border-dashed border-[#B4B4B4] p-3">
                                <Plus className="h-6 w-6 text-[#B4B4B4]" />
                            </div>
                            <p className='text-[#B4B4B4] text-sm'>Add Card</p>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black">Add Card</DialogTitle>
                            <DialogDescription>
                                Make a new card for Program Performance Profile, Self-Survey, or Compliance Report
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddSubmit}>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Card Type</label>
                                    <select
                                        name="cardType"
                                        className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                        defaultValue="ppp"
                                        required
                                    >
                                        <option value="ppp">Program Performance Profile</option>
                                        <option value="self-survey">Self-Survey</option>
                                        <option value="compliance">Compliance Report</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Upload Document</label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-500">PDF (MAX. 5MB)</p>
                                            </div>
                                            <input 
                                                name="document"
                                                type="file" 
                                                className="hidden" 
                                                accept=".pdf" 
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="mt-2">
                                <DialogClose asChild >
                                    <Button type="button" variant="outline" id="add-card-dialog-close" >
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button  type="submit" variant="black">Submit</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Edit Card Dialog */}
            {editingCard && (
                <Dialog>
                    <DialogTrigger asChild>
                        <div className="hidden"></div> {/* Hidden trigger */}
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black">Edit Card</DialogTitle>
                            <DialogDescription>
                                Update the {getCardTitle(editingCard.type).toLowerCase()} details
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit}>
                            <div className="flex flex-col gap-4 py-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Card Type</label>
                                    <select
                                        name="cardType"
                                        className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                        defaultValue={editingCard.type}
                                        required
                                    >
                                        <option value="ppp">Program Performance Profile</option>
                                        <option value="self-survey">Self-Survey</option>
                                        <option value="compliance">Compliance Report</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                                        {editingCard.documentUrl ? 'Replace Document' : 'Upload Document'}
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                {editingCard.documentName && (
                                                    <p className="text-xs text-gray-700 mt-1">
                                                        Current: {editingCard.documentName}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500">PDF (MAX. 5MB)</p>
                                            </div>
                                            <input 
                                                name="document"
                                                type="file" 
                                                className="hidden" 
                                                accept=".pdf" 
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" id="edit-card-dialog-close">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button type="submit" variant="black">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}