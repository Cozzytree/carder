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
    // this.canvas.on("selection:created", (e) => {
    //    callbackSeleted(e.selected);
    // });
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
    this.canvas.dispose();
  }
}

export default CanvasC;
