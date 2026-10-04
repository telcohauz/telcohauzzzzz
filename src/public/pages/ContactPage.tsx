import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { TELCOHAUZ_BUSINESS, generateSubmissionId } from '../../data/telcoData.ts';

export function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Pertanyaan Pelan Fibre Internet');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg('Sila isikan nama penuh, nombor WhatsApp dan mesej anda.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        fullName,
        phone,
        email: email || undefined,
        serviceType: subject,
        message,
        source: 'Contact Page Form'
      };

      const res = await fetch('/api/public/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedData(data);
      } else {
        setErrorMsg(data.error || 'Gagal menghantar mesej. Sila cuba lagi.');
      }
    } catch (err) {
      console.error(err);
      const fallbackId = generateSubmissionId();
      const fallbackWa = `https://wa.me/${TELCOHAUZ_BUSINESS.whatsappNumber}?text=${encodeURIComponent(
        `Salam TelcoHauz,\n` +
        `No. Rujukan: ${fallbackId}\n` +
        `Nama: ${fullName} (${phone})\n` +
        `Subjek: ${subject}\n` +
        `Mesej: ${message}`
      )}`;
      setSubmittedData({
        success: true,
        submissionId: fallbackId,
        whatsappUrl: fallbackWa,
        message: 'Mesej sedia dihantar terus ke WhatsApp perunding TelcoHauz.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link to="/" className="hover:text-cyan-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white">Hubungi Kami</span>
        </div>

        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Khidmat Pelanggan & Bantuan Pendaftaran
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
            Hubungi Perunding TelcoHauz
          </h1>
          <p className="text-sm text-slate-300 mt-2">
            Kami sedia menjawab sebarang persoalan mengenai semakan port gentian optik, proses pertukaran nombor (MNP), atau status permohonan pelan anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details Column - Verified SSM Records Only */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
                  Saluran Perhubungan Rasmi
                </h2>
                <span className="text-xs text-slate-400 block mt-1">
                  {TELCOHAUZ_BUSINESS.businessName} (SSM: {TELCOHAUZ_BUSINESS.registrationNumber})
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">WhatsApp Perunding (Paling Pantas)</strong>
                    <a
                      href={`https://wa.me/${TELCOHAUZ_BUSINESS.whatsappNumber}?text=${encodeURIComponent('Salam TelcoHauz, saya ingin bertanyakan tentang...')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline font-mono font-medium"
                    >
                      {TELCOHAUZ_BUSINESS.verifiedPhone}
                    </a>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Respons purata: kurang 15 minit</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Talian Telefon</strong>
                    <span className="text-slate-300 font-mono">{TELCOHAUZ_BUSINESS.verifiedPhone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Emel Rasmi</strong>
                    <span className="text-slate-300">{TELCOHAUZ_BUSINESS.verifiedEmail}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Waktu Operasi Bantuan</strong>
                    <span className="text-slate-300 block">{TELCOHAUZ_BUSINESS.operatingHours}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">Alamat Pendaftaran Perniagaan (SSM)</strong>
                    <span className="text-slate-300 block text-xs">{TELCOHAUZ_BUSINESS.registeredAddress}</span>
                    <strong className="text-white block font-semibold mt-2">Premis Operasi</strong>
                    <span className="text-slate-400 block text-xs">{TELCOHAUZ_BUSINESS.operatingAddress}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Bantuan Pendaftaran Bebas</span>
              </div>
              <p>
                Setiap pertanyaan diproses oleh perunding berpengalaman kami untuk memastikan anda menerima semakan port rasmi tanpa sebarang kekeliruan atau komitmen wajib.
              </p>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 mb-6">
                Borang Pertanyaan / Maklum Balas
              </h2>

              {submittedData ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Mesej Berjaya Direkodkan!</h3>
                  
                  {/* Submission ID */}
                  <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-4 max-w-sm mx-auto">
                    <span className="text-[11px] uppercase tracking-wider text-cyan-400 block font-semibold">
                      No. Rujukan Pertanyaan
                    </span>
                    <span className="text-xl font-black font-mono text-white tracking-wider">
                      {submittedData.submissionId || 'TH-ENQUIRY'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Terima kasih, <strong>{fullName}</strong>. Mesej anda telah direkodkan. Perunding TelcoHauz akan menghubungi anda sebentar lagi.
                  </p>

                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={submittedData.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Terus Hubungi Perunding di WhatsApp</span>
                    </a>
                    <button
                      onClick={() => {
                        setSubmittedData(null);
                        setFullName('');
                        setPhone('');
                        setMessage('');
                      }}
                      className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                    >
                      Hantar Pertanyaan Lain
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Nama Penuh <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Contoh: Ahmad Razak"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Nombor Telefon / WhatsApp <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="012-3456789"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Alamat Emel (Pilihan)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@contoh.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Kategori Pertanyaan
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Pertanyaan Pelan Fibre Internet">Fibre Internet (Rumah)</option>
                      <option value="Pertanyaan Pelan Business Fibre">Business Fibre (Pejabat / PKS)</option>
                      <option value="Pertanyaan 5G Wireless Broadband">5G / Wireless Broadband</option>
                      <option value="Pertanyaan Pelan Mobile Postpaid">Pelan Mobile (Postpaid / MNP)</option>
                      <option value="Pertanyaan Astro TV & Fibre">Astro / Entertainment</option>
                      <option value="Pertanyaan Sewa Beli Penapis Air">Water Purifiers (Cuckoo / Coway / LG)</option>
                      <option value="Pertanyaan Home Appliances">Home Appliances (Khind / LG)</option>
                      <option value="Pertanyaan Solar Bumbung">Solar (Verdant Solar)</option>
                      <option value="Pertanyaan Digital Services">Digital Services</option>
                      <option value="Semakan Status Permohonan">Semakan Status Permohonan</option>
                      <option value="Lain-lain Pertanyaan">Lain-lain</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Mesej Anda <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Nyatakan pertanyaan atau alamat premis anda untuk semakan kelayakan port..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 disabled:opacity-50 transition-all"
                    >
                      {isSubmitting ? (
                        <span>Sedang Dihantar...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Hantar Pertanyaan</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
