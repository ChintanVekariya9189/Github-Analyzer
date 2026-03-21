import { useState } from 'react';
import SearchBar from './components/SearchBar';
import useGitHubUser from './hooks/useGitHubUser';

const App = () => {
  const [committedUsername, setCommittedUsername] = useState('');

  const { user, repos, loading, error } = useGitHubUser(committedUsername);

  if (committedUsername) {
    console.log('=== GitHub Lookup ===');
    console.log('Username:', committedUsername);
    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('User:', user);
    console.log('Repos:', repos);
  }

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '40px auto',
        padding: '0 16px',
        fontFamily: 'sans-serif',
      }}
    >
      <h1>GitHub Analyzer</h1>

      <SearchBar onSearch={(username) => setCommittedUsername(username)} />

      {loading && <p>⏳ Loading...</p>}

      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      {!loading && !error && user && (
        <div>
          <img
            src={user.avatar_url}
            alt={user.login}
            width={80}
            style={{ borderRadius: '50%' }}
          />
          <h2>{user.name ?? user.login}</h2>
          {user.bio && <p>{user.bio}</p>}
          <p>
            👥 {user.followers} followers · {user.following} following · 📦{' '}
            {user.public_repos} public repos
          </p>
          <h3>Repositories ({repos.length})</h3>
          {repos.length === 0 ? (
            <p>This user has no public repositories.</p>
          ) : (
            <ul>
              {repos.map((repo) => (
                <li key={repo.name}>
                  <a href={repo.html_url} target="_blank" rel="noreferrer">
                    {repo.name}
                  </a>
                  {repo.language && ` — ${repo.language}`} ⭐{' '}
                  {repo.stargazers_count}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
