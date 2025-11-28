'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  CalendarClock,
  Building,
  Users,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardNavProps {
  isMobile?: boolean;
  role: 'Student' | 'Coordinator' | 'Principal';
}

export function DashboardNav({ isMobile = false, role }: DashboardNavProps) {
  const pathname = usePathname();

  const allNavItems = [
    { href: '/dashboard', label: 'Event Feed', icon: Home, roles: ['Student', 'Coordinator', 'Principal'] },
    { href: '/dashboard/register', label: 'Registration', icon: Users, roles: ['Student', 'Coordinator', 'Principal'] },
    { href: '/dashboard/schedule', label: 'Smart Scheduling', icon: CalendarClock, roles: ['Coordinator', 'Principal'] },
    { href: '/dashboard/venues', label: 'Venue Allocation', icon: Building, roles: ['Coordinator', 'Principal'] },
    { href: '/dashboard/reminders', label: 'AI Reminders', icon: Bell, roles: ['Coordinator', 'Principal'] },
  ];
  
  const navItems = allNavItems;

  return (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
              isActive && 'bg-muted text-primary',
              isMobile && 'text-lg'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
