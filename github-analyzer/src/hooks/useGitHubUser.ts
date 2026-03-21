import { useQuery } from '@tanstack/react-query';
import githubApi, { graphqlRequest } from '../utils/githubApi';
import type {
  GitHubUser,
  GitHubRepo,
  HeatmapData,
  GraphQLContributionsResponse,
} from '../types/github';

const RATE_LIMIT_MESSAGE =
  'Rate limit reached. Add a GitHub token or wait 1 hour.';

const getContributionLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
};

const useGitHubUser = (username: string) => {
  const staleTime = 5 * 60 * 1000;

  // 1. Fetch User Profile
  const userQuery = useQuery({
    queryKey: ['user', username],
    queryFn: async () => {
      const res = await githubApi.get<GitHubUser>(`/users/${username}`);
      return res.data;
    },
    enabled: !!username.trim(),
    staleTime,
    retry: 1,
  });

  // 2. Fetch Repositories (paginated)
  const reposQuery = useQuery({
    queryKey: ['repos', username],
    queryFn: async () => {
      const user = userQuery.data;
      if (!user) return [];

      const totalRepos = user.public_repos;
      const totalPages = Math.ceil(totalRepos / 100);
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
      return reposResponses.flatMap((res) => res.data);
    },
    enabled: !!userQuery.data,
    staleTime,
  });

  // 3. Fetch Contributions (GraphQL)
  const contributionsQuery = useQuery({
    queryKey: ['contributions', username],
    queryFn: async () => {
      const query = `
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
      const gqlRes = await graphqlRequest<GraphQLContributionsResponse>(query, {
        username,
      });
      const weeks = gqlRes?.user?.contributionsCollection?.contributionCalendar?.weeks;

      if (!weeks) return [];

      const mappedData: HeatmapData[] = weeks
        .flatMap((week: any) => week.contributionDays)
        .map((day: any) => ({
          date: day.date,
          count: day.contributionCount,
          level: getContributionLevel(day.contributionCount),
        }));

      return mappedData;
    },
    enabled: !!username.trim(),
    staleTime,
  });

  // Loading state
  const loading =
    userQuery.isLoading || reposQuery.isLoading || contributionsQuery.isLoading;

  // Rate limit check
  const isRateLimit = (err: any) =>
    err?.response?.headers?.['x-ratelimit-remaining'] === '0';

  const rateLimitError =
    isRateLimit(userQuery.error) || isRateLimit(reposQuery.error);

  // Generic Error handling
  let error: string | null = null;
  if (userQuery.error) {
    error = rateLimitError
      ? RATE_LIMIT_MESSAGE
      : (userQuery.error as any).response?.status === 404
      ? 'User not found'
      : (userQuery.error as any).message;
  } else if (reposQuery.error) {
    error = rateLimitError
      ? RATE_LIMIT_MESSAGE
      : (reposQuery.error as any).message;
  } else if (contributionsQuery.error) {
    error = (contributionsQuery.error as any).message;
  }

  return {
    user: userQuery.data || null,
    repos: reposQuery.data || [],
    contributions: contributionsQuery.data || [],
    loading,
    error,
    rateLimitError,
  };
};

export default useGitHubUser;
