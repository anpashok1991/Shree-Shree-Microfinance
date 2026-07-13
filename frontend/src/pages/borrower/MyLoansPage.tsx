import { useEffect, useState } from 'react';
import { borrowerApi } from '../../services/api';
import { Wallet } from 'lucide-react';

export default function MyLoansPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    borrowerApi.getMyLoans()
      .then(r => setLoans(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusBadge: any = {
    PENDING_APPROVAL: 'badge-warning',
    ACTIVE: 'badge-success',
    REJECTED: 'badge-danger',
    CLOSED: 'badge-secondary',
    RENEWED: 'badge-info',
    RETURNED: 'badge-info',
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>My Loans</h2>

      {loading && <p className="text-secondary">Loading...</p>}

      {!loading && loans.length === 0 && (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
            <Wallet size={48} style={{ color: 'var(--text-secondary)', marginBottom: '12px' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No loans found</p>
          </div>
        </div>
      )}

      {loans.map((loan: any) => (
        <div className="card mb-3" key={loan.id}>
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h4 style={{ margin: 0 }}>{loan.loanNumber}</h4>
                <small className="text-secondary">{new Date(loan.createdAt).toLocaleDateString()}</small>
              </div>
              <span className={`badge ${statusBadge[loan.status] || 'badge-secondary'}`}>
                {loan.status?.replace('_', ' ')}
              </span>
            </div>
            <div className="grid-2" style={{ gap: '8px', fontSize: '14px' }}>
              <div><span className="text-secondary">Amount:</span> ₹{loan.amount?.toLocaleString()}</div>
              <div><span className="text-secondary">Disbursed:</span> ₹{loan.disbursedAmount?.toLocaleString()}</div>
              <div><span className="text-secondary">Daily:</span> ₹{loan.dailyCollection?.toFixed(2)}</div>
              <div><span className="text-secondary">Outstanding:</span> ₹{loan.outstanding?.toLocaleString()}</div>
              <div><span className="text-secondary">Paid:</span> ₹{loan.totalPaid?.toLocaleString()}</div>
              <div><span className="text-secondary">Tenure:</span> {loan.tenure} days</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
