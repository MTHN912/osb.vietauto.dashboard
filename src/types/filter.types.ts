export type TimeQuickRange = 'today' | 'this_week' | 'this_month' | 'this_year' | 'all_time';
export type TimeFilterMode = 'quick' | 'specific' | 'range';

export interface TimeFilterValue {
  mode: TimeFilterMode;
  quickRange?: TimeQuickRange;
  specificDate?: string;
  startDate?: string;
  endDate?: string;
  label: string;
}
