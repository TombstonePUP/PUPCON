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
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

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
                                    <SidebarMenuSub className="mr-0 pr-0">
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={subItem.url} className="flex justify-between hover:cursor-pointer">
                                                        <span className="truncate">{subItem.title}</span>
                                                        {subItem.badge !== undefined && (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Badge className="justify-center rounded border-none bg-[#7f1414]/50 text-white hover:bg-[#7f1414] rounded-full">
                                                                            {subItem.badge}
                                                                        </Badge>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Pending</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
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
                                    <div className="flex items-center gap-2">
                                        {item.icon && <item.icon className="size-4" />}
                                        <span className="sidebar-label truncate">{item.title}</span>
                                    </div>

                                    {item.badge !== undefined && (
                                        <span className="sidebar-badge">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Badge
                                                            variant="outline"
                                                            className="justify-center rounded border-none bg-[#7f1414]/50 text-white hover:bg-[#7f1414] rounded-full"
                                                        >
                                                            {item.badge}
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Pendings</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </span>
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
