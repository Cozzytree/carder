import { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { Input } from "@/components/ui/input";

function TextUpdaterNode({ data }: { data: { label: string } }) {
   console.log(data);

   const onChange = useCallback((evt) => {
      console.log(evt?.target?.value);
   }, []);

   return (
      <div className="border rounded-md px-3 py-1">
         <Handle type="target" position={Position.Top} />
         <div className="flex items-center gap-2">
            <label htmlFor="text">Text:</label>
            <Input
               defaultValue={data?.label}
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
export default TextUpdaterNode;
