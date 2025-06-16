import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchBar = ({ searchQuery, onSearchChange }: SearchBarProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search leads by name, email, company, etc..."
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;