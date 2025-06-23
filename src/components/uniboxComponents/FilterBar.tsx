import { useState } from "react";
import { FiInbox, FiSend, FiArchive, FiTrash, FiFilter } from "react-icons/fi";

interface FilterBarProps {
  filters: { status: string; campaign_id?: number; is_read?: boolean; is_starred?: boolean };
  handleFilterChange: (filters: Partial<{ status: string; campaign_id?: number; is_read?: boolean; is_starred?: boolean }>) => void;
  selectedRows: number[];
  handleEmailAction: (action: "archive" | "trash" | "mark_read" | "star", emailIds: number[]) => void;
}

export default function FilterBar({ filters, handleFilterChange, selectedRows, handleEmailAction }: FilterBarProps) {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const filterOptions = [
    { label: "All", value: undefined, type: "is_read" },
    { label: "Read", value: true, type: "is_read" },
    { label: "Unread", value: false, type: "is_read" },
    { label: "Starred", value: true, type: "is_starred" },
    { label: "Campaign 1", value: 1, type: "campaign_id" },
    { label: "Campaign 2", value: 2, type: "campaign_id" },
  ];

  return (
    <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-xl border border-gray-200 relative">
      <div className="flex gap-2">
        <button
          onClick={() => handleFilterChange({ status: "inbox" })}
          className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 ${
            filters.status === "inbox" ? "bg-[#5570F1] text-white" : "text-[#53545C] hover:bg-gray-100"
          }`}
        >
          <FiInbox size={16} /> Inbox
        </button>
        <button
          onClick={() => handleFilterChange({ status: "sent" })}
          className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 ${
            filters.status === "sent" ? "bg-[#5570F1] text-white" : "text-[#53545C] hover:bg-gray-100"
          }`}
        >
          <FiSend size={16} /> Sent
        </button>
        <button
          onClick={() => handleFilterChange({ status: "archived" })}
          className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 ${
            filters.status === "archived" ? "bg-[#5570F1] text-white" : "text-[#53545C] hover:bg-gray-100"
          }`}
        >
          <FiArchive size={16} /> Archived
        </button>
        <button
          onClick={() => handleFilterChange({ status: "trash" })}
          className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 ${
            filters.status === "trash" ? "bg-[#5570F1] text-white" : "text-[#53545C] hover:bg-gray-100"
          }`}
        >
          <FiTrash size={16} /> Trash
        </button>
        <div className="relative">
          <button
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="px-4 py-2 rounded-full text-sm flex items-center gap-2 text-[#53545C] hover:bg-gray-100"
          >
            <FiFilter size={16} /> More Filters
          </button>
          {isFilterDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-48 z-10">
              {filterOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => {
                    handleFilterChange({ [option.type]: option.value });
                    setIsFilterDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-[#53545C] hover:bg-gray-100"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedRows.length > 0 && (
        <div className="flex gap-2">
          <button
            onClick={() => handleEmailAction("archive", selectedRows)}
            className="flex items-center gap-1 px-3 py-2 text-[#53545C] hover:text-[#5570F1]"
          >
            <FiArchive size={16} /> Archive
          </button>
          <button
            onClick={() => handleEmailAction("trash", selectedRows)}
            className="flex items-center gap-1 px-3 py-2 text-[#53545C] hover:text-[#EF4444]"
          >
            <FiTrash size={16} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}