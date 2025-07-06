import { ReactNode } from "react";
import { FiPlus, FiChevronDown, FiCheckCircle, FiSearch, FiFile } from "react-icons/fi";

type LeadsPageProps = {
  isLoading: boolean;
  error: string | null;
  fetchLeads: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isVerifyPopupOpen: boolean;
  setIsVerifyPopupOpen: (open: boolean) => void;
  isAddLeadOpen: boolean;
  setIsAddLeadOpen: (open: boolean) => void;
  handleAddLeadOption: (option: string) => void;
  children: ReactNode;
};

export default function LeadsPage({
  isLoading,
  error,
  fetchLeads,
  searchTerm,
  setSearchTerm,
  isVerifyPopupOpen,
  setIsVerifyPopupOpen,
  isAddLeadOpen,
  setIsAddLeadOpen,
  handleAddLeadOption,
  children
}: LeadsPageProps) {
  if (isLoading) {
    return (
      <div className="p-6 h-full flex flex-col bg-[#F5F7FA] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5570F1]"></div>
        <p className="mt-4 text-[#53545C]">Loading leads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 h-full flex flex-col bg-[#F5F7FA] items-center justify-center">
        <div className="text-red-500 text-4xl mb-4">✕</div>
        <p className="text-[#53545C] text-center mb-4">{error}</p>
        <button 
          className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700"
          onClick={fetchLeads}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col bg-[#F5F7FA]">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#53545C] flex items-center">
              <FiFile className="text-[#5570F1] mr-3" />
              Sales Leads
              <span className="ml-2 text-gray-500 text-sm font-normal">(0 leads)</span>
            </h1>
          </div>
          <div className="flex space-x-4">
            <button 
              className="px-4 py-2 bg-white text-[#53545C] border border-gray-200 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100"
              onClick={() => setIsVerifyPopupOpen(true)}
            >
              <FiCheckCircle className="text-green-500" />
              Verify Emails
            </button>
            <div className="relative">
              <button
                className="px-4 py-2 bg-[#5570F1] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
                onClick={() => setIsAddLeadOpen(!isAddLeadOpen)}
              >
                <FiPlus />
                Add Leads
                <FiChevronDown className={`transition-transform ${isAddLeadOpen ? 'rotate-180' : ''}`} />
              </button>
              {isAddLeadOpen && (
                <div className="absolute z-20 mt-2 right-0 w-56 bg-white rounded-md shadow-lg border border-gray-200">
                  <div className="py-1">
                    <button
                      className="flex items-center px-4 py-2 text-sm text-[#53545C] hover:bg-gray-100 w-full text-left"
                      onClick={() => handleAddLeadOption('search')}
                    >
                      <FiSearch className="mr-2 text-[#5570F1]" />
                      Search Database
                    </button>
                    <button
                      className="flex items-center px-4 py-2 text-sm text-[#53545C] hover:bg-gray-100 w-full text-left"
                      onClick={() => handleAddLeadOption('import')}
                    >
                      <FiPlus className="mr-2 text-[#5570F1]" />
                      Import File
                    </button>
                    <button
                      className="flex items-center px-4 py-2 text-sm text-[#53545C] hover:bg-gray-100 w-full text-left"
                      onClick={() => handleAddLeadOption('create')}
                    >
                      <FiPlus className="mr-2 text-[#5570F1]" />
                      Create Manually
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mb-4">
          <div className="relative w-1/3">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads by name, email, company, tags..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border text-gray-500 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5570F1] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-2 bg-white text-[#53545C] border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-100">
              <span>⚙️</span>
              Filters
            </button>
          </div>
        </div>
        
        {children}
      </div>
    </div>
  );
}