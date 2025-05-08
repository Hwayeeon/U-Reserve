"use client"

import * as React from "react"
import {
  BarChartIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  Inbox,
  Trash2,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Calendar } from "@/components/ui/calendar"
import { getCookies } from "@/lib/cookies"

const data = {
  user: getCookies("user"),
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Users",
      url: "/users",
      icon: UsersIcon,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChartIcon,
    },
    {
      title: "Data",
      url: "/data",
      icon: FolderIcon,
    },
    {
      title: "Roles & Permissions",
      url: "/roles-permissions",
      icon: SettingsIcon,
    },
    {
      title: "Logs",
      url: "/logs",
      icon: ClipboardListIcon,
    },
    {
      title: "Inbox",
      url: "/inbox",
      icon: Inbox,
    },
    {
      title: "Trash",
      url: "/trash",
      icon: Trash2,
    },
  ],
  navClouds: [
    {
      title: "Uploads",
      icon: FileIcon,
      url: "#",
      items: [
        {
          title: "Active Uploads",
          url: "#",
        },
        {
          title: "Archived Uploads",
          url: "#",
        },
      ],
    },
    {
      title: "Backups",
      icon: DatabaseIcon,
      url: "#",
      items: [
        {
          title: "Recent Backups",
          url: "#",
        },
        {
          title: "Backup History",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Profile",
      url: "#",
      icon: UsersIcon,
    },
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
}

export function AppSidebar(props) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-base font-semibold">U-Reserve</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {/* This is for the calendar component with auto-update. Add logic here as needed. */}
        <SidebarMenu>
          <Calendar
            mode="single"
            selected={new Date()}
            onSelect={() => {}}
            className="rounded-md border"
          />
        </SidebarMenu>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}