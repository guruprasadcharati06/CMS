import { Link } from 'react-router-dom';

const sampleEvents = [
  {
    id: 'demo-1',
    title: 'Tech Summit 2025',
    category: 'Technology',
    startDate: 'October 25, 2025',
    venue: 'Auditorium A',
    status: 'Approved',
  },
  {
    id: 'demo-2',
    title: 'Cultural Fiesta',
    category: 'Arts & Culture',
    startDate: 'November 02, 2025',
    venue: 'Main Quadrangle',
    status: 'Approved',
  },
  {
    id: 'demo-3',
    title: 'Startup Pitch Night',
    category: 'Entrepreneurship',
    startDate: 'October 30, 2025',
    venue: 'Innovation Hub',
    status: 'Pending Approval',
  },
];

const EventsListPage = () => {
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

      <div className="grid gap-6 md:grid-cols-2">
        {sampleEvents.map((event) => (
          <article key={event.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">{event.category}</span>
              <span className="text-xs font-medium text-slate-400">{event.status}</span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">{event.title}</h2>
            <p className="mt-3 text-sm text-slate-600">
              {event.startDate} · {event.venue}
            </p>
            <Link
              to={`/events/${event.id}`}
              className="mt-6 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500"
            >
              View details →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default EventsListPage;
