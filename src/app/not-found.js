import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-extrabold text-gray-800">404</h1>
        <p className="text-2xl font-semibold text-gray-600 mt-4">Page Not Found</p>
        <p className="text-gray-500 mt-2">Sorry, the page you are looking for does not exist or has been moved.</p>
        {/*<img src="/images/404-illustration.svg" alt="Not Found Illustration" className="my-8 mx-auto w-64 h-64"/>*/}
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