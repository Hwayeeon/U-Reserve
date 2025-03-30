'use client'

import React, { useState } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ComingSoon } from "@/components/coming-soon"
import Image from 'next/image'

const tab = [
  { tab: 'Kampus 1', href: '#Kampus1'},
  { tab: 'Kampus 2', href: '#Kampus2'},
]
// Dummy data for floors and rooms
const floors = {
  "Kampus 1": [
    {
      floorName: "Floor 1",
      image: "/favicon.ico",
      rooms: ["Room 101", "Room 102", "Room 103"],
    },
    {
      floorName: "Floor 2",
      image: "/favicon.ico",
      rooms: ["Room 201", "Room 202", "Room 203"],
    },
  ],
  "Kampus 2": [],
}

export default function Page() {
  const [activeTab, setActiveTab] = useState("Kampus 1")
  const [floorIndex, setFloorIndex] = useState(0)

  function changeItems(e) {
    setActiveTab(e.target.id)
    setFloorIndex(0)
  }

  function goPrevFloor() {
    setFloorIndex((prev) =>
      prev > 0 ? prev - 1 : floors[activeTab].length - 1
    )
  }

  function goNextFloor() {
    setFloorIndex((prev) =>
      prev < floors[activeTab].length - 1 ? prev + 1 : 0
    )
  }

  const currentFloor = floors[activeTab][floorIndex]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 ...">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    U-Reserve
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Reserve Room</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex flex-1 flex-row gap-4 p-4 pt-0 max-h-max">
          {tab.map((item) => (
            <a
              onClick={changeItems}
              id={item.tab}
              key={item.tab}
              href={item.href}
              className={`inline-block w-1/2 text-center text-sm/6 font-semibold text-gray-900 h-max px-2 py-1 rounded-md
                ${activeTab === item.tab ? 'bg-gray-200 shadow-md' : 'hover:bg-gray-100'}`}
            >
              {item.tab}
            </a>
          ))}
        </div>

        {/* Show ComingSoon if no floors, otherwise show the floor & rooms */}
        {floors[activeTab].length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <ComingSoon />
          </div>
        ) : (
          <div id="content" className="flex-1 flex flex-col items-center gap-4 p-4 pt-0 min-h-min overflow-auto">
            <div className="text-lg text-center font-bold w-full">
              {currentFloor.floorName}
            </div>
            <div className="relative w-full max-w-lg h-1/2">
                <Image
                src={currentFloor.image}
                fill
                alt={currentFloor.floorName}
                className="w-full h-full object-contain border rounded"
              />
              <button
                onClick={goPrevFloor}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 rounded px-2 py-2"
              >
                &lt;
              </button>
              <button
                onClick={goNextFloor}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/60 rounded px-2 py-2"
              >
                &gt;
              </button>
            </div>
            <div className="flex flex-wrap gap-4 justify-center mt-4 w-full">
              {currentFloor.rooms.map((room, idx) => (
                <div
                  key={idx}
                  id={room}
                  className="p-2 border rounded hover:shadow"
                  onClick={() => alert(`You clicked on ${room}`)}
                >
                  {/* Change to pop-up later */}
                  {room}
                </div>
              ))}
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}