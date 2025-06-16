// src/app/(authenticated)/layout.tsx
'use client';

import React from 'react';
import Sidebar from "@/components/Sidebar"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sidebar>
      {children}
    </Sidebar>
  );
}