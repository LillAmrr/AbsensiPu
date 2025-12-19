'use client';

import React from 'react';
import Sidebar from '@/components/ui/Sidebar';
import { ToastProvider } from '@/components/providers/ToastProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex flex-col lg:ml-64 p-4 md:p-6 lg:p-8"> {/* Adjust margin for sidebar */}
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
