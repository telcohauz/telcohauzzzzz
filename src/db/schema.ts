import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// 0. Users & Workspace Members
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').default('Lead Auditor'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 1. Entities (Central Identity Table)
export const entities = pgTable('entities', {
  id: serial('id').primaryKey(),
  entityId: text('entity_id').notNull().unique(), // e.g. ENT-001
  officialName: text('official_name').notNull(),
  tradingName: text('trading_name'),
  nameVariations: text('name_variations'),
  entityType: text('entity_type').notNull().default('Business'), // Business, Person, Brand, Digital Asset, Other
  status: text('status').notNull().default('Active'), // Active, Inactive, Dormant, Unverified, Disputed
  usernameHandle: text('username_handle'),
  description: text('description'),
  firstSeenDate: text('first_seen_date'),
  lastVerifiedDate: text('last_verified_date'),
  verificationStatus: text('verification_status').notNull().default('PERLU SEMAK SEMULA'), // DISAHKAN, BERKEMUNGKINAN, TIDAK DISAHKAN, BERCANGGAH, DIBATALKAN, PERLU SEMAK SEMULA
  confidence: text('confidence').default('Medium'), // Low, Medium, High, Verified
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 16. Sources (Traceability Foundation)
export const sources = pgTable('sources', {
  id: serial('id').primaryKey(),
  sourceId: text('source_id').notNull().unique(), // e.g. SRC-001
  url: text('url'),
  sourceName: text('source_name').notNull(),
  sourceType: text('source_type').notNull(), // Official Registry, Social Media, Public Website, Marketplace, News, Customer Review, Internal Record, Other
  primaryOrSecondary: text('primary_or_secondary').notNull().default('Primary'), // Primary, Secondary
  platform: text('platform'), // SSM, Facebook, Instagram, TikTok, Shopee, Lazada, Google, Web
  publicationDate: text('publication_date'),
  accessDate: text('access_date'),
  reliabilityNotes: text('reliability_notes'),
  relatedRecords: text('related_records'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 17. Evidence / Files
export const evidence = pgTable('evidence', {
  id: serial('id').primaryKey(),
  evidenceId: text('evidence_id').notNull().unique(), // e.g. EVI-001
  evidenceType: text('evidence_type').notNull(), // Screenshot, PDF Document, Web Archive, Image, Receipt, Contract, Public Statement
  filePathOrUrl: text('file_path_or_url'),
  screenshotUrl: text('screenshot_url'),
  url: text('url'),
  sourceId: integer('source_id').references(() => sources.id, { onDelete: 'set null' }),
  captureDate: text('capture_date'),
  sourceDate: text('source_date'),
  description: text('description').notNull(),
  entityId: integer('entity_id').references(() => entities.id, { onDelete: 'set null' }),
  relatedRecord: text('related_record'),
  hashRef: text('hash_ref'),
  status: text('status').default('Active'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 2. Businesses
export const businesses = pgTable('businesses', {
  id: serial('id').primaryKey(),
  entityId: integer('entity_id').references(() => entities.id, { onDelete: 'cascade' }).notNull(),
  registrationNumber: text('registration_number'), // SSM or official registration
  jurisdiction: text('jurisdiction').default('Malaysia'),
  registeredAddress: text('registered_address'),
  operatingAddress: text('operating_address'),
  incorporationDate: text('incorporation_date'),
  taxId: text('tax_id'),
  status: text('status').default('Active'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. People & Parties
export const peopleParties = pgTable('people_parties', {
  id: serial('id').primaryKey(),
  entityId: integer('entity_id').references(() => entities.id, { onDelete: 'set null' }),
  fullName: text('full_name').notNull(),
  icOrIdNumber: text('ic_or_id_number'),
  roleTitle: text('role_title'), // Owner, Founder, Director, Manager, Employee, Associate
  nationality: text('nationality').default('Malaysian'),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  linkedinUrl: text('linkedin_url'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Relationships
export const relationships = pgTable('relationships', {
  id: serial('id').primaryKey(),
  relationshipId: text('relationship_id').notNull().unique(), // REL-001
  entityAId: integer('entity_a_id').references(() => entities.id, { onDelete: 'cascade' }).notNull(),
  entityBId: integer('entity_b_id').references(() => entities.id, { onDelete: 'cascade' }).notNull(),
  relationshipType: text('relationship_type').notNull(), // Owner, Founder, Director, Employee, Partner, Vendor, Distributor, Customer, Marketplace, Website, Social Account, Product, Brand, Related Entity, Mentioned Entity, Other
  description: text('description'),
  startDate: text('start_date'),
  endDate: text('end_date'),
  sourceId: integer('source_id').references(() => sources.id, { onDelete: 'set null' }),
  evidenceId: integer('evidence_id').references(() => evidence.id, { onDelete: 'set null' }),
  verificationStatus: text('verification_status').notNull().default('PERLU SEMAK SEMULA'),
  confidence: text('confidence').default('Medium'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 5. Contacts
export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  entityId: integer('entity_id').references(() => entities.id, { onDelete: 'cascade' }).notNull(),
  contactType: text('contact_type').notNull(), // Phone, Email, Address, WhatsApp, Telegram, Website, Other
  contactValue: text('contact_value').notNull(),
  label: text('label'), // HQ, Support, Billing, Official
  isPrimary: boolean('is_primary').default(false),
  verified: boolean('verified').default(false),
  firstSeen: text('first_seen'),
  lastChecked: text('last_checked'),
  sourceId: integer('source_id').references(() => sources.id, { onDelete: 'set null' }),
  evidenceId: integer('evidence_id').references(() => evidence.id, { onDelete: 'set null' }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 6. Products
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  productId: text('product_id').notNull().unique(), // PRD-001
  productName: text('product_name').notNull(),
  brand: text('brand'),
  model: text('model'),
  category: text('category'), // Smartphones, Accessories, Repairs, Telco Plans, Gadgets, Other
  sku: text('sku'),
  price: text('price'),
  currency: text('currency').default('MYR'),
  stockStatus: text('stock_status').default('In Stock'),
  productStatus: text('product_status').default('Active'), // Active, Discontinued, Historical
  description: text('description'),
  images: text('images'),
  platform: text('platform'),
  entityId: integer('entity_id').references(() => entities.id, { onDelete: 'cascade' }),
  firstSeen: text('first_seen'),
  lastSeen: text('last_seen'),
  sourceId: integer('source_id').references(() => sources.id, { onDelete: 'set null' }),
  evidenceId: integer('evidence_id').references(() => evidence.id, { onDelete: 'set null' }),
  verificationStatus: text('verification_status').notNull().default('PERLU SEMAK SEMULA'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 7. Services
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  entityId: integer('entity_id').references(() => entities.id, { onDelete: 'cascade' }).notNull(),
  serviceName: text('service_name').notNull(),
  category: text('category'),
  description: text('description'),
  pricingModel: text('pricing_model'),
  status: text('status').default('Active'),
  sourceId: integer('source_id').references(() => sources.id, { onDelete: 'set null' }),
  evidenceId: integer('evidence_id').references(() => evidence.id, { onDelete: 'set null' }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 8. Domains & Websites
export const domainsWebsites = pgTable('domains_websites', {
  id: serial('id').primaryKey(),
  domain: text('domain').notNull(),
  subdomain: text('subdomain'),
  url: text('url').notNull(),
  type: text('type').default('Main Portal'), // Main Portal, E-Commerce, Landing Page, Blog, Subdomain, Redirect
  status: text('status').default('Live'), // Live, Offline, Parked, Expired, Suspended
  entityId: integer('entity_id').references(() => entities.id, { onDelete: 'cascade' }),
  firstSeen: text('first_seen'),
  lastChecked: text('last_checked'),
  websiteDescription: text('website_description'),
  about: text('about'),
  contact: text('contact'),
  productPages: text('product_pages'),
  policies: text('policies'),
  metadata: text('metadata'),
  historicalEvidence: text('historical_evidence'),
  sourceId: integer('source_id').references(() => sources.id, { onDelete: 'set null' }),
  verificationStatus: text('verification_status').default('DISAHKAN'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 9. Social Accounts
export const socialAccounts = pgTable('social_accounts', {
  id: serial('id').primaryKey(),
  platform: text('platform').notNull(), // Facebook, Instagram, TikTok, YouTube, X, LinkedIn, Telegram, WhatsApp Business, Google Business Profile
  username: text('username').notNull(),
  displayName: text('display_name'),
  url: text('url').notNull(),
  accountType: text('account_type').default('Official'), // Official, Related, Unverified, Impersonation, Inactive, False Positive
  entityId: integer('entity_id').references(() => entities.id, { onDelete: 'cascade' }),
  followers: text('followers'),
  firstSeen: text('first_seen'),
  lastObservedActivity: text('last_observed_activity'),
  contentDescription: text('content_description'),
  verificationStatus: text('verification_status').default('PERLU SEMAK SEMULA'),
  evidenceId: integer('evidence_id').references(() => evidence.id, { onDelete: 'set null' }),
  sourceId: integer('source_id').references(() => sources.id, { onDelete: 'set null' }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 10. Marketplaces & Sales Channels
export const marketplaces = pgTable('marketplaces', {
  id: serial('id').primaryKey(),
  platformName: text('platform_name').notNull(), // Shopee, Lazada, TikTok Shop, Carousell, Mudah.my, Facebook Marketplace
  storeName: text('store_name').notNull(),
  storeUrl: text('store_url').notNull(),
  entityId: integer('entity_id').references(() => entities.id, { onDelete: 'cascade' }),
  sellerId: text('seller_id'),
  rating: text('rating'),
  productsCount: text('products_count'),
  firstSeen: text('first_seen'),
  lastChecked: text('last_checked'),
  verificationStatus: text('verification_status').default('PERLU SEMAK SEMULA'),
  evidenceId: integer('evidence_id').references(() => evidence.id, { onDelete: 'set null' }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 11. Reviews
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  platform: text('platform').notNull(), // Google Reviews, Shopee, Facebook, TikTok, Forum
  reviewerIdentifier: text('reviewer_identifier'),
  rating: integer('rating'), // 1-5
  date: text('date'),
  reviewText: text('review_text').notNull(),
  sentiment: text('sentiment').notNull().default('Neutral'), // Positive, Neutral, Negative, Mixed, Unknown
  issue: text('issue'),
  telcohauzResponse: text('telcohauz_response'),
  url: text('url'),
  evidenceId: integer('evidence_id').references(() => evidence.id, { onDelete: 'set null' }),
  verificationStatus: text('verification_status').default('DISAHKAN'),
  entityId: integer('entity_id').references(() => entities.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

// 12. News & Public Mentions
export const newsMentions = pgTable('news_mentions', {
  id: serial('id').primaryKey(),
  headline: text('headline').notNull(),
  publication: text('publication').notNull(),
  author: text('author'),
  publicationDate: text('publication_date'),
  url: text('url'),
  summary: text('summary'),
  mentionType: text('mention_type').default('News'), // News, Blog, Forum, Industry Report, Legal Mention
  sentiment: text('sentiment').default('Neutral'),
  entityId: integer('entity_id').references(() => entities.id, { onDelete: 'cascade' }),
  sourceId: integer('source_id').references(() => sources.id, { onDelete: 'set null' }),
  evidenceId: integer('evidence_id').references(() => evidence.id, { onDelete: 'set null' }),
  verificationStatus: text('verification_status').default('DISAHKAN'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 13. Claims
export const claims = pgTable('claims', {
  id: serial('id').primaryKey(),
  claimId: text('claim_id').notNull().unique(), // CLM-001
  claimText: text('claim_text').notNull(),
  claimType: text('claim_type').notNull(), // Fact, Claim, Opinion, Analysis
  entityId: integer('entity_id').references(() => entities.id, { onDelete: 'cascade' }),
  sourceId: integer('source_id').references(() => sources.id, { onDelete: 'set null' }),
  supportingEvidence: text('supporting_evidence'),
  contradictingEvidence: text('contradicting_evidence'),
  verificationStatus: text('verification_status').notNull().default('PERLU SEMAK SEMULA'), // DISAHKAN, BERKEMUNGKINAN, TIDAK DISAHKAN, BERCANGGAH, DIBATALKAN, PERLU SEMAK SEMULA
  confidence: text('confidence').default('Medium'), // Low, Medium, High, Verified
  firstSeen: text('first_seen'),
  lastChecked: text('last_checked'),
  auditorNotes: text('auditor_notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 14. Verification
export const verifications = pgTable('verifications', {
  id: serial('id').primaryKey(),
  recordTable: text('record_table').notNull(),
  recordId: text('record_id').notNull(),
  verifiedBy: text('verified_by').notNull(),
  verificationStatus: text('verification_status').notNull(),
  verificationMethod: text('verification_method'), // Registry Check, WHOIS Lookup, On-site Inspection, Document Comparison, DNS Record, Cross-reference
  notes: text('notes'),
  verifiedAt: timestamp('verified_at').defaultNow(),
});

// 15. Conflicts
export const conflicts = pgTable('conflicts', {
  id: serial('id').primaryKey(),
  conflictId: text('conflict_id').notNull().unique(), // CONF-001
  subject: text('subject').notNull(),
  informationA: text('information_a').notNull(),
  sourceAId: integer('source_a_id').references(() => sources.id, { onDelete: 'set null' }),
  informationB: text('information_b').notNull(),
  sourceBId: integer('source_b_id').references(() => sources.id, { onDelete: 'set null' }),
  conflictType: text('conflict_type').notNull(), // Address Discrepancy, Ownership Mismatch, Date Discrepancy, Price Conflict, Legal Name Discrepancy, Identity Overlap
  currentStatus: text('current_status').notNull().default('Active Conflict'), // Active Conflict, Under Investigation, Resolved, Dismissed
  requiredVerification: text('required_verification'),
  entityId: integer('entity_id').references(() => entities.id, { onDelete: 'cascade' }),
  evidenceId: integer('evidence_id').references(() => evidence.id, { onDelete: 'set null' }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 18. Screenshots & Archives
export const screenshotsArchives = pgTable('screenshots_archives', {
  id: serial('id').primaryKey(),
  evidenceId: integer('evidence_id').references(() => evidence.id, { onDelete: 'cascade' }),
  archiveUrl: text('archive_url'),
  originalUrl: text('original_url'),
  snapshotDate: text('snapshot_date'),
  mimeType: text('mime_type').default('image/png'),
  fileSize: text('file_size'),
  storagePath: text('storage_path'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 19. Timeline
export const timeline = pgTable('timeline', {
  id: serial('id').primaryKey(),
  date: text('date').notNull(),
  event: text('event').notNull(),
  category: text('category').notNull(), // Business started, Website appeared, Social account created, Product launched, Product discontinued, Address changed, Phone changed, Email changed, Rebranding, New marketplace account, Major public mention, Legal milestone
  description: text('description'),
  entityId: integer('entity_id').references(() => entities.id, { onDelete: 'cascade' }),
  sourceId: integer('source_id').references(() => sources.id, { onDelete: 'set null' }),
  evidenceId: integer('evidence_id').references(() => evidence.id, { onDelete: 'set null' }),
  confidence: text('confidence').default('High'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 20. Change Log
export const changeLog = pgTable('change_log', {
  id: serial('id').primaryKey(),
  recordTable: text('record_table').notNull(),
  recordId: text('record_id').notNull(),
  fieldChanged: text('field_changed').notNull(),
  previousValue: text('previous_value'),
  newValue: text('new_value'),
  changedBy: text('changed_by').notNull(),
  changedAt: timestamp('changed_at').defaultNow(),
  reason: text('reason'),
  evidenceId: integer('evidence_id').references(() => evidence.id, { onDelete: 'set null' }),
});

// 21. Audit Tasks
export const auditTasks = pgTable('audit_tasks', {
  id: serial('id').primaryKey(),
  task: text('task').notNull(),
  category: text('category').notNull(), // Domain Verification, SSM Check, Review Audit, Marketplace Verification, Social Audit, Product Price Audit, Relationship Mapping
  priority: text('priority').notNull().default('Medium'), // Low, Medium, High, Urgent
  status: text('status').notNull().default('To Do'), // To Do, Researching, Waiting Verification, Verified, Completed, Blocked
  assignedTo: text('assigned_to'),
  createdDate: text('created_date'),
  dueDate: text('due_date'),
  entityId: integer('entity_id').references(() => entities.id, { onDelete: 'cascade' }),
  result: text('result'),
  evidenceId: integer('evidence_id').references(() => evidence.id, { onDelete: 'set null' }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 22. Internal Work
export const internalWork = pgTable('internal_work', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  workType: text('work_type').notNull(), // Dossier Compilation, Evidence Capture, Forensic Verification, Duplicate Sweep, Catalog Re-audit
  scope: text('scope'),
  status: text('status').default('In Progress'),
  auditor: text('auditor'),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  findings: text('findings'),
  notes: text('notes'),
});

// 23. Vendors & Partners
export const vendorsPartners = pgTable('vendors_partners', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  partnerType: text('partner_type').notNull(), // Supplier, Logistics, Software Provider, Payment Gateway, Marketing Agency, Legal
  entityId: integer('entity_id').references(() => entities.id, { onDelete: 'cascade' }),
  relationship: text('relationship'),
  contractRef: text('contract_ref'),
  status: text('status').default('Active'),
  contactPerson: text('contact_person'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 24. Brand Assets
export const brandAssets = pgTable('brand_assets', {
  id: serial('id').primaryKey(),
  assetName: text('asset_name').notNull(),
  assetType: text('asset_type').notNull(), // Logo, Trademark, Color Palette, Typography, Banner, Watermark
  fileUrlOrData: text('file_url_or_data'),
  dimensions: text('dimensions'),
  colorCodes: text('color_codes'),
  trademarkNumber: text('trademark_number'),
  registrationStatus: text('registration_status').default('In Use / Unregistered'), // Registered, Pending, In Use / Unregistered, Expired
  entityId: integer('entity_id').references(() => entities.id, { onDelete: 'cascade' }),
  firstSeen: text('first_seen'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 25. Invoices & Documents
export const invoicesDocuments = pgTable('invoices_documents', {
  id: serial('id').primaryKey(),
  documentTitle: text('document_title').notNull(),
  documentType: text('document_type').notNull(), // Registration Certificate, Tax Invoice, Purchase Order, Service Agreement, Receipt, Official Letter
  docNumber: text('doc_number'),
  issueDate: text('issue_date'),
  amount: text('amount'),
  currency: text('currency').default('MYR'),
  entityId: integer('entity_id').references(() => entities.id, { onDelete: 'cascade' }),
  filePathOrUrl: text('file_path_or_url'),
  verificationStatus: text('verification_status').default('DISAHKAN'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 26. SOP & Work Documents
export const sopWorkDocuments = pgTable('sop_work_documents', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(), // Investigation SOP, Evidence Handling, Verification Standard, Data Hygiene
  version: text('version').default('v1.0'),
  status: text('status').default('Approved'),
  author: text('author'),
  contentSummary: text('content_summary'),
  lastReviewed: text('last_reviewed'),
  tags: text('tags'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 27. Website & Creative Projects
export const creativeProjects = pgTable('creative_projects', {
  id: serial('id').primaryKey(),
  projectName: text('project_name').notNull(),
  projectType: text('project_type').notNull(), // Website Redesign, Brand Guidelines, Catalog Audit, Photography Archive
  targetUrl: text('target_url'),
  status: text('status').default('Planning'),
  lead: text('lead'),
  launchDate: text('launch_date'),
  assetsCount: integer('assets_count').default(0),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 29. Duplicates / False Positives Control
export const duplicatesControl = pgTable('duplicates_control', {
  id: serial('id').primaryKey(),
  recordTable: text('record_table').notNull(),
  recordId: text('record_id').notNull(),
  possibleDuplicateId: text('possible_duplicate_id').notNull(),
  matchReason: text('match_reason').notNull(),
  decision: text('decision').notNull().default('Needs Review'), // Merge, Keep Separate, False Positive, Needs Review
  evidenceId: integer('evidence_id').references(() => evidence.id, { onDelete: 'set null' }),
  reviewer: text('reviewer'),
  reviewedAt: timestamp('reviewed_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 30. Audit Sessions
export const auditSessions = pgTable('audit_sessions', {
  id: serial('id').primaryKey(),
  sessionTitle: text('session_title').notNull(),
  auditorName: text('auditor_name').notNull(),
  startedAt: timestamp('started_at').defaultNow(),
  endedAt: timestamp('ended_at'),
  targetEntityId: integer('target_entity_id').references(() => entities.id, { onDelete: 'set null' }),
  summaryOfFindings: text('summary_of_findings'),
  recordsAuditedCount: integer('records_audited_count').default(0),
  sessionNotes: text('session_notes'),
});

// Relations Definitions
export const entitiesRelations = relations(entities, ({ many }) => ({
  businesses: many(businesses),
  people: many(peopleParties),
  contacts: many(contacts),
  products: many(products),
  services: many(services),
  domains: many(domainsWebsites),
  socialAccounts: many(socialAccounts),
  marketplaces: many(marketplaces),
  reviews: many(reviews),
  newsMentions: many(newsMentions),
  claims: many(claims),
  conflicts: many(conflicts),
  timeline: many(timeline),
  auditTasks: many(auditTasks),
  brandAssets: many(brandAssets),
  invoices: many(invoicesDocuments),
  evidence: many(evidence),
}));

export const sourcesRelations = relations(sources, ({ many }) => ({
  evidence: many(evidence),
  claims: many(claims),
  timeline: many(timeline),
}));

export const evidenceRelations = relations(evidence, ({ one, many }) => ({
  source: one(sources, {
    fields: [evidence.sourceId],
    references: [sources.id],
  }),
  entity: one(entities, {
    fields: [evidence.entityId],
    references: [entities.id],
  }),
  archives: many(screenshotsArchives),
}));

// 31. Public Enquiries & Lead Applications
export const enquiries = pgTable('enquiries', {
  id: serial('id').primaryKey(),
  submissionId: text('submission_id'), // Format: TH-YYMMDD-xxxxx
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  serviceType: text('service_type').notNull(), // Fibre, Business Fibre, 5G, Mobile, Astro, Water Purifier, Appliances, Solar, Digital Services
  preferredProvider: text('preferred_provider'),
  planInterested: text('plan_interested'),
  productSnapshot: text('product_snapshot'), // Immutable JSON snapshot of plan/offer at time of enquiry
  address: text('address'),
  postcode: text('postcode'),
  state: text('state'),
  message: text('message'),
  status: text('status').default('Baru'), // Baru, Dihubungi, Dalam Proses, Selesai
  source: text('source').default('Website'),
  createdAt: timestamp('created_at').defaultNow(),
});

