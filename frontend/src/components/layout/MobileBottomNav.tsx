import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Wallet, Banknote } from 'lucide-react';

const items = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/loans', label: 'Loans', icon: Wallet },
  { to: '/collections', label: 'Collect', icon: Banknote },
];

export default function MobileBottomNav() {
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
      </div>
    </nav>
  );
}
