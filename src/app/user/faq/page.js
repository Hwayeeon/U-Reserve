'use client';

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
    const [openIndex, setOpenIndex] = useState(null);
  
    const toggleAccordion = (index) => {
      setOpenIndex(openIndex === index ? null : index);
    };
  
    const faqItems = [
      { question: "What is U-Reserve?", answer: "U-Reserve is a room reservation system." },
      { 
        question: "How do I reserve a room?", 
        answer: (
          <div>
            <p>Learn how to reserve a room with U-Reserve:</p>
            <div className="mt-2">
              <iframe
                width="560"
                height="315"
                className="mx-auto"
                src="https://www.youtube.com/embed/tgbNymZ7vqY?playlist=tgbNymZ7vqY&loop=1"
                title="How to Reserve a Room"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ),
      },
      { question: "When are the operating hours?", answer: "Our operating hours are from 8 AM to 10 PM daily." },
      { question: "Can I cancel my reservation?", answer: "Yes, you can cancel your reservation up to 24 hours before the reserved time." },
    ];
  
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 items-start justify-center">
            <div className="w-4/5 max-w-4/5 pt-8">
              <h1 className="text-4xl font-bold text-center">FAQ</h1>
              <div className="mt-4 text-lg">    
                {faqItems.map((item, index) => (
                  <div key={index} className="border-b">
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full text-left py-2 font-medium flex justify-between items-center"
                    >
                      {item.question}
                      <span>{openIndex === index ? "-" : "+"}</span>
                    </button>
                    <div
                      style={{
                        maxHeight: openIndex === index ? "500px" : "0",
                        overflow: "hidden",
                        transition: "max-height 0.3s ease-out, opacity 0.3s ease-out",
                        opacity: openIndex === index ? "1" : "0",
                      }}
                      className="pl-4 py-2 text-gray-600"
                    >
                      {item.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }