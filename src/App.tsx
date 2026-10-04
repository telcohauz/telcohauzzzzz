/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { CompareProvider } from './public/context/CompareContext.tsx';
import { ScrollToTop } from './public/components/ScrollToTop.tsx';
import { PublicLayout } from './public/components/PublicLayout.tsx';

// Public Pages
import { HomePage } from './public/pages/HomePage.tsx';
import { ProductsPage } from './public/pages/ProductsPage.tsx';
import { ProductDetailPage } from './public/pages/ProductDetailPage.tsx';
import { PromotionsPage } from './public/pages/PromotionsPage.tsx';
import { PromotionDetailPage } from './public/pages/PromotionDetailPage.tsx';
import { CampaignPage } from './public/pages/CampaignPage.tsx';
import { ComparePage } from './public/pages/ComparePage.tsx';
import { EligibilityPage } from './public/pages/EligibilityPage.tsx';
import { RecommendPage } from './public/pages/RecommendPage.tsx';
import { NewsPage } from './public/pages/NewsPage.tsx';
import { NewsDetailPage } from './public/pages/NewsDetailPage.tsx';
import { GuidesPage } from './public/pages/GuidesPage.tsx';
import { GuideDetailPage } from './public/pages/GuideDetailPage.tsx';
import { ProvidersPage } from './public/pages/ProvidersPage.tsx';
import { AboutPage } from './public/pages/AboutPage.tsx';
import { ContactPage } from './public/pages/ContactPage.tsx';
import { LegalPage } from './public/pages/LegalPage.tsx';
import { NotFoundPage } from './public/pages/NotFoundPage.tsx';
import { AdminContentManagementPage } from './public/pages/AdminContentManagementPage.tsx';

// Internal Audit & Knowledge Hub (Preserved)
import { AuditPortalWrapper } from './public/pages/AuditPortalWrapper.tsx';

export default function App() {
  return (
    <AuthProvider>
      <CompareProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Dedicated full-screen route for Internal Audit & Knowledge Hub */}
            <Route path="/audit/*" element={<AuditPortalWrapper />} />

            {/* Internal Admin CMS */}
            <Route path="/admin" element={<AdminContentManagementPage />} />

            {/* Official Public-Facing TelcoHauz Website */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              <Route path="/promotions/:slug" element={<PromotionDetailPage />} />
              <Route path="/promo/:slug" element={<CampaignPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/eligibility" element={<EligibilityPage />} />
              <Route path="/recommend" element={<RecommendPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:slug" element={<NewsDetailPage />} />
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/guides/:slug" element={<GuideDetailPage />} />
              <Route path="/providers" element={<ProvidersPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<LegalPage />} />
              <Route path="/terms" element={<LegalPage />} />
              <Route path="/disclaimer" element={<LegalPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CompareProvider>
    </AuthProvider>
  );
}
