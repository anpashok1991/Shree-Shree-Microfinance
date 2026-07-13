import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loanApi } from '../../services/api';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Edit, Save, X } from 'lucide-react';

export default function LoanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editAmount, setEditAmount] = useState(0);

  const fetch = () => {
    setLoading(true);
    loanApi.getById(id!)
      .then((r) => { setLoan(r.data); setEditAmount(r.data.amount); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [id]);

  const handleApprove = async () => {
    setActionLoading(true);
    try { await loanApi.approve(id!); fetch(); }
    catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
    finally { setActionLoading(false); }
  };

  const handleReject = async () => {
    if (!reason.trim()) return;
    setActionLoading(true);
    try { await loanApi.reject(id!, reason); setShowReject(false); fetch(); }
    catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
    finally { setActionLoading(false); }
  };

  const handleRenew = async () => {
    if (!confirm('Create renewal loan?')) return;
    setActionLoading(true);
    try { await loanApi.renew(id!); fetch(); }
    catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
    finally { setActionLoading(false); }
  };

  const handleSaveEdit = async () => {
    if (editAmount <= 0) return;
    setActionLoading(true);
    try {
      await loanApi.update(id!, { amount: editAmount });
      setEditing(false);
      fetch();
    } catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
    finally { setActionLoading(false); }
  };

  if (loading) return <Loading />;
  if (!loan) return <div className="empty-state">Loan not found</div>;

  const canEdit = ['PENDING_APPROVAL', 'RETURNED'].includes(loan.status);
  const badges: any = { ACTIVE: 'badge-success', PENDING_APPROVAL: 'badge-warning', CLOSED: 'badge-secondary', REJECTED: 'badge-danger', RETURNED: 'badge-info', RENEWED: 'badge-info' };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/loans')}><ArrowLeft size={16} /> Back</button>
        <h1 className="header-title" style={{ flex: 1 }}>Loan {loan.loanNumber}</h1>
        <span className={`badge ${badges[loan.status]}`} style={{ fontSize: '14px', padding: '4px 14px' }}>{loan.status.replace('_', ' ')}</span>
        {canEdit && !editing && (
          <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
            <Edit size={16} /> Edit
          </button>
        )}
      </div>

      <div className="grid-2 mb-4">
        <div className="card">
          <div className="card-header"><h3 className="card-title">Customer Info</h3></div>
          <div className="card-body">
            <Row label="Name" value={loan.customer?.name} />
            <Row label="Mobile" value={loan.customer?.mobile} />
            <Row label="Aadhaar" value={loan.customer?.aadhaarNumber} />
            <Row label="Area" value={loan.customer?.area?.name} />
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="card-title">Loan Details</h3></div>
          <div className="card-body">
            {editing ? (
              <>
                <div className="form-group">
                  <label className="form-label">Loan Amount (₹)</label>
                  <input className="form-input" type="number" value={editAmount} onChange={e => setEditAmount(parseInt(e.target.value) || 0)} />
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="btn btn-primary btn-sm" onClick={handleSaveEdit} disabled={actionLoading}><Save size={16} /> Save</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(false); setEditAmount(loan.amount); }} disabled={actionLoading}><X size={16} /> Cancel</button>
                </div>
              </>
            ) : (
              <>
                <Row label="Amount" value={`₹${loan.amount.toLocaleString()}`} />
                <Row label="File Charge" value={`₹${loan.fileCharge.toLocaleString()}`} />
                <Row label="Disbursed" value={`₹${loan.disbursedAmount.toLocaleString()}`} bold />
                <Row label="Daily Collection" value={`₹${loan.dailyCollection}/day`} />
                <Row label="Total Recovery" value={`₹${loan.totalRecovery.toLocaleString()}`} />
                <Row label="Total Paid" value={`₹${loan.totalPaid.toLocaleString()}`} />
                <Row label="Outstanding" value={`₹${loan.outstanding.toLocaleString()}`} bold color={loan.outstanding > 0 ? 'var(--danger)' : 'var(--secondary)'} />
                <Row label="Tenure" value={`${loan.tenure} Days`} />
              </>
            )}
          </div>
        </div>
      </div>

      {loan.status === 'PENDING_APPROVAL' && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="flex gap-2">
              <button className="btn btn-success btn-lg" onClick={handleApprove} disabled={actionLoading}>
                <CheckCircle size={18} /> Approve Loan
              </button>
              <button className="btn btn-danger btn-lg" onClick={() => setShowReject(true)} disabled={actionLoading}>
                <XCircle size={18} /> Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {loan.status === 'ACTIVE' && loan.outstanding > 0 && (
        <div className="flex gap-2 mb-4">
          <button className="btn btn-warning" onClick={handleRenew} disabled={actionLoading}>
            <RotateCcw size={18} /> Renew Loan (20% Charge)
          </button>
          <button className="btn btn-success" onClick={() => navigate(`/collections?loanId=${loan.id}&customerId=${loan.customerId}`)}>
            Record Collection
          </button>
        </div>
      )}

      {loan.collections?.length > 0 && (
        <div className="card">
          <div className="card-header"><h3 className="card-title">Collection History</h3></div>
          <div className="card-body">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Receipt</th>
                    <th>Amount</th>
                    <th>Collected By</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {loan.collections.map((c: any) => (
                    <tr key={c.id}>
                      <td>{new Date(c.collectionDate).toLocaleDateString()}</td>
                      <td>{c.receipt?.receiptNo || '-'}</td>
                      <td className="font-medium">₹{c.amount.toLocaleString()}</td>
                      <td>{c.collectedBy?.name}</td>
                      <td className="text-secondary">{c.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <Modal open={showReject} onClose={() => setShowReject(false)} title="Reject Loan">
        <div className="form-group">
          <label className="form-label">Reason for rejection *</label>
          <textarea className="form-textarea" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
        </div>
        <div className="flex gap-2 mt-2">
          <button className="btn btn-danger" onClick={handleReject} disabled={actionLoading || !reason.trim()}>
            Confirm Reject
          </button>
          <button className="btn btn-secondary" onClick={() => setShowReject(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}

function Row({ label, value, bold, color }: { label: string; value: any; bold?: boolean; color?: string }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
      <span className="text-secondary">{label}</span>
      <span className={bold ? 'font-bold' : ''} style={color ? { color } : undefined}>{value}</span>
    </div>
  );
}
