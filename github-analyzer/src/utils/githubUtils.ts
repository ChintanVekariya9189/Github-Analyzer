import githubApi, { graphqlRequest } from './githubApi';
import type { GitHubUser, GitHubRepo, GraphQLContributionsResponse, HeatmapData } from '../types/github';

const getContributionLevel = (count: number): 0 | 1 | 2 | 3 | 4 => {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
};

export const fetchFullUserData = async (username: string) => {
  // 1. Fetch User Profile
  const userRes = await githubApi.get<GitHubUser>(`/users/${username}`);
  const user = userRes.data;

  // 2. Fetch ALL Repositories
  const totalRepos = user.public_repos;
  const totalPages = Math.ceil(totalRepos / 100);
  const pageNumbers = Array.from(
    { length: Math.min(totalPages, 30) }, // Cap at 3000 repos for safety
    (_, i) => i + 1
  );

  const reposPromises = pageNumbers.map((page) =>
    githubApi.get<GitHubRepo[]>(
      `/users/${username}/repos?per_page=100&page=${page}&sort=updated`
    )
  );

  const reposResponses = await Promise.all(reposPromises);
  const repos = reposResponses.flatMap((res) => res.data);

  // 3. Fetch Contributions (GraphQL)
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
  
  let contributions: HeatmapData[] = [];
  try {
    const gqlRes = await graphqlRequest<GraphQLContributionsResponse>(query, {
      username,
    });
    const weeks = gqlRes?.user?.contributionsCollection?.contributionCalendar?.weeks;

    if (weeks) {
      contributions = weeks
        .flatMap((week: any) => week.contributionDays)
        .map((day: any) => ({
          date: day.date,
          count: day.contributionCount,
          level: getContributionLevel(day.contributionCount),
        }));
    }
  } catch (err) {
    console.error(`Failed to fetch contributions for ${username}:`, err);
    // Continue without contributions if it fails
  }

  // Calculate aggregated stats
  const totalStars = repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
  const totalForks = repos.reduce((acc, repo) => acc + (repo.forks_count || 0), 0);

  return {
    user,
    repos,
    contributions,
    totalStars,
    totalForks,
  };
};
