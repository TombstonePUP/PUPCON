'use client';

import { AudioWaveform, Book, ChartArea, Bot, Boxes, Braces, Notebook, Command, GalleryVerticalEnd, SquareTerminal, SquareUser } from 'lucide-react';
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
    const role = auth.user.roles[0].role_name;
    const privilege = role === 'Admin' || role === 'Coordinator';

    const programItems = privileges.map((program) => ({
        title: program.title,
        url: `/manage-programs/${program.title}`,
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
