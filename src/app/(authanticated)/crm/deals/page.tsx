'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ProfilePage = () => {
  const router = useRouter();
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    plan: 'Premium',
    credits: 1000,
    joined: 'January 15, 2023',
    image: '/profilepic.png'
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden">
            <Image
              src={user.image}
              alt="Profile"
              width={96}
              height={96}
              className="object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <button 
                onClick={() => router.push('/settings')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700">Plan</h3>
                <p className="text-lg font-semibold">{user.plan}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700">Email Credits</h3>
                <p className="text-lg font-semibold">{user.credits}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-700">Member Since</h3>
                <p className="text-lg font-semibold">{user.joined}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;