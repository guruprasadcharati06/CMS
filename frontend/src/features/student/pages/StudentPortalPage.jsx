import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { BookmarkIcon, CalendarDaysIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import useEvents from '../../events/api/useEvents.js';
import useMyRegistrations from '../../registrations/api/useMyRegistrations.js';
import useRegisterForEvent from '../../registrations/api/useRegisterForEvent.js';
import useCancelRegistration from '../../registrations/api/useCancelRegistration.js';
import { useAuth } from '../../auth/AuthProvider.jsx';

const sidebarItems = [
  { id: 'feed', label: 'Event Feed', icon: BookmarkIcon },
  { id: 'registrations', label: 'My Registrations', icon: CheckCircleIcon },
  { id: 'schedule', label: 'Smart Scheduling', icon: CalendarDaysIcon },
  { id: 'venues', label: 'Venue Allocation', icon: ClockIcon },
  { id: 'reminders', label: 'AI Reminders', icon: ClockIcon },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const StudentPortalPage = () => {
  const [activeSection, setActiveSection] = useState('feed');
  const { user } = useAuth();
  const {
    data: events = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useEvents({ status: 'approved' });
  const { data: registrations = [] } = useMyRegistrations();

  const registeredIds = useMemo(
    () => new Set(registrations.map((registration) => registration.event?._id).filter(Boolean)),
    [registrations]
  );

  const attendeeName = useMemo(() => (user?.name ? user.name.split(' ')[0] : 'You'), [user?.name]);

  const registerMutation = useRegisterForEvent({
    onSuccess: (registration) => {
      const title = registration?.event?.title ?? 'event';
      toast.success(`Registered for ${title}`);
    },
    onError: (mutError) => {
      toast.error(mutError.message || 'Failed to register');
    },
  });
  const cancelMutation = useCancelRegistration({
    onSuccess: (registration) => {
      const title = registration?.event?.title ?? 'event';
      toast.success(`Registration cancelled for ${title}`);
    },
    onError: (mutError) => {
      toast.error(mutError.message || 'Failed to cancel registration');
    },
  });

  const upcomingEvents = useMemo(() => {
    return events.filter((event) => dayjs(event.startDate).isAfter(dayjs().subtract(1, 'day')));
  }, [events]);

  const highlightEvents = useMemo(() => upcomingEvents.slice(0, 3), [upcomingEvents]);
  const otherEvents = useMemo(() => upcomingEvents.slice(3), [upcomingEvents]);

  if (isLoading) {
    return (
      <div className="grid gap-8 lg:grid-cols-[260px,1fr]">
        <aside className="rounded-3xl border border-white/5 bg-[#0b1125]/70 p-6">
          <div className="h-5 w-28 rounded-full bg-white/10" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-10 rounded-2xl bg-white/10" />
            ))}
          </div>
        </aside>
        <section className="space-y-6 rounded-3xl border border-white/5 bg-[#0b1125]/80 p-8">
          <div className="h-4 w-32 rounded-full bg-white/10" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-40 rounded-3xl border border-white/5 bg-white/5" />
          ))}
        </section>
      </div>
    );
  }

  if (isError) {
    return (
      <section className="space-y-4 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-rose-50">
        <h2 className="text-xl font-semibold">We couldn&apos;t load the event feed</h2>
        <p className="text-sm opacity-80">{error.message || 'Try refreshing or come back later.'}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center justify-center rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
        >
          Retry
        </button>
      </section>
    );
  }

  const handleToggleRegistration = (eventId, isRegistered) => {
    if (!eventId) return;
    if (isRegistered) {
      cancelMutation.mutate(eventId);
    } else {
      registerMutation.mutate(eventId);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[260px,1fr]">
      <aside className="rounded-3xl border border-white/5 bg-[#0b1125]/70 p-6 text-sm text-indigo-100/80">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-300">Student space</p>
          <h2 className="text-xl font-semibold text-white">Navigate</h2>
          <p className="text-xs text-indigo-200/70">Switch between event feed, your registrations, and smart planning tools.</p>
        </header>
        <nav className="mt-6 space-y-1">
          {sidebarItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveSection(id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                  isActive
                    ? 'bg-indigo-500/20 text-white shadow shadow-indigo-500/20'
                    : 'text-indigo-100/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{label}</span>
                {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-indigo-400" />}
              </button>
            );
          })}
        </nav>
        <div className="mt-8 space-y-3 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-xs text-indigo-100/80">
          <p className="font-semibold text-indigo-100">Stay organised</p>
          <p>Sync confirmed registrations with your calendar and receive reminders before events begin.</p>
        </div>
      </aside>

      <motion.section className="space-y-10" initial="hidden" animate="visible" variants={stagger}>
        <motion.header variants={fadeUp} className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-300">Recommended for you</p>
          <h1 className="text-3xl font-semibold text-white">Discover and register in seconds</h1>
          <p className="text-sm text-indigo-100/80">
            Events curated based on your interests and campus activity. Tap “Register now” to secure your spot instantly.
          </p>
        </motion.header>

        {highlightEvents.length ? (
          <motion.div className="grid gap-6 lg:grid-cols-3" variants={stagger}>
            {highlightEvents.map((event) => (
              <motion.article
                key={event._id}
                variants={fadeUp}
                className="group relative flex h-full flex-col rounded-3xl border border-white/5 bg-[#0b1228]/80 p-6 shadow-lg shadow-indigo-500/10 transition hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-indigo-500/30"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-widest text-indigo-300">
                  <span>{event.category || 'General'}</span>
                  <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold text-indigo-200">Seats left: {Math.max((event.capacity || 0) - (event.registeredCount || 0), 0)}</span>
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-white">{event.title}</h2>
                <p className="mt-3 text-sm text-indigo-100/80 line-clamp-3">{event.description || 'Join us for an engaging session with campus community members.'}</p>
                <div className="mt-6 space-y-2 text-sm text-indigo-100/70">
                  <p>🗓 {dayjs(event.startDate).format('MMMM DD, YYYY')} · {dayjs(event.startDate).format('h:mm A')}</p>
                  <p>📍 {event.venue || 'Campus venue'}</p>
                </div>
                {registeredIds.has(event._id) ? (
                  <p className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100/90">
                    You&apos;re registered, {attendeeName}! We&apos;ve already shared your name, email, and phone with the organiser.
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => handleToggleRegistration(event._id, registeredIds.has(event._id))}
                  disabled={registerMutation.isPending || cancelMutation.isPending}
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-2 text-sm font-semibold shadow transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                    registeredIds.has(event._id)
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-indigo-500 text-white shadow-indigo-500/30 hover:bg-indigo-400'
                  } disabled:opacity-60`}
                >
                  {registerMutation.isPending || cancelMutation.isPending
                    ? 'Processing…'
                    : registeredIds.has(event._id)
                    ? 'Registered — Cancel?'
                    : 'Register now'}
                </button>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={fadeUp} className="rounded-3xl border border-white/5 bg-[#0b1125]/70 p-10 text-center text-indigo-100/80">
            No upcoming events found. Check back soon for new campus activities.
          </motion.div>
        )}

        {otherEvents.length ? (
          <motion.section variants={fadeUp} className="space-y-5">
            <header>
              <h2 className="text-xl font-semibold text-white">More events you might like</h2>
              <p className="text-sm text-indigo-100/70">Browse everything happening across campus and find sessions that match your goals.</p>
            </header>
            <div className="grid gap-6 md:grid-cols-2">
              {otherEvents.map((event) => (
                <article
                  key={event._id}
                  className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-[#0b1228]/70 p-6 text-sm text-indigo-100/80 shadow shadow-indigo-500/10"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-indigo-300">{event.category || 'General'}</span>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-medium text-indigo-200">{dayjs(event.startDate).format('MMM DD')}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                  <p className="line-clamp-3 text-sm text-indigo-100/70">{event.description || 'Short description coming soon.'}</p>
                  {registeredIds.has(event._id) ? (
                    <p className="text-[11px] font-medium text-emerald-200/90">
                      Registered — organiser has your contact details.
                    </p>
                  ) : null}
                  <div className="mt-auto flex items-center justify-between text-xs text-indigo-200/80">
                    <span>{dayjs(event.startDate).format('h:mm A')} · {event.venue || 'Venue TBA'}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleRegistration(event._id, registeredIds.has(event._id))}
                      disabled={registerMutation.isPending || cancelMutation.isPending}
                      className={`font-semibold transition ${
                        registeredIds.has(event._id)
                          ? 'text-slate-300 hover:text-slate-200'
                          : 'text-indigo-300 hover:text-indigo-200'
                      } disabled:opacity-60`}
                    >
                      {registerMutation.isPending || cancelMutation.isPending
                        ? 'Processing…'
                        : registeredIds.has(event._id)
                        ? 'Cancel'
                        : 'Register'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </motion.section>
        ) : null}
      </motion.section>
    </div>
  );
};

export default StudentPortalPage;
