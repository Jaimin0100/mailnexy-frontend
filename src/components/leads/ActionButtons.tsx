import { FiDownload, FiUpload, FiPlus } from 'react-icons/fi';

const ActionButtons = () => {
  return (
    <div className="flex space-x-3">
      <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
        <FiDownload className="mr-2" />
        Export
      </button>
      <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
        <FiUpload className="mr-2" />
        Import
      </button>
      <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        <FiPlus className="mr-2" />
        Add Lead
      </button>
    </div>
  );
};

export default ActionButtons;