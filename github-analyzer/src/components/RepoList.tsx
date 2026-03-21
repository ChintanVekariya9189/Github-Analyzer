import { useState, useMemo } from 'react';
import type { GitHubRepo } from '../types/github';
import RepoCard from './RepoCard';

interface RepoListProps {
  repos: GitHubRepo[];
}

type SortKey = 'stars' | 'forks' | 'updated';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'stars', label: '⭐ Stars' },
  { value: 'forks', label: '🍴 Forks' },
  { value: 'updated', label: '🕐 Recently Updated' },
];

const RepoList = ({ repos }: RepoListProps) => {
  const [sortBy, setSortBy] = useState<SortKey>('stars');

  const sortedRepos = useMemo(() => {
    const sorted = [...repos];
    if (sortBy === 'stars') {
      sorted.sort((a, b) => b.stargazers_count - a.stargazers_count);
    } else if (sortBy === 'forks') {
      sorted.sort((a, b) => b.forks_count - a.forks_count);
    } else if (sortBy === 'updated') {
      sorted.sort((a, b) => {
        const aTime =
          (a as GitHubRepo & { updated_at?: string }).updated_at ?? '';
        const bTime =
          (b as GitHubRepo & { updated_at?: string }).updated_at ?? '';
        return bTime.localeCompare(aTime);
      });
    }
    return sorted;
  }, [repos, sortBy]);

  if (repos.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-600">
        {/* Box / empty shelf icon */}
        <svg
          className="w-14 h-14 mx-auto mb-4 opacity-40"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v.375c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
        <p className="text-base font-semibold text-gray-500 dark:text-gray-400">
          No public repos found
        </p>
        <p className="mt-1 text-sm">
          This user hasn't published any public repositories yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header + Sort */}
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Repositories{' '}
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            ({repos.length})
          </span>
        </h2>

        <div className="flex items-center gap-2">
          <label
            htmlFor="sort-select"
            className="text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            Sort by
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer transition"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Responsive grid: 1 col mobile, 2 col desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedRepos.map((repo) => (
          <RepoCard key={repo.name} repo={repo} />
        ))}
      </div>
    </div>
  );
};

export default RepoList;
