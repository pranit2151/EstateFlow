'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { leadsApi, notesApi } from '@/lib/api';
import { Lead, Note, LEAD_STATUSES } from '@/types';
import styles from './detail.module.css';

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = Number(params.id);

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const fetchLead = async () => {
    try {
      const data = await leadsApi.getById(leadId);
      setLead(data);
    } catch {
      setLead(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLead(); }, [leadId]);

  // Update lead status
  const handleStatusChange = async (status: string) => {
    try {
      await leadsApi.updateStatus(leadId, status);
      fetchLead();
    } catch (err) {
      console.error(err);
    }
  };

  // Add a note
  const handleAddNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      await notesApi.create(leadId, noteText);
      setNoteText('');
      fetchLead();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNote(false);
    }
  };

  // Delete lead
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await leadsApi.delete(leadId);
      router.push('/leads');
    } catch (err) {
      console.error(err);
    }
  };

  const formatBudget = (budget: number) => {
    const num = Number(budget);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString()}`;
  };

  const getStatusClass = (status: string) => {
    return status.replace(/\s+/g, '').toLowerCase();
  };

  if (loading) return <div className="loading">Loading lead details...</div>;
  if (!lead) return <div className="errorMsg">Lead not found.</div>;

  return (
    <div>
      <div className="pageHeader">
        <h1>{lead.name}</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href={`/leads/${leadId}/edit`} className="btnSecondary">Edit</Link>
          <button onClick={handleDelete} className="btnDanger">Delete</button>
          <button onClick={() => router.push('/leads')} className="btnSecondary">← Back</button>
        </div>
      </div>

      <div className={styles.detailGrid}>
        {/* Lead Info Card */}
        <div className="card">
          <h3 className={styles.sectionTitle}>Lead Information</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Phone</span>
              <span className={styles.value}>{lead.phone}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Email</span>
              <span className={styles.value}>{lead.email || '-'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Budget</span>
              <span className={`${styles.value} ${styles.budget}`}>{formatBudget(lead.budget)}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Location</span>
              <span className={styles.value}>{lead.location}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Property Type</span>
              <span className={styles.value}>{lead.property_type}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Source</span>
              <span className={styles.value}>{lead.source}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Created</span>
              <span className={styles.value}>{new Date(lead.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Status Update */}
          <div className={styles.statusSection}>
            <span className={styles.label}>Status</span>
            <div className={styles.statusButtons}>
              {LEAD_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`${styles.statusBtn} ${lead.status === s ? styles.statusActive : ''}`}
                  data-status={getStatusClass(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="card">
          <h3 className={styles.sectionTitle}>Notes ({lead.notes?.length || 0})</h3>

          <form onSubmit={handleAddNote} className={styles.noteForm}>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note..."
              rows={3}
              className={styles.noteInput}
            />
            <button type="submit" className="btnPrimary" disabled={savingNote} style={{ width: 'auto', padding: '8px 20px' }}>
              {savingNote ? 'Saving...' : 'Add Note'}
            </button>
          </form>

          <div className={styles.notesList}>
            {lead.notes && lead.notes.length > 0 ? (
              lead.notes.map((note: Note) => (
                <div key={note.id} className={styles.noteItem}>
                  <p className={styles.noteText}>{note.text}</p>
                  <span className={styles.noteDate}>
                    {new Date(note.created_at).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className={styles.noNotes}>No notes yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
