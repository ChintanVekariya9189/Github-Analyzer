import { useParams } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import RepoList from '../components/RepoList';
import LanguageChart from '../components/LanguageChart';
import SkeletonCard from '../components/SkeletonCard';
import SkeletonRepo from '../components/SkeletonRepo';
import ContributionGraph from '../components/ContributionGraph';
import StatsGrid from '../components/StatsGrid';
import MonthlyCommitsChart from '../components/MonthlyCommitsChart';
import useGitHubUser from '../hooks/useGitHubUser';
import DevCard from '../components/DevCard';

const ProfilePage = () => {
    const { username } = useParams<{ username: string }>();
    const { user, repos, contributions, loading, error, rateLimitError } =
        useGitHubUser(username || '');

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* ── Skeleton loading state ── */}
            {loading && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <SkeletonCard />
                    </div>
                    <div className="lg:col-span-3 space-y-6">
                        <SkeletonRepo />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-64 bg-gray-100 dark:bg-[#161b22] rounded-xl animate-pulse"></div>
                            <div className="h-64 bg-gray-100 dark:bg-[#161b22] rounded-xl animate-pulse"></div>
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
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-[#f0f6fc] mb-4 flex items-center gap-2 self-start transition-colors duration-300">
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
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-[#f0f6fc] mb-4 flex items-center gap-2 transition-colors duration-300">
                                    <span className="w-1.5 h-6 bg-[#3178c6] rounded-full"></span>
                                    Languages
                                </h2>
                                <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-xl p-6 flex-1 shadow-sm dark:shadow-none transition-all duration-300">
                                    {repos.length > 0 ? (
                                        <LanguageChart repos={repos} />
                                    ) : (
                                        <div className="h-64 flex items-center justify-center text-gray-400 dark:text-[#8b949e]">No language data</div>
                                    )}
                                </div>
                            </section>

                            {/* Contribution Activity Section */}
                            <section className="flex flex-col">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-[#f0f6fc] mb-4 flex items-center gap-2 transition-colors duration-300">
                                    <span className="w-1.5 h-6 bg-[#238636] rounded-full"></span>
                                    Activity Overview
                                </h2>
                                <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-xl p-6 flex-1 shadow-sm dark:shadow-none transition-all duration-300">
                                    <MonthlyCommitsChart contributions={contributions} />
                                </div>
                            </section>
                        </div>

                        {/* Contribution Graph Section */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-[#f0f6fc] mb-4 flex items-center gap-2 transition-colors duration-300">
                                <span className="w-1.5 h-6 bg-[#58a6ff] rounded-full"></span>
                                Contribution Activity
                            </h2>
                            <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-xl p-6 overflow-x-auto shadow-sm dark:shadow-none transition-all duration-300">
                                <ContributionGraph data={contributions} />
                            </div>
                        </section>

                        {/* Repositories Section */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-[#f0f6fc] mb-4 flex items-center gap-2 transition-colors duration-300">
                                <span className="w-1.5 h-6 bg-[#f1e05a] rounded-full"></span>
                                Top Repositories
                            </h2>
                            <RepoList repos={repos} />
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
