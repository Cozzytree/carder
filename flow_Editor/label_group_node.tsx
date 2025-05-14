import { memo } from "react";

import { NodeProps } from "@xyflow/react";
import { GroupNode } from "@/components/labeled-group-node";
import type { NodeData } from "./types/types";

const LabeledGroupNode = memo(({ selected, data }: NodeProps) => {
   const nodeData = data as NodeData;
   return (
      <GroupNode width={200} height={1000} selected={selected} label={nodeData?.label || "Label"} />
   );
});

LabeledGroupNode.displayName = "LabeledGroupNode";
export default LabeledGroupNode;
