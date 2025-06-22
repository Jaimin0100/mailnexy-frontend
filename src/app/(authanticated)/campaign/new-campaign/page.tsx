"use client";

import { useState } from "react";
import Image from "next/image";
import Stepper from "@/components/NewCampaign/Stepper";
import NodeSidebar from "@/components/NewCampaign/NodeSidebar";
import WorkflowCanvas from "@/components/NewCampaign/WorkflowCanvas";
import SendingOptions from "@/components/NewCampaign/SendingOptions";

export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(1);  

  return (
    <div className="min-h-screen pt-4 bg-[#F5F7FA] flex flex-col">
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
              <WorkflowCanvas />
            </div>
            <div className="ml-4">
              <NodeSidebar />
            </div>
          </div>
        )}

        {/* Step 2: Prospects */}
        {currentStep === 2 && (
          <div className="p-2">
            <div><h1 className="text-2xl font-bold text-[#53545C] pt-[-4]">Prospect List</h1></div>
            <div className="flex space-x-4 mb-4">
              <button className="px-4 py-2 bg-[#5570F1] text-white rounded-lg flex items-center justify-center gap-2"><Image width={20} height={20} src="/AddProspect.svg" alt="Empty Prospect List" className="mx-auto" />Add Prospects</button>
              <button className="px-4 py-2 bg-white text-[#53545C] border border-gray-200 rounded-lg flex items-center justify-center gap-2"><Image width={20} height={20} src="/listvarify.svg" alt="Empty Prospect List" className="mx-auto" />Verify Emails</button>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <table className="w-full mb-4 text-sm gap-20">
                <div className="border-b border-gray-200 space-y-2">
                  <thead>
                    <tr>
                      <th className="text-left p-2 text-[#53545C]">Prospects(0)</th>
                      <th className="text-left p-2 text-[#53545C]">Email</th>
                      <th className="text-left p-2 text-[#53545C]">First Name</th>
                      <th className="text-left p-2 text-[#53545C]">Last Name</th>
                      <th className="text-left p-2 text-[#53545C]">Company</th>
                      <th className="text-left p-2 text-[#53545C]">Position</th>
                    </tr>
                  </thead>
                </div>
                <tbody>
                  <tr>
                    <td colSpan="6" className="p-4 text-[#53545C]">
                      <Image width={300} height={300} src="/leads.png" alt="Empty Prospect List" className="mx-auto" />
                      <p className="text-[#53545C] mt-4">This Prospect List is empty</p>
                      <p className="text-[#53545C]">Explore millions of leads in our database or upload yours</p>
                      <div className="mt-4 space-x-4 flex justify-center">
                        <button className="px-4 py-2 bg-[#5570F1] text-white rounded-lg gap-2 flex items-center"><Image width={20} height={20} src="/AddProspect.svg" alt="Empty Prospect List" className="mx-auto" />Add Prospects</button>
                        <button className="px-4 py-2 bg-white text-[#53545C] border border-gray-200 rounded-lg gap-2 flex items-center"><Image width={20} height={20} src="/uploadlist.svg" alt="Empty Prospect List" className="mx-auto" />Upload List</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Step 3: Sending Options */}
        {currentStep === 3 && <div className="p-4  h-full"> <SendingOptions /></div>}
        {currentStep === 4 && <div className="p-4">Review Step (To be implemented)</div>}
      </main>

      {/* Footer with Navigation Buttons */}
      <footer className="bg-white p-4 border-t border-gray-200 flex justify-end space-x-2">
        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-4 py-2 bg-[#5570F1] text-white rounded-lg"
          >
            Back
          </button>
        )}
        <button className="w-20 h-10 flex items-center justify-center bg-gray-200 rounded-lg text-[#53545C] p-2">
          <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /> 
          </svg> Save
        </button>
        {currentStep < 4 && (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="px-4 py-2 bg-[#5570F1] text-white rounded-lg"
          >
            Next
          </button>
        )}
      </footer>
    </div>
  );
}







// 'use client';

// import { useState } from 'react';
// import Stepper from '@/components/NewCampaign/Stepper';
// import NodeSidebar from '@/components/NewCampaign/NodeSidebar';
// import WorkflowCanvas from '@/components/NewCampaign/WorkflowCanvas';
// import ProspectList from '@/components/NewCampaign/ProspectList';

// export default function CreateCampaignPage() {
//   const [currentStep, setCurrentStep] = useState(1);

//   return (
//     <div className="min-h-screen pt-4 bg-[#F5F7FA] flex flex-col">
//       {/* Header with Stepper */}
//       <header className="bg-white p-4 border-b border-gray-200 flex justify-center">
//         <Stepper currentStep={currentStep} setCurrentStep={setCurrentStep} />
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         {/* Step 1: Sequence (Workflow Canvas) */}
//         {currentStep === 1 && (
//           <div className="flex relative">
//             <div className="flex-1">
//               <WorkflowCanvas />
//             </div>
//             <div className="ml-4">
//               <NodeSidebar />
//             </div>
//           </div>
//         )}

//         {/* Placeholder for other steps */}
//         {currentStep === 2 && <ProspectList />}
//         {currentStep === 3 && <div className="p-4">Sending Options Step (To be implemented)</div>}
//         {currentStep === 4 && <div className="p-4">Review Step (To be implemented)</div>}
//       </main>

//       {/* Footer with Navigation Buttons */}
//       <footer className="bg-white p-4 border-t border-gray-200 flex justify-end space-x-2">
//         {currentStep > 1 && (
//           <button
//             onClick={() => setCurrentStep(currentStep - 1)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-full"
//           >
//             Back
//           </button>
//         )}
//         <button className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full">
//           <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
//           </svg>
//         </button>
//         {currentStep < 4 && (
//           <button
//             onClick={() => setCurrentStep(currentStep + 1)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-full"
//           >
//             Next
//           </button>
//         )}
//       </footer>
//     </div>
//   );
// }








// 'use client';

// import { useState } from 'react';
// import Stepper from '@/components/NewCampaign/Stepper';
// import NodeSidebar from '@/components/NewCampaign/NodeSidebar';
// import WorkflowCanvas from '@/components/NewCampaign/WorkflowCanvas';

// export default function CreateCampaignPage() {
//   const [currentStep, setCurrentStep] = useState(1);

//   return (
//     <div className="p-4 min-h-screen bg-gray-100">
//       {/* Stepper for multi-step navigation */}
//       <Stepper currentStep={currentStep} setCurrentStep={setCurrentStep} />

//       {/* Step 1: Sequence (Workflow Canvas) */}
//       {currentStep === 1 && (
//         <div className="flex">
//           <NodeSidebar />
//           <WorkflowCanvas />
//         </div>
//       )}

//       {/* Placeholder for other steps */}
//       {currentStep === 2 && <div className="p-4">Prospects Step (To be implemented)</div>}
//       {currentStep === 3 && <div className="p-4">Sending Options Step (To be implemented)</div>}
//       {currentStep === 4 && <div className="p-4">Review Step (To be implemented)</div>}

//       {/* Navigation Buttons */}
//       <div className="flex justify-end space-x-2 mt-4">
//         <button className="p-2 bg-gray-200 rounded">Save</button>
//         <button
//           onClick={() => setCurrentStep(currentStep + 1)}
//           className="p-2 bg-blue-500 text-white rounded"
//           disabled={currentStep === 4}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }