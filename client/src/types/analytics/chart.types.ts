/**
 * Chart data point
 */
export interface ChartPoint {
  readonly label: string; // x-axis label
  readonly value: number;
}

/**
 * Multi-series chart dataset
 */
export interface ChartSeries {
  readonly name: string;                 // e.g. "Appointments"
  readonly points: readonly ChartPoint[];
}

/**
 * Generic chart data container
 */
export interface ChartData {
  readonly series: readonly ChartSeries[];
}
