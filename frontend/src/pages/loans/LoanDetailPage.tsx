import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loanApi, publicApi, API_BASE } from '../../services/api';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Edit, Save, X, Ban, FileText, Download } from 'lucide-react';

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
  const [showForeclose, setShowForeclose] = useState(false);
  const [forecloseData, setForecloseData] = useState<any>(null);

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

  const handleForeclose = async () => {
    setActionLoading(true);
    try {
      await loanApi.foreclose(id!);
      setShowForeclose(false);
      fetch();
    } catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
    finally { setActionLoading(false); }
  };

  const openForeclose = async () => {
    try {
      const res = await loanApi.getById(id!);
      const l = res.data;
      const chargePercent = l.foreclosureChargePercent !== undefined ? l.foreclosureChargePercent : 0;
      const outstanding = l.outstanding || 0;
      const charge = (outstanding * chargePercent) / 100;
      setForecloseData({ outstanding, chargePercent, charge, total: outstanding + charge });
      setShowForeclose(true);
    } catch { alert('Could not load loan data'); }
  };

  const handlePrintNoc = async () => {
    try {
      const res = await loanApi.generateNoc(id!);
      const noc = res.data;
      const logoRes = await publicApi.getCompanyInfo();
      const logoUrl = logoRes.data?.logo || '';
      const printWin = window.open('', '_blank');
      if (!printWin) return;
      printWin.document.write(`
        <html><head><title>NOC - ${noc.nocNumber}</title>
        <style>
          body { font-family: 'Georgia', serif; padding: 50px; max-width: 700px; margin: auto; line-height: 1.8; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
          .header img { max-height: 60px; margin-bottom: 8px; }
          h1 { font-size: 22px; margin: 4px 0; }
          h2 { font-size: 16px; text-align: center; margin: 30px 0 20px; text-decoration: underline; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 8px 12px; border: 1px solid #333; text-align: left; }
          th { background: #f5f5f5; }
          .footer { margin-top: 40px; text-align: center; font-size: 13px; color: #666; }
          .signature { margin-top: 50px; display: flex; justify-content: space-between; }
          .signature div { text-align: center; }
        </style></head><body>
          <div class="header">
            ${logoUrl ? `<img src="${API_BASE}/public/logo" alt="Logo" />` : ''}
            <h1>${noc.companyName}</h1>
            <div>${noc.companyAddress}</div>
          </div>
          <h2>NO OBJECTION CERTIFICATE</h2>
          <p style="text-align:justify">This is to certify that <b>${noc.customerName}</b> of <b>${noc.customerAddress}</b> had availed a loan (Loan No: <b>${noc.loanNumber}</b>) of ₹${noc.loanAmount?.toLocaleString()} from ${noc.companyName}. The loan has been fully repaid and closed on ${noc.loanClosedDate ? new Date(noc.loanClosedDate).toLocaleDateString() : '-'}.</p>
          <p style="text-align:justify">The said borrower has no outstanding dues payable to the company. This NOC is issued as a no-objection from the company's side for the borrower to utilize the loan closure for any future financial purposes.</p>
          <table>
            <tr><th>Loan Number</th><td>${noc.loanNumber}</td></tr>
            <tr><th>Borrower Name</th><td>${noc.customerName}</td></tr>
            <tr><th>Loan Amount</th><td>₹${noc.loanAmount?.toLocaleString()}</td></tr>
            <tr><th>Disbursed Amount</th><td>₹${noc.disbursedAmount?.toLocaleString()}</td></tr>
            <tr><th>Total Repaid</th><td>₹${noc.totalPaid?.toLocaleString()}</td></tr>
            <tr><th>Loan Start Date</th><td>${noc.loanStartDate ? new Date(noc.loanStartDate).toLocaleDateString() : '-'}</td></tr>
            <tr><th>Loan Closed Date</th><td>${noc.loanClosedDate ? new Date(noc.loanClosedDate).toLocaleDateString() : '-'}</td></tr>
            <tr><th>NOC Number</th><td>${noc.nocNumber}</td></tr>
            <tr><th>Issue Date</th><td>${new Date(noc.issuedDate).toLocaleDateString()}</td></tr>
          </table>
          <p style="text-align:justify">The company has no objection to the borrower availing any future loans or financial facilities from any other institution.</p>
          <div class="signature">
            <div><br/><br/><br/>________________<br/>Authorized Signatory</div>
            <div><br/><br/><br/>________________<br/>Borrower</div>
          </div>
          <div class="footer">This is a system-generated certificate and does not require a physical signature.</div>
        </body></html>
      `);
      printWin.document.close();
      printWin.print();
    } catch (err: any) { alert(err.response?.data?.message || 'Failed to generate NOC'); }
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

  const handleDownloadStatement = () => {
    if (!loan) return;
    const companyName = 'Shree Shree Group';
    const win = window.open('', '_blank');
    if (!win) return;
    const rows = (loan.collections || []).map((c: any) => `
      <tr>
        <td>${new Date(c.collectionDate).toLocaleDateString()}</td>
        <td>${c.receipt?.receiptNo || '-'}</td>
        <td style="text-align:right">₹${c.amount.toLocaleString()}</td>
        <td>${c.collectedBy?.name || '-'}</td>
        <td style="text-align:right">₹${c.balanceAfter?.toLocaleString() || '-'}</td>
      </tr>
    `).join('');
    const totalPaid = (loan.collections || []).reduce((s: number, c: any) => s + (c.amount || 0), 0);
    win.document.write(`
      <html><head><title>Statement - ${loan.loanNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 30px; max-width: 800px; margin: auto; }
        h2 { text-align: center; margin-bottom: 4px; }
        .info { margin: 20px 0; }
        .info td { padding: 4px 8px; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th, td { padding: 8px 10px; border: 1px solid #ccc; font-size: 13px; }
        th { background: #f5f5f5; text-align: left; }
        .total-row { font-weight: bold; background: #f9f9f9; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        @media print { .no-print { display: none; } }
      </style></head><body>
        <h2>${companyName}</h2>
        <p style="text-align:center;margin-bottom:20px">Loan Payment Statement</p>
        <table class="info">
          <tr><td><b>Customer:</b></td><td>${loan.customer?.name || ''}</td><td><b>Loan #:</b></td><td>${loan.loanNumber}</td></tr>
          <tr><td><b>Amount:</b></td><td>₹${loan.amount.toLocaleString()}</td><td><b>Status:</b></td><td>${loan.status}</td></tr>
        </table>
        <table>
          <thead><tr><th>Date</th><th>Receipt</th><th style="text-align:right">Amount</th><th>Collected By</th><th style="text-align:right">Balance</th></tr></thead>
          <tbody>${rows}</tbody>
          <tfoot><tr class="total-row"><td colspan="2">Total Paid</td><td style="text-align:right">₹${totalPaid.toLocaleString()}</td><td colspan="2"></td></tr></tfoot>
        </table>
        <div class="footer">Generated on ${new Date().toLocaleString()}</div>
        <div class="no-print" style="text-align:center;margin-top:20px">
          <button onclick="window.print()" style="padding:8px 24px;cursor:pointer">Print / Save as PDF</button>
        </div>
      </body></html>
    `);
    win.document.close();
    win.print();
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

      {(loan.status === 'ACTIVE' || loan.status === 'CLOSED') && (
        <div className="flex gap-2 mb-4" style={{ flexWrap: 'wrap' }}>
          {loan.status === 'ACTIVE' && loan.outstanding > 0 && (
            <>
              <button className="btn btn-warning" onClick={handleRenew} disabled={actionLoading} title="Renew the loan with a renewal charge">
                <RotateCcw size={18} /> Renew Loan
              </button>
              <button className="btn btn-success" onClick={() => navigate(`/collections?loanId=${loan.id}&customerId=${loan.customerId}`)} title="Record a new collection payment">
                Record Collection
              </button>
              <button className="btn btn-secondary" onClick={openForeclose} title="Close the loan early with a foreclosure charge (if any)">
                <Ban size={18} /> Foreclose Loan
              </button>
            </>
          )}
          {loan.status === 'CLOSED' && (
            <button className="btn btn-primary" onClick={handlePrintNoc} title="Download No Objection Certificate for this closed loan">
              <FileText size={18} /> Download NOC
            </button>
          )}
          <button className="btn btn-secondary" onClick={handleDownloadStatement} title="Download payment statement">
            <Download size={18} /> Statement
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

      <Modal open={showForeclose} onClose={() => setShowForeclose(false)} title="Foreclose Loan">
        {forecloseData && (
          <div>
            <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
              This will close the loan early. The borrower must pay the outstanding amount plus any applicable foreclosure charge.
            </p>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '16px' }}>
              <Row label="Outstanding Amount" value={`₹${forecloseData.outstanding.toLocaleString()}`} />
              <Row label={`Foreclosure Charge (${forecloseData.chargePercent}%)`} value={`₹${forecloseData.charge.toLocaleString()}`} />
              <Row label="Total Payment Required" value={`₹${forecloseData.total.toLocaleString()}`} bold />
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={handleForeclose} disabled={actionLoading}>
                {actionLoading ? 'Processing...' : 'Confirm Foreclosure'}
              </button>
              <button className="btn btn-secondary" onClick={() => setShowForeclose(false)}>Cancel</button>
            </div>
          </div>
        )}
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
