import { NavLink, Outlet } from 'react-router-dom';
import { Bars3Icon, BellIcon, RectangleStackIcon, UsersIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../features/auth/AuthProvider.jsx';
import { useMemo, useState } from 'react';

const baseNavItems = [
  {
    to: '/dashboard',
    label: 'Overview',
    icon: RectangleStackIcon,
  },
  {
    to: '/my-registrations',
    label: 'My Registrations',
    icon: UsersIcon,
  },
  {
    to: '/notifications',
    label: 'Notifications',
    icon: BellIcon,
  },
];

const adminNavItem = {
  to: '/admin/approvals',
  label: 'Approvals',
  icon: WrenchScrewdriverIcon,
};

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = useMemo(() => {
    if (user?.role === 'admin') {
      return [...baseNavItems, adminNavItem];
    }
    return baseNavItems;
  }, [user?.role]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="relative flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          <span className="text-lg font-semibold text-indigo-600">CampusEvents Dashboard</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-right">
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs uppercase tracking-wide text-slate-500">{user?.role}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="flex">
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed bottom-0 left-0 top-16 z-30 flex w-60 flex-col border-r border-slate-200 bg-white/90 px-4 py-6 shadow-lg backdrop-blur transition-transform duration-200 lg:static lg:translate-x-0`}
        >
          <nav className="space-y-2 text-sm font-medium text-slate-600">
            {navigation.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-2 transition ${
                    isActive ? 'bg-indigo-600 text-white shadow' : 'hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
