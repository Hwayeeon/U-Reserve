import { Suspense } from "react";
import RoomReservationForm from "@/components/form-reservation";

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Suspense fallback={<div>Loading...</div>}>
        <RoomReservationForm />
      </Suspense>
    </main>
  );
}