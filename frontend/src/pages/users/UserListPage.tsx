import { useState, useEffect } from 'react';
import { userApi } from '../../services/api';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { Plus, Lock, Unlock, RotateCcw } from 'lucide-react';

export default function UserListPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [resetPw, setResetPw] = useState<{ id: string; name: string } | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role: 'STAFF' });

  const fetch = () => {
    setLoading(true);
    userApi.getAll()
      .then((r) => setUsers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    try {
      await userApi.create(form);
      setShowModal(false);
      setForm({ name: '', email: '', phone: '', password: '', role: 'STAFF' });
      fetch();
    } catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
  };

  const handleReset = async () => {
    if (!resetPw || !newPassword) return;
    try {
      await userApi.resetPassword(resetPw.id, newPassword);
      setResetPw(null);
      setNewPassword('');
      alert('Password reset successful');
    } catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
  };

  const roleColors: any = { SUPER_ADMIN: 'badge-danger', ADMIN: 'badge-warning', MANAGER: 'badge-info', STAFF: 'badge-success', VIEWER: 'badge-secondary' };

  const columns = [
    { key: 'name', label: 'Name', render: (r: any) => <span className="font-medium">{r.name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'role', label: 'Role', render: (r: any) => <span className={`badge ${roleColors[r.role]}`}>{r.role}</span> },
    { key: 'status', label: 'Status', render: (r: any) => <span className={`badge ${r.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>{r.status}</span> },
    { key: 'isLocked', label: 'Locked', render: (r: any) => r.isLocked ? <span className="badge badge-danger">Yes</span> : <span className="badge badge-success">No</span> },
    {
      key: 'actions', label: 'Actions', render: (r: any) => (
        <div className="table-actions">
          <button className="btn btn-sm btn-secondary" onClick={(e) => { e.stopPropagation(); userApi.toggleStatus(r.id, r.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE').then(fetch); }}>
            {r.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
          </button>
          <button className="btn btn-sm btn-secondary" onClick={(e) => { e.stopPropagation(); r.isLocked ? userApi.unlock(r.id).then(fetch) : userApi.lock(r.id).then(fetch); }}>
            {r.isLocked ? <Unlock size={14} /> : <Lock size={14} />}
          </button>
          <button className="btn btn-sm btn-secondary" onClick={(e) => { e.stopPropagation(); setResetPw({ id: r.id, name: r.name }); }}>
            <RotateCcw size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="header-title">Users</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add User
        </button>
      </div>

      <div className="card">
        <DataTable columns={columns} data={users} loading={loading} />
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Create User">
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Name *</label>
            <input className="form-input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone *</label>
            <input className="form-input" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input className="form-input" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Role *</label>
            <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="STAFF">Staff</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </div>
          <button className="btn btn-primary btn-block" type="submit">Create User</button>
        </form>
      </Modal>

      <Modal open={!!resetPw} onClose={() => { setResetPw(null); setNewPassword(''); }} title={`Reset Password - ${resetPw?.name}`}>
        <div className="form-group">
          <label className="form-label">New Password *</label>
          <input className="form-input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} />
        </div>
        <button className="btn btn-primary btn-block" onClick={handleReset} disabled={!newPassword}>Reset Password</button>
      </Modal>
    </div>
  );
}
