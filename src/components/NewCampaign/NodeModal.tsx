'use client';


import Modal from 'react-modal';
import { useForm, FormProvider } from 'react-hook-form';
import { Node } from 'reactflow';
import EmailNode from './EmailNode';
import ConditionNode from './ConditionNode';
import DelayNode from './DelayNode';
import GoalNode from './GoalNode';
import ABTestNode from './ABTestNode';


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
    // Check if node exists and has a type
    if (!node || !node.type) return null;

    // Use top-level node type
    switch (node.type) {
      case 'email': return <EmailNode />;
      case 'condition': return <ConditionNode />;
      case 'delay': return <DelayNode />;
      case 'goal': return <GoalNode />;
      case 'abTest': return <ABTestNode />;
      default: return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      appElement={document.getElementById('__next') || document.body}
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
              Configure {node?.type ? `${node.type} Node` : 'Node'}
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
