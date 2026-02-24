// app/(dashboard)/layout.tsx

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import DashboardClient from './DashboardClient';

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');

  if (!token) {
    return null;
  }

  try {
    // Decode JWT to get user info (simple decode, no verification needed here)
    const payload = JSON.parse(
      Buffer.from(token.value.split('.')[1], 'base64').toString(),
    );

    return {
      id: payload.sub,
      email: payload.email,
      isAdmin: payload.isAdmin,
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  return <DashboardClient user={user}>{children}</DashboardClient>;
}
