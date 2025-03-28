'use client'
import Link from 'next/link';

export function ComingSoon({
}) {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col justify-center items-center px-6">
      <div className="max-w-md w-full text-center">
        <p className="text-2xl font-semibold text-gray-600 mt-4">Coming Soon</p>
        <p className="text-gray-500 mt-2">This Feature is currently in progress and will come soon in the future.</p>
        <Link href="/" className="inline-block mt-6 px-8 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition">
            Go Back Home
        </Link>
        <div className="mt-6">
          <Link href="/contact" className="text-blue-600 hover:underline">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}