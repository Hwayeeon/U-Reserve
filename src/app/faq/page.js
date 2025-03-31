'use client'

import { useState } from 'react'

export default function Page() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = [
    { question: "What is U-Reserve?", answer: "U-Reserve is a room reservation system." },
    { question: "How do I reserve a room?", answer: "You can reserve a room through our platform by selecting an available time slot." },
    { question: "When are the operating hours?", answer: "Our operating hours are from 8 AM to 10 PM daily." },
    { question: "Can I cancel my reservation?", answer: "Yes, you can cancel your reservation up to 24 hours before the reserved time." },
  ];

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-md">
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
              {openIndex === index && (
                <div className="pl-4 py-2 text-gray-600">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}