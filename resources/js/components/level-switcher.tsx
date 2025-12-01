'use client';

import * as React from 'react';

import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Link } from '@inertiajs/react';
import { FilesIcon } from 'lucide-react';

export function LevelSwitcher({
    teams,
}: {
    teams: {
        name: string;
        logo: React.ElementType;
        plan: string;
    }[];
}) {
    const { isMobile } = useSidebar();
    const [activeTeam, setActiveTeam] = React.useState(teams[0]);

    if (!activeTeam) {
        return null;
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <Link href="/" className='flex items-center gap-2 w-full'>
                                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg bg-[#7f1414]">
                                    <FilesIcon className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {/* Useranme here */}
                                        PUPCON
                                    </span>
                                    <span className="truncate text-xs">Version 1.0</span>
                                    {/* User Role Here */}
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
