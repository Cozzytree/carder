import {
   AlignCenterIcon,
   AlignHorizontalJustifyCenter,
   AlignHorizontalJustifyEnd,
   AlignHorizontalJustifyStart,
   AlignLeft,
   AlignRightIcon,
   ArrowBigRight,
   ArrowRight,
   BrushIcon,
   CircleDot,
   CircleIcon,
   DiamondIcon,
   HexagonIcon,
   LucideIcon,
   PencilIcon,
   Square,
   StarIcon,
   TriangleIcon,
} from "lucide-react";
import { Align, brushTypes, canvasShapes, textTypes } from "./types";

const basicColors = ["#101010", "#ef4040", "#20ff50", "#2050ef", "#9a9a10"];

const gradients = [
   ["#FF7E5F", "#FEB47B"], // Sunset Peach
   ["#6A11CB", "#2575FC", "#6A11CB"], // Purple & Blue with a repeat
   ["#00C9FF", "#92FE9D", "#00F260"], // Aquamarine with Green
   ["#FF6A00", "#FFD200", "#FF512F"], // Orange to Yellow and Red
   ["#00F260", "#0575E6"], // Green to Blue
   ["#F09819", "#FF5858", "#FF9A8B"], // Coral to Pink with Peach
   ["#1D2B64", "#F8CDDA", "#FF512F"], // Deep Blue to Light Pink and Red
   ["#FF512F", "#DD2476"], // Red to Pink
   ["#16BFFD", "#CB3066"], // Turquoise to Red
   ["#2BC0E4", "#EAECC6", "#F7797D"], // Blue to Light Green with Red
   ["#FBD3E9", "#BB377D", "#D4E5F9"], // Pink to Violet and Light Blue
   ["#D4FC79", "#96E6A1", "#FF9A8B"], // Green to Light Green and Peach
   ["#FF9A8B", "#FF6A00", "#FFD200"], // Peach to Orange and Yellow
   ["#A1C4FD", "#C2E9FB"], // Light Blue to Light Cyan
   ["#F7797D", "#FCE8A8", "#FF6A00"], // Red to Yellow and Orange
   ["#56CCF2", "#2F80ED"], // Sky Blue to Deep Blue
   ["#D38312", "#A83279", "#FF512F"], // Gold to Purple and Red
   ["#D4E5F9", "#E1A8F0"], // Light Blue to Lavender
   ["#AB83A1", "#B2D9C6", "#FF6A00"], // Rose to Mint and Orange
   ["#00A8C6", "#1C92D2"], // Cyan to Blue
];

const colors = [
   ...basicColors,
   "#ff7f00", // vibrant orange
   "#ff00ff", // magenta
   "#00ffff", // cyan
   "#8b00ff", // purple
   "#00ff80", // lime green
   "#ff0055", // pinkish red
   "#d3d3d3", // light gray
   "#000080", // navy blue
   "#ffb6c1", // light pink
   "#8a2be2", // blue violet
   "#d2691e", // chocolate brown
   "#cd5c5c", // indian red
   "#f0e68c", // khaki
   "#e0ffff", // light cyan
   "#ff6347", // tomato
   "#adff2f", // green yellow
];
const strokeStyles: [number, number][] = [
   [0, 0],
   [10, 10],
   [5, 5],
];
const widths = [2, 4, 6];
const radius = [2, 4, 6];
const fonts = ["Arial", "monoscope", "sans serif", "Balsamiq Sans"];

const extra_fonts = [
   {
      name: "Pacifico",
      url: "https://fonts.googleapis.com/css2?family=Pacifico&display=swap",
   },
   {
      name: "Cadarville",
      url: "https://fonts.googleapis.com/css2?family=Cedarville+Cursive&display=swap",
   },
   {
      name: "Pixilify",
      url: "https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap",
   },
];
const textjustify: { label: Align; I: LucideIcon }[] = [
   { I: AlignHorizontalJustifyStart, label: "justify-left" },
   { I: AlignHorizontalJustifyCenter, label: "justify" },
   { I: AlignHorizontalJustifyEnd, label: "justify-right" },
];
const aligns: { label: Align; I: LucideIcon }[] = [
   { label: "left", I: AlignLeft },
   { label: "center", I: AlignCenterIcon },
   { label: "right", I: AlignRightIcon },
];

const fontweights = [100, 300, 500, 700, 900];
const alphas = [0, 0.25, 0.5, 0.75, 1];
const brushes: { btype: brushTypes; I: LucideIcon }[] = [
   { btype: "pencil", I: PencilIcon },
   { btype: "spray", I: BrushIcon },
   { btype: "circle", I: CircleDot },
];

const c_paths = {
   quadrilateral: `
   M 100 10
   L 200 10
   Q 205 10 210 15
   L 230 95
   Q 232 100 230 100
   L 70 100)
   Q 68 95 70 95
   L 90 15
   Q 93 10 100 10
   Z
   `,
   star: `
   M 108, 0.0
   L 141 70
   L 218 70
   L 162 131
   L 180 205
   L 108 170
   L 41.2 205
   L 60 131
   L 1 70
   L 75 70
   L 108 0
   Z
   `,
   arrow_plane: `
   M 105 50
   L 150 50
   Z
   M 145 45
   L 150 50
   Z
   M 150 50
   L 145 55
   Z
   `,
   diamond: `
   M 105 5
   L 145 45
   Q 150 50 145 55
   L 105 95
   Q 100 100 95, 95
   L 55 55
   Q 50 50 55 45
   L 95 5
   Q 100 0 105 5
   `,
   arrow_right: `
   M 50 200
   L 150 200
   L 150 195
   L 170 205
   L 150 215
   L 150 210
   L 50 210
   L 50 200
   Z
   `,
   arrow_left: `M 50 200
   L 150 200
   L 150 195
   L 170 205
   L 150 215
   L 150 210
   L 50 210
   L 50 200
   Z`,
   parallelogram: `
   M 70 20
   L 150 20
   Q 155 20 150 30
   L 140 60
   Q 139 65 135 65
   L 50 65
   Q 48 65 50 60
   L 65 25
   Q 67 20 70 20`,
   hexagon: `
   M 70 20
   L 100 20

   L 120 40
   L 120 60

   L 100 80
   L 70 80

   L 50 60
   L 50 40

   L 70 20
   `,
   triangle: `
   M 105 105
   L 145 145
   Q 150 150 145 150
   L 55 150
   Q 50 150 55 145
   L 95 105
   Q 100 100 105 105
   Z
   `,
};

const shapes: { type: canvasShapes; I: LucideIcon; path?: string }[] = [
   { I: Square, type: "rect" },
   { I: Square, type: "path", path: c_paths.parallelogram },
   { I: DiamondIcon, type: "path", path: c_paths.diamond },
   { I: TriangleIcon, type: "path", path: c_paths.triangle },
   { I: CircleIcon, type: "circle" },
   { I: HexagonIcon, type: "path", path: c_paths.hexagon },
   { I: StarIcon, type: "path", path: c_paths.star },
];

const lines: { type: canvasShapes; path?: string; I: LucideIcon }[] = [
   { type: "path", I: ArrowBigRight, path: c_paths.arrow_right },
   { type: "path", I: ArrowRight, path: c_paths.arrow_plane },
];

const texts: { type: textTypes; img: string }[] = [
   { type: "heading", img: "/heading.png" },
   { type: "body", img: "/body.png" },
];

export {
   gradients,
   extra_fonts,
   shapes,
   lines,
   texts,
   c_paths,
   brushes,
   basicColors,
   radius,
   colors,
   strokeStyles,
   widths,
   fonts,
   aligns,
   textjustify,
   fontweights,
   alphas,
};
