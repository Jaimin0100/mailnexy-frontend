'use client';

import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
  MarkerType,
  applyEdgeChanges,
  applyNodeChanges,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import NodeModal from './NodeModal';
import { getAllFlows, saveFlow } from '@/utils/useWorkflowStore';

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 5 },
    data: { label: 'Start', type: 'start' },
  },
];

const initialEdges: Edge[] = [];

const WorkflowCanvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");

  // Load saved flows
  useEffect(() => {
    const flows = getAllFlows();
    if (Object.keys(flows).length > 0) {
      const firstFlow = flows[Object.keys(flows)[0]];
      setNodes(firstFlow.nodes || initialNodes);
      setEdges(firstFlow.edges || initialEdges);
      setWorkflowName(firstFlow.name || "Untitled Workflow");
    }
  }, []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => {
      // Prevent duplicate connections
      const exists = eds.some(
        (e) => e.source === params.source && e.target === params.target
      );
      if (exists) return eds;
      return addEdge(
        { 
          ...params, 
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          animated: true 
        }, 
        eds
      );
    }),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('label');

      if (typeof type === 'undefined' || !type) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: Node = {
        id: `${Date.now()}`,
        type: 'custom',
        position,
        data: { label, type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const simulateFlow = () => {
    const visited = new Set();
    const log: string[] = [];

    const getNextByHandle = (nodeId: string, handleId?: string) =>
      edges
        .filter((e) => e.source === nodeId && (!handleId || e.sourceHandle === handleId))
        .map((e) => nodes.find((n) => n.id === e.target))
        .filter(Boolean) as Node[];

    const dfs = (node: Node | undefined) => {
      if (!node || visited.has(node.id)) return;
      visited.add(node.id);

      switch (node.data.type) {
        case 'start':
          log.push('🚀 Start Node');
          break;
        case 'email':
          log.push(`📧 Email: ${node.data.subject || 'No Subject'}`);
          break;
        case 'delay':
          log.push(`⏱️ Delay: ${node.data.waitingTime || 'No delay set'}`);
          break;
        case 'condition':
          log.push(`🔀 Condition: ${node.data.waitingTime || 'No condition set'}`);

          const nextYes = getNextByHandle(node.id, 'yes');
          const nextNo = getNextByHandle(node.id, 'no');

          if (nextYes.length) {
            log.push('✅ Going to YES path');
            nextYes.forEach(dfs);
          }

          if (nextNo.length) {
            log.push('❌ Going to NO path');
            nextNo.forEach(dfs);
          }

          return;

        case 'goal':
          log.push('🎯 Goal Reached!');
          return;

        default:
          log.push(`⚙️ ${node.data.label}`);
          return;
      }

      // Continue to next node
      const nextNodes = getNextByHandle(node.id);
      nextNodes.forEach(dfs);
    };

    const start = nodes.find((n) => n.data.type === 'start') || nodes[0];
    dfs(start);

    alert('Simulation Result:\n\n' + log.join('\n'));
  };

  const handleSave = () => {
    saveFlow(workflowName, { name: workflowName, nodes, edges });
    alert("✅ Workflow saved!");
  };

  return (
    <div className="flex-1 h-full" ref={reactFlowWrapper}>
      <ReactFlowProvider>
        {/* Workflow name input */}
        <input
          type="text"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          className="absolute text-[#53545C] top-[-80] left-4 px-4 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 z-5"
          placeholder="Enter workflow name"
        />

        {/* Action buttons */}
        <div className="absolute top-110 right-1 z-5 flex gap-2">
          <button
            onClick={simulateFlow}
            className="bg-[#5570F1] text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            ▶ Run Simulation
          </button>
          <button
            onClick={handleSave}
            className="bg-purple-400 text-white px-4 py-2 rounded"
          >
            💾 Save Workflow
          </button>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={() => console.log('Flow initialized')}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
          onNodeClick={(_, node) => setSelectedNode(node)}
          onNodeContextMenu={(_, node) => {
            if (confirm(`Delete node "${node.data.label}"?`)) {
              setNodes((nds) => nds.filter((n) => n.id !== node.id));
              setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
            }
          }}
          onEdgeClick={(_, edge) => {
            if (confirm(`Delete this connection from "${edge.source}" to "${edge.target}"?`)) {
              setEdges((eds) => eds.filter((e) => e.id !== edge.id));
            }
          }}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </ReactFlowProvider>

      {/* Node configuration modal */}
      <NodeModal
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        node={selectedNode}
        onSave={(updatedNode: Node) => {
          setNodes((nds) =>
            nds.map((n) => (n.id === updatedNode.id ? updatedNode : n))
          );
          setSelectedNode(null);
        }}
      />
    </div>
  );
};

export default WorkflowCanvas;








// 'use client';

// import React, { useCallback, useRef, useState, useEffect } from 'react';
// import ReactFlow, {
//   ReactFlowProvider,
//   addEdge,
//   useNodesState,
//   useEdgesState,
//   Controls,
//   Background,
//   Connection,
//   Edge,
//   Node,
//   MarkerType,
//   applyEdgeChanges,
//   applyNodeChanges,
//   NodeChange,
//   EdgeChange,
// } from 'reactflow';
// import 'reactflow/dist/style.css';
// import CustomNode from './CustomNode';
// import NodeModal from './NodeModal';
// import { getAllFlows, saveFlow } from '@/utils/useWorkflowStore';

// const nodeTypes = {
//   custom: CustomNode,
// };

// const initialNodes: Node[] = [
//   {
//     id: '1',
//     type: 'custom',
//     position: { x: 250, y: 5 },
//     data: { label: 'Start', type: 'start' },
//   },
// ];

// const initialEdges: Edge[] = [];

// const WorkflowCanvas = () => {
//   const reactFlowWrapper = useRef<HTMLDivElement>(null);
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
//   const [selectedNode, setSelectedNode] = useState<Node | null>(null);
//   const [workflowName, setWorkflowName] = useState("Untitled Workflow");

//   // Load saved flows
//   useEffect(() => {
//     const flows = getAllFlows();
//     if (Object.keys(flows).length > 0) {
//       const firstFlow = flows[Object.keys(flows)[0]];
//       setNodes(firstFlow.nodes || initialNodes);
//       setEdges(firstFlow.edges || initialEdges);
//       setWorkflowName(firstFlow.name || "Untitled Workflow");
//     }
//   }, []);

//   const onConnect = useCallback(
//     (params: Connection) => setEdges((eds) => {
//       // Prevent duplicate connections
//       const exists = eds.some(
//         (e) => e.source === params.source && e.target === params.target
//       );
//       if (exists) return eds;
//       return addEdge(
//         { 
//           ...params, 
//           markerEnd: {
//             type: MarkerType.ArrowClosed,
//           },
//           animated: true 
//         }, 
//         eds
//       );
//     }),
//     [setEdges]
//   );

//   const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = 'move';
//   }, []);

//   const onDrop = useCallback(
//     (event: React.DragEvent<HTMLDivElement>) => {
//       event.preventDefault();

//       if (!reactFlowWrapper.current) return;

//       const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
//       const type = event.dataTransfer.getData('application/reactflow');
//       const label = event.dataTransfer.getData('label');

//       if (typeof type === 'undefined' || !type) return;

//       const position = {
//         x: event.clientX - reactFlowBounds.left,
//         y: event.clientY - reactFlowBounds.top,
//       };

//       const newNode: Node = {
//         id: `${Date.now()}`,
//         type: 'custom',
//         position,
//         data: { label, type },
//       };

//       setNodes((nds) => nds.concat(newNode));
//     },
//     [setNodes]
//   );

//   const simulateFlow = () => {
//     const visited = new Set();
//     const log: string[] = [];

//     const getNextByHandle = (nodeId: string, handleId?: string) =>
//       edges
//         .filter((e) => e.source === nodeId && (!handleId || e.sourceHandle === handleId))
//         .map((e) => nodes.find((n) => n.id === e.target))
//         .filter(Boolean) as Node[];

//     const dfs = (node: Node | undefined) => {
//       if (!node || visited.has(node.id)) return;
//       visited.add(node.id);

//       switch (node.data.type) {
//         case 'start':
//           log.push('🚀 Start Node');
//           break;
//         case 'email':
//           log.push(`📧 Email: ${node.data.subject || 'No Subject'}`);
//           break;
//         case 'delay':
//           log.push(`⏱️ Delay: ${node.data.waitingTime || 'No delay set'}`);
//           break;
//         case 'condition':
//           log.push(`🔀 Condition: ${node.data.waitingTime || 'No condition set'}`);

//           const nextYes = getNextByHandle(node.id, 'yes');
//           const nextNo = getNextByHandle(node.id, 'no');

//           if (nextYes.length) {
//             log.push('✅ Going to YES path');
//             nextYes.forEach(dfs);
//           }

//           if (nextNo.length) {
//             log.push('❌ Going to NO path');
//             nextNo.forEach(dfs);
//           }

//           return;

//         case 'goal':
//           log.push('🎯 Goal Reached!');
//           return;

//         default:
//           log.push(`⚙️ ${node.data.label}`);
//           return;
//       }

//       // Continue to next node
//       const nextNodes = getNextByHandle(node.id);
//       nextNodes.forEach(dfs);
//     };

//     const start = nodes.find((n) => n.data.type === 'start') || nodes[0];
//     dfs(start);

//     alert('Simulation Result:\n\n' + log.join('\n'));
//   };

//   const handleSave = () => {
//     saveFlow(workflowName, { name: workflowName, nodes, edges });
//     alert("✅ Workflow saved!");
//   };

//   return (
//     <div className="flex-1 h-full" ref={reactFlowWrapper}>
//       <ReactFlowProvider>
//         {/* Workflow name input */}
//         <input
//           type="text"
//           value={workflowName}
//           onChange={(e) => setWorkflowName(e.target.value)}
//           className="absolute text-[#53545C] top-[-80] left-4 px-4 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 z-5"
//           placeholder="Enter workflow name"
//         />

//         {/* Action buttons */}
//         <div className="absolute top-110 right-1 z-5 flex gap-2">
//           <button
//             onClick={simulateFlow}
//             className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
//           >
//             ▶ Run Simulation
//           </button>
//           <button
//             onClick={handleSave}
//             className="bg-purple-600 text-white px-4 py-2 rounded"
//           >
//             💾 Save Workflow
//           </button>
//         </div>

//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           onInit={() => console.log('Flow initialized')}
//           onDragOver={onDragOver}
//           onDrop={onDrop}
//           nodeTypes={nodeTypes}
//           fitView
//           onNodeClick={(_, node) => setSelectedNode(node)}
//           onNodeContextMenu={(_, node) => {
//             if (confirm(`Delete node "${node.data.label}"?`)) {
//               setNodes((nds) => nds.filter((n) => n.id !== node.id));
//               setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
//             }
//           }}
//           onEdgeClick={(_, edge) => {
//             if (confirm(`Delete this connection from "${edge.source}" to "${edge.target}"?`)) {
//               setEdges((eds) => eds.filter((e) => e.id !== edge.id));
//             }
//           }}
//         >
//           <Controls />
//           <Background />
//         </ReactFlow>
//       </ReactFlowProvider>

//       {/* Node configuration modal */}
//       <NodeModal
//         isOpen={!!selectedNode}
//         onClose={() => setSelectedNode(null)}
//         node={selectedNode}
//         onSave={(updatedNode: Node) => {
//           setNodes((nds) =>
//             nds.map((n) => (n.id === updatedNode.id ? updatedNode : n))
//           );
//           setSelectedNode(null);
//         }}
//       />
//     </div>
//   );
// };

// export default WorkflowCanvas;












// 'use client';

// import React, { useCallback, useRef } from 'react';
// import ReactFlow, {
//   ReactFlowProvider,
//   addEdge,
//   useNodesState,
//   useEdgesState,
//   Controls,
//   Background,
//   Connection,
//   Edge,
//   Node,
//   MarkerType,
// } from 'reactflow';
// import 'reactflow/dist/style.css';
// import CustomNode from './CustomNodes';

// const nodeTypes = {
//   custom: CustomNode,
// };

// const initialNodes: Node[] = [
//   {
//     id: '1',
//     type: 'custom',
//     position: { x: 250, y: 5 },
//     data: { label: 'Start', type: 'start' },
//   },
// ];

// const initialEdges: Edge[] = [];

// const WorkflowCanvas = () => {
//   const reactFlowWrapper = useRef<HTMLDivElement>(null);
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

//   const onConnect = useCallback(
//     (params: Connection) => setEdges((eds) => addEdge(
//       { 
//         ...params, 
//         markerEnd: {
//           type: MarkerType.ArrowClosed,
//         },
//         animated: true 
//       }, 
//       eds)
//     ),
//     [setEdges]
//   );

//   const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     event.dataTransfer.dropEffect = 'move';
//   }, []);

//   const onDrop = useCallback(
//     (event: React.DragEvent<HTMLDivElement>) => {
//       event.preventDefault();

//       if (!reactFlowWrapper.current) return;

//       const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
//       const type = event.dataTransfer.getData('application/reactflow');
//       const label = event.dataTransfer.getData('label');

//       // Check if the dropped element is valid
//       if (typeof type === 'undefined' || !type) {
//         return;
//       }

//       const position = {
//         x: event.clientX - reactFlowBounds.left,
//         y: event.clientY - reactFlowBounds.top,
//       };

//       const newNode: Node = {
//         id: `${Date.now()}`,
//         type: 'custom',
//         position,
//         data: { label, type },
//       };

//       setNodes((nds) => nds.concat(newNode));
//     },
//     [setNodes]
//   );

//   return (
//     <div className="flex-1 h-full" ref={reactFlowWrapper}>
//       <ReactFlowProvider>
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onConnect={onConnect}
//           onInit={() => console.log('Flow initialized')}
//           onDragOver={onDragOver}
//           onDrop={onDrop}
//           nodeTypes={nodeTypes}
//           fitView
//         >
//           <Controls />
//           <Background />
//         </ReactFlow>
//       </ReactFlowProvider>
//     </div>
//   );
// };

// export default WorkflowCanvas;
