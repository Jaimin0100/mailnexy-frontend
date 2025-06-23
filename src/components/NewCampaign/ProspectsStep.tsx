"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  FiUser, 
  FiCreditCard, 
  FiPackage, 
  FiBriefcase, 
  FiGlobe, 
  FiHome, 
  FiMapPin, 
  FiList, 
  FiTag, 
  FiCalendar, 
  FiDollarSign 
} from 'react-icons/fi';

interface ProspectsStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ProspectsStep({ onNext, onBack }: ProspectsStepProps) {
  const [selectedProspects, setSelectedProspects] = useState<Set<number>>(new Set());
  const [statuses, setStatuses] = useState<{ [key: number]: string }>({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showColumns, setShowColumns] = useState({
    firstName: true,
    lastName: false,
    industry: false,
    companyIndustry: false,
    country: false,
    companyCountry: false,
    location: false,
    lists: false,
    tags: true,
    dateAdded: false,
    deals: false,
    linkedin: false,
  });

  // Mock prospects data for demonstration
  const prospects = [
    // { id: 1, name: "John Doe", email: "john@example.com", firstName: "John", lastName: "Doe", company: "Acme Inc", position: "Developer" },
    // { id: 2, name: "Jane Smith", email: "jane@example.com", firstName: "Jane", lastName: "Smith", company: "XYZ Corp", position: "Manager" }
  ];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = prospects.map(p => p.id);
      setSelectedProspects(new Set(allIds));
    } else {
      setSelectedProspects(new Set());
    }
  };

  const handleSelect = (id: number) => {
    const newSelected = new Set(selectedProspects);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProspects(newSelected);
  };

  const handleStatusChange = (id: number, value: string) => {
    setStatuses(prev => ({ ...prev, [id]: value }));
  };

  const toggleColumn = (column: string) => {
    setShowColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  const handleCustomizeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsPopupOpen(true);
  };

  return (
    <div className="p-2 h-full flex flex-col">
      <div className="flex-1">
        <div><h1 className="text-2xl font-bold text-[#53545C] pt-[-4]">Prospect List</h1></div>
        <div className="flex space-x-4 mb-4">
          <button className="px-4 py-2 bg-[#5570F1] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700">
            <Image width={20} height={20} src="/AddProspect.svg" alt="Empty Prospect List" className="mx-auto" />
            Add Prospects
          </button>
          <button className="px-4 py-2 bg-white text-[#53545C] border border-gray-200 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100">
            <Image width={20} height={20} src="/listvarify.svg" alt="Empty Prospect List" className="mx-auto" />
            Verify Emails
          </button>
        </div>
        <div className="bg-white pt-2 rounded-lg border border-gray-200 text-center">
          <table className="w-full mb-4 text-sm gap-20">
            <thead className="border-b border-gray-200 font-medium">
              <tr>
                <th className="text-left p-2 text-[#53545C]">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-gray-300" 
                    onChange={handleSelectAll} 
                    checked={selectedProspects.size === prospects.length && prospects.length > 0} 
                  />
                </th>
                <th className="text-left p-2 text-[#53545C]">Prospects({prospects.length})</th>
                <th className="text-left p-2 text-[#53545C]">Email</th>
                {showColumns.firstName && <th className="text-left p-2 text-[#53545C]">First Name</th>}
                {showColumns.lastName && <th className="text-left p-2 text-[#53545C]">Last Name</th>}
                {showColumns.industry && <th className="text-left p-2 text-[#53545C]">Industry</th>}
                {showColumns.companyIndustry && <th className="text-left p-2 text-[#53545C]">Company Industry</th>}
                {showColumns.country && <th className="text-left p-2 text-[#53545C]">Country</th>}
                {showColumns.companyCountry && <th className="text-left p-2 text-[#53545C]">Company Country</th>}
                {showColumns.location && <th className="text-left p-2 text-[#53545C]">Location</th>}
                {showColumns.lists && <th className="text-left p-2 text-[#53545C]">Lists</th>}
                {showColumns.tags && <th className="text-left p-2 text-[#53545C]">Tags</th>}
                {showColumns.dateAdded && <th className="text-left p-2 text-[#53545C]">Date Added</th>}
                {showColumns.deals && <th className="text-left p-2 text-[#53545C]">Deals</th>}
                <th className="text-left p-2 text-[#53545C]">
                  <Image width={20} height={20} src="/customize.svg" alt="Empty Prospect List" className="mx-auto" onClick={handleCustomizeClick} />
                </th>
              </tr>
            </thead>
            <tbody>
              {prospects.length > 0 ? (
                prospects.map(prospect => (
                  <tr key={prospect.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={selectedProspects.has(prospect.id)}
                        onChange={() => handleSelect(prospect.id)}
                      />
                    </td>
                    <td className="p-3 text-left text-[#53545C]">{prospect.name}</td>
                    <td className="p-3 text-left text-[#53545C]">{prospect.email}</td>
                    {showColumns.firstName && <td className="p-3 text-left text-[#53545C]">{prospect.firstName}</td>}
                    {showColumns.lastName && <td className="p-3 text-left text-[#53545C]">{prospect.lastName}</td>}
                    {showColumns.industry && <td className="p-3 text-left text-[#53545C]">{prospect.industry || "N/A"}</td>}
                    {showColumns.companyIndustry && <td className="p-3 text-left text-[#53545C]">{prospect.companyIndustry || "N/A"}</td>}
                    {showColumns.country && <td className="p-3 text-left text-[#53545C]">{prospect.country || "N/A"}</td>}
                    {showColumns.companyCountry && <td className="p-3 text-left text-[#53545C]">{prospect.companyCountry || "N/A"}</td>}
                    {showColumns.location && <td className="p-3 text-left text-[#53545C]">{prospect.location || "N/A"}</td>}
                    {showColumns.lists && <td className="p-3 text-left text-[#53545C]">{prospect.lists || "N/A"}</td>}
                    {showColumns.tags && <td className="p-3 text-left text-[#53545C]">{prospect.tags || "N/A"}</td>}
                    {showColumns.dateAdded && <td className="p-3 text-left text-[#53545C]">{prospect.dateAdded || "N/A"}</td>}
                    {showColumns.deals && <td className="p-3 text-left text-[#53545C]">{prospect.deals || "N/A"}</td>}
                    <td className="p-3">
                      <select
                        className="w-full p-1 border border-gray-300 rounded-md text-sm text-[#53545C]"
                        value={statuses[prospect.id] || ""}
                        onChange={(e) => handleStatusChange(prospect.id, e.target.value)}
                      >
                        <option value="">Select status</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="interested">Interested</option>
                        <option value="not-interested">Not Interested</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-4 text-[#53545C]">
                    <Image width={300} height={300} src="/leads.png" alt="Empty Prospect List" className="mx-auto" />
                    <p className="text-[#53545C] mt-4 font-bold text-lg">This Prospect List is empty</p>
                    <p className="text-[#53545C]">Explore millions of leads in our database or upload yours</p>
                    <div className="mt-4 space-x-4 flex justify-center">
                      <button className="px-4 py-2 bg-[#5570F1] text-white rounded-lg gap-2 flex items-center hover:bg-blue-700">
                        <Image width={20} height={20} src="/AddProspect.svg" alt="Add Prospects" className="mx-auto" />
                        Add Prospects
                      </button>
                      <button className="px-4 py-2 bg-white text-[#53545C] border border-gray-200 rounded-lg gap-2 flex items-center hover:bg-gray-100">
                        <Image width={20} height={20} src="/uploadlist.svg" alt="Upload List" className="mx-auto" />
                        Upload List
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Column customization popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsPopupOpen(false)}>
          <div 
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-lg w-100 h-140 flex flex-col" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-bold text-[#53545C]">Show Columns</h2>
              <button 
                onClick={() => setIsPopupOpen(false)}
                className="text-red-500 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {Object.entries({
                firstName: "User",
                lastName: "IdCard",
                industry: "Factory",
                companyIndustry: "Building",
                country: "Globe",
                companyCountry: "OfficeBuilding",
                location: "MapPin",
                lists: "ListUl",
                tags: "Tag",
                dateAdded: "Calendar",
                deals: "Handshake",
                linkedin: "Linkedin"
              }).map(([column, iconName]) => (
                <div 
                  key={column} 
                  className="flex items-center justify-between mb-2 border border-gray-200 hover:border-[#5570F1] p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    {iconName === "User" && <FiUser className="mr-2 text-[#5570F1]" />}
                    {iconName === "IdCard" && <FiCreditCard className="mr-2 text-[#5570F1]" />}
                    {iconName === "Factory" && <FiPackage className="mr-2 text-[#5570F1]" />}
                    {iconName === "Building" && <FiBriefcase className="mr-2 text-[#5570F1]" />}
                    {iconName === "Globe" && <FiGlobe className="mr-2 text-[#5570F1]" />}
                    {iconName === "OfficeBuilding" && <FiHome className="mr-2 text-[#5570F1]" />}
                    {iconName === "MapPin" && <FiMapPin className="mr-2 text-[#5570F1]" />}
                    {iconName === "ListUl" && <FiList className="mr-2 text-[#5570F1]" />}
                    {iconName === "Tag" && <FiTag className="mr-2 text-[#5570F1]" />}
                    {iconName === "Calendar" && <FiCalendar className="mr-2 text-[#5570F1]" />}
                    {iconName === "Handshake" && <FiDollarSign className="mr-2 text-[#5570F1]" />}
                    
                    <span className="text-sm text-[#53545C]">
                      {column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showColumns[column as keyof typeof showColumns]}
                      onChange={() => toggleColumn(column)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5570F1]"></div>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2 mt-4 pt-2 border-t">
              <button 
                onClick={() => setIsPopupOpen(false)}
                className="px-4 py-2 text-white bg-red-500 hover:bg-red-700 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsPopupOpen(false)}
                className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}