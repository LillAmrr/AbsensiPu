'use client';

import React from 'react';
import StatsCard from '@/components/admin/StatsCard';
import AttendanceChart from '@/components/shared/Charts/AttendanceChart';
import EmployeeTable from '@/components/admin/EmployeeTable';
import { Users, CalendarCheck, MapPin, Activity } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl w-full"> {/* Adjusted to full width within main content area */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Admin Dashboard</h1>
      <p className="text-lg text-gray-600 mb-10">
        Selamat datang di panel administrasi Smart Attendance.
        Di sini Anda dapat mengelola karyawan, lokasi, dan melihat laporan.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatsCard
          title="Total Karyawan"
          value="50" // Placeholder data
          description="Jumlah karyawan terdaftar"
          icon={<Users className="w-8 h-8" />}
        />
        <StatsCard
          title="Absensi Hari Ini"
          value="45/50" // Placeholder data
          description="Karyawan hadir hari ini"
          icon={<CalendarCheck className="w-8 h-8" />}
        />
        <StatsCard
          title="Lokasi Terdaftar"
          value="3" // Placeholder data
          description="Jumlah lokasi cabang"
          icon={<MapPin className="w-8 h-8" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="lg:col-span-1">
          <AttendanceChart />
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
            <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
              <Activity className="w-6 h-6 mr-3 text-blue-600" />
              Aktivitas Terbaru
            </h2>
            <ul className="divide-y divide-gray-200 flex-grow">
              <li className="py-3 text-gray-700">Tidak ada aktivitas terbaru.</li>
              {/* Real-time feed content would go here */}
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <EmployeeTable />
      </div>
    </div>
  );
}
