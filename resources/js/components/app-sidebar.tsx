'use client';

import { Book, Boxes, ChartArea, FileChartColumnIncreasing, GalleryVerticalEnd, InfoIcon, Library, Monitor, Notebook, SquareTerminal, SquareUser } from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { usePage } from '@inertiajs/react';
import { LevelSwitcher } from './level-switcher';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage().props;
    const privileges = auth.programs || [];
    const role = auth.user.roles.role_name;

    const programItems = privileges.map((program) => ({
        title: program.program_name,
        url: `/manage-programs/${program.program_link}/${program.levels[0]?.accreditation_level_id}`,
    }));
    const accre = [
        {
            title: 'Analytics',
            url: '/dashboard',
            icon: ChartArea,
        },
        ...(role === 'Admin' || role === 'Coordinator'
            ? [
                  {
                      title: 'User Management',
                      url: '/users',
                      icon: SquareUser,
                  },
              ]
            : []),
        ...(role === 'Admin' || role === 'Coordinator'
            ? [
                  {
                      title: 'Requests',
                      url: '/requests',
                      icon: Boxes,
                  },
              ]
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
            ? [
                  {
                      title: 'Exhibits',
                      url: '/manage-exhibits',
                      icon: Book,
                  },
              ]
            : []),
        /* ...(role === 'Admin' || role === 'Coordinator'
            ? [
                  {
                      title: 'Ratings',
                      url: '/ratings',
                      icon: FileChartColumnIncreasing,
                  },
              ]
            : []), */
        /* ...(role === 'Admin' || role === 'Coordinator'
            ? [
                  {
                      title: 'Content Management',
                      url: '/about-content',
                      icon: Monitor,
                  },
              ]
            : []), */
    ];
    const content = [
        ...(role === 'Admin' || role === 'Coordinator'
            ? [
                  {
                      title: 'Campus Information',
                      url: '/main-content',
                      icon: InfoIcon,
                  },
              ]
            : []),
               ...(role === 'Admin' || role === 'Coordinator'
            ? [
                  {
                      title: 'Other Services',
                      url: '/other-services',
                      icon: Library,
                  },
              ]
            : []),
    ];

    const data = {
        user: {
            name: 'shadcn',
            email: 'm@example.com',
            avatar: '/avatars/shadcn.jpg',
        },
        teams: [
            {
                name: 'Acme Inc',
                logo: GalleryVerticalEnd,
                plan: 'Enterprise',
            },
        ],
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <LevelSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain label="Accreditation" items={accre} />
                <NavMain label="Content Management" items={content} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
