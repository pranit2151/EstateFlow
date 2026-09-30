// Enums matching the Prisma schema — re-exported for use in DTOs
// Prisma also generates these under @prisma/client, but we keep
// these local copies so DTOs don't depend on the generated client.

export enum PropertyType {
  BHK1 = '1BHK',
  BHK2 = '2BHK',
  BHK3 = '3BHK',
  BHK4 = '4BHK',
  PLOT = 'Plot',
  COMMERCIAL = 'Commercial',
}

export enum LeadSource {
  FACEBOOK = 'Facebook',
  GOOGLE = 'Google',
  REFERRAL = 'Referral',
  WEBSITE = 'Website',
  WALKIN = 'Walk-in',
  OTHER = 'Other',
}

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  SITE_VISIT = 'Site Visit',
  CLOSED = 'Closed',
}
