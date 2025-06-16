import { FiX } from 'react-icons/fi';
import { Filters } from './types';

interface FilterChipsProps {
  filters: Filters;
  removeFilter: (filterType: keyof Filters, value?: any) => void;
  clearAllFilters: () => void;
}

const FilterChips = ({ filters, removeFilter, clearAllFilters }: FilterChipsProps) => {
  const hasActiveFilters = (
    filters.status.length > 0 || 
    filters.industry.length > 0 || 
    filters.location.length > 0 || 
    filters.tags.length > 0 || 
    filters.starred || 
    filters.lastContacted ||
    filters.budget.length > 0 ||
    filters.employees.length > 0 ||
    filters.revenue.length > 0 ||
    filters.foundedYears.length > 0 ||
    filters.technologies.length > 0
  );

  if (!hasActiveFilters) return null;

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-wrap gap-2">
        {filters.status.map(status => (
          <span key={status} className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
            Status: {status}
            <button onClick={() => removeFilter('status', status)} className="ml-1">
              <FiX size={14} />
            </button>
          </span>
        ))}
        
        {filters.industry.map(industry => (
          <span key={industry} className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
            Industry: {industry}
            <button onClick={() => removeFilter('industry', industry)} className="ml-1">
              <FiX size={14} />
            </button>
          </span>
        ))}
        
        {filters.location.map(location => (
          <span key={location} className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm">
            Location: {location}
            <button onClick={() => removeFilter('location', location)} className="ml-1">
              <FiX size={14} />
            </button>
          </span>
        ))}
        
        {filters.budget.map(budget => (
          <span key={budget} className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">
            Budget: {budget}
            <button onClick={() => removeFilter('budget', budget)} className="ml-1">
              <FiX size={14} />
            </button>
          </span>
        ))}
        
        {filters.employees.map(size => (
          <span key={size} className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm">
            Employees: {size}
            <button onClick={() => removeFilter('employees', size)} className="ml-1">
              <FiX size={14} />
            </button>
          </span>
        ))}
        
        {filters.revenue.map(revenue => (
          <span key={revenue} className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-800 text-sm">
            Revenue: {revenue}
            <button onClick={() => removeFilter('revenue', revenue)} className="ml-1">
              <FiX size={14} />
            </button>
          </span>
        ))}
        
        {filters.foundedYears.map(year => (
          <span key={year} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">
            Founded: {year}s
            <button onClick={() => removeFilter('foundedYears', year)} className="ml-1">
              <FiX size={14} />
            </button>
          </span>
        ))}
        
        {filters.technologies.map(tech => (
          <span key={tech} className="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-sm">
            Tech: {tech}
            <button onClick={() => removeFilter('technologies', tech)} className="ml-1">
              <FiX size={14} />
            </button>
          </span>
        ))}
        
        {filters.starred && (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-sm">
            Starred only
            <button onClick={() => removeFilter('starred')} className="ml-1">
              <FiX size={14} />
            </button>
          </span>
        )}
        
        <button 
          onClick={clearAllFilters} 
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear all
        </button>
      </div>
    </div>
  );
};

export default FilterChips;