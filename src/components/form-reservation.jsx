"use client";

import {
	AlertCircle,
	CalendarDays,
	Clock,
	Loader2,
	Lock,
	User,
	Users,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getCookies } from "@/lib/cookies";
import { getRoomReservationData, submitRequest } from "@/lib/database";
import {
	addDays,
	floorLabel,
	MAX_ATTENDEES,
	MAX_DAYS_AHEAD,
	PURPOSE_MAX,
	parseSchedule,
	RESERVABLE_ROOMS,
	validateReservation,
} from "@/lib/reservationRules";
import { campusNow } from "@/lib/roomStatus";
import { cn } from "@/lib/utils";

const FLOORS = [...new Set(RESERVABLE_ROOMS.map((room) => room.floor))];
const ORGANIZATION_SUGGESTIONS = [
	"BEM",
	"DPM",
	"Himpunan Mahasiswa",
	"UKM",
	"Panitia Acara",
];

async function fetchSlots(roomName, date) {
	if (!roomName || !date) return [];
	return (await getRoomReservationData({ roomName, date })) ?? [];
}

function roomsOn(floor) {
	return RESERVABLE_ROOMS.filter((room) => room.floor === floor).sort((a, b) =>
		a.name.localeCompare(b.name, undefined, { numeric: true }),
	);
}

function formatDay(dateKey) {
	const [y, m, d] = dateKey.split("-").map(Number);
	return new Date(y, m - 1, d).toLocaleDateString("en-GB", {
		weekday: "long",
		day: "numeric",
		month: "long",
	});
}

// Label + control + error message, wired up for screen readers.
function Field({ label, error, hint, className, children }) {
	const id = useId();
	const messageId = `${id}-message`;
	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<Label htmlFor={id}>{label}</Label>
			{children({
				id,
				"aria-invalid": Boolean(error) || undefined,
				"aria-describedby": error || hint ? messageId : undefined,
			})}
			{(error || hint) && (
				<p
					id={messageId}
					className={cn(
						"text-xs",
						error ? "text-destructive" : "text-muted-foreground",
					)}
				>
					{error || hint}
				</p>
			)}
		</div>
	);
}

function Section({ step, title, description, children }) {
	return (
		<section className="flex flex-col gap-4">
			<div className="flex items-start gap-3">
				<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
					{step}
				</span>
				<div>
					<h3 className="text-sm font-semibold">{title}</h3>
					{description && (
						<p className="text-xs text-muted-foreground">{description}</p>
					)}
				</div>
			</div>
			<div className="flex flex-col gap-4 sm:pl-9">{children}</div>
		</section>
	);
}

function SlotPicker({ slots, loading, value, onChange, nowMinutes, error }) {
	if (loading) {
		return (
			<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
				{[0, 1, 2, 3, 4, 5].map((i) => (
					<div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
				))}
			</div>
		);
	}
	if (slots.length === 0) {
		return (
			<p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
				No time slots for this room on this day. Try another date.
			</p>
		);
	}
	return (
		<fieldset className="grid grid-cols-2 gap-2 sm:grid-cols-3">
			<legend className="sr-only">Time slot</legend>
			{slots.map((slot) => {
				const time = parseSchedule(slot.schedule);
				const ended = nowMinutes != null && time && time.end <= nowMinutes;
				const bookable = slot.status && !ended;
				const selected = value === slot.schedule;
				return (
					<label
						key={slot.schedule}
						className={cn(
							"flex flex-col items-start rounded-lg border px-3 py-2 text-left text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
							bookable && "cursor-pointer",
							bookable &&
								!selected &&
								"border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/50",
							selected &&
								"border-emerald-700 bg-emerald-600 text-white ring-2 ring-emerald-600/30",
							!bookable &&
								"cursor-not-allowed border-border bg-muted/50 text-muted-foreground",
						)}
					>
						<input
							type="radio"
							name="schedule"
							value={slot.schedule}
							checked={selected}
							disabled={!bookable}
							aria-invalid={(selected && Boolean(error)) || undefined}
							onChange={() => onChange(slot.schedule)}
							className="sr-only"
						/>
						<span
							className={cn(
								"font-medium tabular-nums",
								!slot.status && "line-through",
							)}
						>
							{slot.schedule}
						</span>
						<span className="flex items-center gap-1 text-xs opacity-80">
							{!slot.status ? (
								<>
									<Lock className="size-3" /> Reserved
								</>
							) : ended ? (
								<>
									<Clock className="size-3" /> Ended
								</>
							) : selected ? (
								"Selected"
							) : (
								"Available"
							)}
						</span>
					</label>
				);
			})}
		</fieldset>
	);
}

function BorrowerOption({
	icon: Icon,
	value,
	title,
	description,
	checked,
	onSelect,
}) {
	return (
		<label
			className={cn(
				"flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-left transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
				checked
					? "border-primary bg-primary/5 ring-1 ring-primary"
					: "hover:bg-accent",
			)}
		>
			<input
				type="radio"
				name="borrowerType"
				value={value}
				checked={checked}
				onChange={onSelect}
				className="sr-only"
			/>
			<span
				className={cn(
					"rounded-md p-2",
					checked ? "bg-primary text-primary-foreground" : "bg-muted",
				)}
			>
				<Icon className="size-4" />
			</span>
			<span>
				<span className="block text-sm font-medium">{title}</span>
				<span className="block text-xs text-muted-foreground">
					{description}
				</span>
			</span>
		</label>
	);
}

const RoomReservationForm = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [now] = useState(() => campusNow());
	const [user, setUser] = useState(null);

	const [form, setForm] = useState(() => {
		const roomName = searchParams.get("roomName") || "";
		const room = RESERVABLE_ROOMS.find((r) => r.name === roomName);
		return {
			floor: room?.floor ?? searchParams.get("floor") ?? "",
			roomName,
			date: searchParams.get("date") || now.date,
			schedule: searchParams.get("timeSlot") || "",
			borrowerType: "personal",
			organizationName: "",
			organizationPosition: "",
			attendeeCount: "",
			purpose: "",
		};
	});
	const [slots, setSlots] = useState([]);
	const [slotsLoading, setSlotsLoading] = useState(false);
	const [touched, setTouched] = useState({});
	const [submitAttempted, setSubmitAttempted] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [serverError, setServerError] = useState("");
	const [serverFieldErrors, setServerFieldErrors] = useState({});

	// The user cookie can only be read in the browser.
	useEffect(() => {
		setUser(getCookies("user"));
	}, []);

	useEffect(() => {
		let ignore = false;
		setSlotsLoading(true);
		fetchSlots(form.roomName, form.date).then((rows) => {
			if (ignore) return;
			setSlots(rows);
			setSlotsLoading(false);
		});
		return () => {
			ignore = true;
		};
	}, [form.roomName, form.date]);

	const update = (field, value) => {
		setForm((prev) => {
			const next = { ...prev, [field]: value };
			if (field === "floor" && prev.floor !== value) next.roomName = "";
			if (field === "floor" || field === "roomName" || field === "date") {
				next.schedule = "";
			}
			return next;
		});
		setTouched((prev) => ({ ...prev, [field]: true }));
		setServerFieldErrors((prev) => ({ ...prev, [field]: undefined }));
		setServerError("");
	};

	const errors = useMemo(() => {
		const result = validateReservation(form, now);
		const chosen = slots.find((slot) => slot.schedule === form.schedule);
		if (!result.schedule && form.schedule && !slotsLoading) {
			if (!chosen)
				result.schedule = "Not on this room's schedule for this day.";
			else if (!chosen.status)
				result.schedule = "Someone already reserved this slot.";
		}
		return { ...result, ...serverFieldErrors };
	}, [form, now, slots, slotsLoading, serverFieldErrors]);

	const show = (field) =>
		(submitAttempted || touched[field]) && errors[field] ? errors[field] : null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitAttempted(true);
		setServerError("");
		if (Object.values(errors).some(Boolean)) {
			requestAnimationFrame(() =>
				document.querySelector("[aria-invalid='true']")?.focus(),
			);
			return;
		}

		setSubmitting(true);
		const result = await submitRequest({ ...form, userId: user?.user_id });
		if (result.success) {
			router.push("/user/history");
			return;
		}
		setSubmitting(false);
		setServerError(result.error || "Couldn't submit your request. Try again.");
		setServerFieldErrors(result.fieldErrors ?? {});
		// A slot may have just been taken; show the latest schedule.
		setSlots(await fetchSlots(form.roomName, form.date));
	};

	const room = RESERVABLE_ROOMS.find((r) => r.name === form.roomName);
	const isOrganization = form.borrowerType === "organization";
	const purposeLength = form.purpose.trim().length;

	return (
		<Card className="mx-auto w-full max-w-2xl">
			<CardHeader>
				<CardTitle className="text-xl">Reserve a room</CardTitle>
				<CardDescription>
					An admin reviews every request. You'll see the decision in your
					reservation history.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={handleSubmit}
					noValidate
					className="flex flex-col gap-8"
				>
					<Section
						step={1}
						title="Room and time"
						description={`Book up to ${MAX_DAYS_AHEAD} days ahead.`}
					>
						<div className="grid gap-4 sm:grid-cols-2">
							<Field label="Floor" error={show("floor")}>
								{(props) => (
									<Select
										value={form.floor}
										onValueChange={(value) => update("floor", value)}
									>
										<SelectTrigger {...props} className="w-full">
											<SelectValue placeholder="Select a floor">
												{form.floor ? floorLabel(form.floor) : undefined}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											{FLOORS.map((floor) => (
												<SelectItem key={floor} value={floor}>
													{floorLabel(floor)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							</Field>
							<Field label="Room" error={show("roomName")}>
								{(props) => (
									<Select
										value={form.roomName}
										onValueChange={(value) => update("roomName", value)}
										disabled={!form.floor}
									>
										<SelectTrigger {...props} className="w-full">
											<SelectValue
												placeholder={
													form.floor ? "Select a room" : "Pick a floor first"
												}
											>
												{form.roomName || undefined}
											</SelectValue>
										</SelectTrigger>
										<SelectContent>
											{roomsOn(form.floor).map((r) => (
												<SelectItem key={r.name} value={r.name}>
													{r.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							</Field>
						</div>

						<Field
							label="Date"
							error={show("date")}
							hint={!show("date") && form.date ? formatDay(form.date) : null}
						>
							{(props) => (
								<div className="relative sm:max-w-xs">
									<CalendarDays className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										{...props}
										type="date"
										className="pl-9"
										min={now.date}
										max={addDays(now.date, MAX_DAYS_AHEAD)}
										value={form.date}
										onChange={(e) => update("date", e.target.value)}
									/>
								</div>
							)}
						</Field>

						<div className="flex flex-col gap-2">
							<Label>Time slot</Label>
							{form.roomName && !errors.date ? (
								<SlotPicker
									slots={slots}
									loading={slotsLoading}
									value={form.schedule}
									onChange={(value) => update("schedule", value)}
									nowMinutes={form.date === now.date ? now.minutes : null}
									error={show("schedule")}
								/>
							) : (
								<p className="rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
									Choose a room and a valid date to see its time slots.
								</p>
							)}
							{show("schedule") && (
								<p className="text-xs text-destructive">{show("schedule")}</p>
							)}
						</div>
					</Section>

					<Section
						step={2}
						title="Who is it for?"
						description={
							user
								? `Requested by ${user.username} (${user.user_id})`
								: undefined
						}
					>
						<fieldset className="grid gap-3 sm:grid-cols-2">
							<legend className="sr-only">Borrowing for</legend>
							<BorrowerOption
								icon={User}
								value="personal"
								title="Myself"
								description="Personal study, class work or a small group."
								checked={!isOrganization}
								onSelect={() => update("borrowerType", "personal")}
							/>
							<BorrowerOption
								icon={Users}
								value="organization"
								title="An organization"
								description="On behalf of a UKM, BEM, himpunan or committee."
								checked={isOrganization}
								onSelect={() => update("borrowerType", "organization")}
							/>
						</fieldset>

						{isOrganization && (
							<div className="grid gap-4 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2">
								<Field
									label="Organization name"
									error={show("organizationName")}
									className="sm:col-span-2"
								>
									{(props) => (
										<>
											<Input
												{...props}
												list="organization-suggestions"
												placeholder="e.g. Himpunan Mahasiswa Informatika"
												value={form.organizationName}
												onChange={(e) =>
													update("organizationName", e.target.value)
												}
											/>
											<datalist id="organization-suggestions">
												{ORGANIZATION_SUGGESTIONS.map((name) => (
													<option key={name} value={name} />
												))}
											</datalist>
										</>
									)}
								</Field>
								<Field
									label="Your position"
									error={show("organizationPosition")}
								>
									{(props) => (
										<Input
											{...props}
											placeholder="e.g. Ketua, Sekretaris"
											value={form.organizationPosition}
											onChange={(e) =>
												update("organizationPosition", e.target.value)
											}
										/>
									)}
								</Field>
								<Field label="Expected attendees" error={show("attendeeCount")}>
									{(props) => (
										<Input
											{...props}
											type="number"
											inputMode="numeric"
											min={1}
											max={MAX_ATTENDEES}
											placeholder="e.g. 25"
											value={form.attendeeCount}
											onChange={(e) => update("attendeeCount", e.target.value)}
										/>
									)}
								</Field>
							</div>
						)}
					</Section>

					<Section step={3} title="Purpose">
						<Field
							label="What is the room for?"
							error={show("purpose")}
							hint={`${purposeLength}/${PURPOSE_MAX} characters`}
						>
							{(props) => (
								<Textarea
									{...props}
									rows={4}
									maxLength={PURPOSE_MAX}
									placeholder={
										isOrganization
											? "e.g. Weekly committee meeting for the campus open house"
											: "e.g. Group study for the algorithms midterm"
									}
									value={form.purpose}
									onChange={(e) => update("purpose", e.target.value)}
								/>
							)}
						</Field>
					</Section>

					<div className="flex flex-col gap-3 border-t pt-6">
						{serverError && (
							<div
								role="alert"
								className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
							>
								<AlertCircle className="mt-0.5 size-4 shrink-0" />
								{serverError}
							</div>
						)}
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<p className="text-sm text-muted-foreground">
								{room && form.schedule ? (
									<>
										<span className="font-medium text-foreground">
											{room.name}
										</span>
										{` · ${floorLabel(room.floor)} · ${formatDay(form.date)} · ${form.schedule}`}
									</>
								) : (
									"Pick a room and a time slot to continue."
								)}
							</p>
							<Button type="submit" disabled={submitting} className="sm:w-auto">
								{submitting && <Loader2 className="animate-spin" />}
								{submitting ? "Submitting…" : "Submit request"}
							</Button>
						</div>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default RoomReservationForm;
