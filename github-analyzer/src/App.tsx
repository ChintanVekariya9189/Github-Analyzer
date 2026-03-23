import {
  Routes,
  Route,
  useNavigate,
  Link,
  useLocation,
} from 'react-router-dom';
import SearchBar from './components/SearchBar';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import ComparePage from './pages/ComparePage';
import { useTheme } from './hooks/useTheme';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleSearch = (username: string) => {
    if (username.trim()) {
      navigate(`/u/${username.trim()}`);
    }
  };

  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-gray-900 dark:text-[#c9d1d9] transition-colors duration-300">
      {/* Header */}
      <header className="bg-gray-50 dark:bg-[#161b22] border-b border-gray-200 dark:border-[#30363d] sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <svg
              className="w-8 h-8 text-[#58a6ff]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-[#f0f6fc]">
              GitHub Analyzer
            </h1>
          </Link>
          <div className="flex items-center gap-4 flex-1 justify-end">
            <div className="w-full max-w-md hidden sm:block">
              {!isHomePage && <SearchBar onSearch={handleSearch} />}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-[#30363d] text-gray-700 dark:text-[#c9d1d9] hover:bg-gray-300 dark:hover:bg-[#444c56] transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        {/* Mobile Search Bar */}
        {!isHomePage && (
          <div className="px-4 py-2 sm:hidden border-t border-gray-200 dark:border-[#30363d]">
            <SearchBar onSearch={handleSearch} />
          </div>
        )}
      </header>

      {/* Routes */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/u/:username" element={<ProfilePage />} />
          <Route path="/compare/:user1/:user2" element={<ComparePage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
