export const formatGenerationMWh = (mwh: number): string => {
  const man = mwh / 10000;
  return `${man.toFixed(1)}만 MWh`;
};

export const formatCapacityMW = (mw: number): string => `${mw.toLocaleString()} MW`;

export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export const formatApiDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
};

export const formatDaysRange = (min: number, max: number): string => {
  if (min === max) return `${min}일`;
  if (max >= 365) return `${Math.round(min / 30)}~${Math.round(max / 30)}개월`;
  return `${min}~${max}일`;
};
