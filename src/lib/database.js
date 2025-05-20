"use server";
import { createClient } from "@/utils/supabase/server";

export async function getRoomReservationData(params) {
  const supabase = await createClient();

  const { data, error } = await supabase
  .from('rooms')
  .select('*')
  .eq('room_id', params.roomId.toLowerCase())
  .eq("date", params.date)

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

export async function getUserHistoryReservationData(params) {
  const supabase = await createClient();

  const { data, error } = await supabase
  .from('history')
  .select('*')
  .eq('user_id', params.userId)

  if (error) {
    console.error("Error fetching reservation history:", error);
    return [];
  }
  return data;
}

export async function getAllHistoryReservationData() {
  const supabase = await createClient();

  const { data, error } = await supabase
  .from('history')
  .select('*')

  if (error) {
    console.error("Error fetching all reservation history:", error);
    return [];
  }
  return data;
}

export async function handleReservation(params) {
  const supabase = await createClient();

  const { updateHistoryData, updateHistoryError } = await supabase
  .from('history')
  .update({
    status: params.status,
  })
  .eq('room_id', params.roomId)
  .eq("date", params.date)
  .eq("schedule", params.schedule)
  .eq("user_id", params.userId)

  if (updateHistoryError) {
    console.error("Error updating history:", updateHistoryError);
    return { success: false, error: updateHistoryError };
  }

  const { data, error } = await supabase
  .from('rooms')
  .update({
    status: false,
    user_id: params.userId,
    reason: params.reason,
  })
  .eq('room_id', params.roomId.toLowerCase())
  .eq("date", params.date)
  .eq("schedule", params.schedule)
  console.log("Data:", data);
  if (error) {
    console.error("Error creating reservation:", error);
    return { success: false, error };
  }
  return { success: true, data };
}

export async function submitRequest(params) {
  const supabase = await createClient();

  const { data: statusData } = await supabase
  .from('rooms')
  .select('status')
  .eq('room_id', params.roomId.toLowerCase())
  .eq("date", params.date)
  .eq("schedule", params.schedule)

  if (!statusData[0]?.status) {
    return { success: false, error: "Room is already reserved for this time slot." };
  }

  const { data, error } = await supabase
    .from('history')
    .insert([
      {
        user_id: params.userId,
        room_id: params.roomId,
        date: params.date,
        schedule: params.schedule,
        reason: params.reason,
        status: "Pending",
      },
    ]);

  if (error) {
    console.error("Error submitting request:", error);
    return { success: false, error };
  }
  return { success: true, data };
}