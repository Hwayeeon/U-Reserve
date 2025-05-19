'use client';

import { useEffect, useState } from "react";
import { getCookies } from "@/lib/cookies";
import { Calendar } from "./ui/calendar";
import Link from "next/link";

export function PopUp({ floor, roomName, reservations, onClose }) {
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
        onClick={(e) => e.stopPropagation()}
      >
        {/* Room Name */}
        <h2 className="text-2xl font-bold text-center mb-4">{roomName}</h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Calendar Component */}
          <div className="md:w-1/2 w-full pr-0 md:pr-4 mb-4 md:mb-0">
            <Calendar />
          </div>

          {/* Reservation Status */}
          <div className="md:w-1/2 w-full pl-0 md:pl-4">
            {reservations.map((reservation, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-4 border-b pb-2"
              >
                <div>
                  <p className="text-lg font-medium">{reservation.schedule}</p>
                  <p
                    className={`text-sm ${
                      reservation.status === "AVAILABLE"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {reservation.status}
                  </p>
                </div>
                <Link
                  href={{
                    pathname: "/user/form/",
                    query: {
                      floor: floor,
                      roomName: roomName,
                      timeSlot: reservation.schedule,
                      username: user?.username || "",
                    },
                  }}
                  passHref
                  legacyBehavior
                >
                  <button
                    className={`px-4 py-2 rounded ${
                      reservation.status === "AVAILABLE"
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={reservation.status !== "AVAILABLE"}
                  >
                    Reserve
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}