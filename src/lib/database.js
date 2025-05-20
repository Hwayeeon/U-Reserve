"use server";
import { createClient } from "@/utils/supabase/server";

export async function getRoomReservationData(params) {
  const supabase = await createClient();

  const { data, error } = await supabase
  .from('rooms')
  .select('*')
  .eq('room_name', params.roomName)
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
  console.log("Handling reservation:", params);
  const supabase = await createClient();

  const { updateHistoryData, updateHistoryError } = await supabase
  .from('history')
  .update({
    status: params.status,
  })
  .eq('history_id', params.historyId)

  if (updateHistoryError) {
    console.error("Error updating history:", updateHistoryError);
    return { success: false, error: updateHistoryError };
  }

  if (params.status === "Accepted") {
    const { data, error } = await supabase
    .from('rooms')
    .update({
      status: false,
      history_id: params.historyId,
    })
    .eq('room_name', params.roomName)
    .eq("date", params.for_date)
    .eq("schedule", params.schedule)

    if (error) {
      console.error("Error updating room status:", error);
      return { success: false, error };
    }
    return { success: true, data };
  }
  return { success: true, updateHistoryData };
}

export async function submitRequest(params) {
  const supabase = await createClient();

  const { data: statusData } = await supabase
  .from('rooms')
  .select('status')
  .eq('room_name', params.roomName)
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
        room_name: params.roomName,
        order_date: params.date,
        schedule: params.schedule,
        reason: params.reason,
        status: "Pending",
        for_date: params.date,
      },
    ]);

  if (error) {
    console.error("Error submitting request:", error);
    return { success: false, error };
  }
  return { success: true, data };
}