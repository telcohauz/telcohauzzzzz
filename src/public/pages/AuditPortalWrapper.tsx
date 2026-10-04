import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database, Globe } from 'lucide-react';
import { Navigation } from '../../components/Navigation.tsx';
import { Header } from '../../components/Header.tsx';
import { GlobalSearchModal } from '../../components/GlobalSearchModal.tsx';
import { TraceabilityModal } from '../../components/TraceabilityModal.tsx';

// Internal Views
import { DashboardView } from '../../views/DashboardView.tsx';
import { EntitiesView } from '../../views/EntitiesView.tsx';
import { EntityProfileView } from '../../views/EntityProfileView.tsx';
import { RelationshipsView } from '../../views/RelationshipsView.tsx';
import { EvidenceSourcesView } from '../../views/EvidenceSourcesView.tsx';
import { ClaimsVerificationView } from '../../views/ClaimsVerificationView.tsx';
import { ConflictsView } from '../../views/ConflictsView.tsx';
import { TimelineView } from '../../views/TimelineView.tsx';
import { ProductsView } from '../../views/ProductsView.tsx';
import { DigitalPresenceView } from '../../views/DigitalPresenceView.tsx';
import { ReviewsReputationView } from '../../views/ReviewsReputationView.tsx';
import { AuditTasksView } from '../../views/AuditTasksView.tsx';
import { DuplicatesControlView } from '../../views/DuplicatesControlView.tsx';
import { WorkflowGuideView } from '../../views/WorkflowGuideView.tsx';
import { DocumentsBrandView } from '../../views/DocumentsBrandView.tsx';
import { ChangeLogView } from '../../views/ChangeLogView.tsx';

export function AuditPortalWrapper() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [traceModalOpen, setTraceModalOpen] = useState(false);
  const [traceData, setTraceData] = useState<any>(null);

  const fetchStats = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (err) {
      console.error('Failed to load audit stats:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleOpenTrace = (item: any) => {
    setTraceData(item);
    setTraceModalOpen(true);
  };

  const handleSelectEntity = (id: number) => {
    setSelectedEntityId(id);
    setActiveTab('entity-profile');
  };

  const handleBackToEntities = () => {
    setSelectedEntityId(null);
    setActiveTab('entities');
  };

  const handleSearchResultSelect = (result: any) => {
    if (result.type.toLowerCase() === 'entity') {
      setSelectedEntityId(result.id);
      setActiveTab('entity-profile');
    } else if (result.type.toLowerCase() === 'product') {
      setActiveTab('products');
    } else if (result.type.toLowerCase() === 'domain') {
      setActiveTab('digital');
    } else if (result.type.toLowerCase() === 'social account') {
      setActiveTab('digital');
    } else if (result.type.toLowerCase() === 'claim') {
      setActiveTab('claims');
    } else if (result.type.toLowerCase() === 'evidence' || result.type.toLowerCase() === 'source') {
      setActiveTab('evidence');
    } else if (result.type.toLowerCase() === 'review') {
      setActiveTab('reviews');
    } else if (result.type.toLowerCase() === 'timeline event') {
      setActiveTab('timeline');
    } else {
      setActiveTab('entities');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#030712] text-slate-100 overflow-hidden font-sans">
      {/* Top Banner to switch back to public website */}
      <div className="bg-slate-900 border-b border-cyan-800/60 px-4 py-2 flex items-center justify-between text-xs z-20 shrink-0">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-cyan-300">PORTAL AUDIT DALAMAN & REKOD ENTITI TELCOHAUZ</span>
          <span className="hidden sm:inline text-slate-400">(Cloud SQL PostgreSQL Connected)</span>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Kembali ke Laman Web Awam TelcoHauz</span>
        </Link>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={(tab) => {
            if (tab !== 'entity-profile') {
              setSelectedEntityId(null);
            }
            setActiveTab(tab);
          }}
          openTasksCount={stats?.openTasks}
          activeConflictsCount={stats?.activeConflicts}
          pendingVerificationCount={stats?.pendingVerification}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Header */}
          <Header
            onOpenSearch={() => setSearchOpen(true)}
            onRefresh={fetchStats}
            isRefreshing={isRefreshing}
          />

          {/* View Content Viewport */}
          <main className="flex-1 overflow-y-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                stats={stats}
                onNavigate={(tab, entId) => {
                  if (entId) {
                    setSelectedEntityId(entId);
                    setActiveTab('entity-profile');
                  } else {
                    setActiveTab(tab);
                  }
                }}
                onInspectTrace={handleOpenTrace}
              />
            )}

            {activeTab === 'entities' && (
              <EntitiesView
                onSelectEntity={handleSelectEntity}
                onInspectTrace={handleOpenTrace}
                onRefreshStats={fetchStats}
              />
            )}

            {activeTab === 'entity-profile' && selectedEntityId && (
              <EntityProfileView
                entityId={selectedEntityId}
                onBack={handleBackToEntities}
                onInspectTrace={handleOpenTrace}
              />
            )}

            {activeTab === 'relationships' && (
              <RelationshipsView
                onInspectTrace={handleOpenTrace}
                onRefreshStats={fetchStats}
                onSelectEntity={handleSelectEntity}
              />
            )}

            {activeTab === 'evidence' && (
              <EvidenceSourcesView
                onInspectTrace={handleOpenTrace}
                onRefreshStats={fetchStats}
              />
            )}

            {activeTab === 'claims' && (
              <ClaimsVerificationView
                onInspectTrace={handleOpenTrace}
                onRefreshStats={fetchStats}
              />
            )}

            {activeTab === 'conflicts' && (
              <ConflictsView
                onRefreshStats={fetchStats}
                onInspectTrace={handleOpenTrace}
              />
            )}

            {activeTab === 'timeline' && (
              <TimelineView
                onRefreshStats={fetchStats}
                onInspectTrace={handleOpenTrace}
              />
            )}

            {activeTab === 'products' && (
              <ProductsView
                onRefreshStats={fetchStats}
                onInspectTrace={handleOpenTrace}
              />
            )}

            {activeTab === 'digital' && (
              <DigitalPresenceView
                onRefreshStats={fetchStats}
                onInspectTrace={handleOpenTrace}
              />
            )}

            {activeTab === 'reviews' && (
              <ReviewsReputationView
                onRefreshStats={fetchStats}
                onInspectTrace={handleOpenTrace}
              />
            )}

            {activeTab === 'tasks' && (
              <AuditTasksView
                onRefreshStats={fetchStats}
              />
            )}

            {activeTab === 'duplicates' && (
              <DuplicatesControlView
                onRefreshStats={fetchStats}
                onInspectTrace={handleOpenTrace}
              />
            )}

            {activeTab === 'workflow' && (
              <WorkflowGuideView
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'documents' && (
              <DocumentsBrandView />
            )}

            {activeTab === 'changelog' && (
              <ChangeLogView />
            )}
          </main>
        </div>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectResult={handleSearchResultSelect}
      />

      <TraceabilityModal
        isOpen={traceModalOpen}
        onClose={() => setTraceModalOpen(false)}
        data={traceData}
      />
    </div>
  );
}
