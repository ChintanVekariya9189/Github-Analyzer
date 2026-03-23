import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchFullUserData } from '../utils/githubUtils';
import ProfileCard from '../components/ProfileCard';
import SkeletonCard from '../components/SkeletonCard';

const ComparisonRow = ({ label, val1, val2 }: { label: string; val1: number; val2: number }) => {
    const winner = val1 > val2 ? 1 : val2 > val1 ? 2 : 0;
    return (
        <tr className="border-b border-gray-100 dark:border-[#30363d] last:border-0 transition-colors duration-300">
            <td className="py-5 text-sm font-semibold text-gray-500 dark:text-[#8b949e] uppercase tracking-wider">{label}</td>
            <td className="py-5 text-center">
                <div className="flex flex-col items-center gap-1.5">
                    <span className={`text-xl font-bold transition-all ${winner === 1 ? 'text-[#238636] dark:text-[#3fb950] scale-110' : 'text-gray-900 dark:text-[#f0f6fc]'}`}>
                        {val1.toLocaleString()}
                    </span>
                    {winner === 1 && (
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider animate-in fade-in zoom-in duration-300">
                            Winner
                        </span>
                    )}
                </div>
            </td>
            <td className="py-5 text-center">
                <div className="flex flex-col items-center gap-1.5">
                    <span className={`text-xl font-bold transition-all ${winner === 2 ? 'text-[#238636] dark:text-[#3fb950] scale-110' : 'text-gray-900 dark:text-[#f0f6fc]'}`}>
                        {val2.toLocaleString()}
                    </span>
                    {winner === 2 && (
                        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider animate-in fade-in zoom-in duration-300">
                            Winner
                        </span>
                    )}
                </div>
            </td>
        </tr>
    );
};

const ComparePage = () => {
    const { user1, user2 } = useParams<{ user1: string; user2: string }>();

    const { data, isLoading, error } = useQuery({
        queryKey: ['compare', user1, user2],
        queryFn: async () => {
            if (!user1 || !user2) throw new Error('Usernames are required');
            const [u1, u2] = await Promise.all([
                fetchFullUserData(user1),
                fetchFullUserData(user2)
            ]);
            return { u1, u2 };
        },
        enabled: !!user1 && !!user2,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12">
                <div className="flex flex-col items-center mb-12">
                    <div className="h-10 w-64 bg-gray-100 dark:bg-[#161b22] rounded-lg animate-pulse mb-4"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        );
    }

    if (error) {
        const errorMessage = (error as any).response?.status === 404 
            ? 'One or both users not found' 
            : (error as any).message;

        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                <div className="bg-red-900/10 border border-red-500/30 rounded-2xl p-8 transition-colors duration-300">
                    <span className="text-4xl mb-4 block">❌</span>
                    <h2 className="text-2xl font-bold text-red-500 mb-2">Comparison Failed</h2>
                    <p className="text-gray-600 dark:text-[#8b949e] mb-6">{errorMessage}</p>
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-[#21262d] hover:bg-gray-200 dark:hover:bg-[#30363d] rounded-xl font-semibold text-gray-900 dark:text-[#f0f6fc] transition-all"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { u1, u2 } = data;

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            {/* Header */}
            <header className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="inline-flex items-center gap-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-500/30 rounded-full text-blue-600 dark:text-[#58a6ff] text-sm font-bold uppercase tracking-widest mb-6 transition-colors duration-300">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    VS Comparison
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-[#f0f6fc] flex flex-wrap items-center justify-center gap-4 transition-colors duration-300">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#58a6ff] to-[#bc8cf2]">
                        {u1.user.login}
                    </span>
                    <span className="text-gray-400 dark:text-[#30363d] text-2xl">VS</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#bc8cf2] to-[#ff7b72]">
                        {u2.user.login}
                    </span>
                </h1>
            </header>

            {/* Side by Side Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start mb-16 relative">
                {/* Decorative VS in background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl md:text-[180px] font-black text-gray-100/50 dark:text-[#161b22]/50 pointer-events-none select-none z-0 transition-colors duration-300">
                    VS
                </div>

                <div className="z-10 animate-in slide-in-from-left-8 duration-700">
                    <ProfileCard user={u1.user} />
                </div>
                <div className="z-10 animate-in slide-in-from-right-8 duration-700">
                    <ProfileCard user={u2.user} />
                </div>
            </div>

            {/* Stats Comparison Table */}
            <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-2xl overflow-hidden shadow-xl dark:shadow-none animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 transition-all duration-300">
                <div className="px-8 py-6 border-b border-gray-100 dark:border-[#30363d] bg-gray-50/50 dark:bg-[#1c2128]/50 transition-colors duration-300">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-[#f0f6fc]">Performance Breakdown</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-[#1c2128]/50 text-xs font-bold text-gray-400 dark:text-[#8b949e] uppercase tracking-wider transition-colors duration-300">
                                <th className="px-8 py-4 text-left font-semibold">Metric</th>
                                <th className="px-8 py-4 text-center">{u1.user.login}</th>
                                <th className="px-8 py-4 text-center">{u2.user.login}</th>
                            </tr>
                        </thead>
                        <tbody className="px-8">
                            <ComparisonRow 
                                label="Public Repos" 
                                val1={u1.user.public_repos} 
                                val2={u2.user.public_repos} 
                            />
                            <ComparisonRow 
                                label="Followers" 
                                val1={u1.user.followers} 
                                val2={u2.user.followers} 
                            />
                            <ComparisonRow 
                                label="Total Stars" 
                                val1={u1.totalStars} 
                                val2={u2.totalStars} 
                            />
                            <ComparisonRow 
                                label="Total Forks" 
                                val1={u1.totalForks} 
                                val2={u2.totalForks} 
                            />
                        </tbody>
                    </table>
                </div>
                <div className="p-6 bg-gray-50/50 dark:bg-[#1c2128]/50 text-center transition-colors duration-300">
                    <p className="text-sm text-gray-500 dark:text-[#8b949e]">
                        Stats are aggregated from public profile and repository data.
                    </p>
                </div>
            </div>

            {/* Back button */}
            <div className="text-center mt-12 animate-in fade-in duration-1000 delay-500">
                <Link 
                    to={`/u/${u1.user.login}`}
                    className="text-gray-500 dark:text-[#8b949e] hover:text-[#58a6ff] transition-colors text-sm flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to {u1.user.login}'s Profile
                </Link>
            </div>
        </div>
    );
};

export default ComparePage;
