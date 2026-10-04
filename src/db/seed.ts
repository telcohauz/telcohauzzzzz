import { db } from './index.ts';
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
  sopWorkDocuments,
  duplicatesControl,
  users
} from './schema.ts';
import { eq } from 'drizzle-orm';

export async function seedDemoData() {
  try {
    const existingEntities = await db.select().from(entities).limit(1);
    if (existingEntities.length > 0) {
      console.log('Database already has records, skipping seed.');
      return;
    }

    console.log('Seeding initial canonical records into Cloud SQL...');

    // 0. Seed Lead Auditor / Owner User
    await db.insert(users).values({
      uid: 'auditor-lead-session',
      email: 'ashraffrahman3677@gmail.com',
      displayName: 'Ashraff Rahman',
      role: 'Principal Auditor & Owner',
    }).onConflictDoNothing();

    // 1. Seed Sources
    const src1 = await db.insert(sources).values({
      sourceId: 'SRC-001',
      url: 'https://ezbiz.ssm.com.my',
      sourceName: 'SSM E-Info Portal - Companies Commission of Malaysia',
      sourceType: 'Official Registry',
      primaryOrSecondary: 'Primary',
      platform: 'SSM Malaysia',
      publicationDate: '2021-04-12',
      accessDate: '2026-10-01',
      reliabilityNotes: 'Official statutory business registry with legally binding records.',
      relatedRecords: 'ENT-002, Telcohauz Phone Enterprise',
    }).returning();

    const src2 = await db.insert(sources).values({
      sourceId: 'SRC-002',
      url: 'https://whois.icann.org/lookup?q=telcohauz.com',
      sourceName: 'ICANN / Cloudflare WHOIS Registry for telcohauz.com',
      sourceType: 'Public Website',
      primaryOrSecondary: 'Primary',
      platform: 'WHOIS Database',
      publicationDate: '2021-08-15',
      accessDate: '2026-10-02',
      reliabilityNotes: 'Authoritative TLD registry record confirming domain registrar and nameservers.',
      relatedRecords: 'ENT-004, telcohauz.com',
    }).returning();

    const src3 = await db.insert(sources).values({
      sourceId: 'SRC-003',
      url: 'https://instagram.com/telcohauz',
      sourceName: 'Instagram Verified Public Handle Profile',
      sourceType: 'Social Media',
      primaryOrSecondary: 'Primary',
      platform: 'Instagram / Meta',
      publicationDate: '2021-09-01',
      accessDate: '2026-10-03',
      reliabilityNotes: 'Active verified business profile with 14.8k followers and WhatsApp routing.',
      relatedRecords: 'ENT-003, @telcohauz',
    }).returning();

    const src4 = await db.insert(sources).values({
      sourceId: 'SRC-004',
      url: 'https://shopee.com.my/telcohauz.os',
      sourceName: 'Shopee Preferred+ Merchant Profile',
      sourceType: 'Marketplace',
      primaryOrSecondary: 'Primary',
      platform: 'Shopee Malaysia',
      publicationDate: '2022-03-20',
      accessDate: '2026-10-02',
      reliabilityNotes: 'Official marketplace storefront with verified identity and 4.9 review rating.',
      relatedRecords: 'ENT-001, TELCOHAUZ Products',
    }).returning();

    // 2. Seed Evidence
    const evi1 = await db.insert(evidence).values({
      evidenceId: 'EVI-001',
      evidenceType: 'PDF Document',
      filePathOrUrl: 'https://storage.internal.telcohauz.audit/evidence/ssm_extract_ca0312984.pdf',
      description: 'SSM Official Business Registration Certificate Extract for Telcohauz Phone Enterprise',
      sourceId: src1[0].id,
      captureDate: '2026-10-01',
      sourceDate: '2021-04-12',
      hashRef: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      status: 'Active',
      notes: 'Contains registered entity number 202103019842 (CA0312984-X) and principal proprietor details.',
    }).returning();

    const evi2 = await db.insert(evidence).values({
      evidenceId: 'EVI-002',
      evidenceType: 'Web Archive',
      filePathOrUrl: 'https://storage.internal.telcohauz.audit/evidence/whois_telcohauz_com_snapshot.txt',
      description: 'WHOIS DNS Snapshot showing registrar Cloudflare, Inc. and creation date 2021-08-15',
      sourceId: src2[0].id,
      captureDate: '2026-10-02',
      sourceDate: '2021-08-15',
      hashRef: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      status: 'Active',
      notes: 'Domain is currently active and redirects to primary e-commerce portal.',
    }).returning();

    const evi3 = await db.insert(evidence).values({
      evidenceId: 'EVI-003',
      evidenceType: 'Screenshot',
      filePathOrUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
      description: 'High-resolution capture of Instagram Bio, contact action buttons and store location link',
      sourceId: src3[0].id,
      captureDate: '2026-10-03',
      sourceDate: '2026-10-03',
      hashRef: 'sha256:4a3b8c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4',
      status: 'Active',
      notes: 'Bio confirms official handle @telcohauz and physical branch at Plaza Digital Gadgets.',
    }).returning();

    // 3. Seed Entities (The 4 core identities)
    const ent1 = await db.insert(entities).values({
      entityId: 'ENT-001',
      officialName: 'TELCOHAUZ',
      tradingName: 'TELCOHAUZ',
      nameVariations: 'TELCO HAUZ, TelcoHauz, Telcohauz Mobile',
      entityType: 'Brand',
      status: 'Active',
      usernameHandle: 'telcohauz',
      description: 'Central consumer-facing brand and retail trade name specializing in mobile telecommunications, smartphone repairs, and certified pre-owned devices.',
      firstSeenDate: '2021-04-12',
      lastVerifiedDate: '2026-10-03',
      verificationStatus: 'DISAHKAN',
      confidence: 'Verified',
      notes: 'Core brand umbrella. Linked directly to legal enterprise Telcohauz Phone Enterprise.',
    }).returning();

    const ent2 = await db.insert(entities).values({
      entityId: 'ENT-002',
      officialName: 'Telcohauz Phone Enterprise',
      tradingName: 'Telcohauz Phone Enterprise',
      nameVariations: 'TELCOHAUZ PHONE ENTERPRISE, Telcohauz Phone Ent',
      entityType: 'Business',
      status: 'Active',
      usernameHandle: 'telcohauz_phone',
      description: 'Registered commercial sole proprietorship entity under Companies Commission of Malaysia (SSM). Operates retail and repair facilities.',
      firstSeenDate: '2021-04-12',
      lastVerifiedDate: '2026-10-01',
      verificationStatus: 'DISAHKAN',
      confidence: 'Verified',
      notes: 'Legal business registrant holding tax and statutory identification.',
    }).returning();

    const ent3 = await db.insert(entities).values({
      entityId: 'ENT-003',
      officialName: 'telcohauz',
      tradingName: '@telcohauz',
      nameVariations: 'telcohauz.official, telcohauz_hq',
      entityType: 'Digital Asset',
      status: 'Active',
      usernameHandle: 'telcohauz',
      description: 'Unified social handle across Instagram, Facebook, TikTok, and messaging channels.',
      firstSeenDate: '2021-09-01',
      lastVerifiedDate: '2026-10-03',
      verificationStatus: 'DISAHKAN',
      confidence: 'Verified',
      notes: 'Verified social presence. Do not treat as distinct legal entity.',
    }).returning();

    const ent4 = await db.insert(entities).values({
      entityId: 'ENT-004',
      officialName: 'telcohauz.com',
      tradingName: 'telcohauz.com',
      nameVariations: 'www.telcohauz.com, shop.telcohauz.com',
      entityType: 'Digital Asset',
      status: 'Active',
      usernameHandle: 'telcohauz.com',
      description: 'Primary web property and digital storefront resolving to official e-commerce catalogue.',
      firstSeenDate: '2021-08-15',
      lastVerifiedDate: '2026-10-02',
      verificationStatus: 'DISAHKAN',
      confidence: 'Verified',
      notes: 'Domain infrastructure asset. Relational link established to ENT-001 (TELCOHAUZ).',
    }).returning();

    await db.update(evidence).set({ entityId: ent2[0].id }).where(eq(evidence.id, evi1[0].id));
    await db.update(evidence).set({ entityId: ent4[0].id }).where(eq(evidence.id, evi2[0].id));
    await db.update(evidence).set({ entityId: ent3[0].id }).where(eq(evidence.id, evi3[0].id));

    // 4. Seed Business Details for ENT-002
    await db.insert(businesses).values({
      entityId: ent2[0].id,
      registrationNumber: '202103019842 (CA0312984-X)',
      jurisdiction: 'Malaysia (SSM)',
      registeredAddress: 'No. 14-A, Jalan Niaga 2, Pusat Perdagangan, 43000 Kajang, Selangor',
      operatingAddress: 'Lot G-22, Ground Floor, Plaza Digital Gadgets, Jalan Tuanku Abdul Rahman, 50100 Kuala Lumpur',
      incorporationDate: '2021-04-12',
      taxId: 'W10-2104-32009182',
      status: 'Active',
      notes: 'Active status verified via SSM EzBiz portal extract.',
    });

    // 5. Seed People & Parties
    await db.insert(peopleParties).values([
      {
        entityId: ent2[0].id,
        fullName: 'Ashraff Rahman',
        icOrIdNumber: '920814-10-XXXX',
        roleTitle: 'Proprietor & Managing Director',
        nationality: 'Malaysian',
        phone: '+60 12-389 4412',
        email: 'ashraffrahman3677@gmail.com',
        address: 'Kuala Lumpur / Kajang, Selangor',
        linkedinUrl: 'https://linkedin.com/company/telcohauz',
        notes: 'Principal owner and director of Telcohauz Phone Enterprise.',
      },
      {
        entityId: ent1[0].id,
        fullName: 'Sarah Wong Min Hui',
        roleTitle: 'Lead Hardware Technician & Warranty Specialist',
        nationality: 'Malaysian',
        phone: '+60 11-2345 6789',
        email: 'sarah.w@telcohauz.com',
        notes: 'Key person responsible for quality checks and diagnostics.',
      }
    ]);

    // 6. Seed Relational Links
    await db.insert(relationships).values([
      {
        relationshipId: 'REL-001',
        entityAId: ent2[0].id,
        entityBId: ent1[0].id,
        relationshipType: 'Brand',
        description: 'Telcohauz Phone Enterprise operates and owns the commercial brand trade name TELCOHAUZ.',
        startDate: '2021-04-12',
        sourceId: src1[0].id,
        evidenceId: evi1[0].id,
        verificationStatus: 'DISAHKAN',
        confidence: 'Verified',
        notes: 'Documented via SSM trade name schedule.',
      },
      {
        relationshipId: 'REL-002',
        entityAId: ent1[0].id,
        entityBId: ent4[0].id,
        relationshipType: 'Website',
        description: 'telcohauz.com is the primary authorized domain and web portal for the TELCOHAUZ brand.',
        startDate: '2021-08-15',
        sourceId: src2[0].id,
        evidenceId: evi2[0].id,
        verificationStatus: 'DISAHKAN',
        confidence: 'Verified',
      },
      {
        relationshipId: 'REL-003',
        entityAId: ent1[0].id,
        entityBId: ent3[0].id,
        relationshipType: 'Social Account',
        description: '@telcohauz is the official verified social identifier for brand outreach.',
        startDate: '2021-09-01',
        sourceId: src3[0].id,
        evidenceId: evi3[0].id,
        verificationStatus: 'DISAHKAN',
        confidence: 'Verified',
      }
    ]);

    // 7. Seed Contacts
    await db.insert(contacts).values([
      {
        entityId: ent1[0].id,
        contactType: 'WhatsApp',
        contactValue: '+60 11-2345 6789',
        label: 'Official Customer Support & Booking',
        isPrimary: true,
        verified: true,
        firstSeen: '2021-09-01',
        lastChecked: '2026-10-03',
        sourceId: src3[0].id,
        evidenceId: evi3[0].id,
        notes: 'Verified via direct WhatsApp Business API verification check.',
      },
      {
        entityId: ent1[0].id,
        contactType: 'Email',
        contactValue: 'support@telcohauz.com',
        label: 'Corporate & Support Inquiries',
        isPrimary: true,
        verified: true,
        firstSeen: '2021-08-20',
        lastChecked: '2026-10-02',
        notes: 'Active MX record on telcohauz.com.',
      },
      {
        entityId: ent2[0].id,
        contactType: 'Address',
        contactValue: 'Lot G-22, Ground Floor, Plaza Digital Gadgets, Jalan Tuanku Abdul Rahman, 50100 Kuala Lumpur',
        label: 'Retail Storefront & Walk-in Repair Lab',
        isPrimary: true,
        verified: true,
        firstSeen: '2021-11-01',
        lastChecked: '2026-10-03',
        notes: 'Physical storefront verified with signage and operating hours.',
      }
    ]);

    // 8. Seed Products
    await db.insert(products).values([
      {
        productId: 'PRD-001',
        productName: 'Authentic Grade-A OLED Display Assembly (iPhone 14 / 14 Pro)',
        brand: 'TELCOHAUZ Certified',
        model: 'TH-SCR-14PRO',
        category: 'Repairs',
        sku: 'TH-SCR-0014P',
        price: '489.00',
        currency: 'MYR',
        stockStatus: 'In Stock',
        productStatus: 'Active',
        description: 'Original refurbished OEM spec OLED replacement with TrueTone reprogramming service and 90-day warranty.',
        platform: 'Physical Store & Shopee',
        entityId: ent1[0].id,
        firstSeen: '2023-01-10',
        lastSeen: '2026-10-03',
        sourceId: src4[0].id,
        verificationStatus: 'DISAHKAN',
        notes: 'Price historically adjusted from MYR 599 in 2023 to MYR 489 in 2026.',
      },
      {
        productId: 'PRD-002',
        productName: 'Certified Pre-Owned iPhone 13 128GB Midnight (Battery Health 92%+)',
        brand: 'Apple / TELCOHAUZ Inspected',
        model: 'A2633',
        category: 'Smartphones',
        sku: 'TH-CPO-IP13-128',
        price: '1699.00',
        currency: 'MYR',
        stockStatus: 'In Stock',
        productStatus: 'Active',
        description: '30-point diagnostic passed device, full box with TELCOHAUZ warranty seal and complimentary screen protector.',
        platform: 'Shopee & TikTok Shop',
        entityId: ent1[0].id,
        firstSeen: '2022-10-15',
        lastSeen: '2026-10-02',
        sourceId: src4[0].id,
        verificationStatus: 'DISAHKAN',
        notes: 'Verified via Shopee store SKU listing.',
      },
      {
        productId: 'PRD-003',
        productName: '65W GaN Dual USB-C Fast Charger Travel Kit',
        brand: 'TELCOHAUZ Gear',
        model: 'TH-GAN65',
        category: 'Accessories',
        sku: 'TH-ACC-GAN65',
        price: '79.00',
        currency: 'MYR',
        stockStatus: 'In Stock',
        productStatus: 'Active',
        description: 'Compact Gallium Nitride wall charger with braided 100W PD nylon cable.',
        platform: 'telcohauz.com Store',
        entityId: ent1[0].id,
        firstSeen: '2024-02-01',
        lastSeen: '2026-10-03',
        verificationStatus: 'DISAHKAN',
      }
    ]);

    // 9. Seed Services
    await db.insert(services).values([
      {
        entityId: ent1[0].id,
        serviceName: 'Express 30-Minute Face-to-Face Screen & Battery Repair',
        category: 'Hardware Repair',
        description: 'On-the-spot mobile phone servicing with dust-free benchwork and customer observation counter.',
        pricingModel: 'Fixed Quote + Part Cost',
        status: 'Active',
        notes: 'Available at KL retail branch.',
      },
      {
        entityId: ent1[0].id,
        serviceName: 'Authorized 5G Mobile Plan Registration & MNP Port-In',
        category: 'Telco Agency',
        description: 'New line activation and cross-carrier number porting service.',
        pricingModel: 'Free Activation with Plan Subscription',
        status: 'Active',
      }
    ]);

    // 10. Seed Domains & Websites
    await db.insert(domainsWebsites).values([
      {
        domain: 'telcohauz.com',
        subdomain: '@',
        url: 'https://telcohauz.com',
        type: 'Main Portal',
        status: 'Live',
        entityId: ent4[0].id,
        firstSeen: '2021-08-15',
        lastChecked: '2026-10-02',
        websiteDescription: 'Official landing page highlighting device trade-in, repair pricing, and walk-in counter directions.',
        about: 'TELCOHAUZ is a premier Malaysian gadget hub dedicated to authentic mobile repairs and certified hardware.',
        contact: 'support@telcohauz.com / +6011-2345 6789',
        sourceId: src2[0].id,
        verificationStatus: 'DISAHKAN',
      },
      {
        domain: 'telcohauz.com',
        subdomain: 'shop',
        url: 'https://shop.telcohauz.com',
        type: 'E-Commerce',
        status: 'Live',
        entityId: ent4[0].id,
        firstSeen: '2022-05-10',
        lastChecked: '2026-10-02',
        websiteDescription: 'Shopify-powered storefront hosting accessory catalog and booking calendar.',
        verificationStatus: 'DISAHKAN',
      }
    ]);

    // 11. Seed Social Accounts
    await db.insert(socialAccounts).values([
      {
        platform: 'Instagram',
        username: 'telcohauz',
        displayName: 'TELCOHAUZ | Gadget & Repair Specialist',
        url: 'https://instagram.com/telcohauz',
        accountType: 'Official',
        entityId: ent3[0].id,
        followers: '14,800',
        firstSeen: '2021-09-01',
        lastObservedActivity: '2026-10-02',
        contentDescription: 'Daily hardware repair timelapse reels, device tips, and customer collection photos.',
        verificationStatus: 'DISAHKAN',
        sourceId: src3[0].id,
        evidenceId: evi3[0].id,
      },
      {
        platform: 'TikTok',
        username: 'telcohauz',
        displayName: 'TELCOHAUZ Gadgets',
        url: 'https://tiktok.com/@telcohauz',
        accountType: 'Official',
        entityId: ent3[0].id,
        followers: '32,500',
        firstSeen: '2022-04-10',
        lastObservedActivity: '2026-10-01',
        contentDescription: 'Live smartphone unboxings, repair mythbusting, and TikTok Shop flash sales.',
        verificationStatus: 'DISAHKAN',
      },
      {
        platform: 'Facebook',
        username: 'telcohauz',
        displayName: 'TELCOHAUZ Malaysia',
        url: 'https://facebook.com/telcohauz',
        accountType: 'Official',
        entityId: ent3[0].id,
        followers: '8,200',
        firstSeen: '2021-09-15',
        lastObservedActivity: '2026-09-28',
        contentDescription: 'Announcements, operating holiday notices, and community comments.',
        verificationStatus: 'DISAHKAN',
      },
      {
        platform: 'Facebook',
        username: 'telcohauz.promodeals',
        displayName: 'Telcohauz Promo Deals',
        url: 'https://facebook.com/telcohauz.promodeals',
        accountType: 'Impersonation',
        entityId: ent3[0].id,
        followers: '340',
        firstSeen: '2026-07-12',
        lastObservedActivity: '2026-08-30',
        contentDescription: 'Advertises heavily discounted iPhone 15s with personal Maybank transfer request.',
        verificationStatus: 'BERCANGGAH',
        notes: 'Suspected unauthorized impersonator/scam page. Under active investigation.',
      }
    ]);

    // 12. Seed Marketplaces
    await db.insert(marketplaces).values([
      {
        platformName: 'Shopee',
        storeName: 'telcohauz.os',
        storeUrl: 'https://shopee.com.my/telcohauz.os',
        entityId: ent1[0].id,
        sellerId: '9841203',
        rating: '4.9 / 5.0 (2,410 ratings)',
        productsCount: '142',
        firstSeen: '2022-03-20',
        lastChecked: '2026-10-02',
        verificationStatus: 'DISAHKAN',
        notes: 'Shopee Preferred+ badge active.',
      }
    ]);

    // 13. Seed Reviews
    await db.insert(reviews).values([
      {
        platform: 'Google Reviews',
        reviewerIdentifier: 'Ahmad Faiz (Local Guide Level 5)',
        rating: 5,
        date: '2026-09-14',
        reviewText: 'Repaired my iPhone 14 Pro Max screen here. Fast turnaround in 25 minutes, honest technician showed me the genuine display code, and gave a 90-day warranty card.',
        sentiment: 'Positive',
        issue: 'Screen Replacement',
        telcohauzResponse: 'Thank you Ahmad! Glad we could restore your display swiftly.',
        url: 'https://maps.google.com/?cid=demo_telcohauz_kl',
        verificationStatus: 'DISAHKAN',
        entityId: ent1[0].id,
      },
      {
        platform: 'Shopee',
        reviewerIdentifier: 'm***9',
        rating: 5,
        date: '2026-09-28',
        reviewText: 'Ordered the 65W GaN charger. Super fast 24h delivery and authentic packaging. Powers my laptop and phone without overheating.',
        sentiment: 'Positive',
        issue: 'Product Quality',
        url: 'https://shopee.com.my/telcohauz.os',
        verificationStatus: 'DISAHKAN',
        entityId: ent1[0].id,
      },
      {
        platform: 'Google Reviews',
        reviewerIdentifier: 'Kenneth Tan',
        rating: 3,
        date: '2026-08-05',
        reviewText: 'The repair quality itself is solid, but waited around 20 minutes before a technician attended to my queue during lunch hour.',
        sentiment: 'Mixed',
        issue: 'Peak Hour Queue Delay',
        telcohauzResponse: 'Apologies for the lunch-hour delay Kenneth! We have added an extra diagnostics desk from 12:00 PM to 2:30 PM to reduce wait times.',
        verificationStatus: 'DISAHKAN',
        entityId: ent1[0].id,
      }
    ]);

    // 14. Seed Claims
    await db.insert(claims).values([
      {
        claimId: 'CLM-001',
        claimText: 'TELCOHAUZ is an active registered telecommunications and mobile retail business in Malaysia.',
        claimType: 'Fact',
        entityId: ent1[0].id,
        sourceId: src1[0].id,
        supportingEvidence: 'EVI-001 (SSM Official Certificate Extract 202103019842)',
        verificationStatus: 'DISAHKAN',
        confidence: 'Verified',
        firstSeen: '2021-04-12',
        lastChecked: '2026-10-01',
        auditorNotes: 'Verified via statutory SSM registry database check.',
      },
      {
        claimId: 'CLM-002',
        claimText: 'The web domain telcohauz.com belongs exclusively to Telcohauz Phone Enterprise and represents its official digital hub.',
        claimType: 'Fact',
        entityId: ent4[0].id,
        sourceId: src2[0].id,
        supportingEvidence: 'EVI-002 (WHOIS verification and DNS records matching official host)',
        verificationStatus: 'DISAHKAN',
        confidence: 'Verified',
        firstSeen: '2021-08-15',
        lastChecked: '2026-10-02',
      },
      {
        claimId: 'CLM-003',
        claimText: 'The Facebook page "Telcohauz Promo Deals" claims to be an authorized clearance outlet offering 70% discounted devices.',
        claimType: 'Claim',
        entityId: ent3[0].id,
        contradictingEvidence: 'Official TELCOHAUZ statement disavowing unauthorized bank transfers and unverified external pages.',
        verificationStatus: 'BERCANGGAH',
        confidence: 'Low',
        firstSeen: '2026-07-12',
        lastChecked: '2026-10-01',
        auditorNotes: 'High risk of impersonation. Registered phone number and bank account differ from official entity.',
      }
    ]);

    // 15. Seed Conflicts
    await db.insert(conflicts).values([
      {
        conflictId: 'CONF-001',
        subject: 'Registered Statutory Address vs Operating Retail Facility Address',
        informationA: 'Statutory address on SSM file: No. 14-A, Jalan Niaga 2, Pusat Perdagangan, 43000 Kajang, Selangor (Registered 2021)',
        sourceAId: src1[0].id,
        informationB: 'Current physical store and Google Maps listing: Lot G-22, Plaza Digital Gadgets, Jalan TAR, 50100 Kuala Lumpur (Active 2024-2026)',
        sourceBId: src3[0].id,
        conflictType: 'Address Discrepancy',
        currentStatus: 'Under Investigation',
        requiredVerification: 'Verify whether Kajang address is retained as registered corporate office or if SSM Form 13/24 branch amendment is pending.',
        entityId: ent2[0].id,
        notes: 'Common enterprise structure where registered office differs from retail trading premise.',
      }
    ]);

    // 16. Seed Timeline
    await db.insert(timeline).values([
      {
        date: '2021-04-12',
        event: 'Statutory Business Registration',
        category: 'Business started',
        description: 'Telcohauz Phone Enterprise officially incorporated under Registration 202103019842 (CA0312984-X) with SSM Malaysia.',
        entityId: ent2[0].id,
        sourceId: src1[0].id,
        evidenceId: evi1[0].id,
        confidence: 'High',
      },
      {
        date: '2021-08-15',
        event: 'telcohauz.com Domain Acquisition',
        category: 'Website appeared',
        description: 'telcohauz.com top-level domain registered through Cloudflare Registrar.',
        entityId: ent4[0].id,
        sourceId: src2[0].id,
        evidenceId: evi2[0].id,
        confidence: 'High',
      },
      {
        date: '2021-09-01',
        event: 'Official Instagram Profile Launch',
        category: 'Social account created',
        description: 'Instagram handle @telcohauz created and verified for retail outreach.',
        entityId: ent3[0].id,
        sourceId: src3[0].id,
        evidenceId: evi3[0].id,
        confidence: 'High',
      },
      {
        date: '2021-11-01',
        event: 'Flagship Retail Walk-in Counter Opened',
        category: 'Address changed',
        description: 'Retail facility launched at Lot G-22, Plaza Digital Gadgets, Kuala Lumpur.',
        entityId: ent1[0].id,
        confidence: 'High',
      },
      {
        date: '2022-03-20',
        event: 'Shopee Preferred Merchant Status',
        category: 'New marketplace account',
        description: 'Onboarded on Shopee Malaysia e-commerce marketplace.',
        entityId: ent1[0].id,
        sourceId: src4[0].id,
        confidence: 'High',
      },
      {
        date: '2025-01-10',
        event: 'Trademark Filing for Stylized Wordmark',
        category: 'Rebranding',
        description: 'MyIPO trademark application lodged for Class 9 & Class 37 under TELCOHAUZ.',
        entityId: ent1[0].id,
        confidence: 'Medium',
      }
    ]);

    // 17. Seed Audit Tasks
    await db.insert(auditTasks).values([
      {
        task: 'Verify SSM 2026/2027 Annual Renewal & Branch Update Form',
        category: 'SSM Check',
        priority: 'High',
        status: 'Waiting Verification',
        assignedTo: 'Ashraff Rahman',
        createdDate: '2026-10-01',
        dueDate: '2026-10-15',
        entityId: ent2[0].id,
        notes: 'Confirm if KL Plaza Digital Gadgets address has been filed as official branch premise.',
      },
      {
        task: 'File Meta Trademark Infringement Report on Impersonator Page',
        category: 'Social Audit',
        priority: 'Urgent',
        status: 'Researching',
        assignedTo: 'Compliance Specialist',
        createdDate: '2026-10-02',
        dueDate: '2026-10-05',
        entityId: ent3[0].id,
        notes: 'Compile scam report against fb.com/telcohauz.promodeals to protect brand reputation.',
      },
      {
        task: 'Quarterly DNSSEC & SSL Renewal Audit on telcohauz.com',
        category: 'Domain Verification',
        priority: 'Low',
        status: 'Completed',
        assignedTo: 'Web Infrastructure Lead',
        createdDate: '2026-09-20',
        dueDate: '2026-10-01',
        entityId: ent4[0].id,
        result: 'DNSSEC enabled, Cloudflare Universal SSL active until 2027.',
      }
    ]);

    // 18. Seed Brand Assets
    await db.insert(brandAssets).values([
      {
        assetName: 'Primary Vector Wordmark - TELCOHAUZ (Cobalt & Navy)',
        assetType: 'Logo',
        dimensions: '1920x640',
        colorCodes: '#0052CC (Electric Cobalt), #0A192F (Navy Dark), #FFFFFF (Clean White)',
        trademarkNumber: 'TM2025000841 (MyIPO Pending)',
        registrationStatus: 'Pending',
        entityId: ent1[0].id,
        firstSeen: '2021-04-12',
        notes: 'Used on physical acrylic store signage and official warranty stamps.',
      }
    ]);

    // 19. Seed SOP Document
    await db.insert(sopWorkDocuments).values([
      {
        title: 'SOP-01: Digital Footprint Discovery & OSINT Traceability Protocol',
        category: 'Investigation SOP',
        version: 'v2.1',
        status: 'Approved',
        author: 'Audit Directorate',
        contentSummary: 'Mandatory methodology for capturing digital evidence: RECORD -> CLAIM -> EVIDENCE -> SOURCE -> ENTITY. Unverified claims must never be presented as facts.',
        lastReviewed: '2026-10-01',
        tags: 'evidence, osint, verification, compliance',
      }
    ]);

    // 20. Seed Duplicates Control
    await db.insert(duplicatesControl).values([
      {
        recordTable: 'entities',
        recordId: 'ENT-003 (@telcohauz)',
        possibleDuplicateId: 'ENT-001 (TELCOHAUZ)',
        matchReason: 'Identical alphanumeric stem "telcohauz"',
        decision: 'Keep Separate',
        reviewer: 'Ashraff Rahman',
        notes: 'Correct distinction preserved: ENT-001 represents the Brand identity; ENT-003 represents the specific Social Handle Asset. Connected via REL-003.',
      }
    ]);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Failed to seed records:', error);
  }
}
