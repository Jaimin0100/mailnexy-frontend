// components/NewCampaign/NewCampaignPopup.tsx
"use client";

import { useState } from "react";

interface NewCampaignPopupProps {
  onSelect: (option: "create" | "open" | "templates") => void;
  onClose: () => void;
}

export default function NewCampaignPopup({ onSelect, onClose }: NewCampaignPopupProps) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#53545C]">Create New Campaign</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => onSelect("create")}
            className="w-full py-4 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-3"
          >
            <span className="bg-white p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5570F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
            <span className="font-medium">Create from Scratch</span>
          </button>
          
          <button
            onClick={() => onSelect("open")}
            className="w-full py-4 bg-white border border-[#5570F1] text-[#5570F1] rounded-lg hover:bg-blue-50 flex items-center justify-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-medium">Open Existing Campaign</span>
          </button>
          
          <button
            onClick={() => onSelect("templates")}
            className="w-full py-4 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed flex items-center justify-center gap-3"
            disabled
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <span className="font-medium">Use Templates (Coming Soon)</span>
          </button>
        </div>
      </div>
    </div>
  );
}