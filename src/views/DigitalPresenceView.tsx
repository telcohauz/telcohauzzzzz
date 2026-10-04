import React, { useState, useEffect } from 'react';
import { Globe2, Users, ShoppingBag, Plus, Search, ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';
import { DomainWebsite, SocialAccount, Marketplace } from '../types/index.ts';
import { VerificationBadge } from '../components/VerificationBadge.tsx';

interface Props {
  onRefreshStats: () => void;
  onInspectTrace: (item: any) => void;
}

export const DigitalPresenceView: React.FC<Props> = ({ onRefreshStats, onInspectTrace }) => {
  const [subTab, setSubTab] = useState<'domains' | 'social' | 'marketplaces'>('domains');
  const [domainsList, setDomainsList] = useState<DomainWebsite[]>([]);
  const [socialList, setSocialList] = useState<SocialAccount[]>([]);
  const [marketplacesList, setMarketplacesList] = useState<Marketplace[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add Domain Modal
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [domDomain, setDomDomain] = useState('');
  const [domSubdomain, setDomSubdomain] = useState('@');
  const [domUrl, setDomUrl] = useState('');
  const [domType, setDomType] = useState('Main Portal');
  const [domDesc, setDomDesc] = useState('');

  // Add Social Modal
  const [showAddSocial, setShowAddSocial] = useState(false);
  const [socPlatform, setSocPlatform] = useState('Instagram');
  const [socUsername, setSocUsername] = useState('');
  const [socDisplayName, setSocDisplayName] = useState('');
  const [socUrl, setSocUrl] = useState('');
  const [socType, setSocType] = useState<'Official' | 'Related' | 'Unverified' | 'Impersonation' | 'Inactive' | 'False Positive'>('Official');
  const [socFollowers, setSocFollowers] = useState('');
  const [socDesc, setSocDesc] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [domRes, socRes, mktRes] = await Promise.all([
        fetch('/api/domains'),
        fetch('/api/social'),
        fetch('/api/marketplaces'),
      ]);
      if (domRes.ok && socRes.ok && mktRes.ok) {
        setDomainsList(await domRes.json());
        setSocialList(await socRes.json());
        setMarketplacesList(await mktRes.json());
      }
    } catch (err) {
      console.error('Failed to load digital presence:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domDomain.trim() || !domUrl.trim()) return;
    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: domDomain,
          subdomain: domSubdomain,
          url: domUrl,
          type: domType,
          websiteDescription: domDesc,
        }),
      });
      if (res.ok) {
        setShowAddDomain(false);
        setDomDomain('');
        setDomUrl('');
        setDomDesc('');
        await fetchData();
        onRefreshStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socUsername.trim() || !socUrl.trim()) return;
    try {
      const res = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: socPlatform,
          username: socUsername,
          displayName: socDisplayName,
          url: socUrl,
          accountType: socType,
          followers: socFollowers,
          contentDescription: socDesc,
        }),
      });
      if (res.ok) {
        setShowAddSocial(false);
        setSocUsername('');
        setSocDisplayName('');
        setSocUrl('');
        setSocDesc('');
        await fetchData();
        onRefreshStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-cyan-400" />
            Digital Presence & Online Footprint Audit
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitors official properties, authorized sales channels, and flags unverified impersonators or fraudulent accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'domains' && (
            <button
              onClick={() => setShowAddDomain(true)}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-cyan-900/40"
            >
              <Plus className="w-4 h-4" />
              <span>Track Domain</span>
            </button>
          )}
          {subTab === 'social' && (
            <button
              onClick={() => setShowAddSocial(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-purple-900/40"
            >
              <Plus className="w-4 h-4" />
              <span>Track Social Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('domains')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              subTab === 'domains'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Globe2 className="w-4 h-4" />
            <span>Domains & Websites ({domainsList.length})</span>
          </button>
          <button
            onClick={() => setSubTab('social')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              subTab === 'social'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Social Accounts ({socialList.length})</span>
          </button>
          <button
            onClick={() => setSubTab('marketplaces')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
              subTab === 'marketplaces'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Marketplaces ({marketplacesList.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Filter ${subTab}...`}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500 font-sans"
          />
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          Scanning digital presence network...
        </div>
      ) : subTab === 'domains' ? (
        /* Domains List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {domainsList.map((dom) => (
            <div
              key={dom.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3 text-xs"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                  <span className="font-mono text-cyan-400 font-bold text-sm">{dom.domain}</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-semibold border border-cyan-800">
                    {dom.status}
                  </span>
                </div>
                {dom.subdomain && dom.subdomain !== '@' && (
                  <div className="text-[11px] text-slate-400 font-mono mb-1">
                    Subdomain: <strong className="text-slate-200">{dom.subdomain}.{dom.domain}</strong>
                  </div>
                )}
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {dom.websiteDescription || 'Direct brand web destination.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Type: <strong className="text-slate-200">{dom.type}</strong></span>
                  <span>Last Checked: {dom.lastChecked || 'Recent'}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <a
                    href={dom.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    {dom.url} <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => onInspectTrace({
                      recordName: `Domain: ${dom.domain}`,
                      recordType: `Web Domain (${dom.type})`,
                      claimText: `Authoritative web presence for ${dom.domain}`,
                      claimStatus: 'DISAHKAN',
                      evidenceName: 'WHOIS Record & Cloudflare DNS Verification',
                      sourceName: 'WHOIS / ICANN Registry',
                      entityName: 'telcohauz.com',
                      entityType: 'Digital Asset',
                    })}
                    className="text-slate-400 hover:text-white font-mono text-[11px]"
                  >
                    Inspect Provenance
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : subTab === 'social' ? (
        /* Social Accounts List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialList.map((soc) => (
            <div
              key={soc.id}
              className={`p-5 rounded-2xl bg-slate-900/80 border ${
                soc.accountType === 'Impersonation' || soc.verificationStatus === 'BERCANGGAH'
                  ? 'border-orange-500/50 shadow-orange-950/40'
                  : 'border-slate-800'
              } hover:border-slate-700 transition flex flex-col justify-between space-y-3 text-xs`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-mono text-sm">@{soc.username}</span>
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-semibold border border-purple-800">
                      {soc.platform}
                    </span>
                  </div>
                  <VerificationBadge status={soc.verificationStatus} size="sm" />
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  Display: <strong className="text-slate-200">{soc.displayName || soc.username}</strong>
                </div>

                {soc.contentDescription && (
                  <p className="text-slate-300 text-[11px] mt-1.5 leading-relaxed">
                    {soc.contentDescription}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Followers: <strong className="text-slate-200">{soc.followers || 'N/A'}</strong></span>
                  <span className={`px-2 py-0.5 rounded font-semibold text-[10px] uppercase ${
                    soc.accountType === 'Official'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : soc.accountType === 'Impersonation'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {soc.accountType}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <a
                    href={soc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                  >
                    {soc.url} <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => onInspectTrace({
                      recordName: `Social Account: @${soc.username}`,
                      recordType: `Social Channel (${soc.platform})`,
                      claimText: `Classification: ${soc.accountType}`,
                      claimStatus: soc.verificationStatus,
                      evidenceName: 'Profile Screenshot & Bio Verification Snapshot',
                      sourceName: `${soc.platform} Public Directory`,
                      entityName: 'telcohauz',
                      entityType: 'Digital Asset',
                    })}
                    className="text-slate-400 hover:text-white font-mono text-[11px]"
                  >
                    Trace Evidence
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Marketplaces List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marketplacesList.map((mkt) => (
            <div
              key={mkt.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3 text-xs"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                  <span className="font-bold text-blue-400 font-mono text-sm">{mkt.storeName}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-semibold border border-blue-800">
                    {mkt.platformName}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div>Rating: <strong className="text-amber-400 font-mono">{mkt.rating || 'Verified'}</strong></div>
                  <div>Listed Items: <strong className="text-white font-mono">{mkt.productsCount || 'Catalog active'}</strong></div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <a
                  href={mkt.storeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  {mkt.storeUrl} <ExternalLink className="w-3 h-3" />
                </a>
                <VerificationBadge status={mkt.verificationStatus} size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Domain Modal */}
      {showAddDomain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-200">
            <h2 className="text-lg font-bold text-white mb-1">Track Domain Asset</h2>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              DNS / WHOIS evidence should corroborate record.
            </p>

            <form onSubmit={handleAddDomainSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Domain Name *</label>
                  <input
                    type="text"
                    required
                    value={domDomain}
                    onChange={(e) => setDomDomain(e.target.value)}
                    placeholder="telcohauz.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Subdomain</label>
                  <input
                    type="text"
                    value={domSubdomain}
                    onChange={(e) => setDomSubdomain(e.target.value)}
                    placeholder="@ or shop"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Full URL *</label>
                <input
                  type="text"
                  required
                  value={domUrl}
                  onChange={(e) => setDomUrl(e.target.value)}
                  placeholder="https://telcohauz.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Portal Type</label>
                <select
                  value={domType}
                  onChange={(e) => setDomType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                >
                  <option value="Main Portal">Main Portal</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Landing Page">Landing Page</option>
                  <option value="Redirect">Redirect</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={domDesc}
                  onChange={(e) => setDomDesc(e.target.value)}
                  placeholder="Content summary..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddDomain(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Save Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Social Modal */}
      {showAddSocial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-200">
            <h2 className="text-lg font-bold text-white mb-1">Track Social Identifier</h2>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Classifies handles into Official, Related, Impersonation, or Inactive.
            </p>

            <form onSubmit={handleAddSocialSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Platform</label>
                  <select
                    value={socPlatform}
                    onChange={(e) => setSocPlatform(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Facebook">Facebook</option>
                    <option value="WhatsApp Business">WhatsApp Business</option>
                    <option value="YouTube">YouTube</option>
                    <option value="X">X (Twitter)</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Google Business Profile">Google Business Profile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Account Classification</label>
                  <select
                    value={socType}
                    onChange={(e) => setSocType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                  >
                    <option value="Official">Official</option>
                    <option value="Related">Related</option>
                    <option value="Unverified">Unverified</option>
                    <option value="Impersonation">Impersonation / Scam Risk</option>
                    <option value="Inactive">Inactive</option>
                    <option value="False Positive">False Positive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Username (@handle) *</label>
                  <input
                    type="text"
                    required
                    value={socUsername}
                    onChange={(e) => setSocUsername(e.target.value)}
                    placeholder="telcohauz"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Follower Count</label>
                  <input
                    type="text"
                    value={socFollowers}
                    onChange={(e) => setSocFollowers(e.target.value)}
                    placeholder="e.g. 14,800"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">URL *</label>
                <input
                  type="text"
                  required
                  value={socUrl}
                  onChange={(e) => setSocUrl(e.target.value)}
                  placeholder="https://instagram.com/telcohauz"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Content / Impersonation Analysis</label>
                <textarea
                  rows={2}
                  value={socDesc}
                  onChange={(e) => setSocDesc(e.target.value)}
                  placeholder="Auditor observation and bio details..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddSocial(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
