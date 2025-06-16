'use client';
import { useState, useEffect } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import FilterSidebar from '@/components/leads/FilterSidebar';
import LeadTable from '@/components/leads/LeadTable';
import FilterChips from '@/components/leads/FilterChips';
import Pagination from '@/components/leads/Pagination';
import SearchBar from '@/components/leads/SearchBar';
import ActionButtons from '@/components/leads/ActionButtons';
import { Lead, Filters } from '@/components/leads/types';

const LeadDatabase = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<Filters>({
    status: [],
    industry: [],
    location: [],
    tags: [],
    starred: false,
    lastContacted: '',
    budget: [],
    employees: [],
    revenue: [],
    foundedYears: [],
    technologies: [],
  });

  // Load mock data
  useEffect(() => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        const mockLeads: Lead[] = Array.from({ length: 100 }, (_, i) => ({
          id: i + 1,
          name: `Lead ${i + 1}`,
          email: `lead${i + 1}@example.com`,
          company: ['Tech Corp', 'Marketing Inc', 'Consulting LLC', 'Finance Partners', 'Retail Co'][i % 5],
          title: ['CEO', 'Marketing Director', 'Sales Manager', 'CTO', 'HR Specialist'][i % 5],
          location: ['New York', 'San Francisco', 'London', 'Berlin', 'Tokyo'][i % 5],
          industry: ['Technology', 'Marketing', 'Finance', 'Retail', 'Healthcare'][i % 5],
          website: `https://company${i % 10}.com`,
          phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
          lastContacted: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          status: ['new', 'contacted', 'interested', 'converted', 'unresponsive'][i % 5] as any,
          isStarred: i % 10 === 0,
          tags: ['VIP', 'Hot Lead', 'Cold', 'Enterprise', 'SMB'].filter(() => Math.random() > 0.7),
          customFields: {
            linkedIn: `https://linkedin.com/in/lead${i + 1}`,
            budget: ['$10k-$50k', '$50k-$100k', '$100k+'][i % 3],
            employees: ['1-10', '11-50', '51-200', '201-1000', '1000+'][Math.floor(Math.random() * 5)],
            revenue: ['<$1M', '$1M-$10M', '$10M-$50M', '$50M-$100M', '$100M+'][Math.floor(Math.random() * 5)],
            foundedYear: Math.floor(Math.random() * 30) + 1990,
            technologies: ['React', 'Node.js', 'Python', 'Java', 'AWS'].filter(() => Math.random() > 0.7),
          }
        }));
        
        setLeads(mockLeads);
        setFilteredLeads(mockLeads);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load leads');
      setIsLoading(false);
    }
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...leads];
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(lead => 
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.company.toLowerCase().includes(query) ||
        lead.title.toLowerCase().includes(query) ||
        lead.phone.toLowerCase().includes(query) ||
        lead.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Status filter
    if (filters.status.length > 0) {
      result = result.filter(lead => filters.status.includes(lead.status));
    }
    
    // Industry filter
    if (filters.industry.length > 0) {
      result = result.filter(lead => filters.industry.includes(lead.industry));
    }
    
    // Location filter
    if (filters.location.length > 0) {
      result = result.filter(lead => filters.location.includes(lead.location));
    }
    
    // Tags filter
    if (filters.tags.length > 0) {
      result = result.filter(lead => 
        filters.tags.some(tag => lead.tags.includes(tag))
      );
    }
    
    // Starred filter
    if (filters.starred) {
      result = result.filter(lead => lead.isStarred);
    }
    
    // Last contacted filter
    if (filters.lastContacted) {
      const days = parseInt(filters.lastContacted);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      result = result.filter(lead => {
        const contactedDate = new Date(lead.lastContacted);
        return contactedDate >= cutoffDate;
      });
    }
    
    // Business-specific filters
    if (filters.budget.length > 0) {
      result = result.filter(lead => 
        lead.customFields.budget && filters.budget.includes(lead.customFields.budget)
      );
    }
    
    if (filters.employees.length > 0) {
      result = result.filter(lead => 
        lead.customFields.employees && filters.employees.includes(lead.customFields.employees)
      );
    }
    
    if (filters.revenue.length > 0) {
      result = result.filter(lead => 
        lead.customFields.revenue && filters.revenue.includes(lead.customFields.revenue)
      );
    }
    
    if (filters.foundedYears.length > 0) {
      result = result.filter(lead => 
        lead.customFields.foundedYear && 
        filters.foundedYears.some(year => 
          lead.customFields.foundedYear && 
          lead.customFields.foundedYear >= year && 
          lead.customFields.foundedYear < year + 10
        )
      );
    }
    
    if (filters.technologies.length > 0) {
      result = result.filter(lead => 
        lead.customFields.technologies && 
        filters.technologies.some(tech => 
          lead.customFields.technologies?.includes(tech)
        )
      );
    }
    
    setFilteredLeads(result);
    setCurrentPage(1);
  }, [leads, searchQuery, filters]);

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  const handleLeadSelect = (leadId: number) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId) 
        : [...prev, leadId]
    );
  };

  const toggleStar = (leadId: number) => {
    setLeads(prev => 
      prev.map(lead => 
        lead.id === leadId 
          ? { ...lead, isStarred: !lead.isStarred } 
          : lead
      )
    );
  };

  const toggleFilterValue = (filterName: keyof Filters, value: any) => {
    setFilters(prev => {
      const currentValues = prev[filterName] as any[];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [filterName]: currentValues.filter(v => v !== value)
        };
      } else {
        return {
          ...prev,
          [filterName]: [...currentValues, value]
        };
      }
    });
  };

  const updateFilter = (filterName: keyof Filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const removeFilter = (filterType: keyof Filters, value?: any) => {
    if (value !== undefined) {
      setFilters(prev => ({
        ...prev,
        [filterType]: (prev[filterType] as any[]).filter(v => v !== value)
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: Array.isArray(prev[filterType]) ? [] : false
      }));
    }
  };

  // Get unique values for filters
  const uniqueStatuses = [...new Set(leads.map(lead => lead.status))];
  const uniqueIndustries = [...new Set(leads.map(lead => lead.industry))];
  const uniqueLocations = [...new Set(leads.map(lead => lead.location))];
  const allTags = [...new Set(leads.flatMap(lead => lead.tags))];
  const allBudgets = ['$10k-$50k', '$50k-$100k', '$100k+'];
  const allEmployees = ['1-10', '11-50', '51-200', '201-1000', '1000+'];
  const allRevenues = ['<$1M', '$1M-$10M', '$10M-$50M', '$50M-$100M', '$100M+'];
  const allTechnologies = ['React', 'Node.js', 'Python', 'Java', 'AWS', 'Azure', 'Google Cloud'];
  const foundedDecades = [1980, 1990, 2000, 2010, 2020];

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <FilterSidebar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          uniqueStatuses={uniqueStatuses}
          uniqueIndustries={uniqueIndustries}
          uniqueLocations={uniqueLocations}
          allBudgets={allBudgets}
          allEmployees={allEmployees}
          allRevenues={allRevenues}
          allTechnologies={allTechnologies}
          foundedDecades={foundedDecades}
          toggleFilterValue={toggleFilterValue}
          updateFilter={updateFilter}
        />

        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="mr-4 md:hidden text-gray-500 hover:text-gray-700"
                >
                  <FiFilter size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Lead Database</h1>
              </div>
              <ActionButtons />
            </div>

            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            <FilterChips
              filters={filters}
              removeFilter={removeFilter}
              clearAllFilters={() => setFilters({
                status: [],
                industry: [],
                location: [],
                tags: [],
                starred: false,
                lastContacted: '',
                budget: [],
                employees: [],
                revenue: [],
                foundedYears: [],
                technologies: [],
              })}
            />

            <LeadTable
              leads={filteredLeads}
              selectedLeads={selectedLeads}
              handleLeadSelect={handleLeadSelect}
              handleSelectAll={handleSelectAll}
              toggleStar={toggleStar}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              searchQuery={searchQuery}
              filters={filters}
            />

            {filteredLeads.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredLeads.length / itemsPerPage)}
                totalItems={filteredLeads.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDatabase;