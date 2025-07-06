import { 
    FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight 
  } from 'react-icons/fi';
  
  type PaginationProps = {
    currentPage: number;
    totalPages: number;
    indexOfFirstLead: number;
    indexOfLastLead: number;
    filteredLeads: any[];
    paginate: (pageNumber: number) => void;
  };
  
  export default function Pagination({
    currentPage,
    totalPages,
    indexOfFirstLead,
    indexOfLastLead,
    filteredLeads,
    paginate
  }: PaginationProps) {
    return (
      <div className="flex justify-between items-center p-4 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Showing {indexOfFirstLead + 1} to {Math.min(indexOfLastLead, filteredLeads.length)} of {filteredLeads.length} leads
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => paginate(1)} 
            disabled={currentPage === 1}
            className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400' : 'hover:bg-gray-100'}`}
          >
            <FiChevronsLeft />
          </button>
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400' : 'hover:bg-gray-100'}`}
          >
            <FiChevronLeft />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`w-8 h-8 rounded-full text-sm ${currentPage === i + 1 ? 'bg-[#5570F1] text-white' : 'hover:bg-gray-100'}`}
            >
              {i + 1}
            </button>
          ))}
          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-400' : 'hover:bg-gray-100'}`}
          >
            <FiChevronRight />
          </button>
          <button 
            onClick={() => paginate(totalPages)} 
            disabled={currentPage === totalPages}
            className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-400' : 'hover:bg-gray-100'}`}
          >
            <FiChevronsRight />
          </button>
        </div>
      </div>
    );
  }