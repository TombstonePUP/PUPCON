"use client"

import { type UserRecords } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { MoreVertical } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const columns: ColumnDef<UserRecords>[] = [
    {
        accessorKey: "first_name",
        header: () => <div className="text-left">First Name</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue("first_name")} </div>
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: "last_name",
        header: () => <div className="text-left">Last Name</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue("last_name")} </div>
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: "email",
        header: () => <div className="text-left">Email</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue("email")} </div>
        },
        enableGlobalFilter: true,
    },
    {
        accessorKey: "role",
        header: () => <div className="text-left">Role</div>,
        cell: ({ row }) => {
            return <div className="text-left w-32">
                <Badge variant="outline" className="px-1.5 text-muted-foreground">
                    {row.getValue("role")}
                </Badge>
            </div>
        },
    },
    {
        accessorKey: "program_roles",
        header: () => <div className="text-left">Program/s</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue("program_roles")} </div>
        },
    },
    {
        accessorKey: "area_roles",
        header: () => <div className="text-left">Area/s</div>,
        cell: ({ row }) => {
            return <div className="text-left"> {row.getValue("area_roles")} </div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original
            const programList = [
                'Information Technology',
                'Accounting',
                'Psychology'
            ];

            const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
            const [selectedAreas, setSelectedAreas] = useState<Record<string, number[]>>({});

            const toggleProgram = (program: string) => {
                setSelectedPrograms((prev) => {
                    const isSelected = prev.includes(program);
                    const updated = isSelected
                        ? prev.filter((p) => p !== program)
                        : [...prev, program];

                    // If program is being unchecked, also clear its areas
                    if (isSelected) {
                        setSelectedAreas((prevAreas) => {
                            const updatedAreas = { ...prevAreas };
                            delete updatedAreas[program];
                            return updatedAreas;
                        });
                    }

                    return updated;
                });
            };


            const toggleArea = (program: string, area: number) => {
                setSelectedAreas((prev) => {
                    const current = prev[program] || [];
                    return {
                        ...prev,
                        [program]: current.includes(area)
                            ? current.filter((a) => a !== area)
                            : [...current, area]
                    };
                });
            };

            const isProgramSelected = (program: string) => selectedPrograms.includes(program);

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-10">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className='w-full flex-start'>
                                    Edit Account
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Account</DialogTitle>
                                    <DialogDescription>
                                        Account Name
                                    </DialogDescription>
                                </DialogHeader>
                                <Tabs defaultValue="account" className="w-full">
                                    <TabsList className='w-full'>
                                        <TabsTrigger value="account">Information</TabsTrigger>
                                        <TabsTrigger value="password">Access</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="account">
                                        <div className="flex flex-col gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-1">First Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                    placeholder="Account first name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-1">Last Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                    placeholder="Account last name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                    placeholder="Account email address"
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="password" className='flex flex-col gap-4'>
                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-1">Programs</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {programList.map(program => (
                                                    <label key={program} className="flex items-center gap-2  text-sm">
                                                        <input
                                                            type="checkbox"
                                                            className="accent-ring"
                                                            checked={isProgramSelected(program)}
                                                            onChange={() => toggleProgram(program)}
                                                        />
                                                        {program}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {programList.map((program) =>
                                            isProgramSelected(program) ? (
                                                <div key={program}>
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                                                        Areas - {program}
                                                    </label>
                                                    <div className="grid grid-cols-5 gap-2">
                                                        {Array.from({ length: 10 }).map((_, i) => (
                                                            <label key={i} className="flex items-center gap-2 text-sm">
                                                                <input
                                                                    type="checkbox"
                                                                    className="accent-ring"
                                                                    checked={(selectedAreas[program] || []).includes(i + 1)}
                                                                    onChange={() => toggleArea(program, i + 1)}
                                                                />
                                                                Area {i + 1}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : null
                                        )}


                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-1">Additional Access</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input type="checkbox" className="accent-ring" /> Exhibits
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input type="checkbox" className="accent-ring" /> Accre Coordinator
                                                </label>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                                <DialogFooter className="sm:justify-between">
                                    <div className="flex gap-2">

                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="destructive">Reset Password</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Are you sure?</DialogTitle>
                                                    <DialogDescription>
                                                        This action cannot be undone. This will generate a random password for<b>Account Name</b> that will be sent to their email.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <Button variant="destructive" >Reset Password</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className="flex gap-2">
                                        <DialogClose asChild>
                                            <Button variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button variant="black">Submit</Button>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="destructive" className='w-full flex-start'>Remove</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you sure?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. This will permanently delete the <b>Parameter A</b>.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button variant="destructive">Remove</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];
