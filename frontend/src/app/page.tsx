'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MetricsOverview } from '@/components/MetricsOverview';
import { MaintenanceTable, MaintenanceRecord } from '@/components/MaintenanceTable';
import { TicketModal } from '@/components/TicketModal';
import { WorkflowGuide } from '@/components/WorkflowGuide';

const INITIAL_FALLBACK_RECORDS: MaintenanceRecord[] = [
  {
    id: 1,
    plantId: 'SOLAR-PLANT-01',
    location: 'Sector A - Panel Array 14',
    issueTitle: 'Dust Accumulation & Cleaning Needed',
    description: 'Solar panel surface dust layer reducing overall output efficiency by 12%.',
    status: 'PENDING',
    priority: 'MEDIUM',
    assignedTechnician: 'Alex Rivera',
    efficiencyOutput: 88.0,
    createdAt: '2026-08-15'
  },
  {
    id: 2,
    plantId: 'SOLAR-PLANT-02',
    location: 'Sector B - Inverter Station 3',
    issueTitle: 'Inverter Overheating Warning',
    description: 'High ambient temperature caused Thermal Throttling on Inverter Unit #3.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignedTechnician: 'Kavya Patel',
    efficiencyOutput: 76.5,
    createdAt: '2026-08-15'
  },
  {
    id: 3,
    plantId: 'SOLAR-PLANT-03',
    location: 'Sector C - Substation Grid B',
    issueTitle: 'Grid Synchronization Calibration',
    description: 'Routine 30-day voltage alignment and grid frequency synchronization.',
    status: 'RESOLVED',
    priority: 'LOW',
    assignedTechnician: 'Marcus Vance',
    efficiencyOutput: 99.2,
    createdAt: '2026-08-14'
  },
  {
    id: 4,
    plantId: 'SOLAR-PLANT-04',
    location: 'Sector D - Tracker Drive 08',
    issueTitle: 'Single-Axis Solar Tracker Motor Fault',
    description: 'Actuator motor stalled during morning sun tracking sequence.',
    status: 'IN_PROGRESS',
    priority: 'CRITICAL',
    assignedTechnician: 'Alex Rivera',
    efficiencyOutput: 64.0,
    createdAt: '2026-08-15'
  }
];

export default function Home() {
  const [serverOnline, setServerOnline] = useState<boolean>(false);
  const [records, setRecords] = useState<MaintenanceRecord[]>(INITIAL_FALLBACK_RECORDS);
  const [stats, setStats] = useState({
    totalRecords: 4,
    pendingRecords: 1,
    inProgressRecords: 2,
    resolvedRecords: 1,
    activeAlerts: 3,
    avgEfficiencyPercent: 81.9,
    totalInstalledCapacityMW: 450,
    currentPowerOutputMW: 368.5,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);

  // Check health and fetch data from Spring Boot API
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Health check
      const healthRes = await fetch('/api/health');
      if (healthRes.ok) {
        setServerOnline(true);

        // 2. Fetch stats
        const statsRes = await fetch('/api/dashboard/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // 3. Fetch records
        const recordsRes = await fetch(`/api/records?search=${encodeURIComponent(searchQuery)}&status=${selectedStatus}`);
        if (recordsRes.ok) {
          const recordsData = await recordsRes.json();
          setRecords(recordsData);
        }
      } else {
        setServerOnline(false);
      }
    } catch (err) {
      setServerOnline(false);
      // Fallback local filtering when server is offline
      let filtered = [...INITIAL_FALLBACK_RECORDS];
      if (selectedStatus !== 'ALL') {
        filtered = filtered.filter(r => r.status === selectedStatus);
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(r =>
          r.plantId.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.issueTitle.toLowerCase().includes(q)
        );
      }
      setRecords(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, selectedStatus]);

  // Handlers
  const handleOpenCreateModal = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record: MaintenanceRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleSaveRecord = async (data: Partial<MaintenanceRecord>) => {
    if (serverOnline) {
      try {
        if (editingRecord?.id) {
          await fetch(`/api/records/${editingRecord.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
        } else {
          await fetch('/api/records', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
        }
        fetchData();
      } catch (e) {
        console.error(e);
      }
    } else {
      // Local state fallback
      if (editingRecord?.id) {
        setRecords(prev => prev.map(r => r.id === editingRecord.id ? { ...r, ...data } as MaintenanceRecord : r));
      } else {
        const newRecord: MaintenanceRecord = {
          id: Date.now(),
          plantId: data.plantId || 'SOLAR-PLANT-NEW',
          location: data.location || 'Sector New',
          issueTitle: data.issueTitle || 'New Issue',
          description: data.description || '',
          status: (data.status as any) || 'PENDING',
          priority: (data.priority as any) || 'MEDIUM',
          assignedTechnician: data.assignedTechnician || 'Unassigned',
          efficiencyOutput: data.efficiencyOutput || 90.0,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setRecords(prev => [newRecord, ...prev]);
      }
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    if (serverOnline) {
      try {
        await fetch(`/api/records/${id}/status?status=${newStatus}`, { method: 'PATCH' });
        fetchData();
      } catch (e) {
        console.error(e);
      }
    } else {
      setRecords(prev => prev.map(r => r.id === id ? { ...r, status: newStatus as any } : r));
    }
  };

  const handleDeleteTicket = async (id: number) => {
    if (confirm('Are you sure you want to delete this maintenance record?')) {
      if (serverOnline) {
        try {
          await fetch(`/api/records/${id}`, { method: 'DELETE' });
          fetchData();
        } catch (e) {
          console.error(e);
        }
      } else {
        setRecords(prev => prev.filter(r => r.id !== id));
      }
    }
  };

  return (
    <main>
      <Header serverStatus={serverOnline} />
      
      <MetricsOverview
        stats={stats}
        onRefresh={fetchData}
        loading={loading}
      />

      <MaintenanceTable
        records={records}
        onNewTicket={handleOpenCreateModal}
        onEditTicket={handleOpenEditModal}
        onDeleteTicket={handleDeleteTicket}
        onStatusChange={handleStatusChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <WorkflowGuide />

      <TicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRecord}
        initialData={editingRecord}
      />
    </main>
  );
}
