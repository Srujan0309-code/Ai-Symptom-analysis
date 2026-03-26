import React from 'react';
import Layout from '../components/Layout';
import { Activity, Heart, Thermometer, Droplets, TrendingUp, Calendar } from 'lucide-react';

const StatCard = ({ icon, label, value, unit, trend }) => (
  <div className="glass-panel" style={{ padding: '24px', flex: 1, minWidth: '200px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
      <div style={{ color: 'var(--primary-mint)' }}>{icon}</div>
      <div style={{ 
        fontSize: '0.8rem', 
        color: trend > 0 ? 'var(--primary-mint)' : '#ff716c',
        background: trend > 0 ? 'rgba(46, 255, 162, 0.1)' : 'rgba(255, 113, 108, 0.1)',
        padding: '4px 8px',
        borderRadius: '4px'
      }}>
        {trend > 0 ? '+' : ''}{trend}%
      </div>
    </div>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>{label}</p>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
      <h3 style={{ fontSize: '1.8rem' }}>{value}</h3>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{unit}</span>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <Layout>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
          Welcome back, <span className="glowing-text">Commander</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Vault status: <span style={{ color: 'var(--primary-mint)' }}>Encrypted</span> | All biometrics within normal parameters.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '40px' }}>
        <StatCard icon={<Heart size={24} />} label="Heart Rate" value="72" unit="bpm" trend={1.2} />
        <StatCard icon={<Droplets size={24} />} label="Blood Glucose" value="98" unit="mg/dL" trend={-0.5} />
        <StatCard icon={<TrendingUp size={24} />} label="Oxygen Saturation" value="99" unit="%" trend={0.1} />
        <StatCard icon={<Thermometer size={24} />} label="Body Temp" value="36.6" unit="°C" trend={0.0} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3>Vitality Matrix</h3>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Last 24 Hours</div>
          </div>
          {/* Placeholder for Vitality Graph */}
          <div style={{ 
            height: '250px', 
            background: 'linear-gradient(180deg, rgba(46, 255, 162, 0.05) 0%, transparent 100%)',
            borderRadius: '12px',
            border: '1px dashed var(--border-glass)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)'
          }}>
            [ Secure Data Visualization Layer ]
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '24px' }}>Protocol Log</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { time: '09:00 AM', action: 'Daily Vitals Sync', status: 'Success' },
              { time: 'Yesterday', action: 'Blood Panel Upload', status: 'Pending Review' },
              { time: '2 days ago', action: 'Security Overhaul', status: 'Completed' },
            ].map((log, i) => (
              <div key={i} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ paddingTop: '5px' }}>
                  <Calendar size={16} color="var(--primary-mint)" />
                </div>
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-white)' }}>{log.action}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.time} • <span style={{ color: log.status === 'Success' ? 'var(--primary-mint)' : 'var(--text-grey)' }}>{log.status}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
