import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import useEvents from '../../events/api/useEvents.js';
import useApproveEvent from '../../events/api/useApproveEvent.js';

const AdminApprovalPage = () => {
  const {
    data: pendingEvents,
    isLoading,
    isError,
    error,
    refetch,
  } = useEvents({ status: 'pending' });

  const approveMutation = useApproveEvent({
    onSuccess: (event) => {
      toast.success(`${event.title} approved`);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to approve event');
    },
  });

  const handleApprove = (eventId) => {
    approveMutation.mutate(eventId);
  };

  const header = (
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
  );

  if (isLoading) {
    return (
      <section className="space-y-8">
        {header}
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-[1.5fr,1fr,1fr,1fr,120px] gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>Event</span>
            <span>Organizer</span>
            <span>Submitted</span>
            <span>Category</span>
            <span>Action</span>
          </div>
          <div className="divide-y divide-slate-200">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="grid grid-cols-[1.5fr,1fr,1fr,1fr,120px] items-center gap-4 px-6 py-5">
                <div className="h-5 w-3/4 animate-pulse rounded-full bg-slate-100" />
                <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-100" />
                <div className="h-4 w-24 animate-pulse rounded-full bg-slate-100" />
                <div className="h-4 w-20 animate-pulse rounded-full bg-slate-100" />
                <div className="flex items-center gap-2">
                  <div className="h-8 w-20 animate-pulse rounded-full bg-slate-100" />
                  <div className="h-8 w-20 animate-pulse rounded-full bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="space-y-6 rounded-3xl border border-rose-100 bg-rose-50 p-8 text-rose-700">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">Unable to fetch pending events</h1>
          <p className="text-sm">{error.message || 'Please try again in a moment.'}</p>
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

  const noPendingEvents = !pendingEvents?.length;

  return (
    <section className="space-y-8">
      {header}

      {approveMutation.isError && (
        <div className="rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600">
          {approveMutation.error?.message || 'Failed to approve event. Please try again.'}
        </div>
      )}

      {noPendingEvents ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          All caught up! There are no pending events awaiting approval.
        </div>
      ) : (
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
              <div key={event._id} className="grid grid-cols-[1.5fr,1fr,1fr,1fr,120px] items-center gap-4 px-6 py-5 text-sm">
                <div>
                  <p className="font-semibold text-slate-900">{event.title}</p>
                  <p className="text-xs text-slate-500">Capacity {event.capacity} students</p>
                </div>
                <span className="text-slate-600">{event.organizer?.name || 'Organizer'}</span>
                <span className="text-slate-600">{dayjs(event.createdAt).format('MMM DD, YYYY')}</span>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-center text-xs font-medium text-indigo-600">
                  {event.category || 'General'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(event._id)}
                    disabled={approveMutation.isPending && approveMutation.variables === event._id}
                    className="w-full rounded-full bg-emerald-500 px-3 py-2 text-xs font-semibold text-white shadow transition hover:bg-emerald-400 disabled:opacity-60"
                  >
                    {approveMutation.isPending && approveMutation.variables === event._id
                      ? 'Approving...'
                      : 'Approve'}
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
      )}

      <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6 text-sm text-indigo-600">
        Tip: integrate the backend `PATCH /api/events/:id/reject` endpoint for the reject action and consider optimistic
        updates for an even smoother admin experience.
      </div>
    </section>
  );
};

export default AdminApprovalPage;
