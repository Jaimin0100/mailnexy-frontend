'use client';

import { FaEnvelope, FaFilter, FaClock, FaFlag, FaPlay, FaCodeBranch } from 'react-icons/fa';
import { Handle, Position, NodeProps } from 'reactflow';

interface CustomNodeData {
  label: string;
  type: string;
  subject?: string;
  body?: string;
  waitingTime?: string;
  splitPercentage?: number; // For A/B testing
}

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
  // Modern, minimal node styles inspired by Snov.io
  const nodeStyles = {
    start: {
      icon: <FaPlay className="text-white w-4 h-4" />,
      iconColor: 'text-white',
      bgColor: 'bg-green-600',
      borderColor: 'border-green-700/50',
      textColor: 'text-white',
      subjectColor: 'text-green-100 text-opacity-90',
      borderWidth: 'border',
      borderRadius: 'rounded-md',
      width: 'min-w-[200px]',
      shadow: 'shadow-sm',
      hoverShadow: 'hover:shadow-md',
      name: 'Start',
    },
    email: {
      icon: <FaEnvelope className="w-4 h-4" />,
      iconContainer: 'bg-blue-100 p-2 rounded-full border border-gray-200',
      iconColor: 'text-blue-500',
      bgColor: 'bg-white',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800',
      subjectColor: 'text-blue-500',
      borderWidth: 'border',
      borderRadius: 'rounded-md',
      width: 'min-w-[220px]',
      shadow: 'shadow-sm',
      hoverShadow: 'hover:shadow-md',
      name: 'Email',
    },
    condition: {
      icon: <FaFilter className="w-4 h-4" />,
      iconContainer: 'bg-green-100 p-2 rounded-full border border-gray-200',
      iconColor: 'text-green-500',
      bgColor: 'bg-white',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800',
      subjectColor: 'text-teal-500',
      borderWidth: 'border',
      borderRadius: 'rounded-md',
      width: 'min-w-[240px]',
      shadow: 'shadow-sm',
      hoverShadow: 'hover:shadow-md',
      name: 'Condition',
    },
    delay: {
      icon: <FaClock className="w-4 h-4" />,
      iconContainer: 'bg-yellow-100 p-2 rounded-full border border-gray-200',
      iconColor: 'text-yellow-500',
      bgColor: 'bg-white',
      borderColor: 'border-gray-200',
      textText: 'text-gray-800',
      subjectColor: 'text-amber-500',
      borderWidth: 'border',
      borderRadius: 'rounded-md',
      width: 'min-w-[200px]',
      shadow: 'shadow-sm',
      hoverShadow: 'hover:shadow-md',
      name: 'Delay',
    },
    goal: {
      icon: <FaFlag className="w-4 h-4" />,
      iconContainer: 'bg-red-100 p-2 rounded-full border border-gray-200',
      iconColor: 'text-red-500',
      bgColor: 'bg-white',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800',
      subjectColor: 'text-red-500',
      borderWidth: 'border',
      borderRadius: 'rounded-md',
      width: 'min-w-[200px]',
      shadow: 'shadow-sm',
      hoverShadow: 'hover:shadow-md',
      name: 'Goal',
    },
    abTest: {
      icon: <FaCodeBranch className="w-4 h-4" />,
      iconContainer: 'bg-purple-100 p-2 rounded-full border border-gray-200',
      iconColor: 'text-purple-500',
      bgColor: 'bg-white',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800',
      subjectColor: 'text-purple-500',
      borderWidth: 'border',
      borderRadius: 'rounded-md',
      width: 'min-w-[240px]',
      shadow: 'shadow-sm',
      hoverShadow: 'hover:shadow-md',
      name: 'A/B Test',
    },
  };

  const currentStyle = nodeStyles[data.type];
  const isConditionNode = data.type === 'condition';
  const isStartNode = data.type === 'start';
  const isGoalNode = data.type === 'goal';
  const isABTestNode = data.type === 'abTest';

  return (
    <div
      className={`
        ${currentStyle.width} 
        ${currentStyle.borderRadius} 
        ${currentStyle.bgColor} 
        ${currentStyle.borderColor} 
        ${currentStyle.borderWidth} 
        ${currentStyle.shadow} 
        ${currentStyle.hoverShadow} 
        ${selected ? 'border-blue-500 border-2' : ''} 
        p-3 transition-all duration-150 ease-out relative flex flex-col items-center justify-center
      `}
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* Input handle (top) - only for non-start nodes */}
      {!isStartNode && (
        <Handle 
          type="target" 
          position={Position.Top} 
          className="!w-2.5 !h-2.5 !bg-gray-500 !border-2 !border-white !rounded-full" 
        />
      )}
      
      <div className="flex items-center gap-3">
        <div className={`${currentStyle.iconContainer} ${currentStyle.iconColor}`}>
          {currentStyle.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-baseline">
            <h3 className={`text-sm font-semibold ${currentStyle.textColor}`}>
              {currentStyle.name}
            </h3>
            {data.label && data.label !== currentStyle.name && (
              <span className={`text-xs ml-2 ${currentStyle.textColor} opacity-70`}>
                {data.label}
              </span>
            )}
          </div>
          {(data.type === 'email' && data.subject || 
            data.type === 'delay' && data.waitingTime ||
            data.type === 'abTest' && data.splitPercentage) && (
            <p className={`text-xs mt-1 ${currentStyle.subjectColor}`}>
              {data.type === 'email' ? data.subject : 
               data.type === 'delay' ? data.waitingTime :
               `Split: ${data.splitPercentage}% / ${100 - (data.splitPercentage || 50)}%`}
            </p>
          )}
        </div>
      </div>

      {/* Output handles */}
      {isStartNode && (
        <Handle 
          type="source" 
          position={Position.Bottom} 
          className="!w-2.5 !h-2.5 !bg-gray-500 !border-2 !border-white !rounded-full" 
        />
      )}

      {!isStartNode && !isGoalNode && !isConditionNode && !isABTestNode && (
        <Handle 
          type="source" 
          position={Position.Bottom} 
          className="!w-2.5 !h-2.5 !bg-gray-500 !border-2 !border-white !rounded-full" 
        />
      )}

      {isConditionNode && (
        <>
          <div className="absolute bottom-0 left-1/4 transform -translate-x-1/2 translate-y-1/2">
            <Handle 
              type="source" 
              position={Position.Bottom} 
              id="no" 
              className="!w-2.5 !h-2.5 !bg-red-500 !border-2 !border-white !rounded-full"
            />
            <p className='text-xs font-bold mt-1 text-red-500 pb-3'>NO</p>
          </div>
          
          <div className="absolute bottom-0 right-1/4 transform translate-x-1/2 translate-y-1/2">
            <Handle 
              type="source" 
              position={Position.Bottom} 
              id="yes" 
              className="!w-2.5 !h-2.5 !bg-green-500 !border-2 !border-white !rounded-full"
            />
            <p className='text-xs font-bold mt-1 text-green-500 pb-3'>YES</p>
          </div>
        </>
      )}

      {isABTestNode && (
        <>
          <div className="absolute bottom-0 left-1/4 transform -translate-x-1/2 translate-y-1/2">
            <Handle 
              type="source" 
              position={Position.Bottom} 
              id="variantA" 
              className="!w-2.5 !h-2.5 !bg-purple-400 !border-2 !border-white !rounded-full"
            />
            <p className='text-xs font-bold mt-1 text-purple-500 pb-3'>Variant A</p>
          </div>
          
          <div className="absolute bottom-0 right-1/4 transform translate-x-1/2 translate-y-1/2">
            <Handle 
              type="source" 
              position={Position.Bottom} 
              id="variantB" 
              className="!w-2.5 !h-2.5 !bg-purple-600 !border-2 !border-white !rounded-full"
            />
            <p className='text-xs font-bold mt-1 text-purple-700 pb-3'>Variant B</p>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomNode;









// 'use client';

// import { FaEnvelope, FaFilter, FaClock, FaFlag, FaPlay } from 'react-icons/fa';
// import { Handle, Position, NodeProps } from 'reactflow';

// interface CustomNodeData {
//   label: string;
//   type: string;
//   subject?: string;
//   body?: string;
//   waitingTime?: string;
// }

// const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
//   // Modern, minimal node styles inspired by Snov.io
//   const nodeStyles = {
//     start: {
//       icon: <FaPlay className="text-white w-4 h-4" />,
//       iconColor: 'text-white',
//       bgColor: 'bg-green-600',
//       borderColor: 'border-green-700/50',
//       textColor: 'text-white',
//       subjectColor: 'text-green-100 text-opacity-90',
//       borderWidth: 'border',
//       borderRadius: 'rounded-md',
//       width: 'min-w-[200px]',
//       shadow: 'shadow-sm',
//       hoverShadow: 'hover:shadow-md',
//       name: 'Start',
//     },
//     email: {
//       icon: <FaEnvelope className="w-4 h-4" />,
//       iconContainer: 'bg-blue-100 p-2 rounded-full border border-gray-200',
//       iconColor: 'text-blue-500',
//       bgColor: 'bg-white',
//       borderColor: 'border-gray-200',
//       textColor: 'text-gray-800',
//       subjectColor: 'text-blue-500',
//       borderWidth: 'border',
//       borderRadius: 'rounded-md',
//       width: 'min-w-[220px]',
//       shadow: 'shadow-sm',
//       hoverShadow: 'hover:shadow-md',
//       name: 'Email',
//     },
//     condition: {
//       icon: <FaFilter className="w-4 h-4" />,
//       iconContainer: 'bg-green-100 p-2 rounded-full border border-gray-200',
//       iconColor: 'text-green-500',
//       bgColor: 'bg-white',
//       borderColor: 'border-gray-200',
//       textColor: 'text-gray-800',
//       subjectColor: 'text-teal-500',
//       borderWidth: 'border',
//       borderRadius: 'rounded-md',
//       width: 'min-w-[240px]',
//       shadow: 'shadow-sm',
//       hoverShadow: 'hover:shadow-md',
//       name: 'Condition',
//     },
//     delay: {
//       icon: <FaClock className="w-4 h-4" />,
//       iconContainer: 'bg-yellow-100 p-2 rounded-full border border-gray-200',
//       iconColor: 'text-yellow-500',
//       bgColor: 'bg-white',
//       borderColor: 'border-gray-200',
//       textColor: 'text-gray-800',
//       subjectColor: 'text-amber-500',
//       borderWidth: 'border',
//       borderRadius: 'rounded-md',
//       width: 'min-w-[200px]',
//       shadow: 'shadow-sm',
//       hoverShadow: 'hover:shadow-md',
//       name: 'Delay',
//     },
//     goal: {
//       icon: <FaFlag className="w-4 h-4" />,
//       iconContainer: 'bg-red-100 p-2 rounded-full border border-gray-200',
//       iconColor: 'text-red-500',
//       bgColor: 'bg-white',
//       borderColor: 'border-gray-200',
//       textColor: 'text-gray-800',
//       subjectColor: 'text-red-500',
//       borderWidth: 'border',
//       borderRadius: 'rounded-md',
//       width: 'min-w-[200px]',
//       shadow: 'shadow-sm',
//       hoverShadow: 'hover:shadow-md',
//       name: 'Goal',
//     },
//   };

//   const currentStyle = nodeStyles[data.type];
//   const isConditionNode = data.type === 'condition';
//   const isStartNode = data.type === 'start';
//   const isGoalNode = data.type === 'goal';

//   return (
//     <div
//       className={`
//         ${currentStyle.width} 
//         ${currentStyle.borderRadius} 
//         ${currentStyle.bgColor} 
//         ${currentStyle.borderColor} 
//         ${currentStyle.borderWidth} 
//         ${currentStyle.shadow} 
//         ${currentStyle.hoverShadow} 
//         ${selected ? 'border-blue-500 border-2' : ''} 
//         p-3 transition-all duration-150 ease-out relative flex flex-col items-center justify-center
//       `}
//       style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
//     >
//       {/* Input handle (top) - only for non-start nodes */}
//       {!isStartNode && (
//         <Handle 
//           type="target" 
//           position={Position.Top} 
//           className="!w-2.5 !h-2.5 !bg-gray-500 !border-2 !border-white !rounded-full" 
//         />
//       )}
      
//       <div className="flex items-center gap-3">
//         <div className={`${currentStyle.iconContainer} ${currentStyle.iconColor}`}>
//           {currentStyle.icon}
//         </div>
//         <div className="flex-1">
//           <div className="flex items-baseline">
//             <h3 className={`text-sm font-semibold ${currentStyle.textColor}`}>
//               {currentStyle.name}
//             </h3>
//             {data.label && data.label !== currentStyle.name && (
//               <span className={`text-xs ml-2 ${currentStyle.textColor} opacity-70`}>
//                 {data.label}
//               </span>
//             )}
//           </div>
//           {(data.type === 'email' && data.subject || data.type === 'delay' && data.waitingTime) && (
//             <p className={`text-xs mt-1 ${currentStyle.subjectColor}`}>
//               {data.type === 'email' ? data.subject : data.waitingTime}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Output handles */}
//       {isStartNode && (
//         <Handle 
//           type="source" 
//           position={Position.Bottom} 
//           className="!w-2.5 !h-2.5 !bg-gray-500 !border-2 !border-white !rounded-full" 
//         />
//       )}

//       {!isStartNode && !isGoalNode && !isConditionNode && (
//         <Handle 
//           type="source" 
//           position={Position.Bottom} 
//           className="!w-2.5 !h-2.5 !bg-gray-500 !border-2 !border-white !rounded-full" 
//         />
//       )}

//       {isConditionNode && (
//         <>
//           {/* Bottom center handle */}
//           {/* <Handle 
//             type="source" 
//             position={Position.Bottom} 
//             id="main"
//             className="!w-2.5 !h-2.5 !bg-gray-500 !border-2 !border-white !rounded-full" 
//           /> */}
          
//           {/* Bottom left handle (NO) */}
//           <div className="absolute bottom-0 left-1/4 transform -translate-x-1/2 translate-y-1/2">
//             <Handle 
//               type="source" 
//               position={Position.Bottom} 
//               id="no" 
//               className="!w-2.5 !h-2.5 !bg-red-500 !border-2 !border-white !rounded-full"
//             /><p className='text-xs font-bold mt-1 text-red-500 pb-3'>NO</p>
//           </div>
          
//           {/* Bottom right handle (YES) */}
//           <div className="absolute bottom-0 right-1/4 transform translate-x-1/2 translate-y-1/2">
//             <Handle 
//               type="source" 
//               position={Position.Bottom} 
//               id="yes" 
//               className="!w-2.5 !h-2.5 !bg-green-500 !border-2 !border-white !rounded-full"
//             /><p className='text-xs font-bold mt-1 text-green-500 pb-3'>YES</p>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CustomNode;








// 'use client';

// import { FaEnvelope, FaFilter, FaClock, FaFlag, FaPlay } from 'react-icons/fa';
// import { Handle, Position, NodeProps } from 'reactflow';

// interface CustomNodeData {
//   label: string;
//   type: string;
//   subject?: string;
//   body?: string;
//   waitingTime?: string;
// }

// const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
//   // Modern, minimal node styles inspired by Snov.io
//   const nodeStyles = {
//     start: {
//       icon: <FaPlay className="text-white w-4 h-4" />,
//       iconColor: 'text-white',
//       bgColor: 'bg-green-600',
//       borderColor: 'border-green-700/50',
//       textColor: 'text-white',
//       subjectColor: 'text-green-100 text-opacity-90',
//       borderWidth: 'border',
//       borderRadius: 'rounded-md',
//       width: 'min-w-[200px]',
//       shadow: 'shadow-sm',
//       hoverShadow: 'hover:shadow-md',
//     },
//     email: {
//       icon: <FaEnvelope className="w-4 h-4" />,
//       iconContainer: 'bg-blue-100 p-2 rounded-full border border-gray-200',
//       iconColor: 'text-blue-500',
//       bgColor: 'bg-white',
//       borderColor: 'border-gray-200',
//       textColor: 'text-gray-800',
//       subjectColor: 'text-blue-500',
//       borderWidth: 'border',
//       borderRadius: 'rounded-md',
//       width: 'min-w-[220px]',
//       shadow: 'shadow-sm',
//       hoverShadow: 'hover:shadow-md',
//     },
//     condition: {
//       icon: <FaFilter className="w-4 h-4" />,
//       iconContainer: 'bg-green-100 p-2 rounded-full border border-gray-200',
//       iconColor: 'text-green-500',
//       bgColor: 'bg-white',
//       borderColor: 'border-gray-200',
//       textColor: 'text-gray-800',
//       subjectColor: 'text-teal-500',
//       borderWidth: 'border',
//       borderRadius: 'rounded-md',
//       width: 'min-w-[240px]',
//       shadow: 'shadow-sm',
//       hoverShadow: 'hover:shadow-md',
//     },
//     delay: {
//       icon: <FaClock className="w-4 h-4" />,
//       iconContainer: 'bg-yellow-100 p-2 rounded-full border border-gray-200',
//       iconColor: 'text-yellow-500',
//       bgColor: 'bg-white',
//       borderColor: 'border-gray-200',
//       textColor: 'text-gray-800',
//       subjectColor: 'text-amber-500',
//       borderWidth: 'border',
//       borderRadius: 'rounded-md',
//       width: 'min-w-[200px]',
//       shadow: 'shadow-sm',
//       hoverShadow: 'hover:shadow-md',
//     },
//     goal: {
//       icon: <FaFlag className="w-4 h-4" />,
//       iconContainer: 'bg-red-100 p-2 rounded-full border border-gray-200',
//       iconColor: 'text-red-500',
//       bgColor: 'bg-white',
//       borderColor: 'border-gray-200',
//       textColor: 'text-gray-800',
//       subjectColor: 'text-red-500',
//       borderWidth: 'border',
//       borderRadius: 'rounded-md',
//       width: 'min-w-[200px]',
//       shadow: 'shadow-sm',
//       hoverShadow: 'hover:shadow-md',
//     },
//   };

//   const currentStyle = nodeStyles[data.type];
//   const isConditionNode = data.type === 'condition';

//   return (
//     <div
//       className={`
//         ${currentStyle.width} 
//         ${currentStyle.borderRadius} 
//         ${currentStyle.bgColor} 
//         ${currentStyle.borderColor} 
//         ${currentStyle.borderWidth} 
//         ${currentStyle.shadow} 
//         ${currentStyle.hoverShadow} 
//         ${selected ? 'border-blue-500 border-2' : ''} 
//         p-3 transition-all duration-150 ease-out
//       `}
//       style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
//     >
//       <Handle 
//         type="target" 
//         position={Position.Top} 
//         className="!w-2.5 !h-2.5 !bg-gray-500 !border-2 !border-white !rounded-full" 
//       />
      
//       <div className="flex items-center gap-3">
//         <div className={`${currentStyle.iconContainer} ${currentStyle.iconColor}`}>
//           {currentStyle.icon}
//         </div>
//         <div className="flex-1">
//           <h3 className={`text-sm font-semibold ${currentStyle.textColor}`}>
//             {data.label}
//           </h3>
//           {(data.type === 'email' && data.subject || data.type === 'delay' && data.waitingTime) && (
//             <p className={`text-xs mt-1 ${currentStyle.subjectColor}`}>
//               {data.type === 'email' ? data.subject : data.waitingTime}
//             </p>
//           )}
//         </div>
//       </div>

//       <Handle 
//         type="source" 
//         position={Position.Bottom} 
//         className="!w-2.5 !h-2.5 !bg-gray-500 !border-2 !border-white !rounded-full" 
//       />

//       {isConditionNode && (
//         <>
//           <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col items-start ml-[-24px]">
//             <Handle 
//               type="source" 
//               position={Position.Left} 
//               id="no" 
//               className="!w-2.5 !h-2.5 !bg-red-500 !border-2 !border-white !rounded-full"
//             />
//             <span className="text-red-500 text-xs font-medium mt-1.5 bg-white px-1 rounded">NO</span>
//           </div>
//           <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col items-end mr-[-24px]">
//             <Handle 
//               type="source" 
//               position={Position.Right} 
//               id="yes" 
//               className="!w-2.5 !h-2.5 !bg-green-500 !border-2 !border-white !rounded-full"
//             />
//             <span className="text-green-500 text-xs font-medium mt-1.5 bg-white px-1 rounded">YES</span>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CustomNode;






// 'use client';

// import { FaEnvelope, FaFilter, FaClock, FaFlag, FaPlay } from 'react-icons/fa';
// import { Handle, Position, NodeProps } from 'reactflow';

// interface CustomNodeData {
//   label: string;
//   type: string;
//   subject?: string;
//   body?: string;
//   waitingTime?: string;
// }

// const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
//   // Modern, minimal node styles inspired by Snov.io
//   const nodeStyles = {
//     start: {
//       icon: <FaPlay className="text-white w-4 h-4" />,
//       // iconContainer: 'bg-green-600 p-2 rounded-full border border-green-700/30',
//       iconColor: 'text-white',
//       bgColor: 'bg-green-600',
//       borderColor: 'border-green-700/50',
//       textColor: 'text-white',
//       subjectColor: 'text-green-100 text-opacity-90',
//       borderWidth: 'border',
//       borderRadius: 'rounded-md',
//       width: 'min-w-[200px]',
//       shadow: 'shadow-sm',
//       hoverShadow: 'hover:shadow-md',
//     },
//     email: {
//       icon: <FaEnvelope className="w-4 h-4" />,
//       iconContainer: 'bg-blue-100 p-2 rounded-full border border-gray-200',
//       iconColor: 'text-blue-500',
//       bgColor: 'bg-white',
//       borderColor: 'border-gray-200',
//       textColor: 'text-gray-800',
//       subjectColor: 'text-blue-500',
//       borderWidth: 'border',
//       borderRadius: 'rounded-md',
//       width: 'min-w-[220px]',
//       shadow: 'shadow-sm',
//       hoverShadow: 'hover:shadow-md',
//     },
//     condition: {
//       icon: <FaFilter className="w-4 h-4" />,
//       iconContainer: 'bg-green-100 p-2 rounded-full border border-gray-200',
//       iconColor: 'text-green-500',
//       bgColor: 'bg-white',
//       borderColor: 'border-gray-200',
//       textColor: 'text-gray-800',
//       subjectColor: 'text-teal-500',
//       borderWidth: 'border',
//       borderRadius: 'rounded-md',
//       width: 'min-w-[240px]',
//       shadow: 'shadow-sm',
//       hoverShadow: 'hover:shadow-md',
//     },
//     delay: {
//       icon: <FaClock className="w-4 h-4" />,
//       iconContainer: 'bg-yellow-100 p-2 rounded-full border border-gray-200',
//       iconColor: 'text-yellow-500',
//       bgColor: 'bg-white',
//       borderColor: 'border-gray-200',
//       textColor: 'text-gray-800',
//       subjectColor: 'text-amber-500',
//       borderWidth: 'border',
//       borderRadius: 'rounded-md',
//       width: 'min-w-[200px]',
//       shadow: 'shadow-sm',
//       hoverShadow: 'hover:shadow-md',
//     },
//     goal: {
//       icon: <FaFlag className="w-4 h-4" />,
//       iconContainer: 'bg-red-100 p-2 rounded-full border border-gray-200',
//       iconColor: 'text-red-500',
//       bgColor: 'bg-white',
//       borderColor: 'border-gray-200',
//       textColor: 'text-gray-800',
//       subjectColor: 'text-red-500',
//       borderWidth: 'border',
//       borderRadius: 'rounded-md',
//       width: 'min-w-[200px]',
//       shadow: 'shadow-sm',
//       hoverShadow: 'hover:shadow-md',
//     },
//   };

//   const currentStyle = nodeStyles[data.type];
//   const isConditionNode = data.type === 'condition';

//   return (
//     <div
//       className={`
//         ${currentStyle.width} 
//         ${currentStyle.borderRadius} 
//         ${currentStyle.bgColor} 
//         ${currentStyle.borderColor} 
//         ${currentStyle.borderWidth} 
//         ${currentStyle.shadow} 
//         ${currentStyle.hoverShadow} 
//         ${selected ? 'border-blue-500 border-2' : ''} 
//         p-3 transition-all duration-150 ease-out
//       `}
//       style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
//     >
//       <Handle 
//         type="target" 
//         position={Position.Top} 
//         className="!w-2.5 !h-2.5 !bg-gray-500 !border-2 !border-white !rounded-full" 
//       />
      
//       <div className="flex items-center gap-3">
//         <div className={`${currentStyle.iconContainer} ${currentStyle.iconColor}`}>
//           {currentStyle.icon}
//         </div>
//         <div className="flex-1">
//           <h3 className={`text-sm font-semibold ${currentStyle.textColor}`}>
//             {data.label}
//           </h3>
//           {(data.type === 'email' && data.subject || data.type === 'delay' && data.waitingTime) && (
//             <p className={`text-xs mt-1 ${currentStyle.subjectColor}`}>
//               {data.type === 'email' ? data.subject : data.waitingTime}
//             </p>
//           )}
//         </div>
//       </div>

//       <Handle 
//         type="source" 
//         position={Position.Bottom} 
//         className="!w-2.5 !h-2.5 !bg-gray-500 !border-2 !border-white !rounded-full" 
//       />

//       {isConditionNode && (
//         <>
//           <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col items-start ml-[-24px]">
//             <Handle 
//               type="source" 
//               position={Position.Left} 
//               id="no" 
//               className="!w-2.5 !h-2.5 !bg-red-500 !border-2 !border-white !rounded-full"
//             />
//             <span className="text-red-500 text-xs font-medium mt-1.5 bg-white px-1 rounded">NO</span>
//           </div>
//           <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col items-end mr-[-24px]">
//             <Handle 
//               type="source" 
//               position={Position.Right} 
//               id="yes" 
//               className="!w-2.5 !h-2.5 !bg-green-500 !border-2 !border-white !rounded-full"
//             />
//             <span className="text-green-500 text-xs font-medium mt-1.5 bg-white px-1 rounded">YES</span>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CustomNode;






// 'use client';

// import { FaEnvelope, FaFilter, FaClock, FaFlag, FaPlay } from 'react-icons/fa';
// import { Handle, Position, NodeProps } from 'reactflow';

// interface CustomNodeData {
//   label: string;
//   type: string;
//   subject?: string;
//   body?: string;
//   waitingTime?: string;
// }

// const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
//   // Customize each node type's appearance here
//   const nodeStyles = {
//     start: {
//       icon: <FaPlay className="text-white w-5 h-5" />,
//       iconColor: 'text-white',
//       bgColor: 'bg-[#34C759]',
//       borderColor: 'border-[#34C759]',
//       textColor: 'text-white',
//       subjectColor: 'text-white text-opacity-80',
//       borderWidth: 'border-2',
//       borderRadius: 'rounded-xl',
//       width: 'min-w-[220px]',
//     },
//     email: {
//       icon: <FaEnvelope className="w-5 h-5" />,
//       iconContainer: 'bg-white w-65 p-2 rounded-lg',
//       iconColor: 'text-blue-600',
//       bgColor: 'bg-blue-50',
//       borderColor: 'border-blue-200',
//       textColor: 'text-blue-800',
//       subjectColor: 'text-blue-600',
//       borderWidth: 'border',
//       borderRadius: 'rounded-lg',
//       width: 'min-w-[240px]',
//     },
//     condition: {
//       icon: <FaFilter className="w-5 h-5" />,
//       iconContainer: 'bg-white p-2 rounded-lg',
//       iconColor: 'text-green-600',
//       bgColor: 'bg-green-50',
//       borderColor: 'border-green-200',
//       textColor: 'text-green-800',
//       subjectColor: 'text-green-600',
//       borderWidth: 'border',
//       borderRadius: 'rounded-lg',
//       width: 'min-w-[260px]',
//     },
//     delay: {
//       icon: <FaClock className="w-5 h-5" />,
//       iconContainer: 'bg-white p-2 rounded-lg',
//       iconColor: 'text-amber-500',
//       bgColor: 'bg-amber-50',
//       borderColor: 'border-amber-200',
//       textColor: 'text-amber-800',
//       subjectColor: 'text-amber-600',
//       borderWidth: 'border',
//       borderRadius: 'rounded-lg',
//       width: 'min-w-[220px]',
//     },
//     goal: {
//       icon: <FaFlag className="w-5 h-5" />,
//       iconContainer: 'bg-white p-2 rounded-lg',
//       iconColor: 'text-red-600',
//       bgColor: 'bg-red-50',
//       borderColor: 'border-red-200',
//       textColor: 'text-red-800',
//       subjectColor: 'text-red-600',
//       borderWidth: 'border',
//       borderRadius: 'rounded-xl',
//       width: 'min-w-[220px]',
//     },
//   };

//   const currentStyle = nodeStyles[data.type];
//   const isConditionNode = data.type === 'condition';

//   return (
//     <div
//       className={`${currentStyle.width} ${currentStyle.borderRadius} shadow-sm p-4 ${currentStyle.bgColor} ${currentStyle.borderColor} ${currentStyle.borderWidth} ${
//         selected ? 'ring-2 ring-blue-400 shadow-md' : ''
//       } transition-all duration-150 hover:shadow-md`}
//       style={{ fontFamily: "'Inter', sans-serif" }}
//     >
//       <Handle 
//         type="target" 
//         position={Position.Top} 
//         className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white" 
//       />
      
//       <div className="flex items-start gap-3">
//         <div className={`${currentStyle.iconContainer} ${currentStyle.iconColor}`}>
//           {currentStyle.icon}
//         </div>
//         <div className="flex-1">
//           <h3 className={`text-sm font-medium ${currentStyle.textColor}`}>
//             {data.label}
//           </h3>
//           {data.type === 'email' && data.subject && (
//             <p className={`text-xs mt-1 ${currentStyle.subjectColor}`}>{data.subject}</p>
//           )}
//           {data.type === 'delay' && data.waitingTime && (
//             <p className={`text-xs mt-1 ${currentStyle.subjectColor}`}>{data.waitingTime}</p>
//           )}
//         </div>
//       </div>

//       <Handle 
//         type="source" 
//         position={Position.Bottom} 
//         className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white" 
//       />

//       {isConditionNode && (
//         <>
//           <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col items-start ml-[-26px]">
//             <Handle 
//               type="source" 
//               position={Position.Left} 
//               id="no" 
//               className="!w-3 !h-3 !bg-red-400 !border-2 !border-white"
//             />
//             <span className="text-red-500 text-xs font-medium mt-1">NO</span>
//           </div>
//           <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col items-end mr-[-26px]">
//             <Handle 
//               type="source" 
//               position={Position.Right} 
//               id="yes" 
//               className="!w-3 !h-3 !bg-green-400 !border-2 !border-white"
//             />
//             <span className="text-green-500 text-xs font-medium mt-1">YES</span>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CustomNode;










// 'use client';

// import { FaEnvelope, FaFilter, FaClock, FaFlag, FaPlay } from 'react-icons/fa';
// import { Handle, Position, NodeProps } from 'reactflow';

// interface CustomNodeData {
//   label: string;
//   type: string;
//   subject?: string;
//   body?: string;
//   waitingTime?: string;
// }

// const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
//   const iconMap = {
//     start: <FaPlay className="text-white w-5 h-5" />,
//     email: <FaEnvelope className="text-blue-600 w-5 h-5" />,
//     condition: <FaFilter className="text-green-600 w-5 h-5" />,
//     delay: <FaClock className="text-amber-500 w-5 h-5" />,
//     goal: <FaFlag className="text-red-600 w-5 h-5" />,
//   };

//   const bgColorMap = {
//     start: 'bg-[#34C759]',
//     email: 'bg-blue-100',
//     condition: 'bg-green-100',
//     delay: 'bg-amber-100',
//     goal: 'bg-red-100',
//   };

//   const borderColorMap = {
//     start: 'border-[#34C759]',
//     email: 'border-blue-300',
//     condition: 'border-green-300',
//     delay: 'border-amber-300',
//     goal: 'border-red-300',
//   };

//   const textColorMap = {
//     start: 'text-white',
//     email: 'text-blue-800',
//     condition: 'text-green-800',
//     delay: 'text-amber-800',
//     goal: 'text-red-800',
//   };

//   const isStartNode = data.type === 'start';
//   const isConditionNode = data.type === 'condition';

//   return (
//     <div
//       className={`rounded-xl shadow-md p-4 ${bgColorMap[data.type]} ${borderColorMap[data.type]} border-2 ${
//         selected ? 'ring-2 ring-blue-500 ring-opacity-70 shadow-lg' : ''
//       } transition-all duration-200 hover:shadow-md`}
//       style={{ minWidth: '220px', fontFamily: "'Inter', sans-serif" }}
//     >
//       <Handle 
//         type="target" 
//         position={Position.Top} 
//         className="!w-3 !h-3 !bg-gray-500 !border-white !border-2" 
//       />
      
//       <div className="flex items-center space-x-3">
//         <div className={`p-2 rounded-lg ${isStartNode ? 'bg-white bg-opacity-20' : 'bg-white'}`}>
//           {iconMap[data.type]}
//         </div>
//         <div>
//           <span className={`text-sm font-semibold ${textColorMap[data.type]}`}>
//             {data.label}
//           </span>
//           {data.type === 'email' && data.subject && (
//             <p className="text-xs text-blue-600 mt-1 font-medium">{data.subject}</p>
//           )}
//           {data.type === 'delay' && data.waitingTime && (
//             <p className="text-xs text-amber-700 mt-1 font-medium">{data.waitingTime}</p>
//           )}
//         </div>
//       </div>

//       <Handle 
//         type="source" 
//         position={Position.Bottom} 
//         className="!w-3 !h-3 !bg-gray-500 !border-white !border-2"
//       />

//       {isConditionNode && (
//         <>
//           <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col items-start ml-[-28px]">
//             <Handle 
//               type="source" 
//               position={Position.Left} 
//               id="no" 
//               className="!w-3 !h-3 !bg-red-500 !border-white !border-2"
//             />
//             <span className="text-red-600 text-xs font-bold mt-1">NO</span>
//           </div>
//           <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col items-end mr-[-28px]">
//             <Handle 
//               type="source" 
//               position={Position.Right} 
//               id="yes" 
//               className="!w-3 !h-3 !bg-emerald-400 !border-white !border-2"
//             />
//             <span className="text-emerald-600 text-xs font-bold mt-1">YES</span>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default CustomNode;









// 'use client';

// import { FaEnvelope, FaFilter, FaClock, FaFlag, FaPlay } from 'react-icons/fa';
// import { Handle, Position, NodeProps } from 'reactflow';

// interface CustomNodeData {
//   label: string;
//   type: string;
//   subject?: string;
//   body?: string;
//   waitingTime?: string;
// }

// const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected }) => {
//   const iconMap = {
//     start: <FaPlay className="text-white w-4 h-4" />,
//     email: <FaEnvelope className="text-blue-500 w-4 h-4" />,
//     condition: <FaFilter className="text-green-500 w-4 h-4" />,
//     delay: <FaClock className="text-yellow-500 w-4 h-4" />,
//     goal: <FaFlag className="text-red-500 w-4 h-4" />,
//   };

//   const bgColorMap = {
//     start: 'bg-[#34C759]',
//     email: 'bg-blue-50',
//     condition: 'bg-green-50',
//     delay: 'bg-yellow-50',
//     goal: 'bg-red-50',
//   };

//   const borderColorMap = {
//     start: 'border-[#34C759]',
//     email: 'border-blue-200',
//     condition: 'border-green-200',
//     delay: 'border-yellow-200',
//     goal: 'border-red-200',
//   };

//   const isStartNode = data.type === 'start';
//   const isConditionNode = data.type === 'condition';

//   return (
//     <div
//       className={`rounded-lg shadow-sm p-3 ${bgColorMap[data.type]} ${borderColorMap[data.type]} border ${
//         selected ? 'ring-2 ring-blue-500' : ''
//       }`}
//       style={{ minWidth: '200px' }}
//     >
//       <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      
//       <div className="flex items-center space-x-2">
//         {iconMap[data.type]}
//         <span className={`text-sm font-medium ${
//           isStartNode ? 'text-white' : 'text-gray-800'
//         }`}>
//           {data.label}
//         </span>
//       </div>

//       {data.type === 'email' && data.subject && (
//         <p className="text-xs text-gray-600 mt-1 truncate">{data.subject}</p>
//       )}
      
//       {data.type === 'delay' && data.waitingTime && (
//         <p className="text-xs text-yellow-700 mt-1">{data.waitingTime}</p>
//       )}

//       <Handle 
//         type="source" 
//         position={Position.Bottom} 
//         style={{ background: '#555' }} 
//       />

//       {isConditionNode && (
//         <>
//           <Handle 
//             type="source" 
//             position={Position.Left} 
//             id="no" 
//             style={{ background: '#f87171' }} 
//           />
//           <span className="absolute left-[-25px] top-1/2 transform -translate-y-1/2 text-red-500 text-xs">NO</span>
//           <Handle 
//             type="source" 
//             position={Position.Right} 
//             id="yes" 
//             style={{ background: '#34d399' }} 
//           />
//           <span className="absolute right-[-25px] top-1/2 transform -translate-y-1/2 text-green-500 text-xs">YES</span>
//         </>
//       )}
//     </div>
//   );
// };

// export default CustomNode;
