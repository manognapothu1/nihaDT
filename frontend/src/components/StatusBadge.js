import React from 'react';

const badgeStyles = {
  Pending: 'bg-amber-100 text-amber-800',
  'In Progress': 'bg-sky-100 text-sky-800',
  Resolved: 'bg-emerald-100 text-emerald-800',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles[status] || 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
