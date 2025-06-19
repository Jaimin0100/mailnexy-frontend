"use client";
import { useEffect, useState } from "react";
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
}

export default function AllCampaign() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Function to calculate percentage for the progress circle
  const getPercentage = (value: number, max: number) => (value / max) * 100;

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

        // If token expired, try to refresh it
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

          // Retry with new token
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
        setCampaigns(data);
      } catch (err: any) {
        console.error("Error fetching campaigns:", err.message);
        setError(err.message);
        
        // Only redirect if it's an auth error
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
                  <th className="p-5"></th>
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
                    <td className="p-5">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors duration-300">
                        ⋮
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}











// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// interface Campaign {
//   id: number;
//   name: string;
//   created_at: string;
//   status: string;
//   sent_count: number;
//   open_count: number;
//   click_count: number;
//   reply_count: number;
//   bounce_count: number;
//   interested_count: number;
// }

// export default function AllCampaign() {
//   const router = useRouter();
//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   // Function to calculate percentage for the progress circle
//   const getPercentage = (value: number, max: number) => (value / max) * 100;

//   useEffect(() => {
//     const fetchCampaigns = async () => {
//       try {
//         const token = localStorage.getItem("access_token");
//         const refreshToken = localStorage.getItem("refresh_token");

//         if (!token) {
//           router.push("/login");
//           return;
//         }

//         let response = await fetch("http://localhost:5000/api/v1/campaigns", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         // If token expired, try to refresh it
//         if (response.status === 401) {
//           if (!refreshToken) {
//             throw new Error("Session expired. Please login again.");
//           }

//           const refreshResponse = await fetch("http://localhost:5000/auth/refresh", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ refresh_token: refreshToken }),
//           });

//           if (!refreshResponse.ok) {
//             throw new Error("Session expired. Please login again.");
//           }

//           const { access_token, refresh_token } = await refreshResponse.json();
//           localStorage.setItem("access_token", access_token);
//           localStorage.setItem("refresh_token", refresh_token);

//           // Retry with new token
//           response = await fetch("http://localhost:5000/api/v1/campaigns", {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${access_token}`,
//             },
//           });
//         }

//         if (!response.ok) {
//           throw new Error("Failed to fetch campaigns");
//         }

//         const data = await response.json();
//         setCampaigns(data);
//       } catch (err: any) {
//         console.error("Error fetching campaigns:", err.message);
//         setError(err.message);
        
//         // Only redirect if it's an auth error
//         if (err.message.includes("Session expired") || err.message.includes("Unauthorized")) {
//           localStorage.removeItem("token");
//           localStorage.removeItem("refresh_token");
//           router.push("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCampaigns();
//   }, [router]);

//   const filteredCampaigns = campaigns.filter(campaign =>
//     campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleCreateCampaign = () => {
//     router.push("/campaigns/new");
//   };

//   const handleExportStats = () => {
//     alert("Export functionality will be implemented here");
//   };

//   if (loading) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error && !error.includes("Session expired")) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           Error: {error}
//         </div>
//         <div className="flex gap-4">
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Retry
//           </button>
//           <button
//             onClick={() => router.push("/login")}
//             className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 pt-8 bg-gray-50 min-h-screen font-sans">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
//         <button 
//           onClick={handleCreateCampaign}
//           className="bg-[#5570F1] text-white text-[14px] font-bold px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-600 transition-all duration-300 shadow-sm"
//         >
//           <span className="text-[15px] justify-center">+</span> Create Campaign
//         </button>
//         <div className="flex items-center gap-4 flex-wrap">
//           <button 
//             onClick={handleExportStats}
//             className="text-[#696A71] flex text-[14px] px-4 py-2 border border-gray-300 rounded-xl items-center gap-2 hover:text-[#5570F1] hover:bg-[#5570F1]/10 transition-colors duration-300"
//           >
//             <span className="text-[15px] justify-center">↓</span> Export statistics
//           </button>
//           <input
//             type="text"
//             placeholder="Search campaigns..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="border border-gray-200 text-gray-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 min-w-[200px]"
//           />
//         </div>
//       </div>

//       {/* Campaigns Table */}
//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//         {filteredCampaigns.length === 0 ? (
//           <div className="p-8 text-center text-gray-500">
//             {searchTerm ? (
//               <p>No campaigns match your search criteria.</p>
//             ) : (
//               <div className="flex flex-col items-center justify-center gap-4">
//                 <p>You don't have any campaigns yet.</p>
//                 <button
//                   onClick={handleCreateCampaign}
//                   className="bg-[#5570F1] text-white text-[14px] font-bold px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-600 transition-all duration-300 shadow-sm"
//                 >
//                   <span className="text-[15px] justify-center">+</span> Create Your First Campaign
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="bg-gray-50 text-gray-500 text-[12px] font-medium tracking-wide">
//                   <th className="p-5">Campaign</th>
//                   <th className="p-5">Status</th>
//                   <th className="p-5">Sent Email</th>
//                   <th className="p-5">Email Opens</th>
//                   <th className="p-5">Link Clicked</th>
//                   <th className="p-5">Email Replies</th>
//                   <th className="p-5">Bounce</th>
//                   <th className="p-5">Interested</th>
//                   <th className="p-5"></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredCampaigns.map((campaign) => (
//                   <tr 
//                     key={campaign.id} 
//                     className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-300"
//                   >
//                     <td className="p-5 font-semibold text-gray-700">
//                       <div>{campaign.name}</div>
//                       <div className="text-xs text-gray-400">
//                         {new Date(campaign.created_at).toLocaleString("en-US", {
//                           day: "numeric",
//                           month: "short",
//                           year: "numeric",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </div>
//                     </td>
//                     <td className="p-5">
//                       <span 
//                         className="inline-block px-2 py-1 rounded-full text-xs font-medium capitalize" 
//                         style={{
//                           backgroundColor: campaign.status === "draft" ? "#E5E7EB" : 
//                                          campaign.status === "sending" ? "#BFDBFE" : 
//                                          campaign.status === "completed" ? "#D1FAE5" : "#E5E7EB",
//                           color: campaign.status === "draft" ? "#4B5563" : 
//                                  campaign.status === "sending" ? "#1E40AF" : 
//                                  campaign.status === "completed" ? "#065F46" : "#4B5563"
//                         }}
//                       >
//                         {campaign.status}
//                       </span>
//                     </td>
//                     <td className="p-5">
//                       <div className="relative w-12 h-12">
//                         <div
//                           className="absolute inset-0 rounded-full bg-gray-100 shadow-sm"
//                           style={{
//                             background: `conic-gradient(#8b5cf6 ${getPercentage(campaign.sent_count, 200)}%, #e5e7eb ${getPercentage(campaign.sent_count, 200)}%)`,
//                           }}
//                         ></div>
//                         <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 shadow-inner">
//                           {campaign.sent_count}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-5">
//                       <div className="relative w-12 h-12">
//                         <div
//                           className="absolute inset-0 rounded-full bg-gray-100 shadow-sm"
//                           style={{
//                             background: `conic-gradient(#22c55e ${getPercentage(campaign.open_count, 200)}%, #e5e7eb ${getPercentage(campaign.open_count, 200)}%)`,
//                           }}
//                         ></div>
//                         <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 shadow-inner">
//                           {campaign.open_count}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-5">
//                       <div className="relative w-12 h-12">
//                         <div
//                           className="absolute inset-0 rounded-full bg-gray-100 shadow-sm"
//                           style={{
//                             background: `conic-gradient(#eab308 ${getPercentage(campaign.click_count, 200)}%, #e5e7eb ${getPercentage(campaign.click_count, 200)}%)`,
//                           }}
//                         ></div>
//                         <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 shadow-inner">
//                           {campaign.click_count}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-5">
//                       <div className="relative w-12 h-12">
//                         <div
//                           className="absolute inset-0 rounded-full bg-gray-100 shadow-sm"
//                           style={{
//                             background: `conic-gradient(#3b82f6 ${getPercentage(campaign.reply_count, 200)}%, #e5e7eb ${getPercentage(campaign.reply_count, 200)}%)`,
//                           }}
//                         ></div>
//                         <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 shadow-inner">
//                           {campaign.reply_count}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-5">
//                       <div className="relative w-12 h-12">
//                         <div
//                           className="absolute inset-0 rounded-full bg-gray-100 shadow-sm"
//                           style={{
//                             background: `conic-gradient(#ef4444 ${getPercentage(campaign.bounce_count, 200)}%, #e5e7eb ${getPercentage(campaign.bounce_count, 200)}%)`,
//                           }}
//                         ></div>
//                         <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 shadow-inner">
//                           {campaign.bounce_count}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-5">
//                       <div className="relative w-12 h-12">
//                         <div
//                           className="absolute inset-0 rounded-full bg-gray-100 shadow-sm"
//                           style={{
//                             background: `conic-gradient(#3b82f6 ${getPercentage(campaign.interested_count, 200)}%, #e5e7eb ${getPercentage(campaign.interested_count, 200)}%)`,
//                           }}
//                         ></div>
//                         <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 shadow-inner">
//                           {campaign.interested_count}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-5">
//                       <button className="text-gray-400 hover:text-gray-600 transition-colors duration-300">
//                         ⋮
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }












// import { useEffect, useState } from "react";
// import Image from "next/image";

// interface Campaign {
//   id: number;
//   name: string;
//   created_at: string;
//   status: string;
//   sent_count: number;
//   open_count: number;
//   click_count: number;
//   reply_count: number;
//   bounce_count: number;
//   interested_count: number;
// }

// export default function AllCampaign() {
//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Function to calculate percentage for the progress circle
//   const getPercentage = (value: number, max: number) => (value / max) * 100;

//   useEffect(() => {
//     const fetchCampaigns = async () => {
//       try {
//         const response = await fetch("/api/protected/campaigns", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch campaigns");
//         }

//         const data = await response.json();
//         setCampaigns(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCampaigns();
//   }, []);

//   if (loading) {
//     return <div className="p-6 bg-gray-50 min-h-screen">Loading...</div>;
//   }

//   if (error) {
//     return <div className="p-6 bg-gray-50 min-h-screen">Error: {error}</div>;
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-sans">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-8">
//         <button className="bg-[#5570F1] text-white text-[14px] font-bold px-5 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-600 transition-all duration-300 shadow-sm">
//           <span className="text-[15px] justify-center">+</span> Create Campaign
//         </button>
//         <div className="flex items-center gap-4">
//           <button className="text-[#696A71] flex text-[14px] px-4 py-2 border border-gray-300 rounded-xl items-center gap-2 hover:text-[#5570F1] hover:bg-[#5570F1]/10 transition-colors duration-300 shadow-sm">
//             <span className="text-[15px] justify-center">↓</span> Export statistics
//           </button>
//           <input
//             type="text"
//             placeholder="Search..."
//             className="border border-gray-200 text-gray-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm"
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//         <table className="w-full text-left">
//           <thead>
//             <tr className="bg-gray-50 text-gray-500 text-[12px] font-medium tracking-wide">
//               <th className="p-5">Campaign</th>
//               <th className="p-5">Status</th>
//               <th className="p-5">Sent Email</th>
//               <th className="p-5">Email Opens</th>
//               <th className="p-5">Link Clicked</th>
//               <th className="p-5">Email Replies</th>
//               <th className="p-5">Bounce</th>
//               <th className="p-5">Interested</th>
//               <th className="p-5"></th>
//             </tr>
//           </thead>
//           <tbody>
//             {campaigns.map((campaign) => (
//               <tr key={campaign.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-300">
//                 <td className="p-5 font-semibold text-gray-700">
//                   <div>{campaign.name}</div>
//                   <div className="text-xs text-gray-400">
//                     {new Date(campaign.created_at).toLocaleString("en-US", {
//                       day: "numeric",
//                       month: "short",
//                       year: "numeric",
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </div>
//                 </td>
//                 <td className="p-5">
//                   <span className="inline-block px-2 py-1 rounded-full text-xs font-medium capitalize" 
//                         style={{
//                           backgroundColor: campaign.status === "draft" ? "#E5E7EB" : 
//                                          campaign.status === "sending" ? "#BFDBFE" : 
//                                          campaign.status === "completed" ? "#D1FAE5" : "#E5E7EB",
//                           color: campaign.status === "draft" ? "#4B5563" : 
//                                  campaign.status === "sending" ? "#1E40AF" : 
//                                  campaign.status === "completed" ? "#065F46" : "#4B5563"
//                         }}>
//                     {campaign.status}
//                   </span>
//                 </td>
//                 <td className="p-5">
//                   <div className="relative w-12 h-12">
//                     <div
//                       className="absolute inset-0 rounded-full bg-gray-100 shadow-sm"
//                       style={{
//                         background: `conic-gradient(#8b5cf6 ${getPercentage(campaign.sent_count, 200)}%, #e5e7eb ${getPercentage(campaign.sent_count, 200)}%)`,
//                       }}
//                     ></div>
//                     <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 shadow-inner">
//                       {campaign.sent_count}
//                     </div>
//                   </div>
//                 </td>
//                 <td className="p-5">
//                   <div className="relative w-12 h-12">
//                     <div
//                       className="absolute inset-0 rounded-full bg-gray-100 shadow-sm"
//                       style={{
//                         background: `conic-gradient(#22c55e ${getPercentage(campaign.open_count, 200)}%, #e5e7eb ${getPercentage(campaign.open_count, 200)}%)`,
//                       }}
//                     ></div>
//                     <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 shadow-inner">
//                       {campaign.open_count}
//                     </div>
//                   </div>
//                 </td>
//                 <td className="p-5">
//                   <div className="relative w-12 h-12">
//                     <div
//                       className="absolute inset-0 rounded-full bg-gray-100 shadow-sm"
//                       style={{
//                         background: `conic-gradient(#eab308 ${getPercentage(campaign.click_count, 200)}%, #e5e7eb ${getPercentage(campaign.click_count, 200)}%)`,
//                       }}
//                     ></div>
//                     <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 shadow-inner">
//                       {campaign.click_count}
//                     </div>
//                   </div>
//                 </td>
//                 <td className="p-5">
//                   <div className="relative w-12 h-12">
//                     <div
//                       className="absolute inset-0 rounded-full bg-gray-100 shadow-sm"
//                       style={{
//                         background: `conic-gradient(#3b82f6 ${getPercentage(campaign.reply_count, 200)}%, #e5e7eb ${getPercentage(campaign.reply_count, 200)}%)`,
//                       }}
//                     ></div>
//                     <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 shadow-inner">
//                       {campaign.reply_count}
//                     </div>
//                   </div>
//                 </td>
//                 <td className="p-5">
//                   <div className="relative w-12 h-12">
//                     <div
//                       className="absolute inset-0 rounded-full bg-gray-100 shadow-sm"
//                       style={{
//                         background: `conic-gradient(#ef4444 ${getPercentage(campaign.bounce_count, 200)}%, #e5e7eb ${getPercentage(campaign.bounce_count, 200)}%)`,
//                       }}
//                     ></div>
//                     <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 shadow-inner">
//                       {campaign.bounce_count}
//                     </div>
//                   </div>
//                 </td>
//                 <td className="p-5">
//                   <div className="relative w-12 h-12">
//                     <div
//                       className="absolute inset-0 rounded-full bg-gray-100 shadow-sm"
//                       style={{
//                         background: `conic-gradient(#3b82f6 ${getPercentage(campaign.interested_count, 200)}%, #e5e7eb ${getPercentage(campaign.interested_count, 200)}%)`,
//                       }}
//                     ></div>
//                     <div className="absolute inset-[6px] bg-white rounded-full flex items-center justify-center text-sm font-semibold text-gray-700 shadow-inner">
//                       {campaign.interested_count}
//                     </div>
//                   </div>
//                 </td>
//                 <td className="p-5">
//                   <button className="text-gray-400 hover:text-gray-600 transition-colors duration-300">
//                     ⋮
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }