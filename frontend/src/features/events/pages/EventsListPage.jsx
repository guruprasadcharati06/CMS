import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import useEvents from '../api/useEvents.js';
import CreateEventModal from '../components/CreateEventModal.jsx';
import { useAuth } from '../../auth/AuthProvider.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const skeletonCards = Array.from({ length: 4 });

const EventsListPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const {
    data: events,
    isLoading,
    isError,
    error,
    refetch,
  } = useEvents();

  const highlightCards = [
    {
      title: 'Sponsor slots',
      description: 'Tech Innovators Summit spots are now live.',
    },
    {
      title: 'Leaderboard reset',
      description: 'Referral leaderboard resets every Monday at 9:00 AM.',
    },
    {
      title: 'Calendar sync',
      description: 'Sync events with Google Calendar from detail pages.',
    },
  ];

  const renderSkeleton = () => (
    <section className="space-y-10">
      <motion.div
        className="grid gap-6 lg:grid-cols-[2.2fr,1fr]"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.article className="rounded-3xl border border-white/5 bg-[#0b1125]/80 p-8 shadow-lg shadow-indigo-500/5" variants={fadeUp}>
          <div className="h-4 w-28 rounded-full bg-white/10" />
          <div className="mt-4 h-9 w-3/4 rounded-full bg-white/10" />
          <div className="mt-3 h-4 w-2/3 rounded-full bg-white/10" />
          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-12 rounded-2xl bg-white/10" />
            ))}
          </div>
        </motion.article>
        <motion.aside className="grid gap-4" variants={fadeUp}>
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="h-28 rounded-3xl border border-white/5 bg-[#0b1125]/60" />
          ))}
        </motion.aside>
      </motion.div>

      <motion.div className="grid gap-6 lg:grid-cols-2" initial="hidden" animate="visible" variants={stagger}>
        {skeletonCards.map((_, index) => (
          <motion.article
            key={index}
            className="h-56 rounded-3xl border border-white/5 bg-[#0b1125]/70 p-6 shadow-lg shadow-indigo-500/5"
            variants={fadeUp}
          >
            <div className="h-4 w-20 rounded-full bg-white/10" />
            <div className="mt-4 h-7 w-3/4 rounded-full bg-white/10" />
            <div className="mt-3 h-4 w-1/2 rounded-full bg-white/10" />
            <div className="mt-8 h-10 w-32 rounded-full bg-white/10" />
          </motion.article>
        ))}
      </motion.div>
    </section>
  );

  if (isLoading) {
    return renderSkeleton();
  }

  if (isError) {
    return (
      <motion.section
        className="space-y-6 rounded-3xl border border-rose-500/40 bg-rose-500/10 p-8 text-rose-100"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">Unable to load events</h1>
          <p className="text-sm">{error.message || 'Something went wrong fetching the events. Please try again.'}</p>
        </header>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex w-fit items-center justify-center rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-rose-400"
        >
          Retry
        </button>
      </motion.section>
    );
  }

  const hasEvents = events?.length;

  return (
    <motion.section className="space-y-10" initial="hidden" animate="visible" variants={stagger}>
      <motion.div className="grid gap-6 lg:grid-cols-[2.2fr,1fr]" variants={fadeUp}>
        <motion.article className="rounded-3xl border border-white/5 bg-[#0b1125]/80 p-8 shadow-xl shadow-indigo-500/10" variants={fadeUp}>
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.3em] text-indigo-300">Campus hub</p>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">Discover events</h1>
              <p className="text-sm text-indigo-100/90">Find events that match your interests and RSVP to secure your seat.</p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Go to dashboard
              </Link>
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(true)}
                  className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
                >
                  Create event
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-4">
            {[
              { label: 'Search', value: 'Search events...' },
              { label: 'Category', value: 'All categories' },
              { label: 'Organizer', value: 'All organizers' },
              { label: 'Date range', value: 'Upcoming events' },
            ].map((filter) => (
              <div
                key={filter.label}
                className="rounded-2xl border border-white/10 bg-[#0c1430] px-4 py-3 text-xs text-indigo-100/80 shadow-inner shadow-indigo-500/10"
              >
                <p className="text-[11px] uppercase tracking-widest text-indigo-300/80">{filter.label}</p>
                <p className="mt-2 text-sm font-medium text-white/90">{filter.value}</p>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.aside className="grid gap-4" variants={stagger}>
          <motion.div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/10 p-6 text-sm text-indigo-100 shadow-lg shadow-indigo-500/10" variants={fadeUp}>
            Notifications will appear here as users register, cancel, or receive updates.
          </motion.div>
          <motion.div className="rounded-3xl border border-white/5 bg-[#0b1125]/70 p-6 shadow-lg shadow-indigo-500/10" variants={fadeUp}>
            <h3 className="text-sm font-semibold text-white">Upcoming highlights</h3>
            <div className="mt-4 space-y-3 text-xs text-indigo-100/80">
              {highlightCards.map((card) => (
                <div key={card.title} className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                  <p className="font-semibold text-white/90">{card.title}</p>
                  <p className="mt-1 text-[13px] text-indigo-100/80">{card.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.aside>
      </motion.div>

      {hasEvents ? (
        <motion.div className="grid gap-6 lg:grid-cols-2" variants={stagger}>
          {events.map((event) => (
            <motion.article
              key={event._id}
              className="rounded-3xl border border-white/5 bg-[#0b1228]/80 p-6 shadow-xl shadow-indigo-500/10 transition hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-indigo-500/30"
              variants={fadeUp}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-indigo-300">{event.category || 'General'}</span>
                <span className="text-xs font-medium capitalize text-indigo-200/80">{event.status}</span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-white">{event.title}</h2>
              <p className="mt-3 text-sm text-indigo-100/80">
                {dayjs(event.startDate).format('MMM DD, YYYY · h:mm A')} · {event.venue}
              </p>
              <Link
                to={`/events/${event._id}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 transition hover:text-indigo-200"
              >
                View details
                <span aria-hidden="true">→</span>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="rounded-3xl border border-white/5 bg-[#0b1125]/80 p-10 text-center text-indigo-100/80"
          variants={fadeUp}
        >
          No events match the current filters. Try adjusting your search.
        </motion.div>
      )}
      {isAuthenticated && <CreateEventModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />}
    </motion.section>
  );
};

export default EventsListPage;
