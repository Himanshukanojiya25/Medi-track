// client/src/features/patient/prescriptions/PrescriptionsScreen.tsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield, FileText } from 'lucide-react';
import PrescriptionFilter from './PrescriptionFilter';
import PrescriptionList from './PrescriptionList';
import PrescriptionDetail from './PrescriptionDetail';
import {
  prescriptionService,
  getMockPrescriptions,
  getMockPrescription,
  MOCK_PRESCRIPTIONS,
  PrescriptionStatus,
} from '../services/prescription.service';
import type {
  Prescription,
  PrescriptionFilters,
} from '../services/prescription.service';

// ─── State Shape ──────────────────────────────────────────────────────────────

interface State {
  prescriptions: Prescription[];
  total: number;
  isLoading: boolean;
  error: string | null;
  isMockData: boolean;

  /* Filters */
  filters: PrescriptionFilters & {
    status: PrescriptionStatus | 'ALL';
    sort: string;
  };

  /* Detail view */
  selectedId: string | null;
  selectedRx: Prescription | null;
  isDetailLoading: boolean;
  isDetailMock: boolean;

  /* Download */
  downloadingId: string | null;
}

type Action =
  | { type: 'FETCH_START' }
  | {
      type: 'FETCH_SUCCESS';
      prescriptions: Prescription[];
      total: number;
      isMock: boolean;
    }
  | { type: 'FETCH_ERROR'; error: string }
  | { type: 'SET_FILTER'; filter: Partial<State['filters']> }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'SELECT_RX'; id: string }
  | {
      type: 'DETAIL_SUCCESS';
      rx: Prescription;
      isMock: boolean;
    }
  | { type: 'BACK_TO_LIST' }
  | { type: 'SET_DOWNLOADING'; id: string | null };

const DEFAULT_FILTERS: State['filters'] = {
  status: 'ALL',
  sort: 'newest',
  search: '',
  dateFrom: '',
  dateTo: '',
  page: 1,
  limit: 20,
};

const initialState: State = {
  prescriptions: [],
  total: 0,
  isLoading: true,
  error: null,
  isMockData: false,
  filters: DEFAULT_FILTERS,
  selectedId: null,
  selectedRx: null,
  isDetailLoading: false,
  isDetailMock: false,
  downloadingId: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        prescriptions: action.prescriptions,
        total: action.total,
        isMockData: action.isMock,
        error: null,
      };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.error };
    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, ...action.filter, page: 1 },
      };
    case 'CLEAR_FILTERS':
      return { ...state, filters: DEFAULT_FILTERS };
    case 'SELECT_RX':
      return { ...state, selectedId: action.id, isDetailLoading: true };
    case 'DETAIL_SUCCESS':
      return {
        ...state,
        selectedRx: action.rx,
        isDetailLoading: false,
        isDetailMock: action.isMock,
      };
    case 'BACK_TO_LIST':
      return {
        ...state,
        selectedId: null,
        selectedRx: null,
        isDetailLoading: false,
      };
    case 'SET_DOWNLOADING':
      return { ...state, downloadingId: action.id };
    default:
      return state;
  }
}

// ─── Status Counts ────────────────────────────────────────────────────────────

const useStatusCounts = (prescriptions: Prescription[]) =>
  useMemo(() => {
    const counts: Partial<Record<PrescriptionStatus | 'ALL', number>> = {
      ALL: prescriptions.length,
    };
    prescriptions.forEach((p) => {
      counts[p.status] = (counts[p.status] ?? 0) + 1;
    });
    return counts;
  }, [prescriptions]);

// ─── Sorted / Filtered (client-side for mock) ────────────────────────────────

const useSorted = (
  prescriptions: Prescription[],
  sort: string,
): Prescription[] =>
  useMemo(() => {
    const arr = [...prescriptions];
    switch (sort) {
      case 'oldest':
        return arr.sort(
          (a, b) =>
            new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime(),
        );
      case 'doctor':
        return arr.sort((a, b) =>
          a.doctorName.localeCompare(b.doctorName),
        );
      case 'diag':
        return arr.sort((a, b) =>
          a.diagnosis.localeCompare(b.diagnosis),
        );
      default: // newest
        return arr.sort(
          (a, b) =>
            new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime(),
        );
    }
  }, [prescriptions, sort]);

// ─── Skeleton for Detail ──────────────────────────────────────────────────────

const DetailSkeleton: React.FC = () => {
  const shimmer: React.CSSProperties = {
    background: 'linear-gradient(90deg, #f3f4f6 25%, #e9ecef 50%, #f3f4f6 75%)',
    backgroundSize: '200% 100%',
    animation: 'rx-shimmer 1.5s infinite',
    borderRadius: 8,
  };
  return (
    <div>
      <div style={{ ...shimmer, width: '40%', height: 20, marginBottom: 14 }} />
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 20, padding: 24, marginBottom: 16 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
            <div style={{ ...shimmer, width: 30, height: 30, flexShrink: 0, borderRadius: 9 }} />
            <div style={{ flex: 1 }}>
              <div style={{ ...shimmer, width: '30%', height: 10, marginBottom: 7 }} />
              <div style={{ ...shimmer, width: '65%', height: 14 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const PrescriptionsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  /* Track all prescriptions for counts (unfiltered) */
  const [allPrescriptions] = useState<Prescription[]>(MOCK_PRESCRIPTIONS);

  const abortRef = useRef<AbortController | null>(null);

  // ── Fetch List ────────────────────────────────────────────────────────────

  const fetchList = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    dispatch({ type: 'FETCH_START' });

    try {
      const res = await prescriptionService.getAll(state.filters);
      dispatch({
        type: 'FETCH_SUCCESS',
        prescriptions: res.data,
        total: res.total,
        isMock: false,
      });
    } catch {
      // Fallback to mock
      const res = getMockPrescriptions(state.filters);
      dispatch({
        type: 'FETCH_SUCCESS',
        prescriptions: res.data,
        total: res.total,
        isMock: true,
      });
    }
  }, [state.filters]);

  useEffect(() => {
    fetchList();
    return () => abortRef.current?.abort();
  }, [fetchList]);

  // ── Fetch Detail ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!state.selectedId) return;
    let cancelled = false;

    (async () => {
      try {
        const rx = await prescriptionService.getById(state.selectedId!);
        if (!cancelled) dispatch({ type: 'DETAIL_SUCCESS', rx, isMock: false });
      } catch {
        const rx = getMockPrescription(state.selectedId!);
        if (!cancelled) dispatch({ type: 'DETAIL_SUCCESS', rx, isMock: true });
      }
    })();

    return () => { cancelled = true; };
  }, [state.selectedId]);

  // ── Download ──────────────────────────────────────────────────────────────

  const handleDownload = useCallback(async (id: string) => {
    dispatch({ type: 'SET_DOWNLOADING', id });
    try {
      let blob: Blob;
      try {
        blob = await prescriptionService.downloadPDF(id);
      } catch {
        await new Promise((r) => setTimeout(r, 1200));
        blob = new Blob([`Prescription ${id} — Mock PDF`], { type: 'application/pdf' });
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Prescription_${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      dispatch({ type: 'SET_DOWNLOADING', id: null });
    }
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────

  const statusCounts = useStatusCounts(allPrescriptions);
  const sorted = useSorted(state.prescriptions, state.filters.sort);
  const hasFilters =
    state.filters.status !== 'ALL' ||
    (state.filters.search?.trim().length ?? 0) > 0 ||
    (state.filters.dateFrom?.length ?? 0) > 0 ||
    (state.filters.dateTo?.length ?? 0) > 0;

  // ── Render: Detail View ───────────────────────────────────────────────────

  if (state.selectedId) {
    return (
      <>
        <GlobalStyles />
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px' }}>
          {/* Back nav */}
          <button
            onClick={() => dispatch({ type: 'BACK_TO_LIST' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: 10,
              marginBottom: 20,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.color = '#334155';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <ChevronLeft size={18} />
            Back to Prescriptions
          </button>

          {state.isDetailLoading ? (
            <DetailSkeleton />
          ) : state.selectedRx ? (
            <PrescriptionDetail
              prescription={state.selectedRx}
              isMockData={state.isDetailMock}
              onBookFollowUp={(doctorId) =>
                navigate(`/patient/appointments/book?doctorId=${doctorId}`)
              }
            />
          ) : null}
        </div>
      </>
    );
  }

  // ── Render: List View ─────────────────────────────────────────────────────

  return (
    <>
      <GlobalStyles />
      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '24px 16px',
          animation: 'rx-fade-in 0.35s ease',
        }}
      >
        {/* ── Page Header ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 24,
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: 6,
                letterSpacing: '-0.5px',
                fontFamily: "'DM Sans', 'Nunito Sans', sans-serif",
              }}
            >
              My Prescriptions
            </h1>
            <p style={{ fontSize: 13.5, color: '#64748b', fontWeight: 400 }}>
              {state.total > 0
                ? `${state.total} prescription${state.total > 1 ? 's' : ''} on record`
                : 'Manage and download your medical prescriptions'}
            </p>
          </div>

          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
            }}
          >
            <FileText size={22} color="#ffffff" />
          </div>
        </div>

        {/* ── Mock Mode Banner ── */}
        {state.isMockData && (
          <div
            style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              border: '1px solid #fbbf24',
              borderRadius: 14,
              padding: '11px 16px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Shield size={18} color="#d97706" />
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#92400e', marginBottom: 1 }}>
                Demo Mode Active
              </p>
              <p style={{ fontSize: 11.5, color: '#78350f' }}>
                Showing sample prescriptions. Connect to backend for real data.
              </p>
            </div>
          </div>
        )}

        {/* ── Filters ── */}
        <PrescriptionFilter
          filters={state.filters}
          counts={statusCounts}
          onChange={(f) => dispatch({ type: 'SET_FILTER', filter: f })}
          onClear={() => dispatch({ type: 'CLEAR_FILTERS' })}
          isLoading={state.isLoading}
        />

        {/* ── List ── */}
        <PrescriptionList
          prescriptions={sorted}
          isLoading={state.isLoading}
          error={state.error}
          hasFilters={hasFilters}
          downloadingId={state.downloadingId}
          onView={(id) => dispatch({ type: 'SELECT_RX', id })}
          onDownload={handleDownload}
          onClearFilters={() => dispatch({ type: 'CLEAR_FILTERS' })}
          onRetry={fetchList}
        />
      </div>
    </>
  );
};

// ─── Global Styles Injector ───────────────────────────────────────────────────

const GlobalStyles: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500;700&display=swap');

    @keyframes rx-fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes rx-shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    @keyframes rx-spin {
      to { transform: rotate(360deg); }
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'DM Sans', 'Nunito Sans', -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 6px; }
    ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
  `}</style>
);

export default PrescriptionsScreen;