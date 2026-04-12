'use client';

import { Book, Boxes, ChartArea, GalleryVerticalEnd, InfoIcon, Library, Notebook, SquareUser } from 'lucide-react';
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
    url: `/manage-programs/${program.program_id}/${program.latest_level?.accreditation_level_id}`,
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
    // ...(role === 'Admin' || role === 'Coordinator' ?
    //  [
    {
      title: 'Document Requests',
      url: '/requests',
      icon: Boxes,
      badge: 11, // or any number
    },
    // ]
    // : []),
    {
      title: 'Programs',
      url: '/manage-programs',
      icon: Notebook,
      isActive: true,
      collapsible: true,
      items: [
        ...programItems,
        // {
        //     title: 'PlaceholderPlaceholderPlaceholder',
        //     url: '/#',
        //     badge: 12,
        // },
      ],
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
      <SidebarContent className='mt-4'>
        <NavMain label="Accreditation" items={accre} />
        {(role === 'Admin' || role === 'Coordinator') &&
          <NavMain label="Content Management" items={content} />
        }
      </SidebarContent>
      <SidebarFooter className='mb-2'>
        <NavUser />
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
