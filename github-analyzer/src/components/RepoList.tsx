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
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
        This user has no public repositories.
      </p>
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
