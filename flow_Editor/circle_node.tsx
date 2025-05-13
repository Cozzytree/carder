import { Handle, Position } from "@xyflow/react";
import { NodeData } from "./types/types";

const CircleNode = ({ data, isConnectable }: { data: NodeData; isConnectable: boolean }) => {
   const width = 100;
   const height = 100;
   return (
      <div
         style={{
            color: data?.text || "var(--foreground)",
            background: data?.background || "transparent",
            width: width + "px",
            height: height + "px",
         }}
         className="rounded-full border-2 p-1 flex justify-center items-center"
      >
         <div>
            <span className="text-sm font-semibold">{data?.label}</span>
         </div>
         <Handle
            type="target"
            isConnectable={isConnectable}
            position={Position.Top}
            style={{ left: width / 2 }}
         />
         <Handle type="source" position={Position.Bottom} style={{ left: width / 2 }} />
      </div>
   );
};

export default CircleNode;
