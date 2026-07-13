import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { borrowerApi, uploadApi } from '../../services/api';
import { Calculator } from 'lucide-react';
import TermsDialog from './TermsDialog';

export default function ApplyLoanPage() {
  const navigate = useNavigate();
  const requiredFields = ['name', 'fatherName', 'mobile', 'aadhaarNumber', 'address', 'village', 'district', 'state', 'pinCode', 'occupation'];
  const fieldLabels: Record<string, string> = {
    name: 'Full Name', fatherName: "Father's Name", mobile: 'Mobile',
    aadhaarNumber: 'Aadhaar Number', address: 'Address', village: 'Village',
    district: 'District', state: 'State', pinCode: 'PIN Code', occupation: 'Occupation',
  };
  const [checking, setChecking] = useState(true);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [amount, setAmount] = useState('');
  const [calculation, setCalculation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [files, setFiles] = useState<{ aadhaar?: File; pan?: File; photo?: File }>({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    borrowerApi.getProfile()
      .then((r) => {
        if (!r) { setMissingFields(requiredFields); return; }
        const missing = requiredFields.filter((f) => !r[f]);
        if (missing.length > 0) { setMissingFields(missing); return; }
      })
      .catch(() => setMissingFields(requiredFields))
      .finally(() => setChecking(false));
  }, []);

  if (checking) return <p className="text-secondary">Checking profile...</p>;
  if (missingFields.length > 0) return (
    <div className="card" style={{ maxWidth: '500px', padding: '30px' }}>
      <h2 style={{ marginBottom: '12px' }}>Complete Your Profile</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
        The following fields are required before you can apply for a loan:
      </p>
      <ul style={{ marginBottom: '20px', paddingLeft: '20px', lineHeight: 1.8 }}>
        {missingFields.map((f) => (
          <li key={f} style={{ color: 'var(--danger)' }}>{fieldLabels[f] || f}</li>
        ))}
      </ul>
      <Link to="/borrower/profile" className="btn btn-primary">
        Go to My Profile
      </Link>
    </div>
  );

  const calculate = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    const fileCharge = amt * 0.03;
    const disbursed = amt - fileCharge;
    const dailyCollection = amt * 1.2 / 100;
    const totalRecovery = amt * 1.2;
    setCalculation({ amount: amt, fileCharge, disbursedAmount: disbursed, dailyCollection, totalRecovery, tenure: 100 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setSuccess('');
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setErr('Enter a valid loan amount'); return; }
    if (!files.aadhaar) { setErr('Please upload your Aadhaar card'); return; }
    if (!files.pan) { setErr('Please upload your PAN card'); return; }
    if (!files.photo) { setErr('Please upload your photo'); return; }
    if (!termsAccepted) { setErr('Please accept the Terms & Conditions'); return; }
    setLoading(true);
    try {
      const res = await borrowerApi.applyLoan({ amount: amt });
      const loan = res.data;
      setSuccess(`Application submitted! Ref: ${loan?.loanNumber || ''}`);

      const formData = new FormData();
      formData.append('aadhaar', files.aadhaar);
      formData.append('pan', files.pan);
      formData.append('photo', files.photo);
      try {
        await uploadApi.customerDocs(loan.customerId, formData);
        setSuccess(prev => prev + ' Documents uploaded.');
      } catch { }

      setTimeout(() => navigate('/borrower/loans'), 2000);
    } catch (err: any) {
      setErr(err.response?.data?.message || 'Application failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h2 style={{ marginBottom: '20px' }}>Apply for a Loan</h2>

      {err && <div className="alert alert-danger">{err}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-header"><h3 className="card-title">Loan Details</h3></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Loan Amount (₹)</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input className="form-input" type="number" value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Enter amount (₹1,000 - ₹50,000)" min="1000" max="50000" />
                <button type="button" className="btn btn-secondary" onClick={calculate}>
                  <Calculator size={16} /> Calculate
                </button>
              </div>
            </div>

            {calculation && (
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', padding: '16px', marginTop: '12px' }}>
                <Row label="Loan Amount" value={`₹${calculation.amount.toLocaleString()}`} />
                <Row label="File Charge (3%)" value={`-₹${calculation.fileCharge.toLocaleString()}`} />
                <Row label="Disbursed Amount" value={`₹${calculation.disbursedAmount.toLocaleString()}`} bold color="var(--success)" />
                <Row label="Daily Collection" value={`₹${calculation.dailyCollection.toFixed(2)}`} />
                <Row label="Total Recovery (120%)" value={`₹${calculation.totalRecovery.toLocaleString()}`} />
                <Row label="Tenure" value={`${calculation.tenure} Days`} />
              </div>
            )}
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header"><h3 className="card-title">Required Documents</h3></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Aadhaar Card *</label>
              <input className="form-input" type="file" accept="image/*,.pdf" required
                onChange={e => setFiles({ ...files, aadhaar: e.target.files?.[0] })} />
              {files.aadhaar && <small style={{ color: 'var(--success)' }}>Selected: {files.aadhaar.name}</small>}
            </div>
            <div className="form-group">
              <label className="form-label">PAN Card *</label>
              <input className="form-input" type="file" accept="image/*,.pdf" required
                onChange={e => setFiles({ ...files, pan: e.target.files?.[0] })} />
              {files.pan && <small style={{ color: 'var(--success)' }}>Selected: {files.pan.name}</small>}
            </div>
            <div className="form-group">
              <label className="form-label">Photo *</label>
              <input className="form-input" type="file" accept="image/*" required
                onChange={e => setFiles({ ...files, photo: e.target.files?.[0] })} />
              {files.photo && <small style={{ color: 'var(--success)' }}>Selected: {files.photo.name}</small>}
            </div>
          </div>
        </div>

        <TermsDialog onAccept={() => setTermsAccepted(true)} />

        <button className="btn btn-primary" type="submit" disabled={loading || !termsAccepted} style={{ width: '200px' }}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}

function Row({ label, value, bold, color }: { label: string; value: string; bold?: boolean; color?: string }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '4px 0' }}>
      <span className="text-secondary" style={{ fontSize: '13px' }}>{label}</span>
      <span className={bold ? 'font-bold' : 'font-medium'} style={color ? { color } : { fontSize: '13px' }}>{value}</span>
    </div>
  );
}
