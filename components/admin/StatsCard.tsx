'use client';

import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon?: React.ReactNode;
}

export default function StatsCard({ title, value, description, icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
      {icon && <div className="text-blue-500 text-3xl">{icon}</div>}
      <div>
        <h2 className="text-md font-medium text-gray-500">{title}</h2>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      </div>
    </div>
  );
}
