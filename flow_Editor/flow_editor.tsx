"use client";
import "@xyflow/react/dist/style.css";
import TextUpdaterNode from "./text_updater";
import CircleNode from "./circle_node";
import ResizableNodeSelected from "./node_resizer_selected";
import ActiveEdge from "./components/active_edge";
import ActiveNode from "./components/active_node";
import LabeledGroupNode from "./label_group_node";
import ButtonEdge from "./button_edge";

import { v4 as uuidV4 } from "uuid";
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
   useReactFlow,
   OnConnectEnd,
   ReactFlowProvider,
   DefaultEdgeOptions,
   OnSelectionChangeParams,
   OnReconnect,
   reconnectEdge,
   MarkerType,
   useNodesState,
} from "@xyflow/react";
import { debouncer } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Square } from "lucide-react";

const edgeTypes = {
   buttonedge: ButtonEdge,
};

const nodeTypes = {
   textUpdater: TextUpdaterNode,
   circle: CircleNode,
   re_selected: ResizableNodeSelected,
   labeledGroupNode: LabeledGroupNode,
};

const initialNodes: Node[] = [
   {
      id: "1",
      data: { label: "label", content: "Hello Seattle" },
      type: "textUpdater",
      position: { x: 5, y: 5 },
      className: "rounded-xl",
   },
   { id: "2", data: { label: "Node 2" }, position: { x: 5, y: 100 } },
   {
      id: "3",
      type: "circle",
      data: { label: "Node 2", background: "red", text: "black" },
      position: { x: 5, y: 100 },
   },
   {
      id: "5",
      type: "re_selected",
      data: { label: "hello world" },
      position: { x: 500, y: 500 },
   },
   {
      id: "6",
      position: { x: 200, y: 200 },
      data: { label: "Group Node" },
      width: 380,
      height: 200,
      type: "labeledGroupNode",
   },
   {
      id: "7",
      position: { x: 50, y: 100 },
      data: { label: "Node" },
      type: "default",
      parentId: "6",
      extent: "parent",
   },
   {
      id: "8",
      position: { x: 200, y: 50 },
      data: { label: "Node" },
      type: "default",
      parentId: "6",
      extent: "parent",
   },
];

const initialEdges: Edge[] = [
   {
      id: "e1-2",
      source: "1",
      target: "2",
      type: "step",
      style: { borderRadius: "20px" },
      label: "Hello world",
      markerEnd: {
         type: MarkerType.Arrow,
      },
   },
   {
      label: "Button Edge",
      id: "e1-3",
      source: "1",
      target: "5",
      type: "buttonedge",
   },
];

const defaultEdgeOptions: DefaultEdgeOptions = {
   animated: false,
   type: "default",
};

function Flow() {
   const [nodes, setNodes, OnNodesChange] = useNodesState(initialNodes);
   const edgeReconnectSuccessful = useRef(true);
   const reactFlowWrapper = useRef<HTMLDivElement>(null);
   const [activeNode, setActiveNode] = useState<Node[]>([]);
   const [activeEdges, setActiveEdges] = useState<Edge[]>([]);

   // const [nodes, setNodes] = useState<Node[]>(initialNodes);
   const [edges, setEdges] = useState<Edge[]>(initialEdges);
   const { screenToFlowPosition } = useReactFlow();

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

   const onConnectEnd: OnConnectEnd = useCallback(
      (event, connectionState) => {
         // when a connection is dropped on the pane it's not valid
         if (!connectionState.isValid) {
            // we need to remove the wrapper bounds, in order to get the correct position
            const id = uuidV4();
            const { clientX, clientY } =
               "changedTouches" in event ? event.changedTouches[0] : event;
            const newNode = {
               id,
               position: screenToFlowPosition({
                  x: clientX,
                  y: clientY,
               }),
               data: { label: `label`, content: "helllo" },
               origin: [0.5, 0.0] as [number, number],
            };

            setNodes((nds) => nds.concat(newNode));
            setEdges((eds) => eds.concat({ id, source: connectionState?.fromNode.id, target: id }));
         }
      },
      [screenToFlowPosition],
   );

   const onReconnectStart = useCallback(() => {
      edgeReconnectSuccessful.current = false;
   }, []);

   const onReconnect: OnReconnect = useCallback((oldEdge, newConnection) => {
      edgeReconnectSuccessful.current = true;
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
   }, []);

   const onReconnectEnd = useCallback((_, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
         setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }

      edgeReconnectSuccessful.current = true;
   }, []);

   return (
      <div
         className="wrapper"
         ref={reactFlowWrapper}
         style={{ width: "100%", height: "100vh", color: "var(--foreground)" }}
      >
         {activeNode?.length > 0 && (
            <div className="fixed top-2 right-2 z-50 bg-background p-3 rounded-sm">
               <ActiveNode
                  activeNode={activeNode}
                  onChange={(n) => {
                     const i = nodes.findIndex((node) => node.id === n.id);
                     if (i === -1) return;
                     setNodes((no) => {
                        no[i] = n;
                        return [...no];
                     });
                  }}
               />
            </div>
         )}

         {activeEdges?.length > 0 && (
            <div className="fixed top-2 right-2 z-50 bg-background p-3 rounded-sm">
               <ActiveEdge
                  edges={activeEdges}
                  nodes={nodes}
                  onChange={(e) => {
                     console.log(e);
                     const i = edges.findIndex((ed) => ed.id == e.id);
                     if (i == -1) return;
                     setEdges((ed) => {
                        ed[i] = e;
                        return [...ed];
                     });
                  }}
               />
            </div>
         )}

         <div className="w-full flex justify-center fixed bottom-10 z-50">
            <div className="border p-2 rounded-[5px]">
               <Button
                  onClick={() => {
                     setNodes((n) => {
                        n.push({
                           data: { label: "Node", background: "transparent" },
                           id: uuidV4(),
                           position: {
                              x: reactFlowWrapper?.current
                                 ? reactFlowWrapper.current?.clientWidth / 2 - 50
                                 : 100,
                              y: reactFlowWrapper?.current
                                 ? reactFlowWrapper.current?.clientHeight / 2 - 50
                                 : 100,
                           },
                           type: "textUpdater",
                        });

                        return [...n];
                     });
                  }}
                  className="rounded-[5px]"
                  variant={"outline"}
                  size={"sm"}
               >
                  <Square />
               </Button>
            </div>
         </div>

         <ReactFlow
            defaultEdgeOptions={{
               type: "",
            }}
            edgeTypes={edgeTypes}
            nodeTypes={nodeTypes}
            colorMode="dark"
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodes={nodes}
            edges={edges}
            onReconnect={onReconnect}
            onReconnectStart={onReconnectStart}
            onReconnectEnd={onReconnectEnd}
            onConnect={onConnect}
            onConnectEnd={onConnectEnd}
            onSelectionChange={debouncer((e: OnSelectionChangeParams<Node, Edge>) => {
               setActiveNode(e.nodes);
               setActiveEdges(e.edges);
            }, 100)}
            defaultEdgeOptions={defaultEdgeOptions}
            // fitView
            // snapToGrid={true}
         >
            <Background />
            <Controls />
         </ReactFlow>
      </div>
   );
}

const FlowEditor = () => {
   return (
      <ReactFlowProvider>
         <Flow />
      </ReactFlowProvider>
   );
};
export default FlowEditor;
