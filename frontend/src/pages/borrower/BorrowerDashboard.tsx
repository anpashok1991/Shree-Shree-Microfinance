import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { borrowerApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Wallet, CheckCircle, Clock, XCircle, PlusCircle } from 'lucide-react';

export default function BorrowerDashboard() {
  const { user } = useAuth();
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    borrowerApi.getMyLoans()
      .then(r => setLoans(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeLoans = loans.filter(l => l.status === 'ACTIVE');
  const pendingLoans = loans.filter(l => l.status === 'PENDING_APPROVAL');
  const completedLoans = loans.filter(l => ['CLOSED', 'RENEWED'].includes(l.status));

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Welcome, {user?.name}</h2>

      <div className="grid-3 mb-4">
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '24px' }}>
            <Wallet size={28} style={{ color: 'var(--success)' }} />
            <div style={{ fontSize: '28px', fontWeight: 700, margin: '8px 0' }}>{activeLoans.length}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Active Loans</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '24px' }}>
            <Clock size={28} style={{ color: 'var(--warning)' }} />
            <div style={{ fontSize: '28px', fontWeight: 700, margin: '8px 0' }}>{pendingLoans.length}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Pending Approval</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '24px' }}>
            <CheckCircle size={28} style={{ color: 'var(--secondary)' }} />
            <div style={{ fontSize: '28px', fontWeight: 700, margin: '8px 0' }}>{completedLoans.length}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Completed</div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header"><h3 className="card-title">Quick Actions</h3></div>
        <div className="card-body" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/borrower/apply" className="btn btn-primary"><PlusCircle size={18} /> Apply for New Loan</Link>
          <Link to="/borrower/loans" className="btn btn-secondary"><Wallet size={18} /> View My Loans</Link>
        </div>
      </div>

      {loading && <p className="text-secondary">Loading your loans...</p>}

      {!loading && loans.length === 0 && (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>You haven't applied for any loans yet.</p>
            <Link to="/borrower/apply" className="btn btn-primary">Apply for a Loan</Link>
          </div>
        </div>
      )}

      {activeLoans.length > 0 && (
        <div className="card">
          <div className="card-header"><h3 className="card-title">Active Loans</h3></div>
          <div className="card-body">
            {activeLoans.map(loan => (
              <div key={loan.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{loan.loanNumber}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Amount: ₹{loan.amount?.toLocaleString()} | Daily: ₹{loan.dailyCollection}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600 }}>₹{loan.outstanding?.toLocaleString()}</div>
                  <span className="badge badge-success">ACTIVE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
