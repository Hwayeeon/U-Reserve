'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookies } from "@/lib/cookies";
import { Calendar } from "./ui/calendar";

export function PopUp({ roomName, reservations, onClose }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent rendering on the server
  }

  const user = getCookies("user");

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
      }}
      onClick={onClose} // Close pop-up when clicking outside
    >
      <div
        className="bg-white rounded-lg shadow-lg w-3/4 max-w-4xl p-6"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the pop-up
      >
        {/* Room Name */}
        <h2 className="text-2xl font-bold text-center mb-4">{roomName}</h2>

        <div className="flex">
          {/* Calendar Component */}
          <div className="flex-1 pr-4">
            {<Calendar />}
          </div>

          {/* Reservation Status */}
          <div className="flex-1 pl-4">
            {reservations.map((reservation, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-4 border-b pb-2"
              >
                <div>
                  <p className="text-lg font-medium">{reservation.hour}</p>
                  <p
                    className={`text-sm ${
                      reservation.status === "Open"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {reservation.status}
                  </p>
                </div>
                <button
                  className={`px-4 py-2 rounded ${
                    reservation.status === "Open"
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={reservation.status !== "Open"}
                  onClick={() =>
                    reservation.status === "Open" &&
                    alert(`Reserving ${roomName} at ${reservation.hour} \n ${user.name} ${user.NIM} ${user.email}`) // Replace with actual reservation logic
                  }
                >
                  Reserve
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}