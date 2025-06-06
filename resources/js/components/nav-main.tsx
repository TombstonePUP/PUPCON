"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { Link, router } from "@inertiajs/react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
    label,
    items,
}: {
    label: string
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        collapsible?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[]
}) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) =>
                    item.collapsible ? (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={item.isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <div className="flex w-full">
                                    <SidebarMenuButton 
                                        tooltip={item.title}
                                        asChild
                                        onClick={() => router.get(item.url)}
                                        className="hover:cursor-pointer flex-1" // Added cursor-pointer
                                    >
                                        <div className="flex items-center">
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </div>
                                    </SidebarMenuButton>
                                    <CollapsibleTrigger asChild>
                                        <button className="px-2 hover:cursor-pointer"> {/* Added cursor-pointer */}
                                            <ChevronRight className="size-5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </button>
                                    </CollapsibleTrigger>
                                </div>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild>
                                                    <Link 
                                                      href={subItem.url} 
                                                      className="hover:cursor-pointer" // Added cursor-pointer
                                                    >
                                                        <span>{subItem.title}</span>
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
                              className="hover:cursor-pointer" // Added cursor-pointer
                            >
                                <Link 
                                  href={item.url} 
                                  className="flex items-center w-full hover:cursor-pointer" // Added cursor-pointer
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                )}
            </SidebarMenu>
        </SidebarGroup>
    )
}