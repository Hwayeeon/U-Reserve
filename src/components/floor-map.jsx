'use client';

import { useEffect, useRef, useState } from "react";
import { PopUp } from "./pop-up";
import { getRoomReservation } from "@/lib/database";

export function FloorMap({ className, floorObject, ...props }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [reservations, setReservations] = useState([]);

  // Fetch reservation data when a room is selected and popup is shown
  useEffect(() => {
    const fetchReservations = async () => {
      if (selectedRoom && showPopup) {
        // You may need to map selectedRoom to roomId if needed
        const data = await getRoomReservation({
          roomId: selectedRoom,
          date: new Date().toISOString().split("T")[0], // Use today's date
        });
        setReservations(data);
      }
    };
    fetchReservations();
  }, [selectedRoom, showPopup]);

  useEffect(() => {
    // Observe the container size and update dimensions
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const svgElement = svgRef.current;

    if (!svgElement || !floorObject.floorImage) return;

    // Clear existing SVG content
    svgElement.innerHTML = "";

    // Draw and scale each path & text
    Object.keys(floorObject.floorImage).forEach((roomKey) => {
      const room = floorObject.floorImage[roomKey];

      if (roomKey.startsWith("room") && room.path) {
        const pathData = room.path;
        const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("d", pathData);
        pathElement.setAttribute("id", room.name);
        pathElement.setAttribute("stroke", "black");
        pathElement.setAttribute("stroke-width", "5");
        pathElement.setAttribute("stroke-linecap", "round");
        pathElement.setAttribute("fill", "blue");
        pathElement.style.transition = "all 0.2s ease";

        // Apply scaling and translation
        pathElement.setAttribute(
          "transform",
          `scale(${dimensions.width / floorObject.floorImage.originalX}, ${dimensions.height / floorObject.floorImage.originalY})`
        );

        // Add hover interactivity
        pathElement.addEventListener("mouseenter", () => {
          pathElement.setAttribute("fill", "red");
        });

        pathElement.addEventListener("mouseleave", () => {
          pathElement.setAttribute("fill", "blue");
        });

        if (room.clickable === "true") {
          // Add click interactivity to show the pop-up
          pathElement.addEventListener("click", () => {
            setSelectedRoom(room.name); // Set the selected room name
            setShowPopup(true); // Show the pop-up
          });
        }

        // Append the path to the SVG
        svgElement.appendChild(pathElement);
      } else if (roomKey.startsWith("name") && room.type === "text") {
        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.textContent = room.text;
        textElement.setAttribute("font-size", "0.75em");
        textElement.setAttribute("font-weight", "bold");
        textElement.setAttribute("fill", "black");
        textElement.setAttribute("text-anchor", "middle");
        textElement.setAttribute("dominant-baseline", "middle");
        textElement.setAttribute("xml:space", "preserve");
        textElement.setAttribute("letter-spacing", "0em");
        textElement.setAttribute("cursor", "pointer");
        
        textElement.setAttribute("x", room.x * dimensions.width / floorObject.floorImage.originalX);
        textElement.setAttribute("y", room.y * dimensions.height / floorObject.floorImage.originalY);
        
        // Append the text to the SVG
        svgElement.appendChild(textElement);
      } else if (roomKey.startsWith("line") && room.type === "line") {
        const lineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
        lineElement.setAttribute("x1", room.x1 * dimensions.width / floorObject.floorImage.originalX);
        lineElement.setAttribute("y1", room.y1 * dimensions.height / floorObject.floorImage.originalY);
        lineElement.setAttribute("x2", room.x2 * dimensions.width / floorObject.floorImage.originalX);
        lineElement.setAttribute("y2", room.y2 * dimensions.height / floorObject.floorImage.originalY);
        lineElement.setAttribute("stroke", "black");
        lineElement.setAttribute("stroke-dasharray", "10,10");
        lineElement.setAttribute("stroke-width", "2");
        
        // Append the line to the SVG
        svgElement.appendChild(lineElement);
      }
    });
  }, [floorObject, dimensions]);

  return (
    <div ref={containerRef} className={className}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        {...props}
      />
      {showPopup && (
        <PopUp
          floor={floorObject.floorName}
          roomName={selectedRoom}
          reservations={reservations}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}