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
import CustomNode from './CustomNode';
import NodeModal from './NodeModal';
import { campaignAPI } from '@/utils/api';

const nodeTypes = {
  custom: CustomNode,
};

interface WorkflowCanvasProps {
  campaignId?: string;
}

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 5 },
    data: { label: 'Start', type: 'start' },
  },
];

const initialEdges: Edge[] = [];

const MULTI_OUTPUT_NODES = ['condition', 'abTest'];
const AUTO_SAVE_INTERVAL = 60000; // 60 seconds

const WorkflowCanvas = ({ campaignId: propCampaignId }: WorkflowCanvasProps) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
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
          const flowResponse  = await campaignAPI.getCampaignFlow(propCampaignId);
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
      
      if (propCampaignId) {
        // Update existing campaign
        response = await campaignAPI.updateCampaign(propCampaignId,flowData);
        if (workflowName !== lastSavedName) {
          await campaignAPI.updateCampaign(propCampaignId, { name: workflowName, status: 'draft' });
        }
      } else {
        // Create new campaign
        const response = await campaignAPI.createCampaign({
          name: workflowName,
          flow: flowData,
          status: 'draft'
        });
        propCampaignId = response.data.id;
      }
      
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

    return {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          type: node.data.type, // Ensure type is included
          ...node.data
        }
      })),
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
        type: 'custom',
        position,
        data: { 
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
              } }
              onEdgeClick={(_, edge) => {
                if (confirm(`Delete this connection from "${edge.source}" to "${edge.target}"?`)) {
                  setEdges((eds) => eds.filter((e) => e.id !== edge.id));
                }
              } }
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
              } } /></>
    )}
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
//   Panel,
//   applyNodeChanges,
//   applyEdgeChanges,
// } from 'reactflow';
// import 'reactflow/dist/style.css';
// import CustomNode from './CustomNode';
// import NodeModal from './NodeModal';
// import { getAllFlows, saveFlow } from '@/utils/useWorkflowStore';
// import { campaignAPI } from '@/utils/api';

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

// const MULTI_OUTPUT_NODES = ['condition', 'abTest'];
// const AUTO_SAVE_INTERVAL = 5000; // 5 seconds

// const WorkflowCanvas = () => {
//   const reactFlowWrapper = useRef<HTMLDivElement>(null);
//   const [nodes, setNodes] = useNodesState(initialNodes);
//   const [edges, setEdges] = useEdgesState(initialEdges);
//   const [selectedNode, setSelectedNode] = useState<Node | null>(null);
//   const [workflowName, setWorkflowName] = useState("Untitled Workflow");
//   const [rfInstance, setRfInstance] = useState<any>(null);
//   const [isSimulating, setIsSimulating] = useState(false);
//   const [simulationLog, setSimulationLog] = useState<string[]>([]);
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const [lastSaved, setLastSaved] = useState<string | null>(null);
//   const [campaignId, setCampaignId] = useState<string | null>(null);
//   const [lastSavedNodes, setLastSavedNodes] = useState<Node[]>([]);
//   const [lastSavedEdges, setLastSavedEdges] = useState<Edge[]>([]);
//   const [lastSavedName, setLastSavedName] = useState("Untitled Workflow");

//   // Auto-save effect
//   useEffect(() => {
//     if (!hasUnsavedChanges) return;

//     const autoSaveTimer = setTimeout(() => {
//       handleSave();
//     }, AUTO_SAVE_INTERVAL);

//     return () => clearTimeout(autoSaveTimer);
//   }, [hasUnsavedChanges, nodes, edges, workflowName]);

//   // Load saved flows
//   useEffect(() => {
//     const flows = getAllFlows();
//     if (Object.keys(flows).length > 0) {
//       const firstFlow = flows[Object.keys(flows)[0]];
//       setNodes(firstFlow.nodes || initialNodes);
//       setEdges(firstFlow.edges || initialEdges);
//       setWorkflowName(firstFlow.name || "Untitled Workflow");
//       setLastSaved(new Date().toLocaleTimeString());
//     }
//   }, []);

//    // Load campaigns on mount - UPDATED
//    useEffect(() => {
//     const fetchCampaigns = async () => {
//       try {
//         const response = await campaignAPI.getCampaigns();
//         if (response.data.length > 0) {
//           const campaign = response.data[0];
//           setCampaignId(campaign.id); // Store campaign ID
//           setWorkflowName(campaign.name);
//           setLastSavedName(campaign.name);
          
//           const nodes = campaign.flow.nodes || initialNodes;
//           const edges = campaign.flow.edges || initialEdges;
          
//           setNodes(nodes);
//           setEdges(edges);
//           setLastSavedNodes([...nodes]);
//           setLastSavedEdges([...edges]);
//         }
//       } catch (error) {
//         console.error('Failed to load campaigns', error);
//       }
//     };
    
//     fetchCampaigns();
//   }, []);
  
// // Save to backend
// const handleSave = async () => {
//   const flowData = prepareFlowData();
//   if (!flowData) return;

//   try {
//     const response = await campaignAPI.createCampaign({
//       name: workflowName,
//       flow: flowData,
//       status: 'draft'
//     });
    
//     if (response.data) {
//       setHasUnsavedChanges(false);
//       setLastSaved(new Date().toLocaleTimeString());
//       alert('Campaign saved successfully!');
//     }
//   } catch (error) {
//     console.error('Error saving campaign:', error);
//     alert('Failed to save campaign');
//   }
// };

// // Start campaign execution
// const startCampaign = async () => {
//   const validation = validateWorkflow();
//   if (!validation.isValid) {
//     alert('Workflow validation failed:\n\n' + validation.errors.join('\n'));
//     return;
//   }

//   try {
//     const flowData = prepareFlowData();
//     if (!flowData) return;

//     // First save the flow
//     await campaignAPI.createCampaign({
//       name: workflowName,
//       flow: flowData,
//       status: 'draft'
//     });

//     // Then start the campaign
//     await campaignAPI.startCampaign(workflowName);
//     setIsSimulating(true);
//     setSimulationLog(['Starting campaign...']);
//     alert('Campaign started successfully!');
//   } catch (error) {
//     console.error('Failed to start campaign:', error);
//     alert('Failed to start campaign');
//   }
// };


//   // Track changes for auto-save
//   const handleNodesChange = useCallback(
//     (changes) => {
//       setNodes((nds) => {
//         setHasUnsavedChanges(true);
//         return applyNodeChanges(changes, nds);
//       });
//     },
//     [setNodes]
//   );

//   const handleEdgesChange = useCallback(
//     (changes) => {
//       setEdges((eds) => {
//         setHasUnsavedChanges(true);
//         return applyEdgeChanges(changes, eds);
//       });
//     },
//     [setEdges]
//   );

  
//   const prepareFlowData = () => {
//     const validation = validateWorkflow();
//     if (!validation.isValid) {
//       alert('Cannot save workflow with errors:\n\n' + validation.errors.join('\n'));
//       return null;
//     }

//     return {
//       nodes,
//       edges,
//       meta: {
//         savedAt: new Date().toISOString(),
//         version: '1.0'
//       }
//     };
//   };

//   const onInit = useCallback((instance: any) => {
//     setRfInstance(instance);
//     instance.fitView({ padding: 0.2 });
//   }, []);

//   const onConnect = useCallback(
//     (params: Connection) => {
//       setEdges((eds) => {
//         setHasUnsavedChanges(true);
//         const sourceNode = nodes.find(n => n.id === params.source);
//         const isMultiOutputNode = sourceNode && MULTI_OUTPUT_NODES.includes(sourceNode.data.type);
        
//         if (!isMultiOutputNode) {
//           const hasExistingOutgoingEdge = eds.some(e => e.source === params.source);
//           if (hasExistingOutgoingEdge) {
//             alert("This node can only have one outgoing connection!");
//             return eds;
//           }
//         }
        
//         const connectionExists = eds.some(
//           (e) => e.source === params.source && e.target === params.target
//         );
        
//         if (connectionExists) {
//           return eds;
//         }
        
//         return addEdge(
//           {
//             ...params,
//             markerEnd: {
//               type: MarkerType.ArrowClosed,
//             },
//             animated: true
//           },
//           eds
//         );
//       });
//     },
//     [setEdges, nodes]
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

//       setNodes((nds) => {
//         setHasUnsavedChanges(true);
//         return nds.concat(newNode);
//       });
//     },
//     [setNodes]
//   );

//   // Validate workflow before saving/simulation
//   const validateWorkflow = (): { isValid: boolean; errors: string[] } => {
//     const errors: string[] = [];
//     const nodeIds = new Set(nodes.map(n => n.id));

//     // Check for orphaned nodes (no incoming edges except start node)
//     nodes.forEach(node => {
//       if (node.data.type !== 'start' && !edges.some(e => e.target === node.id)) {
//         errors.push(`Node "${node.data.label}" has no incoming connections`);
//       }
//     });

//     // Check for nodes with no outgoing edges (except goal nodes)
//     nodes.forEach(node => {
//       if (node.data.type !== 'goal' && !edges.some(e => e.source === node.id)) {
//         errors.push(`Node "${node.data.label}" has no outgoing connections`);
//       }
//     });

//     // Check for invalid connections
//     edges.forEach(edge => {
//       if (!nodeIds.has(edge.source)) {
//         errors.push(`Edge references non-existent source node ${edge.source}`);
//       }
//       if (!nodeIds.has(edge.target)) {
//         errors.push(`Edge references non-existent target node ${edge.target}`);
//       }
//     });

//     return {
//       isValid: errors.length === 0,
//       errors
//     };
//   };

//   // Enhanced simulation with pause/resume
//   const simulateFlow = async () => {
//     const validation = validateWorkflow();
//     if (!validation.isValid) {
//       alert('Workflow validation failed:\n\n' + validation.errors.join('\n'));
//       return;
//     }

//     setIsSimulating(true);
//     setSimulationLog([]);

//     const visited = new Set();
//     const log: string[] = [];

//     const getNextByHandle = (nodeId: string, handleId?: string) =>
//       edges
//         .filter((e) => e.source === nodeId && (!handleId || e.sourceHandle === handleId))
//         .map((e) => nodes.find((n) => n.id === e.target))
//         .filter(Boolean) as Node[];

//     const dfs = async (node: Node | undefined) => {
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
//           const delayTime = node.data.waitingTime || 1000;
//           log.push(`⏱️ Delay: ${delayTime}ms`);
//           await new Promise(resolve => setTimeout(resolve, Math.min(delayTime, 3000))); // Max 3s delay for demo
//           break;
//         case 'condition':
//           log.push(`🔀 Condition: ${node.data.condition || 'No condition set'}`);
          
//           const nextYes = getNextByHandle(node.id, 'yes');
//           const nextNo = getNextByHandle(node.id, 'no');

//           // Simulate condition evaluation (random for demo)
//           const conditionResult = Math.random() > 0.5;
//           log.push(`↳ Condition evaluated to: ${conditionResult ? 'YES' : 'NO'}`);

//           if (conditionResult && nextYes.length) {
//             nextYes.forEach(n => dfs(n));
//           } else if (nextNo.length) {
//             nextNo.forEach(n => dfs(n));
//           }
//           return;

//         case 'goal':
//           log.push('🎯 Goal Reached!');
//           return;
//         case 'abTest':
//           const splitPercentage = node.data.splitPercentage || 50;
//           log.push(`🔀 A/B Test: ${splitPercentage}% Variant A, ${100 - splitPercentage}% Variant B`);

//           const variantA = getNextByHandle(node.id, 'variantA');
//           const variantB = getNextByHandle(node.id, 'variantB');

//           const random = Math.random() * 100;
//           if (random < splitPercentage && variantA.length) {
//             log.push(`↳ Using Variant A (${splitPercentage}%)`);
//             variantA.forEach(n => dfs(n));
//           } else if (variantB.length) {
//             log.push(`↳ Using Variant B (${100 - splitPercentage}%)`);
//             variantB.forEach(n => dfs(n));
//           }
//           return;

//         default:
//           log.push(`⚙️ ${node.data.label}`);
//           break;
//       }

//       const nextNodes = getNextByHandle(node.id);
//       for (const nextNode of nextNodes) {
//         await dfs(nextNode);
//       }
//     };

//     const start = nodes.find((n) => n.data.type === 'start') || nodes[0];
//     await dfs(start);

//     setSimulationLog(log);
//     setIsSimulating(false);

//     const socket = new WebSocket('ws://localhost:5000/api/v1/campaigns/progress');
  
//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       setSimulationLog(prev => [...prev, data.message]);
      
//       if (data.status === 'completed') {
//         setIsSimulating(false);
//       }
//     };
    
//     socket.onopen = () => {
//       socket.send(JSON.stringify({ 
//         campaignName: workflowName,
//         action: 'simulate'
//       }));
//     };
//   };

//   const stopSimulation = () => {
//     setIsSimulating(false);
//   };

//   // const handleSave = () => {
//   //   const validation = validateWorkflow();
//   //   if (!validation.isValid) {
//   //     alert('Cannot save workflow with errors:\n\n' + validation.errors.join('\n'));
//   //     return;
//   //   }

//   //   saveFlow(workflowName, { 
//   //     name: workflowName, 
//   //     nodes, 
//   //     edges,
//   //     updatedAt: new Date().toISOString()
//   //   });
//   //   setHasUnsavedChanges(false);
//   //   setLastSaved(new Date().toLocaleTimeString());
//   // };

//   const exportToJSON = () => {
//     const workflowData = {
//       name: workflowName,
//       nodes,
//       edges,
//       meta: {
//         exportedAt: new Date().toISOString(),
//         version: '1.0'
//       }
//     };
    
//     const dataStr = JSON.stringify(workflowData, null, 2);
//     const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
//     const exportFileDefaultName = `${workflowName.replace(/\s+/g, '_')}_workflow.json`;
    
//     const linkElement = document.createElement('a');
//     linkElement.setAttribute('href', dataUri);
//     linkElement.setAttribute('download', exportFileDefaultName);
//     linkElement.click();
//   };

//   return (
//     <div className="flex-1 h-full" ref={reactFlowWrapper}>
//       <ReactFlowProvider>
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={handleNodesChange}
//           onEdgesChange={handleEdgesChange}
//           onConnect={onConnect}
//           onInit={onInit}
//           onDragOver={onDragOver}
//           onDrop={onDrop}
//           nodeTypes={nodeTypes}
//           onNodeClick={(_, node) => setSelectedNode(node)}
//           onNodeContextMenu={(_, node) => {
//             if (confirm(`Delete node "${node.data.label}"?`)) {
//               setNodes((nds) => nds.filter((n) => n.id !== node.id));
//               setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
//               setHasUnsavedChanges(true);
//             }
//           }}
//           onEdgeClick={(_, edge) => {
//             if (confirm(`Delete this connection from "${edge.source}" to "${edge.target}"?`)) {
//               setEdges((eds) => eds.filter((e) => e.id !== edge.id));
//               setHasUnsavedChanges(true);
//             }
//           }}
//           minZoom={0.1}
//           maxZoom={2}
//           fitViewOptions={{ padding: 0.2 }}
//         >
//           <Controls />
//           <Background />
          
//           <Panel position="top-left">
//             <div className="flex items-center gap-2">
//               <input
//                 type="text"
//                 value={workflowName}
//                 onChange={(e) => {
//                   setWorkflowName(e.target.value);
//                   setHasUnsavedChanges(true);
//                 }}
//                 className="text-[#53545C] px-4 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter workflow name"
//               />
//               {lastSaved && (
//                 <span className="text-xs text-gray-500">
//                   Last saved: {lastSaved}
//                 </span>
//               )}
//               {hasUnsavedChanges && (
//                 <span className="text-xs text-yellow-600">
//                   Unsaved changes
//                 </span>
//               )}
//             </div>
//           </Panel>

//           <Panel position="top-right">
//             <div className="flex gap-2">
//               {isSimulating ? (
//                 <button
//                   onClick={stopSimulation}
//                   className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-700"
//                 >
//                   ⏹ Stop Simulation
//                 </button>
//               ) : (
//                 <button
//                   onClick={startCampaign} // Changed from simulateFlow
//                   className="bg-[#5570F1] text-white px-4 py-2 rounded shadow hover:bg-blue-700"
//                 >
//                   ▶ Start Campaign
//                 </button>
//               )}
//               <button
//                 onClick={handleSave}
//                 className="bg-purple-400 text-white px-4 py-2 rounded hover:bg-purple-600"
//                 disabled={!hasUnsavedChanges}
//               >
//                 💾 {hasUnsavedChanges ? 'Save Workflow' : 'Saved'}
//               </button>
//               <button
//                 onClick={exportToJSON}
//                 className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
//               >
//                 📄 Export JSON
//               </button>
//             </div>
//           </Panel>

//           {simulationLog.length > 0 && (
//             <Panel position="bottom-right" className="bg-white bg-opacity-90 p-4 rounded shadow-lg max-h-64 overflow-auto">
//               <div className="font-bold mb-2">Simulation Log:</div>
//               <div className="text-sm space-y-1">
//                 {simulationLog.map((log, index) => (
//                   <div key={index}>{log}</div>
//                 ))}
//               </div>
//             </Panel>
//           )}
//         </ReactFlow>
//       </ReactFlowProvider>

//       <NodeModal
//         isOpen={!!selectedNode}
//         onClose={() => setSelectedNode(null)}
//         node={selectedNode}
//         onSave={(updatedNode: Node) => {
//           setNodes((nds) =>
//             nds.map((n) => (n.id === updatedNode.id ? updatedNode : n))
//           );
//           setSelectedNode(null);
//           setHasUnsavedChanges(true);
//         }}
//       />
//     </div>
//   );
// };

// export default WorkflowCanvas;








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
//   Panel,
//   applyNodeChanges,
//   applyEdgeChanges,
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

// // Nodes that are allowed to have multiple outgoing edges
// const MULTI_OUTPUT_NODES = ['condition', 'abTest'];

// const WorkflowCanvas = () => {
//   const reactFlowWrapper = useRef<HTMLDivElement>(null);
//   const [nodes, setNodes] = useNodesState(initialNodes);
//   const [edges, setEdges] = useEdgesState(initialEdges);
//   const [selectedNode, setSelectedNode] = useState<Node | null>(null);
//   const [workflowName, setWorkflowName] = useState("Untitled Workflow");
//   const [rfInstance, setRfInstance] = useState<any>(null);

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

//   const onInit = useCallback((instance: any) => {
//     setRfInstance(instance);
//     instance.fitView({ padding: 0.2 });
//   }, []);

//   const onConnect = useCallback(
//     (params: Connection) => {
//       setEdges((eds) => {
//         const sourceNode = nodes.find(n => n.id === params.source);
//         const isMultiOutputNode = sourceNode && MULTI_OUTPUT_NODES.includes(sourceNode.data.type);
        
//         // For non-multi-output nodes, check if there's already an outgoing edge
//         if (!isMultiOutputNode) {
//           const hasExistingOutgoingEdge = eds.some(e => e.source === params.source);
//           if (hasExistingOutgoingEdge) {
//             alert("This node can only have one outgoing connection!");
//             return eds;
//           }
//         }
        
//         // Prevent duplicate connections between the same nodes
//         const connectionExists = eds.some(
//           (e) => e.source === params.source && e.target === params.target
//         );
        
//         if (connectionExists) {
//           return eds;
//         }
        
//         return addEdge(
//           {
//             ...params,
//             markerEnd: {
//               type: MarkerType.ArrowClosed,
//             },
//             animated: true
//           },
//           eds
//         );
//       });
//     },
//     [setEdges, nodes]
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
//         case 'abTest':
//           const splitPercentage = node.data.splitPercentage || 50;
//           log.push(`🔀 A/B Test: ${splitPercentage}% Variant A, ${100 - splitPercentage}% Variant B`);

//           const variantA = getNextByHandle(node.id, 'variantA');
//           const variantB = getNextByHandle(node.id, 'variantB');

//           const random = Math.random() * 100;
//           if (random < splitPercentage && variantA.length) {
//             log.push(`↳ Using Variant A (${splitPercentage}%)`);
//             variantA.forEach(dfs);
//           } else if (variantB.length) {
//             log.push(`↳ Using Variant B (${100 - splitPercentage}%)`);
//             variantB.forEach(dfs);
//           }
//           return;

//         default:
//           log.push(`⚙️ ${node.data.label}`);
//           return;
//       }

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
//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           onNodesChange={useCallback(
//             (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
//             [setNodes]
//           )}
//           onEdgesChange={useCallback(
//             (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
//             [setEdges]
//           )}
//           onConnect={onConnect}
//           onInit={onInit}
//           onDragOver={onDragOver}
//           onDrop={onDrop}
//           nodeTypes={nodeTypes}
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
//           minZoom={0.1}
//           maxZoom={2}
//           zoomOnScroll={true}
//           zoomOnPinch={true}
//           zoomOnDoubleClick={true}
//           panOnScroll={true}
//           panOnScrollSpeed={1}
//           panOnDrag={true}
//           selectionOnDrag={true}
//           fitViewOptions={{ padding: 0.2 }}
//           defaultViewport={{ x: 0, y: 0, zoom: 1 }}
//         >
//           <Controls />
//           <Background />
          
//           <Panel position="top-left">
//             <input
//               type="text"
//               value={workflowName}
//               onChange={(e) => setWorkflowName(e.target.value)}
//               className="text-[#53545C] px-4 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter workflow name"
//             />
//           </Panel>

//           <Panel position="top-right">
//             <div className="flex gap-2">
//               <button
//                 onClick={simulateFlow}
//                 className="bg-[#5570F1] text-white px-4 py-2 rounded shadow hover:bg-blue-700"
//               >
//                 ▶ Run Simulation
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="bg-purple-400 text-white px-4 py-2 rounded"
//               >
//                 💾 Save Workflow
//               </button>
//             </div>
//           </Panel>
//         </ReactFlow>
//       </ReactFlowProvider>

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
//         case 'abTest':
//           const splitPercentage = node.data.splitPercentage || 50;
//           log.push(`🔀 A/B Test: ${splitPercentage}% Variant A, ${100 - splitPercentage}% Variant B`);

//           const variantA = getNextByHandle(node.id, 'variantA');
//           const variantB = getNextByHandle(node.id, 'variantB');

//           // Randomly choose a variant based on the split percentage
//           const random = Math.random() * 100;
//           if (random < splitPercentage && variantA.length) {
//             log.push(`↳ Using Variant A (${splitPercentage}%)`);
//             variantA.forEach(dfs);
//           } else if (variantB.length) {
//             log.push(`↳ Using Variant B (${100 - splitPercentage}%)`);
//             variantB.forEach(dfs);
//           }
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
//             className="bg-[#5570F1] text-white px-4 py-2 rounded shadow hover:bg-blue-700"
//           >
//             ▶ Run Simulation
//           </button>
//           <button
//             onClick={handleSave}
//             className="bg-purple-400 text-white px-4 py-2 rounded"
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
