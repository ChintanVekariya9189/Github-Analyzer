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
import DevCard from './components/DevCard';

const App = () => {
  const [committedUsername, setCommittedUsername] = useState('');
  const { user, repos, contributions, loading, error, rateLimitError } =
    useGitHubUser(committedUsername);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      {/* Header */}
      <header className="bg-[#161b22] border-b border-[#30363d] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              className="w-8 h-8 text-[#58a6ff]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <h1 className="text-lg font-semibold text-[#f0f6fc]">GitHub Analyzer</h1>
          </div>
          <div className="w-full max-w-md ml-4">
            <SearchBar onSearch={(username) => setCommittedUsername(username)} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* ── Skeleton loading state ── */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <SkeletonCard />
            </div>
            <div className="lg:col-span-3 space-y-6">
              <SkeletonRepo />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-[#161b22] rounded-xl animate-pulse"></div>
                <div className="h-64 bg-[#161b22] rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* ── Rate limit error state ── */}
        {!loading && error && rateLimitError && (
          <div className="max-w-3xl mx-auto bg-amber-900/10 border border-amber-500/30 rounded-lg p-4 text-amber-200">
            <div className="flex items-center gap-3">
              <span className="text-xl">⏱️</span>
              <p className="font-semibold">GitHub Rate Limit Reached</p>
            </div>
            <p className="mt-2 text-sm opacity-80">
              Rate limit reached. Add a GitHub token or wait 1 hour. Set VITE_GITHUB_TOKEN in your .env file.
            </p>
          </div>
        )}

        {/* ── Generic error state ── */}
        {!loading && error && !rateLimitError && (
          <div className="max-w-3xl mx-auto bg-red-900/10 border border-red-500/30 rounded-lg p-4 text-red-200">
            <div className="flex items-center gap-3">
              <span className="text-xl">❌</span>
              <p className="font-semibold">Something went wrong</p>
            </div>
            <p className="mt-1 text-sm opacity-80">{error}</p>
          </div>
        )}

        {/* ── Profile + Chart + Repos (success state) ── */}
        {!loading && !error && user && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <ProfileCard user={user} />
              </div>
            </aside>

            {/* Content Area */}
            <div className="lg:col-span-3 space-y-8">
              {/* DevCard Row */}
              <div className="flex flex-col items-center xl:items-start">
                  <h2 className="text-lg font-semibold text-[#f0f6fc] mb-4 flex items-center gap-2 self-start">
                    <span className="w-1.5 h-6 bg-gradient-to-b from-[#58a6ff] to-[#238636] rounded-full"></span>
                    Dev Trading Card
                  </h2>
                  <div className="w-full flex justify-center xl:justify-start">
                    <DevCard user={user} repos={repos} contributions={contributions} />
                  </div>
              </div>

              {/* Stats Grid */}
              <section>
                <StatsGrid repos={repos} contributions={contributions} />
              </section>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Languages Section */}
                <section className="flex flex-col">
                  <h2 className="text-lg font-semibold text-[#f0f6fc] mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#3178c6] rounded-full"></span>
                    Languages
                  </h2>
                  <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex-1">
                    {repos.length > 0 ? (
                      <LanguageChart repos={repos} />
                    ) : (
                      <div className="h-64 flex items-center justify-center text-[#8b949e]">No language data</div>
                    )}
                  </div>
                </section>

                {/* Contribution Activity Section */}
                <section className="flex flex-col">
                  <h2 className="text-lg font-semibold text-[#f0f6fc] mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#238636] rounded-full"></span>
                    Activity Overview
                  </h2>
                  <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex-1">
                    <MonthlyCommitsChart contributions={contributions} />
                  </div>
                </section>
              </div>

              {/* Contribution Graph Section */}
              <section>
                <h2 className="text-lg font-semibold text-[#f0f6fc] mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#58a6ff] rounded-full"></span>
                  Contribution Activity
                </h2>
                <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 overflow-x-auto">
                  <ContributionGraph data={contributions} />
                </div>
              </section>

              {/* Repositories Section */}
              <section>
                <h2 className="text-lg font-semibold text-[#f0f6fc] mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#f1e05a] rounded-full"></span>
                  Top Repositories
                </h2>
                <RepoList repos={repos} />
              </section>
            </div>
          </div>
        )}

        {/* ── "Search to get started" empty state ── */}
        {!loading && !error && !user && !committedUsername && (
          <div className="flex flex-col items-center justify-center py-32 text-[#8b949e]">
            <svg
              className="w-20 h-20 mb-6 opacity-20"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <h2 className="text-2xl font-bold text-[#f0f6fc] mb-2">Look up a Profile</h2>
            <p className="text-center max-w-sm">
              Discover language stats, contribution patterns, and repository insights for any GitHub user.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
