import { useState, useEffect, type KeyboardEvent } from 'react';

interface SearchBarProps {
  onSearch: (username: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('searchHistory');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const saveToHistory = (username: string) => {
    const newHistory = [
      username,
      ...history.filter((h) => h.toLowerCase() !== username.toLowerCase()),
    ].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      triggerSearch();
    }
  };

  const triggerSearch = (value?: string) => {
    const target = value || inputValue.trim();
    if (target) {
      onSearch(target);
      saveToHistory(target);
      if (!value) setInputValue('');
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2 w-full">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search or jump to..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-white dark:bg-[#0d1117] border border-gray-300 dark:border-[#30363d] rounded-lg px-4 py-1.5 text-sm text-gray-900 dark:text-[#c9d1d9] placeholder-gray-500 dark:placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all shadow-sm dark:shadow-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#8b949e] pointer-events-none hidden md:block">
            <kbd className="text-[10px] font-sans border border-gray-300 dark:border-[#30363d] rounded px-1.5 py-0.5 bg-gray-100 dark:bg-[#161b22] flex items-center justify-center min-w-[1.5rem] h-5">
              /
            </kbd>
          </div>
        </div>
        <button
          onClick={() => triggerSearch()}
          className="px-4 py-1.5 bg-gray-100 dark:bg-[#21262d] border border-gray-300 dark:border-[#30363d] rounded-lg text-sm font-medium text-gray-700 dark:text-[#c9d1d9] hover:bg-gray-200 dark:hover:bg-[#30363d] hover:border-gray-400 dark:hover:border-[#8b949e] transition-all"
        >
          Search
        </button>
      </div>
      
      {history.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {history.map((username) => (
            <button
              key={username}
              onClick={() => triggerSearch(username)}
              className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-[#1c2128] border border-gray-200 dark:border-[#30363d] text-gray-600 dark:text-[#8b949e] hover:bg-gray-200 dark:hover:bg-[#30363d] transition-all"
            >
              {username}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
