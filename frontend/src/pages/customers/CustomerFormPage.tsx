import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customerApi, areaApi, userApi, uploadApi, resolveUrl } from '../../services/api';
import Loading from '../../components/common/Loading';

export default function CustomerFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [areas, setAreas] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [existingDocs, setExistingDocs] = useState<any>({});

  const [form, setForm] = useState({
    name: '', fatherName: '', mobile: '', alternateMobile: '',
    aadhaarNumber: '', panNumber: '', address: '', village: '',
    district: '', state: '', pinCode: '', occupation: '',
    monthlyIncome: 0, guarantorName: '', guarantorMobile: '',
    guarantorAadhaar: '', areaId: '', assignedStaffId: '',
  });

  const [files, setFiles] = useState<{ aadhaar?: File; pan?: File; photo?: File }>({});

  useEffect(() => {
    areaApi.getAll().then(r => setAreas(r.data)).catch(console.error);
    userApi.getStaff().then(r => setStaff(r.data)).catch(console.error);
    if (isEdit) {
      customerApi.getById(id!)
        .then((res) => {
          const d = res.data;
          setForm({
            name: d.name, fatherName: d.fatherName, mobile: d.mobile,
            alternateMobile: d.alternateMobile || '', aadhaarNumber: d.aadhaarNumber,
            panNumber: d.panNumber || '', address: d.address, village: d.village,
            district: d.district, state: d.state, pinCode: d.pinCode,
            occupation: d.occupation, monthlyIncome: d.monthlyIncome || 0,
            guarantorName: d.guarantorName || '', guarantorMobile: d.guarantorMobile || '',
            guarantorAadhaar: d.guarantorAadhaar || '', areaId: d.areaId,
            assignedStaffId: d.assignedStaffId || '',
          });
          setExistingDocs({
            aadhaarCopy: d.aadhaarCopy,
            panCopy: d.panCopy,
            photoUpload: d.photoUpload,
          });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let customerId = id;
      if (isEdit) {
        await customerApi.update(id!, form);
      } else {
        const res = await customerApi.create(form);
        customerId = res.data.id;
      }
      if (files.aadhaar || files.pan || files.photo) {
        const formData = new FormData();
        if (files.aadhaar) formData.append('aadhaar', files.aadhaar);
        if (files.pan) formData.append('pan', files.pan);
        if (files.photo) formData.append('photo', files.photo);
        try { await uploadApi.customerDocs(customerId!, formData); } catch {}
      }
      navigate('/customers');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save customer');
    } finally { setSaving(false); }
  };

  const update = (field: string, value: any) => setForm((p) => ({ ...p, [field]: value }));

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="header-title mb-4">{isEdit ? 'Edit Customer' : 'New Customer'}</h1>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <h3 className="font-bold mb-4">Personal Information</h3>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Name *</label><input className="form-input" required value={form.name} onChange={(e) => update('name', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Father's Name *</label><input className="form-input" required value={form.fatherName} onChange={(e) => update('fatherName', e.target.value)} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Mobile *</label><input className="form-input" required value={form.mobile} onChange={(e) => update('mobile', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Alternate Mobile</label><input className="form-input" value={form.alternateMobile} onChange={(e) => update('alternateMobile', e.target.value)} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Aadhaar *</label><input className="form-input" required value={form.aadhaarNumber} onChange={(e) => update('aadhaarNumber', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">PAN</label><input className="form-input" value={form.panNumber} onChange={(e) => update('panNumber', e.target.value)} /></div>
            </div>
            <div className="form-group"><label className="form-label">Address *</label><textarea className="form-textarea" required value={form.address} onChange={(e) => update('address', e.target.value)} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Village *</label><input className="form-input" required value={form.village} onChange={(e) => update('village', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">District *</label><input className="form-input" required value={form.district} onChange={(e) => update('district', e.target.value)} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">State *</label><input className="form-input" required value={form.state} onChange={(e) => update('state', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">PIN Code *</label><input className="form-input" required value={form.pinCode} onChange={(e) => update('pinCode', e.target.value)} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Occupation *</label><input className="form-input" required value={form.occupation} onChange={(e) => update('occupation', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Monthly Income</label><input className="form-input" type="number" value={form.monthlyIncome} onChange={(e) => update('monthlyIncome', parseFloat(e.target.value) || 0)} /></div>
            </div>

            <h3 className="font-bold mb-4 mt-4">Upload Documents</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Aadhaar Copy</label>
                <input className="form-input" type="file" accept="image/*,.pdf" onChange={e => setFiles(f => ({ ...f, aadhaar: e.target.files?.[0] }))} />
                {existingDocs.aadhaarCopy && !files.aadhaar && <small className="text-secondary">Existing: <a href={resolveUrl(existingDocs.aadhaarCopy)} target="_blank">View</a></small>}
              </div>
              <div className="form-group">
                <label className="form-label">PAN Copy</label>
                <input className="form-input" type="file" accept="image/*,.pdf" onChange={e => setFiles(f => ({ ...f, pan: e.target.files?.[0] }))} />
                {existingDocs.panCopy && !files.pan && <small className="text-secondary">Existing: <a href={resolveUrl(existingDocs.panCopy)} target="_blank">View</a></small>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Photo</label>
              <input className="form-input" type="file" accept="image/*" onChange={e => setFiles(f => ({ ...f, photo: e.target.files?.[0] }))} />
              {existingDocs.photoUpload && !files.photo && <small className="text-secondary">Existing: <a href={resolveUrl(existingDocs.photoUpload)} target="_blank">View</a></small>}
            </div>

            <h3 className="font-bold mb-4 mt-4">Guarantor Details</h3>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Guarantor Name</label><input className="form-input" value={form.guarantorName} onChange={(e) => update('guarantorName', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Guarantor Mobile</label><input className="form-input" value={form.guarantorMobile} onChange={(e) => update('guarantorMobile', e.target.value)} /></div>
            </div>
            <div className="form-group"><label className="form-label">Guarantor Aadhaar</label><input className="form-input" value={form.guarantorAadhaar} onChange={(e) => update('guarantorAadhaar', e.target.value)} /></div>

            <h3 className="font-bold mb-4 mt-4">Assignment</h3>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Area *</label>
                <select className="form-select" required value={form.areaId} onChange={(e) => update('areaId', e.target.value)}>
                  <option value="">Select Area</option>
                  {areas.map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div className="form-group"><label className="form-label">Assigned Staff</label>
                <select className="form-select" value={form.assignedStaffId} onChange={(e) => update('assignedStaffId', e.target.value)}>
                  <option value="">Not Assigned</option>
                  {staff.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="btn btn-primary btn-lg" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Customer'}</button>
              <button className="btn btn-secondary btn-lg" type="button" onClick={() => navigate('/customers')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
