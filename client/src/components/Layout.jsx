import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', background: 'var(--bg-obsidian)', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ 
        flex: 1, 
        padding: '30px', 
        overflowY: 'auto',
        height: '100vh'
      }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
