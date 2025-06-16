"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import AddSender from "@/components/addSender";
import { FiMail, FiRefreshCw, FiShieldOff, FiEdit, FiTrash2, FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface Sender {
  id: number;
  name: string;
  from_email: string;
  provider_type: string;
  smtp_verified: boolean;
  is_warming_up?: boolean;
  warmup_stage?: number;
  warmup_sent_today?: number;
}

export default function Sender() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [senders, setSenders] = useState<Sender[]>([]);
  const [filteredSenders, setFilteredSenders] = useState<Sender[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSender, setSelectedSender] = useState<Sender | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Auth token management
  const getAccessToken = async () => {
    let token = localStorage.getItem("access_token");
    if (!token) {
      try {
        token = await refreshAccessToken();
      } catch (err) {
        console.error("Failed to refresh token:", err);
        window.location.href = "/login";
        throw err;
      }
    }
    return token;
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      return data.access_token;
    } catch (err) {
      console.error("Token refresh failed:", err);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
      throw err;
    }
  };

  const authFetch = async (url: string, options: RequestInit = {}) => {
    let token = await getAccessToken();
    
    const headers = {
      ...options.headers,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    let response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      try {
        token = await refreshAccessToken();
        response = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            "Authorization": `Bearer ${token}`,
          },
        });
      } catch (err) {
        throw err;
      }
    }

    return response;
  };

  // Fetch senders with error handling and loading states
  const fetchSenders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/protected/senders`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch senders");
      }

      const data = await response.json();
      setSenders(data);
      setFilteredSenders(data);
      setCurrentPage(1);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      toast.error(err.message || "Failed to fetch senders");
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredSenders(senders);
      setCurrentPage(1);
      return;
    }

    const filtered = senders.filter(
      (sender) =>
        sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sender.from_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sender.provider_type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSenders(filtered);
    setCurrentPage(1);
  };

  // Test sender connection
  const handleTestSender = async (senderId: number) => {
    if (!senderId) {
      toast.error("Invalid sender ID");
      return;
    }

    try {
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/protected/senders/${senderId}/test`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to test sender");
      }

      const result = await response.json();
      if (result.results?.smtp?.success) {
        toast.success("SMTP connection successful!");
        if (result.results.email_sent) {
          toast.success("Test email sent successfully!");
        }
      } else {
        toast.error(result.results?.smtp?.error || "SMTP test failed");
      }

      // Refresh sender list to update verification status
      fetchSenders();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  // Verify sender
  const handleVerifySender = async (senderId: number) => {
    if (!senderId) {
      toast.error("Invalid sender ID");
      return;
    }

    try {
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/protected/senders/${senderId}/verify`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to verify sender");
      }

      toast.success("Sender verified successfully");
      fetchSenders();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  // Delete sender
  const handleDeleteSender = async (senderId: number) => {
    if (!senderId) {
      toast.error("Invalid sender ID");
      return;
    }

    if (!confirm("Are you sure you want to delete this sender? This action cannot be undone.")) return;

    try {
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/protected/senders/${senderId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete sender");
      }

      toast.success("Sender deleted successfully");
      setSenders(senders.filter((sender) => sender.id !== senderId));
      setFilteredSenders(filteredSenders.filter((sender) => sender.id !== senderId));
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  // Start warmup
  const handleStartWarmup = async (senderId: number) => {
    try {
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/protected/senders/${senderId}/warmup/start`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to start warmup");
      }

      toast.success("Warmup started successfully");
      fetchSenders();
    } catch (err: any) {
      toast.error(err.message || "Failed to start warmup");
    }
  };

  // Stop warmup
  const handleStopWarmup = async (senderId: number) => {
    try {
      const response = await authFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/protected/senders/${senderId}/warmup/stop`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to stop warmup");
      }

      toast.success("Warmup stopped successfully");
      fetchSenders();
    } catch (err: any) {
      toast.error(err.message || "Failed to stop warmup");
    }
  };

  // Row selection
  const handleRowSelect = (senderId: number) => {
    setSelectedRows((prev) =>
      prev.includes(senderId)
        ? prev.filter((id) => id !== senderId)
        : [...prev, senderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredSenders.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredSenders.map((sender) => sender.id));
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSenders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSenders.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchSenders();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, senders]);

  return (
    <div className="bg-[#F5F7FA] dark:bg-neutral-900 overflow-hidden min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-[24px] font-semibold text-[#53545C] dark:text-neutral-200">
              Email Accounts
            </h1>
            <p className="text-[#53545C] dark:text-neutral-200">
              Add and manage your email sender accounts.
            </p>
            <button
              onClick={() => setIsPopupOpen(true)}
              className="bg-[#5570F1] text-white px-4 py-2 mt-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <span>+</span> Add Email Account
            </button>
          </div>
          <div className="flex items-center gap-2 mt-16 relative">
            <FiSearch className="absolute left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search email accounts..."
              className="pl-10 pr-4 py-2 text-gray-500 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-neutral-800 border border-[#D9D9D9] dark:border-neutral-700 rounded-lg text-sm">
          <div className="grid grid-cols-[40px_1fr_2fr_1fr_1fr_1fr_1fr] gap-4 p-4 border-b border-[#D9D9D9] dark:border-neutral-700 text-[#53545C] dark:text-neutral-300 font-semibold uppercase text-xs">
            <div>
              <input
                type="checkbox"
                checked={selectedRows.length === filteredSenders.length && filteredSenders.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div>NAME</div>
            <div>EMAIL</div>
            <div>UNIBOX</div>
            <div>WARM-UP</div>
            <div>SENT / LIMIT</div>
            <div>ACTIONS</div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredSenders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Image
                src="/prospect.png"
                alt="No email accounts"
                width={250}
                height={150}
                className="mb-6"
              />
              <h2 className="text-xl font-semibold text-[#53545C] dark:text-neutral-200 mb-2">
                {searchQuery ? "No matching email accounts found" : "Add your first email account"}
              </h2>
              <p className="text-[#53545C] dark:text-neutral-400 mb-6 text-center">
                {searchQuery ? "Try a different search term" : "Launch multichannel campaigns, measure and improve your deliverability."}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="bg-[#5570F1] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <span>+</span> Add Email Account
                </button>
              )}
            </div>
          ) : (
            <>
              {currentItems.map((sender) => (
                <div
                  key={sender.id}
                  className="grid grid-cols-[40px_1fr_2fr_1fr_1fr_1fr_1fr] gap-4 p-4 border-b border-gray-200 dark:border-neutral-700 text-[#53545C] dark:text-neutral-300 items-center hover:bg-gray-50 dark:hover:bg-neutral-700/50"
                >
                  <div>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(sender.id)}
                      onChange={() => handleRowSelect(sender.id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${sender.smtp_verified ? 'bg-[#22C55E]' : 'bg-[#EF4444]'}`}></div>
                    <span>{sender.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMail className="text-[#3B82F6]" />
                    <span>{sender.from_email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#EDE9FE] dark:bg-purple-900/30 text-[#7C3AED] dark:text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded flex items-center gap-1">
                      <FiRefreshCw className="text-[#7C3AED] dark:text-purple-300" />
                      {sender.provider_type}
                    </span>
                  </div>
                  <div>
                    {sender.is_warming_up ? (
                      <div className="flex items-center gap-2">
                        <span className="bg-[#DCFCE7] dark:bg-green-900/30 text-[#15803D] dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded">
                          Warming Up (Stage {sender.warmup_stage})
                        </span>
                        <button 
                          onClick={() => handleStopWarmup(sender.id)}
                          className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400"
                        >
                          Stop
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartWarmup(sender.id)}
                        className="bg-[#DCFCE7] dark:bg-green-900/30 text-[#15803D] dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded hover:bg-green-100 dark:hover:bg-green-900/50"
                      >
                        Start Warmup
                      </button>
                    )}
                  </div>
                  <div>
                    <span className="text-[#53545C] dark:text-neutral-300">
                      {sender.warmup_sent_today || 0} / 50
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTestSender(sender.id)}
                      className="text-[#6B7280] hover:text-[#3B82F6] dark:hover:text-blue-400 transition-colors"
                      title="Test"
                    >
                      <FiRefreshCw size={16} />
                    </button>
                    {!sender.smtp_verified && (
                      <button
                        onClick={() => handleVerifySender(sender.id)}
                        className="text-[#6B7280] hover:text-[#22C55E] dark:hover:text-green-400 transition-colors"
                        title="Verify"
                      >
                        <FiShieldOff size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteSender(sender.id)}
                      className="text-[#6B7280] dark:text-neutral-400 hover:text-[#EF4444] dark:hover:text-[#F87171] transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Pagination controls */}
              {filteredSenders.length > itemsPerPage && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-neutral-700 gap-4">
                  <div className="text-sm text-gray-700 dark:text-neutral-300">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredSenders.length)}
                    </span>{" "}
                    of <span className="font-medium">{filteredSenders.length}</span> results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700"}`}
                    >
                      <FiChevronLeft size={18} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-3 py-1 rounded-md ${currentPage === number ? "bg-[#5570F1] text-white" : "text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700"}`}
                      >
                        {number}
                      </button>
                    ))}

                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700"}`}
                    >
                      <FiChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isPopupOpen && (
        <AddSender 
          onClose={() => { 
            setIsPopupOpen(false); 
            fetchSenders(); 
          }} 
        />
      )}
    </div>
  );
}