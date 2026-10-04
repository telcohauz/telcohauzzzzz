import React, { useState, useEffect } from 'react';
import { Clock, Plus, Search, Filter, ShieldCheck, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { TimelineItem } from '../types/index.ts';

interface Props {
  onRefreshStats: () => void;
  onInspectTrace: (item: any) => void;
}

export const TimelineView: React.FC<Props> = ({ onRefreshStats, onInspectTrace }) => {
  const [timelineList, setTimelineList] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [eventDate, setEventDate] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventCategory, setEventCategory] = useState('Business started');
  const [eventDesc, setEventDesc] = useState('');
  const [eventConfidence, setEventConfidence] = useState('High');

  useEffect(() => {
    fetchTimeline();
  }, [categoryFilter, yearFilter]);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      let url = '/api/timeline';
      const params = new URLSearchParams();
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter);
      if (yearFilter !== 'ALL') params.append('year', yearFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        setTimelineList(await res.json());
      }
    } catch (err) {
      console.error('Failed to load timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim() || !eventDate.trim()) return;

    try {
      const res = await fetch('/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: eventDate,
          event: eventName,
          category: eventCategory,
          description: eventDesc,
          confidence: eventConfidence,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setEventName('');
        setEventDate('');
        setEventDesc('');
        await fetchTimeline();
        onRefreshStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const categories = [
    'ALL',
    'Business started',
    'Website appeared',
    'Social account created',
    'Product launched',
    'Product discontinued',
    'Address changed',
    'Phone changed',
    'Email changed',
    'Rebranding',
    'New marketplace account',
    'Major public mention',
  ];

  const years = ['ALL', '2026', '2025', '2024', '2023', '2022', '2021'];

  const filtered = timelineList.filter((item) =>
    item.event.toLowerCase().includes(search.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(search.toLowerCase())) ||
    item.category.toLowerCase().includes(search.toLowerCase()) ||
    item.date.includes(search)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-400" />
            Digital Footprint Chronological Timeline
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Temporal audit trail tracking business registration, web appearance, social expansion, and brand milestones.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-sky-900/40 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Footprint Milestone</span>
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
            placeholder="Search milestones..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-sky-500 font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto font-mono">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg">
            <span className="text-slate-500 text-[11px]">Year:</span>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-hidden"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg">
            <span className="text-slate-500 text-[11px]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-hidden"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Timeline Stream */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-mono text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          Reconstructing chronological footprint...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800 text-xs">
          No timeline events match the filter parameters.
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-gradient-to-b before:from-sky-500 before:via-blue-600 before:to-slate-800 space-y-6">
          {filtered.map((item) => (
            <div key={item.id} className="relative group">
              {/* Dot */}
              <div className="absolute -left-6 sm:-left-8 top-4 w-4 h-4 rounded-full bg-slate-950 border-2 border-sky-400 group-hover:scale-125 transition flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              </div>

              {/* Card */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition space-y-3 text-xs shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-bold text-sky-400">
                      {item.date}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
                      {item.category}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                    Confidence: {item.confidence}
                  </span>
                </div>

                <h2 className="text-base font-bold text-white">{item.event}</h2>

                {item.description && (
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {item.description}
                  </p>
                )}

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end">
                  <button
                    onClick={() => onInspectTrace({
                      recordName: `Timeline Event: ${item.event}`,
                      recordType: item.category,
                      claimText: item.description || item.event,
                      claimStatus: 'DISAHKAN',
                      evidenceName: 'Historical Registry Footprint / Timestamped Capture',
                      sourceName: 'Archived Audit Trail',
                      entityName: 'TELCOHAUZ',
                      entityType: 'Enterprise',
                    })}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
                  >
                    Trace Evidence
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-slate-200">
            <h2 className="text-lg font-bold text-white mb-1">Add Footprint Milestone</h2>
            <p className="text-xs text-slate-400 mb-4 font-mono">
              Anchors a verifiable chronological event to the digital footprint.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Date (YYYY-MM-DD) *</label>
                  <input
                    type="text"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="2026-10-01"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-hidden font-sans"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden"
                  >
                    {categories.filter(c => c !== 'ALL').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Event Headline *</label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. Retail Counter Opened at Plaza Digital Gadgets"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder:text-slate-600 focus:outline-hidden font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Supporting narrative..."
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
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold"
                >
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
