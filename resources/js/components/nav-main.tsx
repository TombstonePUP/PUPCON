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
import { Link, router } from '@inertiajs/react';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { Badge } from './ui/badge';

export function NavMain({
    label,
    items,
}: {
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
    const { state } = useSidebar(); // Get the sidebar state

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) =>
                    item.collapsible ? (
                        <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
                            <SidebarMenuItem>
                                <div className="flex w-full">
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        asChild
                                        onClick={() => router.get(item.url)}
                                        className="flex-1 hover:cursor-pointer"
                                    >
                                        <div className="flex items-center">
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </div>
                                    </SidebarMenuButton>
                                    {/* Only show chevron when sidebar is expanded */}
                                    {state === 'expanded' && (
                                        <CollapsibleTrigger asChild>
                                            <button className="px-2 hover:cursor-pointer">
                                                <ChevronRight className="size-5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </button>
                                        </CollapsibleTrigger>
                                    )}
                                </div>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={subItem.url} className="hover:cursor-pointer flex justify-between">
                                                        <span className='line-clamp-1'>{subItem.title}</span>
                                                        {subItem.badge !== undefined && (
                                                            <Badge className="border-none bg-[#7f1414] text-white hover:bg-[#7f1414] justify-center">
                                                                {subItem.badge}
                                                            </Badge>
                                                        )}
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
                            <SidebarMenuButton tooltip={item.title} asChild className="hover:cursor-pointer">
                                <Link href={item.url} className="flex w-full items-center justify-between hover:cursor-pointer">
                                    <div className="flex items-center justify-center gap-2">
                                        {item.icon && <item.icon className="size-4" />}
                                        <span>{item.title}</span>
                                    </div>
                                    {item.badge !== undefined && (
                                        <Badge className="border-none bg-[#7f1414] text-white hover:bg-[#7f1414]">{item.badge}</Badge>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ),
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
