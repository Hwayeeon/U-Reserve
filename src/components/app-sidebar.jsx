"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
  UserPen,
  CircleHelp,
  Info,
  History,
  House,
} from "lucide-react"

// Buat yang gak paham ini apa? Ini adalah komponen sidebar yang akan menampilkan menu navigasi dan informasi tim.
// Jadi, ketika kita membuka aplikasi, kita akan melihat sidebar ini di sisi kiri layar.
// Sidebar ini akan menampilkan menu navigasi dan informasi tim yang sedang aktif.

import { NavMain } from "@/components/nav-main"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  teams: [
    {
      name: "U-Reserve",
      logo: GalleryVerticalEnd,
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: House,
    },
    {
      title: "Navigation",
      url: "#",
      icon: Bot,
    },
    {
      title: "Profile",
      url: "#",
      icon: UserPen,
    },
    {
      title: "History",
      url: "#",
      icon: History,
    },
    {
      title: "About",
      url: "#",
      icon: Info,
    },
    {
      title: "FAQ",
      url: "/faq",
      icon: CircleHelp,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
