'use client';

import { FaEnvelope, FaFilter, FaClock, FaFlag } from 'react-icons/fa';
import { Handle, Position } from 'react-flow-renderer';

const iconMap: { [key: string]: JSX.Element } = {
  email: <FaEnvelope className="text-blue-500" />,
  condition: <FaFilter className="text-green-500" />,
  delay: <FaClock className="text-yellow-500" />,
  goal: <FaFlag className="text-red-500" />,
};

interface CustomNodeProps {
  data: { label: string; type: string };
}

export default function CustomNode({ data }: CustomNodeProps) {
  return (
    <div className="bg-white border rounded p-2 flex items-center space-x-2 shadow">
      <Handle type="target" position={Position.Top} />
      {iconMap[data.type] || null}
      <span>{data.label}</span>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}