import { FiX, FiUpload, FiFile } from 'react-icons/fi';

type ImportLeadsPopupProps = {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  handleFileUpload: () => void;
  setIsImportPopupOpen: (open: boolean) => void;
  handleFileDrop: (e: React.DragEvent<HTMLDivElement>) => void;
};

export default function ImportLeadsPopup({
  selectedFile,
  setSelectedFile,
  handleFileUpload,
  setIsImportPopupOpen,
  handleFileDrop
}: ImportLeadsPopupProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validExtensions = ['.xls', '.xlsx', '.csv', '.txt'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (validExtensions.includes(fileExtension || '')) {
        setSelectedFile(file);
      } else {
        alert('Please upload only Excel (.xls, .xlsx), CSV (.csv), or Text (.txt) files');
        if (e.target) e.target.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsImportPopupOpen(false)}>
      <div
        className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#53545C]">Import Leads</h2>
          <button
            onClick={() => {
              setIsImportPopupOpen(false);
              setSelectedFile(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">
            Upload an Excel (.xls, .xlsx), CSV (.csv), or Text (.txt) file containing your lead data.
          </p>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
          >
            {selectedFile ? (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                <div className="flex items-center">
                  <FiFile className="text-[#5570F1] mr-3" />
                  <span className="text-sm font-medium text-gray-700">{selectedFile.name}</span>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <>
                <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-[#5570F1] font-medium">Click to browse</span>
                  <span className="text-gray-500 ml-1">or drag and drop</span>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: XLS, XLSX, CSV, TXT
                </p>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept=".xls,.xlsx,.csv,.txt,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,text/plain"
                />
              </>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              setIsImportPopupOpen(false);
              setSelectedFile(null);
            }}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleFileUpload}
            disabled={!selectedFile}
            className={`px-4 py-2 text-white rounded-lg ${selectedFile ? 'bg-[#5570F1] hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Import File
          </button>
        </div>
      </div>
    </div>
  );
}