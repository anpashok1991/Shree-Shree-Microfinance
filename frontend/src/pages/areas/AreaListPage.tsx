import { useState, useEffect } from 'react';
import { areaApi } from '../../services/api';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AreaListPage() {
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', code: '' });

  const fetch = () => {
    setLoading(true);
    areaApi.getAll()
      .then((r) => setAreas(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', code: '' });
    setShowModal(true);
  };

  const openEdit = (area: any) => {
    setEditing(area);
    setForm({ name: area.name, code: area.code });
    setShowModal(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editing) {
        await areaApi.update(editing.id, form);
      } else {
        await areaApi.create(form);
      }
      setShowModal(false);
      setEditing(null);
      fetch();
    } catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this area?')) return;
    try {
      await areaApi.delete(id);
      fetch();
    } catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (r: any) => <span className="font-medium">{r.name}</span> },
    { key: 'code', label: 'Code' },
    { key: '_count', label: 'Customers', render: (r: any) => r._count?.customers || 0 },
    { key: 'isActive', label: 'Status', render: (r: any) => <span className={`badge ${r.isActive ? 'badge-success' : 'badge-danger'}`}>{r.isActive ? 'Active' : 'Inactive'}</span> },
    {
      key: 'actions', label: 'Actions', render: (r: any) => (
        <div className="table-actions">
          <button className="btn btn-sm btn-secondary" onClick={(e) => { e.stopPropagation(); openEdit(r); }}><Edit size={14} /></button>
          <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="header-title">Areas</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} /> Add Area
        </button>
      </div>

      <div className="card">
        <DataTable columns={columns} data={areas} loading={loading} />
      </div>

      <Modal open={showModal} onClose={() => { setShowModal(false); setEditing(null); }} title={editing ? 'Edit Area' : 'Create Area'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Area Name *</label>
            <input className="form-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Area 1" />
          </div>
          <div className="form-group">
            <label className="form-label">Code *</label>
            <input className="form-input" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. AR01" />
          </div>
          <button className="btn btn-primary btn-block" type="submit">{editing ? 'Update Area' : 'Create Area'}</button>
        </form>
      </Modal>
    </div>
  );
}
