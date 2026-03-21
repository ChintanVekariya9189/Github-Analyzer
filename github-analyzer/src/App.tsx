import { useState } from 'react';
import SearchBar from './components/SearchBar';
import ProfileCard from './components/ProfileCard';
import RepoList from './components/RepoList';
import LanguageChart from './components/LanguageChart';
import SkeletonCard from './components/SkeletonCard';
import SkeletonRepo from './components/SkeletonRepo';
import ContributionGraph from './components/ContributionGraph';
import StatsGrid from './components/StatsGrid';
import MonthlyCommitsChart from './components/MonthlyCommitsChart';
import useGitHubUser from './hooks/useGitHubUser';

const App = () => {
  const [committedUsername, setCommittedUsername] = useState('');
  const { user, repos, contributions, loading, error, rateLimitError } =
    useGitHubUser(committedUsername);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <svg
            className="w-7 h-7 text-indigo-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <h1 className="text-xl font-bold tracking-tight">GitHub Analyzer</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Search */}
        <SearchBar onSearch={(username) => setCommittedUsername(username)} />

        {/* ── Skeleton loading state ── */}
        {loading && (
          <div className="space-y-6">
            <SkeletonCard />
            <SkeletonRepo />
          </div>
        )}

        {/* ── Rate limit error state ── */}
        {!loading && error && rateLimitError && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-xl px-5 py-4 text-amber-800 dark:text-amber-300 text-sm flex items-start gap-3">
            <span className="text-xl leading-none mt-0.5">⏱️</span>
            <div>
              <p className="font-semibold">GitHub Rate Limit Reached</p>
              <p className="mt-1 opacity-90">
                Rate limit reached. Add a GitHub token or wait 1 hour.
              </p>
              <p className="mt-2 opacity-75 text-xs">
                To add a token, set{' '}
                <code className="font-mono bg-amber-100 dark:bg-amber-800/40 rounded px-1">
                  VITE_GITHUB_TOKEN
                </code>{' '}
                in your{' '}
                <code className="font-mono bg-amber-100 dark:bg-amber-800/40 rounded px-1">
                  .env
                </code>{' '}
                file.
              </p>
            </div>
          </div>
        )}

        {/* ── Generic error state ── */}
        {!loading && error && !rateLimitError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-5 py-4 text-red-700 dark:text-red-400 text-sm flex items-start gap-3">
            <span className="text-lg leading-none mt-0.5">❌</span>
            <div>
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-0.5 opacity-80">{error}</p>
            </div>
          </div>
        )}

        {/* ── Profile + Chart + Repos (success state) ── */}
        {!loading && !error && user && (
          <div className="space-y-6">
            <ProfileCard user={user} />
            <StatsGrid repos={repos} contributions={contributions} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {repos.length > 0 && <LanguageChart repos={repos} />}
              <MonthlyCommitsChart contributions={contributions} />
            </div>
            <ContributionGraph data={contributions} />
            <RepoList repos={repos} />
          </div>
        )}

        {/* ── "Search to get started" empty state ── */}
        {!loading && !error && !user && committedUsername === '' && (
          <div className="text-center py-20 text-gray-400 dark:text-gray-600">
            <svg
              className="w-12 h-12 mx-auto mb-3 opacity-40"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <p className="text-sm">
              Search for a GitHub username to get started
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
