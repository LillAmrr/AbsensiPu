'use client';

import { useEffect } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Admin dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
          <ShieldAlert className="w-8 h-8 text-purple-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Admin Dashboard Error
        </h1>
        <p className="text-gray-600 mb-6">
          Terjadi kesalahan pada panel admin.
        </p>

        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-5 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Muat Ulang Admin Panel
        </button>
      </div>
    </div>
  );
}