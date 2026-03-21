import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getLanguageStats } from '../utils/languageStats';
import type { GitHubRepo } from '../types/github';

interface Props {
  repos: GitHubRepo[];
}

// A carefully curated palette that still reads well in dark mode
const COLORS = [
  '#6366f1',
  '#06b6d4',
  '#f59e0b',
  '#10b981',
  '#f43f5e',
  '#8b5cf6',
  '#14b8a6',
  '#fb923c',
  '#60a5fa',
  '#a78bfa',
];

interface TooltipPayload {
  name: string;
  value: number;
  payload: { lang: string; count: number };
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) => {
  if (active && payload && payload.length) {
    const { lang, count } = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow text-sm">
        <p className="font-semibold text-gray-900 dark:text-gray-100">{lang}</p>
        <p className="text-gray-500 dark:text-gray-400">
          {count} repo{count !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }
  return null;
};

const LanguageChart = ({ repos }: Props) => {
  const stats = getLanguageStats(repos);

  // Only show top 9 + bundle the rest into "Other"
  const MAX_SLICES = 9;
  let displayStats = stats;
  if (stats.length > MAX_SLICES) {
    const top = stats.slice(0, MAX_SLICES);
    const otherCount = stats
      .slice(MAX_SLICES)
      .reduce((sum, s) => sum + s.count, 0);
    displayStats = [...top, { lang: 'Other', count: otherCount }];
  }

  if (displayStats.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
        Language Distribution
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Based on {repos.length} public repositories
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={displayStats}
            dataKey="count"
            nameKey="lang"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={55}
            paddingAngle={3}
            stroke="none"
          >
            {displayStats.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-gray-700 dark:text-gray-300 text-sm">
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Sorted bar list below the chart */}
      <div className="mt-4 space-y-2">
        {displayStats.map((s, i) => {
          const max = displayStats[0].count;
          const pct = Math.round((s.count / max) * 100);
          return (
            <div key={s.lang} className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-sm w-28 truncate text-gray-700 dark:text-gray-300">
                {s.lang}
              </span>
              <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: COLORS[i % COLORS.length],
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 w-6 text-right">
                {s.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageChart;
