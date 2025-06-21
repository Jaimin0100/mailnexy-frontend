import { useFormContext } from "react-hook-form";
import { useState, useRef } from "react";
import {
  FaPlus,
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaListUl,
  FaListOl,
  FaLink,
  FaImage,
  FaPaperclip,
  FaSmile,
  FaFont,
  FaParagraph,
  FaQuoteLeft,
  FaCode,
  FaUndo,
  FaRedo,
  FaStrikethrough,
  FaSubscript,
  FaSuperscript,
  FaTextHeight
} from "react-icons/fa";
import { MdFormatColorText, MdFormatColorFill } from "react-icons/md";

export default function EmailNode() {
  const { register, setValue } = useFormContext();
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const textareaRef = useRef(null);

  const handleFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    // Update form value
    if (textareaRef.current) {
      setValue("body", textareaRef.current.innerHTML, { shouldValidate: true });
    }
  };

  const insertLink = () => {
    if (linkText && linkUrl) {
      handleFormat("createLink", linkUrl);
    }
    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
  };

  return (
    <>
      {/* Subject Field */}
      <label className="text-sm text-blue-600 font-medium uppercase">Subject</label>
      <div className="relative mt-2">
        <input
          {...register("subject")}
          placeholder="Write Subject of your mail..."
          className="w-full border border-gray-300 text-black rounded-lg p-2 pr-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
          <button
            type="button"
            className="text-blue-600 text-sm flex items-center space-x-1 hover:underline"
          >
            <span>Personalize</span>
          </button>
          <button
            type="button"
            className="text-blue-600 text-sm flex items-center space-x-1 hover:underline"
          >
            <span>Spin</span>
          </button>
        </div>
      </div>

      {/* Email Body */}
      <div className="mt-4">
        <label className="text-sm text-blue-600 font-medium uppercase">Body</label>
        <div className="mt-2">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-1 p-2 border border-gray-300 rounded-t-lg bg-gray-50">
            {/* Font Style */}
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              onClick={() => handleFormat("bold")}
              title="Bold"
            >
              <FaBold className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              onClick={() => handleFormat("italic")}
              title="Italic"
            >
              <FaItalic className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              onClick={() => handleFormat("underline")}
              title="Underline"
            >
              <FaUnderline className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              onClick={() => handleFormat("strikeThrough")}
              title="Strikethrough"
            >
              <FaStrikethrough className="w-4 h-4" />
            </button>

            {/* Text Alignment */}
            <div className="border-l border-gray-300 h-6 mx-1"></div>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              onClick={() => handleFormat("justifyLeft")}
              title="Align Left"
            >
              <FaAlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              onClick={() => handleFormat("justifyCenter")}
              title="Align Center"
            >
              <FaAlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              onClick={() => handleFormat("justifyRight")}
              title="Align Right"
            >
              <FaAlignRight className="w-4 h-4" />
            </button>

            {/* Lists */}
            <div className="border-l border-gray-300 h-6 mx-1"></div>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              onClick={() => handleFormat("insertUnorderedList")}
              title="Bullet List"
            >
              <FaListUl className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              onClick={() => handleFormat("insertOrderedList")}
              title="Numbered List"
            >
              <FaListOl className="w-4 h-4" />
            </button>

            {/* Links and Images */}
            <div className="border-l border-gray-300 h-6 mx-1"></div>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              onClick={() => setShowLinkModal(true)}
              title="Insert Link"
            >
              <FaLink className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              onClick={() => document.getElementById('file-upload')?.click()}
              title="Insert Image"
            >
              <FaImage className="w-4 h-4" />
              <input id="file-upload" type="file" accept="image/*" className="hidden" />
            </button>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              onClick={() => document.getElementById('file-attachment')?.click()}
              title="Attach File"
            >
              <FaPaperclip className="w-4 h-4" />
              <input id="file-attachment" type="file" className="hidden" />
            </button>

            {/* Text Color */}
            <div className="border-l border-gray-300 h-6 mx-1"></div>
            <div className="relative">
              <button
                type="button"
                className="text-gray-600 hover:bg-gray-200 p-2 rounded"
                onClick={() => setShowColorPicker(!showColorPicker)}
                title="Text Color"
              >
                <MdFormatColorText className="w-4 h-4" />
              </button>
              {showColorPicker && (
                <div className="absolute z-10 bg-white p-2 shadow-lg rounded border border-gray-300">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => {
                      setTextColor(e.target.value);
                      handleFormat("foreColor", e.target.value);
                    }}
                  />
                </div>
              )}
            </div>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              title="Background Color"
              onClick={() => handleFormat("hiliteColor", bgColor)}
            >
              <MdFormatColorFill className="w-4 h-4" />
            </button>

            {/* Formatting */}
            <div className="border-l border-gray-300 h-6 mx-1"></div>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              onClick={() => handleFormat("formatBlock", "<p>")}
              title="Paragraph"
            >
              <FaParagraph className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              onClick={() => handleFormat("formatBlock", "<blockquote>")}
              title="Quote"
            >
              <FaQuoteLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              onClick={() => handleFormat("formatBlock", "<pre>")}
              title="Code"
            >
              <FaCode className="w-4 h-4" />
            </button>

            {/* Undo/Redo */}
            <div className="border-l border-gray-300 h-6 mx-1"></div>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              onClick={() => handleFormat("undo")}
              title="Undo"
            >
              <FaUndo className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-2 rounded"
              onClick={() => handleFormat("redo")}
              title="Redo"
            >
              <FaRedo className="w-4 h-4" />
            </button>
          </div>

          {/* Editor Area */}
          <div className="relative">
            <div
              ref={textareaRef}
              contentEditable
              onInput={(e) => setValue("body", e.target.innerHTML, { shouldValidate: true })}
              placeholder="Enter a description..."
              className="w-full text-black border border-gray-300 rounded-b-lg rounded-t-none p-3 h-60 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y overflow-auto"
              dangerouslySetInnerHTML={{ __html: "" }}
            />
            <div className="absolute right-2 bottom-4 flex space-x-2">
              <button
                type="button"
                className="text-blue-600 text-sm flex items-center space-x-1 hover:underline"
              >
                <span>Personalize</span>
              </button>
              <button
                type="button"
                className="text-blue-600 text-sm flex items-center space-x-1 hover:underline"
              >
                <span>Spin</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-96">
            <h3 className="font-medium text-lg mb-4">Insert Link</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Text to display</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 mt-1"
                  placeholder="https://"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 border border-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertLink}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// import { useFormContext } from "react-hook-form";
// import { FaPlus, FaBold, FaItalic, FaUnderline } from "react-icons/fa";

// export default function EmailNode() {
//   const { register } = useFormContext();

//   return (
//     <>
//       <label className="text-sm text-blue-600 font-medium uppercase">Subject</label>
//       <div className="relative mt-2">
//         <input
//           {...register("subject")}
//           placeholder="Write Subject of your mail..."
//           className="w-full border border-gray-300 text-black rounded-lg p-2 pr-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
//           <button
//             type="button"
//             className="text-blue-600 text-sm flex items-center space-x-1 hover:underline"
//           >
//             <span>Personalize</span>
//           </button>
//           <button
//             type="button"
//             className="text-blue-600 text-sm flex items-center space-x-1 hover:underline"
//           >
//             <span>Spin</span>
//           </button>
//         </div>
//       </div>
//       <div className="mt-4">
//         <label className="text-sm text-blue-600 font-medium uppercase">Body</label>
//         <div className="mt-2">
//           <div className="flex space-x-2 p-2 border border-gray-300 rounded-t-lg bg-gray-50">
//             <button
//               type="button"
//               className="text-gray-600 hover:bg-gray-200 p-1 rounded"
//             >
//               <FaPlus className="w-4 h-4" />
//             </button>
//             <button
//               type="button"
//               className="text-gray-600 hover:bg-gray-200 p-1 rounded"
//             >
//               <FaBold className="w-4 h-4" />
//             </button>
//             <button
//               type="button"
//               className="text-gray-600 hover:bg-gray-200 p-1 rounded"
//             >
//               <FaItalic className="w-4 h-4" />
//             </button>
//             <button
//               type="button"
//               className="text-gray-600 hover:bg-gray-200 p-1 rounded"
//             >
//               <FaUnderline className="w-4 h-4" />
//             </button>
//           </div>
//           <div className="relative">
//             <textarea
//               {...register("body")}
//               placeholder="Enter a description..."
//               className="w-full text-black border border-gray-300 rounded-b-lg rounded-t-none p-3 h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
//             />
//             <div className="absolute right-2 bottom-4 flex space-x-2">
//               <button
//                 type="button"
//                 className="text-blue-600 text-sm flex items-center space-x-1 hover:underline"
//               >
//                 <span>Personalize</span>
//               </button>
//               <button
//                 type="button"
//                 className="text-blue-600 text-sm flex items-center space-x-1 hover:underline"
//               >
//                 <span>Spin</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }