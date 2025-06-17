'use client';

interface StepperProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export default function Stepper({ currentStep, setCurrentStep }: StepperProps) {
  const steps = ['Sequence', 'Prospects', 'Sending Options', 'Review'];

  return (
    <div className="flex space-x-4 mb-4">
      {steps.map((step, index) => (
        <button
          key={index}
          onClick={() => setCurrentStep(index + 1)}
          className={`p-2 rounded ${
            currentStep === index + 1 ? 'bg-green-500 text-white' : 'bg-gray-200'
          }`}
        >
          {index + 1} {step}
        </button>
      ))}
    </div>
  );
}