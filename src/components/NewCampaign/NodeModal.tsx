'use client';

import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { Node } from 'reactflow';
import { FaEnvelope, FaFilter, FaClock, FaFlag } from 'react-icons/fa';
import { JSX } from 'react';

Modal.setAppElement('body');

const iconMap: { [key: string]: JSX.Element } = {
  email: <FaEnvelope className="text-blue-500 w-5 h-5" />,
  condition: <FaFilter className="text-green-500 w-5 h-5" />,
  delay: <FaClock className="text-yellow-500 w-5 h-5" />,
  goal: <FaFlag className="text-red-500 w-5 h-5" />,
};

interface NodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: Node | null;
  onSave: (updatedNode: Node) => void;
}

interface FormData {
  subject?: string;
  body?: string;
  waitingTime?: number;
  condition?: string;
}

export default function NodeModal({ isOpen, onClose, node, onSave }: NodeModalProps) {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    if (node) {
      onSave({ ...node, data: { ...node.data, ...data } });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          {iconMap[node?.data?.type || ''] || null}
          <h2 className="text-lg font-medium text-gray-800">{node?.data?.label}</h2>
        </div>
        <button onClick={onClose} className="text-red-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {node?.data?.type === 'email' && (
          <>
            <div>
              <label className="text-sm text-gray-600">Subject</label>
              <input
                {...register('subject')}
                placeholder="Write Subject of your mail..."
                className="w-full border border-gray-300 rounded p-2 mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Body</label>
              <textarea
                {...register('body')}
                placeholder="Enter a description..."
                className="w-full border border-gray-300 rounded p-2 mt-1 h-32"
              />
            </div>
          </>
        )}
        {node?.data?.type === 'condition' && (
          <>
            <div className="bg-green-50 p-3 rounded">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3" />
                </svg>
                <span className="text-sm text-gray-800">Opened Email</span>
              </div>
              <div className="mt-2">
                <label className="text-sm text-gray-600">Waiting Time</label>
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    {...register('waitingTime')}
                    type="number"
                    defaultValue={2}
                    className="w-16 border border-gray-300 rounded p-2"
                  />
                  <span className="text-sm text-gray-600">days</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Set a timer for the recipient to open the email. If they open it within the set time, we’ll move them to the “Yes” option when the timer runs out.
                </p>
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-6-6m0 0l6-6m-6 6h12" />
                </svg>
                <span className="text-sm text-gray-800">Clicked Link</span>
              </div>
              <div className="mt-2">
                <label className="text-sm text-gray-600">Waiting Time</label>
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    {...register('waitingTime')}
                    type="number"
                    defaultValue={2}
                    className="w-16 border border-gray-300 rounded p-2"
                  />
                  <span className="text-sm text-gray-600">days</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Set a timer for the recipient to click a link in the email. If they click it within the set time, we’ll move them to the “Yes” option when the timer runs out.
                </p>
              </div>
            </div>
          </>
        )}
        {(node?.data?.type === 'delay' || node?.data?.type === 'goal') && (
          <div className={`${node?.data?.type === 'goal' ? 'bg-red-50' : 'bg-yellow-50'} p-3 rounded`}>
            <div className="flex items-center space-x-2">
              {node?.data?.type === 'delay' && (
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {node?.data?.type === 'goal' && (
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              <span className="text-sm text-gray-800">
                {node?.data?.type === 'delay' ? 'Delay After Opened Email' : 'Set a Goal'}
              </span>
            </div>
            <div className="mt-2">
              <label className="text-sm text-gray-600">Waiting Time</label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  {...register('waitingTime')}
                  type="number"
                  defaultValue={2}
                  className="w-16 border border-gray-300 rounded p-2"
                />
                <span className="text-sm text-gray-600">days</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Set a timer for the recipient to open the email. If they open it within the set time, we’ll move them to the “Yes” option when the timer runs out.
              </p>
            </div>
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="p-2 bg-gray-200 rounded-full">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-full">
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}



















// 'use client';

// import Modal from 'react-modal';
// import { useForm } from 'react-hook-form';
// import { Node } from 'reactflow';

// Modal.setAppElement('body'); // Required for accessibility in Next.js

// interface NodeModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   node: Node | null;
//   onSave: (updatedNode: Node) => void;
// }

// interface FormData {
//   subject?: string;
//   body?: string;
//   waitingTime?: number;
//   condition?: string;
// }

// export default function NodeModal({ isOpen, onClose, node, onSave }: NodeModalProps) {
//   const { register, handleSubmit } = useForm<FormData>();

//   const onSubmit = (data: FormData) => {
//     if (node) {
//       onSave({ ...node, data: { ...node.data, ...data } });
//     }
//     onClose();
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       className="p-4 bg-white rounded shadow max-w-md mx-auto mt-20"
//       overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
//     >
//       <h2 className="text-lg mb-4">{node?.data?.label}</h2>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         {node?.data?.type === 'email' && (
//           <>
//             <input
//               {...register('subject')}
//               placeholder="Subject"
//               className="w-full border p-2 rounded"
//             />
//             <textarea
//               {...register('body')}
//               placeholder="Body"
//               className="w-full border p-2 rounded h-24"
//             />
//           </>
//         )}
//         {(node?.data?.type === 'condition' || node?.data?.type === 'delay' || node?.data?.type === 'goal') && (
//           <input
//             {...register('waitingTime')}
//             type="number"
//             placeholder="Waiting Time (days)"
//             className="w-full border p-2 rounded"
//           />
//         )}
//         {node?.data?.type === 'condition' && (
//           <select {...register('condition')} className="w-full border p-2 rounded">
//             <option value="opened">Opened Email</option>
//             <option value="clicked">Clicked Link</option>
//           </select>
//         )}
//         <div className="flex justify-end space-x-2">
//           <button type="submit" className="p-2 bg-blue-500 text-white rounded">
//             Save
//           </button>
//           <button onClick={onClose} className="p-2 bg-gray-200 rounded">
//             Cancel
//           </button>
//         </div>
//       </form>
//     </Modal>
//   );
// }