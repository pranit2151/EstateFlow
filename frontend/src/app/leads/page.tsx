'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { leadsApi } from '@/lib/api';
import { Lead, PaginatedResponse, LEAD_STATUSES, LEAD_SOURCES } from '@/types';
import styles from './leads.module.css';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const router = useRouter();

  const fetchLeads = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: '10',
      };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (sourceFilter) params.source = sourceFilter;

      const res: PaginatedResponse<Lead> = await leadsApi.getAll(params);
      setLeads(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, sourceFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      'New': 'new', 'Contacted': 'contacted', 'Site Visit': 'sitevisit', 'Closed': 'closed',
    };
    return map[status] || '';
  };

  const formatBudget = (budget: number) => {
    const num = Number(budget);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
    return `₹${num.toLocaleString()}`;
  };

  return (
    <div>
      <div className="pageHeader">
        <h1>Leads ({meta.total})</h1>
        <Link href="/leads/new" className="btnPrimary" style={{ width: 'auto', padding: '10px 20px' }}>
          + Add Lead
        </Link>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.filterSelect}>
          <option value="">All Status</option>
          {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className={styles.filterSelect}>
          <option value="">All Sources</option>
          {LEAD_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Leads Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div className="loading">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="loading">No leads found.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Location</th>
                <th>Budget</th>
                <th>Type</th>
                <th>Source</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} onClick={() => router.push(`/leads/${lead.id}`)} className={styles.clickableRow}>
                  <td>
                    <div className={styles.leadName}>{lead.name}</div>
                    {lead.email && <div className={styles.leadEmail}>{lead.email}</div>}
                  </td>
                  <td>{lead.phone}</td>
                  <td>{lead.location}</td>
                  <td className={styles.budget}>{formatBudget(lead.budget)}</td>
                  <td>{lead.property_type}</td>
                  <td>{lead.source}</td>
                  <td>
                    <span className={`badge ${getStatusClass(lead.status)}`}>{lead.status}</span>
                  </td>
                  <td className={styles.date}>{new Date(lead.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => fetchLeads(meta.page - 1)}
            disabled={meta.page <= 1}
            className="btnSecondary"
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            onClick={() => fetchLeads(meta.page + 1)}
            disabled={meta.page >= meta.totalPages}
            className="btnSecondary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
