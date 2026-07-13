import { useState } from 'react';
import { X } from 'lucide-react';

const termsContent = `
SHREE SHREE MICROFINANCE — TERMS & CONDITIONS

1. LOAN APPLICATION
By submitting this loan application, you confirm that all information provided is true and accurate. Any false or misleading information may result in immediate rejection or cancellation of the loan.

2. LOAN AMOUNT & CHARGES
The loan amount, interest rate, processing fee (file charge), and repayment tenure will be as disclosed at the time of approval. A file charge of the applicable percentage will be deducted from the disbursed amount.

3. REPAYMENT
You agree to make daily/weekly collections as per the repayment schedule. Failure to make timely payments may result in additional charges and impact your credit standing.

4. DEFAULT & RECOVERY
In case of default, the company reserves the right to take appropriate recovery actions as permitted by law, including reporting to credit bureaus.

5. FORECLOSURE
You may close the loan early by paying the outstanding amount plus any applicable foreclosure charges as determined by the company.

6. DATA PRIVACY
Your personal and financial information will be kept confidential and used only for loan processing and legal compliance purposes.

7. GOVERNING LAW
These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts located in the applicable jurisdiction.

By accepting these terms, you acknowledge that you have read, understood, and agree to abide by all the above conditions.
`;

export default function TermsDialog({ onAccept }: { onAccept: () => void }) {
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    setOpen(false);
    onAccept();
  };

  return (
    <div className="form-group">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <input
          type="checkbox"
          checked={accepted}
          onChange={() => {
            if (!accepted) setOpen(true);
            else setAccepted(false);
          }}
          style={{ marginTop: '3px' }}
          required
        />
        <label className="form-label" style={{ margin: 0 }}>
          I have read and agree to the{' '}
          <button type="button" className="btn btn-link" style={{ padding: 0, fontSize: 'inherit', textDecoration: 'underline' }}
            onClick={() => setOpen(true)}>
            Terms & Conditions
          </button>
          *
        </label>
      </div>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 className="card-title">Terms & Conditions</h3>
              <button className="btn btn-icon btn-secondary" onClick={() => setOpen(false)}><X size={18} /></button>
            </div>
            <div className="card-body" style={{ overflow: 'auto', whiteSpace: 'pre-wrap', fontSize: '13px', lineHeight: 1.6 }}>
              {termsContent}
            </div>
            <div className="card-footer" style={{ padding: '12px 16px', textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={handleAccept}>I Accept</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}