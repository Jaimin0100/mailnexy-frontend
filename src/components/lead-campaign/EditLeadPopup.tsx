import { FiX } from 'react-icons/fi';

type EditLeadPopupProps = {
  editLead: any;
  setEditLead: (lead: any) => void;
  handleUpdateLead: (e: React.FormEvent) => void;
  setIsEditPopupOpen: (open: boolean) => void;
};

export default function EditLeadPopup({
  editLead,
  setEditLead,
  handleUpdateLead,
  setIsEditPopupOpen
}: EditLeadPopupProps) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsEditPopupOpen(false)}>
      <div
        className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#53545C]">Edit Lead</h2>
          <button
            onClick={() => setIsEditPopupOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleUpdateLead} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
                value={editLead.firstName}
                onChange={(e) => setEditLead({...editLead, firstName: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
                value={editLead.lastName}
                onChange={(e) => setEditLead({...editLead, lastName: e.target.value})}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
              value={editLead.email}
              onChange={(e) => setEditLead({...editLead, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
              value={editLead.company}
              onChange={(e) => setEditLead({...editLead, company: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
              value={editLead.position}
              onChange={(e) => setEditLead({...editLead, position: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
              value={editLead.location}
              onChange={(e) => setEditLead({...editLead, location: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
              value={editLead.tags}
              onChange={(e) => setEditLead({...editLead, tags: e.target.value})}
              placeholder="Comma separated tags"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditPopupOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700"
            >
              Update Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}