'use client';

interface StepperProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export default function Stepper({ currentStep, setCurrentStep }: StepperProps) {
  const steps = ['Sequence', 'Prospects', 'Sending Options', 'Review'];

  return (
    <div className="flex items-center space-x-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <button
            onClick={() => setCurrentStep(index + 1)}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium ${
              currentStep === index + 1 ? 'bg-[#34C759] text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {index + 1}
          </button>
          <span className={`ml-2 text-sm ${currentStep === index + 1 ? 'text-gray-800' : 'text-gray-500'}`}>
            {step}
          </span>
          {index < steps.length - 1 && (
            <div className="w-8 h-px border-t-2 border-dashed border-gray-300 mx-2"></div>
          )}
        </div>
      ))}
    </div>
  );
}










// 'use client';

// interface StepperProps {
//   currentStep: number;
//   setCurrentStep: (step: number) => void;
// }

// export default function Stepper({ currentStep, setCurrentStep }: StepperProps) {
//   const steps = ['Sequence', 'Prospects', 'Sending Options', 'Review'];

//   return (
//     <div className="flex space-x-4 mb-4">
//       {steps.map((step, index) => (
//         <button
//           key={index}
//           onClick={() => setCurrentStep(index + 1)}
//           className={`p-2 rounded ${
//             currentStep === index + 1 ? 'bg-green-500 text-white' : 'bg-gray-200'
//           }`}
//         >
//           {index + 1} {step}
//         </button>
//       ))}
//     </div>
//   );
// }