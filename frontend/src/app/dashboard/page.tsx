'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { dashboardApi } from '@/lib/api';
import { DashboardSummary } from '@/types';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getSummary()
      .then(setSummary)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (!summary) return <div className="errorMsg">Failed to load dashboard data.</div>;

  const statusColors: Record<string, string> = {
    New: '#3b82f6', Contacted: '#f59e0b', 'Site Visit': '#8b5cf6', Closed: '#10b981',
  };

  const sourceColors: Record<string, string> = {
    Facebook: '#1877f2', Google: '#ea4335', Referral: '#10b981',
    Website: '#8b5cf6', 'Walk-in': '#f59e0b', Other: '#64748b',
  };

  return (
    <div>
      <div className="pageHeader">
        <h1>Dashboard</h1>
        <Link href="/leads/new" className="btnPrimary" style={{ width: 'auto', padding: '10px 20px' }}>
          + Add Lead
        </Link>
      </div>

      {/* Summary Cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.total}`}>
          <p className={styles.statLabel}>Total Leads</p>
          <h2 className={styles.statValue}>{summary.total}</h2>
        </div>
        <div className={`${styles.statCard} ${styles.closed}`}>
          <p className={styles.statLabel}>Closed Deals</p>
          <h2 className={styles.statValue}>{summary.closed}</h2>
        </div>
        <div className={`${styles.statCard} ${styles.conversion}`}>
          <p className={styles.statLabel}>Conversion Rate</p>
          <h2 className={styles.statValue}>{summary.conversionRate}%</h2>
        </div>
        <div className={`${styles.statCard} ${styles.active}`}>
          <p className={styles.statLabel}>Active Leads</p>
          <h2 className={styles.statValue}>{summary.total - summary.closed}</h2>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        {/* Status Breakdown */}
        <div className="card">
          <h3 className={styles.chartTitle}>Leads by Status</h3>
          <div className={styles.barChart}>
            {Object.entries(summary.byStatus).map(([status, count]) => {
              const maxVal = Math.max(...Object.values(summary.byStatus));
              const pct = maxVal > 0 ? (count / maxVal) * 100 : 0;
              return (
                <div key={status} className={styles.barRow}>
                  <span className={styles.barLabel}>{status}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${pct}%`, background: statusColors[status] }}
                    />
                  </div>
                  <span className={styles.barCount}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Source Breakdown */}
        <div className="card">
          <h3 className={styles.chartTitle}>Leads by Source</h3>
          <div className={styles.sourceList}>
            {Object.entries(summary.bySource).map(([source, count]) => (
              <div key={source} className={styles.sourceItem}>
                <div className={styles.sourceDot} style={{ background: sourceColors[source] }} />
                <span className={styles.sourceLabel}>{source}</span>
                <span className={styles.sourceCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
