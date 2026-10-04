import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Tag,
  ArrowLeft,
  MessageSquare,
  ChevronRight,
  Share2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Package
} from 'lucide-react';
import { TELCO_NEWS, TELCO_PLANS, PROMOTIONS } from '../../data/telcoData.ts';
import { SEOHead } from '../components/SEOHead.tsx';
import { SocialShareBar } from '../components/SocialShareBar.tsx';
import { ProductCard } from '../components/ProductCard.tsx';
import { PromotionCard } from '../components/PromotionCard.tsx';

export function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const news = TELCO_NEWS.find((n) => n.slug === slug || n.id === slug);

  if (!news) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white">Berita Tidak Dijumpai</h2>
        <Link to="/news" className="mt-4 px-6 py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl">
          Kembali ke Senarai Berita
        </Link>
      </div>
    );
  }

  // Related products & promotions connected (Section 23 & 24)
  const relatedProducts = TELCO_PLANS.filter(p =>
    p.category.toLowerCase().includes(news.category.toLowerCase()) ||
    news.tags.some(t => p.name.toLowerCase().includes(t.toLowerCase()) || p.provider.toLowerCase().includes(t.toLowerCase()))
  ).slice(0, 2);

  const relatedPromotions = PROMOTIONS.filter(promo =>
    promo.category.toLowerCase().includes(news.category.toLowerCase()) ||
    news.tags.some(t => promo.title.toLowerCase().includes(t.toLowerCase()))
  ).slice(0, 1);

  const relatedArticles = TELCO_NEWS.filter((n) => n.id !== news.id).slice(0, 2);

  const publishedDate = news.date;
  const updatedDate = '2026-10-02';

  const waEnquiryText = encodeURIComponent(
    `Salam TelcoHauz, saya merujuk artikel berita "${news.headline}". Boleh perunding bantu jelaskan mengenai pakej yang berkaitan?`
  );

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={news.headline}
        description={news.summary}
        type="article"
        publishedTime={publishedDate}
        modifiedTime={updatedDate}
        author={news.author}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: news.headline,
          description: news.summary,
          datePublished: publishedDate,
          dateModified: updatedDate,
          author: {
            '@type': 'Organization',
            name: news.author || 'TelcoHauz Editorial',
          },
          publisher: {
            '@type': 'Organization',
            name: 'TelcoHauz Phone Enterprise',
          },
        }}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-cyan-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/news" className="hover:text-cyan-400">Berita Telco</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white truncate">{news.headline}</span>
        </div>

        {/* Article Container (Section 18 & 21) */}
        <article className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          {/* Category & Freshness Dates (Section 21) */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800/80">
              {news.category}
            </span>
            <span>•</span>
            {/* Section 21: "Diterbitkan pada..." and "Dikemas kini pada..." */}
            <span className="text-slate-300">
              Diterbitkan pada: <strong>{publishedDate}</strong>
            </span>
            <span>•</span>
            <span className="text-slate-400">
              Dikemas kini pada: <strong>{updatedDate}</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {news.headline}
          </h1>

          {/* Author & Source attribution (Section 18 & 19) */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Pengarang / Analisis: <strong className="text-white">{news.author}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sumber: Pengumuman Rasmi SKMM & Pembekal Berlesen</span>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-cyan-200 font-medium leading-relaxed">
            {news.summary}
          </div>

          {/* Article paragraphs */}
          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
            {news.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2">
            {news.tags.map((t, idx) => (
              <span key={idx} className="text-xs text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full">
                #{t}
              </span>
            ))}
          </div>

          <SocialShareBar title={news.headline} />
        </article>

        {/* Section 24: Connected Active Promotions */}
        {relatedPromotions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Promosi Berkaitan Berita Ini</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPromotions.map((promo) => (
                <PromotionCard key={promo.id} promotion={promo} />
              ))}
            </div>
          </div>
        )}

        {/* Section 23: Connected Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Pakej Yang Disebut / Sesuai</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} plan={p} />
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Artikel Berkaitan Lain</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedArticles.map((art) => (
                <Link
                  key={art.id}
                  to={`/news/${art.slug}`}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 block transition-colors group"
                >
                  <span className="text-[11px] text-cyan-400 font-semibold">{art.category}</span>
                  <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 mt-1 line-clamp-2">
                    {art.headline}
                  </h3>
                  <span className="text-[11px] text-slate-400 mt-2 block">{art.date}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* WhatsApp CTA (Section 18) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-cyan-950/40 border border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base">Ada Pertanyaan Mengenai Perkembangan Ini?</h3>
            <p className="text-xs text-slate-300 mt-1">Sembang percuma bersama perunding telekomunikasi TelcoHauz di WhatsApp.</p>
          </div>
          <a
            href={`https://wa.me/601123456789?text=${waEnquiryText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap flex items-center gap-2 shadow-lg"
          >
            <MessageSquare className="w-4 h-4" />
            WhatsApp TelcoHauz
          </a>
        </div>
      </div>
    </div>
  );
}
