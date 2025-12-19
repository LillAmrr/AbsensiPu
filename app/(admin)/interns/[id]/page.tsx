'use client';

import React from 'react';

export default function InternDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Detail Peserta Magang</h1>
      <p>ID Peserta Magang: {params.id}</p>
    </div>
  );
}
