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

const data = {
  user: {
    email: "triemas.putra@gmail.com",
    name: "Raiden Shogun",
    avatar: "https://cdn.rafled.com/anime-icons/images/u05vyKyGsL73WKPM1iFIkoW7tQ05Ghk8.jpg",
  },
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
