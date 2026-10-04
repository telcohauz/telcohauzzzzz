export type VerificationStatus =
  | 'DISAHKAN'
  | 'BERKEMUNGKINAN'
  | 'TIDAK DISAHKAN'
  | 'BERCANGGAH'
  | 'DIBATALKAN'
  | 'PERLU SEMAK SEMULA';

export type ClaimType = 'Fact' | 'Claim' | 'Opinion' | 'Analysis';
export type SentimentType = 'Positive' | 'Neutral' | 'Negative' | 'Mixed' | 'Unknown';
export type AccountClassification = 'Official' | 'Related' | 'Unverified' | 'Impersonation' | 'Inactive' | 'False Positive';
export type AuditTaskStatus = 'To Do' | 'Researching' | 'Waiting Verification' | 'Verified' | 'Completed' | 'Blocked';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type DuplicateDecision = 'Merge' | 'Keep Separate' | 'False Positive' | 'Needs Review';

export interface Entity {
  id: number;
  entityId: string;
  officialName: string;
  tradingName: string | null;
  nameVariations: string | null;
  entityType: string;
  status: string;
  usernameHandle: string | null;
  description: string | null;
  firstSeenDate: string | null;
  lastVerifiedDate: string | null;
  verificationStatus: VerificationStatus;
  confidence: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Business {
  id: number;
  entityId: number;
  registrationNumber: string | null;
  jurisdiction: string;
  registeredAddress: string | null;
  operatingAddress: string | null;
  incorporationDate: string | null;
  taxId: string | null;
  status: string;
  notes: string | null;
}

export interface PersonParty {
  id: number;
  entityId: number | null;
  fullName: string;
  icOrIdNumber: string | null;
  roleTitle: string | null;
  nationality: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  linkedinUrl: string | null;
  notes: string | null;
}

export interface Relationship {
  id: number;
  relationshipId: string;
  entityAId: number;
  entityBId: number;
  relationshipType: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  sourceId: number | null;
  evidenceId: number | null;
  verificationStatus: VerificationStatus;
  confidence: string;
  notes: string | null;
}

export interface Contact {
  id: number;
  entityId: number;
  contactType: string;
  contactValue: string;
  label: string | null;
  isPrimary: boolean;
  verified: boolean;
  firstSeen: string | null;
  lastChecked: string | null;
  sourceId: number | null;
  evidenceId: number | null;
  notes: string | null;
}

export interface Source {
  id: number;
  sourceId: string;
  url: string | null;
  sourceName: string;
  sourceType: string;
  primaryOrSecondary: string;
  platform: string | null;
  publicationDate: string | null;
  accessDate: string | null;
  reliabilityNotes: string | null;
  relatedRecords: string | null;
}

export interface Evidence {
  id: number;
  evidenceId: string;
  evidenceType: string;
  filePathOrUrl: string | null;
  screenshotUrl: string | null;
  url: string | null;
  sourceId: number | null;
  captureDate: string | null;
  sourceDate: string | null;
  description: string;
  entityId: number | null;
  relatedRecord: string | null;
  hashRef: string | null;
  status: string;
  notes: string | null;
}

export interface Product {
  id: number;
  productId: string;
  productName: string;
  brand: string | null;
  model: string | null;
  category: string | null;
  sku: string | null;
  price: string | null;
  currency: string;
  stockStatus: string;
  productStatus: string;
  description: string | null;
  images: string | null;
  platform: string | null;
  entityId: number | null;
  firstSeen: string | null;
  lastSeen: string | null;
  verificationStatus: VerificationStatus;
  notes: string | null;
}

export interface ServiceItem {
  id: number;
  entityId: number;
  serviceName: string;
  category: string | null;
  description: string | null;
  pricingModel: string | null;
  status: string;
  notes: string | null;
}

export interface DomainWebsite {
  id: number;
  domain: string;
  subdomain: string | null;
  url: string;
  type: string;
  status: string;
  entityId: number | null;
  firstSeen: string | null;
  lastChecked: string | null;
  websiteDescription: string | null;
  about: string | null;
  contact: string | null;
  verificationStatus: VerificationStatus;
}

export interface SocialAccount {
  id: number;
  platform: string;
  username: string;
  displayName: string | null;
  url: string;
  accountType: AccountClassification;
  entityId: number | null;
  followers: string | null;
  firstSeen: string | null;
  lastObservedActivity: string | null;
  contentDescription: string | null;
  verificationStatus: VerificationStatus;
  notes: string | null;
}

export interface Marketplace {
  id: number;
  platformName: string;
  storeName: string;
  storeUrl: string;
  entityId: number | null;
  sellerId: string | null;
  rating: string | null;
  productsCount: string | null;
  firstSeen: string | null;
  lastChecked: string | null;
  verificationStatus: VerificationStatus;
  notes: string | null;
}

export interface Review {
  id: number;
  platform: string;
  reviewerIdentifier: string | null;
  rating: number;
  date: string | null;
  reviewText: string;
  sentiment: SentimentType;
  issue: string | null;
  telcohauzResponse: string | null;
  url: string | null;
  verificationStatus: VerificationStatus;
  entityId: number | null;
}

export interface Claim {
  id: number;
  claimId: string;
  claimText: string;
  claimType: ClaimType;
  entityId: number | null;
  sourceId: number | null;
  supportingEvidence: string | null;
  contradictingEvidence: string | null;
  verificationStatus: VerificationStatus;
  confidence: string;
  firstSeen: string | null;
  lastChecked: string | null;
  auditorNotes: string | null;
}

export interface ConflictItem {
  id: number;
  conflictId: string;
  subject: string;
  informationA: string;
  sourceAId: number | null;
  informationB: string;
  sourceBId: number | null;
  conflictType: string;
  currentStatus: string;
  requiredVerification: string | null;
  entityId: number | null;
  notes: string | null;
}

export interface TimelineItem {
  id: number;
  date: string;
  event: string;
  category: string;
  description: string | null;
  entityId: number | null;
  sourceId: number | null;
  evidenceId: number | null;
  confidence: string;
}

export interface AuditTask {
  id: number;
  task: string;
  category: string;
  priority: TaskPriority;
  status: AuditTaskStatus;
  assignedTo: string | null;
  createdDate: string | null;
  dueDate: string | null;
  entityId: number | null;
  result: string | null;
  notes: string | null;
}

export interface BrandAsset {
  id: number;
  assetName: string;
  assetType: string;
  fileUrlOrData: string | null;
  dimensions: string | null;
  colorCodes: string | null;
  trademarkNumber: string | null;
  registrationStatus: string;
  entityId: number | null;
  firstSeen: string | null;
  notes: string | null;
}

export interface DocumentItem {
  id: number;
  documentTitle: string;
  documentType: string;
  docNumber: string | null;
  issueDate: string | null;
  amount: string | null;
  currency: string;
  entityId: number | null;
  filePathOrUrl: string | null;
  verificationStatus: VerificationStatus;
  notes: string | null;
}

export interface SOPDocument {
  id: number;
  title: string;
  category: string;
  version: string;
  status: string;
  author: string | null;
  contentSummary: string | null;
  lastReviewed: string | null;
  tags: string | null;
}

export interface DuplicateRecord {
  id: number;
  recordTable: string;
  recordId: string;
  possibleDuplicateId: string;
  matchReason: string;
  decision: DuplicateDecision;
  reviewer: string | null;
  reviewedAt: string | null;
  notes: string | null;
}

export interface ChangeLogRecord {
  id: number;
  recordTable: string;
  recordId: string;
  fieldChanged: string;
  previousValue: string | null;
  newValue: string | null;
  changedBy: string;
  changedAt: string;
  reason: string | null;
}

export interface SearchResultItem {
  type: string;
  id: number;
  title: string;
  subtitle?: string;
  url: string;
  raw: any;
}
