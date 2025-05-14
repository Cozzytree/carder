export type NodeData = {
   label: string;
   content: string;
   background: string;
   text: string;
};

export type EdgeType =
   | "default"
   | "straight"
   | "step"
   | "smoothstep"
   | "simplebezier"
   | "buttonedge";

export type NodeType = "textUpdater" | "circle" | "default";
