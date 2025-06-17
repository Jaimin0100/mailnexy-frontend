'use client';

import { useState } from 'react';
import ReactFlow, { Background, Controls, Node, Edge } from 'react-flow-renderer';
import CustomNode from './CustomNode';
import NodeModal from './NodeModal';

const initialNodes: Node[] = [
  { id: 'start', type: 'input', data: { label: 'Start' }, position: { x: 250, y: 5 } },
];

const nodeTypes = { custom: CustomNode };

export default function WorkflowCanvas() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onDrop = (event: React.DragEvent) => {
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

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const onSaveNode = (updatedNode: Node) => {
    setNodes((nds) => nds.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
  };

  return (
    <div
      className="h-[600px] w-full border rounded bg-white"
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => setNodes((nds) => changes.reduce((acc, change) => {
          const node = acc.find((n) => n.id === change.id);
          if (!node) return acc;
          return [...acc.filter((n) => n.id !== change.id), { ...node, ...change }];
        }, nds))}
        onEdgesChange={(changes) => setEdges((eds) => changes.reduce((acc, change) => {
          const edge = acc.find((e) => e.id === change.id);
          if (!edge) return acc;
          return [...acc.filter((e) => e.id !== change.id), { ...edge, ...change }];
        }, eds))}
        onConnect={(params) => setEdges((eds) => eds.concat(params))}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
      <NodeModal
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        node={selectedNode}
        onSave={onSaveNode}
      />
    </div>
  );
}