import { Lead } from './types';
import LeadTableRow from './LeadTableRow';

interface LeadTableProps {
  leads: Lead[];
  selectedLeads: number[];
  handleLeadSelect: (id: number) => void;
  handleSelectAll: () => void;
  toggleStar: (id: number) => void;
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
  filters: any;
}

const LeadTable = ({
  leads,
  selectedLeads,
  handleLeadSelect,
  handleSelectAll,
  toggleStar,
  currentPage,
  itemsPerPage,
  searchQuery,
  filters
}: LeadTableProps) => {
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = indexOfFirstItem + itemsPerPage;
  const currentItems = leads.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedLeads.length === leads.length && leads.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 rounded"
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Industry
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employees
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revenue
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  {searchQuery || Object.values(filters).some(f => f && (Array.isArray(f) ? f.length > 0 : f !== '')) 
                    ? "No leads match your filters. Try adjusting your search or filters."
                    : "No leads found. Add your first lead to get started."}
                </td>
              </tr>
            ) : (
              currentItems.map((lead) => (
                <LeadTableRow 
                  key={lead.id}
                  lead={lead}
                  isSelected={selectedLeads.includes(lead.id)}
                  onSelect={handleLeadSelect}
                  onToggleStar={toggleStar}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;