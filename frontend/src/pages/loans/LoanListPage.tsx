import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loanApi } from '../../services/api';
import DataTable from '../../components/common/DataTable';
import { Plus } from 'lucide-react';

export default function LoanListPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('ALL');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetch = () => {
    setLoading(true);
    const params: any = { page, limit: 10 };
    if (tab !== 'ALL') params.status = tab;
    loanApi.getAll(params)
      .then((r) => { setLoans(r.data); setTotal(r.pagination?.total || 0); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [page, tab]);

  const tabs = [
    { key: 'ALL', label: 'All' },
    { key: 'PENDING_APPROVAL', label: 'Pending' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'CLOSED', label: 'Closed' },
  ];

  const columns = [
    { key: 'loanNumber', label: 'Loan #', render: (r: any) => <span className="font-medium">{r.loanNumber}</span> },
    { key: 'customer', label: 'Customer', render: (r: any) => r.customer?.name || '-' },
    { key: 'amount', label: 'Amount', render: (r: any) => `₹${r.amount.toLocaleString()}` },
    { key: 'dailyCollection', label: 'Daily', render: (r: any) => `₹${r.dailyCollection}` },
    { key: 'totalPaid', label: 'Paid', render: (r: any) => `₹${r.totalPaid.toLocaleString()}` },
    { key: 'outstanding', label: 'OS', render: (r: any) => `₹${r.outstanding.toLocaleString()}` },
    { key: 'status', label: 'Status', render: (r: any) => {
      const badges: any = { ACTIVE: 'badge-success', PENDING_APPROVAL: 'badge-warning', CLOSED: 'badge-secondary', REJECTED: 'badge-danger', RETURNED: 'badge-info', RENEWED: 'badge-info' };
      return <span className={`badge ${badges[r.status] || 'badge-secondary'}`}>{r.status.replace('_', ' ')}</span>;
    }},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="header-title">Loans</h1>
        <button className="btn btn-primary" onClick={() => navigate('/loans/new')}>
          <Plus size={18} /> New Loan
        </button>
      </div>

      <div className="tabs">
        {tabs.map((t) => (
          <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => { setTab(t.key); setPage(1); }}>{t.label}</button>
        ))}
      </div>

      <div className="card">
        <DataTable columns={columns} data={loans} loading={loading} onRowClick={(r) => navigate(`/loans/${r.id}`)} />
        {total > 10 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
            <span style={{ padding: '0 12px', fontSize: '13px' }}>Page {page} of {Math.ceil(total / 10)}</span>
            <button disabled={page * 10 >= total} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
