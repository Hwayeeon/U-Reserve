"use client"

import * as React from "react"
import {
  Bot,
  GalleryVerticalEnd,
  UserPen,
  CircleHelp,
  Info,
  History,
  House,
} from "lucide-react"

// Buat yang gak paham ini apa? Ini adalah komponen sidebar yang akan menampilkan menu navigasi dan informasi tim.
// Jadi, ketika kita membuka aplikasi, kita akan melihat sidebar ini di sisi kiri layar.
// Sidebar ini akan menampilkan menu navigasi dan informasi tim yang sedang aktif.

import { NavUser } from "@/components/nav-user"
import { NavMain } from "@/components/nav-main"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"

import { getCookies } from "@/lib/cookies"

const data = {
  user: getCookies("user"),
  teams: [
    {
      name: "U-Reserve",
      logo: GalleryVerticalEnd,
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/user",
      icon: House,
    },
    {
      title: "Profile",
      url: "#",
      icon: UserPen,
    },
    {
      title: "History",
      url: "/user/history",
      icon: History,
    },
    {
      title: "About",
      url: "#",
      icon: Info,
    },
    {
      title: "FAQ",
      url: "/user/faq",
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
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
