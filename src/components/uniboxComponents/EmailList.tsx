import { FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Email = { id: number; sender: string; subject: string; snippet: string; received_at: string; is_read: boolean; is_starred: boolean; status: string; campaign_id?: number };

interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  setSelectedEmail: (email: Email | null) => void;
  selectedRows: number[];
  handleRowSelect: (emailId: number) => void;
  handleSelectAll: () => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  handleEmailAction: (action: "archive" | "trash" | "mark_read" | "star", emailIds: number[]) => void;
}

export default function EmailList({
  emails,
  selectedEmail,
  setSelectedEmail,
  selectedRows,
  handleRowSelect,
  handleSelectAll,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  handleEmailAction,
}: EmailListProps) {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = emails.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(emails.length / itemsPerPage));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center gap-2">
        <input
          type="checkbox"
          checked={selectedRows.length === currentItems.length && currentItems.length > 0}
          onChange={handleSelectAll}
          className="h-4 w-4 text-[#5570F1] border-gray-300 rounded focus:ring-[#5570F1]"
        />
        <span className="text-sm text-[#53545C] font-semibold">Select All</span>
      </div>
      {emails.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No emails found. Try adjusting your filters or search query.
        </div>
      ) : (
        currentItems.map((email) => (
          <div
            key={email.id}
            onClick={() => setSelectedEmail(email)}
            className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer flex items-start gap-3 ${
              selectedEmail?.id === email.id ? "bg-[#5570F1]/10" : ""
            }`}
          >
            <input
              type="checkbox"
              checked={selectedRows.includes(email.id)}
              onChange={() => handleRowSelect(email.id)}
              onClick={(e) => e.stopPropagation()}
              className="h-4 w-4 text-[#5570F1] border-gray-300 rounded focus:ring-[#5570F1]"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEmailAction("star", [email.id]);
                    }}
                    className={`text-${email.is_starred ? "yellow-400" : "gray-400"} hover:text-yellow-500`}
                  >
                    <FiStar size={16} fill={email.is_starred ? "currentColor" : "none"} />
                  </button>
                  <span
                    className={`text-sm font-semibold ${
                      email.is_read ? "text-[#53545C]" : "text-[#5570F1]"
                    }`}
                  >
                    {email.sender}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(email.received_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm text-[#53545C] truncate">{email.subject}</p>
              <p className="text-xs text-gray-500 truncate">{email.snippet}</p>
            </div>
          </div>
        ))
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <span className="text-sm text-gray-700">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, emails.length)} of {emails.length} emails
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-[#53545C] hover:bg-gray-100"
              }`}
            >
              <FiChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === number ? "bg-[#5570F1] text-white" : "text-[#53545C] hover:bg-gray-100"
                }`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-[#53545C] hover:bg-gray-100"
              }`}
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}