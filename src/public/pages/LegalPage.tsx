import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, FileText, AlertTriangle, ChevronRight } from 'lucide-react';

export function LegalPage() {
  const location = useLocation();
  const path = location.pathname;

  let mode: 'privacy' | 'terms' | 'disclaimer' = 'privacy';
  if (path.includes('terms')) mode = 'terms';
  if (path.includes('disclaimer')) mode = 'disclaimer';

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-cyan-400">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white">
            {mode === 'privacy' && 'Dasar Privasi (Privacy Policy)'}
            {mode === 'terms' && 'Terma & Syarat Perkhidmatan (Terms of Service)'}
            {mode === 'disclaimer' && 'Penafian Bebas (Independent Disclaimer)'}
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Link
            to="/privacy"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              mode === 'privacy' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dasar Privasi (PDPA)
          </Link>
          <Link
            to="/terms"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              mode === 'terms' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Terma & Syarat
          </Link>
          <Link
            to="/disclaimer"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              mode === 'disclaimer' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Penafian Bebas
          </Link>
        </div>

        {/* Content Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {mode === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Dasar Privasi & Perlindungan Data Peribadi (PDPA)
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Kuat kuasa: 2026 • TelcoHauz Phone Enterprise (Malaysia)
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-base font-bold text-white">1. Pengenalan</h2>
                <p>
                  TelcoHauz Phone Enterprise komited sepenuhnya dalam melindungi privasi dan keselamatan data peribadi anda selaras dengan kehendak <strong>Akta Perlindungan Data Peribadi 2010 (PDPA) Malaysia</strong>. Dasar ini menerangkan bagaimana kami mengumpul, memproses, menggunakan, dan melindungi maklumat peribadi yang anda serahkan melalui laman web ini.
                </p>

                <h2 className="text-base font-bold text-white">2. Data Peribadi Yang Dikumpul</h2>
                <p>
                  Kami hanya mengumpul maklumat yang perlu bagi tujuan semakan kelayakan liputan dan permohonan pelan, termasuk:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Nama penuh (seperti dalam MyKad / Pasport)</li>
                  <li>Nombor telefon bimbit / WhatsApp aktif</li>
                  <li>Alamat emel peribadi atau perniagaan</li>
                  <li>Alamat premis pemasangan gentian optik atau penghantaran peranti</li>
                  <li>Pilihan servis, kelajuan dan pembekal perkhidmatan yang diminati</li>
                </ul>

                <h2 className="text-base font-bold text-white">3. Tujuan Pengumpulan Data</h2>
                <p>
                  Data anda digunakan semata-mata untuk:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Menjalankan semakan ketersediaan port gentian optik dan isyarat komunikasi di lokasi anda.</li>
                  <li>Menghubungi anda melalui WhatsApp atau panggilan telefon bagi mengesahkan permohonan pelan pilihan anda.</li>
                  <li>Mengemukakan pendaftaran akaun anda secara rasmi kepada penyedia perkhidmatan (cth. TIME, TM Unifi, Maxis, CelcomDigi, U Mobile, Astro, Cuckoo, Coway).</li>
                  <li>Menjawab pertanyaan dan memberikan sokongan selepas jualan.</li>
                </ul>

                <h2 className="text-base font-bold text-white">4. Jaminan Tidak Menjual Data</h2>
                <p>
                  Kami tidak pernah dan tidak akan sama sekali menjual, menyewakan, atau memperdagangkan data peribadi anda kepada mana-mana pihak ketiga untuk tujuan pemasaran luar tanpa kebenaran anda.
                </p>

                <h2 className="text-base font-bold text-white">5. Hak Anda Di Bawah PDPA</h2>
                <p>
                  Anda berhak untuk meminta akses kepada data peribadi anda, membetulkan data yang tidak tepat, atau menarik balik persetujuan anda pada bila-bila masa dengan menghubungi pegawai privasi kami di <strong>support@telcohauz.com</strong>.
                </p>
              </div>
            </div>
          )}

          {mode === 'terms' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Terma & Syarat Perkhidmatan
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Kuat kuasa: 2026 • TelcoHauz Phone Enterprise
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-base font-bold text-white">1. Skop Perkhidmatan</h2>
                <p>
                  TelcoHauz Phone Enterprise menyediakan kemudahan dalam talian untuk penemuan, perbandingan harga objektif, serta bantuan penghantaran permohonan bagi perkhidmatan telekomunikasi dan utiliti rumah di Malaysia.
                </p>

                <h2 className="text-base font-bold text-white">2. Ketepatan Maklumat & Ketersediaan Port</h2>
                <p>
                  Semua maklumat pelan, harga bulanan, rebat dan promosi dirujuk daripada pengumuman awam rasmi syarikat pembekal. Walau bagaimanapun, pengesahan akhir ketersediaan pelabuhan (port) gentian optik, kuota promosi bulanan dan kelulusan pendaftaran adalah tertakluk kepada keputusan dan semakan teknikal syarikat penyedia perkhidmatan masing-masing di alamat premis anda.
                </p>

                <h2 className="text-base font-bold text-white">3. Tanggungjawab Pengguna</h2>
                <p>
                  Pengguna bertanggungjawab memastikan bahawa maklumat yang diberikan (nama, nombor telefon, alamat premis) adalah tepat dan benar. Pengguna juga mesti memastikan akaun telco terdahulu tidak mempunyai tunggakan bil sekiranya memohon pertukaran nombor secara MNP.
                </p>

                <h2 className="text-base font-bold text-white">4. Kontrak & Caj Pembatalan</h2>
                <p>
                  Perjanjian perkhidmatan internet adalah antara pengguna dan penyedia rangkaian yang dipilih (cth. TIME, TM, Maxis). Tempoh kontrak (biasanya 24 bulan) dan sebarang penalti pembatalan awal adalah tertakluk kepada terma dan syarat rasmi pembekal perkhidmatan tersebut. TelcoHauz tidak mengenakan sebarang caj yuran pembatalan sendiri.
                </p>
              </div>
            </div>
          )}

          {mode === 'disclaimer' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Penafian Bebas (Independent Disclaimer)
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Kenyataan Ketelusan TelcoHauz Phone Enterprise
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-200 text-xs">
                  <strong className="block mb-1">Pemberitahuan Utama:</strong>
                  Laman web ini diuruskan oleh <strong>TelcoHauz Phone Enterprise</strong>. Kami BUKAN pengendali rangkaian telekomunikasi rasmi dan TIDAK mendakwa sebagai pemilik kepada jenama-jenama telekomunikasi pihak ketiga.
                </div>

                <h2 className="text-base font-bold text-white">1. Taraf Bebas & Berkecuali</h2>
                <p>
                  TelcoHauz adalah platform perbandingan dan perundingan digital bebas untuk kemudahan pengguna di Malaysia. Kami membantu pengguna membandingkan pilihan pakej mengikut keperluan sebenar mereka dan memudahkan pendaftaran.
                </p>

                <h2 className="text-base font-bold text-white">2. Hak Milik Tanda Dagang</h2>
                <p>
                  Semua nama syarikat, jenama, logo dan tanda dagang yang dipaparkan di laman ini—termasuk tetapi tidak terhad kepada <strong>TIME dotCom, Telekom Malaysia (Unifi), Maxis, CelcomDigi, U Mobile, YES (YTL Communications), Astro, Cuckoo, Coway, Verdant Solar</strong>—adalah hak milik mutlak pemilik sah masing-masing. Penggunaan jenama-jenama ini adalah semata-mata untuk tujuan rujukan, deskripsi dan perbandingan objektif oleh pengguna awam mengikut prinsip "fair use".
                </p>

                <h2 className="text-base font-bold text-white">3. Tiada Pengesahan Eksklusif</h2>
                <p>
                  Kecuali dinyatakan secara sah dengan bukti surat pelantikan yang disahkan, TelcoHauz tidak mendakwa memiliki hubungan eksklusif atau menjadi wakil rasmi tunggal bagi mana-mana pihak ketiga.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
