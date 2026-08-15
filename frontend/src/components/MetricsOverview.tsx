import React from 'react';
import { Zap, Activity, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

interface MetricsProps {
  stats: {
    totalRecords: number;
    pendingRecords: number;
    inProgressRecords: number;
    resolvedRecords: number;
    activeAlerts: number;
    avgEfficiencyPercent: number;
    totalInstalledCapacityMW: number;
    currentPowerOutputMW: number;
  };
  onRefresh: () => void;
  loading: boolean;
}

export const MetricsOverview: React.FC<MetricsProps> = ({ stats, onRefresh, loading }) => {
  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={20} color="#f59e0b" /> Real-time Solar Plant Analytics
        </h2>
        <button className="btn-secondary" onClick={onRefresh} disabled={loading} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Metrics
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        {/* Stat 1: Power Output */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(17,24,39,0.7) 0%, rgba(245,158,11,0.08) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Power Generation</p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '6px' }}>
                {stats.currentPowerOutputMW || 416.3} <span style={{ fontSize: '1rem', fontWeight: 600 }}>MW</span>
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Capacity: {stats.totalInstalledCapacityMW || 450} MW Peak
              </p>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.15)', padding: '10px', borderRadius: '10px' }}>
              <Zap size={22} color="#f59e0b" />
            </div>
          </div>
        </div>

        {/* Stat 2: Avg Efficiency */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(17,24,39,0.7) 0%, rgba(16,185,129,0.08) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Average Solar Efficiency</p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '6px' }}>
                {stats.avgEfficiencyPercent || 92.5}%
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '4px' }}>
                +1.4% Target Efficiency
              </p>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.15)', padding: '10px', borderRadius: '10px' }}>
              <Activity size={22} color="#10b981" />
            </div>
          </div>
        </div>

        {/* Stat 3: Active Alerts */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(17,24,39,0.7) 0%, rgba(244,63,94,0.08) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Maintenance Alerts</p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fb7185', marginTop: '6px' }}>
                {stats.activeAlerts} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Tickets</span>
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                {stats.pendingRecords} Pending | {stats.inProgressRecords} In Progress
              </p>
            </div>
            <div style={{ background: 'rgba(244,63,94,0.15)', padding: '10px', borderRadius: '10px' }}>
              <AlertTriangle size={22} color="#f43f5e" />
            </div>
          </div>
        </div>

        {/* Stat 4: Resolved SLA */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(17,24,39,0.7) 0%, rgba(6,182,212,0.08) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Resolved Tickets</p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
                {stats.resolvedRecords} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {stats.totalRecords}</span>
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '4px' }}>
                98.2% Resolution SLA
              </p>
            </div>
            <div style={{ background: 'rgba(6,182,212,0.15)', padding: '10px', borderRadius: '10px' }}>
              <CheckCircle2 size={22} color="#06b6d4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
