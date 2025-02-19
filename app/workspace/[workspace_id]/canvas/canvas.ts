import {
   ActiveSelection,
   Canvas,
   CircleBrush,
   FabricObject,
   Group,
   PencilBrush,
   SprayBrush,
   TPointerEvent,
   TPointerEventInfo,
} from "fabric";
import { brushTypes, canvasShapes } from "./types";
import {
   DefaultCircle,
   DefaultIText,
   DefaultRect,
   DefaultTriangle,
} from "./default_styles";

interface canvasInterface {
   canvas: Canvas;
   canvasElement: HTMLCanvasElement;

   callbackDrawMode: (v: boolean) => void;
   callbackSeleted: (o: FabricObject | undefined) => void;
}

class CanvasC {
   declare mousedownpoint: { x: number; y: number };
   declare canvas: Canvas;
   declare draw_brush: PencilBrush | SprayBrush | CircleBrush | null;
   declare callbackDrawMode: (v: boolean) => void;
   declare canvasElement: HTMLCanvasElement;

   isDragging: boolean = false;

   brush_props: { stroke: number; stroke_color: string } = {
      stroke: 10,
      stroke_color: "black",
   };

   constructor({
      canvas,
      callbackSeleted,
      callbackDrawMode,
      canvasElement,
   }: canvasInterface) {
      this.canvas = canvas;
      this.draw_brush = null;
      this.callbackDrawMode = callbackDrawMode;
      this.canvasElement = canvasElement;

      this.canvas.on("mouse:down", () => {
         const active = canvas.getActiveObject();
         callbackSeleted(active);
      });
      this.canvas.on("mouse:up", () => {
         const active = canvas.getActiveObject();
         callbackSeleted(active);
      });
      this.canvas.on("object:moving", () => {
         // consol
      });
      this.canvas.on("object:removed", () => {
         callbackSeleted(undefined);
      });
      if (window.innerWidth <= 480) {
         this.canvas.selection = false;
         this.canvas.on("mouse:move", this.canvasMouseMove.bind(this));
         this.canvas.on("mouse:down", this.canvasMouseDown.bind(this));
         this.canvas.on("mouse:up", this.canvasMouseup.bind(this));
      } else {
         this.canvas.selection = true;
      }
   }

   canvasMouseDown(e: TPointerEventInfo<TPointerEvent>) {
      if (this.canvas.getActiveObject()) return;
      const p = e.scenePoint;
      this.mousedownpoint = { x: p.x, y: p.y };
      this.isDragging = true;
   }
   canvasMouseMove(e: TPointerEventInfo<TPointerEvent>) {
      if (!this.isDragging) return;
      this.canvasElement.style.pointerEvents = "none";
      // const { x, y } = e.scenePoint;

      // const vpt = this.canvas.viewportTransform;
      // vpt[4] += x - this.mousedownpoint.x;
      // vpt[5] += y - this.mousedownpoint.y;
      // this.canvas.requestRenderAll();
   }
   canvasMouseup(e) {
      this.isDragging = false;
      this.canvasElement.style.pointerEvents = "auto";
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

   canvasToggleDrawMode() {
      if (this.canvas.isDrawingMode) {
         this.canvas.isDrawingMode = false;
         this.callbackDrawMode(false);
      } else {
         this.callbackDrawMode(true);
         this.canvas.isDrawingMode = true;
         if (!this.draw_brush) {
            this.draw_brush = new PencilBrush(this.canvas);
            this.draw_brush.width = this.brush_props.stroke;
            this.draw_brush.color = this.brush_props.stroke_color;
         }

         this.canvas.freeDrawingBrush = this.draw_brush;
      }
   }

   setBrushColor(c: string) {
      if (!this.draw_brush) return;
      this.draw_brush.color = c;
      this.brush_props.stroke_color = c;
   }
   setBrushWidth(new_width: number) {
      if (this.draw_brush == null) return;
      this.draw_brush.width = new_width;
      this.brush_props.stroke = new_width;
   }
   setBrushType(brush_type: brushTypes) {
      if (this.draw_brush == null) return;

      // Set the brush type to the new type
      if (brush_type === "spray") {
         this.draw_brush = new SprayBrush(this.canvas);
      } else if (brush_type === "pencil") {
         this.draw_brush = new PencilBrush(this.canvas);
      } else if (brush_type === "circle") {
         this.draw_brush = new CircleBrush(this.canvas);
      }

      this.draw_brush.color = this.brush_props.stroke_color;
      this.draw_brush.width = this.brush_props.stroke;

      this.canvas.freeDrawingBrush = this.draw_brush;
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
