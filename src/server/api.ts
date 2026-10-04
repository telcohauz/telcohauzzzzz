import { Router } from 'express';
import { db } from '../db/index.ts';
import {
  entities,
  businesses,
  peopleParties,
  sources,
  evidence,
  relationships,
  contacts,
  products,
  services,
  domainsWebsites,
  socialAccounts,
  marketplaces,
  reviews,
  claims,
  conflicts,
  timeline,
  auditTasks,
  brandAssets,
  invoicesDocuments,
  sopWorkDocuments,
  duplicatesControl,
  changeLog,
  auditSessions,
  verifications,
  enquiries
} from '../db/schema.ts';
import { eq, desc, ilike, or } from 'drizzle-orm';
import { optionalAuth, AuthRequest } from '../middleware/auth.ts';
import { seedDemoData } from '../db/seed.ts';
import {
  TELCO_PLANS,
  PROMOTIONS,
  TELCO_NEWS,
  CONSUMER_GUIDES,
  PROVIDERS_INFO,
  TELCOHAUZ_BUSINESS,
  generateSubmissionId,
} from '../data/telcoData.ts';

export const apiRouter = Router();

// ========================================================
// PUBLIC WEBSITE API ENDPOINTS
// ========================================================

// 1. Get Plans Catalogue
apiRouter.get('/public/plans', (req, res) => {
  const { category, provider, q, sort } = req.query;
  let list = [...TELCO_PLANS];

  if (category && category !== 'ALL') {
    list = list.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (provider && provider !== 'ALL') {
    list = list.filter(p => p.provider.toLowerCase().includes(String(provider).toLowerCase()));
  }

  if (q) {
    const term = String(q).toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.provider.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.bestFor.toLowerCase().includes(term)
    );
  }

  if (sort === 'price-low') {
    list.sort((a, b) => a.priceMonthly - b.priceMonthly);
  } else if (sort === 'price-high') {
    list.sort((a, b) => b.priceMonthly - a.priceMonthly);
  } else if (sort === 'popular') {
    list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
  }

  res.json(list);
});

// 2. Get Single Plan by Slug
apiRouter.get('/public/plans/:slug', (req, res) => {
  const plan = TELCO_PLANS.find(p => p.slug === req.params.slug || p.id === req.params.slug);
  if (!plan) {
    return res.status(404).json({ error: 'Pelan tidak dijumpai' });
  }
  res.json(plan);
});

// 3. Get Promotions
apiRouter.get('/public/promotions', (_req, res) => {
  res.json(PROMOTIONS);
});

apiRouter.get('/public/promotions/:slug', (req, res) => {
  const promo = PROMOTIONS.find(p => p.slug === req.params.slug || p.id === req.params.slug);
  if (!promo) {
    return res.status(404).json({ error: 'Promosi tidak dijumpai' });
  }
  res.json(promo);
});

// 4. Get Telco News
apiRouter.get('/public/news', (_req, res) => {
  res.json(TELCO_NEWS);
});

apiRouter.get('/public/news/:slug', (req, res) => {
  const news = TELCO_NEWS.find(n => n.slug === req.params.slug || n.id === req.params.slug);
  if (!news) {
    return res.status(404).json({ error: 'Berita tidak dijumpai' });
  }
  res.json(news);
});

// 5. Get Consumer Guides
apiRouter.get('/public/guides', (_req, res) => {
  res.json(CONSUMER_GUIDES);
});

apiRouter.get('/public/guides/:slug', (req, res) => {
  const guide = CONSUMER_GUIDES.find(g => g.slug === req.params.slug || g.id === req.params.slug);
  if (!guide) {
    return res.status(404).json({ error: 'Panduan tidak dijumpai' });
  }
  res.json(guide);
});

// 6. Get Providers Directory
apiRouter.get('/public/providers', (_req, res) => {
  res.json(PROVIDERS_INFO);
});

// 7. Submit Public Enquiry / Eligibility Lead Application
apiRouter.post('/public/enquiry', async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      serviceType,
      preferredProvider,
      planInterested,
      productSnapshot,
      address,
      postcode,
      state,
      message,
      source
    } = req.body;

    if (!fullName || !phone) {
      return res.status(400).json({ error: 'Nama dan nombor telefon diperlukan' });
    }

    // Generate canonical submission ID: TH-YYMMDD-xxxxx
    const submissionId = generateSubmissionId();

    // Preserve immutable snapshot of the product/offer at the time of enquiry
    let snapshotStr: string | null = null;
    if (productSnapshot) {
      snapshotStr = typeof productSnapshot === 'string' ? productSnapshot : JSON.stringify(productSnapshot);
    } else if (planInterested) {
      const matched = TELCO_PLANS.find(p => p.name === planInterested || p.slug === planInterested || p.id === planInterested);
      if (matched) {
        snapshotStr = JSON.stringify(matched);
      }
    }

    // Save to Cloud SQL enquiries table
    const result = await db.insert(enquiries).values({
      submissionId,
      fullName,
      phone,
      email: email || null,
      serviceType: serviceType || 'Fibre Internet',
      preferredProvider: preferredProvider || null,
      planInterested: planInterested || null,
      productSnapshot: snapshotStr,
      address: address || null,
      postcode: postcode || null,
      state: state || null,
      message: message || null,
      status: 'Baru',
      source: source || 'Website Public Form',
    }).returning();

    // Generate WhatsApp direct link with verified business number & reference code
    const waText = encodeURIComponent(
      `Salam TelcoHauz,\n` +
      `No. Rujukan Permohonan: ${submissionId}\n` +
      `Nama: ${fullName} (${phone})\n` +
      `Pakej: ${planInterested || 'Pakej Pilihan'}\n` +
      `Pembekal: ${preferredProvider || 'Semua Pembekal'}\n` +
      `Servis: ${serviceType || 'Fibre Internet'}\n` +
      `Lokasi: ${postcode || ''} ${state || ''}\n` +
      `Mohon bantuan perunding TelcoHauz untuk semakan kelayakan & proses permohonan. Terima kasih!`
    );
    const whatsappUrl = `https://wa.me/${TELCOHAUZ_BUSINESS.whatsappNumber}?text=${waText}`;

    res.status(201).json({
      success: true,
      submissionId,
      enquiry: result[0],
      whatsappUrl,
      message: `Permohonan anda berjaya direkodkan dengan No. Rujukan ${submissionId}. Perunding TelcoHauz akan membimbing anda sehingga proses permohonan selesai.`
    });
  } catch (error) {
    console.error('Enquiry submission error:', error);
    res.status(500).json({ error: 'Gagal memproses permohonan' });
  }
});

// 8. List Enquiries (for Admin / Audit portal)
apiRouter.get('/public/enquiries', optionalAuth, async (_req, res) => {
  try {
    const list = await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve enquiries' });
  }
});

// Automatically seed on initial load if needed
let seeded = false;
apiRouter.use(async (_req, _res, next) => {
  if (!seeded) {
    try {
      await seedDemoData();
      seeded = true;
    } catch (e) {
      console.error('Seed check failed:', e);
    }
  }
  next();
});

// Current Auditor User Profile
apiRouter.get('/auth/me', optionalAuth, (req: AuthRequest, res) => {
  res.json({
    user: req.user || {
      uid: 'auditor-lead-session',
      email: 'ashraffrahman3677@gmail.com',
      name: 'Ashraff Rahman',
      role: 'Principal Auditor & Owner',
    }
  });
});

// Comprehensive Dashboard Stats
apiRouter.get('/stats', optionalAuth, async (_req, res) => {
  try {
    const allEntities = await db.select().from(entities);
    const allSources = await db.select().from(sources);
    const allEvidence = await db.select().from(evidence);
    const allClaims = await db.select().from(claims);
    const allConflicts = await db.select().from(conflicts);
    const allProducts = await db.select().from(products);
    const allSocial = await db.select().from(socialAccounts);
    const allDomains = await db.select().from(domainsWebsites);
    const allReviews = await db.select().from(reviews);
    const allTasks = await db.select().from(auditTasks);
    const allTimeline = await db.select().from(timeline).orderBy(desc(timeline.date));
    const allChanges = await db.select().from(changeLog).orderBy(desc(changeLog.changedAt)).limit(10);
    const allDuplicates = await db.select().from(duplicatesControl);

    const verifiedEntities = allEntities.filter(e => e.verificationStatus === 'DISAHKAN').length;
    const unverifiedEntities = allEntities.filter(e => e.verificationStatus === 'TIDAK DISAHKAN' || e.verificationStatus === 'PERLU SEMAK SEMULA').length;
    const pendingVerification = allClaims.filter(c => c.verificationStatus === 'PERLU SEMAK SEMULA' || c.verificationStatus === 'BERKEMUNGKINAN').length;
    const openTasks = allTasks.filter(t => t.status !== 'Completed').length;
    const activeConflicts = allConflicts.filter(c => c.currentStatus === 'Active Conflict' || c.currentStatus === 'Under Investigation').length;

    // Chart aggregations
    const verificationBreakdown = {
      DISAHKAN: allClaims.filter(c => c.verificationStatus === 'DISAHKAN').length,
      BERKEMUNGKINAN: allClaims.filter(c => c.verificationStatus === 'BERKEMUNGKINAN').length,
      'PERLU SEMAK SEMULA': allClaims.filter(c => c.verificationStatus === 'PERLU SEMAK SEMULA').length,
      BERCANGGAH: allClaims.filter(c => c.verificationStatus === 'BERCANGGAH').length,
      'TIDAK DISAHKAN': allClaims.filter(c => c.verificationStatus === 'TIDAK DISAHKAN').length,
      DIBATALKAN: allClaims.filter(c => c.verificationStatus === 'DIBATALKAN').length,
    };

    const sourcePlatformBreakdown = allSources.reduce((acc: Record<string, number>, s) => {
      const p = s.platform || 'Other';
      acc[p] = (acc[p] || 0) + 1;
      return acc;
    }, {});

    const reviewSentimentBreakdown = allReviews.reduce((acc: Record<string, number>, r) => {
      acc[r.sentiment] = (acc[r.sentiment] || 0) + 1;
      return acc;
    }, {});

    const socialPlatformBreakdown = allSocial.reduce((acc: Record<string, number>, s) => {
      acc[s.platform] = (acc[s.platform] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalEntities: allEntities.length,
      verifiedEntities,
      unverifiedEntities,
      pendingVerification,
      totalSources: allSources.length,
      totalEvidence: allEvidence.length,
      totalProducts: allProducts.length,
      totalSocial: allSocial.length,
      totalDomains: allDomains.length,
      totalReviews: allReviews.length,
      openTasks,
      activeConflicts,
      totalDuplicates: allDuplicates.length,
      verificationBreakdown,
      sourcePlatformBreakdown,
      reviewSentimentBreakdown,
      socialPlatformBreakdown,
      recentTimeline: allTimeline.slice(0, 6),
      recentChanges: allChanges,
      recentTasks: allTasks.slice(0, 5),
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to retrieve audit statistics' });
  }
});

// Master Global Index Search
apiRouter.get('/search', optionalAuth, async (req, res) => {
  const q = String(req.query.q || '').trim();
  if (!q) {
    return res.json({ results: [] });
  }

  try {
    const searchPattern = `%${q}%`;

    const [
      entResults,
      prodResults,
      domResults,
      socResults,
      claimResults,
      srcResults,
      eviResults,
      revResults,
      timelineResults,
      contactResults
    ] = await Promise.all([
      db.select().from(entities).where(
        or(
          ilike(entities.officialName, searchPattern),
          ilike(entities.tradingName, searchPattern),
          ilike(entities.usernameHandle, searchPattern),
          ilike(entities.description, searchPattern)
        )
      ).limit(8),
      db.select().from(products).where(
        or(
          ilike(products.productName, searchPattern),
          ilike(products.sku, searchPattern),
          ilike(products.brand, searchPattern),
          ilike(products.description, searchPattern)
        )
      ).limit(8),
      db.select().from(domainsWebsites).where(
        or(
          ilike(domainsWebsites.domain, searchPattern),
          ilike(domainsWebsites.url, searchPattern),
          ilike(domainsWebsites.websiteDescription, searchPattern)
        )
      ).limit(8),
      db.select().from(socialAccounts).where(
        or(
          ilike(socialAccounts.username, searchPattern),
          ilike(socialAccounts.displayName, searchPattern),
          ilike(socialAccounts.platform, searchPattern)
        )
      ).limit(8),
      db.select().from(claims).where(
        or(
          ilike(claims.claimText, searchPattern),
          ilike(claims.claimId, searchPattern)
        )
      ).limit(8),
      db.select().from(sources).where(
        or(
          ilike(sources.sourceName, searchPattern),
          ilike(sources.url, searchPattern),
          ilike(sources.platform, searchPattern)
        )
      ).limit(8),
      db.select().from(evidence).where(
        or(
          ilike(evidence.description, searchPattern),
          ilike(evidence.evidenceId, searchPattern)
        )
      ).limit(8),
      db.select().from(reviews).where(
        or(
          ilike(reviews.reviewText, searchPattern),
          ilike(reviews.reviewerIdentifier, searchPattern)
        )
      ).limit(8),
      db.select().from(timeline).where(
        or(
          ilike(timeline.event, searchPattern),
          ilike(timeline.description, searchPattern)
        )
      ).limit(8),
      db.select().from(contacts).where(
        or(
          ilike(contacts.contactValue, searchPattern),
          ilike(contacts.label, searchPattern)
        )
      ).limit(8),
    ]);

    const formattedResults = [
      ...entResults.map(e => ({ type: 'Entity', id: e.id, title: e.officialName, subtitle: `${e.entityType} • ${e.verificationStatus}`, url: `/entities/${e.id}`, raw: e })),
      ...prodResults.map(p => ({ type: 'Product', id: p.id, title: p.productName, subtitle: `${p.brand} • ${p.price} ${p.currency}`, url: `/products`, raw: p })),
      ...domResults.map(d => ({ type: 'Domain', id: d.id, title: d.domain, subtitle: `${d.type} • ${d.status}`, url: `/domains`, raw: d })),
      ...socResults.map(s => ({ type: 'Social Account', id: s.id, title: `@${s.username} (${s.platform})`, subtitle: s.displayName, url: `/social`, raw: s })),
      ...claimResults.map(c => ({ type: 'Claim', id: c.id, title: c.claimText, subtitle: `${c.claimType} • ${c.verificationStatus}`, url: `/claims`, raw: c })),
      ...srcResults.map(s => ({ type: 'Source', id: s.id, title: s.sourceName, subtitle: `${s.sourceType} • ${s.platform}`, url: `/sources`, raw: s })),
      ...eviResults.map(ev => ({ type: 'Evidence', id: ev.id, title: ev.description, subtitle: `${ev.evidenceType} • ${ev.evidenceId}`, url: `/evidence`, raw: ev })),
      ...revResults.map(r => ({ type: 'Review', id: r.id, title: r.reviewText.slice(0, 80) + '...', subtitle: `${r.platform} • Rating: ${r.rating}/5 (${r.sentiment})`, url: `/reviews`, raw: r })),
      ...timelineResults.map(t => ({ type: 'Timeline Event', id: t.id, title: t.event, subtitle: `${t.date} • ${t.category}`, url: `/timeline`, raw: t })),
      ...contactResults.map(ct => ({ type: 'Contact Point', id: ct.id, title: ct.contactValue, subtitle: `${ct.contactType} (${ct.label || 'Direct'})`, url: `/entities/${ct.entityId}`, raw: ct }))
    ];

    res.json({ results: formattedResults, query: q, total: formattedResults.length });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Entities API
apiRouter.get('/entities', optionalAuth, async (_req, res) => {
  try {
    const list = await db.select().from(entities).orderBy(entities.id);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve entities' });
  }
});

// Full Deep Entity Profile Page
apiRouter.get('/entities/:id', optionalAuth, async (req, res) => {
  try {
    const entityId = parseInt(req.params.id, 10);
    const entList = await db.select().from(entities).where(eq(entities.id, entityId)).limit(1);
    if (!entList.length) {
      return res.status(404).json({ error: 'Entity not found' });
    }
    const entity = entList[0];

    const [
      businessData,
      peopleData,
      contactData,
      relationshipsData,
      productsData,
      servicesData,
      domainsData,
      socialData,
      marketplacesData,
      reviewsData,
      claimsData,
      evidenceData,
      timelineData,
      brandAssetsData,
      documentsData,
      tasksData,
      conflictsData
    ] = await Promise.all([
      db.select().from(businesses).where(eq(businesses.entityId, entityId)),
      db.select().from(peopleParties).where(eq(peopleParties.entityId, entityId)),
      db.select().from(contacts).where(eq(contacts.entityId, entityId)),
      db.select().from(relationships).where(
        or(eq(relationships.entityAId, entityId), eq(relationships.entityBId, entityId))
      ),
      db.select().from(products).where(eq(products.entityId, entityId)),
      db.select().from(services).where(eq(services.entityId, entityId)),
      db.select().from(domainsWebsites).where(eq(domainsWebsites.entityId, entityId)),
      db.select().from(socialAccounts).where(eq(socialAccounts.entityId, entityId)),
      db.select().from(marketplaces).where(eq(marketplaces.entityId, entityId)),
      db.select().from(reviews).where(eq(reviews.entityId, entityId)),
      db.select().from(claims).where(eq(claims.entityId, entityId)),
      db.select().from(evidence).where(eq(evidence.entityId, entityId)),
      db.select().from(timeline).where(eq(timeline.entityId, entityId)).orderBy(timeline.date),
      db.select().from(brandAssets).where(eq(brandAssets.entityId, entityId)),
      db.select().from(invoicesDocuments).where(eq(invoicesDocuments.entityId, entityId)),
      db.select().from(auditTasks).where(eq(auditTasks.entityId, entityId)),
      db.select().from(conflicts).where(eq(conflicts.entityId, entityId))
    ]);

    res.json({
      entity,
      businesses: businessData,
      people: peopleData,
      contacts: contactData,
      relationships: relationshipsData,
      products: productsData,
      services: servicesData,
      domains: domainsData,
      socialAccounts: socialData,
      marketplaces: marketplacesData,
      reviews: reviewsData,
      claims: claimsData,
      evidence: evidenceData,
      timeline: timelineData,
      brandAssets: brandAssetsData,
      documents: documentsData,
      auditTasks: tasksData,
      conflicts: conflictsData,
    });
  } catch (error) {
    console.error('Entity profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve entity profile' });
  }
});

// Create Entity
apiRouter.post('/entities', optionalAuth, async (req, res) => {
  try {
    const { officialName, tradingName, entityType, usernameHandle, description, verificationStatus, confidence, notes } = req.body;
    const count = (await db.select().from(entities)).length + 1;
    const entityId = `ENT-${String(count).padStart(3, '0')}`;

    const newEnt = await db.insert(entities).values({
      entityId,
      officialName,
      tradingName: tradingName || officialName,
      entityType: entityType || 'Business',
      usernameHandle,
      description,
      verificationStatus: verificationStatus || 'PERLU SEMAK SEMULA',
      confidence: confidence || 'Medium',
      notes,
      firstSeenDate: new Date().toISOString().split('T')[0],
      lastVerifiedDate: new Date().toISOString().split('T')[0],
    }).returning();

    // Log in change log
    await db.insert(changeLog).values({
      recordTable: 'entities',
      recordId: entityId,
      fieldChanged: 'created',
      newValue: officialName,
      changedBy: (req as AuthRequest).user?.email || 'System Auditor',
      reason: 'Manual discovery capture',
    });

    res.status(201).json(newEnt[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create entity' });
  }
});

// Sources API
apiRouter.get('/sources', optionalAuth, async (_req, res) => {
  try {
    const list = await db.select().from(sources).orderBy(desc(sources.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve sources' });
  }
});

apiRouter.post('/sources', optionalAuth, async (req, res) => {
  try {
    const { sourceName, url, sourceType, primaryOrSecondary, platform, publicationDate, reliabilityNotes, relatedRecords } = req.body;
    const count = (await db.select().from(sources)).length + 1;
    const sourceId = `SRC-${String(count).padStart(3, '0')}`;

    const item = await db.insert(sources).values({
      sourceId,
      sourceName,
      url,
      sourceType: sourceType || 'Official Registry',
      primaryOrSecondary: primaryOrSecondary || 'Primary',
      platform,
      publicationDate,
      accessDate: new Date().toISOString().split('T')[0],
      reliabilityNotes,
      relatedRecords,
    }).returning();

    res.status(201).json(item[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create source' });
  }
});

// Evidence API
apiRouter.get('/evidence', optionalAuth, async (_req, res) => {
  try {
    const list = await db.select().from(evidence).orderBy(desc(evidence.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve evidence' });
  }
});

apiRouter.post('/evidence', optionalAuth, async (req, res) => {
  try {
    const { evidenceType, description, filePathOrUrl, screenshotUrl, url, sourceId, entityId, notes, hashRef } = req.body;
    const count = (await db.select().from(evidence)).length + 1;
    const evidenceId = `EVI-${String(count).padStart(3, '0')}`;

    const item = await db.insert(evidence).values({
      evidenceId,
      evidenceType: evidenceType || 'Screenshot',
      description,
      filePathOrUrl,
      screenshotUrl,
      url,
      sourceId: sourceId ? parseInt(sourceId, 10) : null,
      entityId: entityId ? parseInt(entityId, 10) : null,
      captureDate: new Date().toISOString().split('T')[0],
      hashRef,
      status: 'Active',
      notes,
    }).returning();

    res.status(201).json(item[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create evidence' });
  }
});

// Claims API & Verification Workflow
apiRouter.get('/claims', optionalAuth, async (_req, res) => {
  try {
    const list = await db.select().from(claims).orderBy(desc(claims.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve claims' });
  }
});

apiRouter.post('/claims', optionalAuth, async (req, res) => {
  try {
    const { claimText, claimType, entityId, sourceId, supportingEvidence, contradictingEvidence, verificationStatus, confidence, auditorNotes } = req.body;
    const count = (await db.select().from(claims)).length + 1;
    const claimId = `CLM-${String(count).padStart(3, '0')}`;

    const item = await db.insert(claims).values({
      claimId,
      claimText,
      claimType: claimType || 'Claim',
      entityId: entityId ? parseInt(entityId, 10) : null,
      sourceId: sourceId ? parseInt(sourceId, 10) : null,
      supportingEvidence,
      contradictingEvidence,
      verificationStatus: verificationStatus || 'PERLU SEMAK SEMULA',
      confidence: confidence || 'Medium',
      firstSeen: new Date().toISOString().split('T')[0],
      lastChecked: new Date().toISOString().split('T')[0],
      auditorNotes,
    }).returning();

    res.status(201).json(item[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create claim' });
  }
});

apiRouter.put('/claims/:id/verify', optionalAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { verificationStatus, verificationMethod, notes } = req.body;

    const existing = await db.select().from(claims).where(eq(claims.id, id)).limit(1);
    if (!existing.length) return res.status(404).json({ error: 'Claim not found' });

    const prev = existing[0].verificationStatus;

    const updated = await db.update(claims).set({
      verificationStatus,
      lastChecked: new Date().toISOString().split('T')[0],
      auditorNotes: notes ? `${existing[0].auditorNotes || ''}\n[Update]: ${notes}` : existing[0].auditorNotes,
    }).where(eq(claims.id, id)).returning();

    // Record in Verification log
    await db.insert(verifications).values({
      recordTable: 'claims',
      recordId: String(id),
      verifiedBy: (req as AuthRequest).user?.email || 'Lead Auditor',
      verificationStatus,
      verificationMethod: verificationMethod || 'Direct Source Cross-check',
      notes,
    });

    // Record in Change Log
    await db.insert(changeLog).values({
      recordTable: 'claims',
      recordId: String(id),
      fieldChanged: 'verificationStatus',
      previousValue: prev,
      newValue: verificationStatus,
      changedBy: (req as AuthRequest).user?.email || 'Lead Auditor',
      reason: notes || 'Formal verification status change',
    });

    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update verification status' });
  }
});

// Conflicts API
apiRouter.get('/conflicts', optionalAuth, async (_req, res) => {
  try {
    const list = await db.select().from(conflicts).orderBy(desc(conflicts.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve conflicts' });
  }
});

apiRouter.post('/conflicts', optionalAuth, async (req, res) => {
  try {
    const { subject, informationA, sourceAId, informationB, sourceBId, conflictType, currentStatus, requiredVerification, entityId, notes } = req.body;
    const count = (await db.select().from(conflicts)).length + 1;
    const conflictId = `CONF-${String(count).padStart(3, '0')}`;

    const item = await db.insert(conflicts).values({
      conflictId,
      subject,
      informationA,
      sourceAId: sourceAId ? parseInt(sourceAId, 10) : null,
      informationB,
      sourceBId: sourceBId ? parseInt(sourceBId, 10) : null,
      conflictType: conflictType || 'Address Discrepancy',
      currentStatus: currentStatus || 'Active Conflict',
      requiredVerification,
      entityId: entityId ? parseInt(entityId, 10) : null,
      notes,
    }).returning();

    res.status(201).json(item[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create conflict' });
  }
});

// Relationships API
apiRouter.get('/relationships', optionalAuth, async (_req, res) => {
  try {
    const list = await db.select().from(relationships).orderBy(desc(relationships.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve relationships' });
  }
});

apiRouter.post('/relationships', optionalAuth, async (req, res) => {
  try {
    const { entityAId, entityBId, relationshipType, description, sourceId, evidenceId, verificationStatus, confidence, notes } = req.body;
    const count = (await db.select().from(relationships)).length + 1;
    const relationshipId = `REL-${String(count).padStart(3, '0')}`;

    const item = await db.insert(relationships).values({
      relationshipId,
      entityAId: parseInt(entityAId, 10),
      entityBId: parseInt(entityBId, 10),
      relationshipType,
      description,
      sourceId: sourceId ? parseInt(sourceId, 10) : null,
      evidenceId: evidenceId ? parseInt(evidenceId, 10) : null,
      verificationStatus: verificationStatus || 'PERLU SEMAK SEMULA',
      confidence: confidence || 'Medium',
      notes,
    }).returning();

    res.status(201).json(item[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create relationship' });
  }
});

// Products API
apiRouter.get('/products', optionalAuth, async (_req, res) => {
  try {
    const list = await db.select().from(products).orderBy(desc(products.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

apiRouter.post('/products', optionalAuth, async (req, res) => {
  try {
    const { productName, brand, model, category, sku, price, currency, stockStatus, description, platform, entityId, notes } = req.body;
    const count = (await db.select().from(products)).length + 1;
    const productId = `PRD-${String(count).padStart(3, '0')}`;

    const item = await db.insert(products).values({
      productId,
      productName,
      brand,
      model,
      category: category || 'Smartphones',
      sku,
      price,
      currency: currency || 'MYR',
      stockStatus: stockStatus || 'In Stock',
      productStatus: 'Active',
      description,
      platform,
      entityId: entityId ? parseInt(entityId, 10) : null,
      firstSeen: new Date().toISOString().split('T')[0],
      lastSeen: new Date().toISOString().split('T')[0],
      verificationStatus: 'DISAHKAN',
      notes,
    }).returning();

    res.status(201).json(item[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Domains & Websites API
apiRouter.get('/domains', optionalAuth, async (_req, res) => {
  try {
    const list = await db.select().from(domainsWebsites).orderBy(desc(domainsWebsites.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve domains' });
  }
});

apiRouter.post('/domains', optionalAuth, async (req, res) => {
  try {
    const { domain, subdomain, url, type, status, entityId, websiteDescription, about, contact, notes } = req.body;
    const item = await db.insert(domainsWebsites).values({
      domain,
      subdomain: subdomain || '@',
      url,
      type: type || 'Main Portal',
      status: status || 'Live',
      entityId: entityId ? parseInt(entityId, 10) : null,
      firstSeen: new Date().toISOString().split('T')[0],
      lastChecked: new Date().toISOString().split('T')[0],
      websiteDescription,
      about,
      contact,
      verificationStatus: 'DISAHKAN',
    }).returning();

    res.status(201).json(item[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create domain' });
  }
});

// Social Accounts API
apiRouter.get('/social', optionalAuth, async (_req, res) => {
  try {
    const list = await db.select().from(socialAccounts).orderBy(desc(socialAccounts.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve social accounts' });
  }
});

apiRouter.post('/social', optionalAuth, async (req, res) => {
  try {
    const { platform, username, displayName, url, accountType, entityId, followers, contentDescription, notes } = req.body;
    const item = await db.insert(socialAccounts).values({
      platform,
      username,
      displayName,
      url,
      accountType: accountType || 'Official',
      entityId: entityId ? parseInt(entityId, 10) : null,
      followers,
      firstSeen: new Date().toISOString().split('T')[0],
      lastObservedActivity: new Date().toISOString().split('T')[0],
      contentDescription,
      verificationStatus: 'PERLU SEMAK SEMULA',
      notes,
    }).returning();

    res.status(201).json(item[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create social account' });
  }
});

// Marketplaces API
apiRouter.get('/marketplaces', optionalAuth, async (_req, res) => {
  try {
    const list = await db.select().from(marketplaces).orderBy(desc(marketplaces.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve marketplaces' });
  }
});

// Reviews API
apiRouter.get('/reviews', optionalAuth, async (_req, res) => {
  try {
    const list = await db.select().from(reviews).orderBy(desc(reviews.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
});

apiRouter.post('/reviews', optionalAuth, async (req, res) => {
  try {
    const { platform, reviewerIdentifier, rating, date, reviewText, sentiment, issue, telcohauzResponse, entityId } = req.body;
    const item = await db.insert(reviews).values({
      platform,
      reviewerIdentifier,
      rating: rating ? parseInt(rating, 10) : 5,
      date: date || new Date().toISOString().split('T')[0],
      reviewText,
      sentiment: sentiment || 'Neutral',
      issue,
      telcohauzResponse,
      entityId: entityId ? parseInt(entityId, 10) : null,
      verificationStatus: 'DISAHKAN',
    }).returning();

    res.status(201).json(item[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Timeline API
apiRouter.get('/timeline', optionalAuth, async (req, res) => {
  try {
    const category = req.query.category as string;
    const year = req.query.year as string;
    const entityId = req.query.entityId ? parseInt(req.query.entityId as string, 10) : null;

    let list = await db.select().from(timeline).orderBy(desc(timeline.date));

    if (category) {
      list = list.filter(t => t.category === category);
    }
    if (year) {
      list = list.filter(t => t.date.startsWith(year));
    }
    if (entityId) {
      list = list.filter(t => t.entityId === entityId);
    }

    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve timeline' });
  }
});

apiRouter.post('/timeline', optionalAuth, async (req, res) => {
  try {
    const { date, event, category, description, entityId, sourceId, evidenceId, confidence } = req.body;
    const item = await db.insert(timeline).values({
      date,
      event,
      category,
      description,
      entityId: entityId ? parseInt(entityId, 10) : null,
      sourceId: sourceId ? parseInt(sourceId, 10) : null,
      evidenceId: evidenceId ? parseInt(evidenceId, 10) : null,
      confidence: confidence || 'High',
    }).returning();

    res.status(201).json(item[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create timeline event' });
  }
});

// Audit Tasks API
apiRouter.get('/tasks', optionalAuth, async (_req, res) => {
  try {
    const list = await db.select().from(auditTasks).orderBy(desc(auditTasks.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve audit tasks' });
  }
});

apiRouter.post('/tasks', optionalAuth, async (req, res) => {
  try {
    const { task, category, priority, assignedTo, dueDate, entityId, notes } = req.body;
    const item = await db.insert(auditTasks).values({
      task,
      category,
      priority: priority || 'Medium',
      status: 'To Do',
      assignedTo: assignedTo || 'Compliance Specialist',
      createdDate: new Date().toISOString().split('T')[0],
      dueDate,
      entityId: entityId ? parseInt(entityId, 10) : null,
      notes,
    }).returning();

    res.status(201).json(item[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create audit task' });
  }
});

apiRouter.put('/tasks/:id', optionalAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, result, notes } = req.body;
    const updated = await db.update(auditTasks).set({
      status,
      result,
      notes,
    }).where(eq(auditTasks.id, id)).returning();

    res.json(updated[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update audit task' });
  }
});

// Duplicates & False Positives API
apiRouter.get('/duplicates', optionalAuth, async (_req, res) => {
  try {
    const list = await db.select().from(duplicatesControl).orderBy(desc(duplicatesControl.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve duplicate controls' });
  }
});

apiRouter.post('/duplicates', optionalAuth, async (req, res) => {
  try {
    const { recordTable, recordId, possibleDuplicateId, matchReason, decision, notes } = req.body;
    const item = await db.insert(duplicatesControl).values({
      recordTable,
      recordId,
      possibleDuplicateId,
      matchReason,
      decision: decision || 'Needs Review',
      reviewer: (req as AuthRequest).user?.email || 'Lead Auditor',
      reviewedAt: new Date(),
      notes,
    }).returning();

    res.status(201).json(item[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create duplicate control entry' });
  }
});

// Brand Assets API
apiRouter.get('/brand-assets', optionalAuth, async (_req, res) => {
  try {
    const list = await db.select().from(brandAssets).orderBy(desc(brandAssets.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve brand assets' });
  }
});

// SOP & Work Documents API
apiRouter.get('/sop', optionalAuth, async (_req, res) => {
  try {
    const list = await db.select().from(sopWorkDocuments).orderBy(desc(sopWorkDocuments.id));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve SOP documents' });
  }
});

// Change Log API
apiRouter.get('/change-log', optionalAuth, async (_req, res) => {
  try {
    const list = await db.select().from(changeLog).orderBy(desc(changeLog.changedAt)).limit(50);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve change log' });
  }
});
