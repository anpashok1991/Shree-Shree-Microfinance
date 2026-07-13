import { useState } from 'react';
import { reportApi } from '../../services/api';
import Loading from '../../components/common/Loading';

const reportTypes = [
  { key: 'daily', label: 'Daily Collection' },
  { key: 'monthly', label: 'Monthly Collection' },
  { key: 'outstanding', label: 'Outstanding' },
  { key: 'defaulters', label: 'Defaulters' },
  { key: 'profit', label: 'Profit' },
  { key: 'renewals', label: 'Renewals' },
];

const reportFields: Record<string, Record<string, string>> = {
  daily: { customer: 'Customer', loan: 'Loan #', amount: 'Amount', collectionDate: 'Date', collectedBy: 'Collected By', remarks: 'Remarks' },
  monthly: { customer: 'Customer', loan: 'Loan #', amount: 'Amount', collectionDate: 'Date', collectedBy: 'Collected By', remarks: 'Remarks' },
  outstanding: { customer: 'Customer', loan: 'Loan #', amount: 'Amount', outstanding: 'Outstanding', dailyCollection: 'Daily', startDate: 'Start Date' },
  defaulters: { customer: 'Customer', loan: 'Loan #', amount: 'Amount', outstanding: 'Outstanding', dailyCollection: 'Daily', startDate: 'Start Date' },
  renewals: { customer: 'Customer', loan: 'Loan #', amount: 'Amount', renewalCharge: 'Renewal Charge', createdAt: 'Date' },
  profit: { label: 'Metric', value: 'Value' },
};

function getFieldValue(row: any, key: string): string {
  if (key === 'customer') return row.customer?.name || row.customer?.mobile || '-';
  if (key === 'loan') return row.loan?.loanNumber || row.loanNumber || '-';
  if (key === 'collectedBy') return row.collectedBy?.name || '-';
  if (key === 'amount') return `₹${(row.amount || 0).toLocaleString()}`;
  if (key === 'outstanding') return `₹${(row.outstanding || 0).toLocaleString()}`;
  if (key === 'dailyCollection') return `₹${row.dailyCollection}`;
  if (key === 'collectionDate') return new Date(row.collectionDate).toLocaleDateString();
  if (key === 'startDate') return row.startDate ? new Date(row.startDate).toLocaleDateString() : '-';
  if (key === 'createdAt') return new Date(row.createdAt).toLocaleDateString();
  if (key === 'renewalCharge') return `₹${(row.renewalCharge || 0).toLocaleString()}`;
  return String(row[key] ?? '');
}

export default function ReportPage() {
  const [type, setType] = useState('daily');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const fetchReport = async () => {
    setLoading(true);
    try {
      let res: any = { data: [] };
      switch (type) {
        case 'daily':
          res = await reportApi.dailyCollection(date);
          break;
        case 'monthly':
          res = await reportApi.monthlyCollection(parseInt(year), parseInt(month));
          break;
        case 'outstanding':
          res = await reportApi.outstanding();
          break;
        case 'defaulters':
          res = await reportApi.defaulters(100);
          break;
        case 'profit':
          res = await reportApi.profit(new Date(parseInt(year), 0, 1).toISOString(), new Date(parseInt(year), 11, 31).toISOString());
          break;
        case 'renewals':
          res = await reportApi.renewals();
          break;
      }
      setData(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) { console.error(err); setData([]); }
    finally { setLoading(false); }
  };

  const fields = reportFields[type] || {};
  const fieldKeys = Object.keys(fields);

  return (
    <div>
      <h1 className="header-title mb-4">Reports</h1>

      <div className="card mb-4">
        <div className="card-body">
          <div className="flex gap-2 flex-wrap items-center">
            {reportTypes.map((r) => (
              <button key={r.key} className={`btn ${type === r.key ? 'btn-primary' : 'btn-secondary'}`} onClick={() => { setType(r.key); }}>
                {r.label}
              </button>
            ))}
            <div className="ml-auto flex gap-2 items-center">
              {type === 'daily' && <input className="form-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '160px' }} />}
              {(type === 'monthly' || type === 'profit') && (
                <>
                  <select className="form-select" value={month} onChange={(e) => setMonth(e.target.value)} style={{ width: '100px' }}>
                    {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'short' })}</option>)}
                  </select>
                  <input className="form-input" type="number" value={year} onChange={(e) => setYear(e.target.value)} style={{ width: '80px' }} />
                </>
              )}
              <button className="btn btn-primary" onClick={fetchReport}>Generate</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? <Loading /> : data.length === 0 ? (
          <div className="empty-state">Select a report type and click Generate</div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  {fieldKeys.map((k) => (
                    <th key={k}>{fields[k]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i}>
                    {fieldKeys.map((k) => (
                      <td key={k}>{getFieldValue(row, k)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
