import { Link } from 'react-router-dom';
import useEvents from '../api/useEvents.js';
import dayjs from 'dayjs';

const EventsListPage = () => {
  const {
    data: events,
    isLoading,
    isError,
    error,
    refetch,
  } = useEvents();

  if (isLoading) {
    return (
      <section className="space-y-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Discover campus events</h1>
            <p className="text-sm text-slate-500">
              Filter by category, explore highlights, and reserve your spot in seconds.
            </p>
          </div>
          <div className="h-10 w-32 animate-pulse rounded-full bg-slate-100" />
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <article
              key={index}
              className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="h-3 w-24 rounded-full bg-slate-100" />
              <div className="mt-4 h-6 w-3/4 rounded-full bg-slate-100" />
              <div className="mt-3 h-3 w-40 rounded-full bg-slate-100" />
              <div className="mt-6 h-3 w-28 rounded-full bg-slate-100" />
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="space-y-6 rounded-3xl border border-rose-100 bg-rose-50 p-8 text-rose-700">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">Unable to load events</h1>
          <p className="text-sm">
            {error.message || 'Something went wrong fetching the events. Please try again.'}
          </p>
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

  const hasEvents = events?.length;

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Discover campus events</h1>
          <p className="text-sm text-slate-500">
            Filter by category, explore highlights, and reserve your spot in seconds.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
        >
          Go to dashboard
        </Link>
      </header>

      {hasEvents ? (
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event) => (
            <article key={event._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
                  {event.category || 'General'}
                </span>
                <span className="text-xs font-medium capitalize text-slate-400">{event.status}</span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">{event.title}</h2>
              <p className="mt-3 text-sm text-slate-600">
                {dayjs(event.startDate).format('MMM DD, YYYY · h:mm A')} · {event.venue}
              </p>
              <Link
                to={`/events/${event._id}`}
                className="mt-6 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500"
              >
                View details →
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          No upcoming events found. Check back soon!
        </div>
      )}
    </section>
  );
};

export default EventsListPage;
