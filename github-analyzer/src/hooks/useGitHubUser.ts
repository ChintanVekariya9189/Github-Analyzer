import { useState, useEffect } from 'react';
import githubApi from '../utils/githubApi';
import type { GitHubUser, GitHubRepo } from '../types/github';

interface UseGitHubUserResult {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  loading: boolean;
  error: string | null;
}

const useGitHubUser = (username: string): UseGitHubUserResult => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't fetch if username is empty
    if (!username.trim()) {
      setUser(null);
      setRepos([]);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setUser(null);
      setRepos([]);

      try {
        // Fetch user profile and repos in parallel
        const [userRes, reposRes] = await Promise.all([
          githubApi.get<GitHubUser>(`/users/${username}`),
          githubApi.get<GitHubRepo[]>(
            `/users/${username}/repos?per_page=100&sort=updated`,
          ),
        ]);

        setUser(userRes.data);
        setRepos(reposRes.data);
      } catch (err: unknown) {
        if (
          typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          typeof (err as { response?: { status?: number } }).response
            ?.status === 'number'
        ) {
          const status = (err as { response: { status: number } }).response
            .status;
          if (status === 404) {
            setError(`User "${username}" not found.`);
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

  return { user, repos, loading, error };
};

export default useGitHubUser;
