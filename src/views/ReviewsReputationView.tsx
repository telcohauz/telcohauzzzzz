import React, { useState, useEffect } from 'react';
import { MessageSquareQuote, Plus, Search, Star, AlertCircle, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { Review, SentimentType } from '../types/index.ts';
import { VerificationBadge } from '../components/VerificationBadge.tsx';

interface Props {
  onRefreshStats: () => void;
  onInspectTrace: (item: any) => void;
}

export const ReviewsReputationView: React.FC<Props> = ({ onRefreshStats, onInspectTrace }) => {
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [platform, setPlatform] = useState('Google Reviews');
  const [reviewer, setReviewer] = useState('');
  const [rating, setRating] = useState('5');
  const [reviewText, setReviewText] = useState('');
  const [sentiment, setSentiment] = useState<SentimentType>('Positive');
  const [issue, setIssue] = useState('');
  const [telcohauzResponse, setTelcohauzResponse] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        setReviewsList(await res.json());
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          reviewerIdentifier: reviewer,
          rating: parseInt(rating, 10),
          reviewText,
          sentiment,
          issue,
          telcohauzResponse,
          url,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setReviewer('');
        setReviewText('');
        setIssue('');
        setTelcohauzResponse('');
        setUrl('');
        await fetchReviews();
        onRefreshStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = reviewsList.filter((r) => {
    const matchSearch =
      r.reviewText.toLowerCase().includes(search.toLowerCase()) ||
      (r.reviewerIdentifier && r.reviewerIdentifier.toLowerCase().includes(search.toLowerCase())) ||
      (r.issue && r.issue.toLowerCase().includes(search.toLowerCase()));

    const matchSentiment = sentimentFilter === 'ALL' || r.sentiment === sentimentFilter;

    return matchSearch && matchSentiment;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-teal-400" />
            Reputation & Customer Reviews Audit
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit Principle: Negative reviews are never hidden. Clearly categorizes customer allegations vs verified facts without arbitrary sentiment scores.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-teal-900/40 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Review Finding</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search review text, reviewer, or issue..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-teal-500 font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto font-mono">
          <span className="text-slate-500 text-[11px]">Sentiment:</span>
          <div className="flex flex-wrap gap-1.5">
            {['ALL', 'Positive', 'Mixed', 'Neutral', 'Negative'].map((s) => (
              <button
                key={s}
                onClick={() => setSentimentFilter(s)}
                className={`px-2.5 py-1 rounded-lg text-xs transition ${
                  sentimentFilter === s
                    ? 'bg-teal-600 text-white font-bold shadow-xs'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          Loading public customer feedback...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800 text-xs">
          No customer reviews matching filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3 text-xs"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{item.reviewerIdentifier || 'Public Reviewer'}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                      {item.platform}
                    </span>
                    {item.date && (
                      <span className="text-[11px] font-mono text-slate-500">
                        Date: {item.date}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                    </div>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase ${
                      item.sentiment === 'Positive'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : item.sentiment === 'Mixed'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : item.sentiment === 'Negative'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.sentiment}
                    </span>
                  </div>
                </div>

                <p className="text-slate-200 text-sm leading-relaxed font-sans pt-1">
                  "{item.reviewText}"
                </p>

                {item.issue && (
                  <div className="mt-2 text-[11px] font-mono text-slate-400">
                    Subject / Concern: <strong className="text-slate-200">{item.issue}</strong>
                  </div>
                )}

                {item.telcohauzResponse && (
                  <div className="mt-3 p-3 rounded-xl bg-blue-950/40 border border-blue-900/60 text-[11px] text-blue-200 space-y-0.5">
                    <span className="font-bold text-blue-300 block">TELCOHAUZ Official Response:</span>
                    <p className="leading-relaxed">{item.telcohauzResponse}</p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Auditor: Corroborated with public platform listing</span>
                <button
                  onClick={() => onInspectTrace({
                    recordName: `Customer Review (${item.platform})`,
                    recordType: 'Public Review',
                    claimText: item.reviewText,
                    claimStatus: item.verificationStatus,
                    evidenceName: 'Verified Review Screenshot & URL Anchor',
                    sourceName: item.platform,
                    sourceUrl: item.url,
                    entityName: 'TELCOHAUZ',
                    entityType: 'Enterprise',
                  })}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Inspect Provenance
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-200">
            <h2 className="text-lg font-bold text-white mb-1">Record Public Review</h2>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Do not omit negative reviews. Include merchant response where published.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                  >
                    <option value="Google Reviews">Google Reviews</option>
                    <option value="Shopee">Shopee Malaysia</option>
                    <option value="Facebook">Facebook Reviews</option>
                    <option value="TikTok">TikTok Comments / Shop</option>
                    <option value="Lowyat / Forum">Lowyat / Public Forum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Rating (1 to 5 Stars)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                  >
                    <option value="5">5 Stars ★★★★★</option>
                    <option value="4">4 Stars ★★★★☆</option>
                    <option value="3">3 Stars ★★★☆☆</option>
                    <option value="2">2 Stars ★★☆☆☆</option>
                    <option value="1">1 Star ★☆☆☆☆</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Reviewer Identifier</label>
                  <input
                    type="text"
                    value={reviewer}
                    onChange={(e) => setReviewer(e.target.value)}
                    placeholder="e.g. Mohd Daniel"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Auditor Sentiment</label>
                  <select
                    value={sentiment}
                    onChange={(e) => setSentiment(e.target.value as SentimentType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                  >
                    <option value="Positive">Positive</option>
                    <option value="Mixed">Mixed</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Negative">Negative</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Review Text *</label>
                <textarea
                  required
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Verbatim feedback..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Core Issue / Category</label>
                <input
                  type="text"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="e.g. Screen Replacement / Wait Time / Shipping"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">TELCOHAUZ Official Response (if published)</label>
                <textarea
                  rows={2}
                  value={telcohauzResponse}
                  onChange={(e) => setTelcohauzResponse(e.target.value)}
                  placeholder="Official merchant response..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold"
                >
                  Log Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
