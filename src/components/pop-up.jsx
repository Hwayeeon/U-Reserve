"use client";

import { CalendarDays, Check, Clock, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { getCookies } from "@/lib/cookies";
import { getRoomReservationData } from "@/lib/database";
import { campusNow, parseSlots, toTime } from "@/lib/roomStatus";
import { cn } from "@/lib/utils";
import { RoomStatusBadge } from "./room-status-badge";

const HOUR_HEIGHT = 56; // px per hour in the timetable

// Calendar works with local Date objects; the database with YYYY-MM-DD strings.
function toDateKey(date) {
	return [
		date.getFullYear(),
		String(date.getMonth() + 1).padStart(2, "0"),
		String(date.getDate()).padStart(2, "0"),
	].join("-");
}

function fromDateKey(key) {
	const [year, month, day] = key.split("-").map(Number);
	return new Date(year, month - 1, day);
}

function formatDay(date) {
	return date.toLocaleDateString("en-GB", {
		weekday: "long",
		day: "numeric",
		month: "long",
	});
}

// One day of slots on an hour grid, with a "now" line when viewing today.
function DayTimetable({ slots, loading, nowMinutes, selected, onSelect }) {
	const scrollRef = useRef(null);
	const parsed = useMemo(() => parseSlots(slots), [slots]);

	const firstHour = parsed.length ? Math.floor(parsed[0].start / 60) : 7;
	const lastHour = parsed.length
		? Math.ceil(Math.max(...parsed.map((slot) => slot.end)) / 60)
		: 17;
	const hours = Array.from(
		{ length: lastHour - firstHour + 1 },
		(_, i) => firstHour + i,
	);
	const toY = (minutes) => ((minutes - firstHour * 60) / 60) * HOUR_HEIGHT;
	const showNow =
		nowMinutes != null &&
		nowMinutes >= firstHour * 60 &&
		nowMinutes <= lastHour * 60;

	// Start scrolled near the current time (or the first free slot).
	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll once per loaded day
	useEffect(() => {
		const target =
			nowMinutes ?? parsed.find((slot) => slot.free)?.start ?? null;
		if (scrollRef.current && target != null) {
			scrollRef.current.scrollTop = Math.max(toY(target) - HOUR_HEIGHT, 0);
		}
	}, [parsed]);

	if (loading) {
		return (
			<div className="flex flex-col gap-2">
				{[0, 1, 2, 3].map((i) => (
					<div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
				))}
			</div>
		);
	}

	if (parsed.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-10 text-center">
				<CalendarDays className="size-6 text-muted-foreground" />
				<p className="text-sm font-medium">No schedule for this day</p>
				<p className="text-xs text-muted-foreground">
					This room has no bookable slots yet. Try another date.
				</p>
			</div>
		);
	}

	return (
		<div
			ref={scrollRef}
			className="relative -mr-2 pt-2 pr-2 md:max-h-[26rem] md:overflow-y-auto"
		>
			<div
				className="relative"
				style={{ height: (lastHour - firstHour) * HOUR_HEIGHT + 12 }}
			>
				{hours.map((hour) => (
					<div
						key={hour}
						className="absolute inset-x-0 flex items-start gap-2"
						style={{ top: toY(hour * 60) }}
					>
						<span className="-mt-2 w-11 shrink-0 text-right text-[11px] tabular-nums text-muted-foreground">
							{toTime(hour * 60)}
						</span>
						<span className="mt-px h-px flex-1 bg-border" />
					</div>
				))}

				{parsed.map((slot) => {
					const ended = nowMinutes != null && slot.end <= nowMinutes;
					const bookable = slot.free && !ended;
					const isSelected = selected === slot.schedule;
					const height = toY(slot.end) - toY(slot.start) - 4;
					const compact = height < 44;
					const Icon = !slot.free ? Lock : ended ? Clock : Check;
					const label = !slot.free ? "Reserved" : ended ? "Ended" : "Available";

					return (
						<button
							key={slot.schedule}
							type="button"
							disabled={!bookable}
							onClick={() => onSelect(isSelected ? null : slot.schedule)}
							aria-pressed={isSelected}
							aria-label={`${slot.schedule}, ${label}`}
							className={cn(
								"absolute right-0 left-14 flex gap-x-2 overflow-hidden rounded-lg border px-3 text-left text-sm transition-colors",
								compact ? "items-center" : "flex-col justify-center gap-y-0.5",
								bookable &&
									!isSelected &&
									"border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-100 dark:hover:bg-emerald-900/60",
								isSelected &&
									"border-emerald-700 bg-emerald-600 text-white shadow-md ring-2 ring-emerald-600/30 dark:bg-emerald-600",
								!slot.free &&
									"cursor-not-allowed border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200",
								slot.free &&
									ended &&
									"cursor-not-allowed border-border bg-muted/60 text-muted-foreground",
							)}
							style={{ top: toY(slot.start) + 2, height }}
						>
							<span className="font-semibold tabular-nums">
								{slot.schedule}
							</span>
							<span
								className={cn(
									"flex items-center gap-1 text-xs",
									!isSelected && "opacity-80",
								)}
							>
								<Icon className="size-3.5" />
								{isSelected ? "Selected" : label}
							</span>
						</button>
					);
				})}

				{showNow && (
					<div
						className="pointer-events-none absolute right-0 left-12 flex items-center"
						style={{ top: toY(nowMinutes) }}
					>
						<span className="-ml-1 size-2 rounded-full bg-red-500" />
						<span className="h-0.5 flex-1 bg-red-500" />
						<span className="ml-1 rounded bg-red-500 px-1 text-[10px] font-medium tabular-nums text-white">
							{toTime(nowMinutes)}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}

export function PopUp({ floor, roomName, subtitle, status, onClose }) {
	const [today] = useState(() => campusNow());
	const [date, setDate] = useState(() => fromDateKey(today.date));
	const [slots, setSlots] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState(null);
	const [nowMinutes, setNowMinutes] = useState(today.minutes);

	const dateKey = toDateKey(date);
	const isToday = dateKey === today.date;

	useEffect(() => {
		let ignore = false;
		setLoading(true);
		setSelected(null);
		getRoomReservationData({ roomName, date: dateKey }).then((rows) => {
			if (ignore) return;
			setSlots(rows);
			setLoading(false);
		});
		return () => {
			ignore = true;
		};
	}, [roomName, dateKey]);

	// Keep the "now" line and ended slots current while the dialog is open.
	useEffect(() => {
		const interval = setInterval(
			() => setNowMinutes(campusNow().minutes),
			30_000,
		);
		return () => clearInterval(interval);
	}, []);

	const parsed = useMemo(() => parseSlots(slots), [slots]);
	const freeCount = parsed.filter(
		(slot) => slot.free && !(isToday && slot.end <= nowMinutes),
	).length;

	const user = getCookies("user");
	const reserveHref = selected && {
		pathname: "/user/form/",
		query: {
			floor,
			roomName,
			timeSlot: selected,
			date: dateKey,
			username: user?.username || "",
		},
	};

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="flex max-h-[92svh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
				<DialogHeader className="border-b px-5 py-4 pr-12 text-left">
					<div className="flex flex-wrap items-center gap-2">
						<DialogTitle className="text-xl">{roomName}</DialogTitle>
						{status && <RoomStatusBadge status={status} />}
					</div>
					<DialogDescription>
						{subtitle ?? floor}
						{status && ` · ${status.label}`}
					</DialogDescription>
				</DialogHeader>

				<div className="grid min-h-0 flex-1 gap-5 overflow-y-auto p-5 md:grid-cols-[auto_1fr] md:gap-6">
					<div className="flex flex-col items-center gap-3 md:items-start">
						<Calendar
							mode="single"
							required
							selected={date}
							defaultMonth={date}
							onSelect={(day) => day && setDate(day)}
							disabled={{ before: fromDateKey(today.date) }}
							className="rounded-lg border [--cell-size:--spacing(9)]"
						/>
						{!isToday && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setDate(fromDateKey(today.date))}
							>
								Back to today
							</Button>
						)}
					</div>

					<section className="flex min-w-0 flex-col gap-3">
						<div className="flex items-baseline justify-between gap-2">
							<h3 className="font-semibold">
								{isToday ? "Today" : formatDay(date)}
								{isToday && (
									<span className="ml-1.5 font-normal text-muted-foreground">
										{formatDay(date)}
									</span>
								)}
							</h3>
							{!loading && parsed.length > 0 && (
								<span className="shrink-0 text-xs text-muted-foreground">
									{freeCount} of {parsed.length} free
								</span>
							)}
						</div>
						<DayTimetable
							slots={slots}
							loading={loading}
							nowMinutes={isToday ? nowMinutes : null}
							selected={selected}
							onSelect={setSelected}
						/>
					</section>
				</div>

				<div className="flex flex-col gap-3 border-t bg-muted/30 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-sm text-muted-foreground">
						{selected ? (
							<>
								<span className="font-medium text-foreground">{selected}</span>
								{" · "}
								{formatDay(date)}
							</>
						) : (
							"Pick a free slot to reserve it."
						)}
					</p>
					{reserveHref ? (
						<Button asChild>
							<Link href={reserveHref}>Reserve this slot</Link>
						</Button>
					) : (
						<Button disabled>Reserve this slot</Button>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
