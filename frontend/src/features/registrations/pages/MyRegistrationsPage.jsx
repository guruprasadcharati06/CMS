import dayjs from 'dayjs';
import { useMemo } from 'react';
import useMyRegistrations from '../api/useMyRegistrations.js';

const statusStyles = {
  confirmed: 'bg-sky-100 text-sky-700',
  checked_in: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
  pending: 'bg-amber-100 text-amber-700',
};

const MyRegistrationsPage = () => {
  const { data: registrations = [], isLoading, isError, error, refetch } = useMyRegistrations();

  const groupedRegistrations = useMemo(() => {
    const upcoming = [];
    const past = [];
    registrations.forEach((registration) => {
      if (!registration.event) return;
      const eventDate = dayjs(registration.event.startDate);
      if (eventDate.isAfter(dayjs())) {
        upcoming.push(registration);
      } else {
        past.push(registration);
      }
    });
    return { upcoming, past };
  }, [registrations]);

  if (isLoading) {
    return (
      <section className="space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold text-slate-900">My registrations</h1>
          <p className="text-sm text-slate-500">Loading your event activity…</p>
        </header>
        <div className="grid gap-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <article key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-3 h-6 w-2/3 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((__ , idx) => (
                  <div key={idx} className="h-10 animate-pulse rounded-full bg-slate-100" />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="space-y-6 rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">Unable to load registrations</h1>
          <p className="text-sm">{error.message || 'Please try refreshing the page.'}</p>
        </header>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center justify-center rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-rose-500"
        >
          Retry
        </button>
      </section>
    );
  }

  const renderSection = (items, title, emptyText) => (
    <section className="space-y-4" key={title}>
      <header className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{items.length ? `You have ${items.length} event${items.length > 1 ? 's' : ''} in this section.` : emptyText}</p>
      </header>
      {items.length ? (
        <div className="grid gap-5">
          {items.map((registration) => {
            const event = registration.event;
            const statusKey = registration.status?.toLowerCase();
            const statusClass = statusStyles[statusKey] || 'bg-slate-100 text-slate-600';
            const eventDate = dayjs(event?.startDate);

            return (
              <article key={registration._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                      {eventDate.isValid() ? eventDate.format('MMM DD, YYYY · h:mm A') : 'Schedule TBA'}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">{event?.title || 'Untitled event'}</h3>
                    <p className="mt-2 text-sm text-slate-500">{event?.venue || 'Venue to be announced'}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold ${statusClass}`}>
                    {registration.status?.replace('_', ' ') || 'Status unknown'}
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    View ticket
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Add to calendar
                  </button>
                  <button
                    type="button"
                    className={`rounded-full px-4 py-2 font-semibold ${
                      registration.feedbackSubmitted
                        ? 'border border-emerald-200 text-emerald-600'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500'
                    }`}
                  >
                    {registration.feedbackSubmitted ? 'Feedback submitted' : 'Share feedback'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          {emptyText}
        </div>
      )}
    </section>
  );

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">My registrations</h1>
        <p className="text-sm text-slate-500">
          View your upcoming and past events. Provide feedback to help organizers improve future experiences.
        </p>
      </header>

      {renderSection(groupedRegistrations.upcoming, 'Upcoming', 'You have not registered for upcoming events yet.')}
      {renderSection(groupedRegistrations.past, 'Past events', 'No past events yet. Attend events to see them here.')}
    </div>
  );
};

export default MyRegistrationsPage;
