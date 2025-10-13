import { useParams } from 'react-router-dom';

const EventDetailPage = () => {
  const { eventId } = useParams();

  return (
    <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <span>Event ID: {eventId}</span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-600">Approved</span>
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-slate-900">Tech Summit 2025</h1>
          <p className="text-slate-600">
            A full-day innovation summit featuring workshops, keynote speakers, and project showcases from across the
            campus. Discover AI labs, startup pitches, and networking lounges curated for curious builders.
          </p>
        </div>
        <dl className="grid gap-4 rounded-2xl bg-slate-50 p-6 text-sm text-slate-600 sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-slate-900">Schedule</dt>
            <dd>October 25 · 9:00 AM to 5:00 PM</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Venue</dt>
            <dd>Auditorium A</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Category</dt>
            <dd>Technology</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Capacity</dt>
            <dd>200 seats · 105 booked</dd>
          </div>
        </dl>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500"
        >
          Register now
        </button>
      </section>
      <aside className="space-y-5">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Why attend?</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>• Hands-on AI labs led by industry mentors</li>
            <li>• Networking lounge with startups & community partners</li>
            <li>• Live leaderboard for hackathon challenges</li>
            <li>• QR-based check-in to earn engagement badges</li>
          </ul>
        </article>
        <article className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6 text-sm text-indigo-600">
          Organizers can edit details from the dashboard and trigger approval workflows. Once approved, student
          notifications go out automatically through the backend services we already wired.
        </article>
      </aside>
    </div>
  );
};

export default EventDetailPage;
