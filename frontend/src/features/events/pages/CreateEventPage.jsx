import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import useCreateEvent from '../api/useCreateEvent.js';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().optional(),
  venue: z.string().min(3, 'Venue is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  capacity: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : undefined))
    .refine((value) => value === undefined || (!Number.isNaN(value) && value > 0), 'Capacity must be a positive number'),
  requiresApproval: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

const CreateEventPage = () => {
  const navigate = useNavigate();
  const createEvent = useCreateEvent({
    onSuccess: (event) => {
      toast.success('Event draft submitted for approval');
      navigate(`/events/${event._id}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create event');
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      venue: '',
      startDate: '',
      endDate: '',
      capacity: '',
      requiresApproval: true,
      isFeatured: false,
    },
  });

  const startDateValue = watch('startDate');
  const endDateValue = watch('endDate');

  const onSubmit = (values) => {
    const payload = {
      title: values.title,
      description: values.description,
      category: values.category || undefined,
      venue: values.venue,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
      capacity: values.capacity,
      requiresApproval: values.requiresApproval,
      isFeatured: values.isFeatured,
    };

    createEvent.mutate(payload);
  };

  const isDurationValid = useMemo(() => {
    if (!startDateValue || !endDateValue) return true;
    const start = new Date(startDateValue);
    const end = new Date(endDateValue);
    return Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end >= start;
  }, [startDateValue, endDateValue]);

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Organizer tools</p>
        <h1 className="text-3xl font-semibold text-slate-900">Create a new event</h1>
        <p className="text-sm text-slate-500">
          Submit your event draft for approval. Once approved, students will be notified automatically.
        </p>
        <Link to="/dashboard" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
          ← Back to organizer dashboard
        </Link>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-semibold text-slate-700">
              Event title
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="Tech Summit 2025"
            />
            {errors.title && <p className="text-sm text-rose-600">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              placeholder="Share details about the agenda, speakers, and expected audience..."
            />
            {errors.description && <p className="text-sm text-rose-600">{errors.description.message}</p>}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-semibold text-slate-700">
                Category
              </label>
              <input
                id="category"
                type="text"
                {...register('category')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="Technology"
              />
              {errors.category && <p className="text-sm text-rose-600">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="venue" className="text-sm font-semibold text-slate-700">
                Venue
              </label>
              <input
                id="venue"
                type="text"
                {...register('venue')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="Auditorium A"
              />
              {errors.venue && <p className="text-sm text-rose-600">{errors.venue.message}</p>}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-semibold text-slate-700">
                Start date & time
              </label>
              <input
                id="startDate"
                type="datetime-local"
                {...register('startDate')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              {errors.startDate && <p className="text-sm text-rose-600">{errors.startDate.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="endDate" className="text-sm font-semibold text-slate-700">
                End date & time
              </label>
              <input
                id="endDate"
                type="datetime-local"
                {...register('endDate')}
                className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 ${
                  isDurationValid ? 'border-slate-200' : 'border-rose-300'
                }`}
              />
              {!isDurationValid && (
                <p className="text-sm text-rose-600">End time must be after the start time</p>
              )}
              {errors.endDate && <p className="text-sm text-rose-600">{errors.endDate.message}</p>}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="capacity" className="text-sm font-semibold text-slate-700">
                Capacity
              </label>
              <input
                id="capacity"
                type="number"
                min="1"
                {...register('capacity')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                placeholder="200"
              />
              {errors.capacity && <p className="text-sm text-rose-600">{errors.capacity.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Permissions</label>
              <div className="space-y-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-600">
                <label className="flex items-center gap-3">
                  <input type="checkbox" {...register('requiresApproval')} className="h-4 w-4 rounded border-slate-300" />
                  Requires admin approval
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" {...register('isFeatured')} className="h-4 w-4 rounded border-slate-300" />
                  Mark as featured (admin only)
                </label>
              </div>
            </div>
          </div>
        </div>

        <footer className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            You can update event details or cancel it later from the organizer dashboard.
          </p>
          <button
            type="submit"
            disabled={createEvent.isPending || !isDurationValid}
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-indigo-500 disabled:opacity-60"
          >
            {createEvent.isPending ? 'Submitting...' : 'Submit for approval'}
          </button>
        </footer>
      </form>
    </section>
  );
};

export default CreateEventPage;
