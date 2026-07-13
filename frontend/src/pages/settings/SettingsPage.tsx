import { useState, useEffect } from 'react';
import { settingsApi, uploadApi, resolveUrl } from '../../services/api';

const settingFields = [
  { key: 'company_name', label: 'Company Name', type: 'text' },
  { key: 'tagline', label: 'Tagline', type: 'text' },
  { key: 'about_text', label: 'About Us Text', type: 'textarea' },
  { key: 'company_address', label: 'Address', type: 'text' },
  { key: 'company_phone', label: 'Phone', type: 'text' },
  { key: 'company_email', label: 'Email', type: 'email' },
  { key: 'contact_email', label: 'Contact Email', type: 'email' },
  { key: 'contact_phone', label: 'Contact Phone', type: 'text' },
  { key: 'file_charge_percent', label: 'File Charge (%)', type: 'number' },
  { key: 'renewal_charge_percent', label: 'Renewal Charge (%)', type: 'number' },
  { key: 'max_loan', label: 'Maximum Loan (₹)', type: 'number' },
  { key: 'min_loan', label: 'Minimum Loan (₹)', type: 'number' },
  { key: 'loan_tenure_days', label: 'Loan Tenure (Days)', type: 'number' },
  { key: 'interest_rate', label: 'Interest Rate (%)', type: 'number' },
  { key: 'currency', label: 'Currency', type: 'text' },
  { key: 'language', label: 'Language', type: 'text' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [message, setMessage] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    settingsApi.getAll()
      .then((r) => setSettings(r.data || {}))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateSetting = async (key: string, value: string) => {
    setSaving(key);
    setMessage('');
    try {
      await settingsApi.update(key, value);
      setSettings((p) => ({ ...p, [key]: value }));
      setMessage('Setting updated');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed');
    } finally { setSaving(''); }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;
    setLogoUploading(true);
    try {
      const formData = new FormData();
      formData.append('logo', logoFile);
      const res = await uploadApi.logo(formData);
      setLogoPreview(res.data.url);
      setSettings(p => ({ ...p, company_logo: res.data.url }));
      setMessage('Logo uploaded successfully');
      setLogoFile(null);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Logo upload failed');
    } finally { setLogoUploading(false); }
  };

  const handleRemoveLogo = async () => {
    try {
      await settingsApi.update('company_logo', '');
      setSettings(p => ({ ...p, company_logo: '' }));
      setLogoPreview('');
      setLogoFile(null);
      setMessage('Logo removed');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed');
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <h1 className="header-title mb-4">System Settings</h1>

      {message && <div className="alert alert-success mb-4">{message}</div>}

      <div className="card mb-4">
        <div className="card-header"><h3 className="card-title">Company Logo</h3></div>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: 'var(--radius)', border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
              {logoPreview || settings.company_logo
                ? <img src={logoPreview || resolveUrl(settings.company_logo)} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                : <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>No Logo</span>}
            </div>
            <div>
              <input type="file" accept="image/*" onChange={e => {
                const file = e.target.files?.[0];
                if (file) { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)); }
              }} />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button className="btn btn-primary btn-sm" onClick={handleLogoUpload} disabled={!logoFile || logoUploading}>
                  {logoUploading ? 'Uploading...' : 'Upload Logo'}
                </button>
                {(settings.company_logo || logoPreview) && (
                  <button className="btn btn-danger btn-sm" onClick={handleRemoveLogo}>Remove Logo</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div style={{ display: 'grid', gap: '20px', maxWidth: '600px' }}>
            {settingFields.map((field) => (
              <div key={field.key} className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{field.label}</label>
                <div className="flex gap-2 items-center">
                  {field.type === 'textarea' ? (
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={settings[field.key] || ''}
                      onChange={(e) => setSettings((p) => ({ ...p, [field.key]: e.target.value }))}
                      onBlur={(e) => updateSetting(field.key, e.target.value)}
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <input
                      className="form-input"
                      type={field.type}
                      value={settings[field.key] || ''}
                      onChange={(e) => setSettings((p) => ({ ...p, [field.key]: e.target.value }))}
                      onBlur={(e) => updateSetting(field.key, e.target.value)}
                    />
                  )}
                  {saving === field.key && <div className="spinner" style={{ width: '16px', height: '16px' }} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
