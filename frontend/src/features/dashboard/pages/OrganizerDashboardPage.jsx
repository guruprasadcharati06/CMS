import { Link } from 'react-router-dom';
import { ChartBarIcon, ClipboardDocumentCheckIcon, MegaphoneIcon } from '@heroicons/react/24/outline';

const OrganizerDashboardPage = () => {
  const stats = [
    {
      title: 'Active events',
      value: '3',
      change: '+2 this week',
      icon: MegaphoneIcon,
    },
    {
      title: 'Registrations today',
      value: '128',
      change: '+14% vs yesterday',
      icon: ClipboardDocumentCheckIcon,
    },
    {
      title: 'Feedback score',
      value: '4.8 / 5',
      change: 'Based on 236 responses',
      icon: ChartBarIcon,
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Organizer overview</h1>
          <p className="text-sm text-slate-500">
            Monitor registrations, approvals, and engagement to keep every event running smoothly.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/events"
            className="inline-flex items-center justify-center rounded-full border border-indigo-200 px-5 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"
          >
            View events
          </Link>
          <Link
            to="/dashboard/events/new"
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
          >
            Create event
          </Link>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {stats.map(({ title, value, change, icon: Icon }) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
              </div>
              <span className="rounded-full bg-indigo-50 p-3 text-indigo-600">
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-sm text-indigo-600">{change}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming schedule</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>• Tech Summit 2025 — approvals complete, registration at 85%</li>
            <li>• Cultural Fiesta — awaiting final venue confirmation</li>
            <li>• Startup Pitch Night — marketing emails queued for tomorrow</li>
          </ul>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Action items</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>• Approve 3 pending workshop proposals</li>
            <li>• Review 9 new feedback submissions</li>
            <li>• Publish push notification for venue change</li>
          </ul>
        </article>
      </section>
    </div>
  );
};

export default OrganizerDashboardPage;
