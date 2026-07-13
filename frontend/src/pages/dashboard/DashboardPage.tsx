import { useState, useEffect } from 'react';
import { dashboardApi } from '../../services/api';
import StatCard from '../../components/common/StatCard';
import Loading from '../../components/common/Loading';
import type { DashboardStats } from '../../types';
import {
  IndianRupee, Users, Wallet, Clock, AlertTriangle,
  TrendingUp, HandshakeIcon, BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    dashboardApi.getStats()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="header-title">Dashboard</h1>
        <div className="flex gap-2">
          <button className="btn btn-secondary btn-sm" onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Today's Collection"
          value={stats?.todayCollection || 0}
          icon={<IndianRupee />}
          color="#34a853"
          bg="#dcfce7"
        />
        <StatCard
          title="Monthly Collection"
          value={stats?.monthlyCollection || 0}
          icon={<TrendingUp />}
          color="#1a73e8"
          bg="#dbeafe"
        />
        <StatCard
          title="Active Loans"
          value={stats?.activeLoans || 0}
          icon={<Wallet />}
          color="#ff6d00"
          bg="#fff3e0"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingApprovals || 0}
          icon={<Clock />}
          color="#fbbc04"
          bg="#fef3c7"
        />
        <StatCard
          title="Overdue Loans"
          value={stats?.overdueLoans || 0}
          icon={<AlertTriangle />}
          color="#ea4335"
          bg="#fce4ec"
        />
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          icon={<Users />}
          color="#4285f4"
          bg="#e8eaf6"
        />
        <StatCard
          title="Total Profit"
          value={stats?.totalProfit || 0}
          icon={<TrendingUp />}
          color="#34a853"
          bg="#e8f5e9"
        />
        <StatCard
          title="Total Outstanding"
          value={stats?.totalOutstanding || 0}
          icon={<BarChart3 />}
          color="#ea4335"
          bg="#fce4ec"
        />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button className="btn btn-primary" onClick={() => navigate('/customers')}>
                <Users size={18} /> Manage Customers
              </button>
              <button className="btn btn-success" onClick={() => navigate('/loans')}>
                <Wallet size={18} /> View Loans
              </button>
              <button className="btn btn-warning" onClick={() => navigate('/collections')}>
                <IndianRupee size={18} /> Record Collection
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/reports')}>
                <BarChart3 size={18} /> Reports
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">System Overview</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="flex items-center justify-between">
                <span className="text-secondary">Collection Rate</span>
                <span className="font-bold">
                  {stats?.totalOutstanding && stats?.activeLoans
                    ? `${Math.round(((stats.monthlyCollection || 0) / ((stats.activeLoans || 1) * 120 * 30)) * 100)}%`
                    : '0%'}
                </span>
              </div>
              <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', background: 'var(--primary)', borderRadius: '4px',
                  width: stats?.totalOutstanding && stats?.activeLoans
                    ? `${Math.min(100, ((stats.monthlyCollection || 0) / ((stats.activeLoans || 1) * 120 * 30)) * 100)}%`
                    : '0%'
                }} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-secondary">Active Loans</span>
                <span className="font-bold">{stats?.activeLoans || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary">Pending Approvals</span>
                <span className="font-bold" style={{ color: 'var(--warning)' }}>{stats?.pendingApprovals || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary">Overdue Loans</span>
                <span className="font-bold" style={{ color: stats?.overdueLoans ? 'var(--danger)' : 'var(--secondary)' }}>
                  {stats?.overdueLoans || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
