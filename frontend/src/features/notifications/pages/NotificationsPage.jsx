const mockNotifications = [
  {
    id: 'note-301',
    title: 'Registration confirmed',
    message: 'You are registered for Tech Summit 2025',
    createdAt: 'Oct 13, 2:26 PM',
    type: 'info',
    isRead: false,
  },
  {
    id: 'note-302',
    title: 'New feedback received',
    message: 'Student One left feedback on Tech Summit 2025',
    createdAt: 'Oct 13, 4:35 PM',
    type: 'update',
    isRead: false,
  },
  {
    id: 'note-303',
    title: 'Check-in successful',
    message: 'QR scan recorded at Auditorium A',
    createdAt: 'Oct 13, 3:06 PM',
    type: 'info',
    isRead: true,
  },
];

const badgeStyles = {
  info: 'bg-sky-100 text-sky-700',
  update: 'bg-indigo-100 text-indigo-700',
  alert: 'bg-rose-100 text-rose-700',
};

const NotificationsPage = () => {
  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500">
            Stay on top of registrations, approvals, and schedule updates across your college events.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
        >
          Mark all as read
        </button>
      </header>

      <div className="space-y-4">
        {mockNotifications.map((notification) => (
          <article
            key={notification.id}
            className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200 ${
              notification.isRead ? 'opacity-80' : 'ring-1 ring-indigo-100'
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      badgeStyles[notification.type] || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {notification.type}
                  </span>
                  {!notification.isRead && (
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-600">
                      new
                    </span>
                  )}
                </div>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">{notification.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
              </div>
              <time className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {notification.createdAt}
              </time>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
              >
                View details
              </button>
              <button
                type="button"
                className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-rose-600 hover:bg-rose-50"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default NotificationsPage;
