import { Node } from "@xyflow/react";
import type { NodeData, NodeType } from "../types/types";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
   activeNode: Node[];
   onChange: (v: Node) => void;
};

const nodeT: NodeType[] = ["default", "circle", "textUpdater"];

export default function ActiveNode({ activeNode, onChange }: Props) {
   return (
      <div className="flex flex-col min-w-[250px]">
         <h1 className="font-semibold">NODE</h1>

         <Separator className="my-2" />

         {activeNode.map((node) => (
            <div key={node.id} className="flex flex-col gap-2">
               <NodeD data={node?.data as NodeData} />
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
            </div>
         ))}
      </div>
   );
}

function NodeD({ data }: { data: NodeData }) {
   return <div>{data?.label}</div>;
}
