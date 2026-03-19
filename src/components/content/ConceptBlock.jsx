import React from 'react';

/**
 * Concept callout block for Rust concepts.
 * Blue/cyan themed box with a header and content area.
 *
 * Props:
 *   title     {string}  Concept name
 *   children  {node}    JSX content describing the concept
 */
function ConceptBlock({ title, children }) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border-2 border-cyan-400/50 bg-cyan-50/50 shadow-sm dark:border-cyan-500/40 dark:bg-cyan-950/20">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-cyan-400/30 bg-cyan-100/60 px-5 py-3 dark:border-cyan-500/30 dark:bg-cyan-900/30">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-white dark:bg-cyan-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
          Concept
        </span>
        {title && (
          <>
            <span className="text-cyan-400 dark:text-cyan-600">&middot;</span>
            <span className="text-sm font-semibold text-cyan-800 dark:text-cyan-200">
              {title}
            </span>
          </>
        )}
      </div>

      {/* Content body */}
      <div className="px-5 py-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </div>
  );
}

export default ConceptBlock;
