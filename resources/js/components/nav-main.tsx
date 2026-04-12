'use client';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Link, router, usePage } from '@inertiajs/react';
import { ChevronRight, type LucideIcon } from 'lucide-react';

export function NavMain({
  label,
  items,
}: {
  label?: string;
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    collapsible?: boolean;
    badge?: number;
    items?: {
      title: string;
      url: string;
      badge?: number;
    }[];
  }[];
}) {
  const { state } = useSidebar();
  const { url: currentUrl } = usePage();

  const isExactActive = (url: string) => currentUrl === url;

  const isActive = (url: string) => currentUrl.startsWith(url); // keep for children if needed

  const hasActiveChild = (subItems?: { url: string }[]) =>
    subItems?.some((s) => isActive(s.url)) ?? false;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          item.collapsible ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive || hasActiveChild(item.items)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <div className="flex w-full">
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    onClick={() => router.get(item.url)}
                    isActive={isExactActive(item.url)}
                    className="flex-1 hover:cursor-pointer"
                  >
                    <div className="flex items-center">
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>

                  {state === 'expanded' && (
                    <CollapsibleTrigger asChild>
                      <button className="px-2 hover:cursor-pointer">
                        <ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </button>
                    </CollapsibleTrigger>
                  )}
                </div>

                <CollapsibleContent>
                  <SidebarMenuSub className="mr-0 pr-0">
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={isActive(subItem.url)}>
                          <Link
                            href={subItem.url}
                            className="flex justify-between hover:cursor-pointer capitalize"
                          >
                            <span className="truncate">{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={isExactActive(item.url)}
                className="hover:cursor-pointer"
              >
                <Link href={item.url} className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.icon && <item.icon className="size-4" />}
                    <span className="sidebar-label truncate">{item.title}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ),
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}