export default function Profile() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Profil Pengguna</h1>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama</label>
                        <input
                            type="text"
                            value="Nama Pengguna"
                            readOnly
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">NIM</label>
                        <input
                            type="text"
                            value="12345678"
                            readOnly
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value="password123"
                            readOnly
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}