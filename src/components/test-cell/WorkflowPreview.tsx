import { useCallback } from 'react';
import { ReactFlow, Background, Controls, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Création Posts' },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: { label: 'Ciblage Audience' },
    position: { x: 250, y: 100 },
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Conversion Leads' },
    position: { x: 250, y: 200 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

export const WorkflowPreview = () => {
  const onNodesChange = useCallback((changes: any) => {
    console.log('Nodes changed:', changes);
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    console.log('Edges changed:', changes);
  }, []);

  const onConnect = useCallback((params: any) => {
    console.log('Connection made:', params);
  }, []);

  return (
    <div style={{ height: '500px' }} className="border rounded-lg">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};