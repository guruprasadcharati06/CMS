import { useMemo } from 'react';
import { Link } from 'react-router-dom';

const AdminApprovalPage = () => {
  const pendingEvents = useMemo(
    () => [
      {
        id: 'req-101',
        title: 'Robotics Club Showcase',
        organizer: 'Alice Johnson (Organizer)',
        submittedOn: 'Oct 12, 2025',
        category: 'Engineering',
        capacity: 150,
      },
      {
        id: 'req-102',
        title: 'Inter-College Debate Finals',
        organizer: 'Debate Council',
        submittedOn: 'Oct 13, 2025',
        category: 'Literary',
        capacity: 400,
      },
      {
        id: 'req-103',
        title: 'Wellness Retreat & Yoga Day',
        organizer: 'Health & Wellness Cell',
        submittedOn: 'Oct 13, 2025',
        category: 'Lifestyle',
        capacity: 120,
      },
    ],
    []
  );

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Admin workspace</p>
          <h1 className="text-3xl font-semibold text-slate-900">Pending approvals</h1>
          <p className="text-sm text-slate-500">
            Review event proposals, ensure clashes are avoided, and publish once campus-ready.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
        >
          Back to organizer overview
        </Link>
      </header>

      <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-[1.5fr,1fr,1fr,1fr,120px] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Event</span>
          <span>Organizer</span>
          <span>Submitted</span>
          <span>Category</span>
          <span>Action</span>
        </div>
        <div className="divide-y divide-slate-200">
          {pendingEvents.map((event) => (
            <div key={event.id} className="grid grid-cols-[1.5fr,1fr,1fr,1fr,120px] items-center gap-4 px-6 py-5 text-sm">
              <div>
                <p className="font-semibold text-slate-900">{event.title}</p>
                <p className="text-xs text-slate-500">Capacity {event.capacity} students</p>
              </div>
              <span className="text-slate-600">{event.organizer}</span>
              <span className="text-slate-600">{event.submittedOn}</span>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-center text-xs font-medium text-indigo-600">
                {event.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="w-full rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-400"
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="w-full rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </article>

      <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6 text-sm text-indigo-600">
        Tip: integrate the backend `PATCH /api/events/:id/approve` endpoint here with optimistic updates using
        `useMutation` for a real-time approval experience.
      </div>
    </section>
  );
};

export default AdminApprovalPage;
