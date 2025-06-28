'use client';

import React from 'react';
import { FiCreditCard } from 'react-icons/fi';

const BillingSettings: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Billing Information</h2>
      <div className="space-y-4">
        <p className="text-gray-600">Manage your billing details and payment methods.</p>
        <button
          className="px-4 py-2 bg-[#5570F1] text-white rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all transform hover:scale-105"
        >
          <FiCreditCard /> Add Payment Method
        </button>
      </div>
    </div>
  );
};

export default BillingSettings;