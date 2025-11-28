import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import useEvents from '../../events/api/useEvents.js';
import useApproveEvent from '../../events/api/useApproveEvent.js';
import useRejectEvent from '../../events/api/useRejectEvent.js';

const AdminApprovalPage = () => {
  const queryClient = useQueryClient();

  const pendingParams = useMemo(() => ({ status: 'pending' }), []);
  const approvedParams = useMemo(() => ({ status: 'approved' }), []);
  const rejectedParams = useMemo(() => ({ status: 'rejected' }), []);

  const pendingKey = ['events', pendingParams];
  const approvedKey = ['events', approvedParams];
  const rejectedKey = ['events', rejectedParams];

  const {
    data: pendingData,
    isLoading: isPendingLoading,
    isError: isPendingError,
    error: pendingError,
    refetch: refetchPending,
  } = useEvents(pendingParams);

  const {
    data: approvedData,
    isLoading: isApprovedLoading,
    isError: isApprovedError,
    error: approvedError,
    refetch: refetchApproved,
  } = useEvents(approvedParams);

  const {
    data: rejectedData,
    isLoading: isRejectedLoading,
    isError: isRejectedError,
    error: rejectedError,
    refetch: refetchRejected,
  } = useEvents(rejectedParams);

  const pendingEvents = pendingData ?? [];
  const approvedEvents = approvedData ?? [];
  const rejectedEvents = rejectedData ?? [];

  const approveMutation = useApproveEvent({
    onMutate: async (eventId) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: pendingKey }),
        queryClient.cancelQueries({ queryKey: approvedKey }),
      ]);

      const previousPending = queryClient.getQueryData(pendingKey) ?? [];
      const previousApproved = queryClient.getQueryData(approvedKey) ?? [];

      const eventToMove = previousPending.find((event) => event._id === eventId);

      queryClient.setQueryData(
        pendingKey,
        previousPending.filter((event) => event._id !== eventId)
      );

      if (eventToMove) {
        queryClient.setQueryData(approvedKey, [eventToMove, ...previousApproved]);
      }

      return { previousPending, previousApproved };
    },
    onError: (error, _eventId, context) => {
      queryClient.setQueryData(pendingKey, context?.previousPending);
      queryClient.setQueryData(approvedKey, context?.previousApproved);

      const message =
        error.message === 'Forbidden'
          ? 'You need an admin account to approve events.'
          : error.message || 'Failed to approve event';
      toast.error(message);
    },
    onSuccess: (event) => {
      toast.success(`${event.title} approved`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: pendingKey });
      queryClient.invalidateQueries({ queryKey: approvedKey });
    },
  });

  const rejectMutation = useRejectEvent({
    onMutate: async (eventId) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: pendingKey }),
        queryClient.cancelQueries({ queryKey: rejectedKey }),
      ]);

      const previousPending = queryClient.getQueryData(pendingKey) ?? [];
      const previousRejected = queryClient.getQueryData(rejectedKey) ?? [];

      const eventToMove = previousPending.find((event) => event._id === eventId);

      queryClient.setQueryData(
        pendingKey,
        previousPending.filter((event) => event._id !== eventId)
      );

      if (eventToMove) {
        queryClient.setQueryData(rejectedKey, [eventToMove, ...previousRejected]);
      }

      return { previousPending, previousRejected };
    },
    onError: (error, _eventId, context) => {
      queryClient.setQueryData(pendingKey, context?.previousPending);
      queryClient.setQueryData(rejectedKey, context?.previousRejected);

      const message =
        error.message === 'Forbidden'
          ? 'You need an admin account to reject events.'
          : error.message || 'Failed to reject event';
      toast.error(message);
    },
    onSuccess: (event) => {
      toast.success(`${event.title} rejected`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: pendingKey });
      queryClient.invalidateQueries({ queryKey: rejectedKey });
    },
  });

  const handleApprove = (eventId) => {
    approveMutation.mutate(eventId);
  };

  const handleReject = (eventId) => {
    rejectMutation.mutate(eventId);
  };

  const header = (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Admin workspace</p>
        <h1 className="text-3xl font-semibold text-slate-900">Event approvals</h1>
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

  const isAnyLoading = isPendingLoading || isApprovedLoading || isRejectedLoading;
  const isAnyError = isPendingError || isApprovedError || isRejectedError;
  const errorMessage = pendingError?.message || approvedError?.message || rejectedError?.message;

  const refetchAll = () => {
    refetchPending();
    refetchApproved();
    refetchRejected();
  };

  if (isAnyLoading) {
    return (
      <section className="space-y-8">
        {header}
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <article
              key={index}
              className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="h-4 w-32 animate-pulse rounded-full bg-slate-100" />
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((__, cardIndex) => (
                  <div key={cardIndex} className="space-y-3 rounded-2xl border border-slate-100 p-4">
                    <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-100" />
                    <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-100" />
                    <div className="flex gap-2">
                      <div className="h-8 w-24 animate-pulse rounded-full bg-slate-100" />
                      <div className="h-8 w-24 animate-pulse rounded-full bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (isAnyError) {
    return (
      <section className="space-y-6 rounded-3xl border border-rose-100 bg-rose-50 p-8 text-rose-700">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold">Unable to load approvals</h1>
          <p className="text-sm">{errorMessage || 'Please try again in a moment.'}</p>
        </header>
        <button
          type="button"
          onClick={refetchAll}
          className="inline-flex w-fit items-center justify-center rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-rose-500"
        >
          Retry
        </button>
      </section>
    );
  }

  const sections = [
    {
      key: 'pending',
      title: 'Pending approval',
      description: 'Requests waiting on admin review.',
      badgeClass: 'bg-amber-100 text-amber-700',
      events: pendingEvents,
      emptyState: 'All caught up! There are no pending events awaiting approval.',
      renderActions: (event) => {
        const isApproving = approveMutation.isPending && approveMutation.variables === event._id;
        const isRejecting = rejectMutation.isPending && rejectMutation.variables === event._id;

        return (
          <div className="flex flex-wrap gap-2 pt-4">
            <button
              type="button"
              onClick={() => handleApprove(event._id)}
              disabled={isApproving || isRejecting}
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {isApproving ? 'Approving…' : 'Approve'}
            </button>
            <button
              type="button"
              onClick={() => handleReject(event._id)}
              disabled={isRejecting || isApproving}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
            >
              {isRejecting ? 'Rejecting…' : 'Reject'}
            </button>
          </div>
        );
      },
    },
    {
      key: 'approved',
      title: 'Approved',
      description: 'Recently published events ready for campus visibility.',
      badgeClass: 'bg-emerald-100 text-emerald-700',
      events: approvedEvents,
      emptyState: 'No events have been approved yet. Approvals will appear here instantly.',
    },
    {
      key: 'rejected',
      title: 'Rejected',
      description: 'Events that were declined and may need organizer revisions.',
      badgeClass: 'bg-rose-100 text-rose-700',
      events: rejectedEvents,
      emptyState: 'No events are currently rejected.',
    },
  ];

  return (
    <section className="space-y-8">
      {header}

      <div className="grid gap-6 xl:grid-cols-3">
        {sections.map((section) => (
          <article
            key={section.key}
            className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <header className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
                  <p className="text-sm text-slate-500">{section.description}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${section.badgeClass}`}>
                  {section.events.length}
                </span>
              </div>
            </header>

            {section.events.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                {section.emptyState}
              </div>
            ) : (
              <div className="space-y-4">
                {section.events.map((event) => (
                  <div
                    key={event._id}
                    className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">{event.title}</h3>
                          <p className="text-xs text-slate-500">
                            Submitted {dayjs(event.createdAt).format('MMM DD, YYYY [at] h:mm A')}
                          </p>
                        </div>
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                          {event.category || 'General'}
                        </span>
                      </div>

                      <div className="grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                        <span>
                          Organizer: <span className="font-medium text-slate-700">{event.organizer?.name || 'Organizer'}</span>
                        </span>
                        <span>
                          Capacity: <span className="font-medium text-slate-700">{event.capacity || '—'}</span>
                        </span>
                        <span>
                          Starts: <span className="font-medium text-slate-700">{dayjs(event.startDate).format('MMM DD, YYYY h:mm A')}</span>
                        </span>
                        <span>
                          Ends: <span className="font-medium text-slate-700">{dayjs(event.endDate).format('MMM DD, YYYY h:mm A')}</span>
                        </span>
                      </div>
                    </div>

                    {section.renderActions ? (
                      section.renderActions(event)
                    ) : (
                      <div className="flex justify-end">
                        <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold capitalize text-slate-500">
                          {event.status}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default AdminApprovalPage;
