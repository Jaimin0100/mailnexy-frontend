import { FiX, FiClock } from 'react-icons/fi';

type VerifyEmailsPopupProps = {
  selectedLeads: Set<string>;
  verifySelectedLeads: () => void;
  setIsVerifyPopupOpen: (open: boolean) => void;
};

export default function VerifyEmailsPopup({
  selectedLeads,
  verifySelectedLeads,
  setIsVerifyPopupOpen
}: VerifyEmailsPopupProps) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsVerifyPopupOpen(false)}>
      <div
        className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#53545C]">Verify Email Addresses</h2>
          <button
            onClick={() => setIsVerifyPopupOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            You are about to verify {selectedLeads.size} email addresses. 
            This process may take a few moments.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <FiClock className="text-yellow-500 mr-2 mt-0.5" />
              <p className="text-yellow-700 text-sm">
                Email verification checks if an email address exists and can receive emails.
                This helps improve your email deliverability.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsVerifyPopupOpen(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={verifySelectedLeads}
            disabled={selectedLeads.size === 0}
            className={`px-4 py-2 text-white rounded-lg ${selectedLeads.size > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Verify Emails
          </button>
        </div>
      </div>
    </div>
  );
}