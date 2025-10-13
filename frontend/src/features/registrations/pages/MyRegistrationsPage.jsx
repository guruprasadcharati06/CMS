const sampleRegistrations = [
  {
    id: 'reg-201',
    title: 'Tech Summit 2025',
    status: 'Checked in',
    date: 'Oct 25, 2025',
    feedback: true,
  },
  {
    id: 'reg-202',
    title: 'Cultural Fiesta',
    status: 'Confirmed',
    date: 'Nov 02, 2025',
    feedback: false,
  },
];

const statusStyles = {
  Confirmed: 'bg-sky-100 text-sky-700',
  'Checked in': 'bg-emerald-100 text-emerald-700',
  Cancelled: 'bg-rose-100 text-rose-700',
};

const MyRegistrationsPage = () => {
  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">My registrations</h1>
        <p className="text-sm text-slate-500">
          View your upcoming and past events. Provide feedback to help organizers improve future experiences.
        </p>
      </header>

      <div className="grid gap-5">
        {sampleRegistrations.map((registration) => (
          <article key={registration.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {registration.date}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{registration.title}</h2>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold ${
                  statusStyles[registration.status] || 'bg-slate-100 text-slate-600'
                }`}
              >
                {registration.status}
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
                  registration.feedback
                    ? 'border border-emerald-200 text-emerald-600'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {registration.feedback ? 'Feedback submitted' : 'Share feedback'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default MyRegistrationsPage;
