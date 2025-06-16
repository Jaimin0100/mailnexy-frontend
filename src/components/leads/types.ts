export interface Lead {
  id: number;
  name: string;
  email: string;
  company: string;
  title: string;
  location: string;
  industry: string;
  website: string;
  phone: string;
  lastContacted: string;
  status: 'new' | 'contacted' | 'interested' | 'converted' | 'unresponsive';
  isStarred: boolean;
  tags: string[];
  customFields: {
    linkedIn?: string;
    budget?: string;
    employees?: string;
    revenue?: string;
    foundedYear?: number;
    technologies?: string[];
  };
}

export interface Filters {
  status: string[];
  industry: string[];
  location: string[];
  tags: string[];
  starred: boolean;
  lastContacted: string;
  budget: string[];
  employees: string[];
  revenue: string[];
  foundedYears: number[];
  technologies: string[];
}