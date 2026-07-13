import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { borrowerApi, receiptApi, loanApi, publicApi, API_BASE } from '../../services/api';
import { ArrowLeft, Receipt, Printer, FileText, Download } from 'lucide-react';

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

  const [companyInfo, setCompanyInfo] = useState<any>(null);

  useEffect(() => {
    publicApi.getCompanyInfo().then(r => setCompanyInfo(r.data)).catch(() => {});
  }, []);

  const printReceipt = () => {
    const printWin = window.open('', '_blank');
    if (!printWin || !receipt) return;
    const logoHtml = companyInfo?.logo
      ? `<div style="text-align:center;margin-bottom:8px"><img src="${API_BASE}/public/logo" style="max-height:50px"/></div>`
      : '';
    const companyName = companyInfo?.companyName || 'Shree Shree Group';
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
        ${logoHtml}
        <h2>${companyName}</h2>
        <div class="center">Payment Receipt</div>
        <hr/>
        <table>
          <tr><td>Receipt No</td><td><b>${receipt.receiptNo}</b></td></tr>
          <tr><td>Date</td><td>${new Date(receipt.createdAt).toLocaleDateString()}</td></tr>
          <tr><td>Customer</td><td>${receipt.customerName}</td></tr>
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

  const printNoc = async () => {
    if (!id) return;
    try {
      const res = await loanApi.generateNoc(id);
      const noc = res.data;
      const printWin = window.open('', '_blank');
      if (!printWin) return;
      const logoHtml = companyInfo?.logo
        ? `<div style="text-align:center;margin-bottom:8px"><img src="${API_BASE}/public/logo" style="max-height:60px"/></div>`
        : '';
      printWin.document.write(`
        <html><head><title>NOC - ${noc.nocNumber}</title>
        <style>
          body { font-family: 'Georgia', serif; padding: 50px; max-width: 700px; margin: auto; line-height: 1.8; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
          h1 { font-size: 22px; margin: 4px 0; }
          h2 { font-size: 16px; text-align: center; margin: 30px 0 20px; text-decoration: underline; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 8px 12px; border: 1px solid #333; text-align: left; }
          th { background: #f5f5f5; }
          .footer { margin-top: 40px; text-align: center; font-size: 13px; color: #666; }
          .signature { margin-top: 50px; display: flex; justify-content: space-between; }
        </style></head><body>
          <div class="header">
            ${logoHtml}
            <h1>${noc.companyName}</h1>
            <div>${noc.companyAddress}</div>
          </div>
          <h2>NO OBJECTION CERTIFICATE</h2>
          <p style="text-align:justify">This is to certify that <b>${noc.customerName}</b> of <b>${noc.customerAddress}</b> had availed a loan (Loan No: <b>${noc.loanNumber}</b>) of ₹${noc.loanAmount?.toLocaleString()} from ${noc.companyName}. The loan has been fully repaid and closed on ${noc.loanClosedDate ? new Date(noc.loanClosedDate).toLocaleDateString() : '-'}.</p>
          <p style="text-align:justify">The said borrower has no outstanding dues payable to the company. This NOC is issued as a no-objection from the company's side for the borrower to utilize the loan closure for any future financial purposes.</p>
          <table><tr><th>Loan Number</th><td>${noc.loanNumber}</td></tr><tr><th>Borrower Name</th><td>${noc.customerName}</td></tr><tr><th>Loan Amount</th><td>₹${noc.loanAmount?.toLocaleString()}</td></tr><tr><th>Disbursed Amount</th><td>₹${noc.disbursedAmount?.toLocaleString()}</td></tr><tr><th>Total Repaid</th><td>₹${noc.totalPaid?.toLocaleString()}</td></tr><tr><th>Loan Start Date</th><td>${noc.loanStartDate ? new Date(noc.loanStartDate).toLocaleDateString() : '-'}</td></tr><tr><th>Loan Closed Date</th><td>${noc.loanClosedDate ? new Date(noc.loanClosedDate).toLocaleDateString() : '-'}</td></tr><tr><th>NOC Number</th><td>${noc.nocNumber}</td></tr><tr><th>Issue Date</th><td>${new Date(noc.issuedDate).toLocaleDateString()}</td></tr></table>
          <div class="signature"><div><br/><br/><br/>________________<br/>Authorized Signatory</div><div><br/><br/><br/>________________<br/>Borrower</div></div>
          <div class="footer">This is a system-generated certificate.</div>
        </body></html>
      `);
      printWin.document.close();
      printWin.print();
    } catch {}
  };

  const handleDownloadStatement = () => {
    if (!loan) return;
    const companyName = companyInfo?.companyName || 'Shree Shree Group';
    const win = window.open('', '_blank');
    if (!win) return;
    const rows = (loan.collections || []).map((c: any) => `
      <tr>
        <td>${new Date(c.collectionDate || c.createdAt).toLocaleDateString()}</td>
        <td>${c.receipt?.receiptNo || '-'}</td>
        <td style="text-align:right">₹${c.amount.toLocaleString()}</td>
        <td style="text-align:right">₹${(c.balanceAfter ?? '-').toLocaleString()}</td>
      </tr>
    `).join('');
    const totalPaid = (loan.collections || []).reduce((s: number, c: any) => s + (c.amount || 0), 0);
    const logoHtml = companyInfo?.logo
      ? `<div style="text-align:center;margin-bottom:8px"><img src="${API_BASE}/public/logo" style="max-height:50px"/></div>`
      : '';
    win.document.write(`
      <html><head><title>Statement - ${loan.loanNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 30px; max-width: 700px; margin: auto; }
        h2 { text-align: center; margin: 4px 0; }
        .info { margin: 20px 0; width: 100%; }
        .info td { padding: 4px 8px; font-size: 13px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th, td { padding: 8px 10px; border: 1px solid #ccc; font-size: 13px; }
        th { background: #f5f5f5; text-align: left; }
        .total-row { font-weight: bold; background: #f9f9f9; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        @media print { .no-print { display: none; } }
      </style></head><body>
        ${logoHtml}
        <h2>${companyName}</h2>
        <p style="text-align:center;margin-bottom:20px">Loan Payment Statement</p>
        <table class="info">
          <tr><td><b>Loan #:</b></td><td>${loan.loanNumber}</td><td><b>Amount:</b></td><td>₹${loan.amount.toLocaleString()}</td></tr>
          <tr><td><b>Disbursed:</b></td><td>₹${loan.disbursedAmount?.toLocaleString()}</td><td><b>Status:</b></td><td>${loan.status}</td></tr>
        </table>
        <table>
          <thead><tr><th>Date</th><th>Receipt</th><th style="text-align:right">Amount</th><th style="text-align:right">Balance</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="4" style="text-align:center">No payments yet</td></tr>'}</tbody>
          <tfoot><tr class="total-row"><td colspan="2">Total Paid</td><td style="text-align:right">₹${totalPaid.toLocaleString()}</td><td></td></tr></tfoot>
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

      <div className="flex gap-2 flex-wrap mb-4">
        <button className="btn btn-secondary" onClick={handleDownloadStatement}>
          <Download size={18} /> Download Statement
        </button>
        {loan.status === 'CLOSED' && (
          <button className="btn btn-primary" onClick={printNoc}>
            <FileText size={18} /> Download NOC
          </button>
        )}
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