import { memo, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { Input } from "@/components/ui/input";
import { NodeData } from "./types/types";

function TextUpdaterNode({ data, isConnectable }: { isConnectable: boolean; data: NodeData }) {
   const onChange = useCallback((evt) => {
      // console.log(evt?.target?.value);
   }, []);

   return (
      <div className="border rounded-md px-3 py-1">
         <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
         <div className="flex flex-col items-center gap-2">
            <label htmlFor="text">{data?.label}</label>
            <Input
               defaultValue={data?.content}
               placeholder="input"
               id="text"
               name="text"
               onChange={onChange}
               className="nodrag"
            />
         </div>
         {/* <Handle type="source" position={Position.Bottom} id="a" /> */}
         <Handle type="source" position={Position.Bottom} id="b" />
      </div>
   );
}
export default memo(TextUpdaterNode);
