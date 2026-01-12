export const getWindowRange = (
  window: 'daily' | 'monthly',
): { start: Date; end: Date } => {
  const now = new Date();

  if (window === 'daily') {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return { start, end };
  }

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return { start, end };
};
