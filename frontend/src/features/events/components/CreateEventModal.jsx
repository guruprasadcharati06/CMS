import { useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import useCreateEvent from '../api/useCreateEvent.js';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
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

const suggestionSlots = Array.from({ length: 3 }).map((_, idx) =>
  dayjs().add(idx + 1, 'day').hour(18).minute(0).second(0).millisecond(0)
);

const modalVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: { opacity: 0, y: 20, scale: 0.98, transition: { duration: 0.2 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const CreateEventModal = ({ open, onClose }) => {
  const createEvent = useCreateEvent({
    onSuccess: (event) => {
      toast.success('Event draft submitted for approval');
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create event');
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
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

  const isDurationValid = useMemo(() => {
    if (!startDateValue || !endDateValue) return true;
    const start = new Date(startDateValue);
    const end = new Date(endDateValue);
    return Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end >= start;
  }, [startDateValue, endDateValue]);

  const onSubmit = (values) => {
    if (!isDurationValid) {
      toast.error('End time must be after the start time');
      return;
    }

    createEvent.mutate({
      title: values.title,
      description: values.description,
      category: values.category,
      venue: values.venue,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
      capacity: values.capacity,
      requiresApproval: values.requiresApproval,
      isFeatured: values.isFeatured,
    });
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      reset();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, reset]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur"
        >
          <motion.div
            variants={modalVariants}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#09122a]/95 p-8 shadow-2xl shadow-indigo-900/40"
          >
            <header className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-300">Quick create event</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Draft an event</h2>
                <p className="mt-2 text-sm text-indigo-100/80">
                  Fill in essentials now. You can refine schedules, promotions, and visibility later.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-100/80 transition hover:bg-white/10"
              >
                Close
              </button>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div className="grid gap-5">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-semibold text-indigo-100">
                    Event title
                  </label>
                  <input
                    id="title"
                    type="text"
                    {...register('title')}
                    className="w-full rounded-2xl border border-white/10 bg-[#0c1735] px-4 py-3 text-sm text-white placeholder:text-indigo-100/30 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    placeholder="Tech Leadership Panel"
                  />
                  {errors.title && <p className="text-xs text-rose-400">{errors.title.message}</p>}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-semibold text-indigo-100">
                      Category
                    </label>
                    <input
                      id="category"
                      type="text"
                      {...register('category')}
                      className="w-full rounded-2xl border border-white/10 bg-[#0c1735] px-4 py-3 text-sm text-white placeholder:text-indigo-100/30 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      placeholder="Workshop"
                    />
                    {errors.category && <p className="text-xs text-rose-400">{errors.category.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="capacity" className="text-sm font-semibold text-indigo-100">
                      Capacity
                    </label>
                    <input
                      id="capacity"
                      type="number"
                      min="1"
                      {...register('capacity')}
                      className="w-full rounded-2xl border border-white/10 bg-[#0c1735] px-4 py-3 text-sm text-white placeholder:text-indigo-100/30 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                      placeholder="150"
                    />
                    {errors.capacity && <p className="text-xs text-rose-400">{errors.capacity.message}</p>}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="startDate" className="text-sm font-semibold text-indigo-100">
                      Starts at
                    </label>
                    <input
                      id="startDate"
                      type="datetime-local"
                      {...register('startDate')}
                      className="w-full rounded-2xl border border-white/10 bg-[#0c1735] px-4 py-3 text-sm text-white placeholder:text-indigo-100/30 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    />
                    {errors.startDate && <p className="text-xs text-rose-400">{errors.startDate.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="endDate" className="text-sm font-semibold text-indigo-100">
                      Ends at
                    </label>
                    <input
                      id="endDate"
                      type="datetime-local"
                      {...register('endDate')}
                      className={`w-full rounded-2xl border px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                        isDurationValid ? 'border-white/10 bg-[#0c1735]' : 'border-rose-400/70 bg-[#1b0c1b]'
                      }`}
                    />
                    {!isDurationValid && <p className="text-xs text-rose-400">End time must be after the start time</p>}
                    {errors.endDate && <p className="text-xs text-rose-400">{errors.endDate.message}</p>}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {suggestionSlots.map((slot) => (
                    <button
                      key={slot.toISOString()}
                      type="button"
                      onClick={() => {
                        const iso = slot.toISOString().slice(0, 16);
                        reset((prev) => ({ ...prev, startDate: iso, endDate: iso }));
                      }}
                      className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200 transition hover:bg-emerald-500/20"
                    >
                      {slot.format('ddd, MMM DD, h:mm A')}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label htmlFor="venue" className="text-sm font-semibold text-indigo-100">
                    Venue
                  </label>
                  <input
                    id="venue"
                    type="text"
                    {...register('venue')}
                    className="w-full rounded-2xl border border-white/10 bg-[#0c1735] px-4 py-3 text-sm text-white placeholder:text-indigo-100/30 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    placeholder="Auditorium B"
                  />
                  {errors.venue && <p className="text-xs text-rose-400">{errors.venue.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-semibold text-indigo-100">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    {...register('description')}
                    className="w-full rounded-2xl border border-white/10 bg-[#0c1735] px-4 py-3 text-sm text-white placeholder:text-indigo-100/30 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    placeholder="Outline the experience, highlight guest speakers, and note any pre-requisites."
                  />
                  {errors.description && <p className="text-xs text-rose-400">{errors.description.message}</p>}
                </div>

                <div className="grid gap-3 rounded-2xl border border-white/10 bg-[#0c1735] p-5 text-xs text-indigo-100/80">
                  <label className="flex items-center gap-3 text-sm text-indigo-100">
                    <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-transparent" {...register('requiresApproval')} />
                    Requires admin approval
                  </label>
                  <label className="flex items-center gap-3 text-sm text-indigo-100">
                    <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-transparent" {...register('isFeatured')} />
                    Mark as featured
                  </label>
                </div>
              </div>

              <footer className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-indigo-100/70">
                  You can revisit details later from the organizer dashboard.
                </p>
                <button
                  type="submit"
                  disabled={createEvent.isPending || !isDurationValid}
                  className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 disabled:opacity-50"
                >
                  {createEvent.isPending ? 'Submitting...' : 'Submit for approval'}
                </button>
              </footer>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateEventModal;
