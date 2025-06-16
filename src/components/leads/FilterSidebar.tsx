import { FiX } from 'react-icons/fi';
import { Filters } from './types';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  uniqueStatuses: string[];
  uniqueIndustries: string[];
  uniqueLocations: string[];
  allBudgets: string[];
  allEmployees: string[];
  allRevenues: string[];
  allTechnologies: string[];
  foundedDecades: number[];
  toggleFilterValue: (filterName: keyof Filters, value: any) => void;
  updateFilter: (filterName: keyof Filters, value: any) => void;
}

const FilterSidebar = ({
  isOpen,
  onClose,
  filters,
  uniqueStatuses,
  uniqueIndustries,
  uniqueLocations,
  allBudgets,
  allEmployees,
  allRevenues,
  allTechnologies,
  foundedDecades,
  toggleFilterValue,
  updateFilter
}: FilterSidebarProps) => {
  if (!isOpen) return null;

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 md:block">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button 
          onClick={onClose}
          className="md:hidden text-gray-500 hover:text-gray-700"
        >
          <FiX />
        </button>
      </div>
      
      <div className="space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 150px)' }}>
        {/* Status Filter */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Status</h3>
          <div className="space-y-2">
            {uniqueStatuses.map(status => (
              <label key={status} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={() => toggleFilterValue('status', status)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-gray-700 capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Industry Filter */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Industry</h3>
          <div className="space-y-2">
            {uniqueIndustries.map(industry => (
              <label key={industry} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.industry.includes(industry)}
                  onChange={() => toggleFilterValue('industry', industry)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-gray-700">{industry}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Location Filter */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Location</h3>
          <div className="space-y-2">
            {uniqueLocations.map(location => (
              <label key={location} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.location.includes(location)}
                  onChange={() => toggleFilterValue('location', location)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-gray-700">{location}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Business Specific Filters */}
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Company Size</h3>
          <div className="space-y-2">
            {allEmployees.map(size => (
              <label key={size} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.employees.includes(size)}
                  onChange={() => toggleFilterValue('employees', size)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-gray-700">{size} employees</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Annual Revenue</h3>
          <div className="space-y-2">
            {allRevenues.map(revenue => (
              <label key={revenue} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.revenue.includes(revenue)}
                  onChange={() => toggleFilterValue('revenue', revenue)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-gray-700">{revenue}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Budget</h3>
          <div className="space-y-2">
            {allBudgets.map(budget => (
              <label key={budget} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.budget.includes(budget)}
                  onChange={() => toggleFilterValue('budget', budget)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-gray-700">{budget}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Founded</h3>
          <div className="space-y-2">
            {foundedDecades.map(decade => (
              <label key={decade} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.foundedYears.includes(decade)}
                  onChange={() => toggleFilterValue('foundedYears', decade)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-gray-700">{decade}s</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Technologies</h3>
          <div className="space-y-2">
            {allTechnologies.map(tech => (
              <label key={tech} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.technologies.includes(tech)}
                  onChange={() => toggleFilterValue('technologies', tech)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <span className="ml-2 text-gray-700">{tech}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 mb-2">Other</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.starred}
              onChange={() => updateFilter('starred', !filters.starred)}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <span className="ml-2 text-gray-700">Starred only</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;