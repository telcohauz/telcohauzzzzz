import type { Request, Response, NextFunction } from 'express';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { adminAuth } from '../lib/firebase-admin.ts';
import { createAuditGuard } from './audit-guard.mjs';

export interface AuthRequest extends Request { user?: DecodedIdToken; }

// Authorization comes from server-managed organization claims or UID allowlist.
export const requireAuditAccess = createAuditGuard({
  verifyToken: (token: string) => adminAuth.verifyIdToken(token, true),
  getAdminUids: () => process.env.AUDIT_ADMIN_UIDS || '',
}) as (req: AuthRequest, res: Response, next: NextFunction) => Promise<unknown>;
