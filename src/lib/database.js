"use server";
import { validateReservation } from "@/lib/reservationRules";
import { campusNow } from "@/lib/roomStatus";
import { createClient } from "@/utils/supabase/server";

export async function getRoomReservationData(params) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("rooms")
		.select("*")
		.eq("room_name", params.roomName)
		.eq("date", params.date);

	if (error) {
		console.error("Error fetching reservation rooms:", error);
		return [];
	}

	return data.sort((a, b) => {
		const timeA = new Date(`1970-01-01T${a.schedule.split(" - ")[0]}:00`);
		const timeB = new Date(`1970-01-01T${b.schedule.split(" - ")[0]}:00`);
		return timeA - timeB;
	});
}

// All of a day's time slots for several rooms at once (used for live status on the floor map).
export async function getFloorScheduleData(params) {
	if (!params.roomNames?.length) return [];
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("rooms")
		.select("room_name, schedule, status")
		.in("room_name", params.roomNames)
		.eq("date", params.date);

	if (error) {
		console.error("Error fetching floor schedule:", error);
		return [];
	}
	return data;
}

export async function getUserHistoryReservationData(params) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("history")
		.select("*")
		.eq("user_id", params.userId);

	if (error) {
		console.error("Error fetching reservation history:", error);
		return [];
	}
	return data;
}

export async function getAllHistoryReservationData() {
	const supabase = await createClient();

	const { data, error } = await supabase.from("history").select("*");

	if (error) {
		console.error("Error fetching all reservation history:", error);
		return [];
	}
	return data;
}

export async function handleReservation(params) {
	console.log("Handling reservation:", params);
	const supabase = await createClient();

	const { updateHistoryData, updateHistoryError } = await supabase
		.from("history")
		.update({
			status: params.status,
		})
		.eq("history_id", params.historyId);

	if (updateHistoryError) {
		console.error("Error updating history:", updateHistoryError);
		return { success: false, error: updateHistoryError };
	}

	if (params.status === "Accepted") {
		const { data, error } = await supabase
			.from("rooms")
			.update({
				status: false,
				history_id: params.historyId,
			})
			.eq("room_name", params.roomName)
			.eq("date", params.for_date)
			.eq("schedule", params.schedule);

		if (error) {
			console.error("Error updating room status:", error);
			return { success: false, error };
		}
		return { success: true, data };
	}
	return { success: true, updateHistoryData };
}

// Who is submitting: the signed-in Supabase user. The client-sent id is only
// trusted in the local dev login bypass, which has no Supabase session.
async function requesterId(supabase, claimedId) {
	const { data } = await supabase.auth.getUser();
	const sessionId = data?.user?.user_metadata?.user_id;
	if (sessionId) return String(sessionId);
	if (getDevBypassRole() && claimedId) return String(claimedId);
	return null;
}

// Validates a borrow request against the shared rules and the live schedule,
// then files it as Pending. Returns { success, error?, fieldErrors? }.
export async function submitRequest(params) {
	const supabase = await createClient();
	const now = campusNow();

	const userId = await requesterId(supabase, params.userId);
	if (!userId) {
		return {
			success: false,
			error: "Your session has expired. Sign in again.",
		};
	}

	const fieldErrors = validateReservation(params, now);
	if (Object.keys(fieldErrors).length > 0) {
		return {
			success: false,
			error: "Some details need fixing.",
			fieldErrors,
		};
	}

	const { data: slots, error: slotError } = await supabase
		.from("rooms")
		.select("status")
		.eq("room_name", params.roomName)
		.eq("date", params.date)
		.eq("schedule", params.schedule);

	if (slotError) {
		console.error("Error checking slot:", slotError);
		return {
			success: false,
			error: "Couldn't check the room's schedule. Try again.",
		};
	}
	if (!slots?.length) {
		return {
			success: false,
			error: "That time slot doesn't exist for this room and date.",
			fieldErrors: { schedule: "Not on this room's schedule." },
		};
	}
	if (!slots[0].status) {
		return {
			success: false,
			error: "Someone already reserved this time slot.",
			fieldErrors: { schedule: "Already reserved." },
		};
	}

	// One active request per person per time slot, in any room.
	const { data: clashes, error: clashError } = await supabase
		.from("history")
		.select("room_name")
		.eq("user_id", userId)
		.eq("for_date", params.date)
		.eq("schedule", params.schedule)
		.in("status", ["Pending", "Accepted"]);

	if (clashError) {
		console.error("Error checking existing requests:", clashError);
		return {
			success: false,
			error: "Couldn't check your existing bookings. Try again.",
		};
	}
	if (clashes?.length) {
		return {
			success: false,
			error: `You already have a request for ${clashes[0].room_name} at this time.`,
			fieldErrors: { schedule: "You already have a booking at this time." },
		};
	}

	const request = {
		user_id: userId,
		room_name: params.roomName,
		order_date: now.date,
		schedule: params.schedule,
		reason: params.purpose.trim(),
		status: "Pending",
		for_date: params.date,
	};
	if (params.borrowerType === "organization") {
		Object.assign(request, {
			borrower_type: "organization",
			organization_name: params.organizationName.trim(),
			organization_position: params.organizationPosition.trim(),
			attendee_count: Number(params.attendeeCount),
		});
	}

	const { data, error } = await supabase.from("history").insert([request]);

	if (error) {
		console.error("Error submitting request:", error);
		return {
			success: false,
			error: "Couldn't submit your request. Try again.",
		};
	}
	return { success: true, data };
}
