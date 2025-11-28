import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BoltIcon,
  CalendarDaysIcon,
  SparklesIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../auth/AuthProvider.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14 },
  },
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const timelineVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const stats = [
  { label: 'Registrations processed', value: '12K+' },
  { label: 'Avg. feedback score', value: '4.8/5' },
  { label: 'Approval turnaround', value: '6 hrs' },
];

const features = [
  {
    title: 'Discover events effortlessly',
    description: 'Curated highlights, smart filters, and personalized feeds keep every student in the loop.',
    icon: SparklesIcon,
  },
  {
    title: 'Coordinate every detail',
    description: 'Organizers launch events, manage approvals, ticketing, and logistics from one control center.',
    icon: CalendarDaysIcon,
  },
  {
    title: 'Delight attendees',
    description: 'QR check-ins, live notifications, and gamified badges deliver a premium campus experience.',
    icon: UsersIcon,
  },
];

const workflow = [
  {
    title: '1. Submit your concept',
    description: 'Customize agenda, budget, and compliance requirements in minutes with guided form flows.',
  },
  {
    title: '2. Secure approvals fast',
    description: 'Admins get instant alerts, enabling same-day decisions with audit trails and comments.',
  },
  {
    title: '3. Launch and engage',
    description: 'Automated promotion, RSVP tracking, and feedback capture keep momentum high throughout.',
  },
];

const testimonials = [
  {
    quote:
      '“CampusEvents elevated our cultural fest. Real-time registrations and analytics let us react instantly.”',
    author: 'Aarav Gupta · Student Council President',
  },
  {
    quote: '“Approvals dropped from days to hours. The team finally works in sync with organizers.”',
    author: 'Dr. Meera Patel · Dean of Student Affairs',
  },
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-24">
      <motion.section
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-500 px-6 py-16 text-white shadow-xl"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="absolute inset-y-0 right-0 w-full max-w-lg bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_60%)]" />
        <motion.div className="relative mx-auto flex max-w-4xl flex-col gap-8 text-center lg:text-left" variants={fadeUp}>
          <span className="mx-auto w-fit rounded-full bg-white/10 px-4 py-1 text-sm font-semibold tracking-wide text-white lg:mx-0">
            Seamless college event orchestration
          </span>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Plan, promote, and elevate every campus experience.
          </h1>
          <p className="text-base text-indigo-100 sm:text-lg">
            From idea to post-event feedback, CampusEvents keeps organizers, admins, and students perfectly aligned. Launch
            events in minutes, approve them in hours, and deliver unforgettable moments powered by data.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            {isAuthenticated ? (
              <>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/events"
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-lg transition hover:bg-indigo-50"
                  >
                    Browse events
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Go to dashboard
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-lg transition hover:bg-indigo-50"
                  >
                    Get started
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Sign in to explore events
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          className="relative mt-10 grid gap-6 rounded-3xl bg-white/10 p-6 text-sm backdrop-blur lg:grid-cols-3"
          variants={fadeInScale}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1 text-center lg:text-left">
              <p className="text-3xl font-semibold text-white">{stat.value}</p>
              <p className="text-indigo-100/90">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section className="space-y-12" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
        <motion.header className="mx-auto max-w-2xl text-center" variants={fadeUp}>
          <h2 className="text-3xl font-semibold text-slate-900">Everything your campus teams need to shine</h2>
          <p className="mt-3 text-base text-slate-600">
            Powerful modules, real-time collaboration, and polished attendee experiences designed for modern colleges.
          </p>
        </motion.header>

        <motion.div
          className="grid gap-6 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                variants={fadeInScale}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{feature.description}</p>
                <div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-indigo-500 to-sky-400 transition-transform group-hover:scale-x-100" />
              </motion.article>
            );
          })}
        </motion.div>
      </motion.section>

      <motion.section
        className="grid gap-10 rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-sm lg:grid-cols-[1.5fr_1fr]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={staggerContainer}
      >
        <motion.div className="space-y-6" variants={fadeUp}>
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-600">
            <BoltIcon className="h-4 w-4" /> Fast-track your workflows
          </span>
          <h2 className="text-3xl font-semibold text-slate-900">A streamlined journey from idea to impact.</h2>
          <p className="text-sm leading-relaxed text-slate-600">
            We help student clubs, faculty coordinators, and administrators stay in lockstep. No more scattered emails or
            missed approvals—just a confident launch every time.
          </p>
          <motion.ul className="space-y-5" variants={staggerContainer} initial="hidden" whileInView="visible">
            {workflow.map((step) => (
              <motion.li key={step.title} className="rounded-2xl border border-slate-200/80 bg-white/70 p-5" variants={timelineVariants}>
                <p className="text-sm font-semibold text-indigo-600">{step.title}</p>
                <p className="mt-1 text-sm text-slate-600">{step.description}</p>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div className="space-y-4" variants={fadeInScale}>
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-sky-500 p-6 text-white shadow-lg">
            <ClipboardDocumentCheckIcon className="h-10 w-10" />
            <p className="mt-4 text-lg font-semibold">Auto-generated reports</p>
            <p className="mt-2 text-sm text-indigo-100">
              Live dashboards track RSVPs, attendance, feedback, and budget consumption so stakeholders stay informed.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600">
              “We went from juggling spreadsheets to having a single command center. Approvals are fast, and students love the
              polish.”
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-900">Priya Singh · Cultural Fest Lead</p>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-10 shadow-sm lg:grid-cols-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        {testimonials.map((item) => (
          <motion.blockquote
            key={item.author}
            className="flex h-full flex-col justify-between rounded-3xl bg-slate-50 p-6 text-slate-700 shadow-inner"
            variants={fadeInScale}
          >
            <p className="text-sm leading-relaxed">{item.quote}</p>
            <span className="mt-6 text-sm font-semibold text-slate-900">{item.author}</span>
          </motion.blockquote>
        ))}
      </motion.section>

      <motion.section
        className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-500 to-sky-500 p-[1px] shadow-xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInScale}
      >
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-slate-900/90 px-8 py-12 text-center text-white sm:px-12">
          <h2 className="text-3xl font-semibold">Launch unforgettable campus experiences.</h2>
          <p className="max-w-2xl text-sm text-indigo-100">
            Join colleges modernizing their event operations. Start with a demo-ready workspace or plug CampusEvents directly
            into your production stack.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <motion.a
              href="/register"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-indigo-100"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create organizer account
            </motion.a>
            <motion.a
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign in as admin
            </motion.a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
