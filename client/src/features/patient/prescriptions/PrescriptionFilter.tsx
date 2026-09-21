// client/src/features/patient/prescriptions/PrescriptionFilter.tsx

import React, { useCallback, useRef } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { PrescriptionStatus } from '../services/prescription.service';
import type { PrescriptionFilters } from '../services/prescription.service';

// ─── Filter Tab Config ────────────────────────────────────────────────────────

const STATUS_TABS: { label: string; value: PrescriptionStatus | 'ALL'; count?: number }[] = [
  { label: 'All',       value: 'ALL'                          },
  { label: 'Active',    value: PrescriptionStatus.ACTIVE      },
  { label: 'Completed', value: PrescriptionStatus.COMPLETED   },
  { label: 'Expired',   value: PrescriptionStatus.EXPIRED     },
  { label: 'Cancelled', value: PrescriptionStatus.CANCELLED   },
];

const SORT_OPTIONS = [
  { label: 'Newest First',  value: 'newest'  },
  { label: 'Oldest First',  value: 'oldest'  },
  { label: 'Doctor Name',   value: 'doctor'  },
  { label: 'Diagnosis A–Z', value: 'diag'    },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface PrescriptionFilterProps {
  filters: PrescriptionFilters & { status: PrescriptionStatus | 'ALL'; sort?: string };
  counts?: Partial<Record<PrescriptionStatus | 'ALL', number>>;
  onChange: (updated: Partial<PrescriptionFilters & { sort?: string }>) => void;
  onClear: () => void;
  isLoading?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const PrescriptionFilter: React.FC<PrescriptionFilterProps> = ({
  filters,
  counts,
  onChange,
  onClear,
  isLoading = false,
}) => {
  const searchRef = useRef<HTMLInputElement>(null);
  const hasActiveFilters =
    (filters.search?.trim().length ?? 0) > 0 ||
    (filters.dateFrom?.length ?? 0) > 0 ||
    (filters.dateTo?.length ?? 0) > 0;

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ search: e.target.value });
    },
    [onChange],
  );

  const clearSearch = () => {
    onChange({ search: '' });
    searchRef.current?.focus();
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {/* ── Search Bar ── */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex',
          gap: 10,
          alignItems: 'center',
        }}
      >
        {/* Search input */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Search
            size={15}
            color="#94a3b8"
            style={{ position: 'absolute', left: 12, flexShrink: 0 }}
          />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search by diagnosis, doctor, or medication…"
            value={filters.search ?? ''}
            onChange={handleSearchChange}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '9px 36px 9px 36px',
              border: '1.5px solid #e2e8f0',
              borderRadius: 12,
              fontSize: 13.5,
              color: '#1e293b',
              background: '#f8fafc',
              outline: 'none',
              transition: 'border-color 0.15s ease, background 0.15s ease',
              fontFamily: "'DM Sans', 'Nunito Sans', sans-serif",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#2563eb';
              e.target.style.background = '#ffffff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.background = '#f8fafc';
            }}
            aria-label="Search prescriptions"
          />
          {(filters.search?.length ?? 0) > 0 && (
            <button
              onClick={clearSearch}
              style={{
                position: 'absolute',
                right: 10,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                color: '#94a3b8',
                borderRadius: 6,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#475569')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <select
            value={filters.sort ?? 'newest'}
            onChange={(e) => onChange({ sort: e.target.value })}
            disabled={isLoading}
            style={{
              appearance: 'none',
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: 12,
              padding: '9px 32px 9px 12px',
              fontSize: 12.5,
              fontWeight: 600,
              color: '#475569',
              cursor: 'pointer',
              outline: 'none',
              transition: 'border-color 0.15s ease',
              fontFamily: "'DM Sans', 'Nunito Sans', sans-serif",
            }}
            onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
            onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
            aria-label="Sort prescriptions"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            color="#94a3b8"
            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
        </div>

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: 10,
              padding: '8px 12px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.15s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#fef2f2')}
            aria-label="Clear all filters"
          >
            <SlidersHorizontal size={12} />
            Clear
          </button>
        )}
      </div>

      {/* ── Status Tabs ── */}
      <div
        style={{
          display: 'flex',
          padding: '10px 14px',
          gap: 6,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
        role="tablist"
        aria-label="Filter by prescription status"
      >
        {STATUS_TABS.map((tab) => {
          const isActive = filters.status === tab.value;
          const count = counts?.[tab.value];
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange({ status: tab.value })}
              disabled={isLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: 10,
                fontSize: 12.5,
                fontWeight: isActive ? 700 : 500,
                border: isActive ? '1.5px solid #bfdbfe' : '1.5px solid transparent',
                background: isActive
                  ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
                  : '#f8fafc',
                color: isActive ? '#2563eb' : '#64748b',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                opacity: isLoading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isActive && !isLoading) {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.color = '#334155';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive && !isLoading) {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.color = '#64748b';
                }
              }}
            >
              {tab.label}
              {count !== undefined && (
                <span
                  style={{
                    background: isActive ? '#2563eb' : '#e2e8f0',
                    color: isActive ? '#ffffff' : '#64748b',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 20,
                    minWidth: 18,
                    textAlign: 'center',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Date Range (optional expansion) ── */}
      <div
        style={{
          padding: '0 18px 14px',
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
            Date range:
          </span>
        </div>
        <input
          type="date"
          value={filters.dateFrom ?? ''}
          onChange={(e) => onChange({ dateFrom: e.target.value })}
          disabled={isLoading}
          style={{
            border: '1.5px solid #e2e8f0',
            borderRadius: 10,
            padding: '6px 10px',
            fontSize: 12,
            color: '#374151',
            background: '#f8fafc',
            outline: 'none',
            cursor: 'pointer',
            fontFamily: "'DM Sans', 'Nunito Sans', sans-serif",
          }}
          aria-label="Filter from date"
        />
        <span style={{ fontSize: 12, color: '#94a3b8' }}>to</span>
        <input
          type="date"
          value={filters.dateTo ?? ''}
          onChange={(e) => onChange({ dateTo: e.target.value })}
          disabled={isLoading}
          style={{
            border: '1.5px solid #e2e8f0',
            borderRadius: 10,
            padding: '6px 10px',
            fontSize: 12,
            color: '#374151',
            background: '#f8fafc',
            outline: 'none',
            cursor: 'pointer',
            fontFamily: "'DM Sans', 'Nunito Sans', sans-serif",
          }}
          aria-label="Filter to date"
        />
      </div>
    </div>
  );
};

export default PrescriptionFilter;