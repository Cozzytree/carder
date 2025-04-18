import { Handle, Position } from "@xyflow/react";

const CircleNode = ({ data }) => {
   const width = 100;
   const height = 100;
   return (
      <div
         style={{ width: width + "px", height: height + "px" }}
         className="rounded-full border p-2 bg-primary flex justify-center items-center"
      >
         <p className="text-background">{data?.label}</p>
         <Handle type="target" position={Position.Top} style={{ left: width / 2 }} />
         <Handle type="source" position={Position.Bottom} style={{ left: width / 2 }} />
      </div>
   );
};

export default CircleNode;
