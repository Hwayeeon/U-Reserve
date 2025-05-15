"use client";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function getUserData() {
  const { data, error } = await createClient()
    .from("users")
    .select("*");

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }
  return data;
}

export default function ListUserData() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    async function fetchUserData() {
      const data = await getUserData();
      setUserData(data);
    }

    fetchUserData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">List User Data</h1>
      <Table>
        <TableCaption>A list of registered users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Avatar</TableHead>
            <TableHead className="text-right">Last Seen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userData.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell className="font-medium">{user.user_id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {user.last_seen
                  ? new Date(user.last_seen).toLocaleString()
                  : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
