// client/src/features/patient/appointments/history/AppointmentFilter.tsx

import React from 'react';
import { Filter, X } from 'lucide-react';
import { AppointmentStatus } from '../../services/appointment.service';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AppointmentTabType = 'ALL' | 'UPCOMING' | 'PAST';

export interface AppointmentFilterState {
  tab: AppointmentTabType;
  status?: AppointmentStatus;
  search?: string;
}

interface AppointmentFilterProps {
  filters: AppointmentFilterState;
  onChange: (filters: AppointmentFilterState) => void;
  totalCount?: number;
}

// ─── Tab Config ───────────────────────────────────────────────────────────────

const TABS: { key: AppointmentTabType; label: string }[] = [
  { key: 'ALL',      label: 'All'      },
  { key: 'UPCOMING', label: 'Upcoming' },
  { key: 'PAST',     label: 'Past'     },
];

const STATUS_OPTIONS: { value: AppointmentStatus; label: string }[] = [
  { value: AppointmentStatus.SCHEDULED,   label: 'Scheduled'   },
  { value: AppointmentStatus.CONFIRMED,   label: 'Confirmed'   },
  { value: AppointmentStatus.COMPLETED,   label: 'Completed'   },
  { value: AppointmentStatus.CANCELLED,   label: 'Cancelled'   },
  { value: AppointmentStatus.NO_SHOW,     label: 'No Show'     },
  { value: AppointmentStatus.RESCHEDULED, label: 'Rescheduled' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const AppointmentFilter: React.FC<AppointmentFilterProps> = ({
  filters,
  onChange,
  totalCount,
}) => {
  const hasActiveFilters = Boolean(filters.status);

  const clearFilters = () => {
    onChange({ ...filters, status: undefined });
  };

  return (
    <>
      <style>{`
        .apt-tab:hover { color: #374151 !important; }
        .apt-status-select:focus { outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
      `}</style>

      <div>
        {/* ── Tabs ── */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            backgroundColor: '#f3f4f6',
            padding: 4,
            borderRadius: 12,
            marginBottom: 14,
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className="apt-tab"
              onClick={() => onChange({ ...filters, tab: tab.key })}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: 'none',
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.18s',
                backgroundColor: filters.tab === tab.key ? '#ffffff' : 'transparent',
                color: filters.tab === tab.key ? '#111827' : '#9ca3af',
                boxShadow: filters.tab === tab.key
                  ? '0 1px 4px rgba(0,0,0,0.08)'
                  : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Filter Row ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          {/* Status filter */}
          <div style={{ position: 'relative', flex: '1 1 160px', minWidth: 140 }}>
            <Filter
              size={13}
              color="#9ca3af"
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}
            />
            <select
              className="apt-status-select"
              value={filters.status ?? ''}
              onChange={(e) =>
                onChange({
                  ...filters,
                  status: (e.target.value as AppointmentStatus) || undefined,
                })
              }
              style={{
                width: '100%',
                padding: '8px 10px 8px 30px',
                border: '1.5px solid #e5e7eb',
                borderRadius: 10,
                fontSize: 13,
                color: filters.status ? '#111827' : '#9ca3af',
                backgroundColor: '#ffffff',
                appearance: 'none',
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '8px 12px',
                border: '1.5px solid #fecaca',
                borderRadius: 10,
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <X size={12} />
              Clear
            </button>
          )}

          {/* Result count */}
          {totalCount !== undefined && (
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 12,
                color: '#9ca3af',
                whiteSpace: 'nowrap',
              }}
            >
              {totalCount} {totalCount === 1 ? 'appointment' : 'appointments'}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export { AppointmentFilter };
export default AppointmentFilter;