"use client";

import {
   ReactFlow,
   Background,
   Controls,
   applyEdgeChanges,
   applyNodeChanges,
   addEdge,
   OnConnect,
   OnEdgesChange,
   OnNodesChange,
   Edge,
   Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useState } from "react";
import TextUpdaterNode from "./text_updater";
import CircleNode from "./circle_node";

const nodeTypes = {
   textUpdater: TextUpdaterNode,
   circle: CircleNode,
};

const initialNodes: Node[] = [
   {
      id: "1",
      data: { label: "Node 1" },
      type: "textUpdater",
      position: { x: 5, y: 5 },
      className: "rounded-xl",
   },
   { id: "2", data: { label: "Node 2" }, position: { x: 5, y: 100 } },
   { id: "3", type: "circle", data: { label: "Node 2" }, position: { x: 5, y: 100 } },
];

const initialEdges: Edge[] = [
   { id: "e1-2", source: "1", target: "2", type: "step", style: { borderRadius: "20px" } },
];

export default function FlowEditor() {
   const [nodes, setNodes] = useState<Node[]>(initialNodes);
   const [edges, setEdges] = useState<Edge[]>(initialEdges);

   const onNodesChange: OnNodesChange = useCallback(
      (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
      [setNodes],
   );
   const onEdgesChange: OnEdgesChange = useCallback(
      (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
      [setEdges],
   );
   const onConnect: OnConnect = useCallback(
      (connection) => setEdges((eds) => addEdge(connection, eds)),
      [setEdges],
   );

   return (
      <div style={{ width: "100%", height: "100vh", color: "var(--foreground)" }}>
         <ReactFlow
            defaultEdgeOptions={{
               type: "straight",
            }}
            nodeTypes={nodeTypes}
            colorMode="dark"
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            onSelectionChange={(e) => {
               console.log(e);
            }}
         >
            <Background />
            <Controls />
         </ReactFlow>
      </div>
   );
}
