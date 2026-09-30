'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { leadsApi } from '@/lib/api';
import { PROPERTY_TYPES, LEAD_SOURCES } from '@/types';

export default function LeadFormPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params?.id ? Number(params.id) : null;
  const isEdit = !!leadId;

  const [form, setForm] = useState({
    name: '', phone: '', email: '', budget: '',
    location: '', property_type: '2BHK', source: 'Google',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load existing lead data for edit
  useEffect(() => {
    if (isEdit && leadId) {
      leadsApi.getById(leadId).then((lead: any) => {
        setForm({
          name: lead.name,
          phone: lead.phone,
          email: lead.email || '',
          budget: String(lead.budget),
          location: lead.location,
          property_type: lead.property_type,
          source: lead.source,
        });
      });
    }
  }, [isEdit, leadId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = { ...form, budget: parseFloat(form.budget) };

      if (isEdit && leadId) {
        await leadsApi.update(leadId, payload);
      } else {
        await leadsApi.create(payload);
      }
      router.push('/leads');
    } catch (err: any) {
      setError(err.message || 'Failed to save lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="pageHeader">
        <h1>{isEdit ? 'Edit Lead' : 'Add New Lead'}</h1>
        <button onClick={() => router.back()} className="btnSecondary">← Back</button>
      </div>

      <div className="card" style={{ maxWidth: 700 }}>
        {error && <div className="errorMsg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="formGrid">
            <div className="formGroup">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="formGroup">
              <label>Phone (10 digits) *</label>
              <input
                name="phone" value={form.phone} onChange={handleChange}
                pattern="\d{10}" title="10-digit phone number" required
              />
            </div>

            <div className="formGroup">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} />
            </div>

            <div className="formGroup">
              <label>Budget (₹) *</label>
              <input name="budget" type="number" min="1" value={form.budget} onChange={handleChange} required />
            </div>

            <div className="formGroup">
              <label>Location *</label>
              <input name="location" value={form.location} onChange={handleChange} required />
            </div>

            <div className="formGroup">
              <label>Property Type *</label>
              <select name="property_type" value={form.property_type} onChange={handleChange}>
                {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="formGroup">
              <label>Lead Source *</label>
              <select name="source" value={form.source} onChange={handleChange}>
                {LEAD_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="btnPrimary" disabled={loading} style={{ marginTop: 20 }}>
            {loading ? 'Saving...' : isEdit ? 'Update Lead' : 'Create Lead'}
          </button>
        </form>
      </div>
    </div>
  );
}
