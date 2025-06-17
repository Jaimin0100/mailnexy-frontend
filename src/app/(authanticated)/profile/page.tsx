'use client';

import React, { useState } from 'react';
import TabbedProfile from '@/components/profile/TabbedProfile';
import CardProfile from '@/components/profile/CardProfile';
import { UserProfile } from '@/components/profile/types';

const ProfilePage: React.FC = () => {
  const [designVariation, setDesignVariation] = useState<'tabbed' | 'card'>('tabbed');

  const profile: UserProfile = {
    firstName: 'John',
    lastName: 'Doe',
    companyName: 'Acme Corp',
    companySize: '51-200',
    location: 'New York, NY',
    timezone: 'America/New_York',
    currency: 'USD',
    phoneNumber: '+1-555-123-4567',
    email: 'john.doe@example.com',
    plan: 'Pro',
    avatar: '/profilepic.png',
    receiveUpdates: true,
    receiveMarketing: false,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#53545C]">Profile Settings</h1>
          <select
            value={designVariation}
            onChange={(e) => setDesignVariation(e.target.value as 'tabbed' | 'card')}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5570F1] bg-white shadow-sm"
          >
            <option value="tabbed">Tabbed Layout</option>
            {/* <option value="card">Card Layout</option> */}
          </select>
        </div>
        {designVariation === 'tabbed' ? (
          <TabbedProfile profile={profile} />
        ) : (
          <CardProfile profile={profile} />
        )}
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;







// 'use client';

// import React, { useState } from 'react';
// import TabbedProfile from '@/components/profile/TabbedProfile';
// import CardProfile from '@/components/profile/CardProfile';
// import { UserProfile } from '@/components/profile/types';

// const ProfilePage: React.FC = () => {
//   const [designVariation, setDesignVariation] = useState<'tabbed' | 'card'>('tabbed');

//   const profile: UserProfile = {
//     firstName: 'John',
//     lastName: 'Doe',
//     companyName: 'Acme Corp',
//     companySize: '51-200',
//     location: 'New York, NY',
//     timezone: 'America/New_York',
//     currency: 'USD',
//     phoneNumber: '+1-555-123-4567',
//     email: 'john.doe@example.com',
//     plan: 'Pro',
//     avatar: '/profilepic.png',
//     receiveUpdates: true,
//     receiveMarketing: false,
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 pt-20 font-sans">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-semibold text-[#53545C]">Profile Settings</h1>
//           <select
//             value={designVariation}
//             onChange={(e) => setDesignVariation(e.target.value as 'tabbed' | 'card')}
//             className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5570F1] bg-white shadow-sm"
//           >
//             <option value="tabbed">Tabbed Layout</option>
//             <option value="card">Card Layout</option>
//           </select>
//         </div>
//         {designVariation === 'tabbed' ? (
//           <TabbedProfile profile={profile} />
//         ) : (
//           <CardProfile profile={profile} />
//         )}
//       </div>
//       <style jsx global>{`
//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes slide-up {
//           from { transform: translateY(20px); opacity: 0; }
//           to { transform: translateY(0); opacity: 1; }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }
//         .animate-slide-up {
//           animation: slide-up 0.3s ease-out;
//         }
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ProfilePage;