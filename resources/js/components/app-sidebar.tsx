'use client';

import { AudioWaveform, Book, ChartArea, Bot, Boxes, Braces, Notebook, Command, GalleryVerticalEnd, SquareTerminal, SquareUser } from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '@/components/ui/sidebar';
import { usePage } from '@inertiajs/react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage().props;
    const privileges = auth.programs || [];
    const role = auth.user.roles[0].role_name;

    const programItems = privileges.map((program) => ({
        title: program.program_name,
        url: `/manage-programs/${program.program_link}`,
    }));
    const accre = [
        {
            title: 'Analytics',
            url: '/dashboard',
            icon: ChartArea,
        },
            ...(role === 'Admin' || role === 'Coordinator'
        ? [{
            title: 'User Management',
            url: '/users',
            icon: SquareUser,
        }]
        : []),
            ...(role === 'Admin' || role === 'Coordinator'
        ? [{
            title: 'Requests',
            url: '/requests',
            icon: Boxes,
        }]
        : []),
        {
            title: 'Programs',
            url: '/manage-programs',
            icon: Notebook,
            isActive: true,
            collapsible: true,
            items: programItems,
        },
            ...(role === 'Admin' || role === 'Coordinator'
        ? [{
            title: 'Exhibits',
            url: '/manage-exhibits',
            icon: Book,
        }]
        : []),
    ];
    const content = [
            ...(role === 'Admin' || role === 'Coordinator'
        ? [
            {
                title: 'News',
                url: '/dashboard',
                icon: SquareTerminal,
            },
        ]
        : []),
    ];
    return (
        <Sidebar collapsible="icon" {...props}>
            {/* <SidebarHeader>
                <LevelSwitcher teams={data.levels} />
            </SidebarHeader> */}
            <SidebarContent className="mt-3">
                <NavMain label="Accreditation" items={accre} />
                {/* <NavMain label="Content" items={content} /> */}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
