import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Wallet, Banknote, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const items = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/loans', label: 'Loans', icon: Wallet },
  { to: '/collections', label: 'Collect', icon: Banknote },
];

export default function MobileBottomNav() {
  const { logout } = useAuth();

  return (
    <nav className="mobile-bottom-nav">
      <div className="mobile-bottom-nav-inner">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button className="mobile-nav-item mobile-nav-logout" onClick={logout}>
          <LogOut />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
