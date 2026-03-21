import type { HeatmapData } from '../types/github';

export const calculateLongestStreak = (
  contributions: HeatmapData[],
): number => {
  if (!contributions || contributions.length === 0) return 0;

  let maxStreak = 0;
  let currentStreak = 0;

  for (const day of contributions) {
    if (day.count > 0) {
      currentStreak++;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
};

export const aggregateMonthlyCommits = (contributions: HeatmapData[]) => {
  if (!contributions || contributions.length === 0) return [];

  const monthlyMap: Record<string, number> = {};

  contributions.forEach((day) => {
    const date = new Date(day.date);
    const monthYear = date.toLocaleString('default', {
      month: 'short',
      year: '2-digit',
    });

    if (!monthlyMap[monthYear]) {
      monthlyMap[monthYear] = 0;
    }
    monthlyMap[monthYear] += day.count;
  });

  const months: string[] = [];
  const result: { month: string; count: number }[] = [];

  contributions.forEach((day) => {
    const date = new Date(day.date);
    const monthYear = date.toLocaleString('default', {
      month: 'short',
      year: '2-digit',
    });

    if (!months.includes(monthYear)) {
      months.push(monthYear);
      result.push({
        month: monthYear,
        count: monthlyMap[monthYear],
      });
    }
  });

  return result;
};
