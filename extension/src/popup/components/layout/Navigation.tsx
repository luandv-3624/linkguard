import React from 'react';
import './Navigation.css';

type Page = 'dashboard' | 'scanner' | 'history' | 'settings' | 'about';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const navItems: { page: Page; icon: string; label: string }[] = [
    { page: 'dashboard', icon: '📊', label: 'Dashboard' },
    { page: 'scanner', icon: '🔍', label: 'Scanner' },
    { page: 'history', icon: '📝', label: 'History' },
    { page: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <nav className="navigation">
      {navItems.map((item) => (
        <button
          key={item.page}
          className={`nav-item ${currentPage === item.page ? 'active' : ''}`}
          onClick={() => onNavigate(item.page)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
