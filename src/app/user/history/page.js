"use client"

import { useState } from "react"
import { ChevronsUpDown, Download, Filter, Search, SortAsc, SortDesc } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const mockReservations = [
    {
      id: "RES-001",
      roomNumber: "101",
      roomType: "Deluxe", // just in case
      checkIn: new Date("2023-05-01"),
      checkOut: new Date("2023-05-05"),
      status: "accepted",
    },
    {
        id: "RES-003",
        roomNumber: "304",
        roomType: "Standard",
        checkIn: new Date("2023-05-20"),
        checkOut: new Date("2023-05-22"),
        status: "cancelled",
      },
      {
        id: "RES-004",
        roomNumber: "402",
        roomType: "Deluxe",
        checkIn: new Date("2023-06-01"),
        checkOut: new Date("2023-06-07"),
        status: "accepted",
      },
      {
        id: "RES-005",
        roomNumber: "110",
        roomType: "Standard",
        checkIn: new Date("2023-06-15"),
        checkOut: new Date("2023-06-18"),
        status: "pending",
      },
      {
        id: "RES-007",
        roomNumber: "305",
        roomType: "Deluxe",
        checkIn: new Date("2023-07-15"),
        checkOut: new Date("2023-07-20"),
        status: "accepted",
      },
      {
        id: "RES-008",
        roomNumber: "403",
        roomType: "Standard",
        checkIn: new Date("2023-08-01"),
        checkOut: new Date("2023-08-03"),
        status: "rejected",
      },
    ]

    export default function HistoryPage() {
        const [searchQuery, setSearchQuery] = useState("")
        const [statusFilter, setStatusFilter] = useState("all")
        const [sortDirection, setSortDirection] = useState("desc")
        
        // Filter and sort reservations
        const filteredReservations = mockReservations
            .filter((reservation) => {
            // Apply search filter
            const matchesSearch =
                reservation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                reservation.roomNumber.includes(searchQuery)
        
            // Apply status filter
            const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
        
            return matchesSearch && matchesStatus
            })
            .sort((a, b) => {
            // Sort by check-in date
            if (sortDirection === "asc") {
                return a.checkIn.getTime() - b.checkIn.getTime()
            } else {
                return b.checkIn.getTime() - a.checkIn.getTime()
            }
            })

                    // Get status badge color
            const getStatusBadge = (status) => {
                switch (status) {
                case "accepted":
                    return <Badge className="bg-green-500">Accepted</Badge>
                case "rejected":
                    return <Badge variant="destructive">Rejected</Badge>
                case "Cancelled":
                    return <Badge variant="destructive">Cancelled</Badge>
                case "pending":
                    return (
                    <Badge variant="outline" className="text-amber-500 border-amber-500">
                        Pending
                    </Badge>
                    )
                default:
                    return <Badge variant="secondary">{status}</Badge>
                }
            }

            return (
                <SidebarProvider>
                    <AppSidebar/>
                    <SidebarInset>
                    <div className="container mx-4 py-6 space-y-6 max-w-[95%]">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold tracking-tight">Reservation History</h1>
                        <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                        </Button>
                    </div>
                
                  <Card>
                    <CardHeader>
                      <CardTitle>All Reservations</CardTitle>
                      <CardDescription>View and manage all past room reservations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search by guest, reservation ID or room..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="w-[180px]">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                              <SelectTrigger>
                                <div className="flex items-center gap-2">
                                  <Filter className="h-4 w-4" />
                                  <SelectValue placeholder="Filter by status" />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="accepted">Accepted</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                            aria-label="Sort by date"
                          >
                            {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
            
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Reservation ID</TableHead>
                              <TableHead>Room</TableHead>
                              <TableHead>Order Date</TableHead>
                              <TableHead>Room Date</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredReservations.length > 0 ? (
                              filteredReservations.map((reservation) => (
                                <TableRow key={reservation.id}>
                                  <TableCell className="font-medium">{reservation.id}</TableCell>
                                  <TableCell>
                                    {reservation.roomNumber}
                                    {/* <span className="ml-1 text-xs text-muted-foreground">({reservation.roomType})</span> */}
                                  </TableCell>
                                  <TableCell>{format(reservation.checkIn, "MMM dd, yyyy")}</TableCell>
                                  <TableCell>{format(reservation.checkOut, "MMM dd, yyyy")}</TableCell>
                                  <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                          <ChevronsUpDown className="h-4 w-4" />
                                          <span className="sr-only">Open menu</span>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>View details</DropdownMenuItem>
                                        <DropdownMenuItem>Print Record</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                  No reservations found.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
            
                      {/* <div className="mt-4">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#" isActive>
                                1
                              </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">2</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink href="#">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationNext href="#" />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div> */}
                    </CardContent>
                  </Card>
                </div>
                </SidebarInset>
                </SidebarProvider>
              )
            }