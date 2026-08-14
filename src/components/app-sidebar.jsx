"use client";

import {
	Bot,
	CircleHelp,
	GalleryVerticalEnd,
	History,
	House,
	Info,
	UserPen,
} from "lucide-react";
import * as React from "react";

// Buat yang gak paham ini apa? Ini adalah komponen sidebar yang akan menampilkan menu navigasi dan informasi tim.
// Jadi, ketika kita membuka aplikasi, kita akan melihat sidebar ini di sisi kiri layar.
// Sidebar ini akan menampilkan menu navigasi dan informasi tim yang sedang aktif.

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";

import { getCookies } from "@/lib/cookies";

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
			url: "/user/profile",
			icon: UserPen,
		},
		{
			title: "History",
			url: "/user/history",
			icon: History,
		},
		{
			title: "FAQ",
			url: "/user/faq",
			icon: CircleHelp,
		},
		{
			title: "About",
			url: "/user/about",
			icon: Info,
		},
	],
};

export function AppSidebar({ ...props }) {
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
