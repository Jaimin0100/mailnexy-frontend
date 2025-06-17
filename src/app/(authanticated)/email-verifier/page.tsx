'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FiSearch, FiUpload, FiDownload, FiCheckCircle, FiXCircle, FiMail, FiLoader } from 'react-icons/fi';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface EmailVerificationResult {
  email: string;
  status: 'valid' | 'invalid' | 'unknown' | 'disposable' | 'catch-all';
  reason?: string;
  domain?: string;
  mxRecords?: boolean;
  smtpCheck?: boolean;
  disposable?: boolean;
  isReachable?: boolean;
  isBounceRisk?: boolean;
  timestamp: string;
}

interface BulkUploadResult {
  total: number;
  processed: number;
  valid: number;
  invalid: number;
  unknown: number;
  disposable: number;
  catchAll: number;
}

const EmailVerifier: React.FC = () => {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState('');
  const [bulkEmails, setBulkEmails] = useState<string[]>([]);
  const [verificationResults, setVerificationResults] = useState<EmailVerificationResult[]>([]);
  const [bulkUploadResult, setBulkUploadResult] = useState<BulkUploadResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isBulkVerifying, setIsBulkVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  // API base URL
  const API_BASE_URL = 'http://localhost:5000/api/v1';

  // Function to get auth token (you might want to replace this with your actual auth token retrieval)
  const getAuthToken = useCallback(() => {
    // In a real app, you'd get this from your auth context or localStorage
    return localStorage.getItem('access_token') || '';
  }, []);

  // Verify single email
  const verifySingleEmail = useCallback(async (email: string): Promise<EmailVerificationResult> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/verify/email?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Verification failed');
    }

    const data = await response.json();
    
    return {
      email: data.email || email,
      status: data.status || 'unknown',
      reason: data.details,
      domain: data.email.split('@')[1],
      mxRecords: data.mxRecords,
      smtpCheck: data.smtpCheck,
      disposable: data.status === 'disposable',
      isReachable: data.isReachable,
      isBounceRisk: data.isBounceRisk,
      timestamp: new Date().toISOString(),
    };
  }, [getAuthToken]);

  // Verify bulk emails
  const verifyBulkEmails = useCallback(async (emails: string[]): Promise<{ results: EmailVerificationResult[], summary: BulkUploadResult }> => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/verify/bulk`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emails }),
    });

    if (!response.ok) {
      throw new Error('Bulk verification failed to start');
    }

    const data = await response.json();
    setVerificationId(data.verification_id);
    
    return {
      results: [],
      summary: {
        total: emails.length,
        processed: 0,
        valid: 0,
        invalid: 0,
        unknown: 0,
        disposable: 0,
        catchAll: 0,
      }
    };
  }, [getAuthToken]);

  // Poll for bulk verification results
  const pollBulkVerificationResults = useCallback(async (id: string) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`${API_BASE_URL}/verify/results/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch verification results');
      }

      const data = await response.json();
      
      if (data.status === 'completed') {
        // Stop polling when completed
        if (pollingInterval) {
          clearInterval(pollingInterval);
          setPollingInterval(null);
        }
        
        // Convert the results to our frontend format
        const results = data.VerificationResults.map((result: any) => ({
          email: result.Email,
          status: result.Status,
          reason: result.Details,
          domain: result.Email.split('@')[1],
          isReachable: result.IsReachable,
          isBounceRisk: result.IsBounceRisk,
          timestamp: result.CreatedAt || new Date().toISOString(),
        }));

        const summary = {
          total: data.ValidCount + data.InvalidCount + data.UnknownCount + data.DisposableCount + data.CatchAllCount,
          processed: data.ValidCount + data.InvalidCount + data.UnknownCount + data.DisposableCount + data.CatchAllCount,
          valid: data.ValidCount,
          invalid: data.InvalidCount,
          unknown: data.UnknownCount,
          disposable: data.DisposableCount,
          catchAll: data.CatchAllCount,
        };

        return { results, summary };
      }
      
      return null;
    } catch (error) {
      console.error('Error polling verification results:', error);
      return null;
    }
  }, [getAuthToken, pollingInterval]);

  // Effect to handle polling for bulk verification results
  useEffect(() => {
    if (verificationId && !pollingInterval) {
      const interval = setInterval(async () => {
        const data = await pollBulkVerificationResults(verificationId);
        if (data) {
          setVerificationResults(prev => [...data.results, ...prev].slice(0, 1000));
          setBulkUploadResult(data.summary);
          setIsBulkVerifying(false);
        }
      }, 3000); // Poll every 3 seconds
      
      setPollingInterval(interval);
      
      // Cleanup interval on unmount
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [verificationId, pollBulkVerificationResults, pollingInterval]);

  const handleSingleVerify = useCallback(async () => {
    if (!emailInput.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.trim())) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsVerifying(true);
    try {
      const result = await verifySingleEmail(emailInput.trim());
      setVerificationResults(prev => [result, ...prev.slice(0, 49)]); // Keep last 50 results
      toast.success('Email verification completed');
      setEmailInput('');
    } catch (error) {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  }, [emailInput, verifySingleEmail]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const emails = text.split(/[\n,]/)
        .map(email => email.trim())
        .filter(email => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
      
      if (emails.length === 0) {
        toast.error('No valid email addresses found in the file');
        return;
      }
      
      if (emails.length > 1000) {
        toast.error('Maximum 1000 emails allowed per batch');
        return;
      }
      
      setBulkEmails(emails);
      toast.success(`${emails.length} email addresses loaded`);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleBulkVerify = useCallback(async () => {
    if (bulkEmails.length === 0) {
      toast.error('Please upload a file with email addresses');
      return;
    }
    
    setIsBulkVerifying(true);
    try {
      const { summary } = await verifyBulkEmails(bulkEmails);
      setBulkUploadResult(summary);
      toast.success('Bulk verification started. Results will appear when ready.');
    } catch (error) {
      toast.error('Failed to start bulk verification');
      setIsBulkVerifying(false);
    }
  }, [bulkEmails, verifyBulkEmails]);

  const handleExportResults = useCallback(() => {
    const csvContent = [
      ['Email', 'Status', 'Reason', 'Domain', 'MX Records', 'SMTP Check', 'Disposable', 'Reachable', 'Bounce Risk', 'Timestamp'],
      ...verificationResults.map(result => [
        result.email,
        result.status,
        result.reason || '',
        result.domain || '',
        result.mxRecords ? 'Yes' : 'No',
        result.smtpCheck ? 'Yes' : 'No',
        result.disposable ? 'Yes' : 'No',
        result.isReachable ? 'Yes' : 'No',
        result.isBounceRisk ? 'Yes' : 'No',
        result.timestamp,
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `email_verification_results_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    toast.success('Results exported successfully');
  }, [verificationResults]);

  const filteredResults = verificationResults.filter(result =>
    result.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (result.domain?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  // Header Variant
  const HeaderVariant1 = () => (
    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-[#53545C]">Email Verifier</h1>
        <p className="text-[#53545C] text-sm">Check if email addresses are deliverable</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setActiveTab('single')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-300 ${
            activeTab === 'single' ? 'bg-[#5570F1] text-white' : 'bg-white text-[#53545C] border border-gray-300'
          }`}
        >
          Single Email
        </button>
        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-300 ${
            activeTab === 'bulk' ? 'bg-[#5570F1] text-white' : 'bg-white text-[#53545C] border border-gray-300'
          }`}
        >
          Bulk Verification
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <HeaderVariant1 />

        {activeTab === 'single' && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter email address to verify..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5570F1] text-gray-600"
                  onKeyPress={(e) => e.key === 'Enter' && handleSingleVerify()}
                />
              </div>
              <button
                onClick={handleSingleVerify}
                disabled={isVerifying}
                className={`px-6 py-2 rounded-xl text-white font-medium flex items-center gap-2 transition-colors duration-300 ${
                  isVerifying ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5570F1] hover:bg-blue-600'
                }`}
              >
                {isVerifying ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                Verify
              </button>
            </div>
          </div>
        )}

        {activeTab === 'bulk' && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-[#5570F1] text-white rounded-xl flex items-center gap-2 hover:bg-blue-600 transition-colors duration-300"
                >
                  <FiUpload /> Upload CSV
                </button>
                <input
                  type="file"
                  accept=".csv,.txt"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  onClick={handleBulkVerify}
                  disabled={isBulkVerifying || bulkEmails.length === 0}
                  className={`px-6 py-2 rounded-xl text-white font-medium flex items-center gap-2 transition-colors duration-300 ${
                    isBulkVerifying || bulkEmails.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5570F1] hover:bg-blue-600'
                  }`}
                >
                  {isBulkVerifying ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                  Verify {bulkEmails.length > 0 && `(${bulkEmails.length})`}
                </button>
                {bulkEmails.length > 0 && (
                  <p className="text-sm text-[#696A71]">{bulkEmails.length} emails ready for verification</p>
                )}
              </div>
              {isBulkVerifying && (
                <div className="p-4 bg-blue-50 rounded-lg text-blue-800 flex items-center gap-2">
                  <FiLoader className="animate-spin" />
                  <p>Processing bulk verification. Please wait...</p>
                </div>
              )}
              {bulkUploadResult && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Total Emails</p>
                    <p className="text-lg font-semibold text-gray-800">{bulkUploadResult.total}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Processed</p>
                    <p className="text-lg font-semibold text-gray-800">{bulkUploadResult.processed}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Valid</p>
                    <p className="text-lg font-semibold text-green-600">{bulkUploadResult.valid}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Invalid</p>
                    <p className="text-lg font-semibold text-red-600">{bulkUploadResult.invalid}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Disposable</p>
                    <p className="text-lg font-semibold text-orange-600">{bulkUploadResult.disposable}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Unknown</p>
                    <p className="text-lg font-semibold text-yellow-600">{bulkUploadResult.unknown}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {verificationResults.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div className="relative w-64">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search results..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5570F1] text-gray-600"
                />
              </div>
              <button
                onClick={handleExportResults}
                className="px-4 py-2 text-[#696A71] border border-gray-300 rounded-xl flex items-center gap-2 hover:text-[#5570F1] hover:bg-[#5570F1]/10 transition-colors duration-300"
              >
                <FiDownload /> Export Results
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs font-medium uppercase">
                    <th className="p-4">Email</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Domain</th>
                    <th className="p-4">Reachable</th>
                    <th className="p-4">Bounce Risk</th>
                    <th className="p-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((result, index) => (
                    <tr key={`${result.email}-${index}`} className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-300">
                      <td className="p-4 text-gray-700">{result.email}</td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            result.status === 'valid' ? 'bg-green-100 text-green-600' :
                            result.status === 'invalid' ? 'bg-red-100 text-red-600' :
                            result.status === 'disposable' ? 'bg-orange-100 text-orange-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}
                        >
                          {result.status}
                        </span>
                        {result.reason && (
                          <p className="text-xs text-gray-500 mt-1">{result.reason}</p>
                        )}
                      </td>
                      <td className="p-4 text-gray-700">{result.domain || '-'}</td>
                      <td className="p-4">
                        {result.isReachable ? (
                          <FiCheckCircle className="text-green-500" />
                        ) : (
                          <FiXCircle className="text-red-500" />
                        )}
                      </td>
                      <td className="p-4">
                        {result.isBounceRisk ? (
                          <FiCheckCircle className="text-red-500" />
                        ) : (
                          <FiXCircle className="text-green-500" />
                        )}
                      </td>
                      <td className="p-4 text-gray-700">
                        {new Date(result.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredResults.length > itemsPerPage && (
              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastItem, filteredResults.length)}</span>{' '}
                  of <span className="font-medium">{filteredResults.length}</span> results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => setCurrentPage(number)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === number ? 'bg-[#5570F1] text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {verificationResults.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <Image
              src="/email-verifier.png"
              alt="No verifications"
              width={250}
              height={150}
              className="mb-6"
            />
            <h2 className="text-xl font-semibold text-[#53545C] mb-2">
              No Email Verifications Yet
            </h2>
            <p className="text-[#53545C] mb-6 text-center">
              Start by verifying a single email or upload a CSV for bulk verification.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('single')}
                className="px-6 py-2 bg-[#5570F1] text-white rounded-xl hover:bg-blue-600 transition-colors duration-300"
              >
                Verify Single Email
              </button>
              <button
                onClick={() => setActiveTab('bulk')}
                className="px-6 py-2 bg-white text-[#5570F1] border border-[#5570F1] rounded-xl hover:bg-[#5570F1]/10 transition-colors duration-300"
              >
                Bulk Verification
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerifier;












// 'use client';

// import React, { useState, useCallback, useRef, useEffect } from 'react';
// import { FiSearch, FiUpload, FiDownload, FiCheckCircle, FiXCircle, FiMail, FiLoader } from 'react-icons/fi';
// import Image from 'next/image';
// import { toast } from 'react-hot-toast';
// import { useRouter } from 'next/navigation';

// interface EmailVerificationResult {
//   email: string;
//   status: 'valid' | 'invalid' | 'unknown';
//   reason?: string;
//   domain?: string;
//   mxRecords?: boolean;
//   smtpCheck?: boolean;
//   disposable?: boolean;
//   timestamp: string;
// }

// interface BulkUploadResult {
//   total: number;
//   processed: number;
//   valid: number;
//   invalid: number;
//   unknown: number;
// }

// const EmailVerifier: React.FC = () => {
//   const router = useRouter();
//   const [emailInput, setEmailInput] = useState('');
//   const [bulkEmails, setBulkEmails] = useState<string[]>([]);
//   const [verificationResults, setVerificationResults] = useState<EmailVerificationResult[]>([]);
//   const [bulkUploadResult, setBulkUploadResult] = useState<BulkUploadResult | null>(null);
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [isBulkVerifying, setIsBulkVerifying] = useState(false);
//   const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Mock verification function (to be replaced with API call)
//   const verifySingleEmail = useCallback(async (email: string): Promise<EmailVerificationResult> => {
//     // Simulate API delay
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     const isValid = Math.random() > 0.3; // Mock validation logic
//     return {
//       email,
//       status: isValid ? 'valid' : Math.random() > 0.5 ? 'invalid' : 'unknown',
//       reason: isValid ? undefined : 'Invalid domain or SMTP failure',
//       domain: email.split('@')[1],
//       mxRecords: isValid,
//       smtpCheck: isValid,
//       disposable: false,
//       timestamp: new Date().toISOString(),
//     };
//   }, []);

//   // Mock bulk verification function (to be replaced with API call)
//   const verifyBulkEmails = useCallback(async (emails: string[]): Promise<EmailVerificationResult[]> => {
//     // Simulate API delay
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     return emails.map(email => ({
//       email,
//       status: Math.random() > 0.3 ? 'valid' : Math.random() > 0.5 ? 'invalid' : 'unknown',
//       reason: Math.random() > 0.3 ? undefined : 'Invalid domain or SMTP failure',
//       domain: email.split('@')[1],
//       mxRecords: Math.random() > 0.3,
//       smtpCheck: Math.random() > 0.3,
//       disposable: Math.random() > 0.8,
//       timestamp: new Date().toISOString(),
//     }));
//   }, []);

//   const handleSingleVerify = useCallback(async () => {
//     if (!emailInput.trim()) {
//       toast.error('Please enter an email address');
//       return;
//     }
//     setIsVerifying(true);
//     try {
//       const result = await verifySingleEmail(emailInput.trim());
//       setVerificationResults(prev => [result, ...prev.slice(0, 49)]); // Keep last 50 results
//       toast.success('Email verification completed');
//       setEmailInput('');
//     } catch (error) {
//       toast.error('Verification failed');
//     } finally {
//       setIsVerifying(false);
//     }
//   }, [emailInput, verifySingleEmail]);

//   const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const text = e.target?.result as string;
//       const emails = text.split(/[\n,]/).map(email => email.trim()).filter(email => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
//       if (emails.length === 0) {
//         toast.error('No valid email addresses found in the file');
//         return;
//       }
//       setBulkEmails(emails);
//       toast.success(`${emails.length} email addresses loaded`);
//     };
//     reader.readAsText(file);
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   }, []);

//   const handleBulkVerify = useCallback(async () => {
//     if (bulkEmails.length === 0) {
//       toast.error('Please upload a file with email addresses');
//       return;
//     }
//     setIsBulkVerifying(true);
//     try {
//       const results = await verifyBulkEmails(bulkEmails);
//       const summary: BulkUploadResult = {
//         total: results.length,
//         processed: results.length,
//         valid: results.filter(r => r.status === 'valid').length,
//         invalid: results.filter(r => r.status === 'invalid').length,
//         unknown: results.filter(r => r.status === 'unknown').length,
//       };
//       setVerificationResults(prev => [...results, ...prev].slice(0, 1000)); // Keep up to 1000 results
//       setBulkUploadResult(summary);
//       setBulkEmails([]);
//       toast.success('Bulk verification completed');
//     } catch (error) {
//       toast.error('Bulk verification failed');
//     } finally {
//       setIsBulkVerifying(false);
//     }
//   }, [bulkEmails, verifyBulkEmails]);

//   const handleExportResults = useCallback(() => {
//     const csvContent = [
//       ['Email', 'Status', 'Reason', 'Domain', 'MX Records', 'SMTP Check', 'Disposable', 'Timestamp'],
//       ...verificationResults.map(result => [
//         result.email,
//         result.status,
//         result.reason || '',
//         result.domain || '',
//         result.mxRecords ? 'Yes' : 'No',
//         result.smtpCheck ? 'Yes' : 'No',
//         result.disposable ? 'Yes' : 'No',
//         result.timestamp,
//       ]),
//     ].map(row => row.join(',')).join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'email_verification_results.csv';
//     link.click();
//     toast.success('Results exported successfully');
//   }, [verificationResults]);

//   const filteredResults = verificationResults.filter(result =>
//     result.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     (result.domain?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
//   );

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredResults.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

//   // Header Variants
//   const HeaderVariant1 = () => (
//     <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
//       <div>
//         <h1 className="text-2xl font-semibold text-[#53545C]">Email Verifier</h1>
//         <p className="text-[#53545C] text-sm">Check if email addresses are deliverable</p>
//       </div>
//       <div className="flex items-center gap-4">
//         <button
//           onClick={() => setActiveTab('single')}
//           className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-300 ${
//             activeTab === 'single' ? 'bg-[#5570F1] text-white' : 'bg-white text-[#53545C] border border-gray-300'
//           }`}
//         >
//           Single Email
//         </button>
//         <button
//           onClick={() => setActiveTab('bulk')}
//           className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-300 ${
//             activeTab === 'bulk' ? 'bg-[#5570F1] text-white' : 'bg-white text-[#53545C] border border-gray-300'
//           }`}
//         >
//           Bulk Verification
//         </button>
//       </div>
//     </div>
//   );

//   const HeaderVariant2 = () => (
//     <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
//       <div className="flex justify-between items-center flex-wrap gap-4">
//         <div className="flex items-center gap-4">
//           <FiMail className="text-[#5570F1] text-2xl" />
//           <div>
//             <h1 className="text-xl font-semibold text-[#53545C]">Email Verification</h1>
//             <p className="text-[#696A71] text-xs">Verify single or multiple email addresses</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => setActiveTab('single')}
//             className={`px-3 py-1 text-sm font-medium rounded-md ${
//               activeTab === 'single' ? 'bg-[#5570F1]/10 text-[#5570F1]' : 'text-[#696A71] hover:bg-gray-100'
//             }`}
//           >
//             Single
//           </button>
//           <button
//             onClick={() => setActiveTab('bulk')}
//             className={`px-3 py-1 text-sm font-medium rounded-md ${
//               activeTab === 'bulk' ? 'bg-[#5570F1]/10 text-[#5570F1]' : 'text-[#696A71] hover:bg-gray-100'
//             }`}
//           >
//             Bulk
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   const HeaderVariant3 = () => (
//     <div className="mb-6 border-b border-gray-200 pb-4">
//       <h1 className="text-2xl font-semibold text-[#53545C] mb-2">Verify Emails</h1>
//       <div className="flex items-center gap-4 flex-wrap">
//         <button
//           onClick={() => setActiveTab('single')}
//           className={`text-sm font-medium pb-2 border-b-2 ${
//             activeTab === 'single' ? 'border-[#5570F1] text-[#5570F1]' : 'border-transparent text-[#696A71] hover:text-[#5570F1]'
//           }`}
//         >
//           Single Email Verification
//         </button>
//         <button
//           onClick={() => setActiveTab('bulk')}
//           className={`text-sm font-medium pb-2 border-b-2 ${
//             activeTab === 'bulk' ? 'border-[#5570F1] text-[#5570F1]' : 'border-transparent text-[#696A71] hover:text-[#5570F1]'
//           }`}
//         >
//           Bulk Email Verification
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 font-sans">
//       <div className="max-w-7xl mx-auto">
//         {/* Header Options - Uncomment desired variant */}
//         <HeaderVariant1 />
//         {/* <HeaderVariant2 /> */}
//         {/* <HeaderVariant3 /> */}

//         {activeTab === 'single' && (
//           <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
//             <div className="flex items-center gap-4 mb-4">
//               <div className="relative flex-1">
//                 <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="email"
//                   placeholder="Enter email address to verify..."
//                   value={emailInput}
//                   onChange={(e) => setEmailInput(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5570F1] text-gray-600"
//                   onKeyPress={(e) => e.key === 'Enter' && handleSingleVerify()}
//                 />
//               </div>
//               <button
//                 onClick={handleSingleVerify}
//                 disabled={isVerifying}
//                 className={`px-6 py-2 rounded-xl text-white font-medium flex items-center gap-2 transition-colors duration-300 ${
//                   isVerifying ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5570F1] hover:bg-blue-600'
//                 }`}
//               >
//                 {isVerifying ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
//                 Verify
//               </button>
//             </div>
//           </div>
//         )}

//         {activeTab === 'bulk' && (
//           <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
//             <div className="flex flex-col gap-4">
//               <div className="flex items-center gap-4 flex-wrap">
//                 <button
//                   onClick={() => fileInputRef.current?.click()}
//                   className="px-6 py-2 bg-[#5570F1] text-white rounded-xl flex items-center gap-2 hover:bg-blue-600 transition-colors duration-300"
//                 >
//                   <FiUpload /> Upload CSV
//                 </button>
//                 <input
//                   type="file"
//                   accept=".csv,.txt"
//                   ref={fileInputRef}
//                   className="hidden"
//                   onChange={handleFileUpload}
//                 />
//                 <button
//                   onClick={handleBulkVerify}
//                   disabled={isBulkVerifying || bulkEmails.length === 0}
//                   className={`px-6 py-2 rounded-xl text-white font-medium flex items-center gap-2 transition-colors duration-300 ${
//                     isBulkVerifying || bulkEmails.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5570F1] hover:bg-blue-600'
//                   }`}
//                 >
//                   {isBulkVerifying ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
//                   Verify {bulkEmails.length > 0 && `(${bulkEmails.length})`}
//                 </button>
//                 {bulkEmails.length > 0 && (
//                   <p className="text-sm text-[#696A71]">{bulkEmails.length} emails ready for verification</p>
//                 )}
//               </div>
//               {bulkUploadResult && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
//                   <div>
//                     <p className="text-xs text-gray-500">Total Emails</p>
//                     <p className="text-lg font-semibold text-gray-800">{bulkUploadResult.total}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Processed</p>
//                     <p className="text-lg font-semibold text-gray-800">{bulkUploadResult.processed}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Valid</p>
//                     <p className="text-lg font-semibold text-green-600">{bulkUploadResult.valid}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Invalid</p>
//                     <p className="text-lg font-semibold text-red-600">{bulkUploadResult.invalid}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Unknown</p>
//                     <p className="text-lg font-semibold text-yellow-600">{bulkUploadResult.unknown}</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {verificationResults.length > 0 && (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//             <div className="flex justify-between items-center p-4 border-b border-gray-200">
//               <div className="relative w-64">
//                 <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search results..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5570F1] text-gray-600"
//                 />
//               </div>
//               <button
//                 onClick={handleExportResults}
//                 className="px-4 py-2 text-[#696A71] border border-gray-300 rounded-xl flex items-center gap-2 hover:text-[#5570F1] hover:bg-[#5570F1]/10 transition-colors duration-300"
//               >
//                 <FiDownload /> Export Results
//               </button>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm">
//                 <thead>
//                   <tr className="bg-gray-50 text-gray-500 text-xs font-medium uppercase">
//                     <th className="p-4">Email</th>
//                     <th className="p-4">Status</th>
//                     <th className="p-4">Domain</th>
//                     <th className="p-4">MX Records</th>
//                     <th className="p-4">SMTP Check</th>
//                     <th className="p-4">Disposable</th>
//                     <th className="p-4">Timestamp</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentItems.map((result, index) => (
//                     <tr key={`${result.email}-${index}`} className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-300">
//                       <td className="p-4 text-gray-700">{result.email}</td>
//                       <td className="p-4">
//                         <span
//                           className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${
//                             result.status === 'valid' ? 'bg-green-100 text-green-600' :
//                             result.status === 'invalid' ? 'bg-red-100 text-red-600' :
//                             'bg-yellow-100 text-yellow-600'
//                           }`}
//                         >
//                           {result.status}
//                         </span>
//                       </td>
//                       <td className="p-4 text-gray-700">{result.domain || '-'}</td>
//                       <td className="p-4">
//                         {result.mxRecords ? (
//                           <FiCheckCircle className="text-green-500" />
//                         ) : (
//                           <FiXCircle className="text-red-500" />
//                         )}
//                       </td>
//                       <td className="p-4">
//                         {result.smtpCheck ? (
//                           <FiCheckCircle className="text-green-500" />
//                         ) : (
//                           <FiXCircle className="text-red-500" />
//                         )}
//                       </td>
//                       <td className="p-4">
//                         {result.disposable ? (
//                           <FiCheckCircle className="text-red-500" />
//                         ) : (
//                           <FiXCircle className="text-green-500" />
//                         )}
//                       </td>
//                       <td className="p-4 text-gray-700">
//                         {new Date(result.timestamp).toLocaleString()}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             {filteredResults.length > itemsPerPage && (
//               <div className="flex items-center justify-between p-4 border-t border-gray-200">
//                 <div className="text-sm text-gray-700">
//                   Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
//                   <span className="font-medium">{Math.min(indexOfLastItem, filteredResults.length)}</span>{' '}
//                   of <span className="font-medium">{filteredResults.length}</span> results
//                 </div>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                     disabled={currentPage === 1}
//                     className={`px-3 py-1 rounded-md ${
//                       currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
//                     }`}
//                   >
//                     Previous
//                   </button>
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
//                     <button
//                       key={number}
//                       onClick={() => setCurrentPage(number)}
//                       className={`px-3 py-1 rounded-md ${
//                         currentPage === number ? 'bg-[#5570F1] text-white' : 'text-gray-700 hover:bg-gray-100'
//                       }`}
//                     >
//                       {number}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                     disabled={currentPage === totalPages}
//                     className={`px-3 py-1 rounded-md ${
//                       currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
//                     }`}
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {verificationResults.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
//             <Image
//               src="/email-verifier.png"
//               alt="No verifications"
//               width={250}
//               height={150}
//               className="mb-6"
//             />
//             <h2 className="text-xl font-semibold text-[#53545C] mb-2">
//               No Email Verifications Yet
//             </h2>
//             <p className="text-[#53545C] mb-6 text-center">
//               Start by verifying a single email or upload a CSV for bulk verification.
//             </p>
//             <div className="flex gap-4">
//               <button
//                 onClick={() => setActiveTab('single')}
//                 className="px-6 py-2 bg-[#5570F1] text-white rounded-xl hover:bg-blue-600 transition-colors duration-300"
//               >
//                 Verify Single Email
//               </button>
//               <button
//                 onClick={() => setActiveTab('bulk')}
//                 className="px-6 py-2 bg-white text-[#5570F1] border border-[#5570F1] rounded-xl hover:bg-[#5570F1]/10 transition-colors duration-300"
//               >
//                 Bulk Verification
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EmailVerifier;