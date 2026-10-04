import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, Clock, ArrowRight, Tag, Search, ChevronRight } from 'lucide-react';
import { TELCO_NEWS, TelcoNewsItem } from '../../data/telcoData.ts';

export function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');

  const allTags = ['ALL', '5G Malaysia', 'Internet Fibre', 'SKMM', 'JENDELA', 'Unifi vs TIME'];

  const filteredNews = TELCO_NEWS.filter((item) => {
    if (selectedTag !== 'ALL' && !item.tags.includes(selectedTag)) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        item.headline.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link to="/" className="hover:text-cyan-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white">Berita & Perkembangan Pasaran Telco</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Kemas Kini Terkini
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            Berita & Analisis Telco Malaysia
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            Ikuti perkembangan terkini rangkaian 5G kedua, peluasan liputan gentian optik JENDELA SKMM, dan analisis harga pelan internet di Malaysia.
          </p>
        </div>

        {/* Search & Tags Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berita atau topik..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {tag === 'ALL' ? 'Semua Topik' : tag}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <article
              key={news.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-colors group"
            >
              <div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{news.date}</span>
                  <span>•</span>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{news.readTime}</span>
                </div>

                <Link to={`/news/${news.slug}`} className="block group-hover:text-cyan-300 transition-colors">
                  <h2 className="text-lg font-bold text-white leading-snug">
                    {news.headline}
                  </h2>
                </Link>

                <p className="mt-3 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {news.summary}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex flex-wrap gap-1">
                  {news.tags.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/news/${news.slug}`}
                  className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-semibold text-xs"
                >
                  Baca Penuh <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
