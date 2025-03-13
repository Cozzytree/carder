export type canvasShapes =
  | "i-text"
  | "rect"
  | "ellipse"
  | "circle"
  | "path"
  | "triangle"
  | "polygon";

export type Align =
  | "left"
  | "center"
  | "right"
  | "justify"
  | "justify-left"
  | "justify-center"
  | "justify-right";

export type whichOption =
  | "shapes"
  | "draw"
  | "text"
  | "images"
  | "canvasObj"
  | "canvas"
  | "color"
  | "fonts"
  | "resize_canvas"
  | "outline"
  | "image-filters";

export enum WhichOptionEmum {
  SHAPE = "shapes",
  DRAW = "draw",
  TEXT = "text",
  CANVASOBJ = "canvasObj",
  IMAGE = "images",
  CANVAS = "canvas",
  COLOR = "color",
  FONTS = "fonts",
  RESIZE_CANVAS = "resize_canvas",
  OUTLINE = "outline",
  IMAGEFILTERS = "image-filters",
}

export type textTypes = "heading" | "body" | "paragrpah";
export type brushTypes = "pencil" | "spray" | "circle";
