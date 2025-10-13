const LandingPage = () => {
  return (
    <section className="space-y-10">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-500">College Event Management</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">
          Plan, promote, and experience campus events without chaos.
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Discover upcoming events, manage registrations, and keep students engaged with real-time updates and feedback.
        </p>
      </header>

      <div className="grid gap-8 rounded-3xl bg-white/70 p-8 shadow-sm backdrop-blur lg:grid-cols-3">
        {[
          {
            title: 'Discover Events',
            description: 'Smart filters and curated highlights keep students informed about what matters most.',
          },
          {
            title: 'Manage End-to-End',
            description: 'Organizers create, approve, track attendance, and collect feedback from a single dashboard.',
          },
          {
            title: 'Delight Participants',
            description: 'Personalized notifications, QR check-ins, and gamified badges boost engagement.',
          },
        ].map((feature) => (
          <article key={feature.title} className="space-y-3">
            <h2 className="text-xl font-semibold text-indigo-600">{feature.title}</h2>
            <p className="text-sm text-slate-600">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LandingPage;
