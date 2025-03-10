import {
  Canvas,
  CircleBrush,
  FabricImage,
  FabricObject,
  Gradient,
  Group,
  PencilBrush,
  SprayBrush,
  TPointerEvent,
  ActiveSelection,
  TPointerEventInfo,
  FabricObjectProps,
  Rect,
} from "fabric";
import { brushTypes, canvasShapes, textTypes } from "./types";
import {
  DefaultCircle,
  DefaultCustomPath,
  DefaultImage,
  DefaultLine,
  DefaultRect,
  DefaultTriangle,
} from "./default_styles";
import { makeText } from "./utilfunc";
import { filtersOptions } from "./constants";
import { ObjectMoving } from "./object-guides/object-guides";

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
  declare snapping: boolean;

  history: any[][] = [];
  historyRedo: any[][] = [];
  isDragging: boolean = false;
  guideLines: DefaultLine[] | [] = [];

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
    this.snapping = false;

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
      callbackSeleted(selected);
    });
    this.canvas.on("mouse:down", () => {
      const active = canvas.getActiveObject();
      callbackSeleted(active);

      // store to history
      const objs = [];
      this.canvas.getObjects().forEach((o) => {
        const r = o.getBoundingRect();

        objs.push({ ...o.toObject(), left: r.left, top: r.top });
      });
      if (objs.length) {
        this.history.push(objs);
      }
    });
    this.canvas.on("object:moving", (e) => {
      if (this.snapping) {
        if (this.guideLines.length) {
          this.guideLines.forEach((l) => this.canvas.remove(l));
        }
        this.guideLines = ObjectMoving(e, this.canvas);
        this.guideLines.forEach((l) => {
          l.set("name", "guide");
          this.canvas.add(l);
        });
      }
    });
    this.canvas.on("object:added", (e) => {
      callbackSeleted(e.target);
    });

    this.canvas.on("object:modified", (e) => {
      if (this.guideLines.length) {
        this.guideLines.forEach((l) => this.canvas.remove(l));
      }
      callbackSeleted(e.target);
    });

    this.canvas.on("object:removed", (e) => {
      if (e.target && e.target.get("name") !== "guide") {
        callbackSeleted(undefined);
      }
    });

    this.canvas.on("path:created", (e) => {
      e.path.set({
        objectCaching: true,
        cornerSize: 10,
        cornerStyle: "circle",
        padding: 1,
        cornerStrokeColor: "#2020ff",
        strokeUniform: true,
        transparentCorners: false,
        cornerColor: "#2090a0",
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey) {
        if (e.key == "z") {
          this.undo();
        } else if (e.key == "y") {
          this.redo();
        } else if (e.key == "d") {
          e.preventDefault();
          this.duplicateCanvasObject();
        }
      }
    });
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

  async createNewImage(
    img: string | HTMLImageElement,
    props?: Partial<FabricObjectProps>,
  ) {
    let image: DefaultImage | null = null;
    if (img instanceof HTMLImageElement) {
      image = await FabricImage.fromElement(img);
    } else {
      image = await FabricImage.fromURL(img);
    }

    if (image instanceof FabricImage) {
      image.filters = Array.from({ length: filtersOptions.length });
      // image.filters[0] = new filters.Sepia();
      // image.applyFilters();
    }
    if (image) {
      image.set({
        left: this.canvas.width / 2 - image.width / 2,
        top: this.canvas.height / 2 - image.height / 2,
        cornerSize: 10,
        cornerStyle: "circle",
        padding: 1,
        cornerStrokeColor: "#2020ff",
        strokeUniform: true,
        transparentCorners: false,
        cornerColor: "#2090a0",
        objectCaching: true,
        ...props,
      });

      this.canvas.add(image);
      this.canvas.requestRenderAll();
    } else {
      console.error("error while loading image");
    }
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
          strokeWidth: 3,
        });
    }

    if (shape) {
      this.canvas.discardActiveObject();
      this.canvas.add(shape);
      this.canvas.setActiveObject(shape);
      this.canvas.requestRenderAll();
    }
  }

  changeCanvasColor(v: string | Gradient<unknown, "linear" | "radial">) {
    this.canvas.set("backgroundColor", v);
    this.canvas.requestRenderAll();
  }
  async changeCanvasBackground(v: HTMLImageElement | string) {
    let img: DefaultImage | null = null;
    console.log(v);
    if (typeof v == "string") {
      img = await FabricImage.fromURL(v);
    } else if (v instanceof HTMLImageElement) {
      img = await FabricImage.fromElement(v);
    }

    if (img) {
      // Get the aspect ratio of the image
      const imgAspectRatio = img.width / img.height;
      const canvasAspectRatio = this.canvas.width / this.canvas.height;

      let newWidth = this.canvas.width;
      let newHeight = this.canvas.height;

      // Scale the image to fit the canvas while maintaining the aspect ratio
      if (imgAspectRatio > canvasAspectRatio) {
        // Image is wider than canvas, scale based on width
        newHeight = this.canvas.width / imgAspectRatio;
      } else {
        // Image is taller than canvas, scale based on height
        newWidth = this.canvas.height * imgAspectRatio;
      }

      // Apply the new scaled dimensions to the image
      img.set({
        scaleX: newWidth / img.width,
        scaleY: newHeight / img.height,
      });

      this.canvas.backgroundImage = img;
      this.canvas.requestRenderAll();
    }
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
        s.set({
          top: s.top + 10,
          left: s.left + 10,
          cornerSize: 10,
          cornerStyle: "circle",
          padding: 1,
          transparentCorners: false,
          cornerColor: "#2090a0",
        });
        this.canvas.add(s);
      });
      c.setCoords();
    } else {
      c.set({
        top: c.top + 10,
        left: c.left + 10,
        cornerSize: 10,
        cornerStyle: "circle",
        padding: 1,
        transparentCorners: false,
        cornerColor: "#2090a0",
      });
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
  changeCanvasProperties(obj: FabricObject, props: Record<string, any>) {
    const setPropertyRecursively = (object: FabricObject, i: number) => {
      if (object instanceof Group) {
        object.forEachObject((o) => {
          setPropertyRecursively(o, i);
        });
      } else {
        if (props.height) {
          const currh = object.get("height");
          object.set({ height: currh + (currh - props.height || 0) });
          obj.setCoords();
        } else if (props.width) {
          const currw = object.get("width");
          object.set({ width: currw + (currw - props.width || 0) });
          obj.setCoords();
        }
        object.set({ ...props });
      }
    };

    // Start the recursive process
    if (props.left != null || props.top != null) {
      obj.set({ ...props });
    } else if (obj instanceof ActiveSelection || obj instanceof Group) {
      obj.forEachObject((o, i) => {
        setPropertyRecursively(o, i);
      });
    } else {
      setPropertyRecursively(obj, 0);
    }

    // Request a re-render of the canvas after all properties are updated
    this.canvas.requestRenderAll();
  }

  changeCanvasSize(t: "width" | "height", v: number) {
    if (t == "width") {
      this.canvas.setWidth(v);
    } else {
      this.canvas.setHeight(v);
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
  addFilterToImage(filter: any, index: number, activeObject?: FabricObject) {
    if (activeObject instanceof FabricImage) {
      if (!activeObject.filters[index]) {
        if (filter) {
          activeObject.filters[index] = filter;
        }
        activeObject.applyFilters();
        this.canvas.requestRenderAll();
      } else {
        // @ts-expect-error not sure
        activeObject.filters[index] = undefined;
        activeObject.applyFilters();
        this.canvas.requestRenderAll();
      }
    }
  }
  toggleCanvasSelection() {
    if (this.canvas.selection) {
      this.canvas.selection = false;
    } else {
      this.canvas.selection = true;
    }
    console.log(this.canvas.selection);
    this.canvas.requestRenderAll();
  }

  saveCanvasAs(t: "image" | "json") {
    if (t == "image") {
      const data = this.canvas.toDataURL({
        format: "png",
        quality: 100,
        multiplier: 2,
      });
      const l = document.createElement("a");
      l.href = data;
      l.download = "canvas.png";
      l.click();
    } else {
      const j = this.canvas.toJSON();
      const jsonBlob = new Blob([JSON.stringify(j)], {
        type: "application/json",
      });
      const l = document.createElement("a");
      l.href = URL.createObjectURL(jsonBlob); // Create an object URL for the Blob
      l.download = "data.json"; // Specify the filename
      l.click(); // Trigger the download
    }
  }

  async loadFromFile(json: string) {
    await this.canvas.loadFromJSON(json, (v) => {
      // console.log(v);
    });
    this.canvas.renderAll();
  }

  undo() {
    if (!this.history.length) return;
    const lastState = this.history.pop();
    if (!lastState) return;

    this.historyRedo.push(lastState);
    this.canvas.discardActiveObject();
    this.canvas.remove(...this.canvas.getObjects());

    lastState.forEach((o: FabricObject) => {
      let s: FabricObject | null = null;
      switch (o.type) {
        case "Rect":
          s = new DefaultRect({
            top: o.top,
            left: o.left,
            stroke: o.stroke,
            fill: o.fill,
            rx: o.rx,
            ry: o.ry,
            width: o.width,
            height: o.height,
            strokeWidth: o.strokeWidth,
          });
          break;
        case "Path":
          s = new DefaultCustomPath(o?.path?.join(" ") || "", {
            left: o.left,
            top: o.top,
            width: o.width,
            stroke: o.stroke,
            strokeWidth: o.strokeWidth,
            fill: o.fill,
          });
          break;
        case "Image":
          this.createNewImage(o.src as string, {
            left: o.left,
            top: o.top,
            width: o.width,
            stroke: o.stroke,
            strokeWidth: o.strokeWidth,
            fill: o.fill,
          });
          break;
      }
      if (s) {
        this.canvas.add(s);
      }
    });
    this.canvas.requestRenderAll();
  }

  redo() {
    if (!this.historyRedo.length) return;
    const lastState = this.historyRedo.pop();
    if (!lastState) return;

    this.history.push(lastState);
    this.canvas.remove(...this.canvas.getObjects());
    lastState.forEach((o: FabricObject) => {
      let s: FabricObject | null = null;
      switch (o.type) {
        case "Rect":
          if (o instanceof Rect) {
            s = new DefaultRect({
              top: o.top,
              left: o.left,
              stroke: o.stroke,
              fill: o.fill,
              rx: o.rx,
              ry: o.ry,
              width: o.width,
              height: o.height,
              strokeWidth: o.strokeWidth,
            });
          }
          break;
        case "Path":
          s = new DefaultCustomPath(o?.path?.join(" ") || "", {
            left: o.left,
            top: o.top,
            width: o.width,
            stroke: o.stroke,
            strokeWidth: o.strokeWidth,
            fill: o.fill,
          });
          break;
        case "Image":
          this.createNewImage(o.src as string, {
            left: o.left,
            top: o.top,
            width: o.width,
            stroke: o.stroke,
            strokeWidth: o.strokeWidth,
            fill: o.fill,
          });
          break;
      }
      if (s) {
        this.canvas.add(s);
      }
    });
    this.canvas.requestRenderAll();
  }

  clear() {
    // this.canvas.clear();
    // this.canvas.destroy();
    this.canvas.dispose();
  }
}

export default CanvasC;
