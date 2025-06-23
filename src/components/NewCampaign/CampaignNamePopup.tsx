// components/NewCampaign/CampaignNamePopup.tsx
"use client";

import { useState } from "react";

interface CampaignNamePopupProps {
  onCreate: (name: string) => void;
  onBack: () => void;
  onClose: () => void;
}

export default function CampaignNamePopup({ onCreate, onBack, onClose }: CampaignNamePopupProps) {
  const [campaignName, setCampaignName] = useState("");

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#53545C]">New Campaign</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="mb-6">
          <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Name
          </label>
          <input
            type="text"
            id="campaignName"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5570F1] focus:border-transparent text-[#53545C]"
            placeholder="Enter campaign name"
          />
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 text-[#5570F1] border border-[#5570F1] rounded-lg hover:bg-blue-50"
          >
            Back
          </button>
          <button
            onClick={() => onCreate(campaignName)}
            disabled={!campaignName.trim()}
            className={`px-6 py-3 rounded-lg ${
              campaignName.trim() 
                ? "bg-[#5570F1] text-white hover:bg-blue-700" 
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  );
}