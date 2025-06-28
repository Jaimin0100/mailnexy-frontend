import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface EmailProvider {
  name: string;
  logo: string;
  smtp_host: string;
  smtp_port: number;
  imap_host: string;
  imap_port: number;
}

interface AddSenderProps {
  onClose: () => void;
}

// Email providers configuration
const emailProviders: EmailProvider[] = [
  { name: "Gmail (SMTP)", logo: "/images/gmail.svg", smtp_host: "smtp.gmail.com", smtp_port: 587, imap_host: "imap.gmail.com", imap_port: 993 },
  { name: "Gmail", logo: "/images/gmail.svg", smtp_host: "smtp.gmail.com", smtp_port: 587, imap_host: "imap.gmail.com", imap_port: 993 },
  { name: "Microsoft", logo: "/images/microsoft.svg", smtp_host: "smtp.office365.com", smtp_port: 587, imap_host: "imap.office365.com", imap_port: 993 },
  { name: "Zoho", logo: "/images/zoho.svg", smtp_host: "smtp.zoho.com", smtp_port: 587, imap_host: "imap.zoho.com", imap_port: 993 },
  { name: "Sendgrid", logo: "/images/sendgrid.svg", smtp_host: "smtp.sendgrid.net", smtp_port: 587, imap_host: "", imap_port: 0 },
  { name: "Hostinger", logo: "/images/hostinger.svg", smtp_host: "smtp.hostinger.com", smtp_port: 587, imap_host: "imap.hostinger.com", imap_port: 993 },
  { name: "Private Email", logo: "/images/private.svg", smtp_host: "smtp.name.com", smtp_port: 587, imap_host: "imap.name.com", imap_port: 993 },
  { name: "GoDaddy", logo: "/images/godaddy.svg", smtp_host: "smtpout.secureserver.net", smtp_port: 465, imap_host: "imap.secureserver.net", imap_port: 993 },
  { name: "Maildoso", logo: "/images/maildoso.svg", smtp_host: "smtp.maildoso.com", smtp_port: 587, imap_host: "imap.maildoso.com", imap_port: 993 },
  { name: "Titan", logo: "/images/titan.svg", smtp_host: "smtp.titan.email", smtp_port: 587, imap_host: "imap.titan.email", imap_port: 993 },
  { name: "Amazon Workmail", logo: "/images/amazon_workmail.svg", smtp_host: "smtp.mail.us-east-1.awsapps.com", smtp_port: 465, imap_host: "imap.mail.us-east-1.awsapps.com", imap_port: 993 },
  { name: "Amazon SES", logo: "/images/amazon_ses.svg", smtp_host: "email-smtp.us-east-1.amazonaws.com", smtp_port: 587, imap_host: "", imap_port: 0 },
  { name: "Mail QQ", logo: "/images/qq.svg", smtp_host: "smtp.qq.com", smtp_port: 587, imap_host: "imap.qq.com", imap_port: 993 },
  { name: "Mail 163", logo: "/images/163.svg", smtp_host: "smtp.163.com", smtp_port: 465, imap_host: "imap.163.com", imap_port: 993 },
  { name: "Aliyun", logo: "/images/aliyun.svg", smtp_host: "smtp.aliyun.com", smtp_port: 465, imap_host: "imap.aliyun.com", imap_port: 993 },
  { name: "Locaweb", logo: "/images/locaweb.svg", smtp_host: "smtp.locaweb.com.br", smtp_port: 587, imap_host: "imap.locaweb.com.br", imap_port: 993 },
  { name: "Mailgun", logo: "/images/mailgun.svg", smtp_host: "smtp.mailgun.org", smtp_port: 587, imap_host: "", imap_port: 0 },
  { name: "Ionos", logo: "/images/ionos.svg", smtp_host: "smtp.ionos.com", smtp_port: 587, imap_host: "imap.ionos.com", imap_port: 993 },
  { name: "Microsoft Exchange", logo: "/images/microsoft-exchange.svg", smtp_host: "smtp.office365.com", smtp_port: 587, imap_host: "imap.office365.com", imap_port: 993 },
];

const AddSender: React.FC<AddSenderProps> = ({ onClose }) => {
  const [step, setStep] = useState<"select" | "form">("select");
  const [selectedProvider, setSelectedProvider] = useState<EmailProvider | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    from_email: "",
    from_name: "",
    provider_type: "smtp",
    smtp_host: "",
    smtp_port: 587,
    smtp_username: "",
    smtp_password: "",
    encryption: "SSL",
    imap_host: "",
    imap_port: 993,
    imap_username: "",
    imap_password: "",
    imap_encryption: "SSL",
    imap_mailbox: "INBOX",
    oauth_provider: "",
    oauth_token: "",
    oauth_refresh_token: "",
    track_opens: true,
    track_clicks: true,
    track_replies: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Handle provider selection
  const handleProviderSelect = (provider: EmailProvider) => {
    setSelectedProvider(provider);
    setFormData((prev) => ({
      ...prev,
      smtp_host: provider.smtp_host,
      smtp_port: provider.smtp_port,
      imap_host: provider.imap_host,
      imap_port: provider.imap_port,
      provider_type: provider.name.toLowerCase().includes("smtp") ? "smtp" : prev.provider_type,
    }));
    setStep("form");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Basic validation
      if (!formData.name || !formData.from_email || !formData.from_name) {
        throw new Error("Name, From Email, and From Name are required");
      }

      if (formData.provider_type === "smtp" && (!formData.smtp_host || !formData.smtp_username || !formData.smtp_password)) {
        throw new Error("SMTP host, username, and password are required");
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.from_email)) {
        throw new Error("Invalid email format");
      }

      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`http://localhost:5000/api/v1/senders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          provider_type: formData.provider_type || "smtp",
          encryption: formData.encryption || "SSL",
          imap_encryption: formData.imap_encryption || "SSL",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create sender");
      }

      const sender = await response.json();
      toast.success("Sender created successfully!");
      onClose();
    } catch (err: any) {
      console.error("Error creating sender:", err);
      setError(err.message || "An error occurred");
      toast.error(err.message || "Failed to create sender");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl transform transition-all duration-300">
        {step === "select" ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">
              Select Email Provider
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {emailProviders.map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => handleProviderSelect(provider)}
                  className="flex flex-col items-center p-4 bg-white border border-gray-300 hover:border-blue-500 rounded-lg transition duration-200"
                >
                  <div className="w-16 h-16 relative mb-2">
                    <Image
                      src={provider.logo}
                      alt={provider.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center">
                    {provider.name}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition duration-200"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 tracking-tight">
              Add Email Sender - {selectedProvider?.name}
            </h2>
            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Settings */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">General Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Sender Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                      placeholder="Enter sender name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      From Name *
                    </label>
                    <input
                      type="text"
                      name="from_name"
                      value={formData.from_name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      From Email *
                    </label>
                    <input
                      type="email"
                      name="from_email"
                      value={formData.from_email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      Provider Type
                    </label>
                    <select
                      name="provider_type"
                      value={formData.provider_type}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    >
                      <option value="smtp">SMTP</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex items-center space-x-4">
                  <label className="flex items-center text-gray-600">
                    <input
                      type="checkbox"
                      name="track_opens"
                      checked={formData.track_opens}
                      onChange={handleChange}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    Track Opens
                  </label>
                  <label className="flex items-center text-gray-600">
                    <input
                      type="checkbox"
                      name="track_clicks"
                      checked={formData.track_clicks}
                      onChange={handleChange}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    Track Clicks
                  </label>
                </div>
              </div>

              {/* SMTP Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">SMTP (Sending Emails)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      SMTP Host *
                    </label>
                    <input
                      type="text"
                      name="smtp_host"
                      value={formData.smtp_host}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                      placeholder="smtp.gmail.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      SMTP Port *
                    </label>
                    <select
                      name="smtp_port"
                      value={formData.smtp_port}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                      required
                    >
                      <option value="465">465 (SSL)</option>
                      <option value="587">587 (TLS/STARTTLS)</option>
                      <option value="25">25 (Unsecured)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      SMTP Username *
                    </label>
                    <input
                      type="text"
                      name="smtp_username"
                      value={formData.smtp_username}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                      SMTP Password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="smtp_password"
                        value={formData.smtp_password}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                        placeholder="Enter app password"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium transition duration-200"
                  >
                    <span>Advanced Settings</span>
                    <svg
                      className={`ml-2 w-4 h-4 transform transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {showAdvanced && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        Encryption
                      </label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center text-gray-600">
                          <input
                            type="radio"
                            name="encryption"
                            value="SSL"
                            checked={formData.encryption === "SSL"}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          SSL
                        </label>
                        <label className="flex items-center text-gray-600">
                          <input
                            type="radio"
                            name="encryption"
                            value="TLS"
                            checked={formData.encryption === "TLS"}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          TLS
                        </label>
                        <label className="flex items-center text-gray-600">
                          <input
                            type="radio"
                            name="encryption"
                            value="None"
                            checked={formData.encryption === "None"}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          None
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        OAuth Provider
                      </label>
                      <input
                        type="text"
                        name="oauth_provider"
                        value={formData.oauth_provider}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                        placeholder="Enter OAuth provider"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        OAuth Token
                      </label>
                      <input
                        type="text"
                        name="oauth_token"
                        value={formData.oauth_token}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                        placeholder="Enter OAuth token"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        OAuth Refresh Token
                      </label>
                      <input
                        type="text"
                        name="oauth_refresh_token"
                        value={formData.oauth_refresh_token}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                        placeholder="Enter OAuth refresh token"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* IMAP Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">IMAP (Receiving Emails)</h3>
                <div className="flex items-center mb-4">
                  <label className="flex items-center text-gray-600">
                    <input
                      type="checkbox"
                      name="track_replies"
                      checked={formData.track_replies}
                      onChange={handleChange}
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    Track Replies
                  </label>
                </div>
                {formData.track_replies && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        IMAP Host
                      </label>
                      <input
                        type="text"
                        name="imap_host"
                        value={formData.imap_host}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                        placeholder="imap.gmail.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        IMAP Port
                      </label>
                      <select
                        name="imap_port"
                        value={formData.imap_port}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                      >
                        <option value="993">993 (SSL)</option>
                        <option value="143">143 (Unsecured)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        IMAP Username
                      </label>
                      <input
                        type="text"
                        name="imap_username"
                        value={formData.imap_username}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        IMAP Password
                      </label>
                      <input
                        type="password"
                        name="imap_password"
                        value={formData.imap_password}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                        placeholder="Enter password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        IMAP Mailbox
                      </label>
                      <input
                        type="text"
                        name="imap_mailbox"
                        value={formData.imap_mailbox}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                        placeholder="Enter mailbox (e.g., INBOX)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1.5">
                        IMAP Encryption
                      </label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center text-gray-600">
                          <input
                            type="radio"
                            name="imap_encryption"
                            value="SSL"
                            checked={formData.imap_encryption === "SSL"}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          SSL
                        </label>
                        <label className="flex items-center text-gray-600">
                          <input
                            type="radio"
                            name="imap_encryption"
                            value="TLS"
                            checked={formData.imap_encryption === "TLS"}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          TLS
                        </label>
                        <label className="flex items-center text-gray-600">
                          <input
                            type="radio"
                            name="imap_encryption"
                            value="None"
                            checked={formData.imap_encryption === "None"}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          />
                          None
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setStep("select")}
                  className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition duration-200"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 font-medium transition duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V4a8 8 0 00-8 8h4z" />
                      </svg>
                      Creating...
                    </div>
                  ) : (
                    "Create Sender"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AddSender;