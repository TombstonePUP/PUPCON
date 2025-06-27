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
import { Label } from "@/components/ui/label"
import { UserPlus, Mail, User, Shield, Settings, BookOpen, CheckCircle, User2 } from "lucide-react"

const programColors: Record<string, string> = {
    "Communication": "border-red-500",
    "Information Technology": "border-blue-500",
    "Business": "border-yellow-500",
    "Engineering": "border-green-500",
    // Add more program-to-color mappings here
};

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
                    {row.getValue("role") ? row.getValue("role") : 'No role'}
                </Badge>
            </div>
        },
    },
    {
        accessorKey: "program_roles",
        header: () => <div className="text-left">Program/s</div>,
        cell: ({ row }) => {
            const programs: string[] = row.getValue("program_roles")?.replace(/[{}"]/g, "").split(",") || [];

            return (
                <div className="flex flex-wrap gap-1 text-left">
                    {programs.map((program) => (
                        <Badge
                            key={program}
                            variant="outline"
                            className={`px-1.5 text-muted-foreground ${programColors[program.trim()] || "border-gray-300"}`}
                        >
                            {program.trim()}
                        </Badge>
                    ))}
                </div>
            );
        },
    },
    {
        accessorKey: "area_roles",
        header: () => <div className="text-left">Area/s</div>,
        cell: ({ row }) => {
            const areas: string[] = row.getValue("area_roles")?.replace(/[{}"]/g, "").split("} {").flatMap(a => a.split(",")).map(a => a.trim()) || [];

            // You can optionally match area to program and apply same color. Here's a basic fallback color approach:
            return (
                <div className="flex flex-wrap gap-1 text-left">
                    {areas.map((area, idx) => (
                        <Badge
                            key={idx}
                            variant="outline"
                            className="px-1.5 text-muted-foreground border-gray-400"
                        >
                            {area}
                        </Badge>
                    ))}
                </div>
            );
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

            const initialPrograms = user.program_roles?.replace(/[{}"]/g, "").split(",").map(p => p.trim()) || [];
            const initialAreas = (() => {
                const areaMap: Record<string, number[]> = {};
                if (user.area_roles) {
                    const areaGroups = user.area_roles.match(/{[^}]+}/g) || [];
                    areaGroups.forEach((group, i) => {
                        const program = initialPrograms[i]; // match based on index
                        if (program) {
                            const areas = group.replace(/[{}"]/g, "").split(",").map(a => parseInt(a.trim(), 10));
                            areaMap[program] = areas;
                        }
                    });
                }
                return areaMap;
            })();

            const [selectedPrograms, setSelectedPrograms] = useState<string[]>(initialPrograms);
            const [selectedAreas, setSelectedAreas] = useState<Record<string, number[]>>(initialAreas);


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
                    <DropdownMenuContent align="end" className="w-10 space-y-1">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className='w-full flex-start'>
                                    Edit User
                                </Button>
                            </DialogTrigger>
                            <DialogContent><DialogHeader>
                                <DialogTitle className='flex items-center gap-2'>
                                    <User2 className="h-5 w-5 text-[#7f1414]" />
                                    Edit User
                                </DialogTitle>
                                <DialogDescription>
                                    Fill in the details to create a new account
                                </DialogDescription>
                            </DialogHeader>
                                <Tabs defaultValue="account" className="w-full">
                                    <TabsList className='w-full mb-4'>
                                        <TabsTrigger value="account">Information</TabsTrigger>
                                        <TabsTrigger value="access">Access</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="account">
                                        <div className="flex flex-col gap-4">
                                            <div className='flex gap-2'>
                                                <div className='flex flex-col flex-1 gap-2'>
                                                    <Label >First Name</Label>
                                                    <input
                                                        type="text"
                                                        className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                        placeholder="Enter first name"
                                                    />
                                                </div>
                                                <div className='flex flex-col flex-1 gap-2'>
                                                    <Label >Last Name</Label>
                                                    <input
                                                        type="text"
                                                        className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                        placeholder="Enter last name"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                                                    {/* <Mail className="h-4 w-4" /> */}
                                                    Email Address
                                                </Label>
                                                <input
                                                    type="email"
                                                    className="w-full rounded-md border bg-background border-gray-300 p-2 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                                                    placeholder="Enter email address"
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="access" className="flex flex-col gap-5 overflow-x-auto">
                                        <div>
                                            <Label className="mb-1 block text-sm font-medium mb-2">Programs & Areas</Label>
                                            <div className="flex flex-col gap-3">
                                                {programList.map(program => (
                                                    <div key={program}>
                                                        <label className="flex items-center gap-3 text-sm mb-0 font-normal text-foreground">
                                                            <input
                                                                type="checkbox"
                                                                className="accent-ring"
                                                                checked={isProgramSelected(program)}
                                                                onChange={() => toggleProgram(program)}
                                                            />
                                                            {program}
                                                        </label>
                                                        {isProgramSelected(program) && (
                                                            <div className="ml-6 mt-2">
                                                                <div className="grid grid-cols-5 gap-2 flex-wrap">
                                                                    {Array.from({ length: 10 }).map((_, i) => (
                                                                        <label key={i} className="flex items-center gap-2 text-sm mb-0 font-normal text-foreground">
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
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="mb-1 block text-sm font-medium">Additional Access</Label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {/* <label className="flex items-center gap-2 text-sm mb-0 font-normal text-foreground">
                                            <input type="checkbox" className="accent-ring" /> Exhibits
                                        </label> */}
                                                <label className="flex items-center gap-2 text-sm mb-0 font-normal text-foreground whitespace-nowrap">
                                                    <input type="checkbox" className="accent-ring " /> Coordinator
                                                </label>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button variant="noborder">Submit</Button>
                                </DialogFooter></DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="noborder" className='w-full flex-start'>Remove</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Remove User {user.first_name} {user.last_name}?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. This will permanently delete the user <b>{user.first_name} {user.last_name}</b>.
                                    </DialogDescription>

                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button variant="noborder">Remove</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];
