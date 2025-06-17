'use client';

import React, { useCallback } from 'react';
import { FiSave } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { UserProfile } from './types';

interface NotificationSettingsProps {
  formData: UserProfile;
  setFormData: (value: UserProfile) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ formData, setFormData }) => {
  const handleSave = useCallback(() => {
    toast.success('Notification settings updated');
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h2>
      <div className="space-y-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.receiveUpdates}
            onChange={(e) => setFormData({ ...formData, receiveUpdates: e.target.checked })}
            className="h-4 w-4 text-[#5570F1] border-gray-300 rounded focus:ring-[#5570F1]"
          />
          <span className="text-sm text-gray-600">Receive important updates and news via email</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.receiveMarketing}
            onChange={(e) => setFormData({ ...formData, receiveMarketing: e.target.checked })}
            className="h-4 w-4 text-[#5570F1] border-gray-300 rounded focus:ring-[#5570F1]"
          />
          <span className="text-sm text-gray-600">Receive marketing text messages</span>
        </label>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#5570F1] text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all transform hover:scale-105"
        >
          <FiSave /> Save Preferences
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;








// 'use client';

// import React, { useCallback } from 'react';
// import { FiSave } from 'react-icons/fi';
// import { toast } from 'react-hot-toast';
// import { UserProfile } from './types';

// interface NotificationSettingsProps {
//   formData: UserProfile;
//   setFormData: (value: UserProfile) => void;
// }

// const NotificationSettings: React.FC<NotificationSettingsProps> = ({ formData, setFormData }) => {
//   const handleSave = useCallback(() => {
//     toast.success('Notification settings updated');
//   }, []);

//   return (
//     <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl mt-6">
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h2>
//       <div className="space-y-4">
//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={formData.receiveUpdates}
//             onChange={(e) => setFormData({ ...formData, receiveUpdates: e.target.checked })}
//             className="h-4 w-4 text-[#5570F1] border-gray-300 rounded focus:ring-[#5570F1]"
//           />
//           <span className="text-sm text-gray-600">Receive important updates and news via email</span>
//         </label>
//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={formData.receiveMarketing}
//             onChange={(e) => setFormData({ ...formData, receiveMarketing: e.target.checked })}
//             className="h-4 w-4 text-[#5570F1] border-gray-300 rounded focus:ring-[#5570F1]"
//           />
//           <span className="text-sm text-gray-600">Receive marketing text messages</span>
//         </label>
//         <button
//           onClick={handleSave}
//           className="px-4 py-2 bg-[#5570F1] text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all transform hover:scale-105"
//         >
//           <FiSave /> Save Preferences
//         </button>
//       </div>
//     </div>
//   );
// };

// export default NotificationSettings;