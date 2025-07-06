"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiFile,
  FiUpload,
  FiX,
  FiChevronDown,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiFolder,
  FiCheckCircle,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiList,
  FiCheck,
  FiClock,
  FiXCircle,
  FiPlus 
} from 'react-icons/fi';

type LeadList = {
  id: string;
  name: string;
  leadCount: number;
  uploadDate: string;
  verified: boolean;
  lastVerified?: string;
};

type VerificationStatus = 'pending' | 'processing' | 'completed' | 'failed';
type FilterOption = 'all' | 'verified' | 'not-verified' | 'recent';

export default function LeadsPage() {
  const [isAddLeadsOpen, setIsAddLeadsOpen] = useState(false);
  const [isImportPopupOpen, setIsImportPopupOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('pending');
  const [progress, setProgress] = useState(0);
  const [selectedLists, setSelectedLists] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<FilterOption>('all');
  const [isManualCreateOpen, setIsManualCreateOpen] = useState(false);
  const [manualListName, setManualListName] = useState("");
  const manualCreateRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 6;

  const [leadLists, setLeadLists] = useState<LeadList[]>([]);

  const addLeadsDropdownRef = useRef<HTMLDivElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch lead lists on mount
  useEffect(() => {
    const fetchLeadLists = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:5000/api/v1/lead-lists/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch lead lists');
        }
        const data = await response.json();
        // Assuming the API returns an array of lead lists in the data field
        const formattedData = data.data.map((list: any) => ({
          id: list.ID.toString(),
          name: list.name,
          leadCount: list.lead_count  || 0, // Adjust based on actual API response
          uploadDate: new Date(list.CreatedAt).toISOString().split('T')[0],
          verified:  false,
          lastVerified:  undefined,
        }));
        setLeadLists(formattedData);
      } catch (error) {
        console.error('Error fetching lead lists:', error);
      }
    };
    fetchLeadLists();
  }, []);

  // Handle outside clicks for Add Leads dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addLeadsDropdownRef.current && 
          !addLeadsDropdownRef.current.contains(event.target as Node)) {
        setIsAddLeadsOpen(false);
      }
    };
    
    if (isAddLeadsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAddLeadsOpen]);

  // Handle outside clicks for Filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && 
          !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  // Handle outside clicks for Manual Create popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (manualCreateRef.current && 
          !manualCreateRef.current.contains(event.target as Node)) {
        setIsManualCreateOpen(false);
      }
    };
    
    if (isManualCreateOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isManualCreateOpen]);

  // Filter lists based on search query and current filter
  const filteredLists = leadLists.filter(list => {
    const matchesSearch = list.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (currentFilter) {
      case 'verified':
        return matchesSearch && list.verified;
      case 'not-verified':
        return matchesSearch && !list.verified;
      case 'recent':
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
        return matchesSearch && list.uploadDate >= sevenDaysAgoStr;
      default:
        return matchesSearch;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLists.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLists = filteredLists.slice(startIndex, startIndex + itemsPerPage);

  const toggleAddLeadsDropdown = () => {
    setIsAddLeadsOpen(!isAddLeadsOpen);
  };

  // Handle manual creation with API call
  const handleManualCreate = async () => {
    if (!manualListName.trim()) {
      alert("Please enter a list name");
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:5000/api/v1/lead-lists/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: manualListName }),
      });

      if (!response.ok) {
        throw new Error('Failed to create lead list');
      }

      const newListData = await response.json();
      const newList: LeadList = {
        id: newListData.data.ID.toString(),
        name: newListData.data.name,
        leadCount: newListData.data.lead_count || 0,
        uploadDate: new Date(newListData.data.CreatedAt).toISOString().split('T')[0],
        verified: false,
      };

      setLeadLists([newList, ...leadLists]);
      setIsManualCreateOpen(false);
      setManualListName("");
      setCurrentPage(1);
      alert("Lead list created successfully!");
    } catch (error) {
      console.error('Error creating lead list:', error);
      alert("Failed to create lead list");
    }
  };

  const handleAddLeadsOption = (option: string) => {
    setIsAddLeadsOpen(false);
    if (option === 'import') {
      setIsImportPopupOpen(true);
    } else if (option === 'create') {
      setIsManualCreateOpen(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validExtensions = [".xls", ".xlsx", ".csv", ".txt"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (fileExtension && validExtensions.includes(`.${fileExtension}`)) {
        setSelectedFile(file);
      } else {
        alert("Please upload only Excel (.xls, .xlsx), CSV (.csv), or Text (.txt) files");
        e.target.value = "";
      }
    }
  };

  // Handle file upload with API calls
  const handleFileUpload = async () => {
    if (selectedFile) {
      try {
        const token = localStorage.getItem('access_token');
        const listName = selectedFile.name.replace(/\.[^/.]+$/, "");

        // Step 1: Create the lead list
        const createListResponse = await fetch('http://localhost:5000/api/v1/lead-lists/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ name: listName }),
        });

        if (!createListResponse.ok) {
          throw new Error('Failed to create lead list');
        }

        const newListData = await createListResponse.json();
        const newListId = newListData.data.id;

        // Step 2: Upload the file with the list ID
        const formData = new FormData();
        formData.append('file', selectedFile);

        const importResponse = await fetch(`http://localhost:5000/api/v1/leads/import?list_id=${newListId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!importResponse.ok) {
          throw new Error('Failed to import leads');
        }

        const importResult = await importResponse.json();
        const newList: LeadList = {
          id: newListId.toString(),
          name: listName,
          // Note: Current backend doesn't add new leads to list automatically,
          // so leadCount might need adjustment based on backend changes
          leadCount: importResult.data.imported || 0,
          uploadDate: new Date().toISOString().split('T')[0],
          verified: false,
        };

        setLeadLists([newList, ...leadLists]);
        setIsImportPopupOpen(false);
        setSelectedFile(null);
        setCurrentPage(1);
        alert("Lead list uploaded successfully! Please verify your leads.");
      } catch (error) {
        console.error('Error uploading lead list:', error);
        alert("Failed to upload lead list");
      }
    }
  };

  // const deleteList = (id: string) => {
  //   setLeadLists(leadLists.filter(list => list.id !== id));
  //   const newSelected = new Set(selectedLists);
  //   newSelected.delete(id);
  //   setSelectedLists(newSelected);
  // };

  const deleteList = async (id: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:5000/api/v1/lead-lists/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete lead list');
      }
  
      // Only remove from state if backend deletion succeeds
      setLeadLists(leadLists.filter(list => list.id !== id));
      const newSelected = new Set(selectedLists);
      newSelected.delete(id);
      setSelectedLists(newSelected);
      
    } catch (error) {
      console.error('Error deleting lead list:', error);
      alert("Failed to delete lead list");
    }
  };

  const toggleSelectList = (id: string) => {
    const newSelected = new Set(selectedLists);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedLists(newSelected);
  };

  const selectAllLists = () => {
    if (selectedLists.size === currentLists.length) {
      setSelectedLists(new Set());
    } else {
      setSelectedLists(new Set(currentLists.map(list => list.id)));
    }
  };

  const verifySelectedLists = () => {
    if (selectedLists.size === 0) {
      alert("Please select at least one list to verify");
      return;
    }
    
    setVerificationStatus('processing');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setVerificationStatus('completed');
          
          setLeadLists(prev => prev.map(list => 
            selectedLists.has(list.id) 
              ? {...list, verified: true, lastVerified: new Date().toISOString().split('T')[0]} 
              : list
          ));
          
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  return (
    <div className="p-6 h-full flex flex-col bg-gray-50">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#53545C]">Lead Lists</h1>
          
          <div className="flex space-x-4">
            <div className="relative" ref={addLeadsDropdownRef}>
              <button
                className="px-4 py-2 bg-[#5570F1] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
                onClick={toggleAddLeadsDropdown}
              >
                <Image width={20} height={20} src="/AddProspect.svg" alt="Add Leads" />
                Add Leads
                <FiChevronDown className={`transition-transform ${isAddLeadsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isAddLeadsOpen && (
                <div className="absolute z-20 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200">
                  <div className="py-1">
                    <button
                      className="flex items-center px-4 py-2 text-sm text-[#53545C] hover:bg-gray-100 w-full text-left"
                      onClick={() => handleAddLeadsOption('search')}
                    >
                      <FiSearch className="mr-2 text-[#5570F1]" />
                      Search Database
                    </button>
                    <button
                      className="flex items-center px-4 py-2 text-sm text-[#53545C] hover:bg-gray-100 w-full text-left"
                      onClick={() => handleAddLeadsOption('import')}
                    >
                      <FiUpload className="mr-2 text-[#5570F1]" />
                      Import File
                    </button>
                    <button
                      className="flex items-center px-4 py-2 text-sm text-[#53545C] hover:bg-gray-100 w-full text-left"
                      onClick={() => handleAddLeadsOption('create')}
                    >
                      <FiEdit className="mr-2 text-[#5570F1]" />
                      Create Manually
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button 
              className="px-4 py-2 bg-white text-[#53545C] border border-gray-200 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100"
              onClick={verifySelectedLists}
              disabled={verificationStatus === 'processing'}
            >
              <Image width={20} height={20} src="/listvarify.svg" alt="Verify Lists" />
              Verify Lists
            </button>
          </div>
        </div>

        {/* Search and filter bar */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg border border-gray-200">
          <div className="relative w-1/3">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search lead lists..."
              className="w-full pl-10 pr-4 py-2 border text-[#53545C] border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5570F1]"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative" ref={filterDropdownRef}>
              <button
                className="flex items-center gap-2 px-4 py-2 text-[#53545C] bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <FiFilter />
                Filter
                <FiChevronDown className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {isFilterOpen && (
                <div className="absolute z-20 right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200">
                  <div className="py-1">
                    <button
                      className="flex w-full text-left px-4 py-2 text-sm text-[#53545C] hover:bg-gray-100"
                      onClick={() => {
                        setCurrentFilter('all');
                        setCurrentPage(1);
                        setIsFilterOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <span className="w-4 mr-2 flex justify-center">
                          {currentFilter === 'all' && <FiCheck className="text-[#5570F1]" />}
                        </span>
                        <FiList className="mr-2 w-4" />
                        <span>All Lists</span>
                      </div>
                    </button>
                    <button
                      className="flex w-full text-left px-4 py-2 text-sm text-[#53545C] hover:bg-gray-100"
                      onClick={() => {
                        setCurrentFilter('verified');
                        setCurrentPage(1);
                        setIsFilterOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <span className="w-4 mr-2 flex justify-center">
                          {currentFilter === 'verified' && <FiCheck className="text-[#5570F1]" />}
                        </span>
                        <FiCheckCircle className="mr-2 w-4" />
                        <span>Verified</span>
                      </div>
                    </button>
                    <button
                      className="flex w-full text-left px-4 py-2 text-sm text-[#53545C] hover:bg-gray-100"
                      onClick={() => {
                        setCurrentFilter('not-verified');
                        setCurrentPage(1);
                        setIsFilterOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <span className="w-4 mr-2 flex justify-center">
                          {currentFilter === 'not-verified' && <FiCheck className="text-[#5570F1]" />}
                        </span>
                        <FiXCircle className="mr-2 w-4" />
                        <span>Not Verified</span>
                      </div>
                    </button>
                    <button
                      className="flex w-full text-left px-4 py-2 text-sm text-[#53545C] hover:bg-gray-100"
                      onClick={() => {
                        setCurrentFilter('recent');
                        setCurrentPage(1);
                        setIsFilterOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <span className="w-4 mr-2 flex justify-center">
                          {currentFilter === 'recent' && <FiCheck className="text-[#5570F1]" />}
                        </span>
                        <FiClock className="mr-2 w-4" />
                        <span>Recently Added</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verification progress */}
        {verificationStatus === 'processing' && (
          <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-[#53545C]">
                Verifying {selectedLists.size} list{selectedLists.size > 1 ? 's' : ''}...
              </span>
              <span className="text-sm font-medium text-[#5570F1]">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-[#5570F1] h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Verification completed message */}
        {verificationStatus === 'completed' && (
          <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-200 flex items-center">
            <FiCheckCircle className="text-green-500 mr-3 text-xl" />
            <div>
              <p className="font-medium text-green-800">Verification completed!</p>
              <p className="text-sm text-green-700">
                {selectedLists.size} list{selectedLists.size > 1 ? 's' : ''} verified successfully
              </p>
            </div>
          </div>
        )}

        {/* Lead lists grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentLists.length > 0 ? (
            currentLists.map(list => (
              <div 
                key={list.id} 
                className={`bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col ${
                  selectedLists.has(list.id) ? 'ring-2 ring-[#5570F1]' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <FiFolder className="text-[#5570F1] text-3xl mr-4 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#53545C] text-lg truncate">
                        <Link href={`/campaign/leads/${list.id}`} className="hover:underline">
                          {list.name}
                        </Link>
                      </h3>
                      <div className="flex items-center mt-2">
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded mr-2">
                          {list.leadCount} leads
                        </span>
                        {list.verified ? (
                          <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded flex items-center">
                            <FiCheckCircle className="mr-1" /> Verified
                          </span>
                        ) : (
                          <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                            Needs verification
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-[#5570F1] focus:ring-[#5570F1]"
                      checked={selectedLists.has(list.id)}
                      onChange={() => toggleSelectList(list.id)}
                    />
                    <FiTrash2 
                      className="text-gray-400 hover:text-red-500 cursor-pointer" 
                      onClick={() => deleteList(list.id)} 
                    />
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
                  <p>Uploaded: {list.uploadDate}</p>
                  {list.verified && list.lastVerified && (
                    <p className="mt-1">Last verified: {list.lastVerified}</p>
                  )}
                </div>
                
                <div className="mt-4 flex justify-between">
                  <Link 
                    href={`/campaign/leads/${list.id}`}
                    className="text-[#5570F1] hover:text-blue-700 text-sm font-medium flex items-center"
                  >
                    View leads <FiChevronRight className="ml-1" />
                  </Link>
                  
                  {!list.verified && (
                    <button 
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                      onClick={() => {
                        setSelectedLists(new Set([list.id]));
                        verifySelectedLists();
                      }}
                    >
                      Verify now
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 bg-white p-12 rounded-lg border border-gray-200 text-center">
              <Image width={300} height={300} src="/empty-leads.png" alt="Empty Lead Lists" className="mx-auto" />
              <p className="text-[#53545C] mt-4 font-bold text-lg">No lead lists found</p>
              <p className="text-[#53545C]">Create your first lead list by importing a file or searching our database</p>
              <div className="mt-6 space-x-4 flex justify-center">
                <button
                  className="px-4 py-2 bg-[#5570F1] text-white rounded-lg gap-2 flex items-center hover:bg-blue-700"
                  onClick={toggleAddLeadsDropdown}
                >
                  <Image width={20} height={20} src="/AddProspect.svg" alt="Add Leads" />
                  Add Leads
                </button>
                <button
                  className="px-4 py-2 bg-white text-[#53545C] border border-gray-200 rounded-lg gap-2 flex items-center hover:bg-gray-100"
                  onClick={() => handleAddLeadsOption('import')}
                >
                  <Image width={20} height={20} src="/uploadlist.svg" alt="Upload List" />
                  Upload List
                </button>
              </div>
            </div>
          )}

          {/* Add new list card */}
          {currentLists.length > 0 && (
            <div 
              className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100"
              onClick={() => setIsImportPopupOpen(true)}
            >
              <div className="bg-[#5570F1] rounded-full p-3 mb-4">
                <FiUpload className="text-white text-xl" />
              </div>
              <span className="text-[#5570F1] font-medium text-lg">Import new leads</span>
              <p className="text-gray-500 text-sm mt-2 text-center">
                Upload a CSV, Excel, or Text file to create a new lead list
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-8 bg-white p-4 rounded-lg border border-gray-200">
            <button
              className="px-4 py-2 flex items-center gap-2 text-[#53545C] disabled:text-gray-300"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FiChevronLeft /> Previous
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`w-8 h-8 rounded-full ${
                    currentPage === page 
                      ? 'bg-[#5570F1] text-white' 
                      : 'text-[#53545C] hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              className="px-4 py-2 flex items-center gap-2 text-[#53545C] disabled:text-gray-300"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next <FiChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Manual Create Popup */}
      {isManualCreateOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" 
             onClick={() => setIsManualCreateOpen(false)}>
          <div
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg w-full max-w-md"
            onClick={e => e.stopPropagation()}
            ref={manualCreateRef}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#53545C]">Create New Lead List</h2>
              <button
                onClick={() => setIsManualCreateOpen(false)}
                className="text-red-500 hover:text-red-700"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Enter a name for your new lead list
              </p>
              
              <div className="mb-4">
                <label htmlFor="list-name" className="block text-sm font-medium text-gray-700 mb-1">
                  List Name
                </label>
                <input
                  type="text"
                  id="list-name"
                  className="w-full px-3 py-2 border text-[#53545C] border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5570F1]"
                  placeholder="e.g., Sales Leads Q4 2023"
                  value={manualListName}
                  onChange={(e) => setManualListName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsManualCreateOpen(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleManualCreate}
                className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700"
              >
                Create List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Popup */}
      {isImportPopupOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsImportPopupOpen(false)}>
          <div
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#53545C]">Import Lead List</h2>
              <button
                onClick={() => {
                  setIsImportPopupOpen(false);
                  setSelectedFile(null);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Upload a file to create a new lead list. Supported formats: CSV, XLS, XLSX, TXT
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {selectedFile ? (
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <div className="flex items-center">
                      <FiFile className="text-[#5570F1] mr-3" />
                      <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
                        {selectedFile.name}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <>
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-[#5570F1] font-medium">Click to browse</span>
                      <span className="text-gray-500 ml-1">or drag and drop</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Max file size: 10MB
                    </p>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".xls,.xlsx,.csv,.txt"
                    />
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsImportPopupOpen(false);
                  setSelectedFile(null);
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleFileUpload}
                disabled={!selectedFile}
                className={`px-4 py-2 text-white rounded-lg ${
                  selectedFile ? "bg-[#5570F1] hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Import List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
