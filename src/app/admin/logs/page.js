"use client"

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AppSidebar } from "@/components/app-sidebar-admin";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { getAllHistoryReservationData, handleReservation } from "@/lib/database";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all reservations
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getAllHistoryReservationData();
      setReservations(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Approve or reject reservation
  const handleAction = async (reservation, action) => {
    console.log("Reservation:", reservation);
    setLoading(true);
    await handleReservation({
      roomName: reservation.room_name,
      schedule: reservation.schedule,
      status: action === "approve" ? "Accepted" : "Rejected",
      historyId: reservation.history_id,
      for_date: reservation.for_date,
    }).then(async (response) => {
      if (response.success) {
        const updatedData = await getAllHistoryReservationData();
          if (updatedData) {
            updatedData.map(async (updateReservation) => {
              console.log("Update Reservation:", updateReservation.room_name === reservation.room_name);
              if (updateReservation.room_name === reservation.room_name &&
                updateReservation.for_date === reservation.for_date &&
                updateReservation.schedule === reservation.schedule) {
                if (updateReservation.history_id !== reservation.history_id) {
                  await handleReservation({
                    roomName: updateReservation.room_name,
                    schedule: updateReservation.schedule,
                    status: "Rejected",
                    historyId: updateReservation.history_id,
                    for_date: updateReservation.for_date,
                  });
                }
              }
            });
          }
        alert(`Reservation ${action === "approve" ? "approved" : "rejected"} successfully.`);
      } else {
        alert("Error updating reservation.");
      }
    });
    // Refresh data
    const data = await getAllHistoryReservationData();
    setReservations(data);
    setLoading(false);
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "Accepted":
        return <Badge className="bg-green-500">Accepted</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "Cancelled":
        return <Badge variant="secondary">Cancelled</Badge>;
      case "Pending":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="container mx-4 py-6 space-y-6 max-w-[95%]">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Manage Reservations</h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>All Reservations</CardTitle>
              <CardDescription>Approve or reject pending room reservations.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reservation ID</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>For Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[150px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : reservations.length > 0 ? (
                      reservations.map((reservation) => (
                        <TableRow key={reservation.history_id}>
                          <TableCell className="font-medium">{reservation.history_id.split("-")[0]}</TableCell>
                          <TableCell>{reservation.room_name}</TableCell>
                          <TableCell>{reservation.user_id}</TableCell>
                          <TableCell>{reservation.schedule}</TableCell>
                          <TableCell>{format(reservation.for_date || reservation.date, "MMM dd, yyyy")}</TableCell>
                          <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                          <TableCell>
                            {reservation.status === "Pending" ? (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={() => handleAction(reservation, "approve")}
                                  disabled={loading}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleAction(reservation, "reject")}
                                  disabled={loading}
                                >
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No reservations found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}