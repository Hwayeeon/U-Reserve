"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
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
      icon: SquareTerminal,
    },
    {
      title: "About",
      url: "#",
      icon: SquareTerminal,
    },
    {
      title: "eTicket",
      url: "#",
      icon: Bot,
    },
    {
      title: "Navigation",
      url: "#",
      icon: Bot,
    },
    {
      title: "Calendar",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Academic",
          url: "#",
        },
        {
          title: "Student Activities",
          url: "#",
        },
      ],
    },
    {
      title: "Downloads",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Bulletin",
          url: "#",
        },
        {
          title: "Catalogues",
          url: "#",
        },
        {
          title: "Scholarship Forms",
          url: "#",
        },
        {
          title: "Booklet",
          url: "#",
        },
      ],
    },
    {
      title: "Ruang Prestasi",
      url: "#",
      icon: SquareTerminal,
      items: [
        {
          title: "Lomba",
        },
      ],
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
