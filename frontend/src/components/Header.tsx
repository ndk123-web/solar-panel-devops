import React from 'react';
import { Sun, Activity, GitBranch, Cpu, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  serverStatus: boolean;
}

export const Header: React.FC<HeaderProps> = ({ serverStatus }) => {
  return (
    <header className="glass-panel" style={{ padding: '20px 28px', marginBottom: '28px', borderRadius: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.4) 100%)',
            border: '1px solid rgba(245,158,11,0.5)',
            padding: '12px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(245,158,11,0.2)'
          }}>
            <Sun size={32} color="#f59e0b" className="animate-glow" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #d1d5db)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Solar Plant Maintenance Portal
              </h1>
              <span className="badge badge-pending" style={{ fontSize: '0.65rem' }}>
                <GitBranch size={10} /> MVP v1.0
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
              Real-time Asset Monitoring &amp; Role-based Workflow | <strong style={{ color: '#f59e0b' }}>NAVNATH KADAM</strong> (23102B0061)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: serverStatus ? '#10b981' : '#f43f5e',
              boxShadow: serverStatus ? '0 0 10px #10b981' : '0 0 10px #f43f5e'
            }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Backend (Spring Boot): <strong style={{ color: serverStatus ? '#34d399' : '#fb7185' }}>{serverStatus ? 'ONLINE' : 'OFFLINE'}</strong>
            </span>
          </div>

          <div className="glass-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderColor: 'rgba(6,182,212,0.3)' }}>
            <Cpu size={16} color="#06b6d4" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#38bdf8' }}>
              Tomcat / Jenkins Pipeline Ready
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
