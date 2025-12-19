'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, MapPin, Bell, BarChart2, Settings, Menu, X } from 'lucide-react';

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon, label }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`flex items-center p-3 rounded-lg transition-colors duration-200 
      ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}
    `}>
      {icon}
      <span className="ml-3 text-sm font-medium">{label}</span>
    </Link>
  );
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button onClick={toggleSidebar} className="p-2 rounded-md bg-white shadow-md text-gray-700">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-6 flex flex-col transition-transform duration-300 ease-in-out z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-blue-700">Smart Attendance</h1>
        </div>
        <nav className="flex-grow space-y-2">
          <SidebarLink href="/admin-dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
          <SidebarLink href="/admin/employees" icon={<Users className="w-5 h-5" />} label="Karyawan" />
          <SidebarLink href="/admin/locations" icon={<MapPin className="w-5 h-5" />} label="Lokasi" />
          <SidebarLink href="/admin/notifications" icon={<Bell className="w-5 h-5" />} label="Notifikasi" />
          <SidebarLink href="/admin/reports" icon={<BarChart2 className="w-5 h-5" />} label="Laporan" />
          <SidebarLink href="/admin/settings" icon={<Settings className="w-5 h-5" />} label="Pengaturan" />
        </nav>
        {/* You can add a footer here for logout or user info */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          {/* Example: Logout Button */}
          {/* <button className="w-full text-left p-3 rounded-lg text-gray-700 hover:bg-gray-200">
            <LogOut className="w-5 h-5 inline mr-3" /> Logout
          </button> */}
        </div>
      </aside>
    </>
  );
}
