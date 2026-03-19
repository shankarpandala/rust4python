import { useParams, Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { getCurriculumById, getChapterById, getSectionById, getAdjacentSections, resolveBuildsOn } from '../subjects/index.js'
import DifficultyBadge from '../components/navigation/DifficultyBadge.jsx'
import PrevNextNav from '../components/navigation/PrevNextNav.jsx'
import Breadcrumbs from '../components/layout/Breadcrumbs.jsx'
import useProgress from '../hooks/useProgress.js'

// Registry of sections that have full content pages written.
const CONTENT_REGISTRY = {
  '01-getting-started/c1-why-rust/s1-why-rust': lazy(() => import('../subjects/01-getting-started/c1-why-rust/s1-why-rust.jsx')),
  '01-getting-started/c1-why-rust/s2-mental-model': lazy(() => import('../subjects/01-getting-started/c1-why-rust/s2-mental-model.jsx')),
  '01-getting-started/c1-why-rust/s3-setup': lazy(() => import('../subjects/01-getting-started/c1-why-rust/s3-setup.jsx')),
  '01-getting-started/c2-first-programs/s1-hello-world': lazy(() => import('../subjects/01-getting-started/c2-first-programs/s1-hello-world.jsx')),
  '01-getting-started/c2-first-programs/s2-variables': lazy(() => import('../subjects/01-getting-started/c2-first-programs/s2-variables.jsx')),
  '01-getting-started/c2-first-programs/s3-basic-types': lazy(() => import('../subjects/01-getting-started/c2-first-programs/s3-basic-types.jsx')),
  '01-getting-started/c3-control-flow/s1-conditionals': lazy(() => import('../subjects/01-getting-started/c3-control-flow/s1-conditionals.jsx')),
  '01-getting-started/c3-control-flow/s2-loops': lazy(() => import('../subjects/01-getting-started/c3-control-flow/s2-loops.jsx')),
  '01-getting-started/c3-control-flow/s3-pattern-matching': lazy(() => import('../subjects/01-getting-started/c3-control-flow/s3-pattern-matching.jsx')),
  '01-getting-started/c4-functions/s1-functions': lazy(() => import('../subjects/01-getting-started/c4-functions/s1-functions.jsx')),
  '01-getting-started/c4-functions/s2-closures': lazy(() => import('../subjects/01-getting-started/c4-functions/s2-closures.jsx')),
  '01-getting-started/c4-functions/s3-modules': lazy(() => import('../subjects/01-getting-started/c4-functions/s3-modules.jsx')),
  '02-ownership/c1-ownership/s1-what-ownership-solves': lazy(() => import('../subjects/02-ownership/c1-ownership/s1-what-ownership-solves.jsx')),
  '02-ownership/c1-ownership/s2-move-semantics': lazy(() => import('../subjects/02-ownership/c1-ownership/s2-move-semantics.jsx')),
  '02-ownership/c1-ownership/s3-copy-clone': lazy(() => import('../subjects/02-ownership/c1-ownership/s3-copy-clone.jsx')),
  '02-ownership/c1-ownership/s4-scope-drop': lazy(() => import('../subjects/02-ownership/c1-ownership/s4-scope-drop.jsx')),
  '02-ownership/c2-borrowing/s1-immutable-refs': lazy(() => import('../subjects/02-ownership/c2-borrowing/s1-immutable-refs.jsx')),
  '02-ownership/c2-borrowing/s2-mutable-refs': lazy(() => import('../subjects/02-ownership/c2-borrowing/s2-mutable-refs.jsx')),
  '02-ownership/c2-borrowing/s3-borrow-checker': lazy(() => import('../subjects/02-ownership/c2-borrowing/s3-borrow-checker.jsx')),
  '02-ownership/c3-slices/s1-string-types': lazy(() => import('../subjects/02-ownership/c3-slices/s1-string-types.jsx')),
  '02-ownership/c3-slices/s2-slice-patterns': lazy(() => import('../subjects/02-ownership/c3-slices/s2-slice-patterns.jsx')),
  '02-ownership/c4-lifetimes/s1-lifetime-annotations': lazy(() => import('../subjects/02-ownership/c4-lifetimes/s1-lifetime-annotations.jsx')),
  '02-ownership/c4-lifetimes/s2-lifetime-elision': lazy(() => import('../subjects/02-ownership/c4-lifetimes/s2-lifetime-elision.jsx')),
  '02-ownership/c4-lifetimes/s3-struct-lifetimes': lazy(() => import('../subjects/02-ownership/c4-lifetimes/s3-struct-lifetimes.jsx')),
  '03-type-system/c1-structs/s1-defining-structs': lazy(() => import('../subjects/03-type-system/c1-structs/s1-defining-structs.jsx')),
  '03-type-system/c1-structs/s2-methods': lazy(() => import('../subjects/03-type-system/c1-structs/s2-methods.jsx')),
  '03-type-system/c2-enums/s1-enums': lazy(() => import('../subjects/03-type-system/c2-enums/s1-enums.jsx')),
  '03-type-system/c2-enums/s2-option': lazy(() => import('../subjects/03-type-system/c2-enums/s2-option.jsx')),
  '03-type-system/c2-enums/s3-result': lazy(() => import('../subjects/03-type-system/c2-enums/s3-result.jsx')),
  '03-type-system/c3-traits/s1-defining-traits': lazy(() => import('../subjects/03-type-system/c3-traits/s1-defining-traits.jsx')),
  '03-type-system/c3-traits/s2-trait-bounds': lazy(() => import('../subjects/03-type-system/c3-traits/s2-trait-bounds.jsx')),
  '03-type-system/c3-traits/s3-common-traits': lazy(() => import('../subjects/03-type-system/c3-traits/s3-common-traits.jsx')),
  '03-type-system/c4-generics/s1-generic-functions': lazy(() => import('../subjects/03-type-system/c4-generics/s1-generic-functions.jsx')),
  '03-type-system/c5-advanced-types/s1-associated-types': lazy(() => import('../subjects/03-type-system/c5-advanced-types/s1-associated-types.jsx')),
  '03-type-system/c5-advanced-types/s2-trait-objects': lazy(() => import('../subjects/03-type-system/c5-advanced-types/s2-trait-objects.jsx')),
  '04-error-handling/c1-error-philosophy/s1-result-option': lazy(() => import('../subjects/04-error-handling/c1-error-philosophy/s1-result-option.jsx')),
  '04-error-handling/c1-error-philosophy/s2-question-mark': lazy(() => import('../subjects/04-error-handling/c1-error-philosophy/s2-question-mark.jsx')),
  '04-error-handling/c1-error-philosophy/s3-custom-errors': lazy(() => import('../subjects/04-error-handling/c1-error-philosophy/s3-custom-errors.jsx')),
  '04-error-handling/c1-error-philosophy/s4-anyhow-thiserror': lazy(() => import('../subjects/04-error-handling/c1-error-philosophy/s4-anyhow-thiserror.jsx')),
  '04-error-handling/c2-error-patterns/s1-unwrap-considered': lazy(() => import('../subjects/04-error-handling/c2-error-patterns/s1-unwrap-considered.jsx')),
  '04-error-handling/c3-unsafe/s1-what-unsafe-unlocks': lazy(() => import('../subjects/04-error-handling/c3-unsafe/s1-what-unsafe-unlocks.jsx')),
  '05-collections/c1-standard-collections/s1-vec': lazy(() => import('../subjects/05-collections/c1-standard-collections/s1-vec.jsx')),
  '05-collections/c1-standard-collections/s2-hashmap': lazy(() => import('../subjects/05-collections/c1-standard-collections/s2-hashmap.jsx')),
  '05-collections/c2-iterators/s1-iterator-trait': lazy(() => import('../subjects/05-collections/c2-iterators/s1-iterator-trait.jsx')),
  '05-collections/c2-iterators/s2-adapters': lazy(() => import('../subjects/05-collections/c2-iterators/s2-adapters.jsx')),
  '05-collections/c4-functional/s1-closures-depth': lazy(() => import('../subjects/05-collections/c4-functional/s1-closures-depth.jsx')),
  '05-collections/c4-functional/s2-method-chaining': lazy(() => import('../subjects/05-collections/c4-functional/s2-method-chaining.jsx')),
  '06-memory/c1-stack-heap/s1-memory-layout': lazy(() => import('../subjects/06-memory/c1-stack-heap/s1-memory-layout.jsx')),
  '06-memory/c1-stack-heap/s2-box': lazy(() => import('../subjects/06-memory/c1-stack-heap/s2-box.jsx')),
  '06-memory/c1-stack-heap/s3-rc-arc': lazy(() => import('../subjects/06-memory/c1-stack-heap/s3-rc-arc.jsx')),
  '06-memory/c2-smart-pointers/s1-refcell': lazy(() => import('../subjects/06-memory/c2-smart-pointers/s1-refcell.jsx')),
  '07-concurrency/c1-fearless-concurrency/s1-why-different': lazy(() => import('../subjects/07-concurrency/c1-fearless-concurrency/s1-why-different.jsx')),
  '07-concurrency/c2-shared-state/s1-mutex': lazy(() => import('../subjects/07-concurrency/c2-shared-state/s1-mutex.jsx')),
  '07-concurrency/c4-rayon/s1-par-iter': lazy(() => import('../subjects/07-concurrency/c4-rayon/s1-par-iter.jsx')),
  '07-concurrency/c5-async/s1-async-await': lazy(() => import('../subjects/07-concurrency/c5-async/s1-async-await.jsx')),
  '08-io-serialization/c1-file-io/s1-reading-writing': lazy(() => import('../subjects/08-io-serialization/c1-file-io/s1-reading-writing.jsx')),
  '08-io-serialization/c2-serialization/s1-serde': lazy(() => import('../subjects/08-io-serialization/c2-serialization/s1-serde.jsx')),
  '09-numerical/c2-ndarray/s1-array-creation': lazy(() => import('../subjects/09-numerical/c2-ndarray/s1-array-creation.jsx')),
  '09-numerical/c4-statistics/s1-rand': lazy(() => import('../subjects/09-numerical/c4-statistics/s1-rand.jsx')),
  '10-dataframes/c1-polars-internals/s1-arrow-columnar': lazy(() => import('../subjects/10-dataframes/c1-polars-internals/s1-arrow-columnar.jsx')),
  '10-dataframes/c1-polars-internals/s2-series-dataframe': lazy(() => import('../subjects/10-dataframes/c1-polars-internals/s2-series-dataframe.jsx')),
  '10-dataframes/c2-transformations/s1-select-filter': lazy(() => import('../subjects/10-dataframes/c2-transformations/s1-select-filter.jsx')),
  '11-visualization/c1-plotters/s1-basic-charts': lazy(() => import('../subjects/11-visualization/c1-plotters/s1-basic-charts.jsx')),
  '12-ml-foundations/c1-ml-scratch/s1-linear-regression': lazy(() => import('../subjects/12-ml-foundations/c1-ml-scratch/s1-linear-regression.jsx')),
  '12-ml-foundations/c2-tensors/s1-candle-overview': lazy(() => import('../subjects/12-ml-foundations/c2-tensors/s1-candle-overview.jsx')),
  '12-ml-foundations/c3-classical-ml/s1-linfa': lazy(() => import('../subjects/12-ml-foundations/c3-classical-ml/s1-linfa.jsx')),
  '13-deep-learning/c1-nn-scratch/s1-forward-backprop': lazy(() => import('../subjects/13-deep-learning/c1-nn-scratch/s1-forward-backprop.jsx')),
  '13-deep-learning/c2-candle/s1-model-building': lazy(() => import('../subjects/13-deep-learning/c2-candle/s1-model-building.jsx')),
  '14-llm-ai/c1-tokenizers/s1-hf-tokenizers': lazy(() => import('../subjects/14-llm-ai/c1-tokenizers/s1-hf-tokenizers.jsx')),
  '14-llm-ai/c4-ai-infrastructure/s1-api-servers': lazy(() => import('../subjects/14-llm-ai/c4-ai-infrastructure/s1-api-servers.jsx')),
  '15-pyo3-fundamentals/c1-pyo3-basics/s1-what-is-pyo3': lazy(() => import('../subjects/15-pyo3-fundamentals/c1-pyo3-basics/s1-what-is-pyo3.jsx')),
  '15-pyo3-fundamentals/c1-pyo3-basics/s2-pyfunction': lazy(() => import('../subjects/15-pyo3-fundamentals/c1-pyo3-basics/s2-pyfunction.jsx')),
  '15-pyo3-fundamentals/c2-type-conversions/s1-type-mapping': lazy(() => import('../subjects/15-pyo3-fundamentals/c2-type-conversions/s1-type-mapping.jsx')),
  '16-python-packages/c1-project-structure/s1-workspace': lazy(() => import('../subjects/16-python-packages/c1-project-structure/s1-workspace.jsx')),
  '16-python-packages/c2-data-structures/s2-numpy-integration': lazy(() => import('../subjects/16-python-packages/c2-data-structures/s2-numpy-integration.jsx')),
  '16-python-packages/c3-polars-style/s1-fluent-api': lazy(() => import('../subjects/16-python-packages/c3-polars-style/s1-fluent-api.jsx')),
  '17-integration-patterns/c1-accelerating/s1-bottlenecks': lazy(() => import('../subjects/17-integration-patterns/c1-accelerating/s1-bottlenecks.jsx')),
  '17-integration-patterns/c1-accelerating/s3-case-study': lazy(() => import('../subjects/17-integration-patterns/c1-accelerating/s3-case-study.jsx')),
  '17-integration-patterns/c4-production/s3-polars-case-study': lazy(() => import('../subjects/17-integration-patterns/c4-production/s3-polars-case-study.jsx')),
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-orange-300 dark:text-orange-700" aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

function ComingSoonPlaceholder({ section }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-orange-200 bg-orange-50/50 px-8 py-16 text-center dark:border-orange-800/40 dark:bg-orange-950/10"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <BookIcon />
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Content Coming Soon
        </h2>
        <p className="max-w-md text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          The interactive content for{' '}
          <strong className="font-semibold text-gray-700 dark:text-gray-300">
            {section.title}
          </strong>{' '}
          is being prepared. It will include:
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {['Rust code examples', 'Python comparisons', 'Interactive exercises', 'Playground links'].map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

function PrerequisiteBanner({ section, subjectId, chapterId }) {
  if (!section?.buildsOn) return null;
  const prereq = resolveBuildsOn(section.buildsOn);
  if (!prereq) return null;

  const isSameSubject = prereq.subjectId === subjectId;
  const href = `/subjects/${prereq.subjectId}/${prereq.chapterId}/${prereq.sectionId}`;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3 dark:border-amber-800/40 dark:bg-amber-950/20">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
      <div className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">
        <span className="font-medium">Builds on: </span>
        <Link
          to={href}
          className="underline decoration-amber-400/60 underline-offset-2 hover:decoration-amber-600 dark:decoration-amber-600/60 dark:hover:decoration-amber-400 transition-colors"
        >
          {prereq.title}
        </Link>
        {!isSameSubject && (
          <span className="ml-1 text-amber-700 dark:text-amber-400/80">
            ({prereq.subjectTitle})
          </span>
        )}
      </div>
    </div>
  );
}

function SectionContent({ subjectId, chapterId, sectionId, section }) {
  const key = `${subjectId}/${chapterId}/${sectionId}`
  const ContentComponent = CONTENT_REGISTRY[key]
  if (ContentComponent) {
    return (
      <Suspense fallback={<div className="py-16 text-center text-gray-400">Loading content…</div>}>
        <ContentComponent />
      </Suspense>
    )
  }
  return <ComingSoonPlaceholder section={section} />
}

export default function SectionPage() {
  const { subjectId, chapterId, sectionId } = useParams()
  const { isComplete, markComplete } = useProgress()

  const subject = getCurriculumById(subjectId)
  const chapter = getChapterById(subjectId, chapterId)
  const section = getSectionById(subjectId, chapterId, sectionId)
  const done = isComplete(subjectId, chapterId, sectionId)

  if (!subject || !chapter || !section) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="text-5xl font-mono" aria-hidden="true">404</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Section Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Could not find section "{sectionId}".
        </p>
        <Link
          to="/"
          className="rounded-lg bg-orange-600 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  const { prev, next } = getAdjacentSections(subjectId, chapterId, sectionId)

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: subject.title, href: `/subjects/${subjectId}` },
    { label: chapter.title, href: `/subjects/${subjectId}/${chapterId}` },
    { label: section.title },
  ]

  function handleMarkComplete() {
    if (!done) {
      markComplete(subjectId, chapterId, sectionId)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Section Header */}
      <div
        className="relative border-b border-gray-200 dark:border-gray-800"
        style={{ background: `linear-gradient(135deg, ${subject.colorHex}10 0%, transparent 50%)` }}
      >
        <div
          className="absolute left-0 top-0 h-full w-1.5"
          style={{ backgroundColor: subject.colorHex }}
          aria-hidden="true"
        />

        <div className="mx-auto max-w-3xl px-6 py-8 pl-10">
          <Breadcrumbs items={breadcrumbs} />

          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl leading-snug">
              {section.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <DifficultyBadge level={section.difficulty} />
              {section.readingMinutes && (
                <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <ClockIcon />
                  {section.readingMinutes} min read
                </span>
              )}
              {done && (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <CheckIcon />
                  Completed
                </span>
              )}
            </div>

            {section.description && (
              <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
                {section.description}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main content area */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Prerequisite context for progressive learning */}
        <PrerequisiteBanner section={section} subjectId={subjectId} chapterId={chapterId} />

        {/* Dynamically loaded content or "Coming Soon" */}
        <SectionContent
          subjectId={subjectId}
          chapterId={chapterId}
          sectionId={sectionId}
          section={section}
        />

        {/* Mark as complete */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleMarkComplete}
            disabled={done}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 ${
              done
                ? 'cursor-default bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-orange-600 text-white hover:bg-orange-700 shadow-md hover:shadow-lg'
            }`}
            aria-label={done ? 'Section already marked complete' : 'Mark this section as complete'}
          >
            {done ? (
              <>
                <CheckIcon />
                Marked as Complete
              </>
            ) : (
              'Mark as Complete'
            )}
          </button>
        </div>

        {/* Prev / Next navigation */}
        <PrevNextNav prev={prev} next={next} />
      </div>
    </div>
  )
}
