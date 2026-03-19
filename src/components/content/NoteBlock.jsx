import React from 'react';

/**
 * Type-to-style mapping for different note variants.
 */
const NOTE_TYPES = {
  note: {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Note',
    border: 'border-blue-400/50 dark:border-blue-500/40',
    bg: 'bg-blue-50/60 dark:bg-blue-950/20',
    headerBg: 'bg-blue-100/60 dark:bg-blue-900/30',
    headerBorder: 'border-blue-400/30 dark:border-blue-500/30',
    iconColor: 'text-blue-500 dark:text-blue-400',
    labelColor: 'text-blue-600 dark:text-blue-400',
  },
  pythonista: {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-.16l-.06-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/>
      </svg>
    ),
    label: "Python Developer's Note",
    border: 'border-[#3776AB]/50 dark:border-[#4B8BBE]/40',
    bg: 'bg-blue-50/60 dark:bg-[#1a2744]/40',
    headerBg: 'bg-[#3776AB]/10 dark:bg-[#3776AB]/20',
    headerBorder: 'border-[#3776AB]/30 dark:border-[#4B8BBE]/30',
    iconColor: 'text-[#3776AB] dark:text-[#4B8BBE]',
    labelColor: 'text-[#3776AB] dark:text-[#4B8BBE]',
  },
  tip: {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    label: 'Tip',
    border: 'border-teal-400/50 dark:border-teal-500/40',
    bg: 'bg-teal-50/60 dark:bg-teal-950/20',
    headerBg: 'bg-teal-100/60 dark:bg-teal-900/30',
    headerBorder: 'border-teal-400/30 dark:border-teal-500/30',
    iconColor: 'text-teal-500 dark:text-teal-400',
    labelColor: 'text-teal-600 dark:text-teal-400',
  },
  warning: {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    label: 'Warning',
    border: 'border-amber-400/50 dark:border-amber-500/40',
    bg: 'bg-amber-50/60 dark:bg-amber-950/20',
    headerBg: 'bg-amber-100/60 dark:bg-amber-900/30',
    headerBorder: 'border-amber-400/30 dark:border-amber-500/30',
    iconColor: 'text-amber-500 dark:text-amber-400',
    labelColor: 'text-amber-600 dark:text-amber-400',
  },
};

/**
 * Informational note callout block.
 *
 * Props:
 *   title    {string}  Optional override title
 *   children {node}    Note content
 *   type     {string}  'note' | 'pythonista' | 'tip' | 'warning'
 */
function NoteBlock({ title, children, type = 'note' }) {
  const config = NOTE_TYPES[type] || NOTE_TYPES.note;
  const displayTitle = title || config.label;

  return (
    <div
      className={`my-5 overflow-hidden rounded-xl border-2 shadow-sm ${config.border} ${config.bg}`}
    >
      {/* Header */}
      <div
        className={`flex items-center gap-2 border-b px-4 py-2.5 ${config.headerBg} ${config.headerBorder}`}
      >
        <span className={config.iconColor}>{config.icon}</span>
        <span className={`text-xs font-semibold uppercase tracking-wider ${config.labelColor}`}>
          {displayTitle}
        </span>
      </div>

      {/* Content */}
      <div className="px-5 py-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </div>
  );
}

export default NoteBlock;
