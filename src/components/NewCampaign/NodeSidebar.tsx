"use client";

import { FaEnvelope, FaFilter, FaClock, FaFlag } from "react-icons/fa";

export default function NodeSidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-18 rounded-lg  p-4 flex flex-col items-center space-y-4">
      <div
        draggable
        onDragStart={(e) => onDragStart(e, "email")}
        className="p-2 cursor-pointer bg-white border w-18 border-gray-300 rounded-lg"
      >
        <div className="flex flex-col items-center">
          <div className="bg-blue-100 rounded-full p-2">
            <FaEnvelope className="text-blue-500 w-6 h-6" />
          </div>
          <span className="text-xs text-gray-700 mt-1">Email</span>
        </div>
      </div>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, "condition")}
        className="p-2 cursor-pointer bg-white w-18 border border-gray-300 rounded-lg"
      >
        <div className="flex flex-col items-center">
          <div className="bg-green-100 rounded-full p-2">
            <FaFilter className="text-green-500 w-6 h-6" />
          </div>
          <span className="text-xs text-gray-700 mt-1">Condition</span>
        </div>
      </div>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, "delay")}
        className="p-2 cursor-pointer bg-white w-18 border border-gray-300 rounded-lg"
      >
        <div className="flex flex-col items-center">
          <div className="bg-yellow-100 rounded-full p-2">
            <FaClock className="text-yellow-500 w-6 h-6" />
          </div>
          <span className="text-xs text-gray-700 mt-1">Delay</span>
        </div>
      </div>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, "goal")}
        className="p-2 cursor-pointer bg-white w-18 border border-gray-300 rounded-lg"
      >
        <div className="flex flex-col items-center">
          <div className="bg-red-100 rounded-full p-2">
            <FaFlag className="text-red-500 w-6 h-6" />
          </div>
          <span className="text-xs text-gray-700 mt-1">Goal</span>
        </div>
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
//     <div className="w-16 bg-white rounded-lg shadow-md p-2 flex flex-col items-center space-y-2">
//       <div
//         draggable
//         onDragStart={(e) => onDragStart(e, 'email')}
//         className="p-2 cursor-pointer hover:bg-gray-100 rounded-full"
//       >
//         <div className="flex flex-col items-center">
//           <FaEnvelope className="text-blue-500 w-6 h-6" />
//           <span className="text-xs text-gray-700 mt-1">Email</span>
//         </div>
//       </div>
//       <div
//         draggable
//         onDragStart={(e) => onDragStart(e, 'condition')}
//         className="p-2 cursor-pointer hover:bg-gray-100 rounded-full"
//       >
//         <div className="flex flex-col items-center">
//           <FaFilter className="text-green-500 w-6 h-6" />
//           <span className="text-xs text-gray-700 mt-1">Condition</span>
//         </div>
//       </div>
//       <div
//         draggable
//         onDragStart={(e) => onDragStart(e, 'delay')}
//         className="p-2 cursor-pointer hover:bg-gray-100 rounded-full"
//       >
//         <div className="flex flex-col items-center">
//           <FaClock className="text-yellow-500 w-6 h-6" />
//           <span className="text-xs text-gray-700 mt-1">Delay</span>
//         </div>
//       </div>
//       <div
//         draggable
//         onDragStart={(e) => onDragStart(e, 'goal')}
//         className="p-2 cursor-pointer hover:bg-gray-100 rounded-full"
//       >
//         <div className="flex flex-col items-center">
//           <FaFlag className="text-red-500 w-6 h-6" />
//           <span className="text-xs text-gray-700 mt-1">Goal</span>
//         </div>
//       </div>
//     </div>
//   );
// }











// 'use client';

// import { FaEnvelope, FaFilter, FaClock, FaFlag } from 'react-icons/fa';

// export default function NodeSidebar() {
//   const onDragStart = (event: React.DragEvent, nodeType: string) => {
//     event.dataTransfer.setData('application/reactflow', nodeType);
//     event.dataTransfer.effectAllowed = 'move';
//   };

//   return (
//     <div className="w-16 bg-white rounded-lg shadow-md p-2 flex flex-col items-center space-y-2">
//       <div
//         draggable
//         onDragStart={(e) => onDragStart(e, 'email')}
//         className="p-2 cursor-pointer hover:bg-gray-100 rounded"
//       >
//         <FaEnvelope className="text-blue-500 w-6 h-6" />
//       </div>
//       <div
//         draggable
//         onDragStart={(e) => onDragStart(e, 'condition')}
//         className="p-2 cursor-pointer hover:bg-gray-100 rounded"
//       >
//         <FaFilter className="text-green-500 w-6 h-6" />
//       </div>
//       <div
//         draggable
//         onDragStart={(e) => onDragStart(e, 'delay')}
//         className="p-2 cursor-pointer hover:bg-gray-100 rounded"
//       >
//         <FaClock className="text-yellow-500 w-6 h-6" />
//       </div>
//       <div
//         draggable
//         onDragStart={(e) => onDragStart(e, 'goal')}
//         className="p-2 cursor-pointer hover:bg-gray-100 rounded"
//       >
//         <FaFlag className="text-red-500 w-6 h-6" />
//       </div>
//     </div>
//   );
// }








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