import { useState } from "react";
import { FiArchive, FiTrash2, FiCornerUpLeft as FiReply, FiSend } from "react-icons/fi";

interface EmailPreviewProps {
  selectedEmail: { id: number; sender: string; subject: string; snippet: string; received_at: string; thread?: { id: number; sender: string; snippet: string; received_at: string }[] } | null;
  handleEmailAction: (action: "archive" | "trash" | "mark_read" | "star", emailIds: number[]) => void;
  handleQuickReply: (emailId: number, replyContent: string) => void;
}

export default function EmailPreview({ selectedEmail, handleEmailAction, handleQuickReply }: EmailPreviewProps) {
  const [replyContent, setReplyContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const templates = [
    { id: "1", name: "Follow-up", content: "Hi, just following up on my previous email. Let me know your thoughts!" },
    { id: "2", name: "Thank You", content: "Thank you for your response! I'll review and get back to you soon." },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      {selectedEmail ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#53545C]">{selectedEmail.subject}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleEmailAction("archive", [selectedEmail.id])}
                className="p-2 text-[#53545C] hover:text-[#5570F1]"
              >
                <FiArchive size={18} />
              </button>
              <button
                onClick={() => handleEmailAction("trash", [selectedEmail.id])}
                className="p-2 text-[#53545C] hover:text-[#EF4444]"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-[#53545C]">{selectedEmail.sender}</span>
            <span className="text-xs text-gray-400">
              {new Date(selectedEmail.received_at).toLocaleString()}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto mb-4">
            {selectedEmail.thread && selectedEmail.thread.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#53545C] mb-2">Thread</h3>
                {selectedEmail.thread.map((threadEmail) => (
                  <div key={threadEmail.id} className="border-l-2 border-gray-200 pl-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-[#53545C]">{threadEmail.sender}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(threadEmail.received_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-[#53545C]">{threadEmail.snippet}</p>
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm text-[#53545C]">{selectedEmail.snippet}</p>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <select
              value={selectedTemplate}
              onChange={(e) => {
                const template = templates.find((t) => t.id === e.target.value);
                setReplyContent(template ? template.content : "");
                setSelectedTemplate(e.target.value);
              }}
              className="mb-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-[#53545C] focus:outline-none focus:ring-2 focus:ring-[#5570F1]"
            >
              <option value="">Select a reply template</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>{template.name}</option>
              ))}
            </select>
            <textarea
              placeholder="Type your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5570F1] resize-y"
              rows={4}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  if (replyContent) {
                    handleQuickReply(selectedEmail.id, replyContent);
                    setReplyContent("");
                    setSelectedTemplate("");
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#5570F1] text-white rounded-xl hover:bg-blue-600"
              >
                <FiReply size={16} /> Reply
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-[#53545C] rounded-xl hover:bg-gray-100"
              >
                <FiSend size={16} /> Forward
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          Select an email to view its details.
        </div>
      )}
    </div>
  );
}