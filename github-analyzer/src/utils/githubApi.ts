import axios from 'axios';

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(import.meta.env.VITE_GITHUB_TOKEN
      ? { Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}` }
      : {}),
  },
});

export const graphqlRequest = async <T>(
  query: string,
  variables?: Record<string, any>,
): Promise<T> => {
  const response = await githubApi.post<{ data: T; errors?: any }>(
    '/graphql',
    { query, variables },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (response.data.errors) {
    throw new Error(response.data.errors[0].message);
  }

  return response.data.data;
};

export default githubApi;
