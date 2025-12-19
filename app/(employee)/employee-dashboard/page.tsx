"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Clock, MapPin, User, LogOut, Loader2 } from 'lucide-react';
import { getCurrentLocation, GeolocationResult } from '@/lib/utils/location';
import FaceCamera from '@/components/attendance/FaceCamera';

type CheckInStatus = 'idle' | 'getting_location' | 'taking_photo' | 'verifying' | 'success' | 'error';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkInStatus, setCheckInStatus] = useState<CheckInStatus>('idle');
  const [checkInMessage, setCheckInMessage] = useState('');
  const [currentLocation, setCurrentLocation] = useState<GeolocationResult | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleCheckIn = async () => {
    setCheckInStatus('getting_location');
    setCheckInMessage('Getting your location...');
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      setCheckInMessage('Location acquired. Please take a photo.');
      setCheckInStatus('taking_photo');
    } catch (error: any) {
      console.error(error);
      setCheckInStatus('error');
      setCheckInMessage(error.message);
    }
  };

  const handleCapture = async (imageDataUrl: string) => {
    setCheckInStatus('verifying');
    setCheckInMessage('Verifying your identity...');
    
    try {
      // Step 1: Verify Face
      const { data: faceData, error: faceError } = await supabase.functions.invoke('face-verify', {
        body: { imageDataUrl, userId: user.id },
      });

      if (faceError || !faceData.match) {
        throw new Error(faceError?.message || 'Face verification failed. Please try again.');
      }

      setCheckInMessage('Face verified. Processing attendance...');

      // Step 2: Process Attendance
      const { data: attendanceData, error: attendanceError } = await supabase.functions.invoke('process-attendance', {
        body: {
          userId: user.id,
          location: currentLocation,
          faceMatch: true,
        },
      });

      if (attendanceError) {
        throw new Error(attendanceError.message || 'Failed to process attendance.');
      }

      setCheckInStatus('success');
      setCheckInMessage('Check-in successful! Welcome.');

    } catch (error: any) {
      console.error('Check-in process error:', error);
      setCheckInStatus('error');
      setCheckInMessage(error.message);
    }
  };
  
  const resetCheckIn = () => {
    setCheckInStatus('idle');
    setCheckInMessage('');
    setCurrentLocation(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto text-blue-600" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Smart Attendance</h1>
              <p className="text-gray-600">Dashboard Karyawan</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{user?.email}</p>
                <p className="text-sm text-gray-500">Karyawan</p>
              </div>
              <button onClick={handleLogout} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Attendance Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold">Absensi Hari Ini</h2>
              </div>
              <div className="text-center py-8">
                {checkInStatus === 'idle' && (
                  <>
                    <p className="text-gray-600 mb-6">Belum ada absensi hari ini</p>
                    <button onClick={handleCheckIn} className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
                      ABSEN MASUK
                    </button>
                  </>
                )}
                {['getting_location', 'verifying'].includes(checkInStatus) && (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                    <p className="text-gray-600">{checkInMessage}</p>
                  </div>
                )}
                {checkInStatus === 'error' && (
                  <div className="text-red-600">
                    <p className="font-bold">Check-in Gagal</p>
                    <p className="text-sm mb-4">{checkInMessage}</p>
                    <button onClick={resetCheckIn} className="text-sm text-blue-600 hover:underline">Coba Lagi</button>
                  </div>
                )}
                {checkInStatus === 'success' && (
                  <div className="text-green-600">
                    <p className="font-bold">Sukses</p>
                    <p className="text-sm">{checkInMessage}</p>
                    <p className="text-sm mt-2">Jam Masuk: {new Date().toLocaleTimeString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Profile & Location Cards */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4"><User className="w-6 h-6 text-purple-600 mr-3" /><h2 className="text-xl font-semibold">Profil Saya</h2></div>
              <div className="space-y-4"><div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{user?.email}</p></div><div><p className="text-sm text-gray-500">Status</p><p className="font-medium text-green-600">Aktif</p></div></div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4"><MapPin className="w-6 h-6 text-orange-600 mr-3" /><h2 className="text-xl font-semibold">Lokasi</h2></div>
              <div className="space-y-4"><div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center"><p className="text-gray-500">Peta lokasi akan ditampilkan di sini</p></div><p className="text-sm text-gray-600">GPS: {currentLocation ? 'Active' : 'Inactive'}</p></div>
            </div>

          </div>
        </main>
      </div>
      
      {/* Camera Modal */}
      {checkInStatus === 'taking_photo' && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-4 m-4">
            <h3 className="text-lg font-bold text-center mb-2">Ambil Foto Wajah</h3>
            <p className="text-sm text-gray-600 text-center mb-4">{checkInMessage}</p>
            <FaceCamera
              onCapture={handleCapture}
              onCancel={resetCheckIn}
            />
          </div>
        </div>
      )}
    </>
  );
}