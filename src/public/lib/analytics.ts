/**
 * TelcoHauz Analytics & Campaign Attribution Engine
 * Tracks user engagement and traffic sources (Google, Facebook, TikTok, WhatsApp, Shopee, etc.)
 * Strictly private, non-intrusive, and compliant with PDPA.
 */

export type AnalyticsEventType =
  | 'page_view'
  | 'product_view'
  | 'promotion_view'
  | 'search'
  | 'filter_used'
  | 'compare_started'
  | 'compare_completed'
  | 'eligibility_started'
  | 'eligibility_completed'
  | 'recommendation_started'
  | 'recommendation_completed'
  | 'whatsapp_clicked'
  | 'apply_clicked'
  | 'campaign_view'
  | 'lead_submitted'
  | 'news_view'
  | 'guide_view';

export interface UTMParams {
  source?: string; // google, facebook, instagram, tiktok, youtube, telegram, whatsapp, shopee, direct
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

const STORAGE_KEY_UTM = 'telcohauz_utm_attribution';
const STORAGE_KEY_EVENTS = 'telcohauz_analytics_events';

// Initialize and capture UTM params from current URL
export function captureAttribution(): UTMParams {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source') || (document.referrer.includes('facebook') ? 'facebook' :
      document.referrer.includes('tiktok') ? 'tiktok' :
      document.referrer.includes('instagram') ? 'instagram' :
      document.referrer.includes('google') ? 'google' :
      document.referrer.includes('t.me') || document.referrer.includes('telegram') ? 'telegram' :
      document.referrer.includes('whatsapp') ? 'whatsapp' :
      document.referrer.includes('shopee') ? 'shopee' :
      document.referrer ? 'referral' : 'direct');

    const params: UTMParams = {
      source: utmSource,
      medium: urlParams.get('utm_medium') || undefined,
      campaign: urlParams.get('utm_campaign') || undefined,
      term: urlParams.get('utm_term') || undefined,
      content: urlParams.get('utm_content') || undefined,
    };

    // Store in session if not set yet
    if (!sessionStorage.getItem(STORAGE_KEY_UTM)) {
      sessionStorage.setItem(STORAGE_KEY_UTM, JSON.stringify(params));
    }

    return params;
  } catch {
    return { source: 'direct' };
  }
}

export function getAttribution(): UTMParams {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY_UTM);
    if (stored) return JSON.parse(stored);
  } catch {}
  return captureAttribution();
}

export function trackEvent(eventType: AnalyticsEventType, properties: Record<string, any> = {}) {
  const attribution = getAttribution();
  const eventPayload = {
    eventType,
    properties,
    attribution,
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
  };

  try {
    // Keep local buffer of recent events for debugging / admin reports
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_EVENTS) || '[]');
    existing.push(eventPayload);
    // Keep last 50 events
    if (existing.length > 50) existing.shift();
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(existing));
  } catch {}

  // Console log in dev mode only
  if (process.env.NODE_ENV === 'development') {
    console.debug(`[TelcoHauz Analytics] ${eventType}`, eventPayload);
  }
}
