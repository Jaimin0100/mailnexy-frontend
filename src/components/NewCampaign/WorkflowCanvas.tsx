'use client';

import { useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Node, 
  Edge, 
  OnNodesChange, 
  OnEdgesChange, 
  OnConnect, 
  NodeTypes 
} from 'reactflow';
import CustomNode from './CustomNode';
import NodeModal from './NodeModal';

// Define initial nodes as an empty array with explicit Node type
const initialNodes: Node[] = [];

// Define nodeTypes with proper typing for custom nodes
const nodeTypes: NodeTypes = { custom: CustomNode };

export default function WorkflowCanvas() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(true); // State to control popup visibility

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    const position = { x: event.clientX - 50, y: event.clientY - 50 };
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type: 'custom',
      data: { label: type.charAt(0).toUpperCase() + type.slice(1), type },
      position,
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const onNodeClick = (_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const onSaveNode = (updatedNode: Node) => {
    setNodes((nds) => nds.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
  };

  // Handle selection from popup
  const handleSelection = (option: 'template' | 'scratch') => {
    if (option === 'scratch') {
      const newNode: Node = {
        id: `start-${Date.now()}`,
        type: 'custom',
        data: { label: 'Start', type: 'start' },
        position: { x: 100, y: 100 },
      };
      setNodes([newNode]);
    } else if (option === 'template') {
      const templateNodes: Node[] = [
        {
          id: `template-${Date.now()}`,
          type: 'custom',
          data: { label: 'Template Node', type: 'template' },
          position: { x: 100, y: 100 },
        },
      ];
      setNodes(templateNodes);
    }
    setIsPopupOpen(false); // Close popup after selection
  };

  return (
    <div
      className="h-[600px] w-full border rounded-lg bg-white shadow-md relative"
      onDrop={onDrop}
      onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
    >
      {isPopupOpen && nodes.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            {/* Header with Title and Close Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Create Campaign</h2>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Options */}
            <div className="flex justify-between space-x-6">
              <button
                onClick={() => handleSelection('template')}
                className="text-center focus:outline-none hover:scale-105 transition-transform flex-1"
              >
                <div className="mb-4">
                  <img
                    src="/useatemplate.png"
                    alt="Use a template"
                    className="w-16 h-16 mx-auto"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-800">Use a template</h3>
                <p className="text-sm text-gray-500">Personalize the framework to reflect your style</p>
              </button>
              <button
                onClick={() => handleSelection('scratch')}
                className="text-center focus:outline-none hover:scale-105 transition-transform flex-1"
              >
                <div className="mb-4">
                  <img
                    src="/createfromscretch.png"
                    alt="Create from Scratch"
                    className="w-16 h-16 mx-auto"
                  />
                </div>
                <h3 className="text-lg font-medium text-gray-800">Create from Scratch</h3>
                <p className="text-sm text-gray-500">Follow a simple step process to build a new drip campaign</p>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes: OnNodesChange) => setNodes((nds) =>
            changes.reduce((acc: Node[], change) => {
              const node = acc.find((n) => n.id === change.id);
              if (!node) return acc;
              return [...acc.filter((n) => n.id !== change.id), { ...node, ...change }];
            }, nds)
          )}
          onEdgesChange={(changes: OnEdgesChange) => setEdges((eds) =>
            changes.reduce((acc: Edge[], change) => {
              const edge = acc.find((e) => e.id === change.id);
              if (!edge) return acc;
              return [...acc.filter((e) => e.id !== change.id), { ...edge, ...change }];
            }, eds)
          )}
          onConnect={(params: OnConnect) => setEdges((eds) => eds.concat(params))}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
        >
          <Background />
          <Controls />
        </ReactFlow>
      )}
      <NodeModal
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        node={selectedNode}
        onSave={onSaveNode}
      />
    </div>
  );
}










// 'use client';

// import { useState } from 'react';
// import ReactFlow, { Background, Controls, Node, Edge } from 'reactflow';
// import CustomNode from './CustomNode';
// import NodeModal from './NodeModal';

// const initialNodes: Node[] = [
//   { id: 'start', type: 'input', data: { label: 'Start' }, position: { x: 250, y: 5 } },
// ];

// const nodeTypes = { custom: CustomNode };

// export default function WorkflowCanvas() {
//   const [nodes, setNodes] = useState<Node[]>(initialNodes);
//   const [edges, setEdges] = useState<Edge[]>([]);
//   const [selectedNode, setSelectedNode] = useState<Node | null>(null);

//   const onDrop = (event: React.DragEvent) => {
//     event.preventDefault();
//     const type = event.dataTransfer.getData('application/reactflow');
//     const position = { x: event.clientX - 50, y: event.clientY - 50 };
//     const newNode: Node = {
//       id: `${type}-${Date.now()}`,
//       type: 'custom',
//       data: { label: type.charAt(0).toUpperCase() + type.slice(1), type },
//       position,
//     };
//     setNodes((nds) => nds.concat(newNode));
//   };

//   const onNodeClick = (event: React.MouseEvent, node: Node) => {
//     setSelectedNode(node);
//   };

//   const onSaveNode = (updatedNode: Node) => {
//     setNodes((nds) => nds.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
//   };

//   return (
//     <div
//       className="h-[600px] w-full border rounded bg-white"
//       onDrop={onDrop}
//       onDragOver={(e) => e.preventDefault()}
//     >
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={(changes) => setNodes((nds) => changes.reduce((acc, change) => {
//           const node = acc.find((n) => n.id === change.id);
//           if (!node) return acc;
//           return [...acc.filter((n) => n.id !== change.id), { ...node, ...change }];
//         }, nds))}
//         onEdgesChange={(changes) => setEdges((eds) => changes.reduce((acc, change) => {
//           const edge = acc.find((e) => e.id === change.id);
//           if (!edge) return acc;
//           return [...acc.filter((e) => e.id !== change.id), { ...edge, ...change }];
//         }, eds))}
//         onConnect={(params) => setEdges((eds) => eds.concat(params))}
//         onNodeClick={onNodeClick}
//         nodeTypes={nodeTypes}
//       >
//         <Background />
//         <Controls />
//       </ReactFlow>
//       <NodeModal
//         isOpen={!!selectedNode}
//         onClose={() => setSelectedNode(null)}
//         node={selectedNode}
//         onSave={onSaveNode}
//       />
//     </div>
//   );
// }