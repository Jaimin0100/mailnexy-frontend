import { useState } from "react";
import Link from "next/link";
import { 
  FiMail, FiMapPin, FiTag, FiEdit, FiTrash2, FiPlus, FiUpload, 
  FiClock, FiCheckCircle 
} from 'react-icons/fi';
import { Lead, ShowColumnsType } from "./lead";

type LeadsTableProps = {
  leads: Lead[];
  showColumns: ShowColumnsType;
  selectedLeads: Set<string>;
  handleSelect: (id: string) => void;
  handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomizeClick: () => void;
  setCurrentLead: (lead: Lead | null) => void;
  setEditLead: (lead: any) => void;
  setIsEditPopupOpen: (open: boolean) => void;
  deleteLead: (id: string) => void;
  filteredLeads: Lead[];
  setIsAddLeadOpen: (open: boolean) => void;
  handleAddLeadOption: (option: string) => void;
};

export default function LeadsTable({
  leads,
  showColumns,
  selectedLeads,
  handleSelect,
  handleSelectAll,
  handleCustomizeClick,
  setCurrentLead,
  setEditLead,
  setIsEditPopupOpen,
  deleteLead,
  filteredLeads,
  setIsAddLeadOpen,
  handleAddLeadOption
}: LeadsTableProps) {
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  return (
    <div className="bg-white pt-2 rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="border-b border-gray-200 font-medium">
          <tr>
            <th className="text-left p-4 text-[#53545C] w-12">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                onChange={handleSelectAll}
                checked={selectedLeads.size === leads.length && leads.length > 0}
              />
            </th>
            <th className="text-left p-4 text-[#53545C]">Lead</th>
            <th className="text-left p-4 text-[#53545C]">Email</th>
            {showColumns.firstName && <th className="text-left p-4 text-[#53545C]">First Name</th>}
            {showColumns.lastName && <th className="text-left p-4 text-[#53545C]">Last Name</th>}
            {showColumns.industry && <th className="text-left p-4 text-[#53545C]">Industry</th>}
            {showColumns.companyIndustry && <th className="text-left p-4 text-[#53545C]">Company Industry</th>}
            {showColumns.country && <th className="text-left p-4 text-[#53545C]">Country</th>}
            {showColumns.companyCountry && <th className="text-left p-4 text-[#53545C]">Company Country</th>}
            {showColumns.location && <th className="text-left p-4 text-[#53545C]">Location</th>}
            {showColumns.lists && <th className="text-left p-4 text-[#53545C]">Lists</th>}
            {showColumns.tags && <th className="text-left p-4 text-[#53545C]">Tags</th>}
            {showColumns.dateAdded && <th className="text-left p-4 text-[#53545C]">Date Added</th>}
            {showColumns.deals && <th className="text-left p-4 text-[#53545C]">Deals</th>}
            {showColumns.verified && <th className="text-left p-4 text-[#53545C]">Verified</th>}
            <th className="text-left p-4 text-[#53545C] w-12">
              <div className="cursor-pointer" onClick={handleCustomizeClick}>
                <span className="mx-auto">⚙️</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.length > 0 ? (
            leads.map(lead => (
              <tr key={lead.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={selectedLeads.has(lead.id)}
                    onChange={() => handleSelect(lead.id)}
                  />
                </td>
                <td className="p-4">
                  <Link href={`/campaign/leads/${lead.id}`} className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 mr-3" />
                    <div>
                      <div className="font-medium text-[#53545C]">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.company}</div>
                    </div>
                  </Link>
                </td>
                <td className="p-4 text-[#53545C]">
                  <div className="flex items-center">
                    <FiMail className="mr-2 text-gray-500" />
                    {lead.email}
                  </div>
                </td>
                {showColumns.firstName && <td className="p-4 text-[#53545C]">{lead.firstName}</td>}
                {showColumns.lastName && <td className="p-4 text-[#53545C]">{lead.lastName}</td>}
                {showColumns.industry && <td className="p-4 text-[#53545C]">{lead.industry}</td>}
                {showColumns.companyIndustry && <td className="p-4 text-[#53545C]">{lead.companyIndustry}</td>}
                {showColumns.country && <td className="p-4 text-[#53545C]">{lead.country}</td>}
                {showColumns.companyCountry && <td className="p-4 text-[#53545C]">{lead.companyCountry}</td>}
                {showColumns.location && <td className="p-4 text-[#53545C]">
                  <div className="flex items-center">
                    <FiMapPin className="mr-2 text-gray-500" />
                    {lead.location}
                  </div>
                </td>}
                {showColumns.lists && <td className="p-4 text-[#53545C]">{lead.lists}</td>}
                {showColumns.tags && <td className="p-4 text-[#53545C]">
                  <div className="flex items-center">
                    <FiTag className="mr-2 text-gray-500" />
                    {lead.tags}
                  </div>
                </td>}
                {showColumns.dateAdded && <td className="p-4 text-[#53545C]">{lead.dateAdded}</td>}
                {showColumns.deals && <td className="p-4 text-[#53545C]">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {lead.deals} deals
                  </span>
                </td>}
                {showColumns.verified && <td className="p-4 text-[#53545C]">
                  {lead.verified ? 
                    <span className="text-green-600 flex items-center"><FiCheckCircle className="mr-1" /> Verified</span> : 
                    <span className="text-red-500 flex items-center"><FiClock className="mr-1" /> Pending</span>
                  }
                </td>}
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentLead(lead);
                        setEditLead({
                          firstName: lead.firstName,
                          lastName: lead.lastName,
                          email: lead.email,
                          company: lead.company,
                          position: lead.position,
                          location: lead.location,
                          tags: lead.tags,
                        });
                        setIsEditPopupOpen(true);
                      }}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLead(lead.id);
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={15} className="p-12 text-center text-gray-500">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                <p className="font-medium">No leads found</p>
                <p className="mt-2">Try adjusting your search or import new leads</p>
                <div className="mt-4 space-x-4 flex justify-center">
                  <button
                    className="px-4 py-2 bg-[#5570F1] text-white rounded-lg gap-2 flex items-center hover:bg-blue-700"
                    onClick={() => setIsAddLeadOpen(true)}
                  >
                    <FiPlus />
                    Add Leads
                  </button>
                  <button
                    className="px-4 py-2 bg-white text-[#53545C] border border-gray-200 rounded-lg gap-2 flex items-center hover:bg-gray-100"
                    onClick={() => handleAddLeadOption('import')}
                  >
                    <FiUpload />
                    Import File
                  </button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}