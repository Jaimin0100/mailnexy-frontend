'use client';

import React from 'react';
import { FiUsers } from 'react-icons/fi';

const TeamPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#53545C] mb-6">Team Management</h1>
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Team Management</h2>
          <div className="space-y-4">
            <p className="text-gray-600">Invite and manage team members for collaboration.</p>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter team member's email"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5570F1] text-gray-700"
              />
              <button
                className="px-4 py-2 bg-[#5570F1] text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all transform hover:scale-105"
              >
                <FiUsers /> Invite Member
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;











// 'use client';

// import React from 'react';
// import { FiUsers } from 'react-icons/fi';

// const TeamPage: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 pt-20 font-sans">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-2xl font-semibold text-[#53545C] mb-6">Team Management</h1>
//         <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Team Management</h2>
//           <div className="space-y-4">
//             <p className="text-gray-600">Invite and manage team members for collaboration.</p>
//             <div className="flex gap-4">
//               <input
//                 type="email"
//                 placeholder="Enter team member's email"
//                 className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5570F1] text-gray-700"
//               />
//               <button
//                 className="px-4 py-2 bg-[#5570F1] text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all transform hover:scale-105"
//               >
//                 <FiUsers /> Invite Member
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeamPage;