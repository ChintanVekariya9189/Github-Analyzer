import type { GitHubRepo } from '../types/github';

interface RepoCardProps {
  repo: GitHubRepo;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Go: '#00ADD8',
  Swift: '#f05138',
  Rust: '#dea584',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Shell: '#89e051',
  Kotlin: '#A97BFF',
  Vue: '#41b883',
  React: '#61dafb',
};

const getLanguageColor = (lang: string | null) =>
  lang ? (LANGUAGE_COLORS[lang] ?? '#8b949e') : '#8b949e';

const RepoCard = ({ repo }: RepoCardProps) => {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="group block bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-xl hover:border-[#58a6ff]/50 transition-all duration-200 p-5 shadow-sm dark:shadow-none"
    >
      {/* Repo name */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-[#58a6ff] group-hover:underline truncate">
          {repo.name}
        </h3>
        {/* External link icon */}
        <svg
          className="w-4 h-4 text-gray-400 dark:text-[#8b949e] flex-shrink-0 mt-0.5"
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
      <p className="mt-2 text-sm text-gray-600 dark:text-[#8b949e] line-clamp-2 min-h-[2.5rem]">
        {repo.description ?? 'No description provided.'}
      </p>

      {/* Footer row */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#8b949e]">
        {/* Language badge */}
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: getLanguageColor(repo.language) }}
            />
            <span className="font-medium text-[#c9d1d9]">{repo.language}</span>
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
