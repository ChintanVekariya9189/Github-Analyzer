import type { GitHubRepo } from '../types/github';

interface RepoCardProps {
  repo: GitHubRepo;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  JavaScript:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  Python: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Rust: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  Go: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
  Java: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  'C++': 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  C: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  CSS: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  HTML: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
  Shell: 'bg-lime-100 text-lime-700 dark:bg-lime-900 dark:text-lime-300',
  Ruby: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
  Swift: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  Kotlin:
    'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
};

const getLanguageClass = (lang: string | null) =>
  lang
    ? (LANGUAGE_COLORS[lang] ??
      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300')
    : '';

const RepoCard = ({ repo }: RepoCardProps) => {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="group block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200 p-4"
    >
      {/* Repo name */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline truncate">
          {repo.name}
        </h3>
        {/* External link icon */}
        <svg
          className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </div>

      {/* Description — clamped to 2 lines */}
      <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
        {repo.description ?? 'No description provided.'}
      </p>

      {/* Footer row */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
        {/* Language badge */}
        {repo.language && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium text-xs ${getLanguageClass(repo.language)}`}
          >
            <span className="w-2 h-2 rounded-full bg-current opacity-70" />
            {repo.language}
          </span>
        )}

        {/* Stars */}
        <span className="flex items-center gap-1">
          <svg
            className="w-3.5 h-3.5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.538 1.118l-3.37-2.449a1 1 0 00-1.175 0l-3.37 2.449c-.783.57-1.838-.197-1.538-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
          </svg>
          {repo.stargazers_count.toLocaleString()}
        </span>

        {/* Forks */}
        <span className="flex items-center gap-1">
          <svg
            className="w-3.5 h-3.5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878z" />
          </svg>
          {repo.forks_count.toLocaleString()}
        </span>
      </div>
    </a>
  );
};

export default RepoCard;
