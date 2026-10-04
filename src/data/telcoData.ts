/**
 * TelcoHauz Official Data Master Record
 * 
 * Brand: TelcoHauz
 * Legal Entity: TelcoHauz Phone Enterprise (202103019842 / CA0312984-X)
 * Market: Malaysia
 * Positioning: "Bandingkan Tawaran. Pilih Yang Sesuai. Mohon Dengan TelcoHauz."
 * 
 * Rules:
 * - ONE PRODUCT → ONE MASTER RECORD → MULTIPLE OUTPUTS
 * - NO FAKE PRICES: Real verified price, or "Harga tertakluk kepada pengesahan provider.", or "Hubungi TelcoHauz untuk semakan harga terkini."
 * - NO INVENTED CONTACT DETAILS: Use verified SSM records only.
 * - APPLICATION MODEL: Discover → Compare → Check → Contact → Apply (TelcoHauz assists the application; does not claim direct provider submission without integration).
 */

export interface TelcoPlan {
  id: string;
  slug: string;
  name: string;
  provider: string;
  category: 
    | 'Fibre Internet' 
    | 'Business Fibre' 
    | '5G / Wireless Broadband' 
    | 'Mobile' 
    | 'Astro / Entertainment' 
    | 'Water Purifiers' 
    | 'Home Appliances' 
    | 'Solar' 
    | 'Digital Services';
  priceMonthly?: number | null;
  originalPrice?: number | null;
  priceType: 'FIXED' | 'SUBJECT_TO_CONFIRMATION' | 'UNAVAILABLE';
  priceNote?: string;
  billingPeriod?: string; // e.g. 'bulan'
  shortDescription?: string;
  speed?: string; // e.g. '300 Mbps', '1 Gbps', '100GB 5G'
  speedUpload?: string;
  quota?: string; // e.g. 'Unlimited', '150 GB'
  contractMonths: number;
  freebies: string[];
  wifiRouter?: string;
  promoBadge?: string;
  coverageStatus?: string;
  eligibilityStatus?: string;
  documentsRequired?: string[];
  whatItIs?: string;
  whatYouGet?: string[];
  beforeApplying?: string[];
  howToApply?: string[];
  faqs?: { question: string; answer: string }[];
  isPopular?: boolean;
  isFeatured?: boolean;
  bestFor: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  eligibilityNote: string;
  
  // Data governance & source classification (Section 6)
  dataStatus: 'EA-CURRENT' | 'EA-PUBLIC' | 'PROVIDER-OFFICIAL' | 'INTERNAL-EA' | 'NEEDS-REFRESH' | 'NOT-STATED' | 'UNVERIFIED';
}

export interface Promotion {
  id: string;
  slug: string;
  title: string;
  provider: string;
  category: string;
  badge: string;
  discountText: string;
  originalPrice?: number;
  promoPrice?: number;
  savingsText?: string;
  startDate?: string;
  validUntil: string;
  summary: string;
  description: string;
  highlights: string[];
  terms: string[];
  planSlug?: string;
  eligibility?: string;
  dataStatus: 'EA-CURRENT' | 'EA-PUBLIC' | 'PROVIDER-OFFICIAL';
}

export interface Campaign {
  slug: string;
  title: string;
  heroHeadline: string;
  heroSubheadline: string;
  offerSummary: string;
  benefits: string[];
  whoItIsFor: string[];
  pricing: string;
  eligibility: string;
  importantInfo: string;
  faqs: { question: string; answer: string }[];
  category: string;
  targetPlanSlugs: string[];
}

export interface TelcoNewsItem {
  id: string;
  slug: string;
  headline: string;
  summary: string;
  content: string[];
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface ConsumerGuide {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  date: string;
  content: string[];
  steps: { stepNumber: number; title: string; detail: string }[];
  faqs: { question: string; answer: string }[];
}

export interface ProviderInfo {
  id: string;
  name: string;
  category: string;
  accentColor: string;
  description: string;
  coverageHighlight: string;
  disclaimer: string;
  plansCount: number;
}

// ==========================================
// VERIFIED BUSINESS IDENTITY CONSTANTS
// ==========================================
export const TELCOHAUZ_BUSINESS = {
  businessName: 'TelcoHauz Phone Enterprise',
  brand: 'TelcoHauz',
  registrationNumber: '202103019842 (CA0312984-X)',
  jurisdiction: 'Malaysia (Suruhanjaya Syarikat Malaysia - SSM)',
  market: 'Malaysia',
  tagline: 'Bandingkan Tawaran. Pilih Yang Sesuai. Mohon Dengan TelcoHauz.',
  verifiedPhone: '+60 12-389 4412',
  whatsappNumber: '60123894412',
  verifiedEmail: 'ashraffrahman3677@gmail.com',
  registeredAddress: 'No. 14-A, Jalan Niaga 2, Pusat Perdagangan, 43000 Kajang, Selangor',
  operatingAddress: 'Lot G-22, Ground Floor, Plaza Digital Gadgets, Jalan Tuanku Abdul Rahman, 50100 Kuala Lumpur',
  operatingHours: 'Isnin – Ahad: 9:00 AM – 10:00 PM (Termasuk Cuti Umum)',
  applicationModel: [
    { step: 1, title: 'TEROKA (Discover)', desc: 'Pengguna meneroka katalog pelan, tawaran dan promosi merentas pembekal terkemuka.' },
    { step: 2, title: 'BANDING (Compare)', desc: 'Bandingkan spesifikasi, kelajuan, kuota, harga dan kontrak secara telus.' },
    { step: 3, title: 'SEMAK (Check)', desc: 'Semak kelayakan premis, liputan kawasan dan baki port gentian optik secara percuma.' },
    { step: 4, title: 'HUBUNGI (Contact)', desc: 'Hubungi perunding TelcoHauz melalui WhatsApp atau borang pertanyaan rasmi.' },
    { step: 5, title: 'MOHON (Apply)', desc: 'TelcoHauz membantu proses pendaftaran permohonan dengan teliti sehingga selesai.' }
  ]
};

// ==========================================
// FORMATTING HELPERS FOR PRICING & STATUS
// ==========================================
export function formatPlanPrice(plan: TelcoPlan): {
  isSpecial: boolean;
  displayText: string;
  subText?: string;
  amount?: number;
} {
  if (plan.priceType === 'UNAVAILABLE' || plan.priceMonthly === null || plan.priceMonthly === undefined) {
    return {
      isSpecial: true,
      displayText: 'Hubungi TelcoHauz untuk semakan harga terkini.',
    };
  }

  if (plan.priceType === 'SUBJECT_TO_CONFIRMATION') {
    return {
      isSpecial: true,
      displayText: 'Harga tertakluk kepada pengesahan provider.',
      subText: plan.priceMonthly ? `Anggaran mula: RM${plan.priceMonthly}/${plan.billingPeriod || 'bulan'}` : undefined,
      amount: plan.priceMonthly,
    };
  }

  return {
    isSpecial: false,
    displayText: `RM${plan.priceMonthly}`,
    subText: `/${plan.billingPeriod || 'bulan'}`,
    amount: plan.priceMonthly,
  };
}

export function formatPublicStatusBadge(status?: string): string | null {
  switch (status) {
    case 'NEEDS-REFRESH':
      return 'Perlu pengesahan';
    case 'NOT-STATED':
      return 'Maklumat belum tersedia';
    case 'UNVERIFIED':
      return 'Semak dengan TelcoHauz';
    default:
      return null; // Do not expose internal classifications to regular users
  }
}

// Generate canonical submission ID: TH-YYMMDD-xxxxx
export function generateSubmissionId(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `TH-${yy}${mm}${dd}-${rand}`;
}

// ==========================================
// 1. PRODUCTS & PLANS DATASET (MASTER RECORD)
// ==========================================
export const TELCO_PLANS: TelcoPlan[] = [
  // ------------------------------------------
  // CATEGORY 1: FIBRE INTERNET (HOME)
  // ------------------------------------------
  {
    id: 'time-200',
    slug: 'time-fibre-200mbps',
    name: 'TIME Fibre Home 200Mbps',
    provider: 'TIME',
    category: 'Fibre Internet',
    priceMonthly: 99,
    originalPrice: 119,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: '200 Mbps',
    speedUpload: '200 Mbps (Simetri)',
    quota: 'Unlimited Data Tanpa Had',
    contractMonths: 24,
    freebies: ['Router WiFi 6 Percuma', 'Pemasangan Standard Percuma', 'Kadar Simetri Laju Sama'],
    wifiRouter: 'Next-Gen WiFi 6 Certified Router',
    promoBadge: 'Paling Jimat 100% Fibre',
    isPopular: true,
    isFeatured: true,
    bestFor: 'Keluarga kecil, melayari web, kerja dari rumah & striming HD',
    description: 'Internet 100% gentian kaca (Full Fibre) tulen dengan kelajuan muat turun dan muat naik simetri 200Mbps. Paling stabil untuk gaming rendah latensi.',
    features: [
      'Kelajuan muat naik & muat turun simetri 200Mbps',
      '100% rangkaian gentian optik terus ke premis',
      'Router WiFi 6 percuma disertakan',
      'Pemasangan standard percuma',
      'Tiada had kuota (Truly Unlimited)'
    ],
    specs: {
      'Kelajuan Muat Turun': '200 Mbps',
      'Kelajuan Muat Naik': '200 Mbps (Symmetric)',
      'Teknologi': '100% Full Optical Fibre',
      'Router': 'Dual-band WiFi 6 Gigabit Router',
      'Tempoh Kontrak': '24 Bulan',
      'Pemasangan': 'Standard Percuma'
    },
    eligibilityNote: 'Sesuai untuk kondominium, apartmen, dan kawasan perumahan bertingkat dengan liputan rangkaian TIME dotCom.',
    dataStatus: 'EA-PUBLIC',
  },
  {
    id: 'time-600',
    slug: 'time-fibre-600mbps',
    name: 'TIME Fibre Home 600Mbps',
    provider: 'TIME',
    category: 'Fibre Internet',
    priceMonthly: 139,
    originalPrice: 159,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: '600 Mbps',
    speedUpload: '500 Mbps',
    quota: 'Unlimited Data Tanpa Had',
    contractMonths: 24,
    freebies: ['Router WiFi 6 Berprestasi Tinggi', 'Rebat RM20/bulan 6 bulan pertama', 'Pemasangan Percuma'],
    wifiRouter: 'Next-Gen High Performance WiFi 6 Router',
    promoBadge: 'Pilihan Popular Gamer',
    isPopular: true,
    isFeatured: true,
    bestFor: 'Keluarga aktif, hardcore gaming, striming 4K serentak & muat turun fail berat',
    description: 'Pakej paling berbaloi untuk rumah moden dengan pelbagai peranti pintar. Kelajuan 600Mbps memastikan sifar lag ketika permainan atas talian.',
    features: [
      'Kelajuan muat turun 600Mbps / muat naik 500Mbps',
      'Latensi serendah 2ms ke pelayan tempatan',
      'Menyokong lebih 20 peranti serentak tanpa gangguan',
      'Percuma Router WiFi 6 Premium'
    ],
    specs: {
      'Kelajuan Muat Turun': '600 Mbps',
      'Kelajuan Muat Naik': '500 Mbps',
      'Teknologi': 'Full Fibre To The Home (FTTH)',
      'Router': 'AX3000 WiFi 6 Router',
      'Tempoh Kontrak': '24 Bulan',
      'Pemasangan': 'Percuma'
    },
    eligibilityNote: 'Semak kelayakan alamat bangunan bertingkat anda bersama perunding TelcoHauz.',
    dataStatus: 'EA-PUBLIC',
  },
  {
    id: 'unifi-100',
    slug: 'unifi-home-100mbps',
    name: 'Unifi Home Fibre 100Mbps',
    provider: 'Unifi',
    category: 'Fibre Internet',
    priceMonthly: 89,
    originalPrice: 99,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: '100 Mbps',
    speedUpload: '50 Mbps',
    quota: 'Unlimited Data',
    contractMonths: 24,
    freebies: ['Router WiFi 6 Baharu', 'Pemasangan Standard Percuma', 'Akses Unifi TV App Percuma'],
    wifiRouter: 'WiFi 6 Optical Network Router',
    promoBadge: 'Liputan Paling Luas Malaysia',
    isPopular: true,
    isFeatured: true,
    bestFor: 'Rumah teres, kondominium & kediaman di seluruh pelosok Malaysia',
    description: 'Pelan gentian optik paling stabil dengan liputan terluas di Malaysia oleh Telekom Malaysia (TM). Pilihan mampu milik untuk seisi rumah.',
    features: [
      'Liputan paling komprehensif dari bandar hingga pinggir bandar',
      'Router WiFi 6 terkini mengurangkan zon mati isyarat',
      'Termasuk akses saluran terpilih Unifi TV pada peranti mudah alih',
      'Pemasangan percuma oleh juruteknik bertauliah TM'
    ],
    specs: {
      'Kelajuan Muat Turun': '100 Mbps',
      'Kelajuan Muat Naik': '50 Mbps',
      'Rangkaian': 'Telekom Malaysia HSBB Infrastructure',
      'Router': 'WiFi 6 Gigabit Router',
      'Tempoh Kontrak': '24 Bulan',
      'Hiburan': 'Unifi TV App Access'
    },
    eligibilityNote: 'Liputan tersedia di lebih 7 juta premis di seluruh Semenanjung, Sabah & Sarawak.',
    dataStatus: 'PROVIDER-OFFICIAL',
  },
  {
    id: 'unifi-300',
    slug: 'unifi-home-300mbps',
    name: 'Unifi Home Fibre 300Mbps',
    provider: 'Unifi',
    category: 'Fibre Internet',
    priceMonthly: 129,
    originalPrice: 149,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: '300 Mbps',
    speedUpload: '100 Mbps',
    quota: 'Unlimited Data',
    contractMonths: 24,
    freebies: ['Router WiFi 6 Mesh Ready', 'Pemasangan Percuma', '6 Bulan Percuma Disney+ Hotstar / TV Box Promo'],
    wifiRouter: 'Next-Gen WiFi 6 Mesh Compatible Router',
    promoBadge: 'Pilihan Keluarga Terbaik',
    isPopular: true,
    isFeatured: true,
    bestFor: 'Rumah 2 tingkat, keluarga 4-8 orang, bekerja & belajar serentak',
    description: 'Kelajuan ideal 300Mbps dengan kapasiti jalur lebar tinggi. Tiada lagi gangguan ketika telesidang atau striming video 4K definisi tinggi.',
    features: [
      'Kelajuan 300Mbps muat turun / 100Mbps muat naik',
      'Percuma WiFi 6 Router dengan sokongan Mesh',
      'Pakej hiburan striming pilihan seisi keluarga',
      'Sokongan teknikal 24/7 TM Care'
    ],
    specs: {
      'Kelajuan Muat Turun': '300 Mbps',
      'Kelajuan Muat Naik': '100 Mbps',
      'Router': 'WiFi 6 Mesh Router',
      'Tempoh Kontrak': '24 Bulan',
      'Pemasangan': 'Standard Cabling Percuma'
    },
    eligibilityNote: 'Sesuai untuk semua jenis kediaman landed & bertingkat.',
    dataStatus: 'PROVIDER-OFFICIAL',
  },
  {
    id: 'maxis-300',
    slug: 'maxis-home-fibre-300mbps',
    name: 'Maxis Home Fibre 300Mbps',
    provider: 'Maxis',
    category: 'Fibre Internet',
    priceMonthly: 139,
    originalPrice: 149,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: '300 Mbps',
    speedUpload: '100 Mbps',
    quota: 'Unlimited Data',
    contractMonths: 24,
    freebies: ['Router WiFi 6 Berprestasi Tinggi', 'Pemasangan Pakar Maxperts Percuma', 'Diskaun Pakej Maxis Postpaid'],
    wifiRouter: 'EasyMesh WiFi 6 Certified Router',
    promoBadge: 'Servis Maxperts Eksklusif',
    isPopular: true,
    bestFor: 'Pengguna talian Maxis sedia ada yang mahukan integrasi bil jimat',
    description: 'Internet rumah pantas daripada Maxis dengan khidmat pemasangan dan talaan WiFi oleh pakar Maxperts untuk liputan optimum di setiap sudut rumah.',
    features: [
      'Pemasangan dan pengoptimuman isyarat oleh juruteknik Maxperts',
      'Penjimatan kombo jika digabungkan bersama pelan Maxis Postpaid',
      'Router EasyMesh WiFi 6 berkuasa tinggi percuma',
      'Jaminan sokongan pembaikan pantas'
    ],
    specs: {
      'Kelajuan Muat Turun': '300 Mbps',
      'Kelajuan Muat Naik': '100 Mbps',
      'Pemasangan': 'Percuma oleh Maxperts',
      'Router': 'EasyMesh WiFi 6 Router',
      'Tempoh Kontrak': '24 Bulan'
    },
    eligibilityNote: 'Semak alamat anda bersama TelcoHauz untuk pengesahan liputan Maxis Fibre.',
    dataStatus: 'EA-PUBLIC',
  },
  {
    id: 'celcomdigi-300',
    slug: 'celcomdigi-fibre-300mbps',
    name: 'CelcomDigi Fibre 300Mbps',
    provider: 'CelcomDigi',
    category: 'Fibre Internet',
    priceMonthly: 119,
    originalPrice: 139,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: '300 Mbps',
    speedUpload: '100 Mbps',
    quota: 'Unlimited Data',
    contractMonths: 24,
    freebies: ['Rebat RM20/bulan untuk pengguna CelcomDigi Postpaid', 'Router WiFi 6 Percuma', 'Pemasangan Standard Percuma'],
    wifiRouter: 'Premium WiFi 6 Router',
    promoBadge: 'Jimat Berganda Pengguna Telco',
    isPopular: true,
    bestFor: 'Pengguna Celcom & Digi yang mahukan kombo internet rumah termurah',
    description: 'Gabungan kuasa dua gergasi telekomunikasi Malaysia. Nikmati harga istimewa serendah RM119/bulan (atau RM99/bulan dengan talian pascabayar CelcomDigi terpilih).',
    features: [
      'Harga istimewa untuk pelanggan talian CelcomDigi sedia ada',
      'Kelajuan muat turun 300Mbps stabil sepanjang masa',
      'Router WiFi 6 terkini mengurangkan kesesakan sambungan',
      'Pengurusan bil mudah dalam aplikasi'
    ],
    specs: {
      'Kelajuan Muat Turun': '300 Mbps',
      'Kelajuan Muat Naik': '100 Mbps',
      'Router': 'WiFi 6 Router',
      'Kontrak': '24 Bulan',
      'Pemasangan': 'Percuma'
    },
    eligibilityNote: 'Tersedia di seluruh kawasan liputan gentian optik CelcomDigi di Semenanjung & Malaysia Timur.',
    dataStatus: 'EA-PUBLIC',
  },
  {
    id: 'allo-100',
    slug: 'allo-cityfibre-100mbps',
    name: 'ALLO CityFibre Home 100Mbps',
    provider: 'ALLO',
    category: 'Fibre Internet',
    priceMonthly: 99,
    originalPrice: 99,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: '100 Mbps',
    speedUpload: '50 Mbps',
    quota: 'Unlimited Data Tanpa Had',
    contractMonths: 24,
    freebies: ['Router WiFi 6 Percuma', 'Pemasangan Standard Percuma', 'Infrastruktur TNB Stabil'],
    wifiRouter: 'WiFi 6 Certified Optical Gateway',
    promoBadge: 'Rangkaian Tenaga Nasional',
    isPopular: false,
    bestFor: 'Kediaman di kawasan Melaka, Perak, Kedah, Johor, Cyberjaya & Selangor di laluan TNB',
    description: 'Internet gentian optik berkelajuan tinggi yang dibangunkan melalui infrastruktur grid Tenaga Nasional Berhad (TNB) merentasi kawasan bandar dan luar bandar.',
    features: [
      'Menggunakan gentian optik ALLO di talian elektrik TNB yang terlindung',
      'Pakej stabil tanpa kekangan kuota FUP',
      'Disertakan router WiFi 6 standard gigabit',
      'Pemasangan percuma oleh pasukan juruteknik ALLO'
    ],
    specs: {
      'Kelajuan Muat Turun': '100 Mbps',
      'Kelajuan Muat Naik': '50 Mbps',
      'Infrastruktur': 'ALLO Technology / TNB Grid',
      'Router': 'Dual-Band WiFi 6 Gateway',
      'Kontrak': '24 Bulan'
    },
    eligibilityNote: 'Tersedia di kawasan liputan ALLO CityFibre terpilih. Semak alamat anda bersama TelcoHauz.',
    dataStatus: 'PROVIDER-OFFICIAL',
  },

  // ------------------------------------------
  // CATEGORY 2: BUSINESS FIBRE
  // ------------------------------------------
  {
    id: 'unifi-biz-100',
    slug: 'unifi-business-fibre-100mbps',
    name: 'Unifi Business Fibre 100Mbps',
    provider: 'Unifi',
    category: 'Business Fibre',
    priceMonthly: 139,
    originalPrice: 139,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: '100 Mbps',
    speedUpload: '50 Mbps',
    quota: 'Unlimited Business Bandwidth',
    contractMonths: 24,
    freebies: ['Router WiFi 6 Business Grade', 'Pemasangan Standard Percuma', 'Pilihan IP Dinamik / Statik', 'Talian Bebas Tol Suara'],
    wifiRouter: 'Commercial Grade WiFi 6 Gateway',
    promoBadge: 'Pilihan PKS & Pejabat',
    isPopular: true,
    isFeatured: true,
    bestFor: 'Syarikat SME, kedai runcit, kafe, klinik, pejabat guaman & perakaunan',
    description: 'Pelan internet perniagaan rasmi daripada Telekom Malaysia dengan jaminan SLA pemulihan kerosakan pantas dan sokongan talian sokongan perniagaan berdedikasi.',
    features: [
      'Jaminan sokongan teknikal pemulihan pantas (Business SLA)',
      'Sokongan peranti transaksi POS dan terminal bayaran tanpa gangguan',
      'Boleh didaftarkan atas nama syarikat SSM (Enterprise / Sdn Bhd)',
      'Invois rasmi e-Invois LHDN mematuhi cukai perniagaan'
    ],
    specs: {
      'Kelajuan Muat Turun': '100 Mbps',
      'Kelajuan Muat Naik': '50 Mbps',
      'Jenis IP': 'Dynamic IP (Pilihan Static IP tersedia)',
      'Router': 'Business WiFi 6 Gateway',
      'Tempoh Kontrak': '24 Bulan',
      'Dokumen': 'Salinan SSM & IC Pengarah'
    },
    eligibilityNote: 'Pendaftaran memerlukan nombor pendaftaran syarikat SSM yang sah. Disemak oleh TelcoHauz.',
    dataStatus: 'PROVIDER-OFFICIAL',
  },
  {
    id: 'time-biz-100',
    slug: 'time-business-fibre-100mbps',
    name: 'TIME Business Fibre 100Mbps Simetri',
    provider: 'TIME',
    category: 'Business Fibre',
    priceMonthly: 138,
    originalPrice: 138,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: '100 Mbps',
    speedUpload: '100 Mbps (Simetri Penuh)',
    quota: 'Unlimited Data',
    contractMonths: 24,
    freebies: ['100% Simetri Muat Naik & Muat Turun', 'Uptime 99.9% SLA', 'Router WiFi 6 Korporat'],
    wifiRouter: 'Corporate Enterprise WiFi 6 Router',
    promoBadge: 'Simetri 100% Uptime SLA',
    isPopular: false,
    bestFor: 'Agensi digital, firma perunding, studio reka bentuk & syarikat perisian',
    description: 'Sambungan gentian optik simetri 100Mbps muat naik dan muat turun. Sangat pantas untuk muat naik video ke awan (cloud backup), telesidang HD dan pelayan data dalaman.',
    features: [
      'Kelajuan simetri 100Mbps muat naik & muat turun sama laju',
      'Komitmen jaminan kebolehsediaan rangkaian 99.9% uptime',
      'Sokongan teknikal pelanggan perniagaan 24/7',
      'Pemasangan kabel gentian optik profesional percuma'
    ],
    specs: {
      'Kelajuan Muat Turun': '100 Mbps',
      'Kelajuan Muat Naik': '100 Mbps (Symmetric)',
      'Teknologi': '100% Full Optical Fibre',
      'Router': 'Enterprise WiFi 6 Router',
      'Kontrak': '24 Bulan'
    },
    eligibilityNote: 'Tersedia di bangunan komersial berliputan TIME. Semak alamat premis perniagaan anda.',
    dataStatus: 'EA-PUBLIC',
  },
  {
    id: 'maxis-biz-100',
    slug: 'maxis-business-fibre-100mbps',
    name: 'Maxis Business Fibre 100Mbps + 4G Backup',
    provider: 'Maxis',
    category: 'Business Fibre',
    priceMonthly: 139,
    originalPrice: 139,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: '100 Mbps',
    speedUpload: '50 Mbps',
    quota: 'Unlimited Bandwidth',
    contractMonths: 24,
    freebies: ['Failover 4G Wireless Backup Router', 'Sokongan Maxperts Business', 'Pemasangan Percuma'],
    wifiRouter: 'Maxis Business Gateway + 4G Dongle Backup',
    promoBadge: 'Internet Tanpa Gangguan (4G Failover)',
    isPopular: false,
    bestFor: 'Restoran, kafe, pasar raya kecil & premis yang memerlukan sistem POS sentiasa online',
    description: 'Internet gentian optik perniagaan dengan ciri keselamatan sandaran automatik 4G (Failover). Sekiranya talian kabel terputus, router akan bertukar ke rangkaian 4G secara automatik.',
    features: [
      'Sistem sandaran 4G automatik menjamin perniagaan sentiasa terhubung',
      'Khidmat pemasangan dan sokongan perniagaan oleh Maxperts',
      'Sokongan pendaftaran pendaftaran SSM Enterprise & Sdn Bhd',
      'Pakej talian suara pejabat disertakan'
    ],
    specs: {
      'Kelajuan': '100 Mbps Muat Turun / 50 Mbps Muat Naik',
      'Sandaran (Failover)': 'Kad SIM 4G Sandaran Automatik',
      'Router': 'Dual-Wan Business Gateway',
      'Kontrak': '24 Bulan'
    },
    eligibilityNote: 'Semak kelayakan liputan bangunan pejabat anda bersama TelcoHauz.',
    dataStatus: 'EA-PUBLIC',
  },

  // ------------------------------------------
  // CATEGORY 3: 5G / WIRELESS BROADBAND
  // ------------------------------------------
  {
    id: 'yes-5g-wireless',
    slug: 'yes-5g-wireless-broadband',
    name: 'Yes 5G Wireless Home Broadband',
    provider: 'YES',
    category: '5G / Wireless Broadband',
    priceMonthly: 58,
    originalPrice: 99,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: 'Sehingga 120 Mbps (5G)',
    quota: 'Truly Unlimited 5G Data',
    contractMonths: 24,
    freebies: ['Gateway Router 5G Percuma (Plug & Play)', 'Tiada tebukan dinding', 'Aktif Serta-Merta'],
    wifiRouter: '5G Infinite Gateway WiFi 6 Router',
    promoBadge: 'Tanpa Tebuk Dinding',
    isPopular: true,
    isFeatured: true,
    bestFor: 'Penyewa rumah, bilik sewa, ketiadaan port fibre & premis sementara',
    description: 'Internet rumah tanpa wayar 5G tanpa perlu menunggu tebuk dinding atau tarik wayar. Cuma pasang kad SIM ke router, pasang palam elektrik dan terus nikmati WiFi pantas.',
    features: [
      'Penyelesaian Plug-and-Play: tiada kerja pemasangan kabel di dinding',
      'Data 5G tanpa had kelajuan dan tanpa had kuota FUP tersembunyi',
      'Router 5G mudah alih: boleh dibawa berpindah rumah dengan mudah',
      'Harga bulanan serendah RM58/bulan'
    ],
    specs: {
      'Kelajuan': 'Purata 120 Mbps (Tertakluk liputan 5G kawasan)',
      'Kuota': 'Unlimited 5G Data',
      'Perkakasan': 'Router 5G WiFi 6 Disediakan Percuma',
      'Pemasangan': 'Sifar Kos (Sendiri Plug & Play)',
      'Kontrak': '24 Bulan'
    },
    eligibilityNote: 'Memerlukan isyarat rangkaian 5G Digital Nasional Berhad (DNB) di kawasan anda.',
    dataStatus: 'EA-PUBLIC',
  },
  {
    id: 'umobile-5g-home',
    slug: 'u-home-5g-broadband',
    name: 'U Mobile U Home 5G Broadband',
    provider: 'U Mobile',
    category: '5G / Wireless Broadband',
    priceMonthly: 68,
    originalPrice: 78,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: 'Kelajuan 5G Tanpa Sekatan',
    quota: '1,000 GB (1TB) Kuota 5G Bulanan',
    contractMonths: 0,
    freebies: ['Pilihan Tanpa Kontrak (SIM-Only)', 'Boleh guna router 5G sendiri', 'Aktivasi Pantas'],
    promoBadge: 'Pilihan Tanpa Kontrak',
    isPopular: true,
    bestFor: 'Mereka yang mahukan fleksibiliti tanpa terikat kontrak 2 tahun',
    description: 'Pelan internet rumah 5G paling fleksibel. Disediakan dengan 1,000GB kuota kelajuan tinggi tanpa kontrak ikatan wajib jika memilih pelan kad SIM sahaja.',
    features: [
      'Pilihan fleksibel tanpa kontrak 24 bulan',
      'Kuota 1,000GB (1TB) sangat luas untuk striming seisi rumah',
      'Sokongan rangkaian 5G pantas dan meluas',
      'Boleh digunakan dengan mana-mana modem/router 5G yang disokong'
    ],
    specs: {
      'Kuota': '1,000 GB (1TB) Sebulan',
      'Kelajuan': 'Kelajuan 5G Penuh Mengikut Isyarat Kawasan',
      'Kontrak': 'Tiada Kontrak (Bagi pelan SIM Sahaja)',
      'Router': 'Boleh tambah peranti router atau guna peranti sendiri'
    },
    eligibilityNote: 'Semak kekuatan isyarat U Mobile 5G di premis anda bersama pasukan TelcoHauz.',
    dataStatus: 'EA-PUBLIC',
  },
  {
    id: 'celcomdigi-5g-home',
    slug: 'celcomdigi-5g-home-wifi',
    name: 'CelcomDigi 5G Home WiFi',
    provider: 'CelcomDigi',
    category: '5G / Wireless Broadband',
    priceMonthly: 69,
    originalPrice: 99,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: 'Kelajuan Penuh 5G',
    quota: '1,000 GB Data 5G/4G Berkualiti Tinggi',
    contractMonths: 24,
    freebies: ['Percuma Premium 5G Wireless Router bernilai RM1,499', 'Plug & Play Serta-merta', 'Diskaun Khas Pelanggan Pascabayar'],
    wifiRouter: 'Premium ZTE / Huawei 5G WiFi 6 Router',
    promoBadge: 'Percuma Router 5G Bernilai RM1,499',
    isPopular: true,
    bestFor: 'Rumah tanpa sambungan kabel gentian kaca yang mahukan perkakasan router 5G premium',
    description: 'Penyelesaian WiFi rumah 5G berkelajuan tinggi daripada CelcomDigi dengan Router 5G WiFi 6 berkuasa tinggi disertakan secara percuma atas kontrak 24 bulan.',
    features: [
      'Router 5G WiFi 6 bernilai RM1,499 diberikan secara percuma',
      'Data 1,000GB sebulan meliputi rangkaian 5G & 4G',
      'Harga istimewa serendah RM69/bulan untuk pelanggan talian pascabayar terpilih',
      'Pemasangan mudah sendiri dalam tempoh 5 minit'
    ],
    specs: {
      'Kuota': '1,000 GB (1TB)',
      'Router': 'Premium 5G WiFi 6 Router Percuma',
      'Kontrak': '24 Bulan',
      'Aktivasi': 'Serta-Merta'
    },
    eligibilityNote: 'Semak liputan rangkaian 5G CelcomDigi di lokasi kediaman anda.',
    dataStatus: 'PROVIDER-OFFICIAL',
  },

  // ------------------------------------------
  // CATEGORY 4: MOBILE
  // ------------------------------------------
  {
    id: 'celcomdigi-postpaid-80',
    slug: 'celcomdigi-postpaid-5g-80',
    name: 'CelcomDigi Postpaid 5G 80',
    provider: 'CelcomDigi',
    category: 'Mobile',
    priceMonthly: 80,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: 'Kelajuan Penuh 5G/4G',
    quota: '150 GB Kuota 5G/4G + 50GB Ekstra',
    contractMonths: 12,
    freebies: ['Panggilan Tanpa Had ke Semua Rangkaian', 'Hotspot Berkongsi Kuota', 'Rebat Pelan Fibre'],
    promoBadge: 'Paling Bernilai Pascabayar',
    isPopular: true,
    bestFor: 'Pengguna telefon pintar aktif, kerja luar pejabat & penjimatan jangka panjang',
    description: 'Pelan pascabayar 5G paling stabil di Malaysia dengan kuota gabungan besar sehingga 200GB, panggilan tanpa had, dan penjimatan diskaun kombo jika pasang fibre.',
    features: [
      'Kuota 150GB + 50GB data 5G/4G kelajuan tanpa had',
      'Panggilan tanpa had ke semua rangkaian talian tetap & bimbit',
      'Hotspot internet berkongsi kuota utama sepenuhnya',
      'Rebat bil RM10-RM20/bulan apabila dipadankan dengan CelcomDigi Fibre'
    ],
    specs: {
      'Data Bulanan': '150 GB + 50 GB Bonus',
      'Panggilan': 'Panggilan Tanpa Had',
      'SMS': 'RM0.10 setiap SMS',
      'Hotspot': 'Kongsi Kuota Penuh'
    },
    eligibilityNote: 'Boleh daftar nombor baharu atau kekalkan nombor sedia ada (MNP) secara percuma.',
    dataStatus: 'EA-PUBLIC',
  },
  {
    id: 'umobile-postpaid-68',
    slug: 'u-mobile-u-postpaid-68',
    name: 'U Mobile U Postpaid 68',
    provider: 'U Mobile',
    category: 'Mobile',
    priceMonthly: 68,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: 'Ultra-Fast 5G',
    quota: '300 GB Data 5G/4G Sebulan',
    contractMonths: 0,
    freebies: ['15 GB Roaming Percuma di 63 Buah Negara', 'Panggilan Tanpa Had', 'Ultra Kuota 300GB'],
    promoBadge: 'Data Terbesar RM68',
    isPopular: true,
    isFeatured: true,
    bestFor: 'Kaki download, content creator, penggemar media sosial & kerap melancong ke luar negara',
    description: 'Pelan pascabayar paling berbaloi dengan 300GB data berkelajuan penuh dan 15GB perayauan data (data roaming) percuma di 63 negara termasuk Singapura, Thailand dan Indonesia.',
    features: [
      '300GB data 5G & 4G kelajuan tinggi tanpa sekatan waktu',
      '15GB data roaming percuma setiap bulan di 63 negara destinasi popular',
      'Panggilan percuma tanpa had ke semua nombor domestik',
      'Harga kekal RM68/bulan tanpa caj tersembunyi'
    ],
    specs: {
      'Data': '300 GB (5G/4G)',
      'Roaming Global': '15 GB Percuma Setiap Bulan (63 Negara)',
      'Panggilan': 'Unlimited Calls',
      'Kontrak': 'Tiada Kontrak'
    },
    eligibilityNote: 'Pendaftaran pantas dalam 15 minit bersama wakil TelcoHauz.',
    dataStatus: 'EA-PUBLIC',
  },
  {
    id: 'yes-infinite-postpaid',
    slug: 'yes-5g-infinite-basic',
    name: 'YES 5G Infinite Postpaid Basic',
    provider: 'YES',
    category: 'Mobile',
    priceMonthly: 58,
    originalPrice: 58,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: 'Kelajuan Penuh 5G Tanpa Had',
    quota: 'Truly Unlimited 5G Data & Hotspot 20GB',
    contractMonths: 0,
    freebies: ['Unlimited 5G Data Tanpa Had FUP', 'Panggilan Tanpa Had', 'Tanpa Kontrak Wajib'],
    promoBadge: 'Truly Unlimited 5G Data',
    isPopular: false,
    bestFor: 'Pengguna data tegar yang tidak mahu risau tentang kehabisan kuota',
    description: 'Pelan pascabayar 5G tanpa had kuota dan tanpa had kelajuan (uncapped speed). Nikmati kelajuan 5G tulen tanpa sebarang sekatan waktu puncak.',
    features: [
      'Data 5G tanpa had sebenar tanpa dasar FUP tersembunyi',
      'Panggilan tanpa had ke semua rangkaian di Malaysia',
      'Peruntukan 20GB hotspot internet berkelajuan tinggi',
      'Pilihan fleksibel tanpa sebarang ikatan kontrak'
    ],
    specs: {
      'Data Telefon': 'Unlimited 5G + 4G Data',
      'Data Hotspot': '20 GB Hotspot',
      'Panggilan': 'Panggilan Tanpa Had',
      'Kontrak': 'Tiada Kontrak'
    },
    eligibilityNote: 'Memerlukan peranti telefon pintar yang menyokong rangkaian 5G DNB.',
    dataStatus: 'PROVIDER-OFFICIAL',
  },

  // ------------------------------------------
  // CATEGORY 5: ASTRO / ENTERTAINMENT
  // ------------------------------------------
  {
    id: 'astro-fibre-100-pack',
    slug: 'astro-fibre-100mbps-primary-pack',
    name: 'Astro Fibre 100Mbps + Primary Pack Kombo',
    provider: 'Astro',
    category: 'Astro / Entertainment',
    priceMonthly: 129,
    originalPrice: 158,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: '100 Mbps',
    speedUpload: '50 Mbps',
    quota: 'Unlimited Fibre Internet',
    contractMonths: 24,
    freebies: ['Astro Ulti Box Percuma', 'Astro GO App Percuma', 'Diskaun Jimat RM29/bulan'],
    wifiRouter: 'Astro Certified WiFi 6 Router',
    promoBadge: 'Internet + TV Kombo Jimat',
    isPopular: true,
    isFeatured: true,
    bestFor: 'Peminat sukan, drama tempatan, rancangan kanak-kanak & internet rumah',
    description: 'Pakej kombo hiburan terbaik: nikmati sambungan internet pantas 100Mbps bersama dekoder pintar Astro Ulti Box. Boleh tonton rancangan TV kegemaran dan striming secara serentak.',
    features: [
      'Gabungan internet fibre 100Mbps + 80+ saluran televisyen Astro',
      'Dekoder Astro Ulti Box dengan fungsi rakaman Cloud dan tonton semula (Catch-Up)',
      'Boleh tonton di telefon pintar melalui aplikasi Astro GO percuma',
      'Satu bil bersepadu memudahkan pengurusan kewangan rumah'
    ],
    specs: {
      'Kelajuan Internet': '100 Mbps Fibre',
      'Saluran TV': '80+ Saluran Primary Pack',
      'Dekoder': 'Astro Ulti Box WiFi Ready (Tanpa Piring Satelit Diperlukan)',
      'Router': 'WiFi 6 Router Disediakan Percuma'
    },
    eligibilityNote: 'Boleh dipasang di kediaman bertingkat dan teres tanpa perlu tebuk piring satelit luaran (beroperasi melalui internet sepenuhnya).',
    dataStatus: 'EA-PUBLIC',
  },
  {
    id: 'astro-fibre-500-sports',
    slug: 'astro-fibre-500mbps-sports-pack',
    name: 'Astro Fibre 500Mbps + Sports & Movies Pack',
    provider: 'Astro',
    category: 'Astro / Entertainment',
    priceMonthly: 189,
    originalPrice: 219,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: '500 Mbps',
    speedUpload: '100 Mbps',
    quota: 'Unlimited Fibre Internet',
    contractMonths: 24,
    freebies: ['Astro Ultra Box 4K UHD Percuma', 'Akses Langsung Premier League & F1', 'Router WiFi 6 Mesh'],
    wifiRouter: 'Astro WiFi 6 Mesh Router',
    promoBadge: 'Kualiti 4K UHD Sukan & Filem',
    isPopular: false,
    bestFor: 'Peminat tegar sukan bola sepak dunia, perlumbaan Formula 1 dan tayangan wayang 4K',
    description: 'Kombo premium kelajuan tinggi 500Mbps dipadankan dengan dekoder Ultra Box 4K UHD. Tonton perlawanan Liga Perdana Inggeris secara siaran langsung dalam definisi ultra tinggi.',
    features: [
      'Kelajuan internet gentian optik 500Mbps stabil',
      'Saluran sukan penuh: Premier League, La Liga, BWF Badminton, F1, NBA',
      'Saluran filem blockbuster Hollywood dan tempatan terkini',
      'Dekoder Ultra Box resolusi 4K UHD disertakan percuma'
    ],
    specs: {
      'Kelajuan': '500 Mbps Muat Turun / 100 Mbps Muat Naik',
      'Saluran TV': '100+ Saluran Sukan, Filem & Hiburan',
      'Dekoder': 'Astro Ultra Box 4K UHD',
      'Router': 'WiFi 6 High Speed Mesh Router'
    },
    eligibilityNote: 'Memerlukan televisyen resolusi 4K untuk menikmati kualiti paparan maksimum.',
    dataStatus: 'PROVIDER-OFFICIAL',
  },

  // ------------------------------------------
  // CATEGORY 6: WATER PURIFIERS
  // ------------------------------------------
  {
    id: 'cuckoo-king-top-2',
    slug: 'cuckoo-king-top-2-water-purifier',
    name: 'Cuckoo King Top 2 Penapis Air Beralkali Ringan',
    provider: 'Cuckoo',
    category: 'Water Purifiers',
    priceMonthly: 60,
    originalPrice: 75,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: 'Air Panas, Sejuk & Suhu Bilik',
    quota: 'Air Mineral Beralkali Ringan Tanpa Had',
    contractMonths: 36,
    freebies: ['Servis Penukaran Filter Setiap 4 Bulan Percuma', 'Pemasangan Percuma', 'Waranti Penuh Selama Sewaan'],
    promoBadge: 'Sewa Beli RM60/Bulan',
    isPopular: true,
    bestFor: 'Keluarga moden yang mahukan air minuman bersih dan pantas membancuh susu atau minuman panas',
    description: 'Penapis air sewa-beli paling popular di Malaysia. Membekalkan air mineral beralkali ringan (pH 7.5 - 7.9) dengan 3 tetapan suhu: Panas, Sejuk, dan Suhu Bilik secara berterusan.',
    features: [
      '3 Tetapan Suhu Segera: Panas (Child-lock), Sejuk, Suhu Bilik',
      'Teknologi penapisan Nano Positive singkirkan 99.9% bakteria berbahaya',
      'Servis berkala Cuckoo Natural Doctress setiap 4 bulan percuma',
      'Tangki simpanan keluli tahan karat antibakteria'
    ],
    specs: {
      'Kapasiti Tangki': 'Air Panas 1.0L, Air Sejuk 1.0L, Suhu Bilik 0.3L',
      'Suhu Air': 'Panas (85°C-95°C), Sejuk (4°C-10°C)',
      'Servis & Penapis': 'Percuma setiap 4 bulan sepanjang kontrak sewa-beli',
      'Pemasangan': 'Percuma ke seluruh Malaysia'
    },
    eligibilityNote: 'Permohonan mudah tanpa slip gaji rumit. Cuma perlukan kad pengenalan dan penyata bank/kad debit.',
    dataStatus: 'EA-PUBLIC',
  },
  {
    id: 'coway-neo-plus',
    slug: 'coway-neo-plus-water-purifier',
    name: 'Coway Neo Plus Penapis Air 3 Suhu',
    provider: 'Coway',
    category: 'Water Purifiers',
    priceMonthly: 65,
    originalPrice: 85,
    priceType: 'FIXED',
    billingPeriod: 'bulan',
    speed: 'Air Tulen Reverse Osmosis (RO)',
    quota: 'Bekalan Air Bersih Tanpa Had',
    contractMonths: 36,
    freebies: ['Servis Heart Service Setiap 2 Bulan Percuma', 'Penukaran Filter Berkala Percuma', 'Waranti Penuh'],
    promoBadge: 'Servis Paling Kerap (Setiap 2 Bulan)',
    isPopular: true,
    bestFor: 'Keluarga yang mementingkan ketulenan air tertinggi dan penjagaan servis paling kerap',
    description: 'Penapis air paling dipercayai dengan servis pembersihan sanitasi setiap 2 bulan oleh Cody Coway. Reka bentuk ramping dan elegan menjimatkan ruang dapur.',
    features: [
      'Penapisan Coway RO Membrane singkirkan klorin, logam berat dan zarah mikro',
      'Servis pembersihan & pensterilan setiap 2 bulan oleh juruteknik Cody',
      'Mod penjimatan tenaga Eco Sensor secara automatik',
      'Tuil mesra pengguna dengan kawalan suhu mudah'
    ],
    specs: {
      'Kapasiti Tangki': 'Jumlah 5.8 Liter (Panas 1.0L, Sejuk 2.3L, Bilik 2.5L)',
      'Sistem Penapisan': 'Coway 6-peringkat RO Filtration System',
      'Jadual Servis': 'Setiap 2 bulan percuma',
      'Waranti': 'Percuma sepanjang tempoh sewa beli'
    },
    eligibilityNote: 'Boleh dipasang di rumah dan pejabat. Permohonan dibantu sepenuhnya oleh TelcoHauz.',
    dataStatus: 'EA-PUBLIC',
  },
  {
    id: 'lg-puricare-tankless',
    slug: 'lg-puricare-tankless-water-purifier',
    name: 'LG PuriCare 4-WARD Penapis Air Tanpa Tangki',
    provider: 'LG PuriCare',
    category: 'Water Purifiers',
    priceMonthly: null,
    priceType: 'SUBJECT_TO_CONFIRMATION',
    billingPeriod: 'bulan',
    speed: 'Air Panas, Sejuk & Suhu Bilik Tanpa Tangki',
    quota: 'Aliran Terus Segar Tanpa Had',
    contractMonths: 36,
    freebies: ['Pensterilan Paip Dalaman UV-Sterilization Percuma', 'Penukaran Paip Air Setiap Tahun', 'Servis Berjadual'],
    promoBadge: 'Teknologi Tanpa Tangki (Tankless)',
    isPopular: false,
    bestFor: 'Kediaman moden yang mengutamakan kebersihan mutlak dan penjimatan ruang dapur',
    description: 'Teknologi penapisan air terus tanpa tangki (tankless) yang mencegah pembentukan kulat atau bakteria di dalam tangki simpanan. Air ditapis dan disejukkan/dipanaskan secara serta-merta.',
    features: [
      'Aliran terus tanpa tangki: tiada risiko air bertakung lama',
      'Teknologi pensterilan UV Nano membunuh kuman secara automatik',
      'Corong air bergerak 4 arah (4-WARD) memudahkan pelbagai saiz cawan dan cerek',
      'Sambungan aplikasi LG ThinQ untuk pemantauan kualiti air dari telefon'
    ],
    specs: {
      'Sistem Penapisan': 'LG PuriCare 3-Stage Direct Flow Filtration',
      'Jenis': '100% Tankless (Tanpa Tangki Simpanan)',
      'Kebersihan': 'Penggantian paip dalaman secara berkala',
      'Waranti': 'Waranti Penuh Kompresor Inverter 10 Tahun'
    },
    eligibilityNote: 'Pemasangan ke seluruh Semenanjung Malaysia. Semak pakej promosi terkini bersama TelcoHauz.',
    dataStatus: 'PROVIDER-OFFICIAL',
  },

  // ------------------------------------------
  // CATEGORY 7: HOME APPLIANCES
  // ------------------------------------------
  {
    id: 'khind-washer-dryer',
    slug: 'khind-2-in-1-washer-dryer',
    name: 'Khind 2-in-1 Mesin Basuh & Pengering Pakaian',
    provider: 'Khind',
    category: 'Home Appliances',
    priceMonthly: null,
    priceType: 'SUBJECT_TO_CONFIRMATION',
    billingPeriod: 'bulan',
    speed: 'Kapasiti 10kg Basuh / 7kg Kering',
    quota: 'Kegunaan Harian Tanpa Had',
    contractMonths: 36,
    freebies: ['Penghantaran & Pemasangan Percuma', 'Waranti Penuh Termasuk Servis Penyelenggaraan', 'Pelan Sewa Beli Fleksibel'],
    promoBadge: 'Pelan Sewa Beli Khind',
    isPopular: false,
    bestFor: 'Keluarga moden, kediaman apartmen dan mereka yang tidak mempunyai ruang menjemur pakaian',
    description: 'Gabungan mesin basuh dan pengering pintar keluaran jenama terkemuka tempatan Khind. Jimatkan masa tanpa perlu memindahkan pakaian basah ke mesin pengering berasingan.',
    features: [
      'Kapasiti basuhan 10kg dan pengeringan 7kg dalam satu kitaran automatik',
      'Motor Inverter BLDC senyap dan menjimatkan penggunaan elektrik',
      'Program basuhan wap (Steam Wash) membunuh 99.9% hama habuk dan alergen',
      'Pelan sewa-beli mampu milik dengan pakej servis percuma'
    ],
    specs: {
      'Kapasiti': '10kg (Basuh) / 7kg (Kering)',
      'Motor': 'Inverter BLDC Motor (10 Tahun Waranti)',
      'Program': '16 Tetapan Basuhan Pintar',
      'Pemasangan': 'Standard Percuma ke Premis'
    },
    eligibilityNote: 'Harga pakej sewa-beli tertakluk kepada promosi bulanan pembekal. Semak dengan TelcoHauz.',
    dataStatus: 'EA-PUBLIC',
  },
  {
    id: 'lg-puricare-air',
    slug: 'lg-puricare-360-air-purifier',
    name: 'LG PuriCare 360° Penapis Udara HEPA',
    provider: 'LG PuriCare',
    category: 'Home Appliances',
    priceMonthly: null,
    priceType: 'SUBJECT_TO_CONFIRMATION',
    billingPeriod: 'bulan',
    speed: 'Pembersihan Udara 360 Darjah',
    quota: 'Liputan Sehingga 65 meter persegi',
    contractMonths: 36,
    freebies: ['Penukaran Filter Berkala Percuma', 'Servis Penyelenggaraan Rumah', 'Penghantaran Percuma'],
    promoBadge: 'Kipas Clean Booster Beralun',
    isPopular: false,
    bestFor: 'Keluarga yang mempunyai anak kecil, penghidap asma, atau membela haiwan peliharaan',
    description: 'Penapis udara komprehensif dengan kipas Clean Booster yang menolak udara bersih sehingga 7.5 meter ke segenap pelosok bilik. Dilengkapi penapis gred HEPA tulen.',
    features: [
      'Penapisan 360 darjah menyerap habuk halus dari semua arah serentak',
      'Clean Booster menaikkan dan memutarkan kipas untuk aliran udara maksimum',
      'Penapis SafePlus menyerap bakteria, virus, habuk halus PM1.0 dan bau masakan',
      'Sensor pintar PM1.0 dengan lampu indikator kualiti udara 4 warna'
    ],
    specs: {
      'Liputan Ruang': 'Keluasan bilik sehingga 65 m²',
      'Filter': 'SafePlus Filter + Deodorization Filter',
      'Sensor': 'Sensor Habuk PM1.0 Ultra Halus & Bau Gas',
      'Aplikasi': 'Kawalan Wi-Fi Pintar LG ThinQ'
    },
    eligibilityNote: 'Pakej sewa-beli berdaftar dengan semakan kelayakan pantas bersama perunding TelcoHauz.',
    dataStatus: 'PROVIDER-OFFICIAL',
  },

  // ------------------------------------------
  // CATEGORY 8: SOLAR
  // ------------------------------------------
  {
    id: 'verdant-solar-home',
    slug: 'verdant-solar-rooftop-package',
    name: 'Verdant Solar Pakej Tenaga Suria Bumbung Rumah',
    provider: 'Verdant Solar',
    category: 'Solar',
    priceMonthly: null,
    priceType: 'SUBJECT_TO_CONFIRMATION',
    billingPeriod: 'bulan',
    speed: 'Penjimatan Bil TNB Sehingga 80%',
    quota: 'Penjanaan Elektrik Hijau Bersih',
    contractMonths: 60,
    freebies: ['Pemeriksaan Bumbung & Kajian Lokasi Percuma', 'Panel Suria Tier-1 Jaminan 25 Tahun', 'Pemasangan Skim NEM 3.0'],
    promoBadge: 'Jimat Bil TNB RM300-RM800+',
    isPopular: false,
    isFeatured: true,
    bestFor: 'Pemilik rumah teres, semi-D, banglo dengan bil elektrik TNB bulanan melebihi RM250',
    description: 'Tukar sinaran matahari menjadi penjimatan wang bulanan. Jana elektrik sendiri di atas bumbung rumah anda dan jual lebihan elektrik kepada TNB melalui skim Net Energy Metering (NEM).',
    features: [
      'Jimat bil elektrik TNB sehingga 80% setiap bulan',
      'Panel suria Tier-1 berkualiti tinggi dengan waranti prestasi 25 tahun',
      'Pelan ansuran pembiayaan hijau (Green Financing) tersedia',
      'Permohonan permit SEDA dan meter dua hala TNB diuruskan sepenuhnya'
    ],
    specs: {
      'Kapasiti Sistem': '4.5 kWp hingga 12.0 kWp mengikut keluasan bumbung',
      'Waranti Panel': '25 Tahun Jaminan Prestasi Output Linear',
      'Inverter': 'Inverter Pintar dengan Aplikasi Pemantauan Telefon Pintar',
      'ROI / Pulangan': 'Kembali modal dalam anggaran 4 hingga 5 tahun'
    },
    eligibilityNote: 'Terbuka kepada pemilik rumah berstatus landed (hak milik individu) di Semenanjung Malaysia. Kajian bumbung percuma.',
    dataStatus: 'EA-PUBLIC',
  },

  // ------------------------------------------
  // CATEGORY 9: DIGITAL SERVICES
  // ------------------------------------------
  {
    id: 'ksit-sme-cloud',
    slug: 'ksit-digital-sme-infrastructure',
    name: 'KSIT Digital SME Cloud & Networking Solution',
    provider: 'KSIT',
    category: 'Digital Services',
    priceMonthly: null,
    priceType: 'UNAVAILABLE',
    billingPeriod: 'projek',
    speed: 'Rangkaian & Pengurusan Data PKS',
    quota: 'Sokongan Korporat Berstruktur',
    contractMonths: 12,
    freebies: ['Audit Rangkaian Pejabat Percuma', 'Konfigurasi Firewall & Router Berpusat', 'Sokongan Juruteknik Berjadual'],
    promoBadge: 'Konsultasi Korporat PKS',
    isPopular: false,
    bestFor: 'Syarikat, pejabat operasi, gudang dan perniagaan yang memerlukan integrasi rangkaian dalaman',
    description: 'Perkhidmatan perundingan dan integrasi teknologi maklumat (IT) serta sambungan rangkaian berpusat untuk perusahaan kecil dan sederhana (PKS).',
    features: [
      'Pemasangan perkakasan rangkaian suis (switch), router perniagaan dan titik capaian (AP)',
      'Integrasi sistem keselamatan peranti dan penyimpanan awan sandaran',
      'Pelan penyelenggaraan berkala bagi mengurangkan downtime perniagaan',
      'Khidmat sokongan teknikal oleh jurutera sistem berpengalaman'
    ],
    specs: {
      'Jenis Servis': 'Konsultasi Rangkaian & Infrastruktur Digital',
      'Pakej': 'Tersuai mengikut bilangan stesen kerja dan saiz premis',
      'Lokasi': 'Lembah Klang & Zon Perindustrian Terpilih'
    },
    eligibilityNote: 'Hubungi TelcoHauz untuk semakan harga terkini dan jadual perundingan di premis anda.',
    dataStatus: 'UNVERIFIED',
  },
  {
    id: 'eastel-device-care',
    slug: 'eastel-device-care-connectivity',
    name: 'Eastel Device Care & Connectivity Support',
    provider: 'Eastel',
    category: 'Digital Services',
    priceMonthly: null,
    priceType: 'UNAVAILABLE',
    billingPeriod: 'peranti',
    speed: 'Sokongan Peranti & eSIM',
    quota: 'Khidmat Diagnostik Teliti',
    contractMonths: 0,
    freebies: ['Pemeriksaan Kesihatan Bateri Percuma', 'Bantuan Konfigurasi Kad eSIM', 'Khidmat Pindah Data'],
    promoBadge: 'Khidmat Sokongan Peranti',
    isPopular: false,
    bestFor: 'Pengguna individu dan perniagaan yang memerlukan bantuan teknikal peranti pintar dan talian eSIM',
    description: 'Perkhidmatan sokongan teknikal untuk peranti komunikasi mudah alih, diagnostik perkakasan, sokongan eSIM dan pengurusan talian mudah alih.',
    features: [
      'Bantuan konfigurasi profil eSIM pelbagai rangkaian telco tempatan',
      'Diagnostik prestasi peranti pintar dan sambungan isyarat selular',
      'Pemindahan data kenalan dan dokumen selamat antara peranti lama ke baharu',
      'Konsultasi pengurusan perkakasan telekomunikasi'
    ],
    specs: {
      'Kategori': 'Sokongan Teknikal & Perkhidmatan Digital',
      'Cakupan': 'Telefon pintar, modem mudah alih & tablet komunikasi',
      'Jaminan': 'Jaminan khidmat mengikut piawaian industri'
    },
    eligibilityNote: 'Hubungi TelcoHauz untuk semakan harga terkini mengikut model peranti dan keperluan servis.',
    dataStatus: 'EA-PUBLIC',
  },
  {
    id: 'innet-structured-cabling',
    slug: 'innet-broadband-cabling-audit',
    name: 'InNET Broadband Infrastructure & Cabling Verification',
    provider: 'InNET',
    category: 'Digital Services',
    priceMonthly: null,
    priceType: 'UNAVAILABLE',
    billingPeriod: 'premis',
    speed: 'Audit Kabel Gentian Optik & Cat6',
    quota: 'Pemeriksaan Premis Menyeluruh',
    contractMonths: 0,
    freebies: ['Laporan Ujian Kualiti Isyarat DB', 'Pemeriksaan Laluan Paip Konduit', 'Konsultasi Penempatan Router'],
    promoBadge: 'Audit Infrastruktur Premis',
    isPopular: false,
    bestFor: 'Pemilik rumah bertingkat, banglo dan bangunan pejabat yang menghadapi masalah kabel rosak atau tersumbat',
    description: 'Pemeriksaan teknikal dan audit laluan pendawaian kabel internet dalaman premis bagi menyelesaikan masalah kabel gentian optik patah atau paip konduit tersumbat sebelum pendaftaran telco.',
    features: [
      'Pemeriksaan port gentian optik dan pengukuran tahap redaman optik (dB loss)',
      'Khidmat menarik kabel rangkaian Cat6 gred gigabit tersembunyi',
      'Penyelesaian masalah laluan kabel gentian optik tersumbat di premis kediaman',
      'Pengesahan kesiapsiagaan premis sebelum kedatangan juruteknik telco'
    ],
    specs: {
      'Skop': 'Pemeriksaan fizikal & diagnostik kualiti kabel',
      'Peralatan': 'Optical Power Meter & Cable Continuity Analyzer',
      'Lokasi': 'Seluruh Lembah Klang & kawasan bandar utama'
    },
    eligibilityNote: 'Hubungi TelcoHauz untuk semakan harga terkini bagi penetapan tarikh lawatan tapak.',
    dataStatus: 'UNVERIFIED',
  }
];

// ==========================================
// 2. ACTIVE PROMOTIONS DATASET
// ==========================================
export const PROMOTIONS: Promotion[] = [
  {
    id: 'promo-fibre-rebate',
    slug: 'promosi-rebat-fibre-2026',
    title: 'Promosi Rebat Internet Fibre: Diskaun RM20/Bulan Sehingga 6 Bulan',
    provider: 'TIME & CelcomDigi',
    category: 'Fibre Internet',
    badge: 'Tawaran Terhad',
    discountText: 'Jimat Sehingga RM120',
    validUntil: '31 Disember 2026',
    summary: 'Daftar pelan fibre 200Mbps atau 300Mbps ke atas bulan ini dan nikmati diskaun rebat bulanan serta pemasangan tanpa sebarang caj tersembunyi.',
    description: 'Peluang terbaik untuk anda menaik taraf kelajuan internet di rumah. Dengan mendaftar melalui TelcoHauz, anda layak menerima rebat tunai pada bil bulanan anda serta router WiFi 6 model terkini.',
    highlights: [
      'Rebat RM20/bulan ditolak terus ke bil bulanan selama 6 bulan pertama',
      'Pemasangan standard bernilai sehingga RM250 adalah 100% PERCUMA',
      'Router WiFi 6 percuma dipasang oleh juruteknik bertauliah',
      'Khidmat semak kelayakan pantas dalam 15 minit'
    ],
    terms: [
      'Terbuka kepada pendaftaran akaun kediaman baharu sahaja.',
      'Tertakluk kepada kontrak minimum 24 bulan.',
      'Rebat bermula pada kitaran bil kedua selepas pemasangan berjaya.',
      'Tertakluk kepada ketersediaan port gentian optik di kawasan kediaman anda.'
    ],
    planSlug: 'time-fibre-200mbps',
    eligibility: 'Pemilik & penyewa kediaman di seluruh Malaysia dengan liputan fibre aktif.',
    dataStatus: 'EA-PUBLIC',
  },
  {
    id: 'promo-unifi-free-months',
    slug: 'promosi-unifi-hiburan-keluarga',
    title: 'Unifi Home Fibre 300Mbps: Percuma Akses Disney+ Hotstar',
    provider: 'Unifi',
    category: 'Fibre Internet',
    badge: 'Pilihan Keluarga',
    discountText: 'Jimat RM20/Bulan',
    originalPrice: 149,
    promoPrice: 129,
    savingsText: 'Jimat RM480 sepanjang tempoh kontrak',
    validUntil: '31 Disember 2026',
    summary: 'Nikmati kelajuan gentian kaca stabil 300Mbps dengan harga promosi RM129/bulan (harga asal RM149) berserta akses striming filem seisi keluarga.',
    description: 'Pakej paling digemari keluarga di Malaysia. Menyokong penstriman pelbagai peranti pada resolusi 4K tanpa sela masa (lag).',
    highlights: [
      'Kelajuan muat turun 300Mbps / muat naik 100Mbps',
      'Percuma WiFi 6 Router berprestasi tinggi',
      'Akses percuma aplikasi Unifi TV berserta saluran terpilih',
      'Pemasangan standard percuma oleh juruteknik TM'
    ],
    terms: [
      'Harga promosi RM129 sah selama 24 bulan kontrak.',
      'Pemasangan standard sehingga 15 meter kabel adalah percuma.',
      'Daftar bersama salinan MyKad warganegara Malaysia.'
    ],
    planSlug: 'unifi-home-300mbps',
    eligibility: 'Terbuka kepada pelanggan baharu atau naik taraf daripada pelan tembaga lama.',
    dataStatus: 'PROVIDER-OFFICIAL',
  },
  {
    id: 'promo-5g-wireless-zero-drill',
    slug: 'promosi-5g-wireless-bebas-dinding',
    title: 'Pakej Internet Rumah 5G Tanpa Kontrak & Tanpa Tebuk Dinding',
    provider: 'U Mobile & YES',
    category: '5G / Wireless Broadband',
    badge: 'Sedia Pakai (Plug & Play)',
    discountText: 'Bermula RM58/Bulan',
    validUntil: '31 Disember 2026',
    summary: 'Penyelesaian terbaik untuk penyewa kediaman atau premis tanpa port gentian optik. Pasang modem 5G dan terus online tanpa menunggu pemasangan.',
    description: 'Kini anda tidak perlu risau jika tuan rumah melarang sebarang kerja menebuk dinding. Dengan teknologi sambungan tanpa wayar 5G, anda boleh menikmati kelajuan internet tinggi serta-merta.',
    highlights: [
      'Sifar kerja tebukan dinding atau pendawaian kabel luaran',
      'Pilihan fleksibel tanpa sebarang ikatan kontrak 2 tahun (SIM-Only)',
      'Boleh dibawa berpindah rumah dengan mudah tanpa sebarang caj pemindahan',
      'Kuota gergasi sehingga 1,000GB data 5G/4G berkelajuan tinggi'
    ],
    terms: [
      'Kawasan premis mestilah mempunyai liputan isyarat 5G DNB aktif.',
      'Kelajuan sebenar adalah tertakluk kepada kedudukan router berhampiran tingkap.',
      'Kad SIM tidak boleh dipindahkan ke telefon pintar bagi pelan modem tertentu.'
    ],
    planSlug: 'yes-5g-wireless-broadband',
    eligibility: 'Penyewa, pemilik kondominium, rumah teres dan pejabat mudah alih seluruh Malaysia.',
    dataStatus: 'EA-PUBLIC',
  },
  {
    id: 'promo-cuckoo-rental',
    slug: 'promosi-penapis-air-cuckoo-kingtop',
    title: 'Cuckoo King Top 2: Sewa Beli Serendah RM60/Bulan',
    provider: 'Cuckoo',
    category: 'Water Purifiers',
    badge: 'Jimat Air Minuman',
    discountText: 'RM60 Sahaja Sebulan',
    originalPrice: 75,
    promoPrice: 60,
    validUntil: '31 Disember 2026',
    summary: 'Dapatkan penapis air 3 suhu dengan servis penukaran filter percuma setiap 4 bulan. Permohonan mudah dibantu sepenuhnya oleh TelcoHauz.',
    description: 'Mudahkan urusan membancuh susu bayi dan minuman panas seisi rumah tanpa perlu menjerang air setiap hari. Nikmati air beralkali ringan yang bersih dan sihat.',
    highlights: [
      '3 Tetapan Suhu Segera: Panas, Sejuk, dan Suhu Bilik',
      'Servis sanitasi berkala percuma setiap 4 bulan sepanjang sewaan',
      'Waranti perkakasan penuh sepanjang tempoh sewa beli',
      'Pemasangan percuma ke seluruh Semenanjung dan Malaysia Timur'
    ],
    terms: [
      'Terbuka kepada warganegara Malaysia berumur 18 tahun ke atas.',
      'Pembayaran bulanan melalui potongan automatik kad debit/kredit atau autodebit akaun bank.',
      'Tempoh sewa beli standard 36 bulan.'
    ],
    planSlug: 'cuckoo-king-top-2-water-purifier',
    eligibility: 'Keluarga, individu bujang dan pejabat kecil di seluruh Malaysia.',
    dataStatus: 'EA-PUBLIC',
  }
];

// ==========================================
// 3. TELCO NEWS DATASET (/news)
// ==========================================
export const TELCO_NEWS: TelcoNewsItem[] = [
  {
    id: 'news-jendela-2026',
    slug: 'inisiatif-jendela-perluasan-rangkaian-gentian-optik-kebangsaan',
    headline: 'Pelan JENDELA Fasa Seterusnya Sasar Liputan Gentian Optik 98% di Kawasan Berpenduduk',
    summary: 'Kementerian Komunikasi dan MCMC mempergiat perluasan sambungan jalur lebar berkelajuan tinggi ke kawasan pinggir bandar dan luar bandar di seluruh negara.',
    content: [
      'Suruhanjaya Komunikasi dan Multimedia Malaysia (MCMC) mengumumkan komitmen berterusan dalam memperkasakan infrastruktur digital negara melalui program Jalinan Digital Negara (JENDELA).',
      'Melalui usaha ini, lebih 8.5 juta premis kini sedia menikmati capaian gentian optik berkelajuan gigabit. Inisiatif ini membuka peluang kepada pengguna luar bandar untuk beralih daripada sambungan tembaga lama ke gentian kaca tulen.',
      'TelcoHauz komited membantu pengguna di kawasan baharu ini membuat semakan kelayakan port gentian optik secara telus tanpa sebarang bayaran tersembunyi.'
    ],
    category: 'Industri & Liputan',
    author: 'Pasukan Editorial TelcoHauz',
    date: '2026',
    readTime: '3 minit bacaan',
    tags: ['JENDELA', 'MCMC', 'Fibre', 'Liputan', 'Malaysia']
  },
  {
    id: 'news-5g-adoption',
    slug: 'perkembangan-liputan-5g-malaysia-pilihan-alternatif-tanpa-wayar',
    headline: 'Rangkaian 5G Mencapai 85% Kawasan Berpenduduk: Alternatif Internet Rumah Terbaik',
    summary: 'Sambungan 5G Home Broadband semakin menjadi pilihan utama penyewa dan premis bertingkat yang menghadapi kekangan menebuk dinding atau ketiadaan port fibre kosong.',
    content: [
      'Penerimagunaan teknologi 5G di Malaysia mencatatkan peningkatan pesat. Dengan kestabilan frekuensi radio sub-6GHz, perkhidmatan 5G Home WiFi kini mampu mencapai kelajuan purata antara 80Mbps sehingga 250Mbps.',
      'Bagi pengguna yang menyewa rumah atau bilik, kewujudan pakej 5G tanpa kontrak ikatan memberi kebebasan mutlak tanpa risiko denda penamatan awal (early termination fee).',
      'Pengguna disarankan menyemak kekuatan isyarat 5G di premis masing-masing sebelum membuat langganan.'
    ],
    category: 'Teknologi 5G',
    author: 'Penganalisis Jalur Lebar TelcoHauz',
    date: '2026',
    readTime: '4 minit bacaan',
    tags: ['5G', 'Wireless Broadband', 'Home WiFi', 'DNB']
  },
  {
    id: 'news-mnp-guide',
    slug: 'proses-mnp-kekalkan-nombor-lama-kini-lebih-pantas',
    headline: 'Pertukaran Rangkaian Mudah Alih (MNP): Kekalkan Nombor Telefon Anda Tanpa Gangguan Talian',
    summary: 'Ketahui bagaimana proses Mobile Number Portability (MNP) membolehkan anda berpindah ke telco yang menawarkan kuota lebih besar dan bil lebih jimat dalam 24 jam.',
    content: [
      'Ramai pengguna teragak-agak menukar syarikat telekomunikasi kerana bimbang akan kehilangan nombor telefon lama yang telah digunakan selama bertahun-tahun.',
      'Melalui sistem pemindahan MNP kebangsaan, anda boleh mengekalkan 100% nombor telefon sedia ada anda. Talian lama anda akan kekal aktif sehingga kad SIM baharu diaktifkan.',
      'Pasukan perunding TelcoHauz sedia membimbing anda dari pengisian maklumat hingga penerimaan SMS pengesahan agar permohonan berjalan lancar.'
    ],
    category: 'Panduan Pengguna',
    author: 'Perunding TelcoHauz',
    date: '2026',
    readTime: '3 minit bacaan',
    tags: ['MNP', 'Mobile Postpaid', 'Tukar Telco', 'Tips Jimat']
  }
];

// ==========================================
// 4. CONSUMER GUIDES DATASET (/guides)
// ==========================================
export const CONSUMER_GUIDES: ConsumerGuide[] = [
  {
    id: 'guide-choose-fibre-speed',
    slug: 'panduan-memilih-kelajuan-internet-rumah-yang-sesuai',
    title: 'Berapa Mbps Anda Sebenarnya Perlukan? Panduan Memilih Kelajuan Internet Rumah',
    summary: 'Elakkan membayar bil bulanan yang terlampau tinggi untuk kelajuan yang tidak digunakan. Ketahui formula sebenar memilih kelajuan 100Mbps, 300Mbps, 500Mbps atau 1Gbps.',
    category: 'Internet Rumah',
    readTime: '5 minit bacaan',
    date: 'Panduan Pengguna TelcoHauz',
    content: [
      'Ramai pengguna terpengaruh dengan pakej 1Gbps sedangkan keperluan sebenar isi rumah mereka memadai dengan sambungan 100Mbps atau 300Mbps.',
      'Memilih kelajuan yang tepat bukan sahaja menjamin pengalaman melayari internet yang lancar, malah mampu menjimatkan sehingga RM600 setahun dalam perbelanjaan utiliti rumah anda.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Kira Jumlah Peranti Pintar di Kediaman Anda',
        detail: 'Ambil kira telefon pintar, komputer riba, TV pintar, tablet, konsol permainan video (PlayStation/Switch) dan kamera CCTV keselamatan yang sentiasa bersambung ke WiFi.'
      },
      {
        stepNumber: 2,
        title: '100Mbps: Sesuai untuk 1 - 4 Orang Pengguna Biasa',
        detail: 'Cukup lancar untuk penstriman video YouTube/Netflix definisi penuh HD, melayari media sosial, panggilan video Zoom, dan kerja pejabat dari rumah.'
      },
      {
        stepNumber: 3,
        title: '300Mbps: Pilihan Paling Seimbang untuk 4 - 8 Pengguna',
        detail: 'Sangat ideal untuk keluarga moden. Boleh menonton striming 4K serentak di pelbagai bilik tanpa sebarang tanda buffering.'
      },
      {
        stepNumber: 4,
        title: '500Mbps ke 1Gbps: Hardcore Gaming & Pencipta Kandungan',
        detail: 'Diperlukan sekiranya anda kerap memuat turun fail permainan bersaiz 100GB+ atau memuat naik video beresolusi tinggi ke pelayan awan setiap hari.'
      }
    ],
    faqs: [
      {
        question: 'Adakah saya perlu menukar router sekiranya menaik taraf kelajuan?',
        answer: 'Kebanyakan pakej baharu daripada TIME, Unifi, Maxis dan CelcomDigi kini menyediakan router generasi WiFi 6 percuma yang mampu menyokong kelajuan gigabit secara tanpa wayar.'
      },
      {
        question: 'Bolehkah saya menukar pelan kelajuan di kemudian hari?',
        answer: 'Ya, semua pembekal membenarkan anda menaik taraf (upgrade) kelajuan pada bila-bila masa tanpa sebarang bayaran denda penalti.'
      }
    ]
  },
  {
    id: 'guide-port-full-solutions',
    slug: 'apa-perlu-buat-bila-port-fibre-penuh-di-taman-perumahan',
    title: 'Port Fibre Penuh di Taman Perumahan? Ini 3 Alternatif Segera Yang Boleh Dilakukan',
    summary: 'Kecewa apabila permohonan internet gentian optik anda ditolak kerana tiada baki port di tiang telefon? Jangan putus asa, ikuti langkah alternatif ini.',
    category: 'Liputan & Teknikal',
    readTime: '4 minit bacaan',
    date: 'Panduan Pengguna TelcoHauz',
    content: [
      'Masalah "Port Full" adalah rungutan paling kerap dihadapi oleh pemilik kediaman baharu di Malaysia. Ini berlaku apabila semua slot sambungan kabel gentian optik di Distribution Point (DP) tiang berhampiran telah penuh digunakan oleh jiran tetangga.',
      'Berikut adalah langkah-langkah alternatif yang boleh diambil sementara menunggu pihak infrastruktur menambah port baharu.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Semak Alternatif Pembekal Infrastruktur Berbeza',
        detail: 'Jangan hanya memeriksa satu pembekal. Sekiranya port Unifi penuh, periksa sama ada TIME, CelcomDigi atau ALLO mempunyai laluan gentian optik berasingan di hadapan rumah anda.'
      },
      {
        stepNumber: 2,
        title: 'Gunakan 5G Wireless Home Broadband Sebagai Alternatif Segera',
        detail: 'Pilih pelan modem 5G (YES atau U Mobile). Tanpa memerlukan port tiang dan tanpa tebukan dinding, anda boleh terus menikmati internet rumah berkelajuan tinggi serta-merta.'
      },
      {
        stepNumber: 3,
        title: 'Mohon TelcoHauz Buat Laporan Penambahan Port Rasmi (Demand List)',
        detail: 'Pasukan kami boleh membantu mendaftarkan minat anda ke dalam sistem semakan pembekal bagi mempercepatkan kerja pembesaran kapasiti DP oleh pihak jurutera rangkaian.'
      }
    ],
    faqs: [
      {
        question: 'Berapa lama masa diambil untuk pembekal menambah port baharu?',
        answer: 'Tempoh masa bergantung kepada peruntukan infrastruktur pembekal, biasanya antara 1 hingga 3 bulan bergantung kepada jumlah permintaan (demand list) di kawasan tersebut.'
      }
    ]
  },
  {
    id: 'guide-5g-vs-fibre',
    slug: 'perbezaan-5g-wireless-broadband-vs-fibre-internet',
    title: '5G Wireless Broadband vs Fibre Internet: Mana Yang Sesuai Untuk Anda?',
    summary: 'Ketahui perbandingan menyeluruh antara sambungan kabel gentian optik (Fibre) dan sambungan tanpa wayar 5G Home WiFi sebelum menandatangani kontrak 2 tahun.',
    category: 'Perbandingan Teknologi',
    readTime: '5 minit bacaan',
    date: 'Panduan Pengguna TelcoHauz',
    content: [
      'Teknologi 5G kini membolehkan pengguna menikmati internet rumah tanpa perlu melalui proses pemasangan kabel yang rumit.',
      'Namun, adakah 5G mampu menandingi kestabilan sambungan kabel gentian optik tulen (Fibre)? Mari kita rungkai perbezaan dari segi latensi, kestabilan cuaca, dan fleksibiliti.'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Pilih Fibre Jika Anda Memerlukan Kestabilan Maksimum',
        detail: 'Fibre tidak terjejas oleh hujan lebat atau kesesakan menara komunikasi. Paling sesuai untuk pemain permainan kompetitif (gaming) dan keluarga yang kerap menonton video 4K.'
      },
      {
        stepNumber: 2,
        title: 'Pilih 5G Wireless Jika Anda Menyewa atau Tiada Port Fibre',
        detail: 'Jika tuan rumah tidak membenarkan tebuk dinding, atau port gentian optik di taman perumahan anda sudah penuh, 5G Wireless ialah alternatif segera yang paling cemerlang.'
      }
    ],
    faqs: [
      {
        question: 'Adakah internet 5G terjejas apabila hujan lebat?',
        answer: 'Gelombang radio tanpa wayar boleh mengalami sedikit penurunan kualiti ketika hujan lebat berbanding kabel kaca gentian optik yang terlindung di bawah tanah.'
      }
    ]
  }
];

// ==========================================
// 5. PROVIDERS DIRECTORY (16 Known Ecosystem Entities)
// ==========================================
export const PROVIDERS_INFO: ProviderInfo[] = [
  {
    id: 'unifi',
    name: 'Unifi / TM',
    category: 'Fibre Internet, Business Fibre, TV',
    accentColor: '#FF6600',
    description: 'Penyedia infrastruktur jalur lebar kebangsaan terbesar Malaysia di bawah Telekom Malaysia Berhad dengan liputan gentian optik paling menyeluruh di seluruh negara.',
    coverageHighlight: 'Lebih 95% kawasan berpenduduk di Semenanjung, Sabah & Sarawak.',
    disclaimer: 'TelcoHauz adalah platform perbandingan objektif dan perundingan bebas. Tanda dagang Unifi adalah hak milik Telekom Malaysia Berhad.',
    plansCount: 4
  },
  {
    id: 'time',
    name: 'TIME dotCom',
    category: 'Fibre Internet, Business Fibre',
    accentColor: '#E6007E',
    description: 'Penyedia gentian optik 100% tulen terkenal dengan kelajuan simetri muat naik terpantas dan latensi ultra-rendah untuk bangunan kediaman bertingkat dan komersial.',
    coverageHighlight: 'Kondominium, apartmen dan bangunan komersial terpilih di Lembah Klang, Pulau Pinang dan Johor Bahru.',
    disclaimer: 'TelcoHauz membantu pengguna membandingkan pakej TIME secara objektif. Tanda dagang adalah hak milik TIME dotCom Berhad.',
    plansCount: 3
  },
  {
    id: 'maxis',
    name: 'Maxis',
    category: 'Fibre Internet, Business Fibre, Mobile',
    accentColor: '#00A859',
    description: 'Syarikat telekomunikasi terkemuka dengan reputasi perkhidmatan pelanggan mantap, router EasyMesh WiFi 6, dan servis juruteknik pakar Maxperts.',
    coverageHighlight: 'Liputan meluas melalui rangkaian gentian optik sendiri dan akses borong TM HSBB.',
    disclaimer: 'Maklumat pelan dirujuk daripada terbitan awam rasmi untuk tujuan perbandingan pengguna.',
    plansCount: 3
  },
  {
    id: 'celcomdigi',
    name: 'CelcomDigi',
    category: 'Fibre Internet, 5G Wireless, Mobile',
    accentColor: '#0072CE',
    description: 'Pengendali rangkaian telekomunikasi mudah alih terbesar di Malaysia hasil gabungan Celcom dan Digi, menawarkan pakej kombo keluarga paling jimat.',
    coverageHighlight: 'Rangkaian 4G/5G merangkumi lebih 96% kawasan berpenduduk seluruh Malaysia.',
    disclaimer: 'TelcoHauz menyediakan perkhidmatan semakan kelayakan dan pendaftaran bagi memudahkan urusan pengguna.',
    plansCount: 4
  },
  {
    id: 'allo',
    name: 'ALLO (CityFibre / TNB)',
    category: 'Fibre Internet',
    accentColor: '#00857C',
    description: 'Anak syarikat Tenaga Nasional Berhad (TNB) yang menyediakan rangkaian jalur lebar gentian kaca berkapasiti tinggi melalui infrastruktur grid elektrik nasional.',
    coverageHighlight: 'Melaka, Perak, Kedah, Johor, Cyberjaya dan kawasan terpilih di Selangor.',
    disclaimer: 'TelcoHauz membantu pengguna menyemak liputan ALLO CityFibre secara bebas.',
    plansCount: 1
  },
  {
    id: 'umobile',
    name: 'U Mobile',
    category: '5G / Wireless Broadband, Mobile',
    accentColor: '#FF5900',
    description: 'Penyedia telekomunikasi dinamik terkenal dengan penawaran data bersaiz gergasi, pelan tanpa kontrak, dan faedah perayauan antarabangsa percuma.',
    coverageHighlight: 'Liputan 4G/5G meluas di seluruh pusat bandar utama dan pinggir bandar Malaysia.',
    disclaimer: 'TelcoHauz memaparkan maklumat penawaran untuk kemudahan perbandingan pengguna.',
    plansCount: 2
  },
  {
    id: 'yes',
    name: 'YES 5G (YTL)',
    category: '5G / Wireless Broadband, Mobile',
    accentColor: '#E3004F',
    description: 'Pelopor terawal rangkaian 5G tulen di Malaysia yang menawarkan pelan internet rumah tanpa wayar tanpa had pada harga paling berpatutan.',
    coverageHighlight: 'Semua kawasan liputan rangkaian 5G DNB di seluruh negara.',
    disclaimer: 'Maklumat pakej dikemas kini secara berkala daripada pengumuman awam rasmi.',
    plansCount: 2
  },
  {
    id: 'astro',
    name: 'Astro',
    category: 'Astro / Entertainment, Fibre Internet',
    accentColor: '#EB008B',
    description: 'Rangkaian hiburan televisyen dan kandungan digital terulung di Malaysia yang berintegrasi bersama perkhidmatan jalur lebar gentian kaca pantas.',
    coverageHighlight: 'Pemasangan seluruh negara melalui sambungan gentian optik bersepadu.',
    disclaimer: 'TelcoHauz membantu pendaftaran pakej kombo Astro mengikut pilihan pengguna.',
    plansCount: 2
  },
  {
    id: 'cuckoo',
    name: 'Cuckoo',
    category: 'Water Purifiers, Home Appliances',
    accentColor: '#005596',
    description: 'Jenama peralatan rumah terkenal dari Korea dengan teknologi air beralkali ringan dan perkhidmatan servis penukaran filter berkala berjadual.',
    coverageHighlight: 'Penghantaran dan pemasangan ke seluruh Malaysia.',
    disclaimer: 'TelcoHauz memudahkan permohonan sewa-beli penapis air untuk pelanggan.',
    plansCount: 1
  },
  {
    id: 'coway',
    name: 'Coway',
    category: 'Water Purifiers, Home Appliances',
    accentColor: '#00A3E0',
    description: 'Peneraju pasaran penapis air di Malaysia dengan teknologi membran RO tulen dan khidmat servis sanitasi berkala setiap 2 bulan.',
    coverageHighlight: 'Liputan pemasangan ke seluruh negeri di Malaysia.',
    disclaimer: 'Maklumat pakej sewa-beli disediakan untuk rujukan dan perbandingan telus pengguna.',
    plansCount: 1
  },
  {
    id: 'lg-puricare',
    name: 'LG PuriCare',
    category: 'Water Purifiers, Home Appliances',
    accentColor: '#A50034',
    description: 'Teknologi penapisan air terus tanpa tangki (Tankless) dan penapis udara 360 darjah keluaran jenama gergasi elektronik LG Electronics.',
    coverageHighlight: 'Pemasangan ke seluruh Semenanjung Malaysia dan pusat bandar utama.',
    disclaimer: 'TelcoHauz bertindak sebagai platform perundingan dan semakan tawaran pengguna.',
    plansCount: 2
  },
  {
    id: 'khind',
    name: 'Khind',
    category: 'Home Appliances',
    accentColor: '#E31B23',
    description: 'Jenama peralatan elektrik kediaman terkemuka Malaysia yang kini menawarkan skim sewa-beli mesin basuh dan pengering pakaian mampu milik.',
    coverageHighlight: 'Seluruh Malaysia (Semenanjung, Sabah & Sarawak).',
    disclaimer: 'Harga dan ketersediaan pakej sewa-beli tertakluk kepada pengesahan pembekal.',
    plansCount: 1
  },
  {
    id: 'verdant-solar',
    name: 'Verdant Solar',
    category: 'Solar',
    accentColor: '#84BD00',
    description: 'Syarikat pemasangan panel tenaga suria kediaman bertauliah SEDA yang membantu pemilik rumah menjimatkan bil elektrik bulanan TNB melalui skim NEM 3.0.',
    coverageHighlight: 'Semenanjung Malaysia (Kediaman Berstatus Landed).',
    disclaimer: 'TelcoHauz membantu menghubungkan pemilik kediaman dengan jurutera solar bertauliah untuk kajian kelayakan bumbung.',
    plansCount: 1
  },
  {
    id: 'ksit',
    name: 'KSIT',
    category: 'Digital Services',
    accentColor: '#3B82F6',
    description: 'Penyedia perundingan rangkaian teknologi maklumat dan integrasi infrastruktur digital bagi perusahaan kecil dan sederhana (PKS).',
    coverageHighlight: 'Lembah Klang dan kawasan perindustrian utama.',
    disclaimer: 'Kadar perkhidmatan dan konsultasi tertakluk kepada skop projek pelanggan.',
    plansCount: 1
  },
  {
    id: 'eastel',
    name: 'Eastel',
    category: 'Digital Services',
    accentColor: '#10B981',
    description: 'Penyedia khidmat sokongan diagnostik peranti komunikasi pintar, integrasi kad eSIM dan pengurusan sambungan mudah alih.',
    coverageHighlight: 'Perkhidmatan dalam talian dan pusat servis rakan operasi.',
    disclaimer: 'TelcoHauz menyediakan saluran pertanyaan bagi khidmat sokongan peranti.',
    plansCount: 1
  },
  {
    id: 'innet',
    name: 'InNET',
    category: 'Digital Services',
    accentColor: '#6366F1',
    description: 'Penyedia audit infrastruktur pendawaian gentian optik, kabel Cat6 dan pemeriksaan kesiapsiagaan premis kediaman serta komersial.',
    coverageHighlight: 'Kawasan Lembah Klang & zon bandar terpilih.',
    disclaimer: 'Skop pemeriksaan teknikal disahkan berdasarkan keperluan tapak premis.',
    plansCount: 1
  }
];

// ==========================================
// 6. POPULAR QUICK CATEGORIES (9 REAL CATEGORIES)
// ==========================================
export const QUICK_CATEGORIES = [
  { id: 'Fibre Internet', name: 'Fibre Internet', icon: 'Wifi', count: 'Liputan Meluas', desc: 'Kelajuan 100Mbps - 1Gbps untuk rumah' },
  { id: 'Business Fibre', name: 'Business Fibre', icon: 'Building', count: 'PKS & Pejabat', desc: 'IP Statik & jaminan kelajuan terjamin' },
  { id: '5G / Wireless Broadband', name: '5G / Wireless Broadband', icon: 'Radio', count: 'Plug & Play', desc: 'Tanpa tebuk dinding, terus online' },
  { id: 'Mobile', name: 'Mobile Plans', icon: 'Smartphone', count: 'Pascabayar & Prabayar', desc: 'Data 5G besar & panggilan tanpa had' },
  { id: 'Astro / Entertainment', name: 'Astro / Entertainment', icon: 'Tv', count: 'Kombo Jimat', desc: 'Internet rumah + saluran TV' },
  { id: 'Water Purifiers', name: 'Water Purifiers', icon: 'Droplets', count: 'Sewa Beli Mampu Milik', desc: 'Penapis air 3 suhu Cuckoo & Coway' },
  { id: 'Home Appliances', name: 'Home Appliances', icon: 'Sparkles', count: 'Peralatan Rumah', desc: 'Mesin basuh pengering & penapis udara' },
  { id: 'Solar', name: 'Solar', icon: 'Sun', count: 'Jimat Bil TNB', desc: 'Pakej solar bumbung jimat bil elektrik' },
  { id: 'Digital Services', name: 'Digital Services', icon: 'Cpu', count: 'Servis Digital', desc: 'Diagnostik peranti & audit kabel premis' },
];

// ==========================================
// 7. REUSABLE CAMPAIGNS DATASET (/promo/[slug])
// ==========================================
export const CAMPAIGNS: Campaign[] = [
  {
    slug: 'fibre',
    title: 'Kempen Jalur Lebar Fibre Rumah Malaysia 2026',
    heroHeadline: 'Internet Fibre Rumah Terpantas & Paling Stabil',
    heroSubheadline: 'Bandingkan pakej gentian optik 100Mbps sehingga 2Gbps daripada TIME, Unifi, Maxis, CelcomDigi dan ALLO.',
    offerSummary: 'Pemasangan standard percuma, router WiFi 6 generasi terkini disertakan secara percuma, dan rebat tunai bulanan untuk pendaftaran baharu.',
    benefits: [
      'Kelajuan muat turun dan muat naik konsisten tanpa gangguan cuaca',
      'Pemasangan kabel gentian optik profesional oleh juruteknik terlatih',
      'Router WiFi 6 percuma mengurangkan zon mati internet di dalam rumah',
      'Bantuan semakan baki port pantas dalam tempoh 15 minit'
    ],
    whoItIsFor: [
      'Pemilik dan penyewa kediaman bertingkat (kondominium/apartmen) serta landed',
      'Isi rumah dengan 3 hingga 10 peranti pintar serentak',
      'Peminat permainan video (gaming) yang perlukan latensi rendah',
      'Pekerja dari rumah (WFH) dan telesidang resolusi tinggi HD'
    ],
    pricing: 'Bermula dari serendah RM89 hingga RM139/bulan',
    eligibility: 'Terbuka kepada premis berpenghuni di seluruh kawasan liputan infrastruktur gentian optik di Malaysia. Warganegara dan pemastautin sah MyKad / Pasport.',
    importantInfo: 'Tempoh kontrak standard adalah 24 bulan. Sekiranya kawasan kediaman anda belum mempunyai port fibre, anda boleh memilih alternatif 5G Home Broadband tanpa tebukan dinding.',
    faqs: [
      {
        question: 'Berapa lama proses pemasangan fibre mengambil masa?',
        answer: 'Pemasangan standard biasanya mengambil masa antara 2 hingga 4 jam bergantung kepada struktur rumah dan jarak kabel dari distribution point.'
      },
      {
        question: 'Adakah saya perlu membayar apa-apa semasa juruteknik datang?',
        answer: 'Pemasangan standard sehingga 15 meter adalah PERCUMA. Caj tambahan hanya dikenakan sekiranya anda meminta kerja-kerja tebukan luar biasa atau pendawaian siling khusus.'
      }
    ],
    category: 'Fibre Internet',
    targetPlanSlugs: ['time-fibre-200mbps', 'time-fibre-600mbps', 'unifi-home-100mbps', 'unifi-home-300mbps', 'maxis-home-fibre-300mbps', 'celcomdigi-fibre-300mbps', 'allo-cityfibre-100mbps']
  },
  {
    slug: '5g',
    title: 'Kempen 5G Wireless Home Broadband Plug & Play',
    heroHeadline: 'Internet Rumah 5G Tanpa Perlu Tebuk Dinding',
    heroSubheadline: 'Cuma pasang kad SIM ke router 5G, pasang palam elektrik, dan nikmati sambungan internet berkelajuan tinggi serta-merta.',
    offerSummary: 'Pelan tanpa kontrak ikatan wajib (SIM-Only) atau pelan bersama Router 5G WiFi 6 percuma dengan kuota sehingga 1,000GB sebulan.',
    benefits: [
      'Sifar kerja tebukan dinding – sesuai untuk penyewa rumah dan kondominium',
      'Aktif serta-merta tanpa perlu menunggu giliran juruteknik memasang kabel',
      'Boleh dibawa berpindah rumah dengan mudah tanpa sebarang caj pemindahan',
      'Rangkaian 5G meluas kendalian Digital Nasional Berhad (DNB) seluruh negara'
    ],
    whoItIsFor: [
      'Penyewa rumah atau bilik sewa yang dilarang tebuk dinding oleh tuan rumah',
      'Kediaman yang ketiadaan port fibre kosong di tiang komunikasi',
      'Pemilik premis sementara, tapak projek, gerai atau pejabat mudah alih'
    ],
    pricing: 'Bermula dari RM58 hingga RM69/bulan',
    eligibility: 'Memerlukan isyarat liputan 5G aktif di lokasi premis anda. Boleh disemak terlebih dahulu bersama perunding TelcoHauz.',
    importantInfo: 'Kelajuan sambungan 5G adalah tertakluk kepada kekuatan isyarat radio di kawasan premis dan kedudukan modem berhampiran tingkap.',
    faqs: [
      {
        question: 'Adakah kuota internet 5G ini benar-benar mencukupi?',
        answer: 'Kuota bulanan antara 1,000GB (1TB) hingga tanpa had kuota adalah sangat luas dan melebihi purata penggunaan isi rumah biasa (purata 300GB sebulan).'
      }
    ],
    category: '5G / Wireless Broadband',
    targetPlanSlugs: ['yes-5g-wireless-broadband', 'u-home-5g-broadband', 'celcomdigi-5g-home-wifi']
  },
  {
    slug: 'mobile',
    title: 'Kempen Tukar Telco (MNP) & Pascabayar 5G Jimat',
    heroHeadline: 'Tukar Telco, Kekalkan Nombor & Nikmati Kuota 300GB 5G',
    heroSubheadline: 'Peralihan mudah tanpa caj pemindahan. Gandakan kuota internet telefon anda dan nikmati panggilan tanpa had ke semua rangkaian.',
    offerSummary: 'Kekalkan 100% nombor telefon sedia ada anda (MNP) dan terima perayauan data (roaming) global percuma serta rebat kombo bil internet rumah.',
    benefits: [
      'Proses MNP selesai dalam tempoh singkat tanpa gangguan talian lama',
      'Kuota gergasi sehingga 300GB 5G/4G tanpa sekatan kelajuan waktu puncak',
      'Panggilan percuma tanpa had ke semua nombor mudah alih & talian tetap',
      'Rebat bil tambahan jika digabungkan bersama internet rumah'
    ],
    whoItIsFor: [
      'Pengguna yang membayar bil lama melebihi RM80 sebulan dengan kuota kecil',
      'Pekerja lapangan yang memerlukan sambungan hotspot internet stabil',
      'Pengembara yang kerap ke luar negara (roaming percuma)'
    ],
    pricing: 'Pelan pascabayar bernilai tinggi RM58 hingga RM80/bulan',
    eligibility: 'Talian semasa berstatus aktif dan tiada tunggakan bil kontrak dengan telco terdahulu. Pendaftaran percuma dengan MyKad.',
    importantInfo: 'Pastikan nama dan nombor MyKad pendaftaran pada telco sedia ada sepadan dengan maklumat permohonan baharu anda.',
    faqs: [
      {
        question: 'Adakah saya perlu pergi ke pusat servis telco lama?',
        answer: 'Tidak perlu. Anda hanya perlu membalas SMS pengesahan yang dihantar ke telefon anda apabila proses pemindahan dimulakan.'
      }
    ],
    category: 'Mobile',
    targetPlanSlugs: ['u-mobile-u-postpaid-68', 'celcomdigi-postpaid-5g-80', 'yes-5g-infinite-basic']
  },
  {
    slug: 'astro',
    title: 'Kempen Astro Fibre Kombo: Hiburan TV & Internet Satu Bil',
    heroHeadline: 'Internet Rumah 100Mbps + 80 Saluran TV Astro',
    heroSubheadline: 'Jimat bil bulanan dengan menggabungkan internet pantas dan hiburan sukan, drama, filem serta rancangan kanak-kanak dalam satu akaun.',
    offerSummary: 'Dekoder Astro Ulti Box terkini secara percuma (tanpa piring satelit diperlukan) dan penjimatan RM29 setiap bulan.',
    benefits: [
      'Satu bil bersepadu untuk internet gentian optik dan saluran TV berbayar',
      'Dekoder pintar Ulti Box WiFi-ready beroperasi menerusi internet fibre',
      'Aplikasi Astro GO percuma untuk tontonan serentak di tablet dan telefon',
      'Fungsi rakaman Cloud dan tonton semula (Catch-Up) tanpa caj peranti tambahan'
    ],
    whoItIsFor: [
      'Keluarga yang melanggan siaran TV dan internet secara berasingan',
      'Peminat siaran sukan langsung (Premier League), drama Melayu & filem terkini',
      'Kediaman yang tidak dibenarkan memasang piring satelit luaran'
    ],
    pricing: 'Harga kombo serendah RM129/bulan (Harga asal RM158)',
    eligibility: 'Tersedia di semua kawasan liputan gentian optik Astro Fibre di Semenanjung dan Malaysia Timur.',
    importantInfo: 'Beroperasi 100% melalui kabel internet fibre, tiada piring satelit diperlukan.',
    faqs: [
      {
        question: 'Adakah siaran televisyen akan terjejas jika hujan lebat?',
        answer: 'Tidak. Disebabkan isyarat disalurkan melalui kabel gentian optik (IPTV) dan bukannya gelombang satelit, siaran tidak akan terputus semasa hujan ribut.'
      }
    ],
    category: 'Astro / Entertainment',
    targetPlanSlugs: ['astro-fibre-100mbps-primary-pack', 'astro-fibre-500mbps-sports-pack']
  }
];
