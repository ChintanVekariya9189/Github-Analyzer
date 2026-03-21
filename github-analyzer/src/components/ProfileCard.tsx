import type { GitHubUser } from '../types/github';

interface ProfileCardProps {
  user: GitHubUser;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
      {/* Avatar */}
      <img
        src={user.avatar_url}
        alt={user.login}
        className="w-24 h-24 rounded-full ring-4 ring-indigo-400 shadow-md flex-shrink-0"
      />

      {/* Info */}
      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
          {user.name ?? user.login}
        </h2>
        <p className="text-sm text-indigo-500 font-medium mt-0.5">@{user.login}</p>

        {user.bio && (
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-lg">
            {user.bio}
          </p>
        )}

        {/* Stats row */}
        <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM6 8a2 2 0 11-4 0 2 2 0 014 0zM2 14.5A5.5 5.5 0 0112.5 9c.32 0 .636.027.944.08A5.5 5.5 0 0118 14.5V15H2v-.5z" />
            </svg>
            <span>
              <strong className="font-semibold text-gray-900 dark:text-white">
                {user.followers.toLocaleString()}
              </strong>{' '}
              followers
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span>
              <strong className="font-semibold text-gray-900 dark:text-white">
                {user.following.toLocaleString()}
              </strong>{' '}
              following
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h12" />
            </svg>
            <span>
              <strong className="font-semibold text-gray-900 dark:text-white">
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
