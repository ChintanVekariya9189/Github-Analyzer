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

export default githubApi;
