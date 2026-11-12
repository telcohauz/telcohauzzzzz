import test from 'node:test';
import assert from 'node:assert/strict';
import { createAuditGuard } from '../src/middleware/audit-guard.mjs';
async function request({ token, user, method = 'GET', admins = '', reject = false }) {
  let called = false;
  const guard = createAuditGuard({ verifyToken: async () => { if (reject) throw new Error('revoked'); return user; }, getAdminUids: () => admins });
  const req = { headers: token ? { authorization: 'Bearer ' + token } : {}, method };
  const res = { statusCode: 200, status(n) { this.statusCode = n; return this; }, json(body) { this.body = body; return this; } };
  await guard(req, res, () => { called = true; }); return { req, res, called };
}
test('anonymous requests never acquire an auditor identity', async () => {
  const r = await request({}); assert.equal(r.res.statusCode, 401); assert.equal(r.called, false); assert.equal(r.req.user, undefined);
});
test('preview and revoked tokens must pass actual verification', async () => {
  for (const token of ['auditor-preview-session-token', 'demo-auditor-test', 'revoked']) assert.equal((await request({ token, reject: true })).res.statusCode, 401);
});
test('valid Firebase user without organization grant is denied', async () => {
  assert.equal((await request({ token: 'valid', user: { uid: 'other', audit_role: 'owner' } })).res.statusCode, 403);
});
test('organization auditor can read but cannot modify data', async () => {
  const user = { uid: 'reader', telcohauz_audit: true, audit_role: 'auditor' };
  assert.equal((await request({ token: 'valid', user })).called, true);
  for (const method of ['POST', 'PUT', 'DELETE', 'PATCH']) assert.equal((await request({ token: 'valid', user, method })).res.statusCode, 403);
});
test('only explicitly granted owners/admins can write', async () => {
  const r = await request({ token: 'valid', user: { uid: 'owner-uid' }, method: 'POST', admins: ' owner-uid ' });
  assert.equal(r.called, true); assert.equal(r.req.user.audit_role, 'owner');
  assert.equal((await request({ token: 'valid', user: { uid: 'admin', telcohauz_audit: true, audit_role: 'admin' }, method: 'POST' })).called, true);
});
