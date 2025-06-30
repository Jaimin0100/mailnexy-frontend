// components/NewCampaign/OpenCampaignPopup.tsx
"use client";

interface OpenCampaignPopupProps {
  campaigns: any[];
  isLoading: boolean;
  onSelect: (campaign: any) => void;
  onBack: () => void;
  onClose: () => void;
}

export default function OpenCampaignPopup({ 
  campaigns, 
  isLoading, 
  onSelect, 
  onBack, 
  onClose 
}: OpenCampaignPopupProps) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[80vh] flex flex-col border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#53545C]">Open Campaign</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto mb-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5570F1]"></div>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-4">No campaigns found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <div 
                  key={campaign.id}
                  onClick={() => onSelect(campaign)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-[#5570F1] cursor-pointer transition-colors"
                >
                  <h3 className="font-medium text-[#53545C]">{campaign.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Created: {new Date(campaign.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 text-[#5570F1] border border-[#5570F1] rounded-lg hover:bg-blue-50"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}