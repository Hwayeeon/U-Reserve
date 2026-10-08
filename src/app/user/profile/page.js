"use client";

import {
	CalendarCheck,
	CalendarClock,
	Check,
	Copy,
	DoorOpen,
	GraduationCap,
	Hourglass,
	IdCard,
	LogOut,
	Mail,
	MapPin,
	Plus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { getCookies } from "@/lib/cookies";
import { getUserHistoryReservationData } from "@/lib/database";
import { campusNow } from "@/lib/roomStatus";
import { cn } from "@/lib/utils";

const RESERVATION_STATUS = {
	Accepted:
		"bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
	Pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
	Rejected: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
	Cancelled: "bg-muted text-muted-foreground",
};

function initials(name = "") {
	const parts = name.trim().split(/\s+/).filter(Boolean);
	return (
		parts
			.slice(0, 2)
			.map((part) => part[0].toUpperCase())
			.join("") || "?"
	);
}

function parseDay(dateKey) {
	const [year, month, day] = dateKey.split("-").map(Number);
	return new Date(year, month - 1, day);
}

function startOf(schedule = "") {
	return schedule.split("-")[0].trim();
}

function StatusPill({ status }) {
	return (
		<span
			className={cn(
				"inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium",
				RESERVATION_STATUS[status] ?? RESERVATION_STATUS.Cancelled,
			)}
		>
			{status}
		</span>
	);
}

function StatCard({ icon: Icon, label, value, hint, accent, loading }) {
	return (
		<Card className="gap-0 py-4">
			<CardContent className="flex items-start gap-3 px-4">
				<span className={cn("rounded-lg p-2", accent)}>
					<Icon className="size-4" />
				</span>
				<div className="min-w-0">
					<p className="text-xs text-muted-foreground">{label}</p>
					{loading ? (
						<div className="mt-1 h-7 w-12 animate-pulse rounded bg-muted" />
					) : (
						<p className="truncate text-2xl font-semibold tabular-nums">
							{value}
						</p>
					)}
					{hint && !loading && (
						<p className="truncate text-xs text-muted-foreground">{hint}</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

function DetailRow({ icon: Icon, label, value, copyable }) {
	const [copied, setCopied] = useState(false);
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {
			// Clipboard can be blocked (insecure context, permissions); nothing to do.
		}
	};

	return (
		<div className="flex items-center gap-3 py-2.5">
			<Icon className="size-4 shrink-0 text-muted-foreground" />
			<div className="min-w-0 flex-1">
				<dt className="text-xs text-muted-foreground">{label}</dt>
				<dd className="truncate text-sm font-medium" title={value}>
					{value || "—"}
				</dd>
			</div>
			{copyable && value && (
				<Button
					variant="ghost"
					size="icon"
					className="size-8 text-muted-foreground"
					onClick={copy}
					aria-label={`Copy ${label}`}
				>
					{copied ? <Check className="text-emerald-600" /> : <Copy />}
				</Button>
			)}
		</div>
	);
}

function UpcomingItem({ reservation }) {
	const day = parseDay(reservation.for_date);
	return (
		<li className="flex items-center gap-3 rounded-lg border p-3">
			<div className="flex w-12 shrink-0 flex-col items-center rounded-md bg-muted py-1.5">
				<span className="text-[10px] font-medium uppercase text-muted-foreground">
					{day.toLocaleDateString("en-GB", { month: "short" })}
				</span>
				<span className="text-lg leading-none font-semibold tabular-nums">
					{day.getDate()}
				</span>
			</div>
			<div className="min-w-0 flex-1">
				<p className="flex items-center gap-1.5 truncate text-sm font-medium">
					<DoorOpen className="size-3.5 shrink-0 text-muted-foreground" />
					{reservation.room_name}
				</p>
				<p className="truncate text-xs text-muted-foreground">
					{day.toLocaleDateString("en-GB", { weekday: "long" })} ·{" "}
					{reservation.schedule}
				</p>
				{reservation.reason && (
					<p className="truncate text-xs text-muted-foreground">
						{reservation.reason}
					</p>
				)}
			</div>
			<StatusPill status={reservation.status} />
		</li>
	);
}

export default function ProfilePage() {
	// The user cookie is only readable in the browser.
	const [user, setUser] = useState(null);
	const [history, setHistory] = useState(null);

	useEffect(() => {
		const current = getCookies("user");
		setUser(current);
		getUserHistoryReservationData({ userId: current?.user_id }).then((rows) =>
			setHistory(rows ?? []),
		);
	}, []);

	const stats = useMemo(() => {
		if (!history) return null;
		const today = campusNow().date;
		const upcoming = history
			.filter(
				(row) =>
					row.for_date >= today &&
					(row.status === "Accepted" || row.status === "Pending"),
			)
			.sort(
				(a, b) =>
					a.for_date.localeCompare(b.for_date) ||
					startOf(a.schedule).localeCompare(startOf(b.schedule)),
			);

		const roomCounts = new Map();
		for (const row of history) {
			if (row.status !== "Accepted") continue;
			roomCounts.set(row.room_name, (roomCounts.get(row.room_name) ?? 0) + 1);
		}
		const [favoriteRoom, favoriteCount] = [...roomCounts].sort(
			(a, b) => b[1] - a[1],
		)[0] ?? [null, 0];

		return {
			total: history.length,
			accepted: history.filter((row) => row.status === "Accepted").length,
			pending: history.filter((row) => row.status === "Pending").length,
			upcoming,
			favoriteRoom,
			favoriteCount,
		};
	}, [history]);

	const loading = !stats;

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="/user">U-Reserve</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Profile</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>

				<main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 pt-0 md:p-6 md:pt-0">
					{/* Identity */}
					<Card className="gap-0 overflow-hidden py-0">
						<div className="h-24 bg-gradient-to-r from-sky-500/20 via-emerald-500/15 to-violet-500/20 sm:h-28" />
						<CardContent className="flex flex-col gap-4 px-4 pb-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
							<div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:text-left">
								<Avatar className="-mt-12 size-24 ring-4 ring-background sm:-mt-14 sm:size-28">
									<AvatarImage src={user?.avatar} alt={user?.username ?? ""} />
									<AvatarFallback className="text-2xl font-semibold">
										{initials(user?.username)}
									</AvatarFallback>
								</Avatar>
								<div className="min-w-0 pb-1">
									{user ? (
										<h1 className="truncate text-2xl font-bold tracking-tight">
											{user.username}
										</h1>
									) : (
										<div className="h-8 w-48 animate-pulse rounded bg-muted" />
									)}
									<div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground sm:justify-start">
										{user?.prodi && <span>{user.prodi}</span>}
										{user?.role && (
											<span className="rounded-full border px-2 py-0.5 text-xs font-medium capitalize">
												{user.role}
											</span>
										)}
									</div>
								</div>
							</div>
							<div className="flex gap-2">
								<Button asChild className="flex-1 sm:flex-none">
									<Link href="/user">
										<Plus />
										Reserve a room
									</Link>
								</Button>
								<Button
									asChild
									variant="outline"
									className="flex-1 sm:flex-none"
								>
									<Link href="/user/history">View history</Link>
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* At a glance */}
					<section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
						<StatCard
							icon={CalendarCheck}
							label="Reservations"
							value={stats?.total}
							hint={stats && `${stats.accepted} accepted`}
							accent="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
							loading={loading}
						/>
						<StatCard
							icon={CalendarClock}
							label="Upcoming"
							value={stats?.upcoming.length}
							hint={
								stats?.upcoming[0] &&
								`Next on ${parseDay(stats.upcoming[0].for_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
							}
							accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
							loading={loading}
						/>
						<StatCard
							icon={Hourglass}
							label="Awaiting approval"
							value={stats?.pending}
							accent="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
							loading={loading}
						/>
						<StatCard
							icon={MapPin}
							label="Most booked room"
							value={stats?.favoriteRoom ?? "—"}
							hint={
								stats?.favoriteRoom &&
								`${stats.favoriteCount} ${stats.favoriteCount === 1 ? "time" : "times"}`
							}
							accent="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
							loading={loading}
						/>
					</section>

					<div className="grid gap-6 lg:grid-cols-3">
						{/* Upcoming reservations */}
						<Card className="lg:col-span-2">
							<CardHeader>
								<CardTitle>Upcoming reservations</CardTitle>
								<CardDescription>
									Approved and pending bookings from today onward.
								</CardDescription>
							</CardHeader>
							<CardContent>
								{loading ? (
									<div className="flex flex-col gap-2">
										{[0, 1, 2].map((i) => (
											<div
												key={i}
												className="h-16 animate-pulse rounded-lg bg-muted"
											/>
										))}
									</div>
								) : stats.upcoming.length === 0 ? (
									<div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-4 py-10 text-center">
										<CalendarClock className="size-6 text-muted-foreground" />
										<div>
											<p className="text-sm font-medium">Nothing booked yet</p>
											<p className="text-xs text-muted-foreground">
												Find a free room on the floor map and reserve a slot.
											</p>
										</div>
										<Button asChild size="sm">
											<Link href="/user">Reserve a room</Link>
										</Button>
									</div>
								) : (
									<ul className="flex flex-col gap-2">
										{stats.upcoming.slice(0, 5).map((reservation) => (
											<UpcomingItem
												key={reservation.history_id}
												reservation={reservation}
											/>
										))}
										{stats.upcoming.length > 5 && (
											<li>
												<Button asChild variant="link" className="h-auto px-0">
													<Link href="/user/history">
														See all {stats.upcoming.length} upcoming
													</Link>
												</Button>
											</li>
										)}
									</ul>
								)}
							</CardContent>
						</Card>

						{/* Account */}
						<Card>
							<CardHeader>
								<CardTitle>Account</CardTitle>
								<CardDescription>
									From your campus account. Contact an admin to change it.
								</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-col gap-4">
								<dl className="divide-y">
									<DetailRow
										icon={IdCard}
										label="NIM"
										value={user?.user_id}
										copyable
									/>
									<DetailRow
										icon={Mail}
										label="Email"
										value={user?.email}
										copyable
									/>
									<DetailRow
										icon={GraduationCap}
										label="Study program"
										value={user?.prodi}
									/>
								</dl>
								<form action="/auth/signout" method="post">
									<Button
										type="submit"
										variant="outline"
										className="w-full text-rose-600 hover:text-rose-700 dark:text-rose-400"
									>
										<LogOut />
										Sign out
									</Button>
								</form>
							</CardContent>
						</Card>
					</div>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
