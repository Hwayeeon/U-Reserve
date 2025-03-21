"use client";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function FilterError({ error }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Alert
        variant="destructive"
        className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 shadow-lg"
      >
        <div className="flex items-start gap-4 p-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <div>
            <AlertTitle className="mb-2 text-lg font-semibold text-red-800">
              Oops! Something went wrong
            </AlertTitle>
            <AlertDescription className="text-sm text-red-700">
              {error?.message || "An unexpected error occurred. Please try again."}
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  );
}