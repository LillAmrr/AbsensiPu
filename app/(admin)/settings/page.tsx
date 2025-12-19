'use client';

import React from 'react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md min-h-[calc(100vh-160px)]">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Pengaturan Sistem</h1>
      <p className="text-gray-600 mb-6 text-center">
        Di sini Anda dapat mengkonfigurasi berbagai pengaturan aplikasi, seperti integrasi, notifikasi, dll.
      </p>
      <div className="text-blue-500 text-lg">
        {/* Placeholder for Settings UI */}
        Fitur pengaturan akan datang.
      </div>
    </div>
  );
}
