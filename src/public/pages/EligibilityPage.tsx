import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Building2,
  Wifi,
  CheckCircle2,
  MessageSquare,
  Send,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  Clock,
  FileQuestion,
  HelpCircle,
  FileText
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead.tsx';
import { trackEvent } from '../lib/analytics.ts';
import { TELCOHAUZ_BUSINESS, generateSubmissionId } from '../../data/telcoData.ts';

const MALAYSIAN_STATES = [
  'Kuala Lumpur',
  'Selangor',
  'Putrajaya',
  'Johor',
  'Penang',
  'Perak',
  'Kedah',
  'Melaka',
  'Negeri Sembilan',
  'Pahang',
  'Terengganu',
  'Kelantan',
  'Perlis',
  'Sabah',
  'Sarawak',
  'Labuan',
];

export type EligibilityResultStatus =
  | 'LIKELY ELIGIBLE'
  | 'MORE INFORMATION REQUIRED'
  | 'DOCUMENT REQUIRED'
  | 'COVERAGE CHECK REQUIRED'
  | 'PROVIDER REVIEW REQUIRED'
  | 'NOT ELIGIBLE';

export function EligibilityPage() {
  const [searchParams] = useSearchParams();
  const initialAddress = searchParams.get('address') || '';
  const initialPlan = searchParams.get('plan') || '';

  // Form states (Section 14 fields)
  const [step, setStep] = useState<number>(1);
  const [state, setState] = useState('Selangor');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState(initialAddress);
  const [premiseType, setPremiseType] = useState<'Residential' | 'Business'>('Residential');
  const [buildingStyle, setBuildingStyle] = useState('Kondominium / Bertingkat');
  const [currentProvider, setCurrentProvider] = useState('Tiada (Pemasangan Baharu)');
  const [preferredPackage, setPreferredPackage] = useState(initialPlan || 'Fibre 300Mbps');

  // Contact & Submission
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultStatus, setResultStatus] = useState<EligibilityResultStatus>('LIKELY ELIGIBLE');
  const [statusExplanation, setStatusExplanation] = useState('');
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const calculateStatus = (): { status: EligibilityResultStatus; explanation: string } => {
    if (!postcode || postcode.length < 5) {
      return {
        status: 'MORE INFORMATION REQUIRED',
        explanation: 'Poskod tidak lengkap. Sila berikan poskod 5 digit untuk semakan nod gentian optik yang tepat.',
      };
    }

    if (premiseType === 'Business' && !preferredPackage.toLowerCase().includes('biz') && !preferredPackage.toLowerCase().includes('business')) {
      return {
        status: 'PROVIDER REVIEW REQUIRED',
        explanation: 'Premis perniagaan memerlukan semakan pendaftaran SSM dan pilihan pelan Business Fibre.',
      };
    }

    if (buildingStyle.includes('Kondominium') || buildingStyle.includes('Bertingkat')) {
      return {
        status: 'COVERAGE CHECK REQUIRED',
        explanation: 'Bangunan bertingkat memerlukan semakan MDF room untuk memastikan port TIME atau TM HSBB masih mempunyai slot kosong.',
      };
    }

    if (currentProvider.includes('Masih dalam kontrak')) {
      return {
        status: 'DOCUMENT REQUIRED',
        explanation: 'Perlu semakan tarikh tamat kontrak telco lama untuk mengelakkan caj penalti penamatan awal.',
      };
    }

    return {
      status: 'LIKELY ELIGIBLE',
      explanation: 'Berdasarkan kawasan dan poskod anda, premis mempunyai kebarangkalian tinggi untuk liputan gentian optik atau rangkaian 5G.',
    };
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim() || !address.trim()) {
      setErrorMsg('Sila isikan bandar dan alamat premis anda.');
      return;
    }
    setErrorMsg('');
    trackEvent('eligibility_started', { state, city, premiseType, preferredPackage });
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg('Sila isikan nama penuh dan nombor WhatsApp anda.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const calculated = calculateStatus();
    setResultStatus(calculated.status);
    setStatusExplanation(calculated.explanation);

    try {
      const payload = {
        fullName,
        phone,
        email: email || undefined,
        serviceType: `${premiseType} - ${preferredPackage}`,
        preferredProvider: 'Multi-Provider Check',
        planInterested: preferredPackage,
        address,
        postcode,
        state,
        message: `Bandar: ${city}. Jenis: ${premiseType} (${buildingStyle}). Pembekal Semasa: ${currentProvider}. Status: ${calculated.status}.`,
        source: 'Full Eligibility Checker'
      };

      const res = await fetch('/api/public/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setSubmissionResult(data);
      trackEvent('eligibility_completed', { status: calculated.status });
      setStep(3);
    } catch (err) {
      console.error(err);
      const fallbackId = generateSubmissionId();
      const fallbackWa = `https://wa.me/${TELCOHAUZ_BUSINESS.whatsappNumber}?text=${encodeURIComponent(
        `Salam TelcoHauz,\n` +
        `No. Rujukan Semakan: ${fallbackId}\n` +
        `Nama: ${fullName} (${phone})\n` +
        `Alamat: ${address}, ${city}, ${postcode} ${state}\n` +
        `Premis: ${premiseType} (${buildingStyle})\n` +
        `Pakej: ${preferredPackage}\n` +
        `Status Awal: ${calculated.status}`
      )}`;
      setSubmissionResult({
        success: true,
        submissionId: fallbackId,
        whatsappUrl: fallbackWa,
        message: 'Permohonan sedia dihantar ke WhatsApp perunding TelcoHauz.'
      });
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeStyle = (status: EligibilityResultStatus) => {
    switch (status) {
      case 'LIKELY ELIGIBLE':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60';
      case 'COVERAGE CHECK REQUIRED':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-600/60';
      case 'PROVIDER REVIEW REQUIRED':
        return 'bg-amber-950/80 text-amber-300 border-amber-600/60';
      case 'DOCUMENT REQUIRED':
        return 'bg-blue-950/80 text-blue-300 border-blue-600/60';
      case 'MORE INFORMATION REQUIRED':
        return 'bg-purple-950/80 text-purple-300 border-purple-600/60';
      default:
        return 'bg-rose-950/80 text-rose-300 border-rose-600/60';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Semak Kelayakan & Ketersediaan Port Telco Malaysia"
        description="Pemeriksa kelayakan internet rumah dan perniagaan. Semak ketersediaan TIME, Unifi, Maxis, CelcomDigi dan isyarat 5G."
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-cyan-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white">Semak Kelayakan (Eligibility Flow)</span>
        </div>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800/80">
            Sistem Semakan Kelayakan Telus
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
            Pemeriksa Kelayakan Pakej & Liputan
          </h1>
          <p className="text-sm text-slate-300 mt-2">
            Ketahui status kelayakan awal sebelum membuat permohonan rasmi. Tiada caj bayaran dikenakan.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className={step >= 1 ? 'text-cyan-400' : 'text-slate-400'}>1. Butiran Premis</span>
            <span className={step >= 2 ? 'text-cyan-400' : 'text-slate-400'}>2. Pakej & Hubungan</span>
            <span className={step >= 3 ? 'text-emerald-400' : 'text-slate-400'}>3. Keputusan Kelayakan</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-300"
              style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
            />
          </div>
        </div>

        {/* Form Body */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Premise details (Section 14: State, City, Postcode, Residential / Business) */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <MapPin className="w-5 h-5 text-cyan-400" />
                Langkah 1: Maklumat Lokasi & Jenis Premis
              </h2>

              {/* Residential vs Business toggle */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Kategori Premis Pemasangan *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPremiseType('Residential')}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      premiseType === 'Residential'
                        ? 'border-cyan-500 bg-cyan-950/50 text-cyan-300 ring-1 ring-cyan-500'
                        : 'border-slate-800 bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    Kediaman (Residential)
                  </button>

                  <button
                    type="button"
                    onClick={() => setPremiseType('Business')}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      premiseType === 'Business'
                        ? 'border-cyan-500 bg-cyan-950/50 text-cyan-300 ring-1 ring-cyan-500'
                        : 'border-slate-800 bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    Perniagaan / Pejabat (Business)
                  </button>
                </div>
              </div>

              {/* State, City, Postcode */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Negeri *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                  >
                    {MALAYSIAN_STATES.map((st) => (
                      <option key={st} value={st} className="bg-slate-900">{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Bandar / Kawasan *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Contoh: Petaling Jaya / Shah Alam"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Poskod (5 Digit) *
                  </label>
                  <input
                    type="text"
                    required
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="47301"
                    maxLength={5}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Alamat Premis / Nama Bangunan / Kondominium *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Contoh: Unit B-12-05, Kondominium Kelana Impian, Jalan SS 8/39"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Struktur Bangunan
                </label>
                <select
                  value={buildingStyle}
                  onChange={(e) => setBuildingStyle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="Kondominium / Bertingkat">Kondominium / Apartmen Bertingkat (High-rise)</option>
                  <option value="Rumah Teres Landed">Rumah Teres Landed (1 atau 2 Tingkat)</option>
                  <option value="Semi-D / Banglo">Semi-D / Banglo</option>
                  <option value="Kedai / Rumah Kedai">Kedai / Rumah Kedai (Shoplot)</option>
                  <option value="Menara Pejabat Komersial">Menara Pejabat Komersial</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Seterusnya: Pembekal & Pakej Pilihan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Current provider, Preferred package, Contact info */}
          {step === 2 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Wifi className="w-5 h-5 text-cyan-400" />
                Langkah 2: Pembekal Semasa & Pakej Yang Diminati
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Pembekal Internet Semasa Anda *
                  </label>
                  <select
                    value={currentProvider}
                    onChange={(e) => setCurrentProvider(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Tiada (Pemasangan Baharu)">Tiada (Pemasangan Baru Rumah)</option>
                    <option value="Unifi / TM (Kontrak sudah tamat)">Unifi / TM (Kontrak sudah tamat)</option>
                    <option value="TIME dotCom (Kontrak tamat)">TIME dotCom (Kontrak tamat)</option>
                    <option value="Maxis Fibre (Kontrak tamat)">Maxis Fibre (Kontrak tamat)</option>
                    <option value="CelcomDigi Fibre">CelcomDigi Fibre</option>
                    <option value="Masih dalam kontrak telco lama">Masih dalam kontrak telco lama</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Pakej Yang Ingin Disemak *
                  </label>
                  <input
                    type="text"
                    required
                    value={preferredPackage}
                    onChange={(e) => setPreferredPackage(e.target.value)}
                    placeholder="Contoh: Fibre 300Mbps / TIME 200M / 5G Home"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Contact section */}
              <div className="pt-2 border-t border-slate-800 space-y-4">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                  Maklumat Untuk Laporan Rasmi
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nama Penuh (Seperti Dalam MyKad) *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Contoh: Azman bin Kamarudin"
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nombor WhatsApp Aktif *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-semibold">+60</span>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="11 2345 6789"
                        className="w-full pl-11 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Emel Anda (Pilihan)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="azman@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Kembali
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-950/40 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Sedang Menyemak Port & Data...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Semak Kelayakan & Jana Keputusan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Display calculated status & mandatory provider notice */}
          {step === 3 && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <div>
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-mono font-bold border tracking-wider uppercase ${getStatusBadgeStyle(resultStatus)}`}>
                  Status: {resultStatus}
                </span>

                <h2 className="text-2xl sm:text-3xl font-black text-white mt-3">
                  Keputusan Semakan: {fullName}
                </h2>

                {submissionResult?.submissionId && (
                  <div className="mt-3 inline-block px-4 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-xs font-mono text-cyan-300">
                    No. Rujukan Semakan: <strong className="text-white">{submissionResult.submissionId}</strong>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
                  {statusExplanation}
                </p>
              </div>

              {/* Summary box */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-left text-xs space-y-2 max-w-lg mx-auto">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Alamat:</span>
                  <span className="text-white font-medium truncate max-w-[260px]">{address}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Bandar & Negeri:</span>
                  <span className="text-white font-medium">{city}, {postcode} {state}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Pakej Pilihan:</span>
                  <span className="text-cyan-300 font-bold">{preferredPackage}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Kategori Premis:</span>
                  <span className="text-slate-200">{premiseType} ({buildingStyle})</span>
                </div>
              </div>

              {/* Mandatory Notice (Section 14) */}
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-200 text-xs max-w-lg mx-auto leading-relaxed">
                <strong>Pemberitahuan Penting:</strong> "Keputusan akhir tertakluk kepada semakan provider." TelcoHauz menjalankan semakan awal untuk membantu mempercepatkan proses.
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                {submissionResult?.whatsappUrl && (
                  <a
                    href={submissionResult.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent('whatsapp_clicked', { from: 'eligibility_result' })}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Sahkan Port & Teruskan di WhatsApp</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                >
                  Semak Alamat Lain
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
