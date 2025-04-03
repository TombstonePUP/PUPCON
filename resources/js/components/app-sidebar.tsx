"use client"

import * as React from "react"
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { LevelSwitcher } from "@/components/level-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

// sample data
const data = {
    levels: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    accre: [
        {
            title: "Analytics",
            url: "/dashboard",
            icon: SquareTerminal,
        },
        {
            title: "User Management",
            url: "/users",
            icon: Bot,
        },
        {
            title: "Embed",
            url: "/embed",
            icon: Bot,
            isActive: true,
            collapsible: true,
            items: [
                {
                    title: "Accountancy",
                    url: "/accountancy",
                }, {
                    title: "Accountancy",
                    url: "/accountancy",
                }, {
                    title: "Accountancy",
                    url: "/accountancy",
                },
            ],
        },
    ],
    content: [
        {
            title: "News",
            url: "/dashboard",
            icon: SquareTerminal,
        },
        {
            title: "Programs",
            url: "/embed",
            icon: Bot,
            isActive: true,
            collapsible: true,
            items: [
                {
                    title: "Accountancy",
                    url: "/accountancy",
                }, {
                    title: "Accountancy",
                    url: "/accountancy",
                }, {
                    title: "Accountancy",
                    url: "/accountancy",
                },
            ],
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <LevelSwitcher teams={data.levels} />
            </SidebarHeader>
            <SidebarContent>
            <NavMain label="Accreditation" items={data.accre} />
            <NavMain label="Content" items={data.content} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
