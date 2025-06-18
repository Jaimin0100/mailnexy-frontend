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
  NodeTypes,
  NodeProps,
  EdgeProps,
} from 'reactflow';
import CustomNode from './CustomNode';
import NodeModal from './NodeModal';

// Define type for CustomNode data
interface CustomNodeData {
  label: string;
  type: string;
}

// Define type for NodeModal props (adjust based on your NodeModal implementation)
interface NodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: Node<CustomNodeData> | null;
  onSave: (node: Node<CustomNodeData>) => void;
}

// Define initial nodes as an empty array with explicit Node type
const initialNodes: Node<CustomNodeData>[] = [];

// Define nodeTypes with proper typing for custom nodes
const nodeTypes: NodeTypes = { custom: CustomNode };

const WorkflowCanvas: React.FC = () => {
  const [nodes, setNodes] = useState<Node<CustomNodeData>[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(true); // State to control popup visibility

  const onDrop = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    const position = { x: event.clientX - 50, y: event.clientY - 50 };
    const newNode: Node<CustomNodeData> = {
      id: `${type}-${Date.now()}`,
      type: 'custom',
      data: { label: type.charAt(0).toUpperCase() + type.slice(1), type },
      position,
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const onNodeClick = (_event: React.MouseEvent, node: Node<CustomNodeData>): void => {
    setSelectedNode(node);
  };

  const onSaveNode = (updatedNode: Node<CustomNodeData>): void => {
    setNodes((nds) => nds.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
  };

  // Handle selection from popup
  const handleSelection = (option: 'template' | 'scratch'): void => {
    if (option === 'scratch') {
      // Example: Add a default node for "Create from Scratch"
      const newNode: Node<CustomNodeData> = {
        id: `start-${Date.now()}`,
        type: 'custom',
        data: { label: 'Start', type: 'start' },
        position: { x: 100, y: 100 },
      };
      setNodes([newNode]);
    } else if (option === 'template') {
      // Example: Load a template (you can customize this)
      const templateNodes: Node<CustomNodeData>[] = [
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
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex space-x-8">
            <button
              onClick={() => handleSelection('template')}
              className="text-center focus:outline-none hover:scale-105 transition-transform"
            >
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800">Use a template</h3>
              <p className="text-sm text-gray-500">Personalize the framework to reflect your style</p>
            </button>
            <button
              onClick={() => handleSelection('scratch')}
              className="text-center focus:outline-none hover:scale-105 transition-transform"
            >
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800">Create from Scratch</h3>
              <p className="text-sm text-gray-500">Follow a simple step process to build a new drip campaign</p>
            </button>
          </div>
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes: OnNodesChange) => setNodes((nds) =>
            changes.reduce((acc: Node<CustomNodeData>[], change) => {
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
};

export default WorkflowCanvas;














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