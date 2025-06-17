'use client';

import React from 'react';
import SecuritySettings from '@/components/profile/SecuritySettings';

const SecurityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#53545C] mb-6">Security Settings</h1>
        <SecuritySettings />
      </div>
    </div>
  );
};

export default SecurityPage;









// 'use client';

// import React from 'react';
// import SecuritySettings from '@/components/profile/SecuritySettings';

// const SecurityPage: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 pt-20 font-sans">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-2xl font-semibold text-[#53545C] mb-6">Security Settings</h1>
//         <SecuritySettings />
//       </div>
//     </div>
//   );
// };

// export default SecurityPage;