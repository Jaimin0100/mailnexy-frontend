'use client';

import React, { useState } from 'react';
import { FiKey, FiUsers } from 'react-icons/fi';
import PersonalInfoForm from './PersonalInfoForm';
import NotificationSettings from './NotificationSettings';
import SecuritySettings from './SecuritySettings';
import BillingSettings from './BillingSettings';
import TransactionHistory from './TransactionHistory';
import { UserProfile } from './types';
import { useRouter } from 'next/navigation';

interface TabbedProfileProps {
  profile: UserProfile;
}

const TabbedProfile: React.FC<TabbedProfileProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const router = useRouter();

  const tabs = [
    {
      name: 'Profile',
      content: (
        <>
          <PersonalInfoForm
            profile={profile}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            formData={formData}
            setFormData={setFormData}
          />
          <NotificationSettings formData={formData} setFormData={setFormData} />
        </>
      ),
      path: '/profile',
    },
    {
      name: 'Security',
      content: <SecuritySettings />,
      path: '/profile/security',
    },
    {
      name: 'API',
      content: (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">API Settings</h2>
          <div className="space-y-4">
            <p className="text-gray-600">Generate and manage your API keys for integrations.</p>
            <button
              className="px-4 py-2 bg-[#5570F1] text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all transform hover:scale-105"
            >
              <FiKey /> Generate New API Key
            </button>
          </div>
        </div>
      ),
      path: '/profile/api',
    },
    {
      name: 'My Team',
      content: (
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
      ),
      path: '/profile/myteam',
    },
    { name: 'Billing', content: <BillingSettings />, path: '/profile/billing' },
    { name: 'Transactions', content: <TransactionHistory />, path: '/profile/transactions' },
  ];

  const handleTabClick = (tab: { name: string; path: string }) => {
    setActiveTab(tab.name);
    router.push(tab.path);
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide bg-white rounded-t-xl shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleTabClick(tab)}
            className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.name
                ? 'text-[#5570F1] border-b-2 border-[#5570F1] bg-[#5570F1]/5'
                : 'text-gray-600 hover:text-[#5570F1] hover:bg-gray-50'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className="animate-fade-in">{tabs.find((tab) => tab.name === activeTab)?.content}</div>
    </div>
  );
};

export default TabbedProfile;