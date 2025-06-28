'use client';

import React, { useState } from 'react';
import { FiKey, FiUsers, FiLock, FiCreditCard, FiList } from 'react-icons/fi';
import PersonalInfoForm from './PersonalInfoForm';
import NotificationSettings from './NotificationSettings';
import SecuritySettings from './SecuritySettings';
import BillingSettings from './BillingSettings';
import TransactionHistory from './TransactionHistory';
import { UserProfile } from './types';

interface CardProfileProps {
  profile: UserProfile;
}

const CardProfile: React.FC<CardProfileProps> = ({ profile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);

  const cards = [
    {
      title: 'Personal Information',
      icon: <FiUsers className="text-[#5570F1] w-6 h-6" />,
      content: (
        <PersonalInfoForm
          profile={profile}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          formData={formData}
          setFormData={setFormData}
        />
      ),
    },
    {
      title: 'Notification Preferences',
      icon: <FiUsers className="text-[#5570F1] w-6 h-6" />,
      content: <NotificationSettings formData={formData} setFormData={setFormData} />,
    },
    {
      title: 'Security Settings',
      icon: <FiLock className="text-[#5570F1] w-6 h-6" />,
      content: <SecuritySettings />,
    },
    {
      title: 'API Settings',
      icon: <FiKey className="text-[#5570F1] w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">Generate and manage your API keys for integrations.</p>
          <button
            className="px-4 py-2 bg-[#5570F1] text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all transform hover:scale-105"
          >
            <FiKey /> Generate New API Key
          </button>
        </div>
      ),
    },
    {
      title: 'Team Management',
      icon: <FiUsers className="text-[#5570F1] w-6 h-6" />,
      content: (
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
      ),
    },
    {
      title: 'Billing Information',
      icon: <FiCreditCard className="text-[#5570F1] w-6 h-6" />,
      content: <BillingSettings />,
    },
    {
      title: 'Transaction History',
      icon: <FiList className="text-[#5570F1] w-6 h-6" />,
      content: <TransactionHistory />,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 animate-slide-up transition-all duration-300 hover:shadow-xl"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center gap-4 mb-4">
            {card.icon}
            <h2 className="text-lg font-semibold text-gray-800">{card.title}</h2>
          </div>
          {card.content}
        </div>
      ))}
    </div>
  );
};

export default CardProfile;