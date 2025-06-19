import { useFormContext } from "react-hook-form";
import { FaPlus, FaBold, FaItalic, FaUnderline } from "react-icons/fa";

export default function EmailNode() {
  const { register } = useFormContext();

  return (
    <>
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
      <div className="mt-4">
        <label className="text-sm text-blue-600 font-medium uppercase">Body</label>
        <div className="mt-2">
          <div className="flex space-x-2 p-2 border border-gray-300 rounded-t-lg bg-gray-50">
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-1 rounded"
            >
              <FaPlus className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-1 rounded"
            >
              <FaBold className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-1 rounded"
            >
              <FaItalic className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="text-gray-600 hover:bg-gray-200 p-1 rounded"
            >
              <FaUnderline className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <textarea
              {...register("body")}
              placeholder="Enter a description..."
              className="w-full text-black border border-gray-300 rounded-b-lg rounded-t-none p-3 h-40 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
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
    </>
  );
}