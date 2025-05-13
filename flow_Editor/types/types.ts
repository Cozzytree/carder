export type NodeData = {
   label: string;
   content: string;
   background: string;
   text: string;
};

export type EdgeType = "default" | "straight" | "step" | "smoothstep" | "simplebezier";

export type NodeType = "textUpdater" | "circle" | "default";
