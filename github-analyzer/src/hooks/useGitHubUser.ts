import { useState, useEffect } from 'react';
import githubApi, { graphqlRequest } from '../utils/githubApi';
import type {
  GitHubUser,
  GitHubRepo,
  HeatmapData,
  GraphQLContributionsResponse,
} from '../types/github';

const RATE_LIMIT_MESSAGE =
  'Rate limit reached. Add a GitHub token or wait 1 hour.';

interface UseGitHubUserResult {
  user: GitHubUser | null;
  repos: GitHubRepo[];
  contributions: HeatmapData[];
  loading: boolean;
  error: string | null;
  rateLimitError: boolean;
}

const useGitHubUser = (username: string): UseGitHubUserResult => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [contributions, setContributions] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimitError, setRateLimitError] = useState<boolean>(false);

  useEffect(() => {
    if (!username.trim()) {
      setUser(null);
      setRepos([]);
      setContributions([]);
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
      setContributions([]);

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

        // 3. Fetch contributions via GraphQL
        const contributionsQuery = `
          query($username: String!) {
            user(login: $username) {
              contributionsCollection {
                contributionCalendar {
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                    }
                  }
                }
              }
            }
          }
        `;

        try {
          const gqlRes = await graphqlRequest<GraphQLContributionsResponse>(
            contributionsQuery,
            { username },
          );
          const weeks =
            gqlRes?.user?.contributionsCollection?.contributionCalendar?.weeks;

          if (weeks) {
            const flattenedDays = weeks.flatMap(
              (week: any) => week.contributionDays,
            );

            const mappedData: HeatmapData[] = flattenedDays.map((day: any) => ({
              date: day.date,
              count: day.contributionCount,
              level: getContributionLevel(day.contributionCount),
            }));

            setContributions(mappedData);
          }
        } catch (gqlErr) {
          console.error('GraphQL Error:', gqlErr);
        }
      } catch (err: unknown) {
        // ... (rest of the catch block)
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  return { user, repos, contributions, loading, error, rateLimitError };
};

const getContributionLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
};

export default useGitHubUser;
