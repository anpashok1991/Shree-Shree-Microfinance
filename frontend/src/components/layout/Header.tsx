import { Menu, Search, Moon, Sun, LogOut, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { searchApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    if (q.length < 2) { setShow(false); return; }
    try {
      const res = await searchApi.global(q);
      setResults(res.data);
      setShow(true);
    } catch { setShow(false); }
  };

  const goTo = (type: string, id: string) => {
    setShow(false);
    setQuery('');
    if (type === 'customers') navigate(`/customers/${id}`);
    if (type === 'loans') navigate(`/loans/${id}`);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="hamburger" onClick={onMenuClick}>
          <Menu />
        </button>
        <div className="search-box" style={{ position: 'relative' }}>
          <Search size={18} />
          <input
            className="form-input"
            style={{ width: '280px', maxWidth: '100%' }}
            placeholder="Search customers, loans..."
            value={query}
            onChange={handleSearch}
            onBlur={() => setTimeout(() => setShow(false), 200)}
          />
          {show && results && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
              zIndex: 300, maxHeight: '300px', overflow: 'auto', marginTop: '4px'
            }}>
              {results.customers?.map((c: any) => (
                <div key={c.id} style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid var(--border-light)', fontSize: '13px' }}
                  onMouseDown={() => goTo('customers', c.id)}>
                  👤 {c.name} <span style={{ color: 'var(--text-light)' }}>{c.customerId}</span>
                </div>
              ))}
              {results.loans?.map((l: any) => (
                <div key={l.id} style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid var(--border-light)', fontSize: '13px' }}
                  onMouseDown={() => goTo('loans', l.id)}>
                  💰 {l.loanNumber} - ₹{l.amount?.toLocaleString()}
                </div>
              ))}
              {!results.customers?.length && !results.loans?.length && (
                <div style={{ padding: '12px', color: 'var(--text-secondary)', fontSize: '13px' }}>No results found</div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="header-right">
        {user && (
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <User size={14} /> {user.name}
          </span>
        )}
        <button className="btn btn-icon btn-secondary" onClick={toggle} title="Toggle theme">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="btn btn-icon btn-secondary" onClick={logout} title="Logout" style={{ color: 'var(--danger)' }}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
