'use client';

import { useEffect } from 'react';
import { CalendarX, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AttendanceError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Attendance page error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
          <CalendarX className="w-8 h-8 text-yellow-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Gagal Memuat Absensi
        </h1>
        
        <p className="text-gray-600 mb-4">
          Sistem absensi sedang mengalami gangguan.
        </p>
        
        <p className="text-sm text-gray-500 mb-6">
          Silakan coba beberapa saat lagi atau hubungi administrator.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-5 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Coba Lagi
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-5 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Refresh Halaman
          </button>
        </div>
      </div>
    </div>
  );
}