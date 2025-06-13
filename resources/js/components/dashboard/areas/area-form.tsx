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

export default function AreaForm() {
    return (
        <Dialog>
            <DialogTrigger asChild className='flex-1 border rounded flex items-center flex-col p-10 h-[15vw]'>
                <Button variant="outline" className="cursor-pointer">
                    <svg
                        className="size-15"
                        viewBox="0 0 46 46"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M23.0691 15.4943V30.4837M15.5743 22.989H30.5638M41.8058 22.989C41.8058 33.337 33.4171 41.7257 23.0691 41.7257C12.721 41.7257 4.33228 33.337 4.33228 22.989C4.33228 12.6409 12.721 4.2522 23.0691 4.2522C33.4171 4.2522 41.8058 12.6409 41.8058 22.989Z"
                            stroke="#B4B4B4"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <p className='text-[#B4B4B4]'>Add Card</p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Card</DialogTitle>
                    <DialogDescription>
                        Make a new card for Program Performance Profile, Self-Survey, or Compliance
                    </DialogDescription>
                </DialogHeader>
                <div className=" flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Card Type</label>
                        <select
                            className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                            defaultValue="ppp"
                        >
                            <option value="ppp">Program Performance Profile</option>
                            <option value="self-survey">Self-Survey</option>
                            <option value="compliance">Compliance</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Upload Document</label>
                        <input
                            type="file"
                            className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-semibold file:text-foreground hover:file:bg-accent"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
