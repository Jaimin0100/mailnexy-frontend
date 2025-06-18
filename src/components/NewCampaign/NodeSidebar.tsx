'use client';

import { FaEnvelope, FaFilter, FaClock, FaFlag } from 'react-icons/fa';

export default function NodeSidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-16 bg-white rounded-lg shadow-md p-2 flex flex-col items-center space-y-2">
      <div
        draggable
        onDragStart={(e) => onDragStart(e, 'email')}
        className="p-2 cursor-pointer hover:bg-gray-100 rounded"
      >
        <FaEnvelope className="text-blue-500 w-6 h-6" />
      </div>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, 'condition')}
        className="p-2 cursor-pointer hover:bg-gray-100 rounded"
      >
        <FaFilter className="text-green-500 w-6 h-6" />
      </div>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, 'delay')}
        className="p-2 cursor-pointer hover:bg-gray-100 rounded"
      >
        <FaClock className="text-yellow-500 w-6 h-6" />
      </div>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, 'goal')}
        className="p-2 cursor-pointer hover:bg-gray-100 rounded"
      >
        <FaFlag className="text-red-500 w-6 h-6" />
      </div>
    </div>
  );
}








// 'use client';

// import { FaEnvelope, FaFilter, FaClock, FaFlag } from 'react-icons/fa';

// export default function NodeSidebar() {
//   const onDragStart = (event: React.DragEvent, nodeType: string) => {
//     event.dataTransfer.setData('application/reactflow', nodeType);
//     event.dataTransfer.effectAllowed = 'move';
//   };

//   return (
//     <div className="w-16 bg-gray-100 p-2 flex flex-col items-center">
//       <div
//         draggable
//         onDragStart={(e) => onDragStart(e, 'email')}
//         className="p-2 cursor-pointer hover:bg-gray-200 rounded"
//       >
//         <FaEnvelope className="text-blue-500" />
//       </div>
//       <div
//         draggable
//         onDragStart={(e) => onDragStart(e, 'condition')}
//         className="p-2 cursor-pointer hover:bg-gray-200 rounded"
//       >
//         <FaFilter className="text-green-500" />
//       </div>
//       <div
//         draggable
//         onDragStart={(e) => onDragStart(e, 'delay')}
//         className="p-2 cursor-pointer hover:bg-gray-200 rounded"
//       >
//         <FaClock className="text-yellow-500" />
//       </div>
//       <div
//         draggable
//         onDragStart={(e) => onDragStart(e, 'goal')}
//         className="p-2 cursor-pointer hover:bg-gray-200 rounded"
//       >
//         <FaFlag className="text-red-500" />
//       </div>
//     </div>
//   );
// }