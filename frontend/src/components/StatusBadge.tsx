const StatusBadge = ({ type, label }: { type: string; label: string }) => {
  const classMap: Record<string, string> = {
    low: 'badge-low',
    medium: 'badge-medium',
    high: 'badge-high',
    open: 'badge-open',
    'in progress': 'badge-in-progress',
    'in-progress': 'badge-in-progress',
    closed: 'badge-closed',
    admin: 'badge-high',
    agent: 'badge-in-progress',
    user: 'badge-open',
    breached: 'badge-high',
    'on track': 'badge-open',
  };

  const cls = classMap[type.toLowerCase()] || 'badge-closed';

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
