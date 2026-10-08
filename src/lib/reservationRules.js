// Booking rules shared by the reservation form (instant feedback) and the
// submitRequest server action (the check that actually counts).
import floorPaths from "@/data/path.json";

export const MAX_DAYS_AHEAD = 30;
export const PURPOSE_MIN = 10;
export const PURPOSE_MAX = 500;
export const ORG_NAME_MAX = 100;
export const ORG_POSITION_MAX = 60;
export const MAX_ATTENDEES = 200;
export const BORROWER_TYPES = ["personal", "organization"];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SCHEDULE_PATTERN =
	/^([01]\d|2[0-3]):[0-5]\d\s*-\s*([01]\d|2[0-3]):[0-5]\d$/;

export function floorLabel(floorKey) {
	return floorKey.replace(/^Floor\s*/i, "Floor ");
}

// Every room the floor map lets people reserve, as { name, floor, type }.
export const RESERVABLE_ROOMS = Object.entries(floorPaths).flatMap(
	([campus, floors]) =>
		Object.entries(floors).flatMap(([floor, items]) =>
			Object.values(items)
				.filter(
					(item) =>
						typeof item === "object" && item?.clickable === "true" && item.name,
				)
				.map((item) => ({ name: item.name, floor, campus, type: item.type })),
		),
);

export function findRoom(name) {
	return RESERVABLE_ROOMS.find((room) => room.name === name) ?? null;
}

function toMinutes(time) {
	const [hours, minutes] = time.split(":").map(Number);
	return hours * 60 + minutes;
}

export function parseSchedule(schedule) {
	const match = SCHEDULE_PATTERN.exec(schedule?.trim() ?? "");
	if (!match) return null;
	const [start, end] = schedule.split("-").map((part) => part.trim());
	return { start: toMinutes(start), end: toMinutes(end) };
}

// Whole days from `fromKey` to `toKey` (both YYYY-MM-DD), ignoring time zones.
export function daysBetween(fromKey, toKey) {
	const [fy, fm, fd] = fromKey.split("-").map(Number);
	const [ty, tm, td] = toKey.split("-").map(Number);
	return Math.round(
		(Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86_400_000,
	);
}

export function addDays(dateKey, days) {
	const [y, m, d] = dateKey.split("-").map(Number);
	return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

function isRealDate(dateKey) {
	if (!DATE_PATTERN.test(dateKey ?? "")) return false;
	const [y, m, d] = dateKey.split("-").map(Number);
	const date = new Date(Date.UTC(y, m - 1, d));
	return (
		date.getUTCFullYear() === y &&
		date.getUTCMonth() === m - 1 &&
		date.getUTCDate() === d
	);
}

// Returns { field: message } for every problem; an empty object means valid.
// `now` is campusNow(): { date: "YYYY-MM-DD", minutes }.
export function validateReservation(input, now) {
	const errors = {};
	const room = findRoom(input.roomName);

	if (!input.roomName) errors.roomName = "Choose a room.";
	else if (!room) errors.roomName = "This room can't be reserved.";
	else if (input.floor && room.floor !== input.floor) {
		errors.roomName = `${room.name} is on ${floorLabel(room.floor)}, not ${floorLabel(input.floor)}.`;
	}

	if (!input.date) errors.date = "Choose a date.";
	else if (!isRealDate(input.date)) errors.date = "Enter a valid date.";
	else {
		const ahead = daysBetween(now.date, input.date);
		if (ahead < 0) errors.date = "You can't book a date in the past.";
		else if (ahead > MAX_DAYS_AHEAD) {
			errors.date = `You can book at most ${MAX_DAYS_AHEAD} days ahead.`;
		}
	}

	const slot = parseSchedule(input.schedule);
	if (!input.schedule) errors.schedule = "Choose a time slot.";
	else if (!slot || slot.end <= slot.start)
		errors.schedule = "Invalid time slot.";
	else if (!errors.date && input.date === now.date && slot.end <= now.minutes) {
		errors.schedule = "This time slot has already ended.";
	}

	if (!BORROWER_TYPES.includes(input.borrowerType)) {
		errors.borrowerType = "Choose who you're borrowing for.";
	} else if (input.borrowerType === "organization") {
		const orgName = input.organizationName?.trim() ?? "";
		const position = input.organizationPosition?.trim() ?? "";
		const attendees = Number(input.attendeeCount);
		if (orgName.length < 2)
			errors.organizationName = "Enter the organization's name.";
		else if (orgName.length > ORG_NAME_MAX) {
			errors.organizationName = `Keep it under ${ORG_NAME_MAX} characters.`;
		}
		if (position.length < 2) {
			errors.organizationPosition = "Enter your position in the organization.";
		} else if (position.length > ORG_POSITION_MAX) {
			errors.organizationPosition = `Keep it under ${ORG_POSITION_MAX} characters.`;
		}
		if (!Number.isInteger(attendees) || attendees < 1) {
			errors.attendeeCount = "Enter how many people will attend.";
		} else if (attendees > MAX_ATTENDEES) {
			errors.attendeeCount = `At most ${MAX_ATTENDEES} attendees.`;
		}
	}

	const purpose = input.purpose?.trim() ?? "";
	if (purpose.length < PURPOSE_MIN) {
		errors.purpose = `Describe the purpose in at least ${PURPOSE_MIN} characters.`;
	} else if (purpose.length > PURPOSE_MAX) {
		errors.purpose = `Keep it under ${PURPOSE_MAX} characters.`;
	}

	return errors;
}
