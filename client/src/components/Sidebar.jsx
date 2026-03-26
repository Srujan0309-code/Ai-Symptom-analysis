import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Shield 
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FileText size={20} />, label: 'Health Records', path: '/records' },
    { icon: <Users size={20} />, label: 'Specialists', path: '/doctors' },
    { icon: <Settings size={20} />, label: 'Vault Settings', path: '/settings' },
  ];

  return (
    <div className="glass-panel" style={{
      width: '260px',
      height: 'calc(100vh - 40px)',
      margin: '20px',
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRight: '1px solid var(--border-glass)'
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 10px' }}>
          <Shield color="var(--primary-mint)" size={28} />
          <h2 className="glowing-text" style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>V A U L T</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 15px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive ? 'var(--primary-mint)' : 'var(--text-grey)',
                background: isActive ? 'rgba(46, 255, 162, 0.1)' : 'transparent',
                transition: 'var(--transition-smooth)',
                border: isActive ? '1px solid rgba(46, 255, 162, 0.2)' : '1px solid transparent'
              })}
            >
              {item.icon}
              <span style={{ fontWeight: 500 }}>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '0 10px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            background: 'var(--primary-mint)',
            color: 'var(--bg-obsidian)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.8rem'
          }}>
            {user.name?.charAt(0) || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-white)' }}>{user.name || 'User'}</p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.medicalId || 'ID UNKNOWN'}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 15px',
            color: '#ff716c',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'var(--transition-smooth)',
            borderRadius: '8px'
          }}
        >
          <LogOut size={20} />
          <span style={{ fontWeight: 500 }}>Deauthorize</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
