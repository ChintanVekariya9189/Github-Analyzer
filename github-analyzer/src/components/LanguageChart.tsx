import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getLanguageStats } from '../utils/languageStats';
import type { GitHubRepo } from '../types/github';

interface Props {
  repos: GitHubRepo[];
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Go: '#00ADD8',
  Swift: '#f05138',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Shell: '#89e051',
  Kotlin: '#A97BFF',
  Vue: '#41b883',
  React: '#61dafb',
  Other: '#8b949e',
};

const getLanguageColor = (lang: string) => LANGUAGE_COLORS[lang] ?? '#8b949e';

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
    <div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-[#f0f6fc] mb-1 transition-colors duration-300">
        Language Distribution
      </h3>
      <p className="text-xs text-gray-500 dark:text-[#8b949e] mb-6 transition-colors duration-300">
        Based on {repos.length} public repositories
      </p>

      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={displayStats}
            dataKey="count"
            nameKey="lang"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={50}
            paddingAngle={2}
            stroke="none"
          >
            {displayStats.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getLanguageColor(entry.lang)}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Sorted bar list below the chart */}
      <div className="mt-8 space-y-3">
        {displayStats.map((s) => {
          const max = displayStats[0].count;
          const pct = Math.round((s.count / max) * 100);
          const color = getLanguageColor(s.lang);
          return (
            <div key={s.lang} className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs w-24 truncate text-gray-700 dark:text-[#c9d1d9] font-medium transition-colors duration-300">
                {s.lang}
              </span>
              <div className="flex-1 bg-gray-100 dark:bg-[#30363d] rounded-full h-1.5 overflow-hidden transition-colors duration-300">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              <span className="text-[10px] text-gray-400 dark:text-[#8b949e] w-8 text-right font-mono transition-colors duration-300">
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
