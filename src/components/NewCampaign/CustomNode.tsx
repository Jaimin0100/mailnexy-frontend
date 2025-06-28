'use client';

import { FaEnvelope, FaFilter, FaClock, FaFlag, FaPlay, FaCodeBranch } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { Handle, Position, NodeProps } from 'reactflow';



interface CustomNodeData {
  label: string;
  type: string;
  subject?: string;
  body?: string;
  waitingTime?: string;
  splitPercentage?: number; // For A/B testing
  onDelete?: (id: string) => void;
}

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, selected, id  }) => {

  const displayName = data.label || data.type;
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
      textColor: 'text-gray-800',
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

  // FALLBACK STYLE FOR UNKNOWN TYPES
  const defaultStyle = {
    icon: <FaEnvelope className="w-4 h-4" />,
    iconContainer: 'bg-gray-100 p-2 rounded-full border border-gray-200',
    iconColor: 'text-gray-500',
    bgColor: 'bg-white',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-800',
    subjectColor: 'text-gray-500',
    borderWidth: 'border',
    borderRadius: 'rounded-md',
    width: 'min-w-[200px]',
    shadow: 'shadow-sm',
    hoverShadow: 'hover:shadow-md',
    name: 'Unknown',
  };

  // Use fallback style for unknown types
  const currentStyle = nodeStyles[data.type as keyof typeof nodeStyles] || defaultStyle;
  
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
        p-3 transition-all duration-150 ease-out relative flex flex-col items-center justify-center group
      `}
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
       <button
        className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-10"
        onClick={(e) => {
          e.stopPropagation();
          if (data.onDelete) {
            data.onDelete(id);
          }
        }}
      >
        <FiX size={14} />
      </button>
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
              {displayName} {/* Use displayName instead of currentStyle.name */}
              {/* {currentStyle.name} */}
            </h3>
            {data.label && data.label !== currentStyle.name && (
              <span className={`text-xs ml-2 ${currentStyle.textColor} opacity-70`}>
                {data.label}
              </span>
            )}
          </div>
          {/* {(data.type === 'email' && data.subject || 
            data.type === 'delay' && data.waitingTime ||
            data.type === 'abTest' && data.splitPercentage) && (
            <p className={`text-xs mt-1 ${currentStyle.subjectColor}`}>
              {data.type === 'email' ? data.subject : 
               data.type === 'delay' ? data.waitingTime :
               `Split: ${data.splitPercentage}% / ${100 - (data.splitPercentage || 50)}%`}
            </p>
          )} */}
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