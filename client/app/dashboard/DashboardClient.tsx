// app/(dashboard)/DashboardClient.tsx

'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';

interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

interface DashboardClientProps {
  user: User;
  children: React.ReactNode;
}

export default function DashboardClient({ user, children }: DashboardClientProps) {
  useAuth(); // Auto-refresh setup

  return (
    <div className="min-h-screen bg-light-100 dark:bg-dark-900 flex">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
