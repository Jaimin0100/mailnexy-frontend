'use client';

import Modal from 'react-modal';
import { useForm, FormProvider } from 'react-hook-form';
import { Node } from 'reactflow';
import EmailNode from './EmailNode';
import ConditionNode from './ConditionNode';
import DelayNode from './DelayNode';
import GoalNode from './GoalNode';

// Modal.setAppElement('#__next');

interface NodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: Node | null;
  onSave: (updatedNode: Node) => void;
}

export default function NodeModal({ isOpen, onClose, node, onSave }: NodeModalProps) {
  const methods = useForm({
    defaultValues: node?.data || {},
  });

  const onSubmit = (data: any) => {
    if (node) {
      onSave({ ...node, data: { ...node.data, ...data } });
    }
    onClose();
  };

  const renderNodeForm = () => {
    if (!node) return null;

    switch (node.data.type) {
      case 'email':
        return <EmailNode />;
      case 'condition':
        return <ConditionNode />;
      case 'delay':
        return <DelayNode />;
      case 'goal':
        return <GoalNode />;
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-20 z-[1000] border border-gray-200 backdrop-blur-sm"
      overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start z-[999]"
      style={{
        content: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: 'none',
          backdropFilter: 'blur(10px)',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(2px)',
        }
      }}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Configure {node?.data.label || 'Node'}
            </h2>
            <button
              onClick={onClose}
              className="text-red-500"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {renderNodeForm()}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#5570F1] text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}






// 'use client';

// import Modal from 'react-modal';
// import { useForm, FormProvider } from 'react-hook-form';
// import { Node } from 'reactflow';
// import EmailNode from './EmailNode';
// import ConditionNode from './ConditionNode';
// import DelayNode from './DelayNode';
// import GoalNode from './GoalNode';

// // Modal.setAppElement('#__next');

// interface NodeModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   node: Node | null;
//   onSave: (updatedNode: Node) => void;
// }

// export default function NodeModal({ isOpen, onClose, node, onSave }: NodeModalProps) {
//   const methods = useForm({
//     defaultValues: node?.data || {},
//   });

//   const onSubmit = (data: any) => {
//     if (node) {
//       onSave({ ...node, data: { ...node.data, ...data } });
//     }
//     onClose();
//   };

//   const renderNodeForm = () => {
//     if (!node) return null;

//     switch (node.data.type) {
//       case 'email':
//         return <EmailNode />;
//       case 'condition':
//         return <ConditionNode />;
//       case 'delay':
//         return <DelayNode />;
//       case 'goal':
//         return <GoalNode />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-20 z-[1000]"
//       overlayClassName="fixed inset-0 bg-gray-100 bg-opacity-10 flex justify-center items-start z-[999]"
//     >
//       <FormProvider {...methods}>
//         <form onSubmit={methods.handleSubmit(onSubmit)}>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold text-gray-800">
//               Configure {node?.data.label || 'Node'}
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               ✕
//             </button>
//           </div>

//           <div className="space-y-4">
//             {/* <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Node Label
//               </label>
//               <input
//                 {...methods.register('label')}
//                 className="w-full border border-gray-300 rounded-lg p-2"
//               />
//             </div> */}

//             {renderNodeForm()}
//           </div>

//           <div className="flex justify-end space-x-3 mt-6">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </FormProvider>
//     </Modal>
//   );
// }
