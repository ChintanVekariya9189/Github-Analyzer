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

const PAGE_SIZE = 10;

const RepoList = ({ repos }: RepoListProps) => {
  const [sortBy, setSortBy] = useState<SortKey>('stars');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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

  // Reset pagination whenever sort order changes
  const handleSortChange = (value: SortKey) => {
    setSortBy(value);
    setVisibleCount(PAGE_SIZE);
  };

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

  const visibleRepos = sortedRepos.slice(0, visibleCount);
  const hasMore = visibleCount < sortedRepos.length;

  return (
    <div className="space-y-6">
      {/* Header + Sort */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="text-sm text-[#8b949e]">
          Showing <span className="text-[#c9d1d9] font-medium">{visibleRepos.length}</span> of <span className="text-[#c9d1d9] font-medium">{repos.length}</span> repositories
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="sort-select"
            className="text-xs font-medium text-[#8b949e]"
          >
            Sort:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortKey)}
            className="text-xs border border-[#30363d] rounded-md px-2 py-1 bg-[#21262d] text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff] cursor-pointer transition-colors"
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
        {visibleRepos.map((repo) => (
          <RepoCard key={repo.name} repo={repo} />
        ))}
      </div>

      {/* Show More button */}
      {hasMore && (
        <div className="pt-4 flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="w-full py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-sm font-medium text-[#c9d1d9] hover:bg-[#30363d] hover:border-[#8b949e] transition-all active:scale-[0.98]"
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
};

export default RepoList;
