import { useState, useEffect } from 'react';
import { enquiryApi } from '../../services/api';
import { Mail, CheckCircle, MessageSquare } from 'lucide-react';

export default function EnquiryListPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondId, setRespondId] = useState<string | null>(null);
  const [response, setResponse] = useState('');

  const fetch = () => {
    enquiryApi.getAll()
      .then(r => setEnquiries(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleMarkRead = async (id: string) => {
    await enquiryApi.markRead(id);
    fetch();
  };

  const handleRespond = async (id: string) => {
    if (!response.trim()) return;
    await enquiryApi.respond(id, response);
    setRespondId(null);
    setResponse('');
    fetch();
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <h1 className="header-title mb-4">Enquiries</h1>
      {enquiries.length === 0 && <div className="empty-state">No enquiries yet</div>}
      {enquiries.map((e: any) => (
        <div className="card mb-3" key={e.id}>
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: 0 }}>{e.name}</h4>
                <small className="text-secondary">{e.email} | {e.phone}</small>
              </div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {!e.isRead && <span className="badge badge-warning">New</span>}
                {e.isRead && <span className="badge badge-secondary">Read</span>}
              </div>
            </div>
            <p style={{ margin: '8px 0', color: 'var(--text-secondary)' }}>{e.message}</p>
            <small className="text-secondary">{new Date(e.createdAt).toLocaleString()}</small>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              {!e.isRead && (
                <button className="btn btn-sm btn-secondary" onClick={() => handleMarkRead(e.id)}>
                  <CheckCircle size={14} /> Mark Read
                </button>
              )}
              <button className="btn btn-sm btn-primary" onClick={() => setRespondId(respondId === e.id ? null : e.id)}>
                <MessageSquare size={14} /> Respond
              </button>
            </div>
            {respondId === e.id && (
              <div style={{ marginTop: '12px' }}>
                <textarea className="form-textarea" rows={3} value={response}
                  onChange={e => setResponse(e.target.value)} placeholder="Type your response..." />
                <button className="btn btn-primary btn-sm mt-2" onClick={() => handleRespond(e.id)} disabled={!response.trim()}>Send Response</button>
              </div>
            )}
            {e.response && (
              <div style={{ marginTop: '8px', padding: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)' }}>
                <small className="text-secondary">Response: </small>
                <p style={{ margin: '4px 0', fontSize: '13px' }}>{e.response}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
