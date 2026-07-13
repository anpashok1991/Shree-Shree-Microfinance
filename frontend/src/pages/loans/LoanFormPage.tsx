import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loanApi, customerApi } from '../../services/api';
import type { LoanCalculation } from '../../types';

export default function LoanFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [customerId, setCustomerId] = useState(searchParams.get('customerId') || '');
  const [amount, setAmount] = useState(10000);
  const [saving, setSaving] = useState(false);
  const [calc, setCalc] = useState<LoanCalculation | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    customerApi.getAll({ limit: 100 }).then((r) => setCustomers(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (amount > 0) {
      loanApi.calculate(amount).then((r) => setCalc(r.data)).catch(console.error);
    }
  }, [amount]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!customerId) { setError('Please select a customer'); return; }
    setSaving(true);
    setError('');
    try {
      await loanApi.create({ customerId, amount });
      navigate('/loans');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create loan');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <h1 className="header-title mb-4">New Loan Application</h1>
      <div className="grid-2">
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="form-group">
                <label className="form-label">Customer *</label>
                <select className="form-select" required value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                  <option value="">Select Customer</option>
                  {customers.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.name} - {c.customerId}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Loan Amount *</label>
                <select className="form-select" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))}>
                  <option value={5000}>₹5,000</option>
                  <option value={10000}>₹10,000</option>
                  <option value={12500}>₹12,500</option>
                  <option value={15000}>₹15,000</option>
                  <option value={20000}>₹20,000</option>
                  <option value={25000}>₹25,000</option>
                  <option value={30000}>₹30,000</option>
                  <option value={33000}>₹33,000</option>
                  <option value={40000}>₹40,000</option>
                  <option value={50000}>₹50,000</option>
                </select>
              </div>
              <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={saving}>
                {saving ? 'Submitting...' : 'Submit Loan Application'}
              </button>
            </form>
          </div>
        </div>

        {calc && (
          <div className="card">
            <div className="card-header"><h3 className="card-title">Loan Calculation</h3></div>
            <div className="card-body">
              <div style={{ display: 'grid', gap: '12px' }}>
                <Row label="Loan Amount" value={`₹${calc.amount.toLocaleString()}`} />
                <Row label="File Charge (3%)" value={`-₹${calc.fileCharge.toLocaleString()}`} />
                <Row label="Disbursed Amount" value={`₹${calc.disbursedAmount.toLocaleString()}`} bold />
                <Row label="Tenure" value={`${calc.tenure} Days`} />
                <Row label="Daily Collection" value={`₹${calc.dailyCollection}/day`} bold />
                <Row label="Total Recovery (120%)" value={`₹${calc.totalRecovery.toLocaleString()}`} bold />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '6px 0', borderBottom: '1px solid var(--border-light)' }}>
      <span className="text-secondary">{label}</span>
      <span className={bold ? 'font-bold' : ''}>{value}</span>
    </div>
  );
}
