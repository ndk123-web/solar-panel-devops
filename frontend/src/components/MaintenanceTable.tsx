import React, { useState } from 'react';
import { Search, Plus, Filter, UserCheck, Edit3, Trash2, ArrowRight, Shield, Wrench } from 'lucide-react';

export interface MaintenanceRecord {
  id: number;
  plantId: string;
  location: string;
  issueTitle: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignedTechnician: string;
  efficiencyOutput: number;
  createdAt?: string;
  updatedAt?: string;
}

interface MaintenanceTableProps {
  records: MaintenanceRecord[];
  onNewTicket: () => void;
  onEditTicket: (record: MaintenanceRecord) => void;
  onDeleteTicket: (id: number) => void;
  onStatusChange: (id: number, newStatus: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

export const MaintenanceTable: React.FC<MaintenanceTableProps> = ({
  records,
  onNewTicket,
  onEditTicket,
  onDeleteTicket,
  onStatusChange,
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
}) => {
  const [roleMode, setRoleMode] = useState<'TECHNICIAN' | 'MANAGER'>('TECHNICIAN');

  return (
    <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
      {/* Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search Plant ID, Location, Issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                background: 'rgba(17,24,39,0.8)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Status Filters */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(17,24,39,0.8)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: selectedStatus === status ? '#f59e0b' : 'transparent',
                  color: selectedStatus === status ? '#0b0f19' : 'var(--text-muted)',
                  transition: 'all 0.2s ease'
                }}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Role Workflow Switch */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(17,24,39,0.9)', padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.3)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Workflow View:</span>
            <button
              onClick={() => setRoleMode(roleMode === 'TECHNICIAN' ? 'MANAGER' : 'TECHNICIAN')}
              style={{
                background: roleMode === 'TECHNICIAN' ? 'rgba(6,182,212,0.2)' : 'rgba(16,185,129,0.2)',
                color: roleMode === 'TECHNICIAN' ? '#38bdf8' : '#34d399',
                border: roleMode === 'TECHNICIAN' ? '1px solid rgba(6,182,212,0.4)' : '1px solid rgba(16,185,129,0.4)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {roleMode === 'TECHNICIAN' ? <Wrench size={12} /> : <Shield size={12} />}
              {roleMode} MODE
            </button>
          </div>

          <button className="btn-primary" onClick={onNewTicket}>
            <Plus size={16} /> Log Maintenance Ticket
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 16px' }}>Plant ID &amp; Location</th>
              <th style={{ padding: '12px 16px' }}>Issue Description</th>
              <th style={{ padding: '12px 16px' }}>Priority</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Technician</th>
              <th style={{ padding: '12px 16px' }}>Output Eff.</th>
              <th style={{ padding: '12px 16px' }}>Role Workflow Actions</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Manage</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No maintenance records found matching your filters.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s ease' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>{record.plantId}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{record.location}</div>
                  </td>

                  <td style={{ padding: '14px 16px', maxWidth: '240px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{record.issueTitle}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px' }}>
                      {record.description}
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge badge-priority-${record.priority?.toLowerCase()}`}>
                      {record.priority}
                    </span>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge badge-${record.status?.toLowerCase()}`}>
                      {record.status?.replace('_', ' ')}
                    </span>
                  </td>

                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <UserCheck size={14} color="#06b6d4" /> {record.assignedTechnician || 'Unassigned'}
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: record.efficiencyOutput > 85 ? '#34d399' : '#fb7185' }}>
                    {record.efficiencyOutput ? `${record.efficiencyOutput}%` : 'N/A'}
                  </td>

                  {/* Role-based Workflow Action Buttons */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {record.status === 'PENDING' && (
                        <button
                          className="btn-status-action"
                          onClick={() => onStatusChange(record.id, 'IN_PROGRESS')}
                          style={{ background: 'rgba(6,182,212,0.15)', color: '#38bdf8', borderColor: 'rgba(6,182,212,0.3)' }}
                        >
                          Start Work <ArrowRight size={10} style={{ display: 'inline', marginLeft: '4px' }} />
                        </button>
                      )}
                      {record.status === 'IN_PROGRESS' && (
                        <button
                          className="btn-status-action"
                          onClick={() => onStatusChange(record.id, 'RESOLVED')}
                          style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', borderColor: 'rgba(16,185,129,0.3)' }}
                        >
                          Mark Resolved
                        </button>
                      )}
                      {record.status === 'RESOLVED' && roleMode === 'MANAGER' && (
                        <button
                          className="btn-status-action"
                          onClick={() => onStatusChange(record.id, 'PENDING')}
                          style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', borderColor: 'rgba(245,158,11,0.3)' }}
                        >
                          Re-open Issue
                        </button>
                      )}
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => onEditTicket(record)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                        title="Edit Record"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteTicket(record.id)}
                        style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '4px' }}
                        title="Delete Record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
