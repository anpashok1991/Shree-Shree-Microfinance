import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { collectionApi, loanApi, customerApi, receiptApi, whatsappLink } from '../../services/api';
import { Search, IndianRupee, Printer, XCircle, MessageCircle } from 'lucide-react';
import DataTable from '../../components/common/DataTable';

export default function CollectionPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [loan, setLoan] = useState<any>(null);
  const [amount, setAmount] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [collectionDate, setCollectionDate] = useState(new Date().toISOString().split('T')[0]);
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
        collectionDate,
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

  const handleVoid = async (id: string) => {
    if (!confirm('Are you sure you want to void this collection? This will reverse the payment.')) return;
    try {
      await collectionApi.void(id);
      collectionApi.getAll({ limit: 10 }).then((r) => setRecent(r.data));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to void');
    }
  };

  const handlePrintReceipt = async (collection: any) => {
    try {
      const res = await receiptApi.getByCollection(collection.id);
      const r = res.data;
      if (!r) { alert('Receipt not found'); return; }

      const win = window.open('', '_blank');
      if (!win) { alert('Please allow popups'); return; }

      win.document.write(`
        <html><head><title>Receipt ${r.receiptNo}</title>
        <style>
          body { font-family: 'Courier New', monospace; max-width: 300px; margin: 20px auto; padding: 10px; }
          h2 { text-align: center; margin: 0 0 4px; font-size: 16px; }
          .center { text-align: center; font-size: 12px; margin: 2px 0; }
          hr { border: dashed 1px #999; }
          table { width: 100%; font-size: 12px; }
          td { padding: 2px 4px; }
          .right { text-align: right; }
          .bold { font-weight: bold; }
          .footer { text-align: center; font-size: 11px; margin-top: 8px; color: #666; }
          @media print { .no-print { display: none; } }
        </style></head><body>
        <h2>Shree Shree Group</h2>
        <p class="center">Microfinance System</p>
        <p class="center"><strong>RECEIPT</strong></p>
        <hr/>
        <table>
          <tr><td>Receipt #</td><td class="right bold">${r.receiptNo}</td></tr>
          <tr><td>Date</td><td class="right">${new Date(collection.collectionDate).toLocaleDateString()}</td></tr>
          <tr><td>Customer</td><td class="right">${r.customerName}</td></tr>
          <tr><td>Loan #</td><td class="right">${collection.loan?.loanNumber || '-'}</td></tr>
          <tr><td>Amount</td><td class="right bold">₹${r.amount.toLocaleString()}</td></tr>
          <tr><td>Balance Before</td><td class="right">₹${r.balanceBefore.toLocaleString()}</td></tr>
          <tr><td>Balance After</td><td class="right">₹${r.balanceAfter.toLocaleString()}</td></tr>
          ${collection.remarks ? `<tr><td>Remarks</td><td class="right">${collection.remarks}</td></tr>` : ''}
        </table>
        <hr/>
        <p class="center">Thank you for your payment!</p>
        <p class="footer">Generated on ${new Date().toLocaleString()}</p>
        <div class="no-print" style="text-align:center;margin-top:16px">
          <button onclick="window.print()" style="padding:8px 24px;cursor:pointer">Print</button>
        </div>
        <script>window.onload = function() { setTimeout(function() { window.print(); }, 500); }</script>
      </body></html>`);
      win.document.close();
    } catch { alert('Failed to load receipt'); }
  };

  const columns = [
    { key: 'receipt', label: 'Receipt', render: (r: any) => <span className="font-medium">{r.receipt?.receiptNo || r.collectionNo}</span> },
    { key: 'customer', label: 'Customer', render: (r: any) => r.customer?.name },
    { key: 'amount', label: 'Amount', render: (r: any) => `₹${r.amount.toLocaleString()}` },
    { key: 'collectedBy', label: 'By', render: (r: any) => r.collectedBy?.name },
    { key: 'collectionDate', label: 'Date', render: (r: any) => new Date(r.collectionDate).toLocaleString() },
    { key: 'remarks', label: 'Remarks', render: (r: any) => r.remarks || '-' },
    {
      key: 'actions', label: 'Actions', render: (r: any) => (
        <div className="table-actions">
          <button className="btn btn-sm btn-secondary" onClick={(e) => { e.stopPropagation(); handlePrintReceipt(r); }} title="Print Receipt">
            <Printer size={14} />
          </button>
          <button className="btn btn-sm btn-success" onClick={(e) => { e.stopPropagation(); window.open(whatsappLink(r.customer?.mobile || '', `Dear ${r.customer?.name}, your payment of ₹${r.amount} has been received. Receipt: ${r.receipt?.receiptNo || r.collectionNo}`), '_blank'); }} title="Send via WhatsApp">
            <MessageCircle size={14} />
          </button>
          <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); handleVoid(r.id); }} title="Void Collection">
            <XCircle size={14} />
          </button>
        </div>
      ),
    },
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
                      <label className="form-label">Collection Date</label>
                      <input className="form-input" type="date" value={collectionDate} onChange={(e) => setCollectionDate(e.target.value)} />
                    </div>
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
