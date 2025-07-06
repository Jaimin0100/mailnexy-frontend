import { 
    FiUser, FiCreditCard, FiPackage, FiBriefcase, FiGlobe, 
    FiHome, FiMapPin, FiList, FiTag, FiCalendar, 
    FiDollarSign, FiCheckCircle, FiX 
  } from 'react-icons/fi';
  
  type CustomizeColumnsPopupProps = {
    showColumns: any;
    toggleColumn: (column: string) => void;
    setIsPopupOpen: (open: boolean) => void;
  };
  
  export default function CustomizeColumnsPopup({
    showColumns,
    toggleColumn,
    setIsPopupOpen
  }: CustomizeColumnsPopupProps) {
    const columnIcons: Record<string, JSX.Element> = {
      firstName: <FiUser className="mr-2 text-[#5570F1]" />,
      lastName: <FiCreditCard className="mr-2 text-[#5570F1]" />,
      industry: <FiPackage className="mr-2 text-[#5570F1]" />,
      companyIndustry: <FiBriefcase className="mr-2 text-[#5570F1]" />,
      country: <FiGlobe className="mr-2 text-[#5570F1]" />,
      companyCountry: <FiHome className="mr-2 text-[#5570F1]" />,
      location: <FiMapPin className="mr-2 text-[#5570F1]" />,
      lists: <FiList className="mr-2 text-[#5570F1]" />,
      tags: <FiTag className="mr-2 text-[#5570F1]" />,
      dateAdded: <FiCalendar className="mr-2 text-[#5570F1]" />,
      deals: <FiDollarSign className="mr-2 text-[#5570F1]" />,
      verified: <FiCheckCircle className="mr-2 text-[#5570F1]" />
    };
  
    return (
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsPopupOpen(false)}>
        <div
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-lg w-96 h-[560px] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-bold text-[#53545C]">Show Columns</h2>
            <button
              onClick={() => setIsPopupOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {Object.keys(showColumns).map(column => (
              <div
                key={column}
                className="flex items-center justify-between mb-2 border border-gray-200 hover:border-[#5570F1] p-3 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  {columnIcons[column]}
                  <span className="text-sm text-[#53545C]">
                    {column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showColumns[column]}
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
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
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
    );
  }