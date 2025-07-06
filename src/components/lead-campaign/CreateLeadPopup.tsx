import { FiX } from 'react-icons/fi';
import { useEffect } from 'react'; // Add this import

type CreateLeadPopupProps = {
  newLead: any;
  setNewLead: (lead: any) => void;
  leadLists: { id: number; name: string }[];
  handleCreateLead: (e: React.FormEvent) => void;
  setIsCreatePopupOpen: (open: boolean) => void;
  currentListId: number | null; // Add this prop
};

export default function CreateLeadPopup({
  newLead,
  setNewLead,
  leadLists,
  handleCreateLead,
  setIsCreatePopupOpen,
  currentListId // Add this prop
}: CreateLeadPopupProps) {
  // Add useEffect to pre-select the current list
  useEffect(() => {
    if (currentListId) {
      setNewLead(prev => ({
        ...prev,
        listIds: [currentListId]
      }));
    }
  }, [currentListId, setNewLead]);
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsCreatePopupOpen(false)}>
      <div
        className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#53545C]">Create New Lead</h2>
          <button
            onClick={() => setIsCreatePopupOpen(false)}
            className="text-red-500 hover:text-red-700"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleCreateLead} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
                value={newLead.firstName || ''}
                onChange={(e) => setNewLead({ ...newLead, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
                value={newLead.lastName || ''}
                onChange={(e) => setNewLead({ ...newLead, lastName: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
              value={newLead.email || ''}
              onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
              value={newLead.company || ''}
              onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
              value={newLead.position || ''}
              onChange={(e) => setNewLead({ ...newLead, position: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
              value={newLead.location || ''}
              onChange={(e) => setNewLead({ ...newLead, location: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
              value={newLead.tags || ''}
              onChange={(e) => setNewLead({ ...newLead, tags: e.target.value })}
              placeholder="Comma separated tags"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lead Lists</label>
            <select
              multiple
              className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
              value={(newLead.listIds || []).map((id: number) => id.toString())}
              onChange={(e) => {
                const selectedIds = Array.from(e.target.selectedOptions, option =>{
                  const value = parseInt(option.value);
                  return isNaN(value) ? 0 : value;
                }).filter(id => id > 0);
                setNewLead({ ...newLead, listIds: selectedIds });
              }}
            >
              {leadLists.filter(list => list?.id).map(list => (
                <option
                  key={list.id}
                  value={list.id.toString()}
                  // selected={currentListId === list.id} // Pre-select current list
                >
                  {list.name|| 'Unnamed List'}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple lists</p>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsCreatePopupOpen(false)}
              className="px-4 py-2 text-white bg-red-500 border border-gray-300 rounded-lg hover:bg-red-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700"
            >
              Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}









// import { FiX } from 'react-icons/fi';

// type CreateLeadPopupProps = {
//   newLead: any;
//   setNewLead: (lead: any) => void;
//   leadLists: { id: number; name: string }[];
//   handleCreateLead: (e: React.FormEvent) => void;
//   setIsCreatePopupOpen: (open: boolean) => void;
// };

// export default function CreateLeadPopup({
//   newLead,
//   setNewLead,
//   leadLists,
//   handleCreateLead,
//   setIsCreatePopupOpen
// }: CreateLeadPopupProps) {
//   return (
//     <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsCreatePopupOpen(false)}>
//       <div
//         className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg w-full max-w-md"
//         onClick={e => e.stopPropagation()}
//       >
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-[#53545C]">Create New Lead</h2>
//           <button
//             onClick={() => setIsCreatePopupOpen(false)}
//             className="text-red-500 hover:text-red-700"
//           >
//             <FiX className="h-6 w-6" />
//           </button> 
//         </div>
//         <form onSubmit={handleCreateLead} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                 value={newLead.firstName}
//                 onChange={(e) => setNewLead({...newLead, firstName: e.target.value})}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//               <input
//                 type="text"
//                 className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//                 value={newLead.lastName}
//                 onChange={(e) => setNewLead({...newLead, lastName: e.target.value})}
//                 required
//               />
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//               value={newLead.email}
//               onChange={(e) => setNewLead({...newLead, email: e.target.value})}
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
//             <input
//               type="text"
//               className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//               value={newLead.company}
//               onChange={(e) => setNewLead({...newLead, company: e.target.value})}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
//             <input
//               type="text"
//               className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//               value={newLead.position}
//               onChange={(e) => setNewLead({...newLead, position: e.target.value})}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//             <input
//               type="text"
//               className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//               value={newLead.location}
//               onChange={(e) => setNewLead({...newLead, location: e.target.value})}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
//             <input
//               type="text"
//               className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//               value={newLead.tags}
//               onChange={(e) => setNewLead({...newLead, tags: e.target.value})}
//               placeholder="Comma separated tags"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Lead Lists</label>
//             <select
//               multiple
//               className="w-full p-2 border border-gray-300 rounded-lg text-gray-500"
//               value={newLead.listIds.map((id: number) => id.toString())|| []}
//               onChange={(e) => {
//                 const selectedIds = Array.from(e.target.selectedOptions, option => parseInt(option.value));
//                 setNewLead({...newLead, listIds: selectedIds || [] });
//               }}
//             >
//               {leadLists.map(list => (
//                 <option key={list.id} value={list.id.toString()}>{list.name}</option>
//               ))}
//             </select>
//             <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple lists</p>
//           </div>
//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={() => setIsCreatePopupOpen(false)}
//               className="px-4 py-2 text-white bg-red-500 border border-gray-300 rounded-lg hover:bg-red-700"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700"
//             >
//               Create Lead
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }