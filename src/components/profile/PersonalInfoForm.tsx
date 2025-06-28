'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import { FiEdit2, FiSave } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { UserProfile } from './types';

interface PersonalInfoFormProps {
  profile: UserProfile;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  formData: UserProfile;
  setFormData: (value: UserProfile) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  profile,
  isEditing,
  setIsEditing,
  formData,
  setFormData,
}) => {
  const handleSave = useCallback(() => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Profile updated successfully');
    setIsEditing(false);
  }, [formData, setIsEditing]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-[#5570F1] text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all transform hover:scale-105"
            aria-label="Edit Profile"
          >
            <FiEdit2 /> Edit
          </button>
        )}
      </div>
      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">First Name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5570F1] text-gray-700"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5570F1] text-gray-700"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Company Name</label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5570F1] text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Company Size</label>
            <select
              value={formData.companySize}
              onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
              className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5570F1] text-gray-700"
            >
              <option value="">Select Size</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201+">201+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5570F1] text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Timezone</label>
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5570F1] text-gray-700"
            >
              <option value="">Select Timezone</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Asia/Kolkata">Asia/Kolkata</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5570F1] text-gray-700"
            >
              <option value="">Select Currency</option>
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5570F1] text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full mt-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5570F1] text-gray-700"
              required
            />
          </div>
          <div className="md:col-span-2 flex gap-4 mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#5570F1] text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all transform hover:scale-105"
            >
              <FiSave /> Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Image
              src={profile.avatar || '/profilepic.png'}
              alt="Profile"
              width={64}
              height={64}
              className="rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <p className="text-sm font-medium text-gray-600">Full Name</p>
              <p className="text-gray-800">{`${profile.firstName} ${profile.lastName}`}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Company Name</p>
              <p className="text-gray-800">{profile.companyName || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Company Size</p>
              <p className="text-gray-800">{profile.companySize || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Location</p>
              <p className="text-gray-800">{profile.location || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Timezone</p>
              <p className="text-gray-800">{profile.timezone || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Currency</p>
              <p className="text-gray-800">{profile.currency || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Phone Number</p>
              <p className="text-gray-800">{profile.phoneNumber || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="text-gray-800">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Plan</p>
              <p className="text-gray-800">{profile.plan || '-'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoForm;