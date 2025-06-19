'use client';

import { FaEnvelope, FaFilter, FaClock, FaFlag } from 'react-icons/fa';
import { Handle, Position, NodeProps } from 'reactflow';

interface CustomNodeData {
  label: string;
  type: string;
}

const iconMap = {
  start: null,
  email: <FaEnvelope className="text-blue-500 w-5 h-5" />,
  condition: <FaFilter className="text-green-500 w-5 h-5" />,
  delay: <FaClock className="text-yellow-500 w-5 h-5" />,
  goal: <FaFlag className="text-red-500 w-5 h-5" />,
};

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, id }) => {
  const isStartNode = data.type === 'start';
  const isConditionNode = data.type === 'condition';
  const isGoalNode = data.type === 'goal';

  return (
    <div
      className={`rounded-lg shadow-md p-2 flex items-center space-x-2 ${
        isStartNode ? 'bg-[#34C759] text-white' : isGoalNode ? 'bg-red-100' : 'bg-white text-gray-800'
      }`}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      {iconMap[data.type] || null}
      <span className="text-sm">{data.label}</span>
      {isConditionNode ? (
        <>
          <Handle type="source" position={Position.Bottom} id="yes" style={{ background: '#555', top: '25%' }} />
          <span className="absolute left-[-20px] top-1/4 transform -translate-y-1/2 text-green-500 text-xs">YES</span>
          <Handle type="source" position={Position.Bottom} id="no" style={{ background: '#555', top: '75%' }} />
          <span className="absolute left-[-20px] bottom-1/4 transform translate-y-1/2 text-red-500 text-xs">NO</span>
        </>
      ) : (
        <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
      )}
    </div>
  );
};

export default CustomNode;






















// 'use client';

// import { FaEnvelope, FaFilter, FaClock, FaFlag } from 'react-icons/fa';
// import { Handle, Position, NodeProps } from 'reactflow';

// // Define the type for the icon map
// interface IconMap {
//   [key: string]: JSX.Element | null;  
// }

// // Define the icon map with explicit typing
// const iconMap: IconMap = {
//   start: null,
//   email: <FaEnvelope className="text-blue-500 w-5 h-5" />,
//   condition: <FaFilter className="text-green-500 w-5 h-5" />,
//   delay: <FaClock className="text-yellow-500 w-5 h-5" />,
//   goal: <FaFlag className="text-red-500 w-5 h-5" />,
// };

// // Define the shape of the data prop
// interface CustomNodeData {
//   label: string;
//   type: string;
// }

// // Use NodeProps from react-flow-renderer to properly type the props
// const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data }) => {
//   const isStartNode: boolean = data.type === 'start';
//   const isConditionNode: boolean = data.type === 'condition';

//   return (
//     <div
//       className={`rounded-lg shadow-md p-2 flex items-center space-x-2 ${
//         isStartNode ? 'bg-[#34C759] text-white' : 'bg-white text-gray-800'
//       }`}
//     >
//       <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
//       {iconMap[data.type] || null}
//       <span className="text-sm">{data.label}</span>
//       <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
//       {isConditionNode && (
//         <>
//           <Handle
//             type="source"
//             position={Position.Left}
//             id="no"
//             style={{ top: '50%', background: '#555' }}
//           />
//           <span className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 text-red-500 text-xs">
//             NO
//           </span>
//           <Handle
//             type="source"
//             position={Position.Right}
//             id="yes"
//             style={{ top: '50%', background: '#555' }}
//           />
//           <span className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 text-green-500 text-xs">
//             YES
//           </span>
//         </>
//       )}
//     </div>
//   );
// };

// export default CustomNode;












// 'use client';

// import { JSX } from 'react';
// import { FaEnvelope, FaFilter, FaClock, FaFlag } from 'react-icons/fa';
// import { Handle, Position } from 'reactflow';

// const iconMap: { [key: string]: JSX.Element } = {
//   email: <FaEnvelope className="text-blue-500" />,
//   condition: <FaFilter className="text-green-500" />,
//   delay: <FaClock className="text-yellow-500" />,
//   goal: <FaFlag className="text-red-500" />,
// };

// interface CustomNodeProps {
//   data: { label: string; type: string };
// }

// export default function CustomNode({ data }: CustomNodeProps) {
//   return (
//     <div className="bg-white border rounded p-2 flex items-center space-x-2 shadow">
//       <Handle type="target" position={Position.Top} />
//       {iconMap[data.type] || null}
//       <span>{data.label}</span>
//       <Handle type="source" position={Position.Bottom} />
//     </div>
//   );
// }