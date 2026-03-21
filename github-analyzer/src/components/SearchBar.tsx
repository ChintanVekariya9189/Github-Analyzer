import { useState, type KeyboardEvent } from 'react';

interface SearchBarProps {
  onSearch: (username: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState('');

  // Only fires search on Enter key — NOT on every keystroke
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      triggerSearch();
    }
  };

  const triggerSearch = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  return (
    <div className="flex gap-2 w-full">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search or jump to..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-1.5 text-sm text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e] pointer-events-none hidden md:block flex items-center">
          <kbd className="text-[10px] font-sans border border-[#30363d] rounded px-1.5 py-0.5 bg-[#161b22] flex items-center justify-center min-w-[1.5rem] h-5">
            /
          </kbd>
        </div>
      </div>
      <button
        onClick={triggerSearch}
        className="px-4 py-1.5 bg-[#21262d] border border-[#30363d] rounded-lg text-sm font-medium text-[#c9d1d9] hover:bg-[#30363d] hover:border-[#8b949e] transition-all"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
