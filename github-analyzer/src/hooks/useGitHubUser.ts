import { useState, useEffect } from 'react';
import githubApi from '../utils/githubApi';
import type { GitHubUser, GitHubRepo } from '../types/github';

const RATE_LIMIT_MESSAGE =
  'Rate limit reached. Add a GitHub token or wait 1 hour.';

interface UseGitHubUserResult {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
  rateLimitError: boolean;
}

const useGitHubUser = (username: string): UseGitHubUserResult => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitError, setRateLimitError] = useState<boolean>(false);

  useEffect(() => {
    if (!username.trim()) {
      setUser(null);
      setRepos([]);
      setError(null);
      setRateLimitError(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setRateLimitError(false);
      setUser(null);
      setRepos([]);

      try {
        // 1. Fetch user profile first to get the total public_repos count
        const userRes = await githubApi.get<GitHubUser>(`/users/${username}`);
        const userObj = userRes.data;
        setUser(userObj);

        // 2. Fetch repositories (GitHub API max per_page is 100)
        const totalRepos = userObj.public_repos;
        const totalPages = Math.ceil(totalRepos / 100);

        // Limit the number of pages processed in parallel to avoid massive slowdowns or errors
        // 10 pages = 1000 repositories, which is reasonable for this view.
        // For even more repositories, we'll still fetch but we could add a hard cap here if needed.
        const pageNumbers = Array.from(
          { length: Math.min(totalPages, 30) }, // Cap at 3000 repos for safety
          (_, i) => i + 1,
        );

        const reposPromises = pageNumbers.map((page) =>
          githubApi.get<GitHubRepo[]>(
            `/users/${username}/repos?per_page=100&page=${page}&sort=updated`,
          ),
        );

        const reposResponses = await Promise.all(reposPromises);

        // Combine all repo pages
        const allRepos = reposResponses.flatMap((res) => res.data);

        // Check rate limit remaining on any of the repo requests
        if (reposResponses.length > 0) {
          const remaining = reposResponses[0].headers['x-ratelimit-remaining'];
          if (remaining === '0') {
            setRateLimitError(true);
            setError(RATE_LIMIT_MESSAGE);
          }
        }

        setRepos(allRepos);
      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'response' in err) {
          const axiosErr = err as {
            response: {
              status: number;
              headers: Record<string, string>;
            };
          };
          const { status, headers } = axiosErr.response;

          // Detect rate-limit exhaustion: GitHub returns 403 with remaining = 0
          const remaining = headers?.['x-ratelimit-remaining'];
          if (remaining === '0' || status === 429) {
            setRateLimitError(true);
            setError(RATE_LIMIT_MESSAGE);
          } else if (status === 404) {
            setError(`User "${username}" not found.`);
          } else if (status === 403) {
            setRateLimitError(true);
            setError(RATE_LIMIT_MESSAGE);
          } else {
            setError(`GitHub API error: ${status}`);
          }
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  return { user, repos, loading, error, rateLimitError };
};

export default useGitHubUser;
