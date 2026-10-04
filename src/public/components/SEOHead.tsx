import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  jsonLd?: Record<string, any>;
}

export function SEOHead({
  title,
  description,
  canonicalUrl,
  ogImage = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  jsonLd,
}: SEOHeadProps) {
  const location = useLocation();
  const fullTitle = title.includes('TelcoHauz') ? title : `${title} | TelcoHauz Malaysia`;
  const url = canonicalUrl || `${window.location.origin}${location.pathname}`;

  useEffect(() => {
    // 1. Page Title
    document.title = fullTitle;

    // 2. Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // 3. Open Graph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', fullTitle);

    // 4. Open Graph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description);

    // 5. Open Graph URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', url);

    // 6. Open Graph Image
    let ogImg = document.querySelector('meta[property="og:image"]');
    if (!ogImg) {
      ogImg = document.createElement('meta');
      ogImg.setAttribute('property', 'og:image');
      document.head.appendChild(ogImg);
    }
    ogImg.setAttribute('content', ogImage);

    // 7. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // 8. JSON-LD structured data
    const existingScript = document.getElementById('telcohauz-json-ld');
    if (existingScript) {
      existingScript.remove();
    }

    if (jsonLd) {
      const script = document.createElement('script');
      script.id = 'telcohauz-json-ld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const cleanupScript = document.getElementById('telcohauz-json-ld');
      if (cleanupScript) cleanupScript.remove();
    };
  }, [fullTitle, description, url, ogImage, type, publishedTime, modifiedTime, author, jsonLd]);

  return null;
}
