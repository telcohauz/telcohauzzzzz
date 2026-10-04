import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare, MapPin, AlertCircle, ShieldCheck } from 'lucide-react';
import { TelcoPlan, Promotion, TELCOHAUZ_BUSINESS, generateSubmissionId, formatPlanPrice } from '../../data/telcoData.ts';

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: TelcoPlan | null;
  promotion?: Promotion | null;
  customServiceType?: string;
}

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

export function ApplyModal({ isOpen, onClose, plan, promotion, customServiceType }: ApplyModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [state, setState] = useState('Selangor');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const planTitle = plan?.name || promotion?.title || customServiceType || 'Pelan Pilihan';
  const providerName = plan?.provider || promotion?.provider || 'TelcoHauz';
  const priceFormatted = plan ? formatPlanPrice(plan).displayText : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg('Sila isikan nama penuh dan nombor telefon / WhatsApp anda.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        fullName,
        phone,
        email: email || undefined,
        serviceType: plan?.category || promotion?.category || customServiceType || 'Fibre Internet',
        preferredProvider: providerName,
        planInterested: planTitle,
        productSnapshot: plan || promotion || { title: planTitle, provider: providerName },
        address,
        postcode,
        state,
        message,
        source: 'Website Modal Application'
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
        setErrorMsg(data.error || 'Gagal menghantar permohonan. Sila cuba lagi atau hubungi kami terus via WhatsApp.');
      }
    } catch (err: any) {
      console.error('Error submitting enquiry:', err);
      // Fallback direct WhatsApp url with canonical submission ID
      const localSubmissionId = generateSubmissionId();
      const fallbackWa = `https://wa.me/${TELCOHAUZ_BUSINESS.whatsappNumber}?text=${encodeURIComponent(
        `Salam TelcoHauz,\n` +
        `No. Rujukan: ${localSubmissionId}\n` +
        `Nama: ${fullName} (${phone})\n` +
        `Pelan: ${planTitle} (${providerName})\n` +
        `Lokasi: ${postcode} ${state}.\n` +
        `Mohon bantuan perunding TelcoHauz untuk semakan kelayakan & proses permohonan. Terima kasih!`
      )}`;
      setSubmittedData({
        success: true,
        submissionId: localSubmissionId,
        whatsappUrl: fallbackWa,
        message: 'Permohonan anda sedia disambung terus ke WhatsApp perunding TelcoHauz.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSubmittedData(null);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/60">
              Permohonan & Semakan Dibimbing
            </span>
            <h2 className="text-lg font-bold text-white mt-1">Daftar Minat & Semak Kelayakan</h2>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {submittedData ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Permohonan Direkodkan!</h3>
              
              {/* Submission ID Banner */}
              <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-4 max-w-md mx-auto">
                <span className="text-[11px] uppercase tracking-wider text-cyan-400 block font-semibold">
                  Nombor Rujukan Pendaftaran
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-white tracking-wider">
                  {submittedData.submissionId || 'TH-PROCESSED'}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Sila simpan nombor ini untuk sebarang rujukan semakan bersama TelcoHauz.
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Terima kasih, <strong>{fullName}</strong>. Maklumat bagi pakej <strong>{planTitle}</strong> telah disimpan dalam rekod snapshot permohonan.
              </p>

              <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 text-left text-xs text-slate-300 space-y-1.5">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Aliran Bantuan TelcoHauz:</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Perunding kami akan menjalankan semakan baki port gentian optik di premis anda dan membimbing penyerahan dokumen permohonan secara rasmi. Tiada caj pendaftaran pendahuluan dikenakan.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={submittedData.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Sambung ke WhatsApp Perunding</span>
                </a>
                <button
                  onClick={resetAndClose}
                  className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Tutup
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product preview banner */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider block">
                    Pelan Dipilih
                  </span>
                  <strong className="text-sm text-white block">{planTitle}</strong>
                  <span className="text-xs text-slate-400">Pembekal: {providerName}</span>
                </div>
                {priceFormatted && (
                  <div className="text-right">
                    <span className="text-xs font-bold text-cyan-300 font-mono block">
                      {priceFormatted}
                    </span>
                  </div>
                )}
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Nama Penuh <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Muhammad Ali bin Ahmad"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Nombor Telefon / WhatsApp <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 012-3456789"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Alamat Emel (Pilihan)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Alamat Pemasangan Premis (Untuk Semakan Port / Liputan)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="No. Unit, Tingkat, Blok, Nama Jalan & Bangunan"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Poskod</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    placeholder="Contoh: 43000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Negeri</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {MALAYSIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Catatan Tambahan (Pilihan)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Contoh: Mohon semak sama ada ada port TIME atau Unifi kosong di tingkat 12..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Application Workflow Notice */}
              <div className="p-3 bg-cyan-950/30 border border-cyan-900/50 rounded-xl text-[11px] text-cyan-300/90 leading-relaxed flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Peranan TelcoHauz:</strong> TelcoHauz membantu semakan kelayakan dan pengurusan dokumen permohonan. Permohonan hanya dianggap dihantar ke sistem pembekal selepas pengesahan dokumen bersama perunding.
                </span>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-cyan-950/30 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Menghantar...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Hantar Permohonan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
