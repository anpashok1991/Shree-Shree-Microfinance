import { useEffect, useState } from 'react';
import { borrowerApi, uploadApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function EditProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    name: '',
    fatherName: '',
    mobile: '',
    address: '',
    village: '',
    district: '',
    state: '',
    pinCode: '',
    occupation: '',
    aadhaarNumber: '',
    monthlyIncome: 0,
  });
  const [photo, setPhoto] = useState<File | undefined>();
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    borrowerApi.getProfile()
      .then((r) => {
        if (r.data) {
          setForm({
            name: r.data.name || '',
            fatherName: r.data.fatherName || '',
            mobile: r.data.mobile || '',
            address: r.data.address || '',
            village: r.data.village || '',
            district: r.data.district || '',
            state: r.data.state || '',
            pinCode: r.data.pinCode || '',
            occupation: r.data.occupation || '',
            aadhaarNumber: r.data.aadhaarNumber || '',
            monthlyIncome: r.data.monthlyIncome || 0,
          });
          setProfileId(r.data.id);
        } else {
          setForm((prev) => ({ ...prev, name: user?.name || '', mobile: user?.phone || '' }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setSuccess('');
    setSaving(true);
    try {
      const res = await borrowerApi.updateProfile(form);
      setProfileId(res.data.id);
      setSuccess('Profile saved successfully!');

      if (photo && res.data?.id) {
        const fd = new FormData();
        fd.append('photo', photo);
        try { await uploadApi.customerDocs(res.data.id, fd); } catch {}
      }
    } catch (err: any) {
      setErr(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-secondary">Loading...</p>;

  return (
    <div style={{ maxWidth: '700px' }}>
      <h2 style={{ marginBottom: '20px' }}>My Profile</h2>

      {err && <div className="alert alert-danger">{err}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-header"><h3 className="card-title">Personal Details</h3></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Father's Name *</label>
              <input className="form-input" name="fatherName" value={form.fatherName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile *</label>
              <input className="form-input" name="mobile" value={form.mobile} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Aadhaar Number *</label>
              <input className="form-input" name="aadhaarNumber" value={form.aadhaarNumber} onChange={handleChange} disabled={!!profileId} required={!profileId} />
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header"><h3 className="card-title">Address</h3></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Address *</label>
              <input className="form-input" name="address" value={form.address} onChange={handleChange} required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Village *</label>
                <input className="form-input" name="village" value={form.village} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">District *</label>
                <input className="form-input" name="district" value={form.district} onChange={handleChange} required />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">State *</label>
                <input className="form-input" name="state" value={form.state} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">PIN Code *</label>
                <input className="form-input" name="pinCode" value={form.pinCode} onChange={handleChange} required />
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header"><h3 className="card-title">Additional Info</h3></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Occupation *</label>
              <input className="form-input" name="occupation" value={form.occupation} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Monthly Income (₹)</label>
              <input className="form-input" name="monthlyIncome" type="number" value={form.monthlyIncome} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Profile Photo</label>
              <input className="form-input" type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0])} />
            </div>
          </div>
        </div>

        <button className="btn btn-primary btn-lg" type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
