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
  Panel,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import _ from 'lodash'; // Add this at the top
import CustomNode from './CustomNode';
import NodeModal from './NodeModal';
import { campaignAPI } from '@/utils/api';

const nodeTypes = {
  start: CustomNode,
  email: CustomNode,
  condition: CustomNode,
  delay: CustomNode,
  goal: CustomNode,
  abTest: CustomNode,
  custom: CustomNode, // keep as fallback
};

interface WorkflowCanvasProps {
  campaignId?: string;
  campaignName: string; // NEW: Receive name from parent
  onSaveSuccess: (campaign: any) => void; // NEW: Save callback
}

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'start',
    position: { x: 250, y: 5 },
    data: { label: 'Start', type: 'start' },
  },
];

const initialEdges: Edge[] = [];

const MULTI_OUTPUT_NODES = ['condition', 'abTest'];
const AUTO_SAVE_INTERVAL = 60000; // 60 seconds

const WorkflowCanvas = ({ campaignId: propCampaignId, campaign: propCampaign, campaignName, onSaveSuccess }: WorkflowCanvasProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [workflowName, setWorkflowName] = useState(campaignName);
  const [rfInstance, setRfInstance] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [lastSavedNodes, setLastSavedNodes] = useState<Node[]>([]);
  const [lastSavedEdges, setLastSavedEdges] = useState<Edge[]>([]);
  const [lastSavedName, setLastSavedName] = useState("Untitled Workflow");
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        if (propCampaignId) {
          const flowResponse = await campaignAPI.getCampaignFlow(propCampaignId);
          const flowData = flowResponse.data;
          console.log('Fetched flow data:', flowData);

          const campaignResponse = await campaignAPI.getCampaign(propCampaignId);
          const campaignData = campaignResponse.data;
          console.log('Fetched campaign data:', campaignData);

          setWorkflowName(campaignData.name || 'Untitled Workflow');
          setLastSavedName(campaignData.name || 'Untitled Workflow');

          // Initialize nodes and edges from the campaign data
          if (flowData) {
            const nodes = flowData.nodes || initialNodes;
            const edges = flowData.edges || initialEdges;

            setNodes(nodes);
            setEdges(edges);
            setLastSavedNodes([...nodes]);
            setLastSavedEdges([...edges]);
          } else {
            // If no flow data, initialize with default nodes
            setNodes(initialNodes);
            setEdges(initialEdges);
          }

          setLastSaved(new Date().toLocaleTimeString());
        } else {
          // New campaign
          setNodes(initialNodes);
          setEdges(initialEdges);
          setWorkflowName("Untitled Workflow");
          setLastSavedName("Untitled Workflow");
        }
      } catch (error) {
        console.error('Failed to load campaign:', error);
        // Fallback to initial state
        setNodes(initialNodes);
        setEdges(initialEdges);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId]); // Only run when campaignId changes

  // Auto-save effect
  useEffect(() => {
    const hasChanges =
      JSON.stringify(nodes) !== JSON.stringify(lastSavedNodes) ||
      JSON.stringify(edges) !== JSON.stringify(lastSavedEdges) ||
      workflowName !== lastSavedName;

    if (!hasChanges) {
      setHasUnsavedChanges(false);
      return;
    }

    setHasUnsavedChanges(true);

    const autoSaveTimer = setTimeout(() => {
      if (hasChanges) {
        handleSave();
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearTimeout(autoSaveTimer);
  }, [nodes, edges, workflowName, lastSavedNodes, lastSavedEdges, lastSavedName]);

  // Save to backend
  const handleSave = async () => {
    const flowData = prepareFlowData();
    if (!flowData) return;

    console.log('Saving flow data:', JSON.stringify(flowData, null, 2));

    try {
      let response;

      if (propCampaign?.id && !propCampaign.id.startsWith("draft-")) {
        // Update existing campaign
        response = await campaignAPI.updateCampaign(propCampaign.id, {...flowData,name: workflowName });
        // if (workflowName !== lastSavedName) {
        //   await campaignAPI.updateCampaign(propCampaignId, { name: workflowName, status: 'draft' });
        // }
      } else {
        // Create new campaign
        const response = await campaignAPI.createCampaign({
          name: workflowName,
          ...flowData,
          status: 'draft'
        });
        propCampaignId = response.data.id;
        setCampaignId(response.data.id);
      }
      onSaveSuccess(response.data);
      // if (response.data) {
      setHasUnsavedChanges(false);
      setLastSaved(new Date().toLocaleTimeString());
      setLastSavedNodes([...nodes]);
      setLastSavedEdges([...edges]);
      setLastSavedName(workflowName);
      // }
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };

  // Start campaign execution
  const startCampaign = async () => {
    const validation = validateWorkflow();
    if (!validation.isValid) {
      alert('Workflow validation failed:\n\n' + validation.errors.join('\n'));
      return;
    }

    try {
      // Save before starting
      await handleSave();

      if (!campaignId) {
        throw new Error("Campaign ID missing");
      }

      await campaignAPI.startCampaign(campaignId);
      setIsSimulating(true);
      setSimulationLog(['Starting campaign...']);
    } catch (error) {
      console.error('Failed to start campaign:', error);
      alert('Failed to start campaign');
    }
  };

  // Track changes for auto-save
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const newNodes = applyNodeChanges(changes, nds);
        return newNodes;
      });
    },
    [setNodes]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => {
        const newEdges = applyEdgeChanges(changes, eds);
        return newEdges;
      });
    },
    [setEdges]
  );

  const prepareFlowData = () => {
    const validation = validateWorkflow();
    if (!validation.isValid) {
      alert('Cannot save workflow with errors:\n\n' + validation.errors.join('\n'));
      return null;
    }

    const nodeDataWhitelist: Record<string, string[]> = {
      start: ['label'],
      email: ['label', 'subject', 'body'],
      condition: ['label', 'openedEmailEnabled', 'clickedLinkEnabled', 'openedEmailWaitingTime', 'clickedLinkWaitingTime'],
      delay: ['label', 'waitingTime'],
      goal: ['label'],
      abTest: ['label', 'splitPercentage'],
    };

    // return {
    //   nodes: nodes.map(node => ({
    //     id: node.id,
    //     type: node.type,
    //     position: node.position,
    //     data: Object.fromEntries(
    //       Object.entries(node.data).filter(([key]) => key !== 'type'))
    //   })),
    //   edges: edges.map(edge => ({
    //     id: edge.id,
    //     source: edge.source,
    //     target: edge.target,
    //     condition: edge.condition || ""
    //   })),
    //   meta: {
    //     savedAt: new Date().toISOString(),
    //     version: '1.0'
    //   }
    // };

    // Inside prepareFlowData function:
  return {
    nodes: nodes.map(node => {
      const allowedKeys = nodeDataWhitelist[node.type] || ['label'];
      const filteredData = Object.keys(node.data)
        .filter(key => allowedKeys.includes(key))
        .reduce((obj, key) => {
          obj[key] = node.data[key];
          return obj;
        }, {} as Record<string, any>);

      return {
        id: node.id,
        type: node.type,
        position: node.position,
        data: filteredData
      };
    }),
    edges: edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      condition: edge.condition || ""
    })),
    meta: {
      savedAt: new Date().toISOString(),
      version: '1.0'
    }
  };
  };

  const onInit = useCallback((instance: any) => {
    setRfInstance(instance);
    instance.fitView({ padding: 0.2 });
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        const sourceNode = nodes.find(n => n.id === params.source);
        const isMultiOutputNode = sourceNode && MULTI_OUTPUT_NODES.includes(sourceNode.data.type);

        if (!isMultiOutputNode) {
          const hasExistingOutgoingEdge = eds.some(e => e.source === params.source);
          if (hasExistingOutgoingEdge) {
            alert("This node can only have one outgoing connection!");
            return eds;
          }
        }

        const connectionExists = eds.some(
          (e) => e.source === params.source && e.target === params.target
        );

        if (connectionExists) {
          return eds;
        }

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
      });
    },
    [setEdges, nodes]
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
        type: type,
        position,
        data: {
          ...(type === 'email' && { subject: '', body: '' }),
          ...(type === 'condition' && { 
            openedEmailEnabled: true,
            clickedLinkEnabled: true 
          }),
          label: label || type,
          type,
          onDelete: (nodeId: string) => {
            if (confirm('Are you sure you want to delete this node?')) {
              setNodes((nds) => nds.filter((n) => n.id !== nodeId));
              setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
            }
          }
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const validateWorkflow = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const nodeIds = new Set(nodes.map(n => n.id));

    nodes.forEach(node => {
      if (node.data.type !== 'start' && !edges.some(e => e.target === node.id)) {
        errors.push(`Node "${node.data.label}" has no incoming connections`);
      }
    });

    nodes.forEach(node => {
      if (node.data.type !== 'goal' && !edges.some(e => e.source === node.id)) {
        errors.push(`Node "${node.data.label}" has no outgoing connections`);
      }
    });

    edges.forEach(edge => {
      if (!nodeIds.has(edge.source)) {
        errors.push(`Edge references non-existent source node ${edge.source}`);
      }
      if (!nodeIds.has(edge.target)) {
        errors.push(`Edge references non-existent target node ${edge.target}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const simulateFlow = async () => {
    const validation = validateWorkflow();
    if (!validation.isValid) {
      alert('Workflow validation failed:\n\n' + validation.errors.join('\n'));
      return;
    }

    setIsSimulating(true);
    setSimulationLog([]);

    const visited = new Set();
    const log: string[] = [];

    const getNextByHandle = (nodeId: string, handleId?: string) =>
      edges
        .filter((e) => e.source === nodeId && (!handleId || e.sourceHandle === handleId))
        .map((e) => nodes.find((n) => n.id === e.target))
        .filter(Boolean) as Node[];

    const dfs = async (node: Node | undefined) => {
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
          const delayTime = node.data.waitingTime || 1000;
          log.push(`⏱️ Delay: ${delayTime}ms`);
          await new Promise(resolve => setTimeout(resolve, Math.min(delayTime, 3000)));
          break;
        case 'condition':
          log.push(`🔀 Condition: ${node.data.condition || 'No condition set'}`);

          const nextYes = getNextByHandle(node.id, 'yes');
          const nextNo = getNextByHandle(node.id, 'no');

          const conditionResult = Math.random() > 0.5;
          log.push(`↳ Condition evaluated to: ${conditionResult ? 'YES' : 'NO'}`);

          if (conditionResult && nextYes.length) {
            nextYes.forEach(n => dfs(n));
          } else if (nextNo.length) {
            nextNo.forEach(n => dfs(n));
          }
          return;

        case 'goal':
          log.push('🎯 Goal Reached!');
          return;
        case 'abTest':
          const splitPercentage = node.data.splitPercentage || 50;
          log.push(`🔀 A/B Test: ${splitPercentage}% Variant A, ${100 - splitPercentage}% Variant B`);

          const variantA = getNextByHandle(node.id, 'variantA');
          const variantB = getNextByHandle(node.id, 'variantB');

          const random = Math.random() * 100;
          if (random < splitPercentage && variantA.length) {
            log.push(`↳ Using Variant A (${splitPercentage}%)`);
            variantA.forEach(n => dfs(n));
          } else if (variantB.length) {
            log.push(`↳ Using Variant B (${100 - splitPercentage}%)`);
            variantB.forEach(n => dfs(n));
          }
          return;

        default:
          log.push(`⚙️ ${node.data.label}`);
          break;
      }

      const nextNodes = getNextByHandle(node.id);
      for (const nextNode of nextNodes) {
        await dfs(nextNode);
      }
    };

    const start = nodes.find((n) => n.data.type === 'start') || nodes[0];
    await dfs(start);

    setSimulationLog(log);
    setIsSimulating(false);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
  };

  const exportToJSON = () => {
    const workflowData = {
      name: workflowName,
      nodes,
      edges,
      meta: {
        exportedAt: new Date().toISOString(),
        version: '1.0'
      }
    };

    const dataStr = JSON.stringify(workflowData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `${workflowName.replace(/\s+/g, '_')}_workflow.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // // Add this useEffect to migrate existing nodes
  // useEffect(() => {
  //   setNodes(nds => nds.map(n => {
  //     // If node has data.type but no top-level type
  //     if (n.data?.type && !n.type) {
  //       return {
  //         ...n,
  //         type: n.data.type,
  //         data: {
  //           ...n.data,
  //           // Remove type from data if it exists
  //           type: undefined
  //         }
  //       };
  //     }
  //     return n;
  //   }));
  // }, []);

  return (
    <div className="flex-1 h-full" ref={reactFlowWrapper}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div>Loading campaign...</div>
        </div>
      ) : (
        <><ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
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
            minZoom={0.1}
            maxZoom={2}
            fitViewOptions={{ padding: 0.2 }}
          >
            <Controls />
            <Background />

            <Panel position="top-left">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="text-[#53545C] px-4 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter workflow name" />
                {lastSaved && (
                  <span className="text-xs text-gray-500">
                    Last saved: {lastSaved}
                  </span>
                )}
                {hasUnsavedChanges && (
                  <span className="text-xs text-yellow-600">
                    Unsaved changes
                  </span>
                )}
              </div>
            </Panel>

            <Panel position="top-right">
              <div className="flex gap-2">
                {isSimulating ? (
                  <button
                    onClick={stopSimulation}
                    className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-700"
                  >
                    ⏹ Stop Simulation
                  </button>
                ) : (
                  <button
                    onClick={startCampaign}
                    className="bg-[#5570F1] text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                  >
                    ▶ Start Campaign
                  </button>
                )}
                <button
                  onClick={handleSave}
                  className="bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-600"
                  disabled={!hasUnsavedChanges}
                >
                  💾 {hasUnsavedChanges ? 'Save Workflow' : 'Saved'}
                </button>
                <button
                  onClick={exportToJSON}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  📄 Export JSON
                </button>
              </div>
            </Panel>

            {simulationLog.length > 0 && (
              <Panel position="bottom-right" className="bg-white bg-opacity-90 p-4 rounded shadow-lg max-h-64 overflow-auto">
                <div className="font-bold mb-2">Simulation Log:</div>
                <div className="text-sm space-y-1">
                  {simulationLog.map((log, index) => (
                    <div key={index}>{log}</div>
                  ))}
                </div>
              </Panel>
            )}
          </ReactFlow>
        </ReactFlowProvider><NodeModal
            isOpen={!!selectedNode}
            onClose={() => setSelectedNode(null)}
            node={selectedNode}
            onSave={(updatedNode: Node) => {
              setNodes((nds) => nds.map((n) => (n.id === updatedNode.id ? updatedNode : n))
              );
              setSelectedNode(null);
            }} /></>
      )}
    </div>
  );
};

export default WorkflowCanvas;