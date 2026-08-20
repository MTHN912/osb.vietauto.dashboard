export function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  const clean = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  const parts = clean.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${month.padStart(2, '0')}-${day.padStart(2, '0')}-${year}`;
  }
  return dateStr;
}

export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${ampm}`;
}

export function formatDateTime(dateStr: string, timeStr?: string): string {
  if (!timeStr) return formatDate(dateStr);
  return `${formatDate(dateStr)} at ${formatTime(timeStr)}`;
}
