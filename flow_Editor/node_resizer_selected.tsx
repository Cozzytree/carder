import { memo } from "react";
import { Handle, Position, NodeResizer } from "@xyflow/react";
import { NodeData } from "./types/types";

const ResizableNodeSelected = ({
   data,
   selected,
   isConnectable,
}: {
   data: NodeData;
   isConnectable: boolean;
   selected: boolean;
}) => {
   return (
      <>
         <NodeResizer color="#ff0071" isVisible={selected} minWidth={100} minHeight={30} />
         <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
         <div style={{ padding: 10 }}>{data.label}</div>
         <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
      </>
   );
};

export default memo(ResizableNodeSelected);
