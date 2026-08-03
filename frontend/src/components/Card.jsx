import React from 'react';

/**
 * Reusable Card component for UI dashboards.
 * @param {Object} props
 * @param {string} props.title - Optional card title.
 * @param {string} props.subtitle - Optional card description/subtitle.
 * @param {React.ReactNode} props.extra - Optional extra header controls/actions.
 * @param {React.ReactNode} props.children - Main card content.
 * @param {string} props.className - Additional class names for styling custom layouts.
 */
export default function Card({ title, subtitle, extra, children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-slate-200/60 bg-white p-6 shadow-xs ${className}`}>
      {(title || subtitle || extra) && (
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-800 leading-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          </div>
          {extra && <div className="text-sm">{extra}</div>}
        </div>
      )}
      <div className="text-sm text-slate-600">{children}</div>
    </div>
  );
}
