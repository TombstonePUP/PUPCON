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
import { Plus } from "lucide-react";

export default function AreaCardForm() {
    return (
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
                    <div className="flex flex-col gap-4 py-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Card Type</label>
                            <select
                                className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                defaultValue="ppp"
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
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="black">Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}