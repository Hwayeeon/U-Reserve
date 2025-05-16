"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, Shield, Users } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function AboutPage() {
  useEffect(() => {
    // Simple scroll animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeIn")
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const developers = [
    { name: "Triemas Putra", NIM: "412024018" },
    { name: "Davidson Rafael", NIM: "412024030" },
    { name: "Christian", NIM: "412024013" },
    { name: "Austin Jeremiah", NIM: "412024020" },
    { name: "Michael Timothy", NIM: "412024023" },
  ]

  return (
    <SidebarProvider>
      <div className="flex flex-row h-screen w-screen overflow-hidden bg-gradient-to-b from-white to-gray-100">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <SidebarInset>
          <div className="flex flex-col h-screen w-full overflow-y-auto">
            {/* Navigation */}
            <div className="px-6 pt-8 pb-2">
              <Link href="/" className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"></Link>
            </div>

            {/* Hero Section with Logo */}
            <div className="px- 2 py- 8 text-center">
              <div className="mb-8 flex justify-center">
                <div className="relative h-40 w-80">
                  <Image src="/favicon.ico" alt="U-Reserve Logo" fill style={{ objectFit: "contain" }} priority />
                </div>
              </div>
              <h1 className="mb-4 text-4xl md:text-5xl font-bold text-[#535353]">About U-Reserve</h1>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Transforming UKRIDA managing spaces and resources
              </p>
            </div>

            {/* Mission Statement */}
            <div className="px-6   py-8">
              <div className="animate-on-scroll opacity-0 transition-opacity duration-1000 mx-auto max-w-3xl bg-white p-8 rounded-lg shadow-lg">
                <h2 className="mb-6 text-3xl font-bold text-center text-[#535353]">U-Reserve</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  U-Reserve is a web-based application to streamline the process of reserving, managing, and viewing
                  schedules of classrooms and also view the status of public facilities in an educational institution.
                  It replaces manual or paper-based reservation systems with a centralized digital platform ensuring
                  efficiency, transparency, accountability, and convenience.
                </p>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="px-6 py-8">
              <h2 className="mb-12 text-3xl font-bold text-center text-[#535353] animate-on-scroll opacity-0 transition-opacity duration-1000">
                Key Benefits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Efficiency */}
                <div className="animate-on-scroll opacity-0 transition-opacity duration-1000 bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-[#FFD700]/20 rounded-full">
                    <Clock className="h-8 w-8 text-[#FFD700]" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-800">Efficiency</h3>
                  <p className="text-gray-600">
                    Automate reservation processes, eliminate paperwork, and reduce administrative overhead.
                  </p>
                </div>
                {/* Transparency */}
                <div className="animate-on-scroll opacity-0 transition-opacity duration-1000 bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-[#0047AB]/10 rounded-full">
                    <Calendar className="h-8 w-8 text-[#0047AB]" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-800">Transparency</h3>
                  <p className="text-gray-600">
                    Provide clear visibility into room availability and scheduling to all stakeholders.
                  </p>
                </div>
                {/* Accountability */}
                <div className="animate-on-scroll opacity-0 transition-opacity duration-1000 bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-[#FFD700]/20 rounded-full">
                    <Shield className="h-8 w-8 text-[#FFD700]" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-800">Accountability</h3>
                  <p className="text-gray-600">
                    Track usage, maintain records, and ensure responsible use of institutional resources.
                  </p>
                </div>
                {/* Convenience */}
                <div className="animate-on-scroll opacity-0 transition-opacity duration-1000 bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-[#0047AB]/10 rounded-full">
                    <Users className="h-8 w-8 text-[#0047AB]" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-gray-800">Convenience</h3>
                  <p className="text-gray-600">
                    Access the system anytime, anywhere, making reservations and checking availability simple.
                  </p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="px-6 py-8">
              <div className="animate-on-scroll opacity-0 transition-opacity duration-1000 mx-auto max-w-3xl">
                <h2 className="mb-8 text-3xl font-bold text-center text-[#535353]">How It Works</h2>
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <p className="mb-6 text-lg text-gray-700 leading-relaxed">
                    By enabling role-based access and providing a user-friendly interface, U-Reserve solves common
                    problems in educational institutions:
                  </p>
                  <ul className="space-y-4 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2 text-[#FFD700] font-bold">•</span>
                      <span>Eliminates confusion about room availability</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-[#FFD700] font-bold">•</span>
                      <span>Prevents scheduling conflicts and double-bookings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-[#FFD700] font-bold">•</span>
                      <span>Optimizes resource utilization across the institution</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-[#FFD700] font-bold">•</span>
                      <span>Provides analytics for better decision-making</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Developer Section */}
            <div className="px-6 py-8">
              <div className="animate-on-scroll opacity-0 transition-opacity duration-1000">
                <h2 className="mb-12 text-3xl font-bold text-center text-[#535353]">Meet Our Team</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
                  {developers.map((dev, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-lg transition-shadow"
                    >
                      <div className="mb-4 w-20 h-20 bg-gradient-to-br from-[#FFD700] to-[#0047AB] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {dev.name.charAt(0)}
                      </div>
                      <h3 className="mb-1 text-lg font-semibold text-gray-800">{dev.name}</h3>
                      <p className="text-sm text-gray-700">{dev.NIM}</p>
                      <div className="mt-4 flex space-x-3">
                        <a href="#" className="text-gray-400 hover:text-[#0047AB] colors"></a>
                        <a href="#" className="text-gray-400 hover:text-[#0047AB] colors"></a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#0047AB] py-2 mt-auto">
              <div className="max-w-2xl mx-auto px-4 text-center">
                <div className="mb-6 relative h-32 w-64 mx-auto">
                  <Image
                    src="/favicon.ico"
                    alt="U-Reserve Logo"
                    fill
                    style={{ objectFit: "contain" }}
                    className="brightness-0 invert"
                  />
                </div>  
              </div>
            </div>

            {/* CSS for animations */}
            <style jsx>{`
              .animate-fadeIn {
                opacity: 1;
              }
            `}</style>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
