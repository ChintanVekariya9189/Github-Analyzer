import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { getLanguageStats } from '../utils/languageStats';
import { calculateLongestStreak } from '../utils/statsUtils';
import type { GitHubRepo, HeatmapData } from '../types/github';

interface StatsGridProps {
  repos: GitHubRepo[];
  contributions: HeatmapData[];
}

const Counter = ({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    const animation = animate(count, value, { duration: 1, ease: 'easeOut' });
    return animation.stop;
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
};

const StatsGrid = ({ repos, contributions }: StatsGridProps) => {
  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0,
  );
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const languageStats = getLanguageStats(repos);
  const topLanguage = languageStats.length > 0 ? languageStats[0].lang : 'N/A';
  const longestStreak = calculateLongestStreak(contributions);

  const stats = [
    {
      label: 'Total Stars',
      value: totalStars,
      isNumeric: true,
      icon: (
        <svg
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
    },
    {
      label: 'Total Forks',
      value: totalForks,
      isNumeric: true,
      icon: (
        <svg
          className="w-5 h-5 text-indigo-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M7 2a1 1 0 00-1 1v1.172a3 3 0 00-1 2.238l.001.385l-.31.311a2.001 2.001 0 000 2.828l1.06 1.061a1 1 0 001.415 0l1.06-1.06a2.001 2.001 0 000-2.829l-.31-.31l.001-.386A3 3 0 008 4.172V3a1 1 0 00-1-1zM4 14a2 2 0 11.001 4.001A2 2 0 014 14z"
            clipRule="evenodd"
          />
          <path d="M12.684 5.316a1 1 0 00-1.368.448l-1 2a1 1 0 001.79.894l1-2a1 1 0 00-.422-1.342z" />
          <path
            fillRule="evenodd"
            d="M16 14a2 2 0 11.001 4.001A2 2 0 0116 14z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      label: 'Top Language',
      value: topLanguage,
      icon: (
        <svg
          className="w-5 h-5 text-emerald-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      ),
    },
    {
      label: 'Longest Streak',
      value: longestStreak,
      isNumeric: true,
      suffix: ' days',
      icon: (
        <svg
          className="w-5 h-5 text-orange-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1014 0c0-1.187-.249-2.315-.702-3.333a1 1 0 00-1.83.916C14.61 9.29 14.8 10.124 14.8 11c0 2.1-.764 4.01-2.03 5.465a1 1 0 01-1.428-.004A2.637 2.637 0 0110 14.5a2.637 2.637 0 01-.76-1.882c0-.523.151-1.011.414-1.422a1 1 0 10-1.688-1.074A4.637 4.637 0 007.2 12.618a3.13 3.13 0 01-.013-1.638 31.35 31.35 0 011.166-4.996c.214-.766.45-1.439.69-1.954a.978.978 0 01-.004 0c.27-.611.513-.982.724-1.222.18-.205.32-.284.4-.312z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-colors duration-300">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-xl p-5 flex items-center gap-4 hover:border-[#58a6ff]/30 shadow-sm dark:shadow-none transition-all duration-300"
        >
          <div className="bg-gray-50 dark:bg-[#0d1117] p-2.5 rounded-lg border border-gray-100 dark:border-[#30363d] transition-colors duration-300">
            {stat.icon}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-[#8b949e] uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-[#f0f6fc] mt-0.5">
              {stat.isNumeric ? (
                <>
                  <Counter value={stat.value as number} />
                  {stat.suffix}
                </>
              ) : (
                stat.value
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
