import { FiSearch, FiMenu } from "react-icons/fi";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  setIsComposeOpen: (open: boolean) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  handleSearch,
  setIsComposeOpen,
  isSidebarOpen,
  setIsSidebarOpen,
}: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden text-[#53545C] hover:text-[#5570F1]"
        >
          <FiMenu size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#53545C]">Unibox</h1>
          <p className="text-[#53545C] text-sm">Manage all your email conversations in one place.</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={handleSearch}
            className="pl-10 pr-4 py-2 border border-gray-200 text-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5570F1] w-64"
          />
        </div>
        <button
          onClick={() => setIsComposeOpen(true)}
          className="px-4 py-2 bg-[#5570F1] text-white rounded-xl hover:bg-blue-600 flex items-center gap-2"
        >
          <span className="text-lg">+</span> Compose
        </button>
      </div>
    </div>
  );
}