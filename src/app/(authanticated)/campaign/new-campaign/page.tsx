'use client';

import { useState } from 'react';
import Stepper from '@/components/NewCampaign/Stepper';
import NodeSidebar from '@/components/NewCampaign/NodeSidebar';
import WorkflowCanvas from '@/components/NewCampaign/WorkflowCanvas';

export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      {/* Stepper for multi-step navigation */}
      <Stepper currentStep={currentStep} setCurrentStep={setCurrentStep} />

      {/* Step 1: Sequence (Workflow Canvas) */}
      {currentStep === 1 && (
        <div className="flex">
          <NodeSidebar />
          <WorkflowCanvas />
        </div>
      )}

      {/* Placeholder for other steps */}
      {currentStep === 2 && <div className="p-4">Prospects Step (To be implemented)</div>}
      {currentStep === 3 && <div className="p-4">Sending Options Step (To be implemented)</div>}
      {currentStep === 4 && <div className="p-4">Review Step (To be implemented)</div>}

      {/* Navigation Buttons */}
      <div className="flex justify-end space-x-2 mt-4">
        <button className="p-2 bg-gray-200 rounded">Save</button>
        <button
          onClick={() => setCurrentStep(currentStep + 1)}
          className="p-2 bg-blue-500 text-white rounded"
          disabled={currentStep === 4}
        >
          Next
        </button>
      </div>
    </div>
  );
}