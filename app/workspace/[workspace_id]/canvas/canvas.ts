import {
   ActiveSelection,
   Canvas,
   CircleBrush,
   FabricObject,
   Gradient,
   Group,
   PencilBrush,
   SprayBrush,
   TPointerEvent,
   TPointerEventInfo,
} from "fabric";
import { brushTypes, canvasShapes, textTypes } from "./types";
import {
   DefaultCircle,
   DefaultCustomPath,
   DefaultIText,
   DefaultRect,
   DefaultTriangle,
} from "./default_styles";
import { makeText } from "./utilfunc";

interface canvasInterface {
   canvas: Canvas;
   canvasElement: HTMLCanvasElement;

   callbackDrawMode: (v: boolean) => void;
   callbackSeleted: (o: FabricObject | undefined) => void;
   changePointerEventsForCanvas: (v: boolean) => void;
}

class CanvasC {
   declare mousedownpoint: { x: number; y: number };
   declare canvas: Canvas;
   declare draw_brush: PencilBrush | SprayBrush | CircleBrush | null;
   declare callbackDrawMode: (v: boolean) => void;
   declare canvasElement: HTMLCanvasElement;
   declare changePointerEventsForCanvas: (v: boolean) => void;

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
      changePointerEventsForCanvas,
   }: canvasInterface) {
      this.canvas = canvas;
      this.draw_brush = null;
      this.callbackDrawMode = callbackDrawMode;
      this.canvasElement = canvasElement;
      this.changePointerEventsForCanvas = changePointerEventsForCanvas;

      this.canvas.on("selection:created", () => {
         const selected = this.canvas.getActiveObject();
         if (selected?.type === "activeselection") {
            selected.set({
               borderDashArray: [3],
               cornerSize: 10,
               cornerStyle: "circle",
               cornerStrokeColor: "#0000ff",
               strokeUniform: true,
               cornerColor: "#2020ff",
               transparentCorners: false,
               padding: 2,
            });
         }
      });
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
      // this.changePointerEventsForCanvas(false);
      // const { x, y } = e.scenePoint;

      // const vpt = this.canvas.viewportTransform;
      // vpt[4] += x - this.mousedownpoint.x;
      // vpt[5] += y - this.mousedownpoint.y;
      // this.canvas.requestRenderAll();
   }
   canvasMouseup(e) {
      this.isDragging = false;
      // this.changePointerEventsForCanvas(true);
   }

   createText(type: textTypes) {
      const t = makeText(type);
      if (!t) return;
      t.set({
         fontStyle: "normal",
         top: this.canvas.height / 2 - t.height,
         left: this.canvas.width / 2 - t.width,
      });
      this.canvas.discardActiveObject();
      this.canvas.add(t);
      this.canvas.setActiveObject(t);
      this.canvas.requestRenderAll();
   }

   createNewShape({
      shapetype,
      path,
   }: {
      shapetype: canvasShapes;
      path?: string;
   }) {
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
         case "triangle":
            shape = new DefaultTriangle({
               width: 100,
               height: 100,
               top: h / 2 - 50,
               left: w / 2 - 50,
            });
            break;
         case "path":
            shape = new DefaultCustomPath(path || "", {
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

   changeCanvasColor(v: string | Gradient<unknown, "linear">) {
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

   changeCanvasSize(t: "width" | "height", v: number) {
      if (t == "width") {
         this.canvas.set("width", v);
      } else {
         this.canvas.set("height", v);
      }
      this.canvas.requestRenderAll();
   }

   async addNewFont(name: string, url: string) {
      const f = new FontFace(name, url, {
         style: "normal",
         weight: "normal",
      });
      await f.load().catch((e) => {
         if (e instanceof Error) {
            throw new Error(e.message);
         }
      });
      document.fonts.add(f);
      return true;
   }

   clear() {
      // this.canvas.clear();
      // this.canvas.destroy();
      this.canvas.dispose();
   }
}

// function handleObectMovingSnap({
//    canvas,
//    obj,
//    snapD,
// }: {
//    snapD: number;
//    obj: FabricObject;
//    canvas: Canvas;
// }) {
//    const cW = canvas?.width;
//    const cH = canvas?.height;
//    const left = obj.left;
//    const top = obj.top;
//    const right = left + obj.width + obj.scaleX;
//    const bottom = top + obj.height + obj.scaleY;

//    const cebterX = left + (obj.width + obj.scaleX) / 2;
//    const centerY = top + (obj.height + obj.scaleY) / 2;

//    let newGuideLines = [];
// }

export default CanvasC;
