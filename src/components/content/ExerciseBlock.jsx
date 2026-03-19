import React, { useState } from 'react';

const DIFFICULTY_CONFIG = {
  beginner: {
    label: 'Beginner',
    badgeClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    dotClass: 'bg-green-500',
  },
  intermediate: {
    label: 'Intermediate',
    badgeClass: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    dotClass: 'bg-yellow-500',
  },
  advanced: {
    label: 'Advanced',
    badgeClass: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    dotClass: 'bg-orange-500',
  },
  research: {
    label: 'Research',
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    dotClass: 'bg-red-500',
  },
};

/**
 * Exercise block for Rust programming exercises.
 * Orange themed with collapsible solution.
 *
 * Props:
 *   title      {string}  Exercise title
 *   problem    {string}  Problem description
 *   solution   {string}  Solution code or explanation
 *   difficulty {string}  'beginner' | 'intermediate' | 'advanced' | 'research'
 */
function ExerciseBlock({ title = 'Exercise', problem, solution, difficulty = 'intermediate' }) {
  const [solutionOpen, setSolutionOpen] = useState(false);
  const diffConfig = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.intermediate;

  return (
    <div className="my-8 overflow-hidden rounded-xl border-2 border-orange-300/60 bg-white shadow-sm dark:border-orange-600/40 dark:bg-gray-900/30">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-orange-200 bg-orange-50/80 px-5 py-3 dark:border-orange-700/40 dark:bg-orange-900/20">
        <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <h3 className="text-sm font-bold text-orange-700 dark:text-orange-300 flex-1">{title}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${diffConfig.badgeClass}`}>
          {diffConfig.label}
        </span>
      </div>

      {/* Problem */}
      <div className="px-5 py-4 border-b border-orange-100 dark:border-orange-800/30">
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {problem}
        </p>
      </div>

      {/* Solution toggle */}
      {solution && (
        <div className="px-5 py-3">
          <button
            onClick={() => setSolutionOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-md border border-orange-300/50 bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600 transition-colors hover:bg-orange-100 dark:border-orange-600/30 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30"
            aria-expanded={solutionOpen}
          >
            <svg
              className={`h-3.5 w-3.5 transition-transform duration-200 ${solutionOpen ? 'rotate-90' : 'rotate-0'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {solutionOpen ? 'Hide Solution' : 'Reveal Solution'}
          </button>

          {solutionOpen && (
            <div className="mt-3 overflow-x-auto rounded-lg border border-orange-200 bg-orange-50/60 dark:border-orange-700/40 dark:bg-orange-900/15">
              <pre className="p-4 text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-mono whitespace-pre-wrap">
                {solution}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ExerciseBlock;
