export type action = "update" | "delete" | "create" | "resize" | "canvas-props";

type queueShape = {
   shapeId: string;
   props: string;
   page_id: string;
   action: action;
   type: string;
};

class QueueStore {
   shapes: queueShape[][];

   constructor() {
      this.shapes = [];
   }

   addNewShapes(shapes: queueShape[]) {
      this.shapes.push(shapes);
   }

   popShapes() {
      if (!this.shapes.length) return undefined;
      if (this.shapes.length == 1) {
         const p = this.shapes[0];
         this.shapes = [];
         return p;
      }

      const poppedShape = this.shapes[0];
      if (this.shapes.length > 1) {
         this.shapes = this.shapes.slice(1); // Slice only when there are multiple shapes
      } else {
         this.shapes = []; // Clear if only one shape is remaining
      }

      return poppedShape;
   }
}

export default QueueStore;
