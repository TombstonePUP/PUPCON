'use client';

import { AudioWaveform, Book, Bot, Boxes, Braces, Command, GalleryVerticalEnd, SquareTerminal } from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '@/components/ui/sidebar';
import { usePage } from '@inertiajs/react';

const data = {
    levels: [
        {
            name: 'Acme Inc',
            logo: GalleryVerticalEnd,
            plan: 'Enterprise',
        },
        {
            name: 'Acme Corp.',
            logo: AudioWaveform,
            plan: 'Startup',
        },
        {
            name: 'Evil Corp.',
            logo: Command,
            plan: 'Free',
        },
    ],
    content: [
        {
            title: 'News',
            url: '/dashboard',
            icon: SquareTerminal,
        },
        {
            title: 'Programs',
            url: '/embed',
            icon: Bot,
            isActive: true,
            collapsible: true,
            items: [
                {
                    title: 'Accountancy',
                    url: '/accountancy',
                },
                {
                    title: 'Accountancy',
                    url: '/accountancy',
                },
                {
                    title: 'Accountancy',
                    url: '/accountancy',
                },
            ],
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage().props;
    const privileges = auth.programs || [];

    const programItems = privileges.map((program) => ({
        title: program.title,
        url: `/manage-programs/${program.title}`,
    }));
    const accre = [
        {
            title: 'Analytics',
            url: '/dashboard',
            icon: SquareTerminal,
        },
        {
            title: 'User Management',
            url: '/users',
            icon: Bot,
        },
        {
            title: 'Requests',
            url: '/requests',
            icon: Boxes,
        },
        {
            title: 'Programs',
            url: '/manage-programs',
            icon: Braces,
            isActive: true,
            collapsible: true,
            items: programItems,
        },
        {
            title: 'Exhibits',
            url: '/manage-exhibits',
            icon: Book,
        },
    ];
    return (
        <Sidebar collapsible="icon" {...props}>
            {/* <SidebarHeader>
                <LevelSwitcher teams={data.levels} />
            </SidebarHeader> */}
            <SidebarContent className="mt-5">
                <NavMain label="Accreditation" items={accre} />
                <NavMain label="Content" items={data.content} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
