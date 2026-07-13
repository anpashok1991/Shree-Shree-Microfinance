import { useState, useEffect, FormEvent } from 'react';
import { collectionApi, loanApi, customerApi } from '../../services/api';
import { Search, IndianRupee } from 'lucide-react';
import DataTable from '../../components/common/DataTable';

export default function CollectionPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [loan, setLoan] = useState<any>(null);
  const [amount, setAmount] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [recent, setRecent] = useState<any[]>([]);
  const [tab, setTab] = useState<'record' | 'history'>('record');

  useEffect(() => {
    collectionApi.getAll({ limit: 10 }).then((r) => setRecent(r.data)).catch(console.error);
    customerApi.getAll({ limit: 100 }).then((r) => setCustomers(r.data)).catch(console.error);
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile.includes(search) || c.customerId?.includes(search)
  ).slice(0, 10);

  const selectCustomer = async (c: any) => {
    setSelectedCustomer(c);
    setSearch('');
    setMessage('');
    try {
      const res = await loanApi.getAll({ customerId: c.id, status: 'ACTIVE', limit: 1 });
      if (res.data?.[0]) {
        setLoan(res.data[0]);
        setAmount(res.data[0].dailyCollection);
      } else {
        setLoan(null);
        setAmount(0);
      }
    } catch { setLoan(null); }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !loan) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await collectionApi.create({
        loanId: loan.id,
        customerId: selectedCustomer.id,
        amount,
        remarks,
      });
      setMessage(`Collection recorded! Receipt: ${res.data?.receipt?.receiptNo || ''}`);
      setAmount(0);
      setRemarks('');
      setSelectedCustomer(null);
      setLoan(null);
      collectionApi.getAll({ limit: 10 }).then((r) => setRecent(r.data));
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const columns = [
    { key: 'collectionNo', label: 'Receipt', render: (r: any) => <span className="font-medium">{r.receipt?.receiptNo || r.collectionNo}</span> },
    { key: 'customer', label: 'Customer', render: (r: any) => r.customer?.name },
    { key: 'amount', label: 'Amount', render: (r: any) => `₹${r.amount.toLocaleString()}` },
    { key: 'collectedBy', label: 'By', render: (r: any) => r.collectedBy?.name },
    { key: 'collectionDate', label: 'Date', render: (r: any) => new Date(r.collectionDate).toLocaleString() },
  ];

  return (
    <div>
      <h1 className="header-title mb-4">Collections</h1>

      <div className="tabs">
        <button className={`tab ${tab === 'record' ? 'active' : ''}`} onClick={() => setTab('record')}>Record Collection</button>
        <button className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>History</button>
      </div>

      {tab === 'record' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header"><h3 className="card-title">Select Customer</h3></div>
            <div className="card-body">
              <div className="search-box mb-4">
                <Search size={18} />
                <input className="form-input" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                {filtered.map((c: any) => (
                  <div key={c.id}
                    style={{
                      padding: '10px 12px', cursor: 'pointer', borderRadius: 'var(--radius)',
                      background: selectedCustomer?.id === c.id ? 'var(--bg-hover)' : 'transparent',
                      borderBottom: '1px solid var(--border-light)'
                    }}
                    onClick={() => selectCustomer(c)}
                  >
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-secondary">{c.customerId} | {c.mobile} | {c.village}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3 className="card-title">Record Payment</h3></div>
            <div className="card-body">
              {!selectedCustomer ? (
                <div className="empty-state"><IndianRupee size={48} /><p>Select a customer to record collection</p></div>
              ) : !loan ? (
                <div className="empty-state"><p>No active loan found for this customer</p></div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <Row label="Customer" value={selectedCustomer.name} />
                    <Row label="Loan #" value={loan.loanNumber} />
                    <Row label="Daily Due" value={`₹${loan.dailyCollection}`} />
                    <Row label="Outstanding" value={`₹${loan.outstanding.toLocaleString()}`} />
                    <div className="form-group">
                      <label className="form-label">Amount *</label>
                      <input className="form-input" type="number" step="0.01" required value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Remarks</label>
                      <input className="form-input" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                    </div>
                    <button className="btn btn-success btn-lg" type="submit" disabled={saving || amount <= 0}>
                      {saving ? 'Recording...' : `Record ₹${amount.toLocaleString()} Collection`}
                    </button>
                    {message && <div className={`alert ${message.includes('Failed') ? 'alert-danger' : 'alert-success'}`}>{message}</div>}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="card">
          <DataTable columns={columns} data={recent} />
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
      <span className="text-secondary">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
