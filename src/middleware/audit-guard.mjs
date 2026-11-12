export function createAuditGuard({ verifyToken, getAdminUids = () => '' }) {
  return async (req, res, next) => {
    delete req.user;
    const header = req.headers.authorization;
    const match = typeof header === 'string' && /^Bearer ([^\s]+)$/i.exec(header);
    if (!match) return res.status(401).json({ error: 'Sila log masuk untuk mengakses portal audit.' });
    let user;
    try { user = await verifyToken(match[1]); }
    catch { return res.status(401).json({ error: 'Sesi tidak sah atau telah tamat. Sila log masuk semula.' }); }
    const admins = new Set(getAdminUids().split(',').map(x => x.trim()).filter(Boolean));
    const owner = typeof user?.uid === 'string' && admins.has(user.uid);
    const role = owner ? 'owner' : (user?.telcohauz_audit === true ? user.audit_role : null);
    if (!['owner', 'admin', 'auditor'].includes(role)) return res.status(403).json({ error: 'Akses audit belum diberikan kepada akaun ini.' });
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && !['owner', 'admin'].includes(role)) return res.status(403).json({ error: 'Perubahan memerlukan akses pentadbir.' });
    req.user = { ...user, audit_role: role };
    return next();
  };
}
