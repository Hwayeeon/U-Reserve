import { cn } from "@/lib/utils";

const BADGE_STYLES = {
	free: {
		badge:
			"bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
		dot: "bg-emerald-500",
	},
	busy: {
		badge: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
		dot: "bg-rose-500",
	},
	later: {
		badge: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
		dot: "bg-sky-500",
	},
	none: {
		badge: "bg-muted text-muted-foreground",
		dot: "bg-muted-foreground/60",
	},
};

// Pill for a status from getRoomStatus(); a skeleton while it is loading.
export function RoomStatusBadge({ status, className }) {
	if (!status) {
		return (
			<span
				className={cn(
					"h-5 w-16 animate-pulse rounded-full bg-muted",
					className,
				)}
			/>
		);
	}
	const style = BADGE_STYLES[status.state];
	return (
		<span
			className={cn(
				"inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
				style.badge,
				className,
			)}
		>
			<span className={cn("size-1.5 rounded-full", style.dot)} />
			{status.short}
		</span>
	);
}
