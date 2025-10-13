import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center text-center">
      <span className="rounded-full bg-rose-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-rose-600">
        404 — Page not found
      </span>
      <h1 className="mt-6 text-4xl font-bold text-slate-900 sm:text-5xl">Lost in campus?</h1>
      <p className="mt-4 text-sm text-slate-500">
        The page you are looking for does not exist. Head back to the events list or explore the dashboard to keep the
        college buzz going.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
        <Link
          to="/events"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2 text-slate-600 hover:bg-slate-100"
        >
          Browse events
        </Link>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2 text-white shadow hover:bg-indigo-500"
        >
          Go to dashboard
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
