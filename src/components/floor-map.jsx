'use client';

import { useEffect, useRef, useState } from "react";
import { PopUp } from "./pop-up";

export function FloorMap({ className, floorObject, ...props }) {
  const svgRef = useRef(null);
  const [selectedRoom, setSelectedRoom] = useState(null); // State to track the selected room
  const [showPopup, setShowPopup] = useState(false); // State to control pop-up visibility

  useEffect(() => {
    const svgElement = svgRef.current;

    if (!svgElement || !floorObject.floorImage) return;

    // Clear existing SVG content
    svgElement.innerHTML = "";

    // Calculate scaling factor to fit the paths inside the canvas
    const canvasWidth = floorObject.floorPlanWidth;
    const canvasHeight = floorObject.floorPlanHeight;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    // Determine the bounding box of all paths
    Object.keys(floorObject.floorImage).forEach((roomKey) => {
      const room = floorObject.floorImage[roomKey];
      const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathElement.setAttribute("d", room.path);
      const tempSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      tempSvg.appendChild(pathElement);
      document.body.appendChild(tempSvg);
      const bbox = pathElement.getBBox();
      document.body.removeChild(tempSvg);

      minX = Math.min(minX, bbox.x);
      minY = Math.min(minY, bbox.y);
      maxX = Math.max(maxX, bbox.x + bbox.width);
      maxY = Math.max(maxY, bbox.y + bbox.height);
    });

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;

    const scaleX = canvasWidth / contentWidth;
    const scaleY = canvasHeight / contentHeight;
    const scale = Math.min(scaleX, scaleY);

    const translateX = -minX * scale + (canvasWidth - contentWidth * scale) / 2;
    const translateY = -minY * scale + (canvasHeight - contentHeight * scale) / 2;

    // Loop through each room in the floorObject
    Object.keys(floorObject.floorImage).forEach((roomKey) => {
      const room = floorObject.floorImage[roomKey];
      const pathData = room.path;

      // Create a <path> element for each room
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
        `translate(${translateX}, ${translateY}) scale(${scale})`
      );

      // Add hover interactivity
      pathElement.addEventListener("mouseenter", () => {
        pathElement.setAttribute("fill", "red");
      });

      pathElement.addEventListener("mouseleave", () => {
        pathElement.setAttribute("fill", "blue");
      });

      // Add click interactivity to show the pop-up
      pathElement.addEventListener("click", () => {
        setSelectedRoom(room.name); // Set the selected room name
        setShowPopup(true); // Show the pop-up
      });

      // Append the path to the SVG
      svgElement.appendChild(pathElement);
    });
  }, [floorObject]);

  return (
    <div className={className}>
      <svg
        ref={svgRef}
        width={floorObject.floorPlanWidth}
        height={floorObject.floorPlanHeight}
        viewBox={`0 0 ${floorObject.floorPlanWidth} ${floorObject.floorPlanHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      />
      {showPopup && (
        <PopUp
          roomName={selectedRoom}
          reservations={[
            { hour: "08:00 AM - 10:30 AM", status: "Open" },
            { hour: "10:45 AM - 13:15 PM", status: "Closed" },
            { hour: "13:30 PM - 16:00 PM", status: "Open" },
            { hour: "16:15 PM - 18:45 PM", status: "Closed" },
            { hour: "19:00 PM - 21:30 PM", status: "Open" },
          ]}
          onClose={() => setShowPopup(false)} // Close pop-up handler
        />
      )}
    </div>
  );
}