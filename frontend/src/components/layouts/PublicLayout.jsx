import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../features/auth/AuthProvider.jsx';

const roleOptions = [
  { value: 'admin', label: 'Admin (Principal)' },
  { value: 'organizer', label: 'Organizer' },
  { value: 'student', label: 'Student' },
];

const PublicLayout = () => {
  const { pathname } = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [selectedRole, setSelectedRole] = useState(() => user?.role ?? 'student');

  useEffect(() => {
    setSelectedRole(user?.role ?? 'student');
  }, [user?.role]);

  const navItems = useMemo(() => {
    return [
      { to: '/', label: 'Discover' },
      { to: '/events', label: 'Events', requireAuth: true },
      { to: '/student', label: 'Student Hub', requireAuth: true, roles: ['student'] },
      { to: '/dashboard', label: 'Organizer', requireAuth: true, roles: ['organizer'] },
      { to: '/admin/approvals', label: 'Principal', requireAuth: true, roles: ['admin'] },
      { to: '/login', label: 'Login', hideWhenAuth: true },
      { to: '/register', label: 'Register', hideWhenAuth: true },
    ].filter((item) => {
      if (item.roles && !item.roles.includes(user?.role)) return false;
      if (item.requireAuth && !isAuthenticated) return false;
      if (item.hideWhenAuth && isAuthenticated) return false;
      return true;
    });
  }, [isAuthenticated, user?.role]);

  return (
    <div className="min-h-screen bg-[#05081a] text-slate-100">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.18),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(56,189,248,0.14),_transparent_45%)]" />
      </div>

      <div className="relative z-10">
        <header className="border-b border-white/5 bg-[#060b1b]/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <NavLink to="/" className="text-lg font-semibold tracking-wide text-white">
              Campus Events Hub
            </NavLink>
            <nav className="flex items-center gap-2 text-sm font-medium text-slate-300">
              {navItems.map((item) => {
                const isActive = pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className="relative inline-flex items-center justify-center px-4 py-2"
                  >
                    <span className={isActive ? 'text-white' : 'text-slate-300 transition hover:text-white'}>
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-full bg-indigo-500/20"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </NavLink>
                );
              })}
            </nav>
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-indigo-100 sm:flex">
              <span className="rounded-full bg-indigo-500/30 px-2 py-0.5 text-[11px] uppercase tracking-wider text-indigo-100">
                Role
              </span>
              <label htmlFor="layout-role-select" className="sr-only">
                Choose preferred role
              </label>
              <select
                id="layout-role-select"
                value={selectedRole}
                onChange={(event) => setSelectedRole(event.target.value)}
                className="cursor-pointer appearance-none rounded-full border border-transparent bg-transparent px-2 py-0.5 text-indigo-100 focus:border-indigo-300 focus:outline-none"
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-[#060b1b] text-slate-100">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-12">
          <Outlet />
        </main>

        <footer className="border-t border-white/5 bg-[#060b1b]/80">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-slate-400 sm:flex-row">
            <span>© {new Date().getFullYear()} CampusEvents. Crafted for hackathon showcase.</span>
            <span className="text-slate-500">Designed for immersive event journeys.</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PublicLayout;
