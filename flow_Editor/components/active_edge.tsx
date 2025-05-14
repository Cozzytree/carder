import { Edge, Node } from "@xyflow/react";
import type { EdgeType } from "../types/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

type Props = {
   edges: Edge[];
   nodes: Node[];
   onChange: (v: Edge) => void;
};

const edgeTypes: EdgeType[] = [
   "default",
   "straight",
   "step",
   "smoothstep",
   "simplebezier",
   "buttonedge",
];

export default function ActiveEdge({ edges, nodes, onChange }: Props) {
   function finrNodewithID(id: string) {
      const i = nodes.findIndex((n) => n.id === id);
      if (i == -1) return null;
      return nodes[i];
   }

   return (
      <div className="flex flex-col min-w-[250px]">
         <h1 className="font-semibold">EDGE</h1>
         <Separator className="my-2" />
         {edges.map((e, i) => (
            <div key={i}>
               <Popover>
                  <PopoverTrigger asChild>
                     <Button className="font-semibold" size={"sm"}>
                        <span>{"Type->"}</span> {e?.type}
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent
                     side="left"
                     align="start"
                     className="w-[200px] flex flex-col p-0 overflow-hidden"
                  >
                     {edgeTypes.map((et) => (
                        <button
                           onClick={() => {
                              onChange({ ...e, type: et });
                           }}
                           className={cn(
                              e.type === et && "bg-accent",
                              "w-full text-sm font-semibold text-start hover:bg-accent p-2 rounded-sm",
                           )}
                           key={et}
                        >
                           {et}
                        </button>
                     ))}
                  </PopoverContent>
               </Popover>
            </div>
         ))}
      </div>
   );
}
