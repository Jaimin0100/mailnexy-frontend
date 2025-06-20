'use client';

import { FaEnvelope, FaFilter, FaClock, FaFlag, FaPlay } from 'react-icons/fa';
import { Handle, Position, NodeProps } from 'reactflow';

interface CustomNodeData {
  label: string;
  type: string;
  subject?: string;
  body?: string;
  waitingTime?: string;
}

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
  const iconMap = {
    start: <FaPlay className="text-white w-4 h-4" />,
    email: <FaEnvelope className="text-blue-500 w-4 h-4" />,
    condition: <FaFilter className="text-green-500 w-4 h-4" />,
    delay: <FaClock className="text-yellow-500 w-4 h-4" />,
    goal: <FaFlag className="text-red-500 w-4 h-4" />,
  };

  const bgColorMap = {
    start: 'bg-[#34C759]',
    email: 'bg-blue-50',
    condition: 'bg-green-50',
    delay: 'bg-yellow-50',
    goal: 'bg-red-50',
  };

  const borderColorMap = {
    start: 'border-[#34C759]',
    email: 'border-blue-200',
    condition: 'border-green-200',
    delay: 'border-yellow-200',
    goal: 'border-red-200',
  };

  const isStartNode = data.type === 'start';
  const isConditionNode = data.type === 'condition';

  return (
    <div
      className={`rounded-lg shadow-sm p-3 ${bgColorMap[data.type]} ${borderColorMap[data.type]} border ${
        selected ? 'ring-2 ring-blue-500' : ''
      }`}
      style={{ minWidth: '200px' }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      
      <div className="flex items-center space-x-2">
        {iconMap[data.type]}
        <span className={`text-sm font-medium ${
          isStartNode ? 'text-white' : 'text-gray-800'
        }`}>
          {data.label}
        </span>
      </div>

      {data.type === 'email' && data.subject && (
        <p className="text-xs text-gray-600 mt-1 truncate">{data.subject}</p>
      )}
      
      {data.type === 'delay' && data.waitingTime && (
        <p className="text-xs text-yellow-700 mt-1">{data.waitingTime}</p>
      )}

      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ background: '#555' }} 
      />

      {isConditionNode && (
        <>
          <Handle 
            type="source" 
            position={Position.Left} 
            id="no" 
            style={{ background: '#f87171' }} 
          />
          <span className="absolute left-[-25px] top-1/2 transform -translate-y-1/2 text-red-500 text-xs">NO</span>
          <Handle 
            type="source" 
            position={Position.Right} 
            id="yes" 
            style={{ background: '#34d399' }} 
          />
          <span className="absolute right-[-25px] top-1/2 transform -translate-y-1/2 text-green-500 text-xs">YES</span>
        </>
      )}
    </div>
  );
};

export default CustomNode;








// 'use client';

// import { FaEnvelope, FaFilter, FaClock, FaFlag } from 'react-icons/fa';
// import { Handle, Position, NodeProps } from 'reactflow';

// interface CustomNodeData {
//   label: string;
//   type: string;
//   content?: string;
// }

// const iconMap = {
//   start: null,
//   email: <FaEnvelope className="text-blue-500 w-5 h-5" />,
//   condition: <FaFilter className="text-green-500 w-5 h-5" />,
//   delay: <FaClock className="text-yellow-500 w-5 h-5" />,
//   goal: <FaFlag className="text-red-500 w-5 h-5" />,
// };

// const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data }) => {
//   const isStartNode = data.type === 'start';
//   const isConditionNode = data.type === 'condition';

//   return (
//     <div
//       className={`rounded-lg shadow-md p-3 flex items-center space-x-2 ${
//         isStartNode ? 'bg-[#34C759] text-white' : 'bg-white text-gray-800 border border-gray-200'
//       }`}
//       style={{ minWidth: '200px', minHeight: '60px', padding: '10px', borderRadius: '10px' }}
//     >
//       <Handle type="target" position={Position.Top} style={{ background: '#555', width: 10, height: 10 }} />
//       {iconMap[data.type] && <div className="mr-2">{iconMap[data.type]}</div>}
//       <div className="flex-1 text-center">
//         <span className="text-sm font-medium">{data.label}</span>
//         {data.type === 'email' && !data.content && <p className="text-xs text-gray-500 mt-1">Add Email Content Here</p>}
//         {data.content && <p className="text-xs text-gray-500 mt-1">{data.content}</p>}
//         {data.type === 'delay' && data.content && <p className="text-xs text-gray-500 mt-1">{data.content}</p>}
//         {data.type === 'goal' && data.content && <p className="text-xs text-gray-500 mt-1">{data.content}</p>}
//       </div>
//       <Handle type="source" position={Position.Bottom} style={{ background: '#555', width: 10, height: 10 }} />
//       {isConditionNode && (
//         <>
//           <Handle type="source" position={Position.Left} id="no" style={{ top: '50%', background: '#FF0000', width: 10, height: 10 }} />
//           <span className="absolute left-[-35px] top-1/2 transform -translate-y-1/2 text-red-500 text-xs">NO</span>
//           <Handle type="source" position={Position.Right} id="yes" style={{ top: '50%', background: '#00FF00', width: 10, height: 10 }} />
//           <span className="absolute right-[-35px] top-1/2 transform -translate-y-1/2 text-green-500 text-xs">YES</span>
//         </>
//       )}
//     </div>
//   );
// };

// export default CustomNode;





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