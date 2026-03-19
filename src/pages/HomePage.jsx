import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import CURRICULUM, { getSubjectSectionCount } from '../subjects/index.js'
import SubjectCard from '../components/navigation/SubjectCard.jsx'
import useProgress from '../hooks/useProgress.js'

const RUST_SYMBOLS = ['fn', '&', 'mut', '::', '->', '=>', '||', '{}', '<>']

const FLOATING_POSITIONS = [
  { top: '12%', left: '8%', size: '3rem', delay: 0 },
  { top: '25%', right: '10%', size: '2.5rem', delay: 0.4 },
  { top: '60%', left: '5%', size: '2rem', delay: 0.8 },
  { bottom: '20%', right: '8%', size: '3.5rem', delay: 0.2 },
  { top: '45%', right: '20%', size: '2rem', delay: 1.1 },
  { top: '15%', left: '40%', size: '1.5rem', delay: 0.6 },
  { bottom: '30%', left: '18%', size: '2.5rem', delay: 0.9 },
  { top: '70%', right: '30%', size: '1.8rem', delay: 0.3 },
  { top: '35%', left: '25%', size: '2.2rem', delay: 0.7 },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const LEARNING_PATH = [
  {
    step: 1,
    title: 'Python \u2192 Rust Bridge',
    subjects: ['Getting Started', 'Ownership', 'Type System'],
    color: '#f97316',
  },
  {
    step: 2,
    title: 'Core Rust',
    subjects: ['Error Handling', 'Collections', 'Memory & Performance'],
    color: '#10b981',
  },
  {
    step: 3,
    title: 'Systems & Data',
    subjects: ['Concurrency', 'I/O & Serialization', 'Numerical Computing'],
    color: '#3b82f6',
  },
  {
    step: 4,
    title: 'Data Science & ML',
    subjects: ['DataFrames', 'Visualization', 'ML Foundations'],
    color: '#a855f7',
  },
  {
    step: 5,
    title: 'AI & Integration',
    subjects: ['Deep Learning', 'LLM & AI', 'PyO3', 'Python Packages'],
    color: '#ec4899',
  },
]

export default function HomePage() {
  const { isComplete, getSubjectProgress } = useProgress()

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-orange-50/30 px-6 py-20 md:py-28 dark:from-gray-950 dark:via-gray-900 dark:to-orange-950/20">
        {/* Floating symbols */}
        {RUST_SYMBOLS.map((symbol, idx) => {
          const pos = FLOATING_POSITIONS[idx] || {}
          return (
            <motion.span
              key={idx}
              className="pointer-events-none absolute select-none font-mono font-bold text-orange-200/40 dark:text-orange-400/10"
              style={{ ...pos, fontSize: pos.size }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -12, 0] }}
              transition={{
                opacity: { delay: pos.delay, duration: 0.6 },
                y: { delay: pos.delay, duration: 4 + idx * 0.5, repeat: Infinity, ease: 'easeInOut' },
              }}
              aria-hidden="true"
            >
              {symbol}
            </motion.span>
          )
        })}

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl dark:text-white">
              Rust for{' '}
              <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Python Developers
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="mx-auto mt-6 max-w-3xl text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            A comprehensive interactive web book for data scientists, ML engineers, and AI engineers
            who want to master Rust — from ownership fundamentals to building Python packages like Polars.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {[
              { value: '17', label: 'Subjects' },
              { value: '75+', label: 'Chapters' },
              { value: '200+', label: 'Sections' },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/80 px-4 py-1.5 backdrop-blur dark:border-gray-700 dark:bg-gray-800/60"
              >
                <span className="text-base font-bold text-orange-600 dark:text-orange-400">
                  {value}
                </span>
                <span>{label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <a
              href="#subjects"
              className="rounded-xl bg-orange-600 px-7 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-orange-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              Start Learning →
            </a>
            <Link
              to="/progress"
              className="rounded-xl border border-gray-300 bg-white px-7 py-3 text-base font-semibold text-gray-700 transition-all hover:border-orange-400 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:border-orange-500 dark:hover:text-orange-400"
            >
              View Progress
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Learning Path ── */}
      <section className="bg-gray-50 px-6 py-16 dark:bg-gray-900/50">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Recommended Learning Path
            </h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Follow this order to build a solid foundation progressively.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {LEARNING_PATH.map((phase, idx) => (
              <motion.div
                key={phase.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
              >
                <div
                  className="mb-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: phase.color }}
                >
                  {phase.step}
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                  {phase.title}
                </h3>
                <ul className="space-y-1">
                  {phase.subjects.map((s) => (
                    <li key={s} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <span
                        className="h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: phase.color }}
                        aria-hidden="true"
                      />
                      {s}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Subjects Grid ── */}
      <section id="subjects" className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              All Subjects
            </h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              17 subjects covering the complete Rust toolkit for Python developers in data science and AI.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {CURRICULUM.map((subject) => {
              const total = getSubjectSectionCount(subject.id)
              const completed = subject.chapters?.reduce((acc, ch) => {
                return acc + (ch.sections?.filter((sec) => isComplete(subject.id, ch.id, sec.id)).length || 0)
              }, 0) || 0

              return (
                <motion.div key={subject.id} variants={cardVariants}>
                  <SubjectCard
                    subject={subject}
                    completedCount={completed}
                    totalCount={total}
                  />
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="bg-gray-50 px-6 py-16 dark:bg-gray-900/50">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Learn Rust the Python Way
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              Every section features side-by-side Python and Rust examples, showing how familiar
              Python patterns translate into idiomatic Rust. Interactive code exercises let you
              experiment directly in the browser. Progress tracking keeps you motivated as you
              work through ownership, lifetimes, traits, and beyond — all the way to building
              high-performance Python packages with PyO3.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {['Side-by-Side Code', 'Python Comparisons', 'Rust Playground', 'Progress Tracking', 'ML/AI Focus'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700 dark:border-orange-800/60 dark:bg-orange-900/20 dark:text-orange-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
