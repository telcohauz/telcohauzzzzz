import React, { useState, useEffect } from 'react';
import {
  Building2,
  ShieldCheck,
  FileCheck2,
  Globe,
  Share2,
  Package,
  FileText,
  Clock,
  CheckSquare2,
  Users,
  MessageSquare,
  AlertTriangle,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Calendar,
  Sparkles,
  Search,
  CheckCircle2,
  Hash,
  Award
} from 'lucide-react';
import { VerificationBadge } from '../components/VerificationBadge.tsx';

interface Props {
  entityId: number;
  onBack: () => void;
  onInspectTrace: (item: any) => void;
}

export const EntityProfileView: React.FC<Props> = ({ entityId, onBack, onInspectTrace }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProfile();
  }, [entityId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/entities/${entityId}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        Compiling comprehensive forensic dossier for entity ID #{entityId}...
      </div>
    );
  }

  if (!profile || !profile.entity) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Entity not found.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-800 text-xs rounded-lg">Go Back</button>
      </div>
    );
  }

  const {
    entity,
    businesses = [],
    people = [],
    contacts = [],
    relationships = [],
    products = [],
    services = [],
    domains = [],
    socialAccounts = [],
    marketplaces = [],
    reviews = [],
    claims = [],
    evidence = [],
    timeline = [],
    brandAssets = [],
    documents = [],
    auditTasks = [],
    conflicts = [],
  } = profile;

  const tabs = [
    { id: 'overview', label: 'Identity & Business', count: undefined },
    { id: 'relationships', label: 'Relationships', count: relationships.length },
    { id: 'digital', label: 'Domains & Social', count: domains.length + socialAccounts.length },
    { id: 'products', label: 'Products & Services', count: products.length + services.length },
    { id: 'claims', label: 'Claims & Verification', count: claims.length },
    { id: 'evidence', label: 'Evidence & Documents', count: evidence.length + documents.length },
    { id: 'reviews', label: 'Reviews & Reputation', count: reviews.length },
    { id: 'timeline', label: 'Chronology', count: timeline.length },
    { id: 'tasks', label: 'Audit Tasks', count: auditTasks.length },
    { id: 'conflicts', label: 'Conflicts', count: conflicts.length },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Entities</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500">ID: {entity.entityId}</span>
          <VerificationBadge status={entity.verificationStatus} size="sm" />
        </div>
      </div>

      {/* Hero Dossier Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xl font-black border border-blue-400/30 shadow-lg shadow-blue-900/50 shrink-0">
              {entity.officialName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700 font-semibold">
                  {entity.entityType}
                </span>
                {entity.tradingName && entity.tradingName !== entity.officialName && (
                  <span className="text-xs text-slate-400 font-mono">
                    (Trading as: {entity.tradingName})
                  </span>
                )}
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">Confidence: <span className="text-emerald-400 font-semibold">{entity.confidence}</span></span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                {entity.officialName}
              </h1>
              {entity.description && (
                <p className="text-xs text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
                  {entity.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={() => onInspectTrace({
                recordName: entity.officialName,
                recordType: `Entity (${entity.entityType})`,
                claimText: `Authoritative identity record registered under ${entity.entityId}`,
                claimStatus: entity.verificationStatus,
                evidenceName: evidence[0]?.description || 'Statutory SSM Certificate Extract',
                evidenceHash: evidence[0]?.hashRef || 'sha256:verified_anchor_token',
                sourceName: 'SSM E-Info Portal / Official Registrar',
                sourceType: 'Official Registry',
                entityName: entity.officialName,
                entityType: entity.entityType,
              })}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-blue-900/40"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Inspect Provenance</span>
            </button>
          </div>
        </div>

        {/* Name Variations and Quick Meta Strip */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-mono text-[11px]">Known Name Variations:</span>
            {(entity.nameVariations ? entity.nameVariations.split(',') : [entity.officialName]).map((nv: string, i: number) => (
              <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono text-[11px]">
                {nv.trim()}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px] font-mono">
            <span>First Seen: <strong className="text-slate-200">{entity.firstSeenDate || 'N/A'}</strong></span>
            <span>Last Verified: <strong className="text-emerald-400">{entity.lastVerifiedDate || 'N/A'}</strong></span>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-medium transition flex items-center gap-2 shrink-0 ${
              activeTab === tab.id
                ? 'bg-slate-900 text-blue-400 border-t-2 border-blue-500 font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === tab.id ? 'bg-blue-950 text-blue-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Identity & Business Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statutory Business Registration */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                Statutory Business Registration (SSM / Regulatory)
              </h2>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-2 py-0.5 rounded">
                Verified Registry Anchor
              </span>
            </div>

            {businesses.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 font-mono">
                No direct corporate registration attached. This entity may be a brand umbrella or digital handle asset linked to a parent registered enterprise.
              </div>
            ) : (
              businesses.map((b: any) => (
                <div key={b.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Registration Number:</span>
                      <span className="font-mono font-bold text-white">{b.registrationNumber}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Jurisdiction:</span>
                      <span className="text-slate-200">{b.jurisdiction}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Incorporation Date:</span>
                      <span className="font-mono text-slate-200">{b.incorporationDate}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Tax Identification:</span>
                      <span className="font-mono text-slate-300">{b.taxId || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                    <div>
                      <span className="text-slate-400 text-[11px] block mb-0.5">Official Registered Office:</span>
                      <span className="text-slate-200 font-mono leading-relaxed">{b.registeredAddress || 'Not recorded'}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-slate-400 text-[11px] block mb-0.5">Operating / Retail Premise:</span>
                      <span className="text-slate-200 font-mono leading-relaxed">{b.operatingAddress || 'Same as registered'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* People & Parties + Verified Contacts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* People & Parties */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                Associated People & Parties
              </h2>

              <div className="space-y-2.5">
                {people.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 font-mono">
                    No individuals recorded directly under this record. Check linked parent enterprise.
                  </div>
                ) : (
                  people.map((p: any) => (
                    <div key={p.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{p.fullName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                          {p.roleTitle || 'Associate'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex flex-wrap gap-3 pt-1">
                        {p.icOrIdNumber && <span>ID: <strong className="text-slate-300 font-mono">{p.icOrIdNumber}</strong></span>}
                        {p.nationality && <span>Nationality: <strong className="text-slate-300">{p.nationality}</strong></span>}
                        {p.phone && <span>Phone: <strong className="text-slate-300 font-mono">{p.phone}</strong></span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Official Verified Contact Channels */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                Verified Contact Channels
              </h2>

              <div className="space-y-2.5">
                {contacts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500 font-mono">
                    No direct contact points catalogued.
                  </div>
                ) : (
                  contacts.map((c: any) => (
                    <div key={c.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">
                            {c.contactType}
                          </span>
                          {c.label && <span className="text-slate-400 text-[11px]">({c.label})</span>}
                        </div>
                        <div className="font-mono text-white font-medium">{c.contactValue}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {c.verified && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                            VERIFIED
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Relationships */}
      {activeTab === 'relationships' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-400" />
                Verified Relational Graph Links
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Strict Rule: Never infer a relationship merely because names are similar. All links require documented evidence.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {relationships.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-mono text-xs">
                No verified relationships recorded yet.
              </div>
            ) : (
              relationships.map((rel: any) => (
                <div
                  key={rel.id}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-400 text-[11px]">{rel.relationshipId}</span>
                      <span className="text-slate-600">•</span>
                      <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono font-semibold text-[10px] uppercase">
                        {rel.relationshipType}
                      </span>
                      <VerificationBadge status={rel.verificationStatus} size="sm" />
                    </div>
                    <div className="font-medium text-slate-200">
                      {rel.description || 'Verified cross-entity link.'}
                    </div>
                  </div>

                  <button
                    onClick={() => onInspectTrace({
                      recordName: `Relationship ${rel.relationshipId}`,
                      recordType: rel.relationshipType,
                      claimText: rel.description,
                      claimStatus: rel.verificationStatus,
                      evidenceName: 'Verified Relationship Schedule',
                      sourceName: 'Cross-Entity Audit Registry',
                      entityName: entity.officialName,
                      entityType: entity.entityType,
                    })}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono shrink-0 transition"
                  >
                    View Trace
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Digital Presence */}
      {activeTab === 'digital' && (
        <div className="space-y-6">
          {/* Domains */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              Domains & Websites
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {domains.map((dom: any) => (
                <div key={dom.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400 font-mono text-sm">{dom.domain}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono">
                      {dom.status}
                    </span>
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">{dom.websiteDescription}</div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Type: {dom.type}</span>
                    <a
                      href={dom.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      {dom.url} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Accounts */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-400" />
              Social Accounts & Impersonation Watch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {socialAccounts.map((soc: any) => (
                <div key={soc.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white font-mono">@{soc.username}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300">
                        {soc.platform}
                      </span>
                    </div>
                    <VerificationBadge status={soc.verificationStatus} size="sm" />
                  </div>
                  <div className="text-[11px] text-slate-300">{soc.contentDescription}</div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Followers: <strong className="text-slate-200">{soc.followers || 'N/A'}</strong></span>
                    <span className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded ${
                      soc.accountType === 'Official' ? 'text-emerald-400 bg-emerald-950/60' : 'text-orange-400 bg-orange-950/60'
                    }`}>
                      {soc.accountType}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Products & Services */}
      {activeTab === 'products' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              Catalogued Products & Certified Services
            </h2>
            <span className="text-[10px] font-mono text-slate-400">Preserves Historical Pricing</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p: any) => (
              <div key={p.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-amber-400 font-bold">{p.productId}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{p.category}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm line-clamp-2">{p.productName}</h3>
                  {p.description && (
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-3">{p.description}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold font-mono text-emerald-400">
                      {p.currency} {p.price}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{p.stockStatus}</span>
                  </div>
                  {p.notes && <div className="text-[10px] text-slate-500 font-mono">{p.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Claims & Verification */}
      {activeTab === 'claims' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              Attributed Claims Matrix
            </h2>
            <span className="text-[10px] font-mono text-slate-400">Separates Fact vs Allegation</span>
          </div>

          <div className="space-y-3">
            {claims.map((c: any) => (
              <div key={c.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-400">{c.claimId}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                      {c.claimType}
                    </span>
                  </div>
                  <VerificationBadge status={c.verificationStatus} size="sm" />
                </div>
                <div className="font-semibold text-slate-200 text-sm leading-relaxed">
                  "{c.claimText}"
                </div>
                {c.supportingEvidence && (
                  <div className="text-[11px] text-emerald-400/90 font-mono">
                    Supporting: {c.supportingEvidence}
                  </div>
                )}
                {c.contradictingEvidence && (
                  <div className="text-[11px] text-rose-400/90 font-mono">
                    Contradicting: {c.contradictingEvidence}
                  </div>
                )}
                {c.auditorNotes && (
                  <div className="p-2 rounded bg-slate-900 border border-slate-800/80 text-[11px] text-slate-400 font-mono">
                    Auditor Notes: {c.auditorNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Evidence & Documents */}
      {activeTab === 'evidence' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            Verified Evidence Vault & Documents
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidence.map((ev: any) => (
              <div key={ev.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-purple-400">{ev.evidenceId}</span>
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-mono">
                    {ev.evidenceType}
                  </span>
                </div>
                <div className="font-medium text-slate-200">{ev.description}</div>
                {ev.hashRef && (
                  <div className="font-mono text-[10px] text-slate-500 break-all">
                    Hash: {ev.hashRef}
                  </div>
                )}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Captured: {ev.captureDate}</span>
                  <span className="text-emerald-400 font-mono">Immutable</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Reviews */}
      {activeTab === 'reviews' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-400" />
            Public Customer Reviews & Auditor Classification
          </h2>

          <div className="space-y-3">
            {reviews.map((rev: any) => (
              <div key={rev.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{rev.reviewerIdentifier || 'Anonymous Reviewer'}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {rev.platform}
                    </span>
                  </div>
                  <span className="font-mono text-amber-400 font-bold">
                    {'★'.repeat(rev.rating)} ({rev.rating}/5)
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed">"{rev.reviewText}"</p>
                {rev.telcohauzResponse && (
                  <div className="p-2.5 rounded bg-blue-950/40 border border-blue-900/50 text-[11px] text-blue-200">
                    <span className="font-bold text-blue-300">TELCOHAUZ Official Response:</span> {rev.telcohauzResponse}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: Chronology */}
      {activeTab === 'timeline' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            Entity Chronology & Footprint Milestones
          </h2>

          <div className="space-y-3">
            {timeline.map((t: any) => (
              <div key={t.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="font-mono text-sky-400 font-bold mb-0.5">{t.date}</div>
                  <div className="font-bold text-white text-sm">{t.event}</div>
                  {t.description && <div className="text-slate-400 text-[11px] mt-1">{t.description}</div>}
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 shrink-0">
                  {t.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 9: Audit Tasks */}
      {activeTab === 'tasks' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckSquare2 className="w-4 h-4 text-indigo-400" />
            Audit Action Tasks for this Entity
          </h2>

          <div className="space-y-3">
            {auditTasks.map((task: any) => (
              <div key={task.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-white">{task.task}</div>
                  <div className="text-[11px] text-slate-400">
                    Category: {task.category} • Priority: <strong className="text-blue-400">{task.priority}</strong>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold ${
                  task.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 10: Conflicts */}
      {activeTab === 'conflicts' && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-orange-400" />
            Contradictory Information & Open Conflicts
          </h2>

          <div className="space-y-4">
            {conflicts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 font-mono">
                No active contradictory records identified for this entity.
              </div>
            ) : (
              conflicts.map((conf: any) => (
                <div key={conf.id} className="p-4 rounded-xl bg-slate-950/80 border border-orange-600/40 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-orange-400">{conf.conflictId}: {conf.subject}</span>
                    <span className="px-2 py-0.5 rounded bg-orange-950 text-orange-300 border border-orange-800 font-mono text-[10px]">
                      {conf.currentStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Source / Information A:</span>
                      <p className="text-slate-200">{conf.informationA}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Source / Information B:</span>
                      <p className="text-slate-200">{conf.informationB}</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-orange-950/30 border border-orange-900/40 text-[11px] text-orange-200">
                    <span className="font-semibold text-orange-300">Required Verification:</span> {conf.requiredVerification}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
