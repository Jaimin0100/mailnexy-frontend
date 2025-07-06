export type ShowColumnsType = {
    firstName: boolean;
    lastName: boolean;
    industry: boolean;
    companyIndustry: boolean;
    country: boolean;
    companyCountry: boolean;
    location: boolean;
    lists: boolean;
    tags: boolean;
    dateAdded: boolean;
    deals: boolean;
    verified: boolean;
  };
  
  export type Lead = {
    id: string;
    name: string;
    email: string;
    company: string;
    position: string;
    location: string;
    tags: string;
    status: string;
    firstName: string;
    lastName: string;
    industry: string;
    companyIndustry: string;
    country: string;
    companyCountry: string;
    lists: string;
    dateAdded: string;
    deals: string;
    verified: boolean;
    phone?: string;
    website?: string;
  };