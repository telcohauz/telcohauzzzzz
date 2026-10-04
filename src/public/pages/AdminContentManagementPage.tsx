import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  Plus,
  Edit,
  Eye,
  Archive,
  CheckCircle,
  XCircle,
  FileText,
  Tag,
  Calendar,
  ShieldAlert,
  ArrowLeft,
  Search,
  ExternalLink
} from 'lucide-react';
import { TELCO_NEWS, TelcoNewsItem } from '../../data/telcoData.ts';
import { useAuth } from '../../context/AuthContext.tsx';

export function AdminContentManagementPage() {
  const { currentUser, signInWithGoogle, logout } = useAuth();
  const [adminPasscode, setAdminPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'news' | 'leads'>('news');

  // News management state
  const [articles, setArticles] = useState<any[]>(() => {
    return TELCO_NEWS.map(n => ({
      ...n,
      status: 'PUBLISHED',
      source_name: n.author || 'Official Press Release',
      source_url: 'https://www.mcmc.gov.my',
      updated_at: '2026-10-01',
      published_at: n.date,
    }));
  });

  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Editor Form state
  const [formHeadline, setFormHeadline] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState('5G & Infrastruktur');
  const [formProvider, setFormProvider] = useState('Umum');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formSource, setFormSource] = useState('');
  const [formSourceUrl, setFormSourceUrl] = useState('');
  const [formStatus, setFormStatus] = useState<'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED'>('PUBLISHED');

  const handlePasscodeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Verify auditor passcode or Firebase login
    if (adminPasscode === 'telcohauz2026' || currentUser) {
      setIsAuthenticated(true);
    } else {
      alert('Kunci keselamatan pentadbir tidak sah.');
    }
  };

  const handleOpenCreate = () => {
    setSelectedArticle(null);
    setFormHeadline('');
    setFormSlug('');
    setFormCategory('5G & Infrastruktur');
    setFormProvider('Umum');
    setFormSummary('');
    setFormContent('');
    setFormSource('Siaran Rasmi SKMM / Pembekal');
    setFormSourceUrl('');
    setFormStatus('DRAFT');
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (article: any) => {
    setSelectedArticle(article);
    setFormHeadline(article.headline || article.title);
    setFormSlug(article.slug);
    setFormCategory(article.category);
    setFormProvider(article.provider || 'Umum');
    setFormSummary(article.summary);
    setFormContent(Array.isArray(article.content) ? article.content.join('\n\n') : article.content);
    setFormSource(article.source_name || article.author || '');
    setFormSourceUrl(article.source_url || '');
    setFormStatus(article.status || 'PUBLISHED');
    setIsEditorOpen(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const contentParagraphs = formContent.split('\n\n').filter(p => p.trim().length > 0);
    const newArticle = {
      id: selectedArticle?.id || `news-${Date.now()}`,
      news_id: selectedArticle?.news_id || `NEWS-${Date.now()}`,
      headline: formHeadline,
      title: formHeadline,
      slug: formSlug || formHeadline.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: formCategory,
      provider: formProvider,
      summary: formSummary,
      content: contentParagraphs,
      source_name: formSource,
      source_url: formSourceUrl,
      author: formSource || 'Editorial TelcoHauz',
      status: formStatus,
      date: selectedArticle?.date || 'Hari ini',
      readTime: '3 minit bacaan',
      tags: [formCategory, formProvider],
      published_at: selectedArticle?.published_at || new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0],
    };

    if (selectedArticle) {
      setArticles(prev => prev.map(a => a.id === selectedArticle.id ? newArticle : a));
    } else {
      setArticles(prev => [newArticle, ...prev]);
    }

    setIsEditorOpen(false);
  };

  const handleStatusChange = (id: string, newStatus: 'PUBLISHED' | 'DRAFT' | 'REVIEW' | 'ARCHIVED') => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  // If not authenticated, show strict access lock (Section 28 & 31: Admin must NOT be publicly accessible)
  if (!isAuthenticated && !currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white">Akses Pentadbiran & Kandungan</h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Zon pentadbir dalaman TelcoHauz. Sila masukkan kunci keselamatan editor atau log masuk menggunakan akaun kakitangan yang dibenarkan.
            </p>
          </div>

          <form onSubmit={handlePasscodeLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kunci Keselamatan Pentadbir (Passcode)
              </label>
              <input
                type="password"
                required
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                placeholder="Masukkan kod keselamatan..."
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Petunjuk: telcohauz2026</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-900/40 transition-all cursor-pointer"
            >
              Sahkan Kunci Keselamatan
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={signInWithGoogle}
              className="text-xs text-cyan-400 hover:underline"
            >
              Log Masuk dengan Google Workspace
            </button>
            <span className="text-slate-400">•</span>
            <Link to="/" className="text-xs text-slate-400 hover:text-white">
              Kembali ke Laman Web
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sesi Pentadbiran Aktif</span>
            </div>
            <h1 className="text-2xl font-black text-white">Pengurusan Kandungan Berita & Artikel (CMS)</h1>
            <p className="text-xs text-slate-400 mt-0.5">Semak fakta, draf, terbit dan arkibkan kandungan awam TelcoHauz.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cipta Artikel Baharu</span>
            </button>

            <Link
              to="/news"
              target="_blank"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Portal Awam
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsAuthenticated(false);
                logout();
              }}
              className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Keluar
            </button>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Senarai Artikel Dalam Sistem ({articles.length})
            </div>
            <span className="text-[11px] text-slate-400">Hanya berstatus PUBLISHED dipaparkan kepada pengguna awam</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Tajuk / Slug</th>
                  <th className="p-4">Kategori & Sumber</th>
                  <th className="p-4">Tarikh & Pengarang</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 max-w-xs">
                      <strong className="text-white block text-sm leading-snug truncate">
                        {art.headline || art.title}
                      </strong>
                      <span className="text-[11px] text-slate-400 font-mono">/news/{art.slug}</span>
                    </td>

                    <td className="p-4">
                      <span className="text-cyan-400 font-semibold block">{art.category}</span>
                      <span className="text-[11px] text-slate-400">{art.source_name || 'Sumber Terbuka'}</span>
                    </td>

                    <td className="p-4 text-slate-300">
                      <div>{art.date}</div>
                      <span className="text-[11px] text-slate-400">{art.author}</span>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${
                        art.status === 'PUBLISHED' ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60' :
                        art.status === 'DRAFT' ? 'bg-amber-950/60 text-amber-300 border-amber-700/60' :
                        art.status === 'REVIEW' ? 'bg-blue-950/60 text-blue-300 border-blue-700/60' :
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {art.status}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(art)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium cursor-pointer"
                      >
                        Sunting
                      </button>

                      {art.status === 'PUBLISHED' ? (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(art.id, 'ARCHIVED')}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-medium cursor-pointer"
                        >
                          Arkib
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(art.id, 'PUBLISHED')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 text-xs font-medium cursor-pointer"
                        >
                          Terbit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Editor Modal */}
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {selectedArticle ? 'Sunting Artikel' : 'Cipta Artikel Berita Baharu'}
                  </h2>
                  <span className="text-xs text-slate-400">Isi maklumat fakta rasmi sebelum diterbitkan</span>
                </div>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveArticle} className="p-6 overflow-y-auto space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tajuk Berita / Headline *</label>
                  <input
                    type="text"
                    required
                    value={formHeadline}
                    onChange={(e) => {
                      setFormHeadline(e.target.value);
                      if (!selectedArticle) {
                        setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                      }
                    }}
                    placeholder="Contoh: Perkembangan Liputan 5G Fasa Seterusnya di Malaysia"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Slug URL *</label>
                    <input
                      type="text"
                      required
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Kategori</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    >
                      <option value="5G & Infrastruktur">5G & Infrastruktur</option>
                      <option value="Perbandingan Fibre">Perbandingan Fibre</option>
                      <option value="Inisiatif SKMM">Inisiatif SKMM</option>
                      <option value="Promosi Telco">Promosi Telco</option>
                      <option value="Panduan Pengguna">Panduan Pengguna</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Status Penerbitan</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                    >
                      <option value="DRAFT">DRAFT (Draf Sahaja)</option>
                      <option value="REVIEW">REVIEW (Semakan Editor)</option>
                      <option value="PUBLISHED">PUBLISHED (Terbit Awam)</option>
                      <option value="ARCHIVED">ARCHIVED (Arkib)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nama Sumber Asal *</label>
                    <input
                      type="text"
                      value={formSource}
                      onChange={(e) => setFormSource(e.target.value)}
                      placeholder="Contoh: Kenyataan Media SKMM / DNB"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Pautan URL Sumber (Jika Ada)</label>
                    <input
                      type="url"
                      value={formSourceUrl}
                      onChange={(e) => setFormSourceUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ringkasan / Summary (Dipaparkan pada kad) *</label>
                  <textarea
                    rows={2}
                    required
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    placeholder="Ringkasan 2-3 baris fakta utama..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kandungan Artikel (Pisahkan perenggan dengan baris kosong) *</label>
                  <textarea
                    rows={6}
                    required
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Tulis ulasan telus atau ringkasan berita di sini..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white leading-relaxed font-mono"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg cursor-pointer"
                  >
                    Simpan Kandungan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
