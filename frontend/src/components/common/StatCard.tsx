import { ReactNode } from 'react';

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  bg?: string;
  change?: string;
}

export default function StatCard({ title, value, icon, color = 'var(--primary)', bg = 'var(--bg-hover)', change }: Props) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className="stat-card-icon" style={{ background: bg, color }}>
          {icon}
        </div>
      </div>
      <div className="stat-card-value">{typeof value === 'number' ? `₹${value.toLocaleString()}` : value}</div>
      {change && <div className="stat-card-change">{change}</div>}
    </div>
  );
}
