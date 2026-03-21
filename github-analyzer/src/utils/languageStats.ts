import type { GitHubRepo } from '../types/github';

export interface LanguageStat {
  lang: string;
  count: number;
}

export function getLanguageStats(repos: GitHubRepo[]): LanguageStat[] {
  const counts: Record<string, number> = {};

  for (const repo of repos) {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] ?? 0) + 1;
    }
  }

  return Object.entries(counts)
    .map(([lang, count]) => ({ lang, count }))
    .sort((a, b) => b.count - a.count);
}
