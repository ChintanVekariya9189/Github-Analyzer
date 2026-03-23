import { useState } from 'react';
import type { GitHubUser } from '../types/github';

interface ProfileCardProps {
  user: GitHubUser;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-xl p-6 flex flex-col items-center lg:items-start gap-6 relative shadow-sm dark:shadow-none transition-all duration-300">
      {/* Toast Notification */}
      {copied && (
        <div className="absolute top-4 right-4 bg-[#238636] text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-lg animate-in fade-in zoom-in duration-200 z-10">
          Copied!
        </div>
      )}

      {/* Avatar */}
      <img
        src={user.avatar_url}
        alt={user.login}
        className="w-48 h-48 lg:w-full lg:h-auto rounded-xl border border-gray-200 dark:border-[#30363d]"
      />

      {/* Info */}
      <div className="w-full text-center lg:text-left space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-[#f0f6fc]">
            {user.name ?? user.login}
          </h2>
          <p className="text-lg text-gray-500 dark:text-[#8b949e]">@{user.login}</p>
        </div>

        {user.bio && (
          <p className="text-gray-700 dark:text-[#c9d1d9] text-sm leading-relaxed">
            {user.bio}
          </p>
        )}

        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 dark:bg-[#21262d] hover:bg-gray-100 dark:hover:bg-[#30363d] border border-gray-300 dark:border-[#30363d] rounded-lg text-gray-700 dark:text-[#c9d1d9] text-sm font-medium transition-colors group"
        >
          <svg
            className="w-4 h-4 text-gray-400 dark:text-[#8b949e] group-hover:text-[#58a6ff] transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
          Copy link
        </button>

        {/* Stats stack */}
        <div className="pt-4 border-t border-gray-200 dark:border-[#30363d] space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-[#c9d1d9]">
            <svg className="w-4 h-4 text-gray-400 dark:text-[#8b949e]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM6 8a2 2 0 11-4 0 2 2 0 014 0zM2 14.5A5.5 5.5 0 0112.5 9c.32 0 .636.027.944.08A5.5 5.5 0 0118 14.5V15H2v-.5z" />
            </svg>
            <span>
              <strong className="font-semibold text-gray-900 dark:text-[#f0f6fc]">
                {user.followers.toLocaleString()}
              </strong>{' '}
              followers
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-[#c9d1d9]">
            <svg className="w-4 h-4 text-gray-400 dark:text-[#8b949e]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span>
              <strong className="font-semibold text-gray-900 dark:text-[#f0f6fc]">
                {user.following.toLocaleString()}
              </strong>{' '}
              following
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-[#c9d1d9]">
            <svg className="w-4 h-4 text-gray-400 dark:text-[#8b949e]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h12" />
            </svg>
            <span>
              <strong className="font-semibold text-gray-900 dark:text-[#f0f6fc]">
                {user.public_repos.toLocaleString()}
              </strong>{' '}
              public repos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
