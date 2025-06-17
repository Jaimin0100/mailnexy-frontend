import { useState } from "react";
import { FiSend, FiX } from "react-icons/fi";

interface ComposeModalProps {
  onClose: () => void;
  onSend: (to: string, subject: string, content: string) => void;
}

export default function ComposeModal({ onClose, onSend }: ComposeModalProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!to.trim() || !subject.trim() || !content.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    onSend(to, subject, content);
    setTo("");
    setSubject("");
    setContent("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#53545C]">Compose Email</h2>
          <button onClick={onClose} className="text-[#53545C] hover:text-[#5570F1]">
            <FiX size={20} />
          </button>
        </div>
        <input
          type="text"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-200 rounded-xl text-sm text-[#53545C] focus:outline-none focus:ring-2 focus:ring-[#5570F1]"
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-200 rounded-xl text-sm text-[#53545C] focus:outline-none focus:ring-2 focus:ring-[#5570F1]"
        />
        <textarea
          placeholder="Type your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-200 rounded-xl text-sm text-[#53545C] focus:outline-none focus:ring-2 focus:ring-[#5570F1] resize-y"
          rows={8}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-[#53545C] rounded-xl hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-[#5570F1] text-white rounded-xl hover:bg-blue-600"
          >
            <FiSend size={16} /> Send
          </button>
        </div>
      </div>
    </div>
  );
}