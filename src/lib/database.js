"use server";
import { createClient } from "@/utils/supabase/server";

export async function getRoomReservation(params) {
  const supabase = await createClient();

  const { data, error } = await supabase
  .from('history')
  .select('*')
  .eq('room_id', params.roomId.toLowerCase())
  .eq("date", params.date)

  if (error) {
    console.error("Error fetching reservation history:", error);
    return [];
  }

  return data;
}

export async function handleReservation(params) {
  const supabase = await createClient();

  const { data: statusData } = await supabase
  .from('history')
  .select('status')
  .eq('room_id', params.roomId.toLowerCase())
  .eq("date", params.date)
  .eq("schedule", params.schedule)

  if (statusData[0]?.status) {
    return { success: false, error: "Room is already reserved for this time slot." };
  }

  const { data, error } = await supabase
  .from('history')
  .update({
    status: "RESERVED",
    user_id: params.userId,
    reason: params.reason,
  })
  .eq('room_id', params.roomId.toLowerCase())
  .eq("date", params.date)
  .eq("schedule", params.schedule)

  if (error) {
    console.error("Error creating reservation:", error);
    return { success: false, error };
  }
  return { success: true, data };
}