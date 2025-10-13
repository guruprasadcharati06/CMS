import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import useEvent from '../api/useEvent.js';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const {
    data: event,
    isLoading,
    isError,
    error,
    refetch,
  } = useEvent(eventId);

  const scheduleText = useMemo(() => {
    if (!event?.startDate || !event?.endDate) return 'Schedule TBA';
    const start = dayjs(event.startDate);
    const end = dayjs(event.endDate);
    if (!start.isValid() || !end.isValid()) return 'Schedule TBA';
    const sameDay = start.isSame(end, 'day');
    if (sameDay) {
      return `${start.format('MMM DD · h:mm A')} to ${end.format('h:mm A')}`;
    }
    return `${start.format('MMM DD · h:mm A')} — ${end.format('MMM DD · h:mm A')}`;
  }, [event?.startDate, event?.endDate]);

  if (isLoading) {
    return (
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <div className="h-3 w-32 animate-pulse rounded-full bg-slate-100" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
          </div>
          <div className="space-y-3">
            <div className="h-8 w-3/4 animate-pulse rounded-full bg-slate-100" />
            <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-100" />
          </div>
          <div className="grid gap-4 rounded-2xl bg-slate-50 p-6 text-sm text-slate-600 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200" />
                <div className="h-3 w-32 animate-pulse rounded-full bg-slate-200" />
              </div>
            ))}
          </div>
          <div className="h-11 w-36 animate-pulse rounded-full bg-slate-100" />
        </section>
        <aside className="space-y-5">
          {Array.from({ length: 2 }).map((_, index) => (
            <article key={index} className="h-40 animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" />
          ))}
        </aside>
      </div>
    );
  }

  if (isError) {
    return (
      <section className="space-y-6 rounded-3xl border border-rose-100 bg-rose-50 p-8 text-rose-700">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">Unable to load event</h1>
          <p className="text-sm">{error.message || 'Please try refreshing the page.'}</p>
        </header>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex w-fit items-center justify-center rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-rose-500"
        >
          Retry
        </button>
      </section>
    );
  }

  if (!event) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
        Event not found.
      </section>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <span>Event ID: {event._id}</span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 font-medium capitalize text-indigo-600">
            {event.status}
          </span>
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-slate-900">{event.title}</h1>
          <p className="text-sm uppercase tracking-widest text-indigo-500">
            {event.category || 'General'}
          </p>
          <p className="text-slate-600">{event.description || 'No description provided yet.'}</p>
        </div>
        <dl className="grid gap-4 rounded-2xl bg-slate-50 p-6 text-sm text-slate-600 sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-slate-900">Schedule</dt>
            <dd>{scheduleText}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Venue</dt>
            <dd>{event.venue}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Capacity</dt>
            <dd>
              {event.capacity} seats · {event.registeredCount} booked
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Organizer</dt>
            <dd>{event.organizer?.name || 'TBA'}</dd>
          </div>
        </dl>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500"
        >
          Register now
        </button>
      </section>
      <aside className="space-y-5">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Quick stats</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>• Approved on {dayjs(event.updatedAt).format('MMM DD, YYYY')}</li>
            <li>• Requires approval: {event.requiresApproval ? 'Yes' : 'No'}</li>
            <li>• Featured event: {event.isFeatured ? 'Yes' : 'No'}</li>
            <li>• Created by {event.organizer?.email || 'organizer'} </li>
          </ul>
        </article>
        <article className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6 text-sm text-indigo-600">
          Organizers can manage registrations, send updates, and monitor feedback directly from the dashboard.
        </article>
      </aside>
    </div>
  );
};

export default EventDetailPage;
