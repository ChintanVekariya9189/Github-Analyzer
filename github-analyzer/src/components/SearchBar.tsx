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
    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
      <input
        type="text"
        placeholder="Enter GitHub username..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ padding: '8px 12px', fontSize: '16px', flex: 1 }}
      />
      <button
        onClick={triggerSearch}
        style={{ padding: '8px 16px', fontSize: '16px', cursor: 'pointer' }}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
