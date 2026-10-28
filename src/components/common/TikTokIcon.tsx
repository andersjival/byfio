import React from 'react';

export const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.882 2.897 2.896 2.896 0 0 1-2.896-2.897 2.896 2.896 0 0 1 2.896-2.897c.306 0 .598.05.87.142V9.458a6.326 6.326 0 0 0-.87-.061A6.335 6.335 0 0 0 3 15.732 6.335 6.335 0 0 0 9.374 22a6.335 6.335 0 0 0 6.336-6.268V8.924a8.163 8.163 0 0 0 4.879 1.602V7.081a4.79 4.79 0 0 1-1-.395z" />
  </svg>
);
