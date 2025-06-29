"use client";

import { useState, useEffect } from "react";
import Stepper from "@/components/NewCampaign/Stepper";
import WorkflowCanvas from "@/components/NewCampaign/WorkflowCanvas";
import NodeSidebar from "@/components/NewCampaign/NodeSidebar";
import SendingOptions from "@/components/NewCampaign/SendingOptions";
import ProspectsStep from "@/components/NewCampaign/ProspectsStep";
import NewCampaignPopup from "@/components/NewCampaign/NewCampaignPopup";
import CampaignNamePopup from "@/components/NewCampaign/CampaignNamePopup";
import OpenCampaignPopup from "@/components/NewCampaign/OpenCampaignPopup";
import { campaignAPI } from "@/utils/api";

export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPopup, setShowPopup] = useState(true);
  const [popupMode, setPopupMode] = useState<"main" | "create" | "open" | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState("");

  // Fetch campaigns when opening existing
  useEffect(() => {
    if (popupMode === "open" && campaigns.length === 0) {
      fetchCampaigns();
    }
  }, [popupMode]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const response = await campaignAPI.getCampaigns();
      setCampaigns(response.data || []);
    } catch (error) {
      console.error("Failed to fetch campaigns", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCampaign = (name: string) => {
    setNewCampaignName(name); // NEW: Only store name
    setShowPopup(false);
    setSelectedCampaign({
      // NEW: Create temporary local campaign
      id: "draft-" + Date.now(),
      name,
      status: "draft",
      flow: {
        nodes: [/*...*/],
        edges: []
      }
    });
  }

  // const handleCreateCampaign = async (name: string) => {
  //   try {
  //     const response = await campaignAPI.createCampaign({
  //       name,
  //       description: "", // Add empty description
  //       lead_list_ids: [], // Add empty array for lead lists
  //       status: "draft",
  //       flow: {
  //         nodes: [
  //           {
  //             id: "1",
  //             type: "custom",
  //             position: { x: 250, y: 5 },
  //             data: { label: "Start", 
  //                     type: "start",
  //                     subject: "",
  //                     body: "",
  //                     templateID: null,
  //                     conditionType: "",
  //                     matchValue: "",
  //                     delayAmount: 0,
  //                     delayUnit: "",
  //                     goalType: "" },
  //           }
  //         ],
  //         edges: []
  //       },
  //     });
  //     if (response.status >= 400) {
  //       console.error("Backend error:", response.data);
  //       alert(`Error: ${response.data.error || 'Failed to create campaign'}`);
  //       return;
  //     }
  //     setSelectedCampaign(response.data.campaign);
  //     setShowPopup(false);
  //   } catch (error) {
  //     console.error("Failed to create campaign", error);
  //     if (error.response) {
  //       alert(`Error: ${error.response.data.error || error.message}`);
  //     } else {
  //       alert("Failed to create campaign. Please check console for details.");
  //     }
  //   }
  // };

  return (
    <div className="min-h-screen pt-4 bg-[#F5F7FA] flex flex-col">

      {/* Popup Modals */}
      {showPopup && popupMode === null && (
        <NewCampaignPopup
          onSelect={(option) => setPopupMode(option)}
          onClose={() => setShowPopup(false)}
        />
      )}

      {showPopup && popupMode === "create" && (
        <CampaignNamePopup
          onCreate={handleCreateCampaign}
          onBack={() => setPopupMode(null)}
          onClose={() => setShowPopup(false)}
        />
      )}

      {showPopup && popupMode === "open" && (
        <OpenCampaignPopup
          campaigns={campaigns}
          isLoading={isLoading}
          onSelect={(campaign) => {
            setSelectedCampaign(campaign);
            setShowPopup(false);
          }}
          onBack={() => setPopupMode(null)}
          onClose={() => setShowPopup(false)}
        />
      )}

      {/* Main Content (only shown when campaign is selected) */}
      {selectedCampaign && (
        <>
          {/* Header with Stepper */}
          <header className="bg-white p-4 border-b border-gray-200 flex justify-center">
            <Stepper currentStep={currentStep} setCurrentStep={setCurrentStep} />
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {/* Step 1: Sequence (Workflow Canvas) */}
            {currentStep === 1 && (
              <div className="flex relative">
                <div className="flex-1">
                  <WorkflowCanvas campaignId={selectedCampaign.id} campaign={selectedCampaign} campaignName={newCampaignName} onSaveSuccess={(savedCampaign) => { setSelectedCampaign(savedCampaign); }}/>
                </div>
                <div className="ml-4">
                  <NodeSidebar />
                </div>
              </div>
            )}

            {/* Step 2: Prospects */}
            {currentStep === 2 && (
              <ProspectsStep
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {/* Step 3: Sending Options */}
            {currentStep === 3 && (
              <SendingOptions
                onNext={() => setCurrentStep(4)}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {/* Step 4: Review (To be implemented) */}
            {currentStep === 4 && (
              <div className="p-4 h-full">
                <h1 className="text-2xl font-bold text-[#53545C]">Review Campaign</h1>
                <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200">
                  <p>Review content will go here</p>
                </div>
              </div>
            )}
          </main>

          {/* Footer with Navigation Buttons */}
          <footer className="bg-white p-4 border-t border-gray-200 flex justify-between">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700 gap-2 flex"
                >
                  Back
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 flex items-center justify-center border border-gray-200 hover:bg-gray-100 rounded-lg text-[#53545C] gap-2">
                <img src="/save.svg" alt="Save" className="w-5 h-5" />
                Save
              </button>

              {currentStep < 4 && (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700 gap-2 flex"
                >
                  Next
                </button>
              )}
            </div>
          </footer>
        </>
      )}
    </div>
  );
}