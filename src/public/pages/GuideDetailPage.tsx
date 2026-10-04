import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  ArrowLeft,
  Lightbulb,
  AlertCircle,
  Scale,
  ListOrdered,
  Package,
  ShieldCheck
} from 'lucide-react';
import { CONSUMER_GUIDES, TELCO_PLANS } from '../../data/telcoData.ts';
import { SEOHead } from '../components/SEOHead.tsx';
import { SocialShareBar } from '../components/SocialShareBar.tsx';
import { ProductCard } from '../components/ProductCard.tsx';

export function GuideDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const guide = CONSUMER_GUIDES.find((g) => g.slug === slug || g.id === slug);

  if (!guide) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white">Panduan Tidak Dijumpai</h2>
        <Link to="/guides" className="mt-4 px-6 py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl">
          Kembali ke Senarai Panduan
        </Link>
      </div>
    );
  }

  // Related products
  const relatedPlans = TELCO_PLANS.filter((p) =>
    guide.category.toLowerCase().includes(p.category.toLowerCase()) ||
    p.isFeatured
  ).slice(0, 2);

  const waEnquiryText = encodeURIComponent(
    `Salam TelcoHauz, saya sedang membaca panduan "${guide.title}". Boleh bantu berikan khidmat nasihat bagi situasi saya?`
  );

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title={`${guide.title} - Panduan TelcoHauz Malaysia`}
        description={guide.summary}
        type="article"
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-cyan-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/guides" className="hover:text-cyan-400">Panduan</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white truncate">{guide.title}</span>
        </div>

        {/* Top Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-5">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60">
              {guide.category}
            </span>
            <span className="text-slate-400">{guide.readTime}</span>
            <span className="text-slate-400">• {guide.date}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {guide.title}
          </h1>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-sm text-slate-200 leading-relaxed font-medium">
            {guide.summary}
          </div>

          <SocialShareBar title={guide.title} />
        </div>

        {/* Exact Section 22 Guide Structure:
            Problem → Explanation → Options → Comparison → Decision criteria → Important considerations → Related products → WhatsApp CTA */}

        {/* 1. PROBLEM */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            1. Masalah Pengguna (Problem)
          </span>
          <h2 className="text-xl font-bold text-white">Isu & Cabaran Yang Sering Dihadapi</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Ramai pengguna di Malaysia terikat dengan kontrak 2 tahun untuk pelan yang tidak optimum kerana kekurangan maklumat sebelum pendaftaran—contohnya langganan kelajuan yang tidak sepadan dengan bilangan penghuni rumah, atau zon liputan gentian optik yang tidak disemak dengan teliti.
          </p>
        </div>

        {/* 2. EXPLANATION */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4" />
            2. Penerangan Terperinci (Explanation)
          </span>
          <h2 className="text-xl font-bold text-white">Memahami Konsep Asas</h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {guide.content.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        {/* 3. OPTIONS */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <ListOrdered className="w-4 h-4" />
            3. Pilihan Yang Tersedia (Options)
          </span>
          <h2 className="text-xl font-bold text-white">Langkah & Kaedah Pelaksanaan</h2>
          <div className="space-y-4">
            {guide.steps.map((st) => (
              <div key={st.stepNumber} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                  {st.stepNumber}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base">{st.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">{st.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. COMPARISON */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Scale className="w-4 h-4" />
            4. Perbandingan Pilihan (Comparison)
          </span>
          <h2 className="text-xl font-bold text-white">Kelebihan vs Kekurangan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <strong className="text-emerald-300 block">Kelebihan Mengikut Panduan:</strong>
              <ul className="space-y-1 text-slate-300 list-disc pl-4">
                <li>Menjimatkan bil bulanan RM20-RM40 sebulan</li>
                <li>Menghapuskan gangguan zon mati isyarat WiFi</li>
                <li>Mengekalkan nombor telefon tanpa kehilangan kenalan</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <strong className="text-amber-300 block">Perkara Perlu Diawasi:</strong>
              <ul className="space-y-1 text-slate-300 list-disc pl-4">
                <li>Baki kontrak dengan pembekal lama</li>
                <li>Kekangan tebukan dinding bagi penyewa</li>
                <li>Kapasiti port pengagihan di tiang luar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. DECISION CRITERIA */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            5. Kriteria Pemilihan (Decision Criteria)
          </span>
          <h2 className="text-xl font-bold text-white">Bagaimana Membuat Keputusan Terbaik?</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Pilihlah pelan berdasarkan <strong>bilangan peranti serentak</strong> dan bukannya kelajuan puncak yang tidak digunakan sepenuhnya. Jika anda tinggal di kondominium dengan liputan TIME, ambil pakej simetri. Jika di kawasan perumahan teres, semak ketersediaan Unifi atau CelcomDigi.
          </p>
        </div>

        {/* 6. IMPORTANT CONSIDERATIONS */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            6. Pertimbangan Penting (Important Considerations)
          </span>
          <h2 className="text-xl font-bold text-white">Sebelum Menandatangani Kontrak</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Semua terma kontrak, caj penamatan awal, dan promosi adalah tertakluk kepada pengesahan rasmi pihak pembekal perkhidmatan. TelcoHauz menasihatkan pengguna untuk mengesahkan baki port dengan perunding kami sebelum membatalkan langganan lama.
          </p>
        </div>

        {/* 7. RELATED PRODUCTS */}
        {relatedPlans.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">7. Pakej Berkaitan Panduan Ini (Related Products)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPlans.map((p) => (
                <ProductCard key={p.id} plan={p} />
              ))}
            </div>
          </div>
        )}

        {/* 8. WHATSAPP CTA (Section 22) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-cyan-950/40 border border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-base">Perlukan Bantuan Mengaplikasikan Panduan Ini?</h3>
            <p className="text-xs text-slate-300 mt-1">Perunding TelcoHauz sedia menyemak kelayakan talian anda secara percuma di WhatsApp.</p>
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
