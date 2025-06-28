'use client';

import React, { useState, useCallback } from 'react';
import { FiLock, FiShield, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const SecuritySettings: React.FC = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = useCallback(() => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Password changed successfully');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  }, [passwordData]);

  const handleTwoFactorToggle = useCallback(() => {
    setTwoFactorEnabled((prev) => {
      toast.success(`Two-factor authentication ${!prev ? 'enabled' : 'disabled'}`);
      return !prev;
    });
  }, []);

  const handleDeleteAccount = useCallback(() => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.success('Account deletion request sent');
    }
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 transition-all duration-300">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-bold text-gray-600 mb-2">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="password"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5570F1] text-gray-700"
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5570F1] text-gray-700"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5570F1] text-gray-700"
            />
          </div>
          <button
            onClick={handlePasswordChange}
            className="mt-4 px-4 py-2 bg-[#5570F1] text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all transform hover:scale-105"
          >
            <FiLock /> Update Password
          </button>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Two-Step Authentication</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Enable two-step authentication for added security</span>
            <button
              onClick={handleTwoFactorToggle}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 ${twoFactorEnabled ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-[#5570F1] text-white hover:bg-blue-600'}`}
            >
              <FiShield /> {twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
            </button>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Delete Account</h3>
          <p className="text-sm text-gray-600 mb-2">Permanently delete your account and all associated data.</p>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition-all transform hover:scale-105"
          >
            <FiTrash2 /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;