// ===== Lead Types =====
export interface Lead {
  id: number;
  name: string;
  phone: string;
  email?: string;
  budget: number;
  location: string;
  property_type: PropertyType;
  source: LeadSource;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
  notes?: Note[];
}

export type PropertyType = '1BHK' | '2BHK' | '3BHK' | '4BHK' | 'Plot' | 'Commercial';
export type LeadSource = 'Facebook' | 'Google' | 'Referral' | 'Website' | 'Walk-in' | 'Other';
export type LeadStatus = 'New' | 'Contacted' | 'Site Visit' | 'Closed';

export interface Note {
  id: number;
  text: string;
  lead_id: number;
  created_at: string;
}

// ===== Dashboard Types =====
export interface DashboardSummary {
  total: number;
  closed: number;
  conversionRate: number;
  bySource: Record<string, number>;
  byStatus: Record<string, number>;
}

// ===== Auth Types =====
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

// ===== API Types =====
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ===== Enum Constants (for forms) =====
export const PROPERTY_TYPES: PropertyType[] = ['1BHK', '2BHK', '3BHK', '4BHK', 'Plot', 'Commercial'];
export const LEAD_SOURCES: LeadSource[] = ['Facebook', 'Google', 'Referral', 'Website', 'Walk-in', 'Other'];
export const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Site Visit', 'Closed'];
