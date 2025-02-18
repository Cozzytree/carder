import { ActiveSelection, Canvas, FabricObject, Group } from "fabric";
import { canvasShapes } from "./types";
import {
   DefaultCircle,
   DefaultIText,
   DefaultRect,
   DefaultTriangle,
} from "./default_styles";

interface canvasInterface {
   canvas: Canvas;

   callbackSeleted: (o: FabricObject | undefined) => void;
}

class CanvasC {
   declare canvas: Canvas;

   constructor({ canvas, callbackSeleted }: canvasInterface) {
      this.canvas = canvas;

      this.canvas.on("mouse:down", (e) => {
         const active = canvas.getActiveObject();
         callbackSeleted(active);
      });
      this.canvas.on("mouse:up", (e) => {
         const active = canvas.getActiveObject();
         callbackSeleted(active);
      });
      this.canvas.on("object:moving", (e) => {
         // consol
      });
      this.canvas.on("object:removed", () => {
         callbackSeleted(undefined);
      });
   }

   createNewShape(shapetype: canvasShapes, textType?: number) {
      const w = this.canvas.width;
      const h = this.canvas.height;
      let shape: FabricObject | null = null;
      switch (shapetype) {
         case "rect":
            shape = new DefaultRect({
               width: 100,
               height: 100,
               top: this.canvas.height / 2 - 50,
               left: this.canvas.width / 2 - 50,
               strokeWidth: 3,
            });
            break;
         case "circle":
            shape = new DefaultCircle({
               top: h / 2 - 10,
               left: w / 2 - 10,
               radius: 20,
            });
            break;
         case "i-text":
            shape = new DefaultIText("Text", {
               fontSize: Number(textType) > 1 ? 40 : 80,
               fontWeight: 400,
               top: h / 2 - 50,
               left: w / 2 - 50,
               underline: false,
            });
            if (shape instanceof DefaultIText) {
               shape.enterEditing();
            }
            break;
         case "triangle":
            shape = new DefaultTriangle({
               width: 100,
               height: 100,
               top: h / 2 - 50,
               left: w / 2 - 50,
            });
      }

      if (shape) {
         this.canvas.discardActiveObject();
         this.canvas.add(shape);
         this.canvas.setActiveObject(shape);
         this.canvas.requestRenderAll();
      }
   }

   changeCanvasColor(v: string) {
      this.canvas.set("backgroundColor", v);
      this.canvas.requestRenderAll();
   }

   deleteObject() {
      const a = this.canvas.getActiveObjects();
      if (!a) return;
      this.canvas.discardActiveObject();
      a.forEach((o) => {
         this.canvas.remove(o);
      });
      // if (a instanceof ActiveSelection) {
      //    a.forEachObject((o) => {
      //       this.canvas = this.canvas;
      //       this.canvas.remove(o);
      //    });
      // } else {
      //    this.canvas.remove(a);
      // }

      this.canvas.requestRenderAll();
      this.canvas.fire("object:removed");
   }

   changeCanvasObjectIndexes(obj: FabricObject | undefined, v: 1 | 2 | 3 | 4) {
      /*
      1 = send back 1
      2 = end fron 1
      3 send last
      4 bring front
      */
      if (!obj) return;
      if (v == 1) {
         this.canvas.sendObjectBackwards(obj);
      } else if (v == 2) {
         this.canvas.bringObjectForward(obj);
      } else if (v == 3) {
         this.canvas.sendObjectToBack(obj);
      } else {
         this.canvas.bringObjectToFront(obj);
      }
      this.canvas.requestRenderAll();
   }

   async cloneCanvasObject() {
      return await this.canvas.getActiveObject()?.clone();
   }

   async duplicateCanvasObject() {
      const c = await this.cloneCanvasObject();
      if (!c) return;
      this.canvas.discardActiveObject();

      if (c instanceof ActiveSelection || c instanceof Group) {
         c.forEachObject((s) => {
            s.canvas = this.canvas;
            s.set({ top: s.top + 10, left: s.left + 10 });
            this.canvas.add(s);
         });
         c.setCoords();
      } else {
         c.set({ top: c.top + 10, left: c.left + 10 });
         c.setCoords();
         this.canvas.add(c);
      }
      this.canvas.setActiveObject(c);
      this.canvas.requestRenderAll();
   }

   changeCanvasProperties(obj: FabricObject, key: string, value?: any) {
      if (obj instanceof ActiveSelection || obj instanceof Group) {
         obj.forEachObject((o) => {
            o.set(key, value);
         });
         this.canvas.requestRenderAll();
      } else {
         obj.set(key, value);
         this.canvas.requestRenderAll();
      }
   }

   clear() {
      this.canvas.clear();
      this.canvas.destroy();
   }
}

export default CanvasC;
