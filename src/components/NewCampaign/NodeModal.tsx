'use client';

import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { Node } from 'react-flow-renderer';

Modal.setAppElement('body'); // Required for accessibility in Next.js

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
      className="p-4 bg-white rounded shadow max-w-md mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start"
    >
      <h2 className="text-lg mb-4">{node?.data?.label}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {node?.data?.type === 'email' && (
          <>
            <input
              {...register('subject')}
              placeholder="Subject"
              className="w-full border p-2 rounded"
            />
            <textarea
              {...register('body')}
              placeholder="Body"
              className="w-full border p-2 rounded h-24"
            />
          </>
        )}
        {(node?.data?.type === 'condition' || node?.data?.type === 'delay' || node?.data?.type === 'goal') && (
          <input
            {...register('waitingTime')}
            type="number"
            placeholder="Waiting Time (days)"
            className="w-full border p-2 rounded"
          />
        )}
        {node?.data?.type === 'condition' && (
          <select {...register('condition')} className="w-full border p-2 rounded">
            <option value="opened">Opened Email</option>
            <option value="clicked">Clicked Link</option>
          </select>
        )}
        <div className="flex justify-end space-x-2">
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Save
          </button>
          <button onClick={onClose} className="p-2 bg-gray-200 rounded">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}