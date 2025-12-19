'use client';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import React from 'react';

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <LoadingSpinner />
    </div>
  );
}
