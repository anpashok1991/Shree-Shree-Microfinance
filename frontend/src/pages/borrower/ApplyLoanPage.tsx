import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { borrowerApi, uploadApi } from '../../services/api';
import { Calculator } from 'lucide-react';

export default function ApplyLoanPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [noProfile, setNoProfile] = useState(false);
  const [amount, setAmount] = useState('');
  const [calculation, setCalculation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [files, setFiles] = useState<{ aadhaar?: File; pan?: File; photo?: File }>({});

  useEffect(() => {
    borrowerApi.getProfile()
      .then((r) => { if (!r) setNoProfile(true); })
      .catch(() => setNoProfile(true))
      .finally(() => setChecking(false));
  }, []);

  if (checking) return <p className="text-secondary">Checking profile...</p>;
  if (noProfile) return (
    <div className="card" style={{ maxWidth: '500px', textAlign: 'center', padding: '40px' }}>
      <h2 style={{ marginBottom: '12px' }}>Profile Required</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
        Please complete your profile before applying for a loan.
      </p>
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
    setLoading(true);
    try {
      const res = await borrowerApi.applyLoan({ amount: amt });
      const loan = res.data;
      setSuccess(`Application submitted! Ref: ${loan?.loanNumber || ''}`);

      if (files.aadhaar || files.pan || files.photo) {
        const formData = new FormData();
        if (files.aadhaar) formData.append('aadhaar', files.aadhaar);
        if (files.pan) formData.append('pan', files.pan);
        if (files.photo) formData.append('photo', files.photo);
        try {
          await uploadApi.customerDocs(loan.customerId, formData);
          setSuccess(prev => prev + ' Documents uploaded.');
        } catch { }
      }

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
          <div className="card-header"><h3 className="card-title">Upload Documents (Optional)</h3></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Aadhaar Card</label>
              <input className="form-input" type="file" accept="image/*,.pdf" onChange={e => setFiles({ ...files, aadhaar: e.target.files?.[0] })} />
            </div>
            <div className="form-group">
              <label className="form-label">PAN Card</label>
              <input className="form-input" type="file" accept="image/*,.pdf" onChange={e => setFiles({ ...files, pan: e.target.files?.[0] })} />
            </div>
            <div className="form-group">
              <label className="form-label">Photo</label>
              <input className="form-input" type="file" accept="image/*" onChange={e => setFiles({ ...files, photo: e.target.files?.[0] })} />
            </div>
          </div>
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '200px' }}>
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
