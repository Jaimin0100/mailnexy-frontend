"use client";

import { useState, useEffect } from "react";
import LeadsPage from "@/components/lead-campaign/LeadsPage";
import LeadsTable from "@/components/lead-campaign/LeadsTable";
import CustomizeColumnsPopup from "@/components/lead-campaign/CustomizeColumnsPopup";
import ImportLeadsPopup from "@/components/lead-campaign/ImportLeadsPopup";
import CreateLeadPopup from "@/components/lead-campaign/CreateLeadPopup";
import EditLeadPopup from "@/components/lead-campaign/EditLeadPopup";
import VerifyEmailsPopup from "@/components/lead-campaign/VerifyEmailsPopup";
import Pagination from "@/components/lead-campaign/Pagination";
import { useParams } from 'next/navigation';
import { BACKEND_URL } from "@/lib/constants";
import { Lead, ShowColumnsType } from "@/components/lead-campaign/lead";

export default function LeadsPageContainer() {
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isImportPopupOpen, setIsImportPopupOpen] = useState(false);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isVerifyPopupOpen, setIsVerifyPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [leadsPerPage] = useState(10);
  const [newLead, setNewLead] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    position: "",
    location: "",
    tags: "",
    listIds: [] as number[],
  });
  const [editLead, setEditLead] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    position: "",
    location: "",
    tags: "",
  });
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  
  const [showColumns, setShowColumns] = useState<ShowColumnsType>({
    firstName: true,
    lastName: false,
    industry: true,
    companyIndustry: false,
    country: true,
    companyCountry: false,
    location: true,
    lists: false,
    tags: true,
    dateAdded: false,
    deals: true,
    verified: true,
  });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leadLists, setLeadLists] = useState<{ id: number; name: string }[]>([]);
  const params = useParams();
  const currentListId = params?.fileId ? parseInt(params.fileId as string) : null;

  // Fetch lead lists
  useEffect(() => {
    const fetchLeadLists = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");
        const response = await fetch(`${BACKEND_URL}/api/v1/lead-lists`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch lead lists");
        const data = await response.json();
        setLeadLists(data.data);
      } catch (err: any) {
        console.error("Fetch lead lists error:", err);
      }
    };
    fetchLeadLists();
  }, []);

  // Fetch leads
  const fetchLeads = async () => {
    setIsLoading(true);
    setError(null);
    
    
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

    // FIX: Use currentListId instead of listId
    const url = currentListId 
      ? `${BACKEND_URL}/api/v1/leads?list_id=${currentListId}`
      : `${BACKEND_URL}/api/v1/leads`;
    
    // FIX: Use the URL we constructed above
    const response = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` }
    });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch leads: ${response.statusText}`);
      }
      
      const data = await response.json();
      setLeads(data.data.map((lead: any) => ({
        id: lead.ID?.toString() ?? 'unknown-id',
        name: `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unnamed',
        email: lead.email || '',
        company: lead.company || '',
        position: lead.custom_fields?.position || '',
        location: lead.custom_fields?.location || '',
        tags: lead.custom_fields?.tags || '',
        status: "new",
        firstName: lead.first_name || '',
        lastName: lead.last_name || '',
        industry: lead.custom_fields?.industry || '',
        companyIndustry: lead.custom_fields?.companyIndustry || '',
        country: lead.custom_fields?.country || '',
        companyCountry: lead.custom_fields?.companyCountry || '',
        lists: "Manual Import",
        dateAdded: lead.CreatedAt 
          ? new Date(lead.CreatedAt).toISOString() 
          : new Date().toISOString(),
        deals: "0",
        verified: lead.is_verified || false
      })));
    } catch (err: any) {
      setError(err.message || "Error fetching leads");
      console.error("Fetch leads error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [currentListId]);

  // Delete lead handler
  const deleteLead = async (id: string) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");
      
      const response = await fetch(`${BACKEND_URL}/api/v1/leads/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete lead: ${response.statusText}`);
      }
      
      setLeads(leads.filter(lead => lead.id !== id));
      const newSelected = new Set(selectedLeads);
      newSelected.delete(id);
      setSelectedLeads(newSelected);
    } catch (err: any) {
      console.error("Delete lead error:", err);
      alert(`Failed to delete lead: ${err.message}`);
    }
  };

  // Create lead handler
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();

    // DEBUG: Log raw form data before processing
    console.log("Raw form data (newLead state):", JSON.parse(JSON.stringify(newLead)));


    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      // Add validation for listIds
      if (newLead.listIds.length === 0) {
        throw new Error("Please select at least one lead list");
      }
      
      const customFields: Record<string, string> = {};
      if (newLead.position) customFields.position = newLead.position;
      if (newLead.location) customFields.location = newLead.location;
      if (newLead.tags) customFields.tags = newLead.tags;

      // Convert listIds to strings to avoid uint overflow
      // const safeListIds = newLead.listIds.map(id => id.toString());

          // DEBUG: Log processed custom fields
    console.log("Processed custom fields:", customFields);

    // Construct final payload
    const payload = {
      email: newLead.email,
      first_name: newLead.firstName,
      last_name: newLead.lastName,
      company: newLead.company,
      custom_fields: customFields,
      list_ids: newLead.listIds 
    };

    // DEBUG: Log final payload being sent to backend
    console.log("Sending to backend:", payload);
      
      const response = await fetch(`${BACKEND_URL}/api/v1/leads`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: newLead.email,
          first_name: newLead.firstName,
          last_name: newLead.lastName,
          company: newLead.company,
          custom_fields: customFields,
          list_ids: newLead.listIds
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create lead");
      }
      
      const createdLead = await response.json();
      const newLeadEntry: Lead = {
        id: createdLead.data.ID.toString(),
        name: `${newLead.firstName} ${newLead.lastName}`,
        email: newLead.email,
        company: newLead.company,
        position: newLead.position,
        location: newLead.location,
        tags: newLead.tags,
        status: "new",
        firstName: newLead.firstName,
        lastName: newLead.lastName,
        industry: "N/A",
        companyIndustry: "N/A",
        country: "USA",
        companyCountry: "USA",
        lists: "Manual Import",
        dateAdded: new Date().toISOString().split('T')[0],
        deals: "0",
        verified: false
      };
      
      setLeads([newLeadEntry, ...leads]);
      setIsCreatePopupOpen(false);
      setNewLead({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        position: "",
        location: "",
        tags: "",
        listIds: []
      });
    } catch (err: any) {
      console.error("Create lead error:", err);
      alert(`Failed to create lead: ${err.message}`);
    }
  };

  // Update lead handler
  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");
      
      const customFields = {
        position: editLead.position,
        location: editLead.location,
        tags: editLead.tags,
      };
      
      const response = await fetch(`${BACKEND_URL}/api/v1/leads/${currentLead?.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          first_name: editLead.firstName,
          last_name: editLead.lastName,
          email: editLead.email,
          company: editLead.company,
          custom_fields: customFields
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update lead");
      }
      
      setLeads(leads.map(l => l.id === currentLead?.id ? {
        ...l,
        firstName: editLead.firstName,
        lastName: editLead.lastName,
        email: editLead.email,
        company: editLead.company,
        position: editLead.position,
        location: editLead.location,
        tags: editLead.tags,
        name: `${editLead.firstName} ${editLead.lastName}`.trim()
      } : l));
      
      setIsEditPopupOpen(false);
      setCurrentLead(null);
      setEditLead({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        position: "",
        location: "",
        tags: "",
      });
    } catch (err: any) {
      console.error("Update lead error:", err);
      alert(`Failed to update lead: ${err.message}`);
    }
  };

  // File upload handler
  const handleFileUpload = async () => {
    if (!selectedFile) return;
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");
      
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      const response = await fetch(`${BACKEND_URL}/api/v1/leads/import`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to import leads");
      }
      
      const result = await response.json();
      setIsImportPopupOpen(false);
      setSelectedFile(null);
      fetchLeads();
      alert(`File uploaded successfully! ${result.imported} new leads imported.`);
    } catch (err: any) {
      console.error("Import leads error:", err);
      alert(`Failed to import leads: ${err.message}`);
    }
  };

  // Verify emails handler
  const verifySelectedLeads = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");
      
      const emails = Array.from(selectedLeads)
        .map(id => leads.find(lead => lead.id === id)?.email)
        .filter(Boolean) as string[];
      
      const response = await fetch(`${BACKEND_URL}/api/v1/verify/bulk`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ emails })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to verify emails");
      }
      
      setLeads(leads.map(lead => 
        selectedLeads.has(lead.id) ? { ...lead, verified: true } : lead
      ));
      setSelectedLeads(new Set());
      setIsVerifyPopupOpen(false);
      alert("Emails verified successfully!");
    } catch (err: any) {
      console.error("Verify emails error:", err);
      alert(`Failed to verify emails: ${err.message}`);
    }
  };

  // Filter and paginate leads
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.position || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.tags || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && currentLeads.length > 0) {
      const allIds = currentLeads.map(lead => lead.id);
      setSelectedLeads(new Set(allIds));
    } else {
      setSelectedLeads(new Set());
    }
  };

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedLeads(newSelected);
  };

  // Column visibility handler
  const toggleColumn = (column: keyof ShowColumnsType) => {
    setShowColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  // File drop handlers
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const validExtensions = ['.xls', '.xlsx', '.csv', '.txt'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (validExtensions.includes(fileExtension || '')) {
        setSelectedFile(file);
      } else {
        alert('Please upload only Excel (.xls, .xlsx), CSV (.csv), or Text (.txt) files');
      }
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <LeadsPage
      isLoading={isLoading}
      error={error}
      fetchLeads={fetchLeads}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      isVerifyPopupOpen={isVerifyPopupOpen} 
      setIsVerifyPopupOpen={setIsVerifyPopupOpen}
      isAddLeadOpen={isAddLeadOpen}
      setIsAddLeadOpen={setIsAddLeadOpen}
      handleAddLeadOption={(option) => {
        setIsAddLeadOpen(false);
        if (option === 'import') setIsImportPopupOpen(true);
        else if (option === 'create') setIsCreatePopupOpen(true);
      }}
    >
      <LeadsTable
        leads={currentLeads}
        showColumns={showColumns}
        selectedLeads={selectedLeads}
        handleSelect={handleSelect}
        handleSelectAll={handleSelectAll}
        handleCustomizeClick={() => setIsPopupOpen(true)}
        setCurrentLead={setCurrentLead}
        setEditLead={setEditLead}
        setIsEditPopupOpen={setIsEditPopupOpen}
        deleteLead={deleteLead}
        filteredLeads={filteredLeads}
        setIsAddLeadOpen={setIsAddLeadOpen}
        handleAddLeadOption={(option) => {
          if (option === 'import') setIsImportPopupOpen(true);
        }}
      />
      
      {currentLeads.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          indexOfFirstLead={indexOfFirstLead}
          indexOfLastLead={indexOfLastLead}
          filteredLeads={filteredLeads}
          paginate={paginate}
        />
      )}

      {isPopupOpen && (
        <CustomizeColumnsPopup
          showColumns={showColumns}
          toggleColumn={toggleColumn}
          setIsPopupOpen={setIsPopupOpen}
        />
      )}

      {isImportPopupOpen && (
        <ImportLeadsPopup
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          handleFileUpload={handleFileUpload}
          setIsImportPopupOpen={setIsImportPopupOpen}
          handleFileDrop={handleFileDrop}
        />
      )}

      {isCreatePopupOpen && (
        <CreateLeadPopup
          newLead={newLead}
          setNewLead={setNewLead}
          leadLists={leadLists}
          handleCreateLead={handleCreateLead}
          setIsCreatePopupOpen={setIsCreatePopupOpen}
          currentListId={currentListId} // Pass the current list ID
        />
      )}

      {isEditPopupOpen && currentLead && (
        <EditLeadPopup
          editLead={editLead}
          setEditLead={setEditLead}
          handleUpdateLead={handleUpdateLead}
          setIsEditPopupOpen={setIsEditPopupOpen}
        />
      )}

      {isVerifyPopupOpen && (
        <VerifyEmailsPopup
          selectedLeads={selectedLeads}
          verifySelectedLeads={verifySelectedLeads}
          setIsVerifyPopupOpen={setIsVerifyPopupOpen}
        />
      )}
    </LeadsPage>
  );
}











// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   FiUser, FiCreditCard, FiPackage, FiBriefcase, FiGlobe, FiHome, FiMapPin, FiList, FiTag, 
//   FiCalendar, FiDollarSign, FiSearch, FiUpload, FiEdit, FiChevronDown, FiX, FiFile, 
//   FiTrash2, FiPlus, FiCheck, FiMail, FiChevronLeft, FiFilter, FiChevronRight, FiChevronsLeft,
//   FiChevronsRight, FiCheckCircle, FiXCircle, FiClock
// } from 'react-icons/fi';

// const BACKEND_URL = "http://localhost:5000";

// type Lead = {
//   id: string;
//   name: string;
//   email: string;
//   company: string;
//   position: string;
//   location: string;
//   tags: string;
//   status: string;
//   firstName: string;
//   lastName: string;
//   industry: string;
//   companyIndustry: string;
//   country: string;
//   companyCountry: string;
//   lists: string;
//   dateAdded: string;
//   deals: string;
//   verified: boolean;
//   phone?: string;
//   website?: string;
// };

// type ShowColumnsType = {
//   firstName: boolean;
//   lastName: boolean;
//   industry: boolean;
//   companyIndustry: boolean;
//   country: boolean;
//   companyCountry: boolean;
//   location: boolean;
//   lists: boolean;
//   tags: boolean;
//   dateAdded: boolean;
//   deals: boolean;
//   verified: boolean;
// };

// export default function LeadsPage() {
//   const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
//   const [isImportPopupOpen, setIsImportPopupOpen] = useState(false);
//   const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
//   const [isVerifyPopupOpen, setIsVerifyPopupOpen] = useState(false);
//   const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [leadsPerPage] = useState(10);
//   const [newLead, setNewLead] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     company: "",
//     position: "",
//     location: "",
//     tags: "",
//     listIds: [] as number[] // Array to hold lead list IDs
//   });
//   const [editLead, setEditLead] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     company: "",
//     position: "",
//     location: "",
//     tags: "",
//   });
//   const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  
//   const [showColumns, setShowColumns] = useState<ShowColumnsType>({
//     firstName: true,
//     lastName: false,
//     industry: true,
//     companyIndustry: false,
//     country: true,
//     companyCountry: false,
//     location: true,
//     lists: false,
//     tags: true,
//     dateAdded: false,
//     deals: true,
//     verified: true,
//   });

//   const [leads, setLeads] = useState<Lead[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [leadLists, setLeadLists] = useState<{ id: number; name: string }[]>([]);
//   useEffect(() => {
//     const fetchLeadLists = async () => {
//         try {
//             const token = localStorage.getItem("access_token");
//             if (!token) throw new Error("No access token found");
//             const response = await fetch(`${BACKEND_URL}/api/v1/lead-lists`, {
//                 headers: {
//                     "Authorization": `Bearer ${token}`
//                 }
//             });
//             if (!response.ok) throw new Error("Failed to fetch lead lists");
//             const data = await response.json();
//             setLeadLists(data.data); // Assuming response is { data: [{ id, name }, ...] }
//         } catch (err: any) {
//             console.error("Fetch lead lists error:", err);
//         }
//     };
//     fetchLeadLists();
// }, []);

//   const fetchLeads = async () => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) throw new Error("No access token found");
  
//       const response = await fetch(`${BACKEND_URL}/api/v1/leads`, {
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch leads: ${response.statusText}`);
//       }
      
//       const data = await response.json();
//       setLeads(data.data.map((lead: any) => ({
//         id: lead.ID?.toString() ?? 'unknown-id',
//         name: `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unnamed',
//         email: lead.email || '',
//         company: lead.company || '',
//         position: lead.custom_fields?.position || '',
//         location: lead.custom_fields?.location || '',
//         tags: lead.custom_fields?.tags || '',
//         status: "new",
//         firstName: lead.first_name || '',
//         lastName: lead.last_name || '',
//         industry: lead.custom_fields?.industry || '',
//         companyIndustry: lead.custom_fields?.companyIndustry || '',
//         country: lead.custom_fields?.country || '',
//         companyCountry: lead.custom_fields?.companyCountry || '',
//         lists: "Manual Import",
//         // dateAdded: new Date(lead.CreatedAt).toISOString().deals: "0",
//         dateAdded: lead.CreatedAt 
//         ? new Date(lead.CreatedAt).toISOString() 
//         : new Date().toISOString(),
//         deals: "0",
//         verified: lead.is_verified || false
//       })));
//     } catch (err: any) {
//       setError(err.message || "Error fetching leads");
//       console.error("Fetch leads error:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLeads();
//   }, []);

//   const deleteLead = async (id: string) => {
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) throw new Error("No access token found");
      
//       const response = await fetch(`${BACKEND_URL}/api/v1/leads/${id}`, {
//         method: "DELETE",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error(`Failed to delete lead: ${response.statusText}`);
//       }
      
//       setLeads(leads.filter(lead => lead.id !== id));
//       const newSelected = new Set(selectedLeads);
//       newSelected.delete(id);
//       setSelectedLeads(newSelected);
//     } catch (err: any) {
//       console.error("Delete lead error:", err);
//       alert(`Failed to delete lead: ${err.message}`);
//     }
//   };

//   const handleCreateLead = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) throw new Error("No access token found");
      
//       const customFields: Record<string, string> = {};
//       if (newLead.position) customFields.position = newLead.position;
//       if (newLead.location) customFields.location = newLead.location;
//       if (newLead.tags) customFields.tags = newLead.tags;
      
//       const response = await fetch(`${BACKEND_URL}/api/v1/leads`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           email: newLead.email,
//           first_name: newLead.firstName,
//           last_name: newLead.lastName,
//           company: newLead.company,
//           custom_fields: customFields,
//           list_ids: newLead.listIds // Add list_ids to the request
//         })
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to create lead");
//       }
      
//       const createdLead = await response.json();
//       const newLeadEntry: Lead = {
//         id: createdLead.data.id.toString(),
//         name: `${newLead.firstName} ${newLead.lastName}`,
//         email: newLead.email,
//         company: newLead.company,
//         position: newLead.position,
//         location: newLead.location,
//         tags: newLead.tags,
//         status: "new",
//         firstName: newLead.firstName,
//         lastName: newLead.lastName,
//         industry: "N/A",
//         companyIndustry: "N/A",
//         country: "USA",
//         companyCountry: "USA",
//         lists: "Manual Import",
//         dateAdded: new Date().toISOString().split('T')[0],
//         deals: "0",
//         verified: false
//       };
      
//       setLeads([newLeadEntry, ...leads]);
//       setIsCreatePopupOpen(false);
//       setNewLead({
//         firstName: "",
//         lastName: "",
//         email: "",
//         company: "",
//         position: "",
//         location: "",
//         tags: "",
//         listIds: []
//       });
//     } catch (err: any) {
//       console.error("Create lead error:", err);
//       alert(`Failed to create lead: ${err.message}`);
//     }
//   };

//   const handleUpdateLead = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) throw new Error("No access token found");
      
//       const customFields = {
//         position: editLead.position,
//         location: editLead.location,
//         tags: editLead.tags,
//       };
      
//       const response = await fetch(`${BACKEND_URL}/api/v1/leads/${currentLead?.id}`, {
//         method: "PUT",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           first_name: editLead.firstName,
//           last_name: editLead.lastName,
//           email: editLead.email,
//           company: editLead.company,
//           custom_fields: customFields
//         })
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to update lead");
//       }
      
//       setLeads(leads.map(l => l.id === currentLead?.id ? {
//         ...l,
//         firstName: editLead.firstName,
//         lastName: editLead.lastName,
//         email: editLead.email,
//         company: editLead.company,
//         position: editLead.position,
//         location: editLead.location,
//         tags: editLead.tags,
//         name: `${editLead.firstName} ${editLead.lastName}`.trim()
//       } : l));
      
//       setIsEditPopupOpen(false);
//       setCurrentLead(null);
//       setEditLead({
//         firstName: "",
//         lastName: "",
//         email: "",
//         company: "",
//         position: "",
//         location: "",
//         tags: "",
//       });
//     } catch (err: any) {
//       console.error("Update lead error:", err);
//       alert(`Failed to update lead: ${err.message}`);
//     }
//   };

//   const handleFileUpload = async () => {
//     if (!selectedFile) return;
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) throw new Error("No access token found");
      
//       const formData = new FormData();
//       formData.append("file", selectedFile);
      
//       const response = await fetch(`${BACKEND_URL}/api/v1/leads/import`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         },
//         body: formData
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to import leads");
//       }
      
//       const result = await response.json();
//       setIsImportPopupOpen(false);
//       setSelectedFile(null);
//       fetchLeads();
//       alert(`File uploaded successfully! ${result.imported} new leads imported.`);
//     } catch (err: any) {
//       console.error("Import leads error:", err);
//       alert(`Failed to import leads: ${err.message}`);
//     }
//   };

//   const verifySelectedLeads = async () => {
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) throw new Error("No access token found");
      
//       const emails = Array.from(selectedLeads)
//         .map(id => leads.find(lead => lead.id === id)?.email)
//         .filter(Boolean);
      
//       const response = await fetch(`${BACKEND_URL}/api/v1/verify/bulk`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ emails })
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to verify emails");
//       }
      
//       setLeads(leads.map(lead => 
//         selectedLeads.has(lead.id) ? { ...lead, verified: true } : lead
//       ));
//       setSelectedLeads(new Set());
//       setIsVerifyPopupOpen(false);
//       alert("Emails verified successfully!");
//     } catch (err: any) {
//       console.error("Verify emails error:", err);
//       alert(`Failed to verify emails: ${err.message}`);
//     }
//   };

//   const filteredLeads = leads.filter(lead => 
//     lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     lead.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     lead.tags.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const indexOfLastLead = currentPage * leadsPerPage;
//   const indexOfFirstLead = indexOfLastLead - leadsPerPage;
//   const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
//   const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

//   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked && currentLeads.length > 0) {
//       const allIds = currentLeads.map(lead => lead.id);
//       setSelectedLeads(new Set(allIds));
//     } else {
//       setSelectedLeads(new Set());
//     }
//   };

//   const handleSelect = (id: string) => {
//     const newSelected = new Set(selectedLeads);
//     if (newSelected.has(id)) {
//       newSelected.delete(id);
//     } else {
//       newSelected.add(id);
//     }
//     setSelectedLeads(newSelected);
//   };

//   const handleStatusChange = (id: string, value: string) => {
//     setLeads(leads.map(lead => 
//       lead.id === id ? { ...lead, status: value } : lead
//     ));
//   };

//   const toggleColumn = (column: keyof ShowColumnsType) => {
//     setShowColumns(prev => ({ ...prev, [column]: !prev[column] }));
//   };

//   const handleCustomizeClick = () => {
//     setIsPopupOpen(true);
//   };

//   const toggleAddLeadDropdown = () => {
//     setIsAddLeadOpen(!isAddLeadOpen);
//   };

//   const handleAddLeadOption = (option: string) => {
//     setIsAddLeadOpen(false);
//     if (option === 'import') {
//       setIsImportPopupOpen(true);
//     } else if (option === 'create') {
//       setIsCreatePopupOpen(true);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       const validExtensions = ['.xls', '.xlsx', '.csv', '.txt'];
//       const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

//       if (validExtensions.includes(fileExtension)) {
//         setSelectedFile(file);
//       } else {
//         alert('Please upload only Excel (.xls, .xlsx), CSV (.csv), or Text (.txt) files');
//         e.target.value = '';
//       }
//     }
//   };

//   const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       const file = e.dataTransfer.files[0];
//       const validExtensions = ['.xls', '.xlsx', '.csv', '.txt'];
//       const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

//       if (validExtensions.includes(fileExtension)) {
//         setSelectedFile(file);
//       } else {
//         alert('Please upload only Excel (.xls, .xlsx), CSV (.csv), or Text (.txt) files');
//       }
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm]);

//   if (isLoading) {
//     return (
//       <div className="p-6 h-full flex flex-col bg-[#F5F7FA] items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5570F1]"></div>
//         <p className="mt-4 text-[#53545C]">Loading leads...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 h-full flex flex-col bg-[#F5F7FA] items-center justify-center">
//         <FiXCircle className="text-red-500 text-4xl mb-4" />
//         <p className="text-[#53545C] text-center mb-4">{error}</p>
//         <button 
//           className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700"
//           onClick={fetchLeads}
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 h-full flex flex-col bg-[#F5F7FA]">
//       <div className="flex-1">
//         <div className="flex justify-between items-center mb-4">
//           <div>
//             <h1 className="text-2xl font-bold text-[#53545C] flex items-center">
//               <FiFile className="text-[#5570F1] mr-3" />
//               Sales Leads
//               <span className="ml-2 text-gray-500 text-sm font-normal">({leads.length} leads)</span>
//             </h1>
//           </div>
//           <div className="flex space-x-4">
//             <button 
//               className="px-4 py-2 bg-white text-[#53545C] border border-gray-200 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100"
//               onClick={() => setIsVerifyPopupOpen(true)}
//             >
//               <FiCheckCircle className="text-green-500" />
//               Verify Emails
//             </button>
//             <div className="relative">
//               <button
//                 className="px-4 py-2 bg-[#5570F1] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
//                 onClick={toggleAddLeadDropdown}
//               >
//                 <FiPlus />
//                 Add Leads
//                 <FiChevronDown className={`transition-transform ${isAddLeadOpen ? 'rotate-180' : ''}`} />
//               </button>
//               {isAddLeadOpen && (
//                 <div className="absolute z-20 mt-2 right-0 w-56 bg-white rounded-md shadow-lg border border-gray-200">
//                   <div className="py-1">
//                     <button
//                       className="flex items-center px-4 py-2 text-sm text-[#53545C] hover:bg-gray-100 w-full text-left"
//                       onClick={() => handleAddLeadOption('search')}
//                     >
//                       <FiSearch className="mr-2 text-[#5570F1]" />
//                       Search Database
//                     </button>
//                     <button
//                       className="flex items-center px-4 py-2 text-sm text-[#53545C] hover:bg-gray-100 w-full text-left"
//                       onClick={() => handleAddLeadOption('import')}
//                     >
//                       <FiUpload className="mr-2 text-[#5570F1]" />
//                       Import File
//                     </button>
//                     <button
//                       className="flex items-center px-4 py-2 text-sm text-[#53545C] hover:bg-gray-100 w-full text-left"
//                       onClick={() => handleAddLeadOption('create')}
//                     >
//                       <FiEdit className="mr-2 text-[#5570F1]" />
//                       Create Manually
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
        
//         <div className="flex justify-between mb-4">
//           <div className="relative w-1/3">
//             <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search leads by name, email, company, tags..."
//               className="pl-10 pr-4 py-2 w-full rounded-lg border text-gray-500 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5570F1] focus:border-transparent"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <div className="flex space-x-2">
//             <button className="px-3 py-2 bg-white text-[#53545C] border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-100">
//               <FiFilter />
//               Filters
//             </button>
//           </div>
//         </div>
        
//         <div className="bg-white pt-2 rounded-lg border border-gray-200 overflow-hidden">
//           <table className="w-full">
//             <thead className="border-b border-gray-200 font-medium">
//               <tr>
//                 <th className="text-left p-4 text-[#53545C] w-12">
//                   <input
//                     type="checkbox"
//                     className="h-4 w-4 rounded border-gray-300"
//                     onChange={handleSelectAll}
//                     checked={selectedLeads.size === currentLeads.length && currentLeads.length > 0}
//                   />
//                 </th>
//                 <th className="text-left p-4 text-[#53545C]">Lead</th>
//                 <th className="text-left p-4 text-[#53545C]">Email</th>
//                 {showColumns.firstName && <th className="text-left p-4 text-[#53545C]">First Name</th>}
//                 {showColumns.lastName && <th className="text-left p-4 text-[#53545C]">Last Name</th>}
//                 {showColumns.industry && <th className="text-left p-4 text-[#53545C]">Industry</th>}
//                 {showColumns.companyIndustry && <th className="text-left p-4 text-[#53545C]">Company Industry</th>}
//                 {showColumns.country && <th className="text-left p-4 text-[#53545C]">Country</th>}
//                 {showColumns.companyCountry && <th className="text-left p-4 text-[#53545C]">Company Country</th>}
//                 {showColumns.location && <th className="text-left p-4 text-[#53545C]">Location</th>}
//                 {showColumns.lists && <th className="text-left p-4 text-[#53545C]">Lists</th>}
//                 {showColumns.tags && <th className="text-left p-4 text-[#53545C]">Tags</th>}
//                 {showColumns.dateAdded && <th className="text-left p-4 text-[#53545C]">Date Added</th>}
//                 {showColumns.deals && <th className="text-left p-4 text-[#53545C]">Deals</th>}
//                 {showColumns.verified && <th className="text-left p-4 text-[#53545C]">Verified</th>}
//                 <th className="text-left p-4 text-[#53545C] w-12">
//                   <div className="cursor-pointer" onClick={handleCustomizeClick}>
//                     <Image 
//                       width={20} 
//                       height={20} 
//                       src="/customize.svg" 
//                       alt="Customize Columns" 
//                       className="mx-auto" 
//                     />
//                   </div>
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentLeads.length > 0 ? (
//                 currentLeads.map(lead => (
//                   <tr key={lead.id} className="border-b border-gray-200 hover:bg-gray-50">
//                     <td className="p-4">
//                       <input
//                         type="checkbox"
//                         className="h-4 w-4 rounded border-gray-300"
//                         checked={selectedLeads.has(lead.id)}
//                         onChange={() => handleSelect(lead.id)}
//                       />
//                     </td>
//                     <td className="p-4">
//                       <Link href={`/campaign/leads/${lead.id}`} className="flex items-center">
//                         <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 mr-3" />
//                         <div>
//                           <div className="font-medium text-[#53545C]">{lead.name}</div>
//                           <div className="text-sm text-gray-500">{lead.company}</div>
//                         </div>
//                       </Link>
//                     </td>
//                     <td className="p-4 text-[#53545C]">
//                       <div className="flex items-center">
//                         <FiMail className="mr-2 text-gray-500" />
//                         {lead.email}
//                       </div>
//                     </td>
//                     {showColumns.firstName && <td className="p-4 text-[#53545C]">{lead.firstName}</td>}
//                     {showColumns.lastName && <td className="p-4 text-[#53545C]">{lead.lastName}</td>}
//                     {showColumns.industry && <td className="p-4 text-[#53545C]">{lead.industry}</td>}
//                     {showColumns.companyIndustry && <td className="p-4 text-[#53545C]">{lead.companyIndustry}</td>}
//                     {showColumns.country && <td className="p-4 text-[#53545C]">{lead.country}</td>}
//                     {showColumns.companyCountry && <td className="p-4 text-[#53545C]">{lead.companyCountry}</td>}
//                     {showColumns.location && <td className="p-4 text-[#53545C]">
//                       <div className="flex items-center">
//                         <FiMapPin className="mr-2 text-gray-500" />
//                         {lead.location}
//                       </div>
//                     </td>}
//                     {showColumns.lists && <td className="p-4 text-[#53545C]">{lead.lists}</td>}
//                     {showColumns.tags && <td className="p-4 text-[#53545C]">
//                       <div className="flex items-center">
//                         <FiTag className="mr-2 text-gray-500" />
//                         {lead.tags}
//                       </div>
//                     </td>}
//                     {showColumns.dateAdded && <td className="p-4 text-[#53545C]">{lead.dateAdded}</td>}
//                     {showColumns.deals && <td className="p-4 text-[#53545C]">
//                       <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
//                         {lead.deals} deals
//                       </span>
//                     </td>}
//                     {showColumns.verified && <td className="p-4 text-[#53545C]">
//                       {lead.verified ? 
//                         <span className="text-green-600 flex items-center"><FiCheckCircle className="mr-1" /> Verified</span> : 
//                         <span className="text-red-500 flex items-center"><FiClock className="mr-1" /> Pending</span>
//                       }
//                     </td>}
//                     <td className="p-4">
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setCurrentLead(lead);
//                             setEditLead({
//                               firstName: lead.firstName,
//                               lastName: lead.lastName,
//                               email: lead.email,
//                               company: lead.company,
//                               position: lead.position,
//                               location: lead.location,
//                               tags: lead.tags,
//                             });
//                             setIsEditPopupOpen(true);
//                           }}
//                           className="text-gray-400 hover:text-blue-500"
//                         >
//                           <FiEdit />
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             deleteLead(lead.id);
//                           }}
//                           className="text-gray-400 hover:text-red-500"
//                         >
//                           <FiTrash2 />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={15} className="p-12 text-center text-gray-500">
//                     <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
//                     <p className="font-medium">No leads found</p>
//                     <p className="mt-2">Try adjusting your search or import new leads</p>
//                     <div className="mt-4 space-x-4 flex justify-center">
//                       <button
//                         className="px-4 py-2 bg-[#5570F1] text-white rounded-lg gap-2 flex items-center hover:bg-blue-700"
//                         onClick={() => setIsAddLeadOpen(true)}
//                       >
//                         <FiPlus />
//                         Add Leads
//                       </button>
//                       <button
//                         className="px-4 py-2 bg-white text-[#53545C] border border-gray-200 rounded-lg gap-2 flex items-center hover:bg-gray-100"
//                         onClick={() => handleAddLeadOption('import')}
//                       >
//                         <FiUpload />
//                         Import File
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
          
//           {currentLeads.length > 0 && (
//             <div className="flex justify-between items-center p-4 border-t border-gray-200">
//               <div className="text-sm text-gray-700">
//                 Showing {indexOfFirstLead + 1} to {Math.min(indexOfLastLead, filteredLeads.length)} of {filteredLeads.length} leads
//               </div>
//               <div className="flex items-center space-x-2">
//                 <button 
//                   onClick={() => paginate(1)} 
//                   disabled={currentPage === 1}
//                   className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400' : 'hover:bg-gray-100'}`}
//                 >
//                   <FiChevronsLeft />
//                 </button>
//                 <button 
//                   onClick={() => paginate(currentPage - 1)} 
//                   disabled={currentPage === 1}
//                   className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400' : 'hover:bg-gray-100'}`}
//                 >
//                   <FiChevronLeft />
//                 </button>
//                 {[...Array(totalPages)].map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => paginate(i + 1)}
//                     className={`w-8 h-8 rounded-full text-sm ${currentPage === i + 1 ? 'bg-[#5570F1] text-white' : 'hover:bg-gray-100'}`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//                 <button 
//                   onClick={() => paginate(currentPage + 1)} 
//                   disabled={currentPage === totalPages}
//                   className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-400' : 'hover:bg-gray-100'}`}
//                 >
//                   <FiChevronRight />
//                 </button>
//                 <button 
//                   onClick={() => paginate(totalPages)} 
//                   disabled={currentPage === totalPages}
//                   className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-400' : 'hover:bg-gray-100'}`}
//                 >
//                   <FiChevronsRight />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {isPopupOpen && (
//         <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsPopupOpen(false)}>
//           <div
//             className="bg-white p-4 rounded-lg border border-gray-200 shadow-lg w-96 h-[560px] flex flex-col"
//             onClick={e => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4 border-b pb-2">
//               <h2 className="text-lg font-bold text-[#53545C]">Show Columns</h2>
//               <button
//                 onClick={() => setIsPopupOpen(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <FiX className="h-6 w-6" />
//               </button>
//             </div>
//             <div className="flex-1 overflow-y-auto">
//               {Object.entries({
//                 firstName: "User",
//                 lastName: "IdCard",
//                 industry: "Factory",
//                 companyIndustry: "Building",
//                 country: "Globe",
//                 companyCountry: "OfficeBuilding",
//                 location: "MapPin",
//                 lists: "ListUl",
//                 tags: "Tag",
//                 dateAdded: "Calendar",
//                 deals: "Handshake",
//                 verified: "CheckCircle"
//               }).map(([column, iconName]) => (
//                 <div
//                   key={column}
//                   className="flex items-center justify-between mb-2 border border-gray-200 hover:border-[#5570F1] p-3 rounded-lg hover:bg-gray-50"
//                 >
//                   <div className="flex items-center">
//                     {iconName === "User" && <FiUser className="mr-2 text-[#5570F1]" />}
//                     {iconName === "IdCard" && <FiCreditCard className="mr-2 text-[#5570F1]" />}
//                     {iconName === "Factory" && <FiPackage className="mr-2 text-[#5570F1]" />}
//                     {iconName === "Building" && <FiBriefcase className="mr-2 text-[#5570F1]" />}
//                     {iconName === "Globe" && <FiGlobe className="mr-2 text-[#5570F1]" />}
//                     {iconName === "OfficeBuilding" && <FiHome className="mr-2 text-[#5570F1]" />}
//                     {iconName === "MapPin" && <FiMapPin className="mr-2 text-[#5570F1]" />}
//                     {iconName === "ListUl" && <FiList className="mr-2 text-[#5570F1]" />}
//                     {iconName === "Tag" && <FiTag className="mr-2 text-[#5570F1]" />}
//                     {iconName === "Calendar" && <FiCalendar className="mr-2 text-[#5570F1]" />}
//                     {iconName === "Handshake" && <FiDollarSign className="mr-2 text-[#5570F1]" />}
//                     {iconName === "CheckCircle" && <FiCheckCircle className="mr-2 text-[#5570F1]" />}
//                     <span className="text-sm text-[#53545C]">
//                       {column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//                     </span>
//                   </div>
//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={showColumns[column as keyof typeof showColumns]}
//                       onChange={() => toggleColumn(column as keyof ShowColumnsType)}
//                       className="sr-only peer"
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5570F1]"></div>
//                   </label>
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-end space-x-2 mt-4 pt-2 border-t">
//               <button
//                 onClick={() => setIsPopupOpen(false)}
//                 className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => setIsPopupOpen(false)}
//                 className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700"
//               >
//                 Apply
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isImportPopupOpen && (
//         <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsImportPopupOpen(false)}>
//           <div
//             className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg w-full max-w-md"
//             onClick={e => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#53545C]">Import Leads</h2>
//               <button
//                 onClick={() => {
//                   setIsImportPopupOpen(false);
//                   setSelectedFile(null);
//                 }}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <FiX className="h-6 w-6" />
//               </button>
//             </div>
//             <div className="mb-6">
//               <p className="text-sm text-gray-600 mb-4">
//                 Upload an Excel (.xls, .xlsx), CSV (.csv), or Text (.txt) file containing your lead data.
//               </p>
//               <div
//                 className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
//                 onDrop={handleFileDrop}
//                 onDragOver={handleDragOver}
//               >
//                 {selectedFile ? (
//                   <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
//                     <div className="flex items-center">
//                       <FiFile className="text-[#5570F1] mr-3" />
//                       <span className="text-sm font-medium text-gray-700">{selectedFile.name}</span>
//                     </div>
//                     <button
//                       onClick={() => setSelectedFile(null)}
//                       className="text-gray-400 hover:text-gray-600"
//                     >
//                       <FiX />
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
//                     <label htmlFor="file-upload" className="cursor-pointer">
//                       <span className="text-[#5570F1] font-medium">Click to browse</span>
//                       <span className="text-gray-500 ml-1">or drag and drop</span>
//                     </label>
//                     <p className="text-xs text-gray-500 mt-2">
//                       Supported formats: XLS, XLSX, CSV, TXT
//                     </p>
//                     <input
//                       id="file-upload"
//                       name="file-upload"
//                       type="file"
//                       className="sr-only"
//                       onChange={handleFileChange}
//                       accept=".xls,.xlsx,.csv,.txt,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,text/plain"
//                     />
//                   </>
//                 )}
//               </div>
//             </div>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => {
//                   setIsImportPopupOpen(false);
//                   setSelectedFile(null);
//                 }}
//                 className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleFileUpload}
//                 disabled={!selectedFile}
//                 className={`px-4 py-2 text-white rounded-lg ${selectedFile ? 'bg-[#5570F1] hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
//               >
//                 Import File
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isCreatePopupOpen && (
//         <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsCreatePopupOpen(false)}>
//           <div
//             className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg w-full max-w-md"
//             onClick={e => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#53545C]">Create New Lead</h2>
//               <button
//                 onClick={() => setIsCreatePopupOpen(false)}
//                 className="text-red-500 hover:text-red-700"
//               >
//                 <FiX className="h-6 w-6" />
//               </button> 
//             </div>
//             <form onSubmit={handleCreateLead} className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                     value={newLead.firstName}
//                     onChange={(e) => setNewLead({...newLead, firstName: e.target.value})}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                     value={newLead.lastName}
//                     onChange={(e) => setNewLead({...newLead, lastName: e.target.value})}
//                     required
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input
//                   type="email"
//                   className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                   value={newLead.email}
//                   onChange={(e) => setNewLead({...newLead, email: e.target.value})}
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                   value={newLead.company}
//                   onChange={(e) => setNewLead({...newLead, company: e.target.value})}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                   value={newLead.position}
//                   onChange={(e) => setNewLead({...newLead, position: e.target.value})}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                   value={newLead.location}
//                   onChange={(e) => setNewLead({...newLead, location: e.target.value})}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                   value={newLead.tags}
//                   onChange={(e) => setNewLead({...newLead, tags: e.target.value})}
//                   placeholder="Comma separated tags"
//                 />
//               </div>
//               {/* New Lead Lists field */}
//               <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Lead Lists</label>
//                     <select
//                         multiple
//                         className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                         value={newLead.listIds.map(id => id.toString())}
//                         onChange={(e) => {
//                             const selectedIds = Array.from(e.target.selectedOptions, option => parseInt(option.value));
//                             setNewLead({...newLead, listIds: selectedIds});
//                         }}
//                     >
//                         {leadLists.map(list => (
//                             <option key={list.id} value={list.id.toString()}>{list.name}</option>
//                         ))}
//                     </select>
//                     <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple lists</p>
//                 </div>
//               <div className="flex justify-end space-x-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setIsCreatePopupOpen(false)}
//                   className="px-4 py-2 text-white bg-red-500 border border-gray-300 rounded-lg hover:bg-red-700"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Create Lead
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {isEditPopupOpen && currentLead && (
//         <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsEditPopupOpen(false)}>
//           <div
//             className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg w-full max-w-md"
//             onClick={e => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#53545C]">Edit Lead</h2>
//               <button
//                 onClick={() => setIsEditPopupOpen(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <FiX className="h-6 w-6" />
//               </button>
//             </div>
//             <form onSubmit={handleUpdateLead} className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                     value={editLead.firstName}
//                     onChange={(e) => setEditLead({...editLead, firstName: e.target.value})}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                     value={editLead.lastName}
//                     onChange={(e) => setEditLead({...editLead, lastName: e.target.value})}
//                     required
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input
//                   type="email"
//                   className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                   value={editLead.email}
//                   onChange={(e) => setEditLead({...editLead, email: e.target.value})}
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                   value={editLead.company}
//                   onChange={(e) => setEditLead({...editLead, company: e.target.value})}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                   value={editLead.position}
//                   onChange={(e) => setEditLead({...editLead, position: e.target.value})}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                   value={editLead.location}
//                   onChange={(e) => setEditLead({...editLead, location: e.target.value})}
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                   value={editLead.tags}
//                   onChange={(e) => setEditLead({...editLead, tags: e.target.value})}
//                   placeholder="Comma separated tags"
//                 />
//               </div>
//               <div className="flex justify-end space-x-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setIsEditPopupOpen(false)}
//                   className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Update Lead
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {isVerifyPopupOpen && (
//         <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsVerifyPopupOpen(false)}>
//           <div
//             className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg w-full max-w-md"
//             onClick={e => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#53545C]">Verify Email Addresses</h2>
//               <button
//                 onClick={() => setIsVerifyPopupOpen(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <FiX className="h-6 w-6" />
//               </button>
//             </div>
//             <div className="mb-6">
//               <p className="text-gray-600 mb-4">
//                 You are about to verify {selectedLeads.size} email addresses. 
//                 This process may take a few moments.
//               </p>
//               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                 <div className="flex items-start">
//                   <FiClock className="text-yellow-500 mr-2 mt-0.5" />
//                   <p className="text-yellow-700 text-sm">
//                     Email verification checks if an email address exists and can receive emails.
//                     This helps improve your email deliverability.
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setIsVerifyPopupOpen(false)}
//                 className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={verifySelectedLeads}
//                 disabled={selectedLeads.size === 0}
//                 className={`px-4 py-2 text-white rounded-lg ${selectedLeads.size > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
//               >
//                 Verify Emails
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }










// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import {
//   FiUser, FiCreditCard, FiPackage, FiBriefcase, FiGlobe, FiHome, FiMapPin, FiList, FiTag, 
//   FiCalendar, FiDollarSign, FiSearch, FiUpload, FiEdit, FiChevronDown, FiX, FiFile, 
//   FiTrash2, FiPlus, FiCheck, FiMail, FiChevronLeft, FiFilter, FiChevronRight, FiChevronsLeft,
//   FiChevronsRight, FiCheckCircle, FiXCircle, FiClock
// } from 'react-icons/fi';


// const BACKEND_URL = "http://localhost:5000";

// type Lead = {
//   id: string;
//   name: string;
//   email: string;
//   company: string;
//   position: string;
//   location: string;
//   tags: string;
//   status: string;
//   firstName: string;
//   lastName: string;
//   industry: string;
//   companyIndustry: string;
//   country: string;
//   companyCountry: string;
//   lists: string;
//   dateAdded: string;
//   deals: string;
//   verified: boolean;
//   phone?: string;
//   website?: string;
// };

// type ShowColumnsType = {
//   firstName: boolean;
//   lastName: boolean;
//   industry: boolean;
//   companyIndustry: boolean;
//   country: boolean;
//   companyCountry: boolean;
//   location: boolean;
//   lists: boolean;
//   tags: boolean;
//   dateAdded: boolean;
//   deals: boolean;
//   verified: boolean;
// };

// export default function LeadsPage() {
//   const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
//   const [isImportPopupOpen, setIsImportPopupOpen] = useState(false);
//   const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
//   const [isVerifyPopupOpen, setIsVerifyPopupOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [leadsPerPage] = useState(10);
//   const [newLead, setNewLead] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     company: "",
//     position: "",
//     location: "",
//     tags: "",
//   });
  
//   const [showColumns, setShowColumns] = useState<ShowColumnsType>({
//     firstName: true,
//     lastName: false,
//     industry: true,
//     companyIndustry: false,
//     country: true,
//     companyCountry: false,
//     location: true,
//     lists: false,
//     tags: true,
//     dateAdded: false,
//     deals: true,
//     verified: true,
//   });

//   // Mock leads data
//   const [leads, setLeads] = useState<Lead[]>([
//     // {
//     //   id: "101",
//     //   name: "John Doe",
//     //   email: "john@example.com",
//     //   company: "Acme Inc",
//     //   position: "Software Engineer",
//     //   location: "San Francisco, CA",
//     //   tags: "Tech, Developer",
//     //   status: "new",
//     //   firstName: "John",
//     //   lastName: "Doe",
//     //   industry: "Technology",
//     //   companyIndustry: "Software Development",
//     //   country: "USA",
//     //   companyCountry: "USA",
//     //   lists: "Premium Leads",
//     //   dateAdded: "2023-01-15",
//     //   deals: "5",
//     //   verified: true
//     // },
//   ]);

//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//     const fetchLeads = async () => {
//       setIsLoading(true);
//       setError(null);
      
//       try {
//         const token = localStorage.getItem("access_token");
//         if (!token) throw new Error("No access token found");
    
//         const response = await fetch(`${BACKEND_URL}/api/v1/leads`, {
//           headers: {
//             "Authorization": `Bearer ${token}`
//           }
//         });
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch leads: ${response.statusText}`);
//         }
        
//         const data = await response.json();
//         setLeads(data.data.map((lead: any) => ({
//           id: lead.ID.toString() || 'unknown-id', // Use 'ID' instead of 'id'
//           name: `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unnamed', // Handle empty names
//           email: lead.email || '',
//           company: lead.company || '',
//           position: lead.position || '', // Direct access, not custom_fields
//           location: lead.custom_fields?.location || '', // Keep custom_fields for potential future use
//           tags: lead.custom_fields?.tags || '',
//           status: "new", // Default status
//           firstName: lead.first_name || '',
//           lastName: lead.last_name || '',
//           industry: lead.custom_fields?.industry || '',
//           companyIndustry: lead.custom_fields?.companyIndustry || '',
//           country: lead.custom_fields?.country || '',
//           companyCountry: lead.custom_fields?.companyCountry || '',
//           lists: "Manual Import", // Default value
//           dateAdded: new Date(lead.CreatedAt).toISOString().split('T')[0], // Use 'CreatedAt'
//           deals: "0", // Default value
//           verified: lead.is_verified || false // Use backend's is_verified field
//         })));
//       } catch (err: any) {
//         setError(err.message || "Error fetching leads");
//         console.error("Fetch leads error:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     useEffect(() => {
//       fetchLeads();
//     }, []);

//       // Function to delete a lead
//   const deleteLead = async (id: string) => {
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) throw new Error("No access token found");
      
//       const response = await fetch(`${BACKEND_URL}/api/v1/leads/${id}`, {
//         method: "DELETE",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error(`Failed to delete lead: ${response.statusText}`);
//       }
      
//       // Update local state after successful deletion
//       setLeads(leads.filter(lead => lead.id !== id));
//       const newSelected = new Set(selectedLeads);
//       newSelected.delete(id);
//       setSelectedLeads(newSelected);
      
//     } catch (err: any) {
//       console.error("Delete lead error:", err);
//       alert(`Failed to delete lead: ${err.message}`);
//     }
//   };

//     // Function to create a new lead
//     const handleCreateLead = async (e: React.FormEvent) => {
//       e.preventDefault();
      
//       try {
//         const token = localStorage.getItem("access_token");
//         if (!token) throw new Error("No access token found");
        
//         const customFields: Record<string, string> = {};
//         if (newLead.position) customFields.position = newLead.position;
//         if (newLead.location) customFields.location = newLead.location;
//         if (newLead.tags) customFields.tags = newLead.tags;
        
//         const response = await fetch(`${BACKEND_URL}/api/v1/leads`, {
//           method: "POST",
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify({
//             email: newLead.email,
//             first_name: newLead.firstName,
//             last_name: newLead.lastName,
//             company: newLead.company,
//             custom_fields: customFields
//           })
//         });
        
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || "Failed to create lead");
//         }
        
//         const createdLead = await response.json();
        
//         // Add the new lead to local state
//         const newLeadEntry: Lead = {
//           id: createdLead.data.id.toString(),
//           name: `${newLead.firstName} ${newLead.lastName}`,
//           email: newLead.email,
//           company: newLead.company,
//           position: newLead.position,
//           location: newLead.location,
//           tags: newLead.tags,
//           status: "new",
//           firstName: newLead.firstName,
//           lastName: newLead.lastName,
//           industry: "N/A",
//           companyIndustry: "N/A",
//           country: "USA",
//           companyCountry: "USA",
//           lists: "Manual Import",
//           dateAdded: new Date().toISOString().split('T')[0],
//           deals: "0",
//           verified: false
//         };
        
//         setLeads([newLeadEntry, ...leads]);
//         setIsCreatePopupOpen(false);
//         setNewLead({
//           firstName: "",
//           lastName: "",
//           email: "",
//           company: "",
//           position: "",
//           location: "",
//           tags: "",
//         });
        
//       } catch (err: any) {
//         console.error("Create lead error:", err);
//         alert(`Failed to create lead: ${err.message}`);
//       }
//     };

//       // Function to import leads from file
//   const handleFileUpload = async () => {
//     if (!selectedFile) return;
    
//     try {
//       const token = localStorage.getItem("access_token");
//       if (!token) throw new Error("No access token found");
      
//       const formData = new FormData();
//       formData.append("file", selectedFile);
      
//       const response = await fetch(`${BACKEND_URL}/api/v1/leads/import`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         },
//         body: formData
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to import leads");
//       }
      
//       const result = await response.json();
//       setIsImportPopupOpen(false);
//       setSelectedFile(null);
      
//       // Refresh leads after import
//       fetchLeads();
//       alert(`File uploaded successfully! ${result.imported} new leads imported.`);
      
//     } catch (err: any) {
//       console.error("Import leads error:", err);
//       alert(`Failed to import leads: ${err.message}`);
//     }
//   };

//     // Function to verify selected emails
//     const verifySelectedLeads = async () => {
//       try {
//         const token = localStorage.getItem("access_token");
//         if (!token) throw new Error("No access token found");
        
//         const emails = Array.from(selectedLeads)
//           .map(id => leads.find(lead => lead.id === id)?.email)
//           .filter(Boolean);
        
//         const response = await fetch(`${BACKEND_URL}/api/v1/verify/bulk`, {
//           method: "POST",
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify({ emails })
//         });
        
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || "Failed to verify emails");
//         }
        
//         // Update verification status locally
//         setLeads(leads.map(lead => 
//           selectedLeads.has(lead.id) ? { ...lead, verified: true } : lead
//         ));
//         setSelectedLeads(new Set());
//         setIsVerifyPopupOpen(false);
        
//         alert("Emails verified successfully!");
        
//       } catch (err: any) {
//         console.error("Verify emails error:", err);
//         alert(`Failed to verify emails: ${err.message}`);
//       }
//     };
  




//   // Filter leads based on search term
//   const filteredLeads = leads.filter(lead => 
//     lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     lead.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     lead.tags.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination
//   const indexOfLastLead = currentPage * leadsPerPage;
//   const indexOfFirstLead = indexOfLastLead - leadsPerPage;
//   const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
//   const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);

//   // Change page
//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);



//   const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.checked && currentLeads.length > 0) {
//       const allIds = currentLeads.map(lead => lead.id);
//       setSelectedLeads(new Set(allIds));
//     } else {
//       setSelectedLeads(new Set());
//     }
//   };

//   const handleSelect = (id: string) => {
//     const newSelected = new Set(selectedLeads);
//     if (newSelected.has(id)) {
//       newSelected.delete(id);
//     } else {
//       newSelected.add(id);
//     }
//     setSelectedLeads(newSelected);
//   };

//   const handleStatusChange = (id: string, value: string) => {
//     setLeads(leads.map(lead => 
//       lead.id === id ? { ...lead, status: value } : lead
//     ));
//   };

//   const toggleColumn = (column: keyof ShowColumnsType) => {
//     setShowColumns(prev => ({ ...prev, [column]: !prev[column] }));
//   };

//   const handleCustomizeClick = () => {
//     setIsPopupOpen(true);
//   };

//   const toggleAddLeadDropdown = () => {
//     setIsAddLeadOpen(!isAddLeadOpen);
//   };

//   const handleAddLeadOption = (option: string) => {
//     setIsAddLeadOpen(false);
//     if (option === 'import') {
//       setIsImportPopupOpen(true);
//     } else if (option === 'create') {
//       setIsCreatePopupOpen(true);
//     }
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       const validExtensions = ['.xls', '.xlsx', '.csv', '.txt'];
//       const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

//       if (validExtensions.includes(fileExtension)) {
//         setSelectedFile(file);
//       } else {
//         alert('Please upload only Excel (.xls, .xlsx), CSV (.csv), or Text (.txt) files');
//         e.target.value = '';
//       }
//     }
//   };


//   const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       const file = e.dataTransfer.files[0];
//       const validExtensions = ['.xls', '.xlsx', '.csv', '.txt'];
//       const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

//       if (validExtensions.includes(fileExtension)) {
//         setSelectedFile(file);
//       } else {
//         alert('Please upload only Excel (.xls, .xlsx), CSV (.csv), or Text (.txt) files');
//       }
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };



//   // Reset page when search term changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm]);


//     // In your JSX, add loading and error states:
//     if (isLoading) {
//       return (
//         <div className="p-6 h-full flex flex-col bg-[#F5F7FA] items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5570F1]"></div>
//           <p className="mt-4 text-[#53545C]">Loading leads...</p>
//         </div>
//       );
//     }


//     if (error) {
//       return (
//         <div className="p-6 h-full flex flex-col bg-[#F5F7FA] items-center justify-center">
//           <FiXCircle className="text-red-500 text-4xl mb-4" />
//           <p className="text-[#53545C] text-center mb-4">{error}</p>
//           <button 
//             className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700"
//             onClick={fetchLeads}
//           >
//             Retry
//           </button>
//         </div>
//       );
//     }

//   return (
//     <div className="p-6 h-full flex flex-col bg-[#F5F7FA]">
//       <div className="flex-1">
//         <div className="flex justify-between items-center mb-4">
//           <div>
//             <h1 className="text-2xl font-bold text-[#53545C] flex items-center">
//               <FiFile className="text-[#5570F1] mr-3" />
//               Sales Leads
//               <span className="ml-2 text-gray-500 text-sm font-normal">({leads.length} leads)</span>
//             </h1>
//           </div>
//           <div className="flex space-x-4">
//             {/* Verify Emails Button */}
//             <button 
//               className="px-4 py-2 bg-white text-[#53545C] border border-gray-200 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100"
//               onClick={() => setIsVerifyPopupOpen(true)}
//             >
//               <FiCheckCircle className="text-green-500" />
//               Verify Emails
//             </button>
            
//             {/* Add Leads Dropdown */}
//             <div className="relative">
//               <button
//                 className="px-4 py-2 bg-[#5570F1] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
//                 onClick={toggleAddLeadDropdown}
//               >
//                 <FiPlus />
//                 Add Leads
//                 <FiChevronDown className={`transition-transform ${isAddLeadOpen ? 'rotate-180' : ''}`} />
//               </button>

//               {isAddLeadOpen && (
//                 <div className="absolute z-20 mt-2 right-0 w-56 bg-white rounded-md shadow-lg border border-gray-200">
//                   <div className="py-1">
//                     <button
//                       className="flex items-center px-4 py-2 text-sm text-[#53545C] hover:bg-gray-100 w-full text-left"
//                       onClick={() => handleAddLeadOption('search')}
//                     >
//                       <FiSearch className="mr-2 text-[#5570F1]" />
//                       Search Database
//                     </button>
//                     <button
//                       className="flex items-center px-4 py-2 text-sm text-[#53545C] hover:bg-gray-100 w-full text-left"
//                       onClick={() => handleAddLeadOption('import')}
//                     >
//                       <FiUpload className="mr-2 text-[#5570F1]" />
//                       Import File
//                     </button>
//                     <button
//                       className="flex items-center px-4 py-2 text-sm text-[#53545C] hover:bg-gray-100 w-full text-left"
//                       onClick={() => handleAddLeadOption('create')}
//                     >
//                       <FiEdit className="mr-2 text-[#5570F1]" />
//                       Create Manually
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
        
//         {/* Search and Filters */}
//         <div className="flex justify-between mb-4">
//           <div className="relative w-1/3">
//             <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search leads by name, email, company, tags..."
//               className="pl-10 pr-4 py-2 w-full rounded-lg border text-gray-500 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5570F1] focus:border-transparent"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
          
//           <div className="flex space-x-2">
//             <button className="px-3 py-2 bg-white text-[#53545C] border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-100">
//               <FiFilter />
//               Filters
//             </button>
//           </div>
//         </div>
        
//         {/* Leads Table */}
//         <div className="bg-white pt-2 rounded-lg border border-gray-200 overflow-hidden">
//           <table className="w-full">
//             <thead className="border-b border-gray-200 font-medium">
//               <tr>
//                 <th className="text-left p-4 text-[#53545C] w-12">
//                   <input
//                     type="checkbox"
//                     className="h-4 w-4 rounded border-gray-300"
//                     onChange={handleSelectAll}
//                     checked={selectedLeads.size === currentLeads.length && currentLeads.length > 0}
//                   />
//                 </th>
//                 <th className="text-left p-4 text-[#53545C]">Lead</th>
//                 <th className="text-left p-4 text-[#53545C]">Email</th>
//                 {showColumns.firstName && <th className="text-left p-4 text-[#53545C]">First Name</th>}
//                 {showColumns.lastName && <th className="text-left p-4 text-[#53545C]">Last Name</th>}
//                 {showColumns.industry && <th className="text-left p-4 text-[#53545C]">Industry</th>}
//                 {showColumns.companyIndustry && <th className="text-left p-4 text-[#53545C]">Company Industry</th>}
//                 {showColumns.country && <th className="text-left p-4 text-[#53545C]">Country</th>}
//                 {showColumns.companyCountry && <th className="text-left p-4 text-[#53545C]">Company Country</th>}
//                 {showColumns.location && <th className="text-left p-4 text-[#53545C]">Location</th>}
//                 {showColumns.lists && <th className="text-left p-4 text-[#53545C]">Lists</th>}
//                 {showColumns.tags && <th className="text-left p-4 text-[#53545C]">Tags</th>}
//                 {showColumns.dateAdded && <th className="text-left p-4 text-[#53545C]">Date Added</th>}
//                 {showColumns.deals && <th className="text-left p-4 text-[#53545C]">Deals</th>}
//                 {showColumns.verified && <th className="text-left p-4 text-[#53545C]">Verified</th>}
//                 <th className="text-left p-4 text-[#53545C] w-12">
//                   <div className="cursor-pointer" onClick={handleCustomizeClick}>
//                     <Image 
//                       width={20} 
//                       height={20} 
//                       src="/customize.svg" 
//                       alt="Customize Columns" 
//                       className="mx-auto" 
//                     />
//                   </div>
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentLeads.length > 0 ? (
//                 currentLeads.map(lead => (
//                   <tr key={lead.id} className="border-b border-gray-200 hover:bg-gray-50">
//                     <td className="p-4">
//                       <input
//                         type="checkbox"
//                         className="h-4 w-4 rounded border-gray-300"
//                         checked={selectedLeads.has(lead.id)}
//                         onChange={() => handleSelect(lead.id)}
//                       />
//                     </td>
//                     <td className="p-4">
//                       <Link href={`/campaign/leads/${lead.id}`} className="flex items-center">
//                         <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 mr-3" />
//                         <div>
//                           <div className="font-medium text-[#53545C]">{lead.name}</div>
//                           <div className="text-sm text-gray-500">{lead.company}</div>
//                         </div>
//                       </Link>
//                     </td>
//                     <td className="p-4 text-[#53545C]">
//                       <div className="flex items-center">
//                         <FiMail className="mr-2 text-gray-500" />
//                         {lead.email}
//                       </div>
//                     </td>
//                     {showColumns.firstName && <td className="p-4 text-[#53545C]">{lead.firstName}</td>}
//                     {showColumns.lastName && <td className="p-4 text-[#53545C]">{lead.lastName}</td>}
//                     {showColumns.industry && <td className="p-4 text-[#53545C]">{lead.industry}</td>}
//                     {showColumns.companyIndustry && <td className="p-4 text-[#53545C]">{lead.companyIndustry}</td>}
//                     {showColumns.country && <td className="p-4 text-[#53545C]">{lead.country}</td>}
//                     {showColumns.companyCountry && <td className="p-4 text-[#53545C]">{lead.companyCountry}</td>}
//                     {showColumns.location && <td className="p-4 text-[#53545C]">
//                       <div className="flex items-center">
//                         <FiMapPin className="mr-2 text-gray-500" />
//                         {lead.location}
//                       </div>
//                     </td>}
//                     {showColumns.lists && <td className="p-4 text-[#53545C]">{lead.lists}</td>}
//                     {showColumns.tags && <td className="p-4 text-[#53545C]">
//                       <div className="flex items-center">
//                         <FiTag className="mr-2 text-gray-500" />
//                         {lead.tags}
//                       </div>
//                     </td>}
//                     {showColumns.dateAdded && <td className="p-4 text-[#53545C]">{lead.dateAdded}</td>}
//                     {showColumns.deals && <td className="p-4 text-[#53545C]">
//                       <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
//                         {lead.deals} deals
//                       </span>
//                     </td>}
//                     {showColumns.verified && <td className="p-4 text-[#53545C]">
//                       {lead.verified ? 
//                         <span className="text-green-600 flex items-center"><FiCheckCircle className="mr-1" /> Verified</span> : 
//                         <span className="text-red-500 flex items-center"><FiClock className="mr-1" /> Pending</span>
//                       }
//                     </td>}
//                     <td className="p-4">
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             deleteLead(lead.id);
//                           }}
//                           className="text-gray-400 hover:text-red-500"
//                         >
//                           <FiTrash2 />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={15} className="p-12 text-center text-gray-500">
//                     <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
//                     <p className="font-medium">No leads found</p>
//                     <p className="mt-2">Try adjusting your search or import new leads</p>
//                     <div className="mt-4 space-x-4 flex justify-center">
//                       <button
//                         className="px-4 py-2 bg-[#5570F1] text-white rounded-lg gap-2 flex items-center hover:bg-blue-700"
//                         onClick={() => setIsAddLeadOpen(true)}
//                       >
//                         <FiPlus />
//                         Add Leads
//                       </button>
//                       <button
//                         className="px-4 py-2 bg-white text-[#53545C] border border-gray-200 rounded-lg gap-2 flex items-center hover:bg-gray-100"
//                         onClick={() => handleAddLeadOption('import')}
//                       >
//                         <FiUpload />
//                         Import File
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
          
//           {/* Pagination */}
//           {currentLeads.length > 0 && (
//             <div className="flex justify-between items-center p-4 border-t border-gray-200">
//               <div className="text-sm text-gray-700">
//                 Showing {indexOfFirstLead + 1} to {Math.min(indexOfLastLead, filteredLeads.length)} of {filteredLeads.length} leads
//               </div>
//               <div className="flex items-center space-x-2">
//                 <button 
//                   onClick={() => paginate(1)} 
//                   disabled={currentPage === 1}
//                   className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400' : 'hover:bg-gray-100'}`}
//                 >
//                   <FiChevronsLeft />
//                 </button>
//                 <button 
//                   onClick={() => paginate(currentPage - 1)} 
//                   disabled={currentPage === 1}
//                   className={`p-2 rounded ${currentPage === 1 ? 'text-gray-400' : 'hover:bg-gray-100'}`}
//                 >
//                   <FiChevronLeft />
//                 </button>
                
//                 {[...Array(totalPages)].map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => paginate(i + 1)}
//                     className={`w-8 h-8 rounded-full text-sm ${currentPage === i + 1 ? 'bg-[#5570F1] text-white' : 'hover:bg-gray-100'}`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
                
//                 <button 
//                   onClick={() => paginate(currentPage + 1)} 
//                   disabled={currentPage === totalPages}
//                   className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-400' : 'hover:bg-gray-100'}`}
//                 >
//                   <FiChevronRight />
//                 </button>
//                 <button 
//                   onClick={() => paginate(totalPages)} 
//                   disabled={currentPage === totalPages}
//                   className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-400' : 'hover:bg-gray-100'}`}
//                 >
//                   <FiChevronsRight />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Column customization popup */}
//       {isPopupOpen && (
//         <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsPopupOpen(false)}>
//           <div
//             className="bg-white p-4 rounded-lg border border-gray-200 shadow-lg w-96 h-[560px] flex flex-col"
//             onClick={e => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4 border-b pb-2">
//               <h2 className="text-lg font-bold text-[#53545C]">Show Columns</h2>
//               <button
//                 onClick={() => setIsPopupOpen(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <FiX className="h-6 w-6" />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto">
//               {Object.entries({
//                 firstName: "User",
//                 lastName: "IdCard",
//                 industry: "Factory",
//                 companyIndustry: "Building",
//                 country: "Globe",
//                 companyCountry: "OfficeBuilding",
//                 location: "MapPin",
//                 lists: "ListUl",
//                 tags: "Tag",
//                 dateAdded: "Calendar",
//                 deals: "Handshake",
//                 verified: "CheckCircle"
//               }).map(([column, iconName]) => (
//                 <div
//                   key={column}
//                   className="flex items-center justify-between mb-2 border border-gray-200 hover:border-[#5570F1] p-3 rounded-lg hover:bg-gray-50"
//                 >
//                   <div className="flex items-center">
//                     {iconName === "User" && <FiUser className="mr-2 text-[#5570F1]" />}
//                     {iconName === "IdCard" && <FiCreditCard className="mr-2 text-[#5570F1]" />}
//                     {iconName === "Factory" && <FiPackage className="mr-2 text-[#5570F1]" />}
//                     {iconName === "Building" && <FiBriefcase className="mr-2 text-[#5570F1]" />}
//                     {iconName === "Globe" && <FiGlobe className="mr-2 text-[#5570F1]" />}
//                     {iconName === "OfficeBuilding" && <FiHome className="mr-2 text-[#5570F1]" />}
//                     {iconName === "MapPin" && <FiMapPin className="mr-2 text-[#5570F1]" />}
//                     {iconName === "ListUl" && <FiList className="mr-2 text-[#5570F1]" />}
//                     {iconName === "Tag" && <FiTag className="mr-2 text-[#5570F1]" />}
//                     {iconName === "Calendar" && <FiCalendar className="mr-2 text-[#5570F1]" />}
//                     {iconName === "Handshake" && <FiDollarSign className="mr-2 text-[#5570F1]" />}
//                     {iconName === "CheckCircle" && <FiCheckCircle className="mr-2 text-[#5570F1]" />}

//                     <span className="text-sm text-[#53545C]">
//                       {column.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
//                     </span>
//                   </div>

//                   <label className="relative inline-flex items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={showColumns[column as keyof typeof showColumns]}
//                       onChange={() => toggleColumn(column as keyof ShowColumnsType)}
//                       className="sr-only peer"
//                     />
//                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5570F1]"></div>
//                   </label>
//                 </div>
//               ))}
//             </div>

//             <div className="flex justify-end space-x-2 mt-4 pt-2 border-t">
//               <button
//                 onClick={() => setIsPopupOpen(false)}
//                 className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => setIsPopupOpen(false)}
//                 className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700"
//               >
//                 Apply
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* File import popup */}
//       {isImportPopupOpen && (
//         <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsImportPopupOpen(false)}>
//           <div
//             className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg w-full max-w-md"
//             onClick={e => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#53545C]">Import Leads</h2>
//               <button
//                 onClick={() => {
//                   setIsImportPopupOpen(false);
//                   setSelectedFile(null);
//                 }}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <FiX className="h-6 w-6" />
//               </button>
//             </div>

//             <div className="mb-6">
//               <p className="text-sm text-gray-600 mb-4">
//                 Upload an Excel (.xls, .xlsx), CSV (.csv), or Text (.txt) file containing your lead data.
//               </p>

//               <div
//                 className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
//                 onDrop={handleFileDrop}
//                 onDragOver={handleDragOver}
//               >
//                 {selectedFile ? (
//                   <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
//                     <div className="flex items-center">
//                       <FiFile className="text-[#5570F1] mr-3" />
//                       <span className="text-sm font-medium text-gray-700">{selectedFile.name}</span>
//                     </div>
//                     <button
//                       onClick={() => setSelectedFile(null)}
//                       className="text-gray-400 hover:text-gray-600"
//                     >
//                       <FiX />
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
//                     <label htmlFor="file-upload" className="cursor-pointer">
//                       <span className="text-[#5570F1] font-medium">Click to browse</span>
//                       <span className="text-gray-500 ml-1">or drag and drop</span>
//                     </label>
//                     <p className="text-xs text-gray-500 mt-2">
//                       Supported formats: XLS, XLSX, CSV, TXT
//                     </p>
//                     <input
//                       id="file-upload"
//                       name="file-upload"
//                       type="file"
//                       className="sr-only"
//                       onChange={handleFileChange}
//                       accept=".xls,.xlsx,.csv,.txt,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,text/plain"
//                     />
//                   </>
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => {
//                   setIsImportPopupOpen(false);
//                   setSelectedFile(null);
//                 }}
//                 className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleFileUpload}
//                 disabled={!selectedFile}
//                 className={`px-4 py-2 text-white rounded-lg ${selectedFile ? 'bg-[#5570F1] hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
//               >
//                 Import File
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Create lead popup */}
//       {isCreatePopupOpen && (
//         <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsCreatePopupOpen(false)}>
//           <div
//             className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg w-full max-w-md"
//             onClick={e => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#53545C]">Create New Lead</h2>
//               <button
//                 onClick={() => setIsCreatePopupOpen(false)}
//                 className="text-red-500 hover:text-red-700"
//               >
//                 <FiX className="h-6 w-6" />
//               </button> 
//             </div>

//             <form onSubmit={handleCreateLead} className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                     value={newLead.firstName}
//                     onChange={(e) => setNewLead({...newLead, firstName: e.target.value})}
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                     value={newLead.lastName}
//                     onChange={(e) => setNewLead({...newLead, lastName: e.target.value})}
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input
//                   type="email"
//                   className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                   value={newLead.email}
//                   onChange={(e) => setNewLead({...newLead, email: e.target.value})}
//                   required
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                   value={newLead.company}
//                   onChange={(e) => setNewLead({...newLead, company: e.target.value})}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                   value={newLead.position}
//                   onChange={(e) => setNewLead({...newLead, position: e.target.value})}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                   value={newLead.location}
//                   onChange={(e) => setNewLead({...newLead, location: e.target.value})}
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                   value={newLead.tags}
//                   onChange={(e) => setNewLead({...newLead, tags: e.target.value})}
//                   placeholder="Comma separated tags"
//                 />
//               </div>
              
//               <div className="flex justify-end space-x-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setIsCreatePopupOpen(false)}
//                   className="px-4 py-2 text-white bg-red-500 border border-gray-300 rounded-lg hover:bg-red-700"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Create Lead
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Verify leads popup */}
//       {isVerifyPopupOpen && (
//         <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsVerifyPopupOpen(false)}>
//           <div
//             className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg w-full max-w-md"
//             onClick={e => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-[#53545C]">Verify Email Addresses</h2>
//               <button
//                 onClick={() => setIsVerifyPopupOpen(false)}
//                 className="text-gray-500 hover:text-gray-700"
//               >
//                 <FiX className="h-6 w-6" />
//               </button>
//             </div>

//             <div className="mb-6">
//               <p className="text-gray-600 mb-4">
//                 You are about to verify {selectedLeads.size} email addresses. 
//                 This process may take a few moments.
//               </p>
              
//               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                 <div className="flex items-start">
//                   <FiClock className="text-yellow-500 mr-2 mt-0.5" />
//                   <p className="text-yellow-700 text-sm">
//                     Email verification checks if an email address exists and can receive emails.
//                     This helps improve your email deliverability.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={() => setIsVerifyPopupOpen(false)}
//                 className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={verifySelectedLeads}
//                 disabled={selectedLeads.size === 0}
//                 className={`px-4 py-2 text-white rounded-lg ${selectedLeads.size > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
//               >
//                 Verify Emails
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


