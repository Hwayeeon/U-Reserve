"use client";

import {
	Briefcase,
	HeartHandshake,
	RefreshCw,
	Toilet,
	UtensilsCrossed,
} from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { getFloorScheduleData } from "@/lib/database";
import { doorSwingPath, parseFloor, wallPath } from "@/lib/floorPlan";
import { campusNow, getRoomStatus, groupByRoom } from "@/lib/roomStatus";
import { cn } from "@/lib/utils";
import { PopUp } from "./pop-up";
import { RoomStatusBadge } from "./room-status-badge";

const STATUS_REFRESH_MS = 60_000;
const CLOCK_TICK_MS = 30_000;
// Floors taller than this (height / width) are turned sideways on wider screens.
const ROTATE_ABOVE = 1.3;
// Landscape floors this wide get the room list below the map instead of beside it.
const STACK_ABOVE = 1.4;

// Visual style per shape type in path.json. Unknown types fall back to `room`.
// `fill` goes on the room's floor, `wall` on its outline.
const TYPE_STYLES = {
	classroom: {
		label: "Classroom",
		fill: "fill-sky-50 dark:fill-sky-950/70",
		wall: "stroke-sky-600/80 dark:stroke-sky-400/80",
		swatch: "bg-sky-50 border-sky-600/80 dark:bg-sky-950/70",
	},
	"counseling room": {
		label: "Counseling room",
		fill: "fill-sky-50 dark:fill-sky-950/70",
		wall: "stroke-sky-600/80 dark:stroke-sky-400/80",
		swatch: "bg-sky-50 border-sky-600/80 dark:bg-sky-950/70",
	},
	room: {
		label: "Facility",
		fill: "fill-muted",
		wall: "stroke-muted-foreground/45",
		swatch: "bg-muted border-muted-foreground/45",
	},
	stair: {
		label: "Stairs",
		fill: "fill-amber-50 dark:fill-amber-950/40",
		wall: "stroke-amber-600/70 dark:stroke-amber-500/70",
		swatch: "bg-amber-50 border-amber-600/70 dark:bg-amber-950/40",
	},
	lift: {
		label: "Lift",
		fill: "fill-violet-50 dark:fill-violet-950/50",
		wall: "stroke-violet-600/70 dark:stroke-violet-400/70",
		swatch: "bg-violet-50 border-violet-600/70 dark:bg-violet-950/50",
	},
	Junction: {
		label: "Junction",
		fill: "fill-background/70",
		wall: "stroke-muted-foreground/40",
		swatch: "bg-background border-muted-foreground/40 border-dashed",
	},
};

// Reservable rooms are colored by their live status instead of their type.
const STATUS_STYLES = {
	free: {
		label: "Free now",
		fill: "fill-emerald-50 dark:fill-emerald-950/60",
		wall: "stroke-emerald-600/80 dark:stroke-emerald-400/80",
		dot: "fill-emerald-500",
		swatch: "bg-emerald-50 border-emerald-600/80 dark:bg-emerald-950/60",
	},
	busy: {
		label: "In use",
		fill: "fill-rose-50 dark:fill-rose-950/50",
		wall: "stroke-rose-500/70 dark:stroke-rose-400/70",
		dot: "fill-rose-500",
		swatch: "bg-rose-50 border-rose-500/70 dark:bg-rose-950/50",
	},
	later: {
		label: "Free later",
		fill: "fill-sky-50 dark:fill-sky-950/70",
		wall: "stroke-sky-600/80 dark:stroke-sky-400/80",
		dot: "fill-sky-500",
		swatch: "bg-sky-50 border-sky-600/80 dark:bg-sky-950/70",
	},
	none: {
		label: "Unavailable today",
		fill: "fill-muted/70",
		wall: "stroke-muted-foreground/50",
		dot: "fill-muted-foreground/60",
		swatch: "bg-muted border-muted-foreground/50",
	},
};

const HOVER_FILL =
	"group-hover:fill-sky-200 group-focus-visible:fill-sky-200 dark:group-hover:fill-sky-900 dark:group-focus-visible:fill-sky-900";
const HOVER_WALL =
	"group-hover:stroke-sky-700 group-focus-visible:stroke-sky-700 group-focus-visible:stroke-[2.5] dark:group-hover:stroke-sky-300";
const HIGHLIGHT_FILL = "fill-sky-200 dark:fill-sky-900";
const HIGHLIGHT_WALL = "stroke-sky-700 dark:stroke-sky-300";
const SELECTED_FILL = "fill-sky-500 dark:fill-sky-600";
const SELECTED_WALL = "stroke-sky-800 stroke-[2.5] dark:stroke-sky-200";

function styleOf(type) {
	return TYPE_STYLES[type] ?? TYPE_STYLES.room;
}

function iconFor(shape) {
	if (shape.type === "counseling room") return HeartHandshake;
	if (/toilet/i.test(shape.name ?? "")) return Toilet;
	if (/kantin|canteen/i.test(shape.name ?? "")) return UtensilsCrossed;
	if (/staff/i.test(shape.name ?? "")) return Briefcase;
	return null;
}

// Steps across the short side and an arrow up the long side.
function StairSymbol({ rect, unit }) {
	const horizontal = rect.w >= rect.h;
	const long = horizontal ? rect.w : rect.h;
	const pad = 10 * unit;
	const step = Math.max(14 * unit, (long - 2 * pad) / 14);
	const steps = [];
	for (let t = pad + step; t < long - pad; t += step) steps.push(t);

	const along = (t, s) =>
		horizontal ? [rect.x + t, rect.y + s] : [rect.x + s, rect.y + rect.h - t];
	const short = horizontal ? rect.h : rect.w;
	const [ax, ay] = along(pad + step / 2, short / 2);
	const [bx, by] = along(long - pad - step / 2, short / 2);
	const head = 12 * unit;
	const [hx1, hy1] = along(long - pad - step / 2 - head, short / 2 - head);
	const [hx2, hy2] = along(long - pad - step / 2 - head, short / 2 + head);

	return (
		<g
			className="pointer-events-none fill-none stroke-amber-700/45 dark:stroke-amber-400/45"
			strokeWidth={1}
			vectorEffect="non-scaling-stroke"
		>
			{steps.map((t) => {
				const [x1, y1] = along(t, pad);
				const [x2, y2] = along(t, short - pad);
				return (
					<line
						key={t}
						x1={x1}
						y1={y1}
						x2={x2}
						y2={y2}
						vectorEffect="non-scaling-stroke"
					/>
				);
			})}
			<path
				d={`M${ax} ${ay} L${bx} ${by} M${hx1} ${hy1} L${bx} ${by} L${hx2} ${hy2}`}
				className="stroke-amber-700/80 dark:stroke-amber-300/80"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
				vectorEffect="non-scaling-stroke"
			/>
		</g>
	);
}

// Up/down triangles, like a lift call button.
function LiftSymbol({ rect }) {
	const cx = rect.x + rect.w / 2;
	const cy = rect.y + rect.h / 2;
	const s = Math.min(rect.w, rect.h) * 0.16;
	const gap = s * 0.35;
	return (
		<g className="pointer-events-none fill-violet-500/70 dark:fill-violet-300/70">
			<path
				d={`M${cx} ${cy - gap - s} L${cx + s} ${cy - gap} L${cx - s} ${cy - gap}Z`}
			/>
			<path
				d={`M${cx} ${cy + gap + s} L${cx + s} ${cy + gap} L${cx - s} ${cy + gap}Z`}
			/>
		</g>
	);
}

// Icon (optional) above centered text lines and an optional smaller status
// line, all shrunk to fit the room.
function RoomLabel({ shape, base, selected, status }) {
	const box = shape.rect ?? shape.bbox;
	const Icon = iconFor(shape);
	const lines = shape.labelLines;
	if (!Icon && lines.length === 0) return null;

	const sub = status?.short;
	const pad = base * 0.6;
	const longest = Math.max(
		1,
		...lines.map((line) => line.length),
		sub ? sub.length * 0.8 : 0,
	);
	const fontSize = Math.min(
		base,
		(box.w - 2 * pad) / (longest * 0.6),
		(box.h - 2 * pad) /
			(lines.length * 1.25 + (Icon ? 1.8 : 0) + (sub ? 1.1 : 0)),
	);
	if (fontSize <= 0) return null;

	const iconSize = Icon ? fontSize * 1.6 : 0;
	const iconGap = Icon && lines.length ? fontSize * 0.4 : 0;
	const lineHeight = fontSize * 1.25;
	const subHeight = sub ? fontSize * 1.1 : 0;
	const blockHeight =
		iconSize + iconGap + lines.length * lineHeight + subHeight;
	const cx = box.x + box.w / 2;
	const top = box.y + box.h / 2 - blockHeight / 2;
	const isFacility = !shape.clickable;

	return (
		<g className="pointer-events-none select-none">
			{Icon && (
				<Icon
					x={cx - iconSize / 2}
					y={top}
					width={iconSize}
					height={iconSize}
					className={cn("text-muted-foreground", selected && "text-white")}
				/>
			)}
			{lines.map((line, index) => (
				<text
					// biome-ignore lint/suspicious/noArrayIndexKey: static label lines; the same word can repeat
					key={`${index}-${line}`}
					x={cx}
					y={top + iconSize + iconGap + lineHeight * index + lineHeight / 2}
					fontSize={fontSize}
					fontWeight={isFacility ? 500 : 600}
					textAnchor="middle"
					dominantBaseline="central"
					className={cn(
						isFacility ? "fill-muted-foreground" : "fill-foreground",
						selected && "fill-white",
					)}
				>
					{line}
				</text>
			))}
			{sub && (
				<text
					x={cx}
					y={top + blockHeight - subHeight / 2}
					fontSize={fontSize * 0.8}
					fontWeight={500}
					textAnchor="middle"
					dominantBaseline="central"
					className={cn(
						"fill-muted-foreground",
						status.state === "free" && "fill-emerald-700 dark:fill-emerald-400",
						status.state === "busy" && "fill-rose-700 dark:fill-rose-400",
						selected && "fill-white/90",
					)}
				>
					{sub}
				</text>
			)}
		</g>
	);
}

// Small dot in the room's corner; free rooms get a soft pulsing halo.
function StatusDot({ rect, size, status }) {
	const r = size * 0.32;
	const cx = rect.x + rect.w - r * 2.4;
	const cy = rect.y + r * 2.4;
	return (
		<g className="pointer-events-none">
			{status.state === "free" && (
				<circle
					cx={cx}
					cy={cy}
					r={r * 2}
					className="animate-pulse fill-emerald-500/25"
				/>
			)}
			<circle
				cx={cx}
				cy={cy}
				r={r}
				className={STATUS_STYLES[status.state].dot}
			/>
		</g>
	);
}

function Room({
	shape,
	sizes,
	hatchId,
	status,
	selected,
	highlighted,
	onSelect,
	onHover,
}) {
	const style = (status && STATUS_STYLES[status.state]) ?? styleOf(shape.type);
	const interactive = shape.clickable;
	const dashed =
		shape.type === "Junction"
			? `${8 * sizes.unit} ${6 * sizes.unit}`
			: undefined;
	const fillClass = cn(
		"transition-colors duration-150",
		style.fill,
		interactive && HOVER_FILL,
		highlighted && HIGHLIGHT_FILL,
		selected && SELECTED_FILL,
	);
	const wallClass = cn(
		"transition-colors duration-150",
		style.wall,
		interactive && HOVER_WALL,
		highlighted && HIGHLIGHT_WALL,
		selected && SELECTED_WALL,
	);

	const body = shape.rect ? (
		<>
			<rect
				x={shape.rect.x}
				y={shape.rect.y}
				width={shape.rect.w}
				height={shape.rect.h}
				rx={sizes.radius}
				className={fillClass}
			/>
			{shape.type === "room" && !shape.name && (
				<rect
					x={shape.rect.x}
					y={shape.rect.y}
					width={shape.rect.w}
					height={shape.rect.h}
					rx={sizes.radius}
					fill={`url(#${hatchId})`}
				/>
			)}
			<path
				d={wallPath(shape.rect, sizes.radius, shape.door)}
				className={cn("fill-none", wallClass)}
				strokeWidth={1.5}
				strokeDasharray={dashed}
				vectorEffect="non-scaling-stroke"
			/>
			{shape.door && (
				<path
					d={doorSwingPath(shape.rect, shape.door)}
					className={cn(
						"fill-none opacity-50",
						style.wall,
						selected && "stroke-white",
					)}
					strokeWidth={1}
					strokeDasharray={`${3 * sizes.unit} ${3 * sizes.unit}`}
					vectorEffect="non-scaling-stroke"
				/>
			)}
			{shape.type === "stair" && (
				<StairSymbol rect={shape.rect} unit={sizes.unit} />
			)}
			{shape.type === "lift" && <LiftSymbol rect={shape.rect} />}
			{status && !selected && (
				<StatusDot rect={shape.rect} size={sizes.fontSize} status={status} />
			)}
		</>
	) : (
		<path
			d={shape.path}
			className={cn(fillClass, wallClass)}
			strokeWidth={1.5}
			strokeDasharray={dashed}
			vectorEffect="non-scaling-stroke"
		/>
	);

	const label = (
		<RoomLabel
			shape={shape}
			base={sizes.fontSize}
			selected={selected}
			status={status}
		/>
	);

	if (!interactive) {
		return (
			<g>
				{shape.name && <title>{shape.name}</title>}
				{body}
				{label}
			</g>
		);
	}

	const description = status ? `${shape.name}, ${status.label}` : shape.name;
	return (
		// biome-ignore lint/a11y/useSemanticElements: SVG content cannot contain a <button>; role + keyboard handling make this group one
		<g
			role="button"
			tabIndex={0}
			aria-label={`${description}. View reservations`}
			aria-pressed={selected}
			className="group cursor-pointer outline-none"
			onClick={() => onSelect(shape.name)}
			onMouseEnter={() => onHover(shape.name)}
			onMouseLeave={() => onHover(null)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onSelect(shape.name);
				}
			}}
		>
			<title>{description}</title>
			{body}
			{label}
		</g>
	);
}

// Room list with live status (synced with the map) and what else is on the floor.
function FloorDetails({
	floorName,
	shapes,
	rooms,
	statuses,
	updatedAt,
	refreshing,
	onRefresh,
	stacked,
	selectedRoom,
	hoveredRoom,
	onSelect,
	onHover,
}) {
	const [freeOnly, setFreeOnly] = useState(false);

	const counts = useMemo(() => {
		const result = { free: 0, busy: 0 };
		for (const room of rooms) {
			const state = statuses?.get(room.name)?.state;
			if (state in result) result[state] += 1;
		}
		return result;
	}, [rooms, statuses]);

	const facilities = useMemo(() => {
		const tally = new Map();
		for (const shape of shapes) {
			if (shape.clickable) continue;
			const style = styleOf(shape.type);
			tally.set(style, (tally.get(style) ?? 0) + 1);
		}
		return [...tally];
	}, [shapes]);

	const visible = freeOnly
		? rooms.filter((room) => statuses?.get(room.name)?.state === "free")
		: rooms;

	return (
		<aside
			className={cn(
				"rounded-xl border bg-card shadow-sm",
				// Beside the map the panel takes the map's height and scrolls inside.
				!stacked && "xl:relative xl:min-h-[420px] xl:w-80 xl:shrink-0",
			)}
		>
			<div
				className={cn(
					"flex min-h-0 flex-col gap-4 p-4",
					!stacked && "xl:absolute xl:inset-0",
				)}
			>
				<div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
					<div>
						<h2 className="font-semibold">
							{floorName.replace(/^Floor\s*/i, "Floor ")}
						</h2>
						<p className="text-sm text-muted-foreground">
							{statuses ? (
								<>
									<span className="font-medium text-emerald-700 dark:text-emerald-400">
										{counts.free} free now
									</span>
									{" · "}
									<span className="font-medium text-rose-700 dark:text-rose-400">
										{counts.busy} in use
									</span>
									{" · "}
									{rooms.length} total
								</>
							) : (
								"Checking room status…"
							)}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<div className="flex rounded-md bg-muted p-0.5 text-xs font-medium">
							{[
								[false, "All rooms"],
								[true, "Free now"],
							].map(([value, text]) => (
								<button
									key={text}
									type="button"
									onClick={() => setFreeOnly(value)}
									aria-pressed={freeOnly === value}
									className={cn(
										"rounded px-2.5 py-1 transition-colors",
										freeOnly === value
											? "bg-background text-foreground shadow-sm"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									{text}
								</button>
							))}
						</div>
						<button
							type="button"
							onClick={onRefresh}
							aria-label="Refresh room status"
							title={updatedAt ? `Updated ${updatedAt}` : "Refresh room status"}
							className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
						>
							<RefreshCw
								className={cn("size-4", refreshing && "animate-spin")}
							/>
						</button>
					</div>
				</div>

				<ul
					className={cn(
						"-mx-1 grid content-start gap-1.5 px-1 sm:grid-cols-2",
						stacked
							? "lg:grid-cols-3 xl:grid-cols-4"
							: "lg:grid-cols-3 xl:min-h-0 xl:flex-1 xl:grid-cols-1 xl:overflow-y-auto",
					)}
				>
					{visible.map((room) => {
						const status = statuses?.get(room.name);
						const active = room.name === selectedRoom;
						return (
							<li key={room.name}>
								<button
									type="button"
									onClick={() => onSelect(room.name)}
									onMouseEnter={() => onHover(room.name)}
									onMouseLeave={() => onHover(null)}
									onFocus={() => onHover(room.name)}
									onBlur={() => onHover(null)}
									aria-pressed={active}
									className={cn(
										"flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors",
										active
											? "border-sky-500 bg-sky-50 dark:bg-sky-950/60"
											: room.name === hoveredRoom
												? "bg-accent"
												: "border-transparent bg-muted/40 hover:bg-accent",
									)}
								>
									<span className="min-w-0 flex-1">
										<span className="block truncate text-sm font-medium">
											{room.name}
										</span>
										<span className="block truncate text-xs text-muted-foreground">
											{status ? status.label : styleOf(room.type).label}
										</span>
									</span>
									<RoomStatusBadge status={status} />
								</button>
							</li>
						);
					})}
					{visible.length === 0 && (
						<li className="col-span-full rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
							No rooms are free on this floor right now.
						</li>
					)}
				</ul>

				<div className="mt-auto flex flex-wrap gap-x-4 gap-y-1.5 border-t pt-3 text-xs text-muted-foreground">
					{["free", "busy", "later", "none"].map((state) => (
						<span key={state} className="flex items-center gap-1.5">
							<span
								className={cn(
									"size-3 rounded-sm border",
									STATUS_STYLES[state].swatch,
								)}
							/>
							{STATUS_STYLES[state].label}
						</span>
					))}
					{facilities.map(([style, count]) => (
						<span key={style.label} className="flex items-center gap-1.5">
							<span className={cn("size-3 rounded-sm border", style.swatch)} />
							{style.label}
							<span className="tabular-nums">×{count}</span>
						</span>
					))}
				</div>
			</div>
		</aside>
	);
}

export function FloorMap({ className, floorObject }) {
	const [selectedRoom, setSelectedRoom] = useState(null);
	const [hoveredRoom, setHoveredRoom] = useState(null);
	const [schedule, setSchedule] = useState(null);
	const [refreshing, setRefreshing] = useState(false);
	const [updatedAt, setUpdatedAt] = useState(null);
	// Set on the client only, so server and browser render the same HTML.
	const [now, setNow] = useState(null);
	const hatchId = `hatch-${useId().replace(/[^\w-]/g, "")}`;
	const isMobile = useIsMobile();

	const { floorImage, floorName } = floorObject;
	const rotate =
		!isMobile && floorImage?.originalY / floorImage?.originalX > ROTATE_ABOVE;
	const { width, height, sizes, shapes, looseLabels, lines } = useMemo(
		() => parseFloor(floorImage, { rotate }),
		[floorImage, rotate],
	);
	const stacked = width / height >= STACK_ABOVE;

	const rooms = useMemo(() => {
		const byName = new Map();
		for (const shape of shapes) {
			if (shape.clickable && !byName.has(shape.name)) {
				byName.set(shape.name, shape);
			}
		}
		return [...byName.values()].sort((a, b) =>
			a.name.localeCompare(b.name, undefined, { numeric: true }),
		);
	}, [shapes]);
	const roomKey = rooms.map((room) => room.name).join("|");

	const statuses = useMemo(() => {
		if (!schedule || !now) return null;
		const byRoom = groupByRoom(schedule);
		return new Map(
			rooms.map((room) => [
				room.name,
				getRoomStatus(byRoom.get(room.name) ?? [], now.minutes),
			]),
		);
	}, [schedule, now, rooms]);

	const loadSchedule = useCallback(async () => {
		const names = roomKey ? roomKey.split("|") : [];
		const today = campusNow();
		setRefreshing(true);
		const rows = await getFloorScheduleData({
			roomNames: names,
			date: today.date,
		});
		setRefreshing(false);
		setNow(campusNow());
		setUpdatedAt(new Date().toLocaleTimeString([], { timeStyle: "short" }));
		return rows;
	}, [roomKey]);

	// Load today's slots for every room on the floor, and keep them fresh.
	useEffect(() => {
		let ignore = false;
		setSchedule(null);
		const load = () =>
			loadSchedule().then((rows) => {
				if (!ignore) setSchedule(rows);
			});
		load();
		const interval = setInterval(load, STATUS_REFRESH_MS);
		return () => {
			ignore = true;
			clearInterval(interval);
		};
	}, [loadSchedule]);

	// Move the clock forward so statuses flip on time between refreshes.
	useEffect(() => {
		setNow(campusNow());
		const interval = setInterval(() => setNow(campusNow()), CLOCK_TICK_MS);
		return () => clearInterval(interval);
	}, []);

	// Close any open room when switching floors
	// biome-ignore lint/correctness/useExhaustiveDependencies: reset only when the floor changes
	useEffect(() => {
		setSelectedRoom(null);
		setHoveredRoom(null);
	}, [floorName]);

	const refresh = () => loadSchedule().then(setSchedule);

	if (!width || !height) return null;

	return (
		<div
			className={cn(
				"flex flex-col gap-4",
				!stacked && "xl:flex-row xl:justify-center",
				className,
			)}
		>
			{/* Sized to the floor's aspect ratio so the map has no empty margins;
			    capped at 70% of the screen height. */}
			<div
				className={cn(
					"relative mx-auto aspect-(--floor-ratio) w-full max-w-[calc(70svh*var(--floor-ratio))] min-w-0 rounded-xl border bg-card p-2 shadow-sm [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] sm:p-3",
					!stacked &&
						"xl:mx-0 xl:w-[min(calc(70svh*var(--floor-ratio)),calc(100%-21rem))] xl:max-w-none xl:self-start",
				)}
				style={{ "--floor-ratio": width / height }}
			>
				<svg
					viewBox={`0 0 ${width} ${height}`}
					preserveAspectRatio="xMidYMid meet"
					className="h-full w-full"
					role="img"
					aria-label={`Floor plan of ${floorName}`}
				>
					<defs>
						<pattern
							id={hatchId}
							width={14 * sizes.unit}
							height={14 * sizes.unit}
							patternUnits="userSpaceOnUse"
							patternTransform="rotate(45)"
						>
							<line
								x1={0}
								y1={0}
								x2={0}
								y2={14 * sizes.unit}
								className="stroke-muted-foreground/20"
								strokeWidth={3 * sizes.unit}
							/>
						</pattern>
					</defs>

					{lines.map((line) => (
						<line
							key={line.key}
							x1={line.x1}
							y1={line.y1}
							x2={line.x2}
							y2={line.y2}
							className="stroke-muted-foreground/50"
							strokeWidth={1.5}
							strokeDasharray={`${8 * sizes.unit} ${8 * sizes.unit}`}
							vectorEffect="non-scaling-stroke"
						/>
					))}

					{shapes.map((shape) => (
						<Room
							key={shape.key}
							shape={shape}
							sizes={sizes}
							hatchId={hatchId}
							status={shape.clickable ? statuses?.get(shape.name) : undefined}
							selected={shape.clickable && shape.name === selectedRoom}
							highlighted={shape.clickable && shape.name === hoveredRoom}
							onSelect={setSelectedRoom}
							onHover={setHoveredRoom}
						/>
					))}

					<g
						className="pointer-events-none select-none fill-muted-foreground"
						fontSize={sizes.fontSize}
						fontWeight={500}
						textAnchor="middle"
						dominantBaseline="central"
					>
						{looseLabels.map((label) => (
							<text key={label.key} x={label.x} y={label.y}>
								{label.text}
							</text>
						))}
					</g>
				</svg>
			</div>

			<FloorDetails
				floorName={floorName}
				shapes={shapes}
				rooms={rooms}
				statuses={statuses}
				updatedAt={updatedAt}
				refreshing={refreshing}
				onRefresh={refresh}
				stacked={stacked}
				selectedRoom={selectedRoom}
				hoveredRoom={hoveredRoom}
				onSelect={setSelectedRoom}
				onHover={setHoveredRoom}
			/>

			{selectedRoom && (
				<PopUp
					floor={floorName}
					roomName={selectedRoom}
					subtitle={`${floorName.replace(/^Floor\s*/i, "Floor ")} · ${
						styleOf(rooms.find((room) => room.name === selectedRoom)?.type)
							.label
					}`}
					status={statuses?.get(selectedRoom)}
					onClose={() => {
						setSelectedRoom(null);
						refresh();
					}}
				/>
			)}
		</div>
	);
}
