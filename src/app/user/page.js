'use client'

import React, { useState, useEffect } from 'react'
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
import floorPath from "@/data/path.json"
import { FloorMap } from '@/components/floor-map'

const tab = [
  { tab: 'Kampus 1', href: '#Kampus1'},
  { tab: 'Kampus 2', href: '#Kampus2'},
]


// Jadi ini function TImeDisplay untuk menampilkan waktu sesuai timezone dan locale yang diinginkan dan disini gw pake timezone Asia/Jakarta dan locale en-ID
// dan gw pake useEffect untuk update waktu setiap detik kalo mau ubah intervalnya tinggal ganti di setInterval(updateTime, 1000) ke angka yang diinginkan
// dan gw juga pake useState untuk menyimpan waktu yang ditampilkan
// kalo mau ubah formatnya tinggal ganti di options ke format yang diinginkan
// dan kalo mau ubah timezone dan locale tinggal ganti di propsnya
// Masih gak paham? Singkatnya dan gampangnya ini adalah function untuk menampilkan waktu sesuai timezone dan locale yang diinginkan dan di update setiap detik

const TimeDisplay = ({ timeZone, locale = "en-GB" }) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const timeString = new Intl.DateTimeFormat(locale, options).format(now);
      setCurrentTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [timeZone, locale]);

  return <span>{currentTime}</span>;
};

export default function Page() {
  const [activeTab, setActiveTab] = useState("Kampus 1");
  const [floorIndex, setFloorIndex] = useState(0);

  const floors = {
    "Kampus 1": Object.keys(floorPath["Kampus 1"] || {}),
    "Kampus 2": Object.keys(floorPath["Kampus 2"] || {}),
  };

  const currentFloorKey = floors[activeTab][floorIndex];
  const currentFloor = floorPath[activeTab][currentFloorKey];

  function changeItems(e) {
    setActiveTab(e.target.id);
    setFloorIndex(0);
  }

  function goPrevFloor() {
    setFloorIndex((prev) => (prev > 0 ? prev - 1 : floors[activeTab].length - 1));
  }

  function goNextFloor() {
    setFloorIndex((prev) => (prev < floors[activeTab].length - 1 ? prev + 1 : 0));
  }

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
                <span className="text-sm text-black ml-2 fixed right-4">
                  <TimeDisplay timeZone="Asia/Jakarta" locale="en-ID" />
                </span>
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
              {currentFloorKey}
            </div>
            <div className="relative w-full max-w-lg h-full">
              <FloorMap
                className="w-full h-full object-contain border rounded"
                floorObject={{
                  floorName: currentFloorKey,
                  floorImage: currentFloor,
                }}
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
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}