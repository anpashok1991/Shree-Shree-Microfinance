import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerApi } from '../../services/api';
import DataTable from '../../components/common/DataTable';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function CustomerListPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetch = async (q?: string) => {
    setLoading(true);
    try {
      if (q) {
        const res = await customerApi.search(q);
        setCustomers(res.data);
      } else {
        const res = await customerApi.getAll({ page, limit: 10 });
        setCustomers(res.data);
        setTotal(res.pagination?.total || 0);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page]);
  useEffect(() => { if (!search) fetch(); }, [search]);

  const handleSearch = () => { if (search) fetch(search); };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      await customerApi.delete(id);
      fetch();
    } catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
  };

  const columns = [
    { key: 'customerId', label: 'ID', render: (r: any) => <span className="font-medium">{r.customerId}</span> },
    { key: 'name', label: 'Name' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'village', label: 'Village' },
    { key: 'area', label: 'Area', render: (r: any) => r.area?.name || '-' },
    { key: 'status', label: 'Status', render: (r: any) => {
      const badges: any = { ACTIVE: 'badge-success', PENDING: 'badge-warning', CLOSED: 'badge-secondary', BLACKLISTED: 'badge-danger' };
      return <span className={`badge ${badges[r.status] || 'badge-secondary'}`}>{r.status}</span>;
    }},
    {
      key: 'actions', label: 'Actions', render: (r: any) => (
        <div className="table-actions">
          <button className="btn btn-sm btn-secondary" onClick={(e) => { e.stopPropagation(); navigate(`/customers/edit/${r.id}`); }}><Edit size={14} /></button>
          <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="header-title">Customers</h1>
        <button className="btn btn-primary" onClick={() => navigate('/customers/new')}>
          <Plus size={18} /> Add Customer
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="flex gap-2" style={{ maxWidth: '400px' }}>
            <div className="search-box" style={{ flex: 1 }}>
              <Search size={18} />
              <input className="form-input" placeholder="Search by name, mobile, Aadhaar..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
            </div>
            <button className="btn btn-primary" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={customers}
          loading={loading}
          onRowClick={(r) => navigate(`/customers/${r.id}`)}
        />
        {total > 10 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
            <span style={{ padding: '0 12px', fontSize: '13px' }}>Page {page} of {Math.ceil(total / 10)}</span>
            <button disabled={page * 10 >= total} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
