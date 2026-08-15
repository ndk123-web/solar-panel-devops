import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { MaintenanceRecord } from './MaintenanceTable';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticket: Partial<MaintenanceRecord>) => void;
  initialData?: MaintenanceRecord | null;
}

export const TicketModal: React.FC<TicketModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<MaintenanceRecord>>({
    plantId: 'SOLAR-PLANT-05',
    location: 'Sector E - East Array',
    issueTitle: '',
    description: '',
    status: 'PENDING',
    priority: 'MEDIUM',
    assignedTechnician: 'Alex Rivera',
    efficiencyOutput: 90.0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        plantId: `SOLAR-PLANT-0${Math.floor(Math.random() * 8) + 5}`,
        location: 'Sector E - Panel Array',
        issueTitle: '',
        description: '',
        status: 'PENDING',
        priority: 'MEDIUM',
        assignedTechnician: 'Alex Rivera',
        efficiencyOutput: 92.0,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '28px', borderRadius: '20px', border: '1px solid rgba(245,158,11,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>
            {initialData ? 'Edit Maintenance Ticket' : 'Log New Solar Maintenance Ticket'}
          </h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Solar Plant ID</label>
              <input
                type="text"
                required
                value={formData.plantId || ''}
                onChange={(e) => setFormData({ ...formData, plantId: e.target.value })}
                style={{ width: '100%', padding: '10px', background: 'rgba(17,24,39,0.8)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Location / Sector</label>
              <input
                type="text"
                required
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                style={{ width: '100%', padding: '10px', background: 'rgba(17,24,39,0.8)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Issue Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Inverter Voltage Spike / Cleaning Needed"
              value={formData.issueTitle || ''}
              onChange={(e) => setFormData({ ...formData, issueTitle: e.target.value })}
              style={{ width: '100%', padding: '10px', background: 'rgba(17,24,39,0.8)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Detailed Description</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', padding: '10px', background: 'rgba(17,24,39,0.8)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Priority</label>
              <select
                value={formData.priority || 'MEDIUM'}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                style={{ width: '100%', padding: '10px', background: 'rgba(17,24,39,0.8)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Status Workflow</label>
              <select
                value={formData.status || 'PENDING'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                style={{ width: '100%', padding: '10px', background: 'rgba(17,24,39,0.8)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
              >
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Efficiency (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.efficiencyOutput || 90.0}
                onChange={(e) => setFormData({ ...formData, efficiencyOutput: parseFloat(e.target.value) })}
                style={{ width: '100%', padding: '10px', background: 'rgba(17,24,39,0.8)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Assigned Technician</label>
            <input
              type="text"
              value={formData.assignedTechnician || ''}
              onChange={(e) => setFormData({ ...formData, assignedTechnician: e.target.value })}
              style={{ width: '100%', padding: '10px', background: 'rgba(17,24,39,0.8)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save size={16} /> Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
