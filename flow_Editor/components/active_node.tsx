import ChangeColor from "./changeColor";

import { Node, useReactFlow } from "@xyflow/react";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrashIcon } from "lucide-react";

import type { NodeType } from "../types/types";

type Props = {
   activeNode: Node[];
   onChange: (v: Node) => void;
};

const nodeT: NodeType[] = ["default", "circle", "textUpdater"];

export default function ActiveNode({ activeNode, onChange }: Props) {
   const reactFlow = useReactFlow();

   const handleDelete = (node: Node) => {
      const nodes = reactFlow.getNodes();
      let index = -1;
      for (let i = 0; i < nodes.length; i++) {
         if (nodes[i].id === node.id) {
            index = i;
            break;
         }
      }
      if (index === -1) return;

      reactFlow.setNodes((n) => {
         const newNodes: Node[] = [];
         for (let i = 0; i < index; i++) {
            newNodes.push(n[i]);
         }
         for (let i = index + 1; i < n.length; i++) {
            newNodes.push(n[i]);
         }
         return newNodes;
      });
   };

   return (
      <div className="flex flex-col min-w-[250px]">
         <h1 className="font-semibold">NODE</h1>

         <Separator className="my-2" />

         {activeNode.map((node) => (
            <div key={node.id} className="flex flex-col gap-2">
               <NodeD data={node} onChange={onChange} />
               <Popover>
                  <PopoverTrigger asChild>
                     <Button size={"sm"} className="flex justify-start font-semibold">
                        {"Type->"} <span className="">{node?.type}</span>
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent
                     side="left"
                     align="start"
                     className="w-[200px] flex flex-col p-0 overflow-hidden"
                  >
                     {nodeT.map((nt) => (
                        <button
                           onClick={() => {
                              onChange({ ...node, type: nt });
                           }}
                           className={cn(
                              nt === node?.type && "bg-accent",
                              "w-full text-xs font-semibold text-start hover:bg-accent p-2 rounded-sm",
                           )}
                           key={nt}
                        >
                           {nt}
                        </button>
                     ))}
                  </PopoverContent>
               </Popover>

               <div className="mt-2">
                  <h4 className="font-semibold text-sm">Actions</h4>

                  <Separator className="my-2" />

                  <div>
                     <TrashIcon
                        onClick={() => {
                           handleDelete(node);
                        }}
                     />
                  </div>
               </div>
            </div>
         ))}
      </div>
   );
}

function NodeD({ data, onChange }: { data: Node; onChange: (v: Node) => void }) {
   return (
      <div className="flex flex-col gap-2">
         <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Fill</span>
            <ChangeColor
               color={(data?.data?.background as string) || ""}
               node={data}
               onChange={onChange}
               prop="background"
            />
         </div>

         <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Text</span>
            <ChangeColor
               node={data}
               color={(data?.data?.text as string) || ""}
               onChange={onChange}
               prop="text"
            />
         </div>
      </div>
   );
}
