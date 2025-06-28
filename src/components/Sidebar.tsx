'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiBell, FiChevronDown } from 'react-icons/fi';
import { FaHandshake, FaTasks, FaChartBar, FaUsers, FaSearch, FaGlobe, FaEnvelope, FaEnvelopeOpen, FaAddressBook   } from 'react-icons/fa';
import CRMIcon from './icons/CRMIcon';
import CampaignIcon from './icons/Campaign';
import LeadsIcon from './icons/database';
import EmailVerifierIcon from './icons/emailvarifier';
import SettingsIcon from './icons/settings';
import IntegrationsIcon from './icons/Integrations';
import HelpIcon from './icons/help';
import ContactIcon from './icons/contact';
import DashboardIcon from './icons/Dashboard';
import AddCampaignIcon from './icons/AddCampaign';
import AddSendersIcon from './icons/AddSenders';
import NewCampaignIcon from './icons/NewCampaign';
import UniboxIcon from './icons/Unibox';
import LogoutIcon from './icons/Logout';
import { FiUser, FiLock, FiKey, FiCreditCard, FiList } from 'react-icons/fi';


interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactElement<{ className?: string }>;
}

interface UserProfile {
  id: number;
  email: string;
  name?: string;
  is_active: boolean;
  plan_name: string;
  email_credits: number;
  google_id?: string;
  google_image_url?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeItem, setActiveItem] = useState('Campaign');
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const primaryMenu: MenuItem[] = [
    { name: 'Campaign', path: '/campaign/dashboard', icon: <CampaignIcon /> },
    { name: 'CRM', path: '/crm/deals', icon: <CRMIcon /> },
    { name: 'Lead Database', path: '/leads', icon: <LeadsIcon /> },
    { name: 'Email Verifier', path: '/email-verifier', icon: <EmailVerifierIcon /> },
  ];

  const secondaryMenu: MenuItem[] = [
    { name: 'Settings', path: '/profile', icon: <SettingsIcon /> },
    { name: 'Integrations', path: '/integrations', icon: <IntegrationsIcon /> },
    { name: 'Help', path: '/help', icon: <HelpIcon /> },
    { name: 'Contact', path: '/contact', icon: <ContactIcon /> },
  ];

  const campaignMenuItems: MenuItem[] = [
    { name: 'Dashboard', path: '/campaign/dashboard', icon: <DashboardIcon /> },
    { name: 'All Campaigns', path: '/campaign/all-campaign', icon: <AddCampaignIcon /> },
    { name: 'New Campaign', path: '/campaign/new-campaign', icon: <NewCampaignIcon /> },
    { name: 'Add Sender', path: '/campaign/sender', icon: <AddSendersIcon /> },
    { name: 'Unibox', path: '/campaign/unibox', icon: <UniboxIcon /> },
    { name: 'Leads', path: '/campaign/leads', icon: <FaUsers   /> },
  ];

  const crmMenuItems: MenuItem[] = [
    { name: 'Deals', path: '/crm/deals', icon: <FaHandshake /> },
    { name: 'Tasks', path: '/crm/tasks', icon: <FaTasks /> },
    { name: 'Statistics', path: '/crm/statistics', icon: <FaChartBar /> },
    { name: 'My Team', path: '/crm/team', icon: <FaUsers /> },
  ];

  const leadsMenuItems: MenuItem[] = [
    { name: 'Search Leads', path: '/leads/search', icon: <FaSearch /> },
    { name: 'Search Domains', path: '/leads/domains', icon: <FaGlobe /> },
  ];

  const emailVerifierMenuItems: MenuItem[] = [
    { name: 'Verify Email', path: '/email-verifier/verify', icon: <FaEnvelope /> },
    { name: 'Bulk Verification', path: '/email-verifier/bulk', icon: <FaEnvelopeOpen /> },
  ];

  const settingsMenuItems: MenuItem[] = [
    { name: 'Profile', path: '/profile', icon: <FiUser /> },
    { name: 'Security', path: '/profile/security', icon: <FiLock /> },
    { name: 'API', path: '/profile/api', icon: <FiKey /> },
    { name: 'My Team', path: '/profile/myteam', icon: <FaUsers /> },
    { name: 'Billing', path: '/profile/billing', icon: <FiCreditCard /> },
    { name: 'Transactions', path: '/profile/transactions', icon: <FiList /> },
  ];

  const fetchProfile = useCallback(async () => {
    try {
      setLoadingProfile(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            try {
              const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
              });

              if (!refreshResponse.ok) {
                throw new Error('Failed to refresh token');
              }

              const { access_token, refresh_token } = await refreshResponse.json();
              localStorage.setItem('access_token', access_token);
              localStorage.setItem('refresh_token', refresh_token);
              return fetchProfile();
            } catch (refreshError) {
              console.error('Token refresh failed');
            }
          }

          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          router.push('/login');
          return;
        }

        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
      if (err instanceof Error && (err.message.includes('unauthorized') || err.message.includes('token'))) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.push('/login');
      }
    } finally {
      setLoadingProfile(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    const pathToItemMap: Record<string, string> = {
      '/campaign': 'Campaign',
      '/crm': 'CRM',
      '/leads': 'Lead Database',
      '/email-verifier': 'Email Verifier',
      '/profile': 'Settings',
      '/integrations': 'Integrations',
      '/help': 'Help',
      '/contact': 'Contact',
    };

    if (pathname.startsWith('/campaign')) {
      const basePath = '/' + pathname.split('/')[1];
      setActiveItem(pathToItemMap[basePath] || 'Campaign');
    } else if (pathname.startsWith('/profile')) {
      setActiveItem('Settings');
    } else {
      const basePath = '/' + pathname.split('/')[1];
      setActiveItem(pathToItemMap[basePath] || 'Campaign');
    }
  }, [pathname]);

  useEffect(() => {
    if (!headerRef.current) return;

    const scrollHeader = () => {
      if (isSidebarHovered && window.innerWidth >= 768) {
        headerRef.current?.scrollTo({
          left: headerRef.current.scrollWidth,
          behavior: 'smooth',
        });
      } else {
        headerRef.current?.scrollTo({
          left: 0,
          behavior: 'smooth',
        });
      }
    };

    const timeout = setTimeout(scrollHeader, 150);
    return () => clearTimeout(timeout);
  }, [isSidebarHovered]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      router.push('/login');
    }
  }, [router]);

  const handleNotificationClick = useCallback(() => {
    setIsNotificationOpen(prev => !prev);
    setIsProfileOpen(false);
  }, []);

  const handleProfileClick = useCallback(() => {
    setIsProfileOpen(prev => !prev);
    setIsNotificationOpen(false);
  }, []);

  const handleProfileOption = useCallback((option: string) => {
    setIsProfileOpen(false);
    if (option === 'Logout') {
      handleLogout();
    } else if (option === 'Profile') {
      router.push('/profile');
    } else if (option === 'Settings') {
      router.push('/profile');
    }
  }, [handleLogout, router]);

  const renderMenu = useCallback((items: MenuItem[]) => (
    <ul className="space-y-2">
      {items.map((item) => {
        // const isActive = pathname.startsWith(item.path);
        const isActive = item.name === 'Campaign'?pathname.startsWith('/campaign'): pathname.startsWith(item.path);
        return (
          <li key={item.path}>
            <Link
              href={item.path}
              className={`group flex items-center p-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-[#5570F1]' : 'hover:bg-[#5570F1]'}`}
              prefetch={!isActive}
            >
              <span className="min-w-[16px] flex items-center justify-center">
                {React.cloneElement(item.icon, {
                  className: `${isActive ? 'text-white' : 'text-[#696A71]'} group-hover:text-white w-4 h-4`,
                })}
              </span>
              <span
                className={`ml-3 text-[11px] font-bold text-nowrap transition-opacity duration-300 ${isActive ? 'text-white' : 'text-[#696A71] group-hover:text-white'} ${isMobileSidebarOpen || (isSidebarHovered && window.innerWidth >= 768) ? 'opacity-100' : 'opacity-0 md:group-hover/sidebar:opacity-100'}`}
              >
                {item.name}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  ), [isMobileSidebarOpen, isSidebarHovered, pathname]);


  const renderHeaderMenu = () => {
    const headerItems = (() => {
      switch (activeItem) {
        case 'Campaign': return campaignMenuItems;
        case 'CRM': return crmMenuItems;
        case 'Lead Database': return leadsMenuItems;
        case 'Email Verifier': return emailVerifierMenuItems;
        case 'Settings': return settingsMenuItems;
        default: return [];
      }
    })();

    return (
      <div className="flex items-center space-x-8 overflow-x-auto scrollbar-hide">
        {headerItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`group flex flex-col items-center px-2 py-3 transition-all duration-200 whitespace-nowrap relative`}
              prefetch={!isActive}
            >
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center text-[12px]">
                  {React.cloneElement(item.icon, {
                    className: `${isActive ? 'text-[#5570F1]' : 'text-[#696A71] group-hover:text-[#5570F1]'} w-4 h-4`,
                  })}
                </span>
                <span
                  className={`text-[10px] sm:text-[11px] font-bold ${isActive ? 'text-[#5570F1]' : 'text-[#696A71] group-hover:text-[#5570F1]'}`}
                >
                  {item.name}
                </span>
              </div>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5570F1] rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    );
  };



  return (
    <div className="flex min-h-screen flex-col">
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#5570F1] text-white rounded-md"
        onClick={() => setIsMobileSidebarOpen(prev => !prev)}
        aria-label="Toggle sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isMobileSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>

      <div
        className={`h-screen fixed top-0 left-0 bg-[#EAEDFD] border-r border-gray-200 transition-all duration-300 ease-in-out z-50 flex flex-col ${isMobileSidebarOpen ? 'w-44 translate-x-0' : 'w-16 md:hover:w-44 group/sidebar translate-x-[-100%] md:translate-x-0'} p-2 max-w-44 md:max-w-44`}
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        <div className="flex flex-col flex-grow w-full">
          <div className="mb-2 flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              priority
            />
          </div>

          <nav className="flex-grow w-full">
            {renderMenu(primaryMenu)}
            <div className="my-36"></div>
            {renderMenu(secondaryMenu)}
          </nav>

          <div className="mt-auto mb-66 w-full">
            <button
              onClick={handleLogout}
              className="group flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-red-500/20 w-full"
              aria-label="Logout"
            >
              <span className="min-w-[16px] flex items-center justify-center">
                <LogoutIcon className="text-[#696A71] w-4 h-4 group-hover:text-red-500" />
              </span>
              <span
                className={`ml-3 text-[11px] font-bold text-nowrap transition-opacity duration-300 text-red-500 group-hover:text-red-500 ${isMobileSidebarOpen || (isSidebarHovered && window.innerWidth >= 768) ? 'opacity-100' : 'opacity-0 md:group-hover/sidebar:opacity-100'}`}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>

      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-3 z-40 flex items-center justify-between max-w-full transition-all duration-300 ${isMobileSidebarOpen ? 'left-44' : 'left-0 md:left-16'}`}
      >
        <div className="flex items-center space-x-2 sm:space-x-4 max-w-[calc(100%-120px)] overflow-x-auto scrollbar-hide">
   
           {renderHeaderMenu()}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 min-w-[100px] pr-2 sm:pr-4">
          <div className="relative" ref={notificationRef}>
            <button
              onClick={handleNotificationClick}
              className="relative p-1 rounded-full hover:bg-gray-100"
              aria-label="Notifications"
            >
              <FiBell className="text-gray-600 text-base sm:text-lg" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-56 sm:w-64 max-w-[90vw] bg-white border border-gray-200 rounded-lg shadow-lg p-3 sm:p-4 z-50">
                <h3 className="text-xs sm:text-sm font-semibold mb-2">Notifications</h3>
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                  <li className="text-[10px] sm:text-xs text-gray-600 hover:bg-gray-50 p-2 rounded">
                    New campaign created successfully
                  </li>
                  <li className="text-[10px] sm:text-xs text-gray-600 hover:bg-gray-50 p-2 rounded">
                    Email verification completed
                  </li>
                  <li className="text-[10px] sm:text-xs text-gray-600 hover:bg-gray-50 p-2 rounded">
                    Integration status updated
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-1 rounded-full hover:bg-gray-100 p-1"
              aria-label="User profile"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-gray-200 p-px">
                {loadingProfile ? (
                  <div className="w-full h-full bg-gray-200 rounded-full animate-pulse" />
                ) : profile?.google_image_url ? (
                  <Image
                    src={profile.google_image_url}
                    alt="Profile"
                    width={28}
                    height={28}
                    className="rounded-full object-cover"
                    priority
                  />
                ) : (
                  <Image
                    src="/profilepic.png"
                    alt="Profile"
                    width={28}
                    height={28}
                    className="rounded-full object-cover"
                    priority
                  />
                )}
              </div>
              <span className="text-[10px] sm:text-sm text-gray-600">
                {loadingProfile ? 'Loading...' : profile?.name || profile?.email || 'User'}
              </span>
              <FiChevronDown className="text-gray-600 text-sm sm:text-base" />
            </button>
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-40 sm:w-48 max-w-[90vw] bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50">
                <button
                  onClick={() => handleProfileOption('Profile')}
                  className="w-full text-left px-3 py-2 text-[10px] sm:text-sm text-gray-600 hover:bg-gray-50 rounded"
                >
                  Profile
                </button>
                <button
                  onClick={() => handleProfileOption('Settings')}
                  className="w-full text-left px-3 py-2 text-[10px] sm:text-sm text-gray-600 hover:bg-gray-50 rounded"
                >
                  Settings
                </button>
                <button
                  onClick={() => handleProfileOption('Logout')}
                  className="w-full text-left px-3 py-2 text-[10px] sm:text-sm text-red-500 hover:bg-red-50 rounded"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main
        className={`flex-1 mt-14 sm:mt-16 ${isMobileSidebarOpen ? 'ml-44' : 'ml-0 md:ml-16'} transition-all duration-300`}
      >
        {error && (
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="max-w-md rounded-lg bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-red-600">Error</h2>
              <p className="mb-6 text-gray-700">{error}</p>
              <button
                onClick={() => router.push('/login')}
                className="w-full rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Sidebar;