"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from 'react-hot-toast';
import EmailList from "@/components/uniboxComponents/EmailList";
import EmailPreview from "@/components/uniboxComponents/EmailPreview";
import Header from "@/components/uniboxComponents/Header";
import FilterBar from "@/components/uniboxComponents/FilterBar";
import ComposeModal from "@/components/uniboxComponents/ComposeModal";

interface Email {
  id: number;
  sender: string;
  subject: string;
  snippet: string;
  received_at: string;
  is_read: boolean;
  is_starred: boolean;
  campaign_id?: number;
  status: "inbox" | "sent" | "archived" | "trash";
  thread?: Email[];
}

interface Filter {
  status: string;
  campaign_id?: number;
  is_read?: boolean;
  is_starred?: boolean;
}

export default function Unibox() {
  // Mock email data with threads
  const mockEmails: Email[] = [
    {
      id: 1,
      sender: "john.doe@example.com",
      subject: "Meeting Schedule for Next Week",
      snippet: "Hi, let's schedule a meeting to discuss the project timeline and resource allocation for Q3.",
      received_at: "2025-06-14T10:30:00Z",
      is_read: false,
      is_starred: false,
      status: "inbox",
      campaign_id: 1,
      thread: [
        {
          id: 4,
          sender: "you@example.com",
          subject: "Re: Meeting Schedule for Next Week",
          snippet: "Sounds good, how about Wednesday at 2 PM?",
          received_at: "2025-06-14T11:00:00Z",
          is_read: true,
          is_starred: false,
          status: "inbox",
        },
      ],
    },
    {
      id: 2,
      sender: "jane.smith@example.com",
      subject: "Re: Product Feedback",
      snippet: "Thanks for the update! I have some feedback on the new features we discussed last week.",
      received_at: "2025-06-14T09:15:00Z",
      is_read: true,
      is_starred: true,
      status: "inbox",
    },
    {
      id: 3,
      sender: "support@company.com",
      subject: "Your Subscription Details",
      snippet: "Your subscription has been updated. Here are the details for your new plan.",
      received_at: "2025-06-13T14:20:00Z",
      is_read: false,
      is_starred: false,
      status: "sent",
      campaign_id: 2,
    },
  ];

  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [filteredEmails, setFilteredEmails] = useState<Email[]>(mockEmails);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filter>({ status: "inbox" });
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const applyFilters = useCallback((data: Email[], currentFilters: Filter, query: string) => {
    let filtered = data.filter((email) => {
      if (currentFilters.status && email.status !== currentFilters.status) return false;
      if (currentFilters.campaign_id && email.campaign_id !== currentFilters.campaign_id) return false;
      if (currentFilters.is_read !== undefined && email.is_read !== currentFilters.is_read) return false;
      if (currentFilters.is_starred !== undefined && email.is_starred !== currentFilters.is_starred) return false;
      return true;
    });

    if (query.trim()) {
      filtered = filtered.filter(
        (email) =>
          email.sender.toLowerCase().includes(query.toLowerCase()) ||
          email.subject.toLowerCase().includes(query.toLowerCase()) ||
          email.snippet.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredEmails(filtered);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<Filter>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    applyFilters(emails, updatedFilters, searchQuery);
  }, [filters, emails, searchQuery, applyFilters]);

  const handleSearch = useCallback(() => {
    applyFilters(emails, filters, searchQuery);
  }, [emails, filters, searchQuery, applyFilters]);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.length === filteredEmails.slice(currentPage * itemsPerPage - itemsPerPage, currentPage * itemsPerPage).length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredEmails.slice(currentPage * itemsPerPage - itemsPerPage, currentPage * itemsPerPage).map((email) => email.id));
    }
  }, [selectedRows, filteredEmails, currentPage, itemsPerPage]);

  const handleRowSelect = useCallback((emailId: number) => {
    setSelectedRows((prev) =>
      prev.includes(emailId) ? prev.filter((id) => id !== emailId) : [...prev, emailId]
    );
  }, []);

  const handleEmailAction = useCallback((action: "archive" | "trash" | "mark_read" | "star", emailIds: number[]) => {
    try {
      const updatedEmails = emails.map((email) => {
        if (emailIds.includes(email.id)) {
          if (action === "archive") return { ...email, status: "archived" as const };
          if (action === "trash") return { ...email, status: "trash" as const };
          if (action === "mark_read") return { ...email, is_read: true };
          if (action === "star") return { ...email, is_starred: !email.is_starred };
        }
        return email;
      });
      setEmails(updatedEmails);
      applyFilters(updatedEmails, filters, searchQuery);
      setSelectedRows([]);
      toast.success(`${action.replace('_', ' ')} action completed successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} email(s)`);
    }
  }, [emails, filters, searchQuery, applyFilters]);

  const handleQuickReply = useCallback((emailId: number, replyContent: string) => {
    if (!replyContent.trim()) {
      toast.error('Please enter a reply message');
      return;
    }
    console.log(`Reply to email ${emailId}: ${replyContent}`);
    toast.success('Reply sent successfully');
    setSelectedEmail(null);
  }, []);

  const handleCompose = useCallback((to: string, subject: string, content: string) => {
    console.log(`New email - To: ${to}, Subject: ${subject}, Content: ${content}`);
    toast.success('Email sent successfully');
    setIsComposeOpen(false);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'r' && selectedEmail) {
        const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
        if (textarea) textarea.focus();
      }
      if (e.key === 'a' && selectedRows.length > 0) {
        handleEmailAction("archive", selectedRows);
      }
      if (e.key === 't' && selectedRows.length > 0) {
        handleEmailAction("trash", selectedRows);
      }
      if (e.key === 'c') {
        setIsComposeOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEmail, selectedRows, handleEmailAction]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          setIsComposeOpen={setIsComposeOpen}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <FilterBar
          filters={filters}
          handleFilterChange={handleFilterChange}
          selectedRows={selectedRows}
          handleEmailAction={handleEmailAction}
        />
        <div className="flex flex-col lg:flex-row gap-6">
          <div className={`${isSidebarOpen ? 'lg:w-1/3' : 'hidden'} transition-all duration-300`}>
            <EmailList
              emails={filteredEmails}
              selectedEmail={selectedEmail}
              setSelectedEmail={setSelectedEmail}
              selectedRows={selectedRows}
              handleRowSelect={handleRowSelect}
              handleSelectAll={handleSelectAll}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              handleEmailAction={handleEmailAction}
            />
          </div>
          <div className={`${isSidebarOpen ? 'lg:w-2/3' : 'w-full'} transition-all duration-300`}>
            <EmailPreview
              selectedEmail={selectedEmail}
              handleEmailAction={handleEmailAction}
              handleQuickReply={handleQuickReply}
            />
          </div>
        </div>
        {isComposeOpen && (
          <ComposeModal
            onClose={() => setIsComposeOpen(false)}
            onSend={handleCompose}
          />
        )}
      </div>
    </div>
  );
}


