import { ComingSoon } from "@/components/coming-soon";
import { FloorMap } from "@/components/floor-map";
import floorPath from "@/data/path.json";

export default function FAQ() {
  const floorKey = "floor1"; // Example: dynamically determine the floor key
  const floorData = floorPath[floorKey];

  if (!floorData) {
    return <div>Floor data not found</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <FloorMap
        className="w-full min-h-screen bg-gray-100 flex flex-col justify-center items-center px-6"
        floorObject={{
          floorName: floorKey,
          floorImage: floorData,
          floorPlanWidth: 1200,
          floorPlanHeight: 1400,
          floorPlanScale: 1,
        }}
      />
      <ComingSoon />
    </div>
  );
}