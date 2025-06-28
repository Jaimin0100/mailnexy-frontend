"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Campaign {
  id: number;
  name: string;
  created_at: string;
  status: string;
  sent_count: number;
  open_count: number;
  click_count: number;
  reply_count: number;
  bounce_count: number;
  interested_count: number;
  flow?: {
    nodes: any[];  // Adjust with actual node type
    edges: any[];  // Adjust with actual edge type
  };
}

export default function AllCampaign() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<number | null>(null);

  // Function to calculate percentage for the progress circle
  const getPercentage = (value: number, max: number) => (value / max) * 100;

  const DropdownMenu = ({ campaign, onAction }: { campaign: Campaign, onAction: (action: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
  
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
  
    return (
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
        >
          ⋮
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <div className="py-1">
              {campaign.status === 'draft' && (
                <button
                  onClick={() => {
                    onAction('start');
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Start Campaign
                </button>
              )}
              
              {campaign.status === 'sending' && (
                <button
                  onClick={() => {
                    onAction('stop');
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Stop Campaign
                </button>
              )}
              
              {campaign.status === 'paused' && (
                <button
                  onClick={() => {
                    onAction('start');
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Resume Campaign
                </button>
              )}
              
              <button
                onClick={() => {
                  onAction('edit');
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit Campaign
              </button>
              
              <button
              onClick={(e) => {
                e.stopPropagation();
                console.log("Delete clicked for campaign:", campaign.id);
                setCampaignToDelete(campaign.id);
                setShowDeleteConfirm(true);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Delete Campaign
            </button>
            </div>
          </div>
        )}
      </div>
    );
  };


   // NEW: Centralized API call function with token refresh
   const fetchWithTokenRefresh = async (url: string, options: RequestInit) => {
    let token = localStorage.getItem("access_token");
    let refreshToken = localStorage.getItem("refresh_token");
    
    // First attempt with current token
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    // Token expired - try refresh
    if (response.status === 401 && refreshToken) {
      const refreshResponse = await fetch("http://localhost:5000/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (refreshResponse.ok) {
        const { access_token, refresh_token } = await refreshResponse.json();
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        
        // Retry with new token
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${access_token}`,
          },
        });
      } else {
        // Refresh failed - redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        router.push("/login");
        throw new Error("Session expired. Please login again.");
      }
    }
    
    return response;
  };

    // UPDATED: Delete campaign function
    const handleDeleteCampaign = async (campaignId: number) => {
      try {
        console.log("Deleting campaign ID:", campaignId);
        const response = await fetchWithTokenRefresh(
          `http://localhost:5000/api/v1/campaigns/${campaignId}`,
          { method: "DELETE" }
        );
        console.log("Response status:", response.status);
        if (!response.ok) throw new Error("Failed to delete campaign");
        setCampaigns(campaigns.filter(c => c.id !== campaignId));
        setShowDeleteConfirm(false);
        setCampaignToDelete(null);
        return true;
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to delete campaign';
        console.error("Delete error:", errorMessage);
        setError(errorMessage);
        return false;
      }
    };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");
  
        if (!token) {
          router.push("/login");
          return;
        }
  
        let response = await fetch("http://localhost:5000/api/v1/campaigns", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Token refresh logic remains the same
        if (response.status === 401) {
          if (!refreshToken) {
            throw new Error("Session expired. Please login again.");
          }
  
          const refreshResponse = await fetch("http://localhost:5000/auth/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
  
          if (!refreshResponse.ok) {
            throw new Error("Session expired. Please login again.");
          }
  
          const { access_token, refresh_token } = await refreshResponse.json();
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
  
          response = await fetch("http://localhost:5000/api/v1/campaigns", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          });
        }

  
        if (!response.ok) {
          throw new Error("Failed to fetch campaigns");
        }
  
        const data = await response.json();
        console.log("API Response:", data);
        setCampaigns(data);
        // Map the data to ensure 'id' exists
        const mappedData = data.map((campaign: { ID: any; name: any; CreatedAt: any; status: any; sent_count: any; open_count: any; click_count: any; reply_count: any; bounce_count: any; }) => ({
          id: campaign.ID, // Adjust '_id' to match your API's property
          name: campaign.name,
          created_at: campaign.CreatedAt,
          status: campaign.status,
          sent_count: campaign.sent_count,
          open_count: campaign.open_count,
          click_count: campaign.click_count,
          reply_count: campaign.reply_count,
          bounce_count: campaign.bounce_count,
          interested_count: 0,
        }));
        setCampaigns(mappedData);
      } catch (err: any) {
        console.error("Error fetching campaigns:", err.message);
        setError(err.message);
        if (err.message.includes("Session expired") || err.message.includes("Unauthorized")) {
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchCampaigns();
  }, [router]);

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCampaign = () => {
    router.push("/campaigns/new");
  };

  const handleExportStats = () => {
    alert("Export functionality will be implemented here");
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !error.includes("Session expired")) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
          <button
            onClick={() => router.push("/login")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleCampaignAction = async (campaignId: number, action: string) => {
    try {
      console.log("Action:", action, "Campaign ID:", campaignId);
      // Add validation for campaignId
      if (!campaignId || isNaN(campaignId)) {
        console.error("Invalid campaign ID:", campaignId);
        throw new Error("Invalid campaign ID");
      }
  
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }
  
      let url = `http://localhost:5000/api/v1/campaigns/${campaignId}`;
      let method = "GET";
  
      switch (action) {
        case 'start':
          url += '/start';
          method = 'POST';
          break;
        case 'stop':
          url += '/stop';
          method = 'POST';
          break;
        case 'edit':
          router.push(`/campaigns/edit/${campaignId}`);
          return;
        case 'delete':
          method = 'DELETE';
          break;
        default:
          return;
      }
  
      console.log(`Making ${method} request to ${url}`); // Debug log
  
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to ${action} campaign`);
      }
  
      // Refresh the campaigns list after successful action
      if (action === 'delete') {
        setCampaigns(campaigns.filter(c => c.id !== campaignId));
      } else if (action === 'start' || action === 'stop') {
        setCampaigns(campaigns.map(c => 
          c.id === campaignId 
            ? { ...c, status: action === 'start' ? 'sending' : 'paused' } 
            : c
        ));
      }
    } catch (err: any) {
      console.error(`Error ${action}ing campaign:`, err.message);
      setError(err.message);
      // Optionally show a toast notification here
    }
  };

  return (
    <div className="p-6 pt-8 bg-gray-50 min-h-screen font-sans">
      {/* Header Section */}
        {/* <div className="text-[#53545C] space -x-2">
          <div className="text-[20px] font-semibold ">
          <h1>ALL CAMPAIGN</h1></div>
          <p>Add and Manage your multiple Campaign</p>
        </div> */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <button 
          onClick={handleCreateCampaign}
          className="bg-[#5570F1] text-white text-[14px] font-bold px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-600 transition-all duration-300 shadow-sm"
        >
          <span className="text-[15px] justify-center">+</span> Create Campaign
        </button>
        <div className="flex items-center gap-4 flex-wrap">
          <button 
            onClick={handleExportStats}
            className="text-[#696A71] flex text-[14px] px-4 py-2 border border-gray-300 rounded-xl items-center gap-2 hover:text-[#5570F1] hover:bg-[#5570F1]/10 transition-colors duration-300"
          >
            <span className="text-[15px] justify-center">↓</span> Export statistics
          </button>
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-200 text-gray-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 min-w-[200px]"
          />
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredCampaigns.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? (
              <p>No campaigns match your search criteria.</p>
            ) : (
              <div className="flex flex-col items-center justify-center gap-6 py-12">
                <Image
                  src="/createcampaign2.png"
                  alt="No campaigns"
                  width={80}
                  height={60}
                  className="mx-auto"
                />
                <div className="text-center max-w-md">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Campaigns Yet</h3>
                  <p className="text-gray-500 mb-6">
                    You haven't created any campaigns yet. Get started by creating your first campaign
                    to reach out to your audience.
                  </p>
                  <button
                    onClick={handleCreateCampaign}
                    className="bg-[#5570F1] text-white text-[14px] font-bold px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-600 transition-all duration-300 shadow-sm mx-auto"
                  >
                    <span className="text-[15px] justify-center">+</span> Create Your First Campaign
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-[12px] font-medium tracking-wide">
                  <th className="p-5">Campaign</th>
                  <th className="p-5">Status</th>
                  <th className="p-5">Sent Email</th>
                  <th className="p-5">Email Opens</th>
                  <th className="p-5">Link Clicked</th>
                  <th className="p-5">Email Replies</th>
                  <th className="p-5">Bounce</th>
                  <th className="p-5">Interested</th>
                  <th className="p-5"><Image width={20} height={20} src="/customize.svg" alt="Customize Columns" className="mx-auto cursor-pointer" /></th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr 
                    key={campaign.id} 
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-300"
                  >
                    <td className="p-5 font-semibold text-gray-700">
                      <div>{campaign.name}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(campaign.created_at).toLocaleString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="p-5">
                      <span 
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium capitalize" 
                        style={{
                          backgroundColor: campaign.status === "draft" ? "#E5E7EB" : 
                                         campaign.status === "sending" ? "#BFDBFE" : 
                                         campaign.status === "completed" ? "#D1FAE5" : "#E5E7EB",
                          color: campaign.status === "draft" ? "#4B5563" : 
                                 campaign.status === "sending" ? "#1E40AF" : 
                                 campaign.status === "completed" ? "#065F46" : "#4B5563"
                        }}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="relative w-12 h-12">
                        <div
                          className="absolute inset-0 rounded-full bg-gray-100 shadow-sm"
                          style={{
                            background: `conic-gradient(#8b5cf6 ${getPercentage(campaign.sent_count, 200)}%, #e5e7eb ${getPercentage(campaign.sent_count, 200)}%)`,
                          }}
                        ></div>
                        <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 shadow-inner">
                          {campaign.sent_count}
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="relative w-12 h-12">
                        <div
                          className="absolute inset-0 rounded-full bg-gray-100 shadow-sm"
                          style={{
                            background: `conic-gradient(#22c55e ${getPercentage(campaign.open_count, 200)}%, #e5e7eb ${getPercentage(campaign.open_count, 200)}%)`,
                          }}
                        ></div>
                        <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 shadow-inner">
                          {campaign.open_count}
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="relative w-12 h-12">
                        <div
                          className="absolute inset-0 rounded-full bg-gray-100 shadow-sm"
                          style={{
                            background: `conic-gradient(#eab308 ${getPercentage(campaign.click_count, 200)}%, #e5e7eb ${getPercentage(campaign.click_count, 200)}%)`,
                          }}
                        ></div>
                        <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 shadow-inner">
                          {campaign.click_count}
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="relative w-12 h-12">
                        <div
                          className="absolute inset-0 rounded-full bg-gray-100 shadow-sm"
                          style={{
                            background: `conic-gradient(#3b82f6 ${getPercentage(campaign.reply_count, 200)}%, #e5e7eb ${getPercentage(campaign.reply_count, 200)}%)`,
                          }}
                        ></div>
                        <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 shadow-inner">
                          {campaign.reply_count}
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="relative w-12 h-12">
                        <div
                          className="absolute inset-0 rounded-full bg-gray-100 shadow-sm"
                          style={{
                            background: `conic-gradient(#ef4444 ${getPercentage(campaign.bounce_count, 200)}%, #e5e7eb ${getPercentage(campaign.bounce_count, 200)}%)`,
                          }}
                        ></div>
                        <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 shadow-inner">
                          {campaign.bounce_count}
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="relative w-12 h-12">
                        <div
                          className="absolute inset-0 rounded-full bg-gray-100 shadow-sm"
                          style={{
                            background: `conic-gradient(#3b82f6 ${getPercentage(campaign.interested_count, 200)}%, #e5e7eb ${getPercentage(campaign.interested_count, 200)}%)`,
                          }}
                        ></div>
                        <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 shadow-inner">
                          {campaign.interested_count}
                        </div>
                      </div>
                    </td>
                    <td className="p-5 pl-12">
                        <DropdownMenu 
                          campaign={campaign} 
                          onAction={(action) => handleCampaignAction(campaign.id, action)} 
                        />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
        {showDeleteConfirm && (
          console.log("Dialog shown, campaignToDelete:", campaignToDelete),
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-black">Confirm Delete</h3>
              <p className="mb-4 text-black">Are you sure you want to delete this campaign?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-black hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    console.log("Confirm delete, campaignToDelete:", campaignToDelete);
                    if (campaignToDelete) {
                      await handleDeleteCampaign(campaignToDelete);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}