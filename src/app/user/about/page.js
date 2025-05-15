"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import Image from "next/image";

async function getUserData() {
  const { data, error } = await createClient()
    .from("users")
    .select("username", "prodi", "avatar");

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }
  return data;
}

export default function About() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    async function fetchUserData() {
      const data = await getUserData();
      setUserData(data);
    }

    fetchUserData();
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>
      <p className="text-lg text-center max-w-2xl">
        Welcome to our application! We are dedicated to providing the best user
        experience possible. Our team is committed to continuous improvement and
        innovation.
      </p>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {getUserData().map((user) => (
            <div
              key={user.username}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
            >
              <Image
                width={100}
                src={user.avatar}
                alt={`${user.username}'s avatar`}
                className="h-24 w-24 rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold">{user.username}</h3>
              <p className="text-gray-600">{user.prodi}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}