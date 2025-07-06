"use client";

export default function SchedulesModal({
  onClose,
  onNewSchedule,
  onApply
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#53545C]">Schedules</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Choose a schedule for your campaign.
        </p>
        <div className="flex justify-center mb-4">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
            <circle cx="12" cy="16" r="1" fill="currentColor" />
          </svg>
        </div>
        <p className="text-center text-[#53545C] mb-4">
          No schedules yet
        </p>
        <p className="text-center text-sm text-gray-600 mb-6">
          Create schedules consistent with your recipient's working hours to increase your email engagement and emulate realistic sending behavior.
        </p>
        <div className="flex justify-between">
          <button
            onClick={onNewSchedule}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#53545C] hover:bg-gray-100"
          >
            + New schedule
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[#53545C] hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}