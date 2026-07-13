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
                  {Object.keys(data[0] || {}).filter(k => k !== 'id').map((k) => (
                    <th key={k}>{k.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i}>
                    {Object.entries(row).filter(([k]) => k !== 'id').map(([k, v]) => (
                      <td key={k}>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</td>
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
