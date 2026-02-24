'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Shield,
  Users,
  Activity,
  Settings,
  FileText,
  TrendingUp,
  AlertTriangle,
  LogOut,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLogout } from '@/lib/api-hooks/use-logout';

const menuItems = [
  {
    title: 'OVERVIEW',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
      { icon: Activity, label: 'Analytics', href: '/dashboard/analytics' },
      { icon: TrendingUp, label: 'Reports', href: '/dashboard/reports' },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      { icon: Users, label: 'Users', href: '/dashboard/users' },
      { icon: Shield, label: 'Scans', href: '/dashboard/scans' },
      { icon: AlertTriangle, label: 'Threats', href: '/dashboard/threats' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { icon: FileText, label: 'Logs', href: '/dashboard/logs' },
      { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ],
  },
];

interface SidebarProps {
  user?: {
    email: string;
    isAdmin: boolean;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    if (!confirm('Are you sure you want to logout?')) return;

    logout();
  };

  return (
    <aside className="w-64 h-screen bg-dark-800 border-r border-terminal-green/20 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-terminal-green/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-terminal-green/10 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-terminal-green" />
          </div>
          <div>
            <div className="text-terminal-green font-display text-sm">LINKGUARD</div>
            <div className="text-terminal-green/60 text-xs font-mono">ADMIN_PANEL</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {menuItems.map((section) => (
          <div key={section.title}>
            <div className="text-terminal-green/60 text-xs font-bold mb-3 px-3">
              {section.title}
            </div>

            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className={`
                        relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                        font-mono text-sm transition-all cursor-pointer
                        ${
                          isActive
                            ? 'bg-terminal-green/20 text-terminal-green'
                            : 'text-terminal-green/70 hover:bg-terminal-green/10 hover:text-terminal-green'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>

                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute left-0 w-1 h-8 bg-terminal-green rounded-r"
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-terminal-green/20">
        {user && (
          <div className="flex items-center gap-3 mb-3 px-3">
            <div className="w-8 h-8 bg-terminal-green/20 rounded-full flex items-center justify-center">
              <span className="text-terminal-green font-bold text-sm">A</span>
            </div>
            <div className="flex-1">
              <div className="text-terminal-green text-sm font-mono">
                {user.isAdmin ? 'Admin' : 'User'}
              </div>
              <div className="text-terminal-green/60 text-xs">{user.email}</div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg
                     text-terminal-green/70 hover:text-terminal-green
                     hover:bg-terminal-green/10 transition-all
                     disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-mono text-sm">
            {isPending ? 'Logging out...' : 'Logout'}
          </span>
        </button>
      </div>
    </aside>
  );
}
