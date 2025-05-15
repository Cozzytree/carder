import { v4 as uuidV4 } from "uuid";
import type { NodeData, NodeType } from "./types/types";

export class NewNodeObj {
   type: NodeType;
   data: NodeData;
   id: string;

   constructor({ type, data }: { type: NodeType; data: NodeData }) {
      this.type = type;
      this.data = data;
      this.id = uuidV4();
   }
}
