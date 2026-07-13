import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { borrowerApi, receiptApi } from '../../services/api';
import { ArrowLeft, Receipt, Printer } from 'lucide-react';

export default function BorrowerLoanDetailPage() {
  const { id } = useParams();
  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    borrowerApi.getLoanDetail(id)
      .then((r) => setLoan(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const viewReceipt = async (collectionId: string) => {
    try {
      const r = await receiptApi.getByCollection(collectionId);
      setReceipt(r.data);
    } catch {}
  };

  const printReceipt = () => {
    const printWin = window.open('', '_blank');
    if (!printWin || !receipt) return;
    printWin.document.write(`
      <html><head><title>Receipt ${receipt.receiptNo}</title>
      <style>
        body { font-family: monospace; padding: 40px; max-width: 400px; margin: auto; }
        h2 { text-align: center; margin-bottom: 4px; }
        .center { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 6px 8px; text-align: left; border-bottom: 1px dashed #ccc; }
        .total { font-weight: bold; font-size: 16px; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        hr { border: none; border-top: 1px dashed #000; margin: 16px 0; }
      </style></head><body>
        <h2>${loan?.customer?.name || receipt.customerName}</h2>
        <div class="center">Payment Receipt</div>
        <hr/>
        <table>
          <tr><td>Receipt No</td><td><b>${receipt.receiptNo}</b></td></tr>
          <tr><td>Date</td><td>${new Date(receipt.createdAt).toLocaleDateString()}</td></tr>
          <tr><td>Loan No</td><td>${receipt.loanId ? (loan?.loanNumber || '') : ''}</td></tr>
          <tr><td>Amount</td><td class="total">₹${receipt.amount.toLocaleString()}</td></tr>
          <tr><td>Balance Before</td><td>₹${receipt.balanceBefore.toLocaleString()}</td></tr>
          <tr><td>Balance After</td><td>₹${receipt.balanceAfter.toLocaleString()}</td></tr>
        </table>
        <hr/>
        <div class="footer">Thank you for your payment</div>
      </body></html>
    `);
    printWin.document.close();
    printWin.print();
  };

  if (loading) return <p className="text-secondary">Loading loan details...</p>;
  if (!loan) return <p className="text-secondary">Loan not found</p>;

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
      <Link to="/borrower/loans" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>
        <ArrowLeft size={16} /> Back to My Loans
      </Link>

      <div className="card mb-4">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title">Loan {loan.loanNumber}</h3>
          <span className={`badge ${statusBadge[loan.status] || 'badge-secondary'}`}>
            {loan.status?.replace('_', ' ')}
          </span>
        </div>
        <div className="card-body">
          <div className="grid-3" style={{ gap: '16px', fontSize: '14px' }}>
            <div><span className="text-secondary">Loan Amount</span><div style={{ fontWeight: 600 }}>₹{loan.amount?.toLocaleString()}</div></div>
            <div><span className="text-secondary">Disbursed Amount</span><div style={{ fontWeight: 600 }}>₹{loan.disbursedAmount?.toLocaleString()}</div></div>
            <div><span className="text-secondary">Daily Collection</span><div style={{ fontWeight: 600 }}>₹{loan.dailyCollection?.toFixed(2)}</div></div>
            <div><span className="text-secondary">Total Recovery</span><div style={{ fontWeight: 600 }}>₹{loan.totalRecovery?.toLocaleString()}</div></div>
            <div><span className="text-secondary">Total Paid</span><div style={{ fontWeight: 600, color: 'var(--success)' }}>₹{loan.totalPaid?.toLocaleString()}</div></div>
            <div><span className="text-secondary">Outstanding</span><div style={{ fontWeight: 600, color: loan.outstanding > 0 ? 'var(--danger)' : 'var(--success)' }}>₹{loan.outstanding?.toLocaleString()}</div></div>
            <div><span className="text-secondary">Tenure</span><div style={{ fontWeight: 600 }}>{loan.tenure} days</div></div>
            <div><span className="text-secondary">Interest Rate</span><div style={{ fontWeight: 600 }}>{loan.interestRate}%</div></div>
            <div><span className="text-secondary">Start Date</span><div style={{ fontWeight: 600 }}>{loan.startDate ? new Date(loan.startDate).toLocaleDateString() : '-'}</div></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title">Collection History</h3></div>
        <div className="card-body">
          {(!loan.collections || loan.collections.length === 0) ? (
            <p className="text-secondary">No collections recorded yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Amount (₹)</th>
                    <th>Receipt No</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loan.collections.map((c: any, i: number) => (
                    <tr key={c.id}>
                      <td>{i + 1}</td>
                      <td>{new Date(c.collectionDate || c.createdAt).toLocaleDateString()}</td>
                      <td>{c.amount.toLocaleString()}</td>
                      <td>{c.receipt?.receiptNo || '-'}</td>
                      <td>
                        {c.receipt && (
                          <button className="btn btn-sm btn-secondary" onClick={() => viewReceipt(c.id)} title="View Receipt">
                            <Receipt size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {receipt && (
        <div className="modal-overlay" onClick={() => setReceipt(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', width: '90%' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="card-title">Receipt #{receipt.receiptNo}</h3>
              <button className="btn btn-sm btn-primary" onClick={printReceipt}>
                <Printer size={14} /> Print
              </button>
            </div>
            <div className="card-body">
              <div style={{ fontSize: '14px', lineHeight: 2 }}>
                <div><span className="text-secondary">Receipt No:</span> <b>{receipt.receiptNo}</b></div>
                <div><span className="text-secondary">Date:</span> {new Date(receipt.createdAt).toLocaleString()}</div>
                <div><span className="text-secondary">Customer:</span> {receipt.customerName}</div>
                <div><span className="text-secondary">Loan No:</span> {loan?.loanNumber || '-'}</div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span>Amount Paid</span>
                  <span style={{ color: 'var(--success)', fontSize: '18px' }}>₹{receipt.amount.toLocaleString()}</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
                <div><span className="text-secondary">Balance Before:</span> ₹{receipt.balanceBefore.toLocaleString()}</div>
                <div><span className="text-secondary">Balance After:</span> ₹{receipt.balanceAfter.toLocaleString()}</div>
              </div>
            </div>
            <div className="card-footer" style={{ textAlign: 'right', padding: '12px 16px' }}>
              <button className="btn btn-secondary" onClick={() => setReceipt(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}