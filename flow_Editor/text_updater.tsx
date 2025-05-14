import { memo, useCallback, useRef } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { NodeData } from "./types/types";
import { debouncer } from "@/lib/utils";

function TextUpdaterNode({ data, isConnectable, id }: NodeProps) {
   const headerRef = useRef<HTMLHeadingElement | null>(null);
   const divRef = useRef<HTMLDivElement | null>(null);
   const reactFlow = useReactFlow();
   const nodeData = data as NodeData;

   const onChange = useCallback(
      debouncer((value: string, prop: string) => {
         const nodes = reactFlow.getNodes();
         const i = nodes.findIndex((n) => n.id === id);
         if (i === -1) return;

         reactFlow.setNodes((n) => {
            n[i] = { ...n[i], data: { ...n[i].data, [prop]: value } };
            return [...n];
         });
         // console.log(evt?.target?.value);
      }, 100),
      [],
   );

   return (
      <div
         style={{ background: nodeData?.background }}
         className="border rounded-md px-3 py-1 min-w-[200px]"
      >
         <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
         <div className="flex flex-col items-center gap-2 max-h-[300px] overflow-y-scroll">
            <h1
               ref={headerRef}
               onBlur={() => {
                  if (headerRef) {
                     onChange(headerRef.current?.innerText, "label");
                  }
               }}
               className="sticky top-0 outline-0 font-semibold text-xl"
               contentEditable
               suppressContentEditableWarning
            >
               {nodeData?.label}
            </h1>
            <div
               ref={divRef}
               onBlur={() => {
                  if (divRef) {
                     onChange(divRef.current?.innerText, "content");
                  }
               }}
               contentEditable
               suppressContentEditableWarning
               className="outline-0 min-h-10 whitespace-pre-wrap w-full text-wrap text-foreground/80 text-sm font-semibold"
            >
               {nodeData?.content || "content"}
            </div>
         </div>
         {/* <Handle type="source" position={Position.Bottom} id="a" /> */}
         <Handle type="source" position={Position.Bottom} id="b" />
      </div>
   );
}
export default memo(TextUpdaterNode);
