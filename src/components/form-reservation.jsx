"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"
import { getRoomReservation, handleReservation } from "@/lib/database"
import { getCookies } from "@/lib/cookies"

// Dummy data
// ini entar diambil dari supabase datanya
const dummyData = {
  floors: ["Floor 2", "Floor 3", "Floor 4", "Floor 5", "Floor 6", "Floor 7"],
  rooms: {
    "Floor 2": ["ELEKTRO1", "ELEKTRO2", "ELEKTRO3", "ELEKTRO4", "INDUSTRI1", "INDUSTRI2", "INDUSTRI3", "JUNCTION"],
    "Floor 3": ["E301", "E302", "E303", "E304", "E305", "E306", "E307", "E308", "E309", "E310"],
    "Floor 4": ["A4COL1", "A4EMP2", "A4EMP1", "A4EPW2", "A4EPW1"],
    "Floor 5": ["A5FAI1", "A5FAI2", "A5TRU2", "A5TRU1", "A505", "A506", "A507", "A508", "A5INS1"],
    "Floor 6": ["A6AGI3", "A6AGI2", "A6AGI1", "A6AGI4", "A6INN1", "A6INN2", "A6INN3", "A6INN4", "A6PIO1", "A6PIO2", "A6PIO3"],
    "Floor 7": ["A704", "A703", "A7DIS1", "A7DIS2", "A7GOA1", "A7GOA2", "A7GOA3", "A7RES1", "A7RES2", "A7RES3"],
  }
}
const user = getCookies("user");

const RoomReservationForm = () => {
  const searchParams = useSearchParams();
  const floorFromQuery = searchParams.get("floor") || "";
  const roomNameFromQuery = searchParams.get("roomName") || "";
  const timeSlotFromQuery = searchParams.get("timeSlot") || "";
  const usernameFromQuery = searchParams.get("username") || user?.username || "";

  const [formData, setFormData] = useState({
    floor: floorFromQuery,
    roomName: roomNameFromQuery,
    timeSlot: timeSlotFromQuery,
    borrowerName: usernameFromQuery,
    purpose: "",
  });

  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlotStatus, setSelectedTimeSlotStatus] = useState("AVAILABLE");

  // Fetch timeslots from DB when roomName or floor changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (formData.roomName) {
        const today = new Date().toISOString().split("T")[0];
        const reservations = await getRoomReservation({
          roomId: formData.roomName,
          date: today,
        });
        // Example: reservations = [{ schedule: "08:00-09:00", status: "AVAILABLE" }, ...]
        setTimeSlots(reservations || []);
      } else {
        setTimeSlots([]);
      }
      setFormData((prev) => ({ ...prev, timeSlot: "" }));
      setSelectedTimeSlotStatus("AVAILABLE");
    };
    fetchTimeSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.roomName]);

  // Update status when timeSlot changes
  useEffect(() => {
    if (formData.timeSlot && timeSlots.length > 0) {
      const slot = timeSlots.find((t) => t.schedule === formData.timeSlot);
      setSelectedTimeSlotStatus(slot?.status || "UNAVAILABLE");
    } else {
      setSelectedTimeSlotStatus("AVAILABLE");
    }
  }, [formData.timeSlot, timeSlots]);

  // Fungsi untuk menghandle perubahan pada input form
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "timeSlot") {
      const slot = timeSlots.find((t) => t.schedule === value);
      setSelectedTimeSlotStatus(slot?.status || "UNAVAILABLE");
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleReservation({
      roomId: formData.roomName,
      date: new Date().toISOString().split("T")[0], // Use today's date
      schedule: formData.timeSlot,
      userId: user.user_id, // Assuming borrowerName is the user ID
      reason: formData.purpose,
    }).then((result) => {
      if (result.success) {
        alert("Reservation submitted successfully!");
      } else {
        alert("Failed to submit reservation.");
      }
    });
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Room Reservation</CardTitle>
        <CardDescription>Book a room for class, meeting or event</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="floor">Floor</Label>
            <Select value={formData.floor} onValueChange={(value) => handleChange("floor", value)}>
              <SelectTrigger id="floor">
                <SelectValue placeholder="Select a floor">{formData.floor}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {dummyData.floors.map((floor) => (
                  <SelectItem key={floor} value={floor}>
                    {floor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomName">Room Name</Label>
            <Select
              value={formData.roomName}
              onValueChange={(value) => handleChange("roomName", value)}
              disabled={!formData.floor}
            >
              <SelectTrigger id="roomName">
                <SelectValue placeholder="Select a room">{formData.roomName}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(dummyData.rooms[formData.floor] || []).map((room) => (
                  <SelectItem key={room} value={room}>
                    {room}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeSlot">Time Slot</Label>
            <Select
              value={formData.timeSlot}
              onValueChange={(value) => handleChange("timeSlot", value)}
              disabled={timeSlots.length === 0}
            >
              <SelectTrigger id="timeSlot">
                <SelectValue placeholder="Select a time slot">{formData.timeSlot}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {timeSlots.length === 0 ? (
                  <SelectItem value="__no_timeslot__" disabled>
                    No timeslots available
                  </SelectItem>
                ) : (
                  timeSlots.map((slot) => (
                    <SelectItem
                      key={slot.schedule}
                      value={slot.schedule}
                      disabled={slot.status === "RESERVED"}
                    >
                      <span className={slot.status !== "RESERVED" ? "text-green-600" : "text-red-500"}>
                        {slot.schedule} - {slot.status}
                      </span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="borrowerName">Borrower Name</Label>
            <Input id="borrowerName" value={formData.borrowerName} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose / Reason</Label>
            <Textarea
              id="purpose"
              placeholder="Please describe the purpose of your reservation"
              value={formData.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={
              !formData.floor ||
              !formData.roomName ||
              !formData.timeSlot ||
              !formData.purpose ||
              selectedTimeSlotStatus !== "AVAILABLE"
            }
          >
            Submit Reservation
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default RoomReservationForm