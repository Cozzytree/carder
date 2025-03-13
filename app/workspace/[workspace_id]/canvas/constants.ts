import {
  AlignCenterIcon,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignLeft,
  AlignRightIcon,
  BrushIcon,
  CircleDot,
  LucideIcon,
  PencilIcon,
} from "lucide-react";
import { Align, brushTypes, canvasShapes } from "./types";
import { filters } from "fabric";

const canvasConfig = {
  selectionWidth: 3,
  selectionStroke: "#0000cd",
};

const gradients = [
  ["#FF7E5F", "#FEB47B"],
  ["#6A11CB", "#2575FC", "#6A11CB"],
  ["#00C9FF", "#92FE9D", "#00F260"],
  ["#FF6A00", "#FFD200", "#FF512F"],
  ["#00F260", "#0575E6"],
  ["#F09819", "#FF5858", "#FF9A8B"],
  ["#1D2B64", "#F8CDDA", "#FF512F"],
  ["#FF512F", "#DD2476"],
  ["#16BFFD", "#CB3066"],
  ["#2BC0E4", "#EAECC6", "#F7797D"],
  ["#FBD3E9", "#BB377D", "#D4E5F9"],
  ["#D4FC79", "#96E6A1", "#FF9A8B"],
  ["#FF9A8B", "#FF6A00", "#FFD200"],
  ["#A1C4FD", "#C2E9FB"],
  ["#F7797D", "#FCE8A8", "#FF6A00"],
  ["#56CCF2", "#2F80ED"],
  ["#D38312", "#A83279", "#FF512F"],
  ["#D4E5F9", "#E1A8F0"],
  ["#AB83A1", "#B2D9C6", "#FF6A00"],
  ["#00A8C6", "#1C92D2"],
  ["#FDCB82", "#D6A6FF"],
  ["#FFE000", "#F79C42"],
  ["#FDCB82", "#6A11CB", "#2575FC"],
  ["#9C2A2E", "#D6A6FF", "#5E3F5E"],
  ["#FDCB82", "#FFB6B9", "#F9A8B7"],
  ["#6A3093", "#A044FF"],
  ["#FFB3D9", "#FF77FF"],
  ["#C2E9FB", "#A1C4FD"],
  ["#1D976C", "#93F9B9"],
  ["#000000", "#434343"],
];

const colors = [
  "#101010",
  "#ef4040",
  "#20ff50",
  "#2050ef",
  "#9a9a10",
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

  // New colors
  "#f5a9d3", // pale pink
  "#6b8e23", // olive green
  "#ff1493", // deep pink
  "#ff4500", // orange red
  "#ffd700", // gold
  "#32cd32", // lime green
  "#20b2aa", // light sea green
  "#ff6347", // tomato red
  "#c71585", // medium violet red
  "#708090", // slate gray
  "#b0e0e6", // powder blue
  "#2e8b57", // sea green
  "#f08080", // light coral
  "#ff99cc", // pastel pink
  "#9400d3", // dark violet
  "#7fff00", // chartreuse
  "#fa8072", // salmon
  "#4682b4", // steel blue
  "#ffb6c1", // light pink
  "#800000", // maroon
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
  M11.2691 4.41115C11.5006 3.89177 11.6164 3.63208 11.7776 3.55211C11.9176 3.48263 12.082 3.48263 12.222 3.55211C12.3832 3.63208 12.499 3.89177 12.7305 4.41115L14.5745 8.54808C14.643 8.70162 14.6772 8.77839 14.7302 8.83718C14.777 8.8892 14.8343 8.93081 14.8982 8.95929C14.9705 8.99149 15.0541 9.00031 15.2213 9.01795L19.7256 9.49336C20.2911 9.55304 20.5738 9.58288 20.6997 9.71147C20.809 9.82316 20.8598 9.97956 20.837 10.1342C20.8108 10.3122 20.5996 10.5025 20.1772 10.8832L16.8125 13.9154C16.6877 14.0279 16.6252 14.0842 16.5857 14.1527C16.5507 14.2134 16.5288 14.2807 16.5215 14.3503C16.5132 14.429 16.5306 14.5112 16.5655 14.6757L17.5053 19.1064C17.6233 19.6627 17.6823 19.9408 17.5989 20.1002C17.5264 20.2388 17.3934 20.3354 17.2393 20.3615C17.0619 20.3915 16.8156 20.2495 16.323 19.9654L12.3995 17.7024C12.2539 17.6184 12.1811 17.5765 12.1037 17.56C12.0352 17.5455 11.9644 17.5455 11.8959 17.56C11.8185 17.5765 11.7457 17.6184 11.6001 17.7024L7.67662 19.9654C7.18404 20.2495 6.93775 20.3915 6.76034 20.3615C6.60623 20.3354 6.47319 20.2388 6.40075 20.1002C6.31736 19.9408 6.37635 19.6627 6.49434 19.1064L7.4341 14.6757C7.46898 14.5112 7.48642 14.429 7.47814 14.3503C7.47081 14.2807 7.44894 14.2134 7.41394 14.1527C7.37439 14.0842 7.31195 14.0279 7.18708 13.9154L3.82246 10.8832C3.40005 10.5025 3.18884 10.3122 3.16258 10.1342C3.13978 9.97956 3.19059 9.82316 3.29993 9.71147C3.42581 9.58288 3.70856 9.55304 4.27406 9.49336L8.77835 9.01795C8.94553 9.00031 9.02911 8.99149 9.10139 8.95929C9.16534 8.93081 9.2226 8.8892 9.26946 8.83718C9.32241 8.77839 9.35663 8.70162 9.42508 8.54808L11.2691 4.41115Z
   `,
  arrow_plane: `M3,12H21m-3,3,3-3L18,9`,
  diamond: `
   M13.3238354,4176.17833 L6.72208706,4169.57941 C6.33357313,4169.19089 6.33357313,4168.56128 6.72208706,4168.17275 L13.321843,4161.57283 C13.7103569,4161.18431 14.3399487,4161.18431 14.7284627,4161.57283 L21.330211,4168.17176 C21.7187249,4168.55929 21.7187249,4169.18989 21.330211,4169.57742 L14.7304551,4176.17833 C14.3419411,4176.56686 13.7123493,4176.56686 13.3238354,4176.17833 M23.416232,4167.51625 L15.407864,4159.50768 C15.01935,4159.11816 14.509301,4158.9239 14.0002481,4158.9239 C13.490199,4158.9239 12.98015,4159.11816 12.591636,4159.50768 L4.58326804,4167.51625 C3.80524399,4168.2933 3.80524399,4169.5545 4.58326804,4170.33255 L12.591636,4178.34111 C12.98015,4178.72964 13.490199,4178.9239 14.0002481,4178.9239 C14.509301,4178.9239 15.01935,4178.72964 15.407864,4178.34111 L23.416232,4170.33255 C24.194256,4169.5545 24.194256,4168.2933 23.416232,4167.51625
   `,
  arrow_right: `
   m300.84375 908.875c-.35929.0633-.67275.33918-.78125.6875l-.625 1.8125h-10.4375c-.52358.00005-.99995.47642-1 1v1c.00005.52358.47642.99995 1 1h10.4375l.625 1.8125c.17584.53611.8642.83335 1.375.59375l6-3c.36721-.17625.60257-.59466.5625-1 .001-.0312.001-.0625 0-.0937-.0597-.31022-.27572-.58621-.5625-.71875l-6-3c-.1822-.0907-.39248-.12385-.59375-.0937z
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
   M5.58555 6.45056C5.83087 5.59196 6.61564 5 7.5086 5H19.3485C20.6773 5 21.6366 6.27181 21.2716 7.54944L18.4144 17.5494C18.1691 18.408 17.3844 19 16.4914 19H4.65146C3.3227 19 2.36337 17.7282 2.72841 16.4506L5.58555 6.45056Z`,
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
   M4.2433 17.6513L10.5859 5.67095C11.0445 4.80456 11.2739 4.37136 11.5798 4.22973C11.8463 4.10637 12.1535 4.10637 12.42 4.22973C12.726 4.37136 12.9553 4.80456 13.414 5.67094L19.7565 17.6513C20.1668 18.4263 20.372 18.8138 20.3305 19.13C20.2943 19.4059 20.1448 19.6543 19.9179 19.8154C19.6579 19.9999 19.2194 19.9999 18.3425 19.9999H5.65737C4.78044 19.9999 4.34198 19.9999 4.08198 19.8154C3.85505 19.6543 3.70551 19.4059 3.66932 19.13C3.62785 18.8138 3.833 18.4263 4.2433 17.6513Z
   `,
  arrow_circle: `
  M256,0C114.618,0,0,114.618,0,256s114.618,256,256,256s256-114.618,256-256S397.382,0,256,0z M256,469.333 c-117.818,0-213.333-95.515-213.333-213.333S138.182,42.667,256,42.667S469.333,138.182,469.333,256S373.818,469.333,256,469.333 z
  M401.067,268.761c0.227-0.303,0.462-0.6,0.673-0.915c0.203-0.304,0.379-0.619,0.565-0.93 c0.171-0.286,0.35-0.565,0.508-0.86c0.17-0.317,0.313-0.643,0.466-0.967c0.145-0.308,0.299-0.61,0.43-0.925 c0.13-0.314,0.235-0.635,0.349-0.953c0.122-0.338,0.251-0.672,0.356-1.018c0.096-0.318,0.167-0.642,0.248-0.964 c0.089-0.353,0.188-0.701,0.259-1.061c0.074-0.372,0.117-0.748,0.171-1.122c0.045-0.314,0.105-0.622,0.136-0.941 c0.138-1.4,0.138-2.81,0-4.21c-0.031-0.318-0.091-0.627-0.136-0.941c-0.054-0.375-0.097-0.75-0.171-1.122 c-0.071-0.359-0.17-0.708-0.259-1.061c-0.081-0.322-0.152-0.645-0.248-0.964c-0.105-0.346-0.234-0.68-0.356-1.018 c-0.114-0.318-0.219-0.639-0.349-0.953c-0.131-0.315-0.284-0.618-0.43-0.925c-0.153-0.324-0.296-0.65-0.466-0.967 c-0.158-0.294-0.337-0.574-0.508-0.86c-0.186-0.311-0.362-0.626-0.565-0.93c-0.211-0.315-0.446-0.612-0.673-0.915 c-0.19-0.254-0.366-0.514-0.569-0.761c-0.443-0.54-0.91-1.059-1.403-1.552c-0.004-0.004-0.006-0.008-0.01-0.011l-85.333-85.333 c-8.331-8.331-21.839-8.331-30.17,0s-8.331,21.839,0,30.17l48.915,48.915H128c-11.782,0-21.333,9.551-21.333,21.333 s9.551,21.333,21.333,21.333h204.497l-48.915,48.915c-8.331,8.331-8.331,21.839,0,30.17c8.331,8.331,21.839,8.331,30.17,0 l85.333-85.333c0.004-0.004,0.006-0.008,0.01-0.011c0.493-0.494,0.96-1.012,1.403-1.552 C400.701,269.275,400.877,269.014,401.067,268.761z`,
  simple_line: `M3.293,20.707a1,1,0,0,1,0-1.414l16-16a1,1,0,1,1,1.414,1.414l-16,16A1,1,0,0,1,3.293,20.707Z`,
  trapezoid: `M31.7944 8H16.2056C14.8934 8 13.7335 8.85275 13.3421 10.1052L5.21713 36.1052C4.61345 38.037 6.05665 40 8.08057 40H39.9194C41.9433 40 43.3866 38.037 42.7829 36.1052L34.6579 10.1052C34.2665 8.85275 33.1066 8 31.7944 8Z`,
};

const polyPoints = {
  octagon: [
    { x: 22, y: 7.5 },
    { x: 22, y: 16.5 },
    { x: 16.5, y: 22 },
    { x: 7.5, y: 22 },
    { x: 2, y: 16.5 },
    { x: 2, y: 7.5 },
    { x: 7.5, y: 2 },
    { x: 16.5, y: 2 },
    { x: 22, y: 7.5 },
  ],
};

const shapes: {
  type: canvasShapes;
  I: string;
  path?: string;
  scale: number;
  points?: { x: number; y: number }[];
}[] = [
  { scale: 5, I: "/shapes/basic/rect.svg", type: "rect" },
  {
    scale: 5,
    I: "/shapes/basic/parallelogram.svg",
    type: "path",
    path: c_paths.parallelogram,
  },
  {
    scale: 5,
    I: "/shapes/basic/diamond.svg",
    type: "path",
    path: c_paths.diamond,
  },
  {
    scale: 5,
    I: "/shapes/basic/triangle.svg",
    type: "path",
    path: c_paths.triangle,
  },
  { scale: 5, I: "/shapes/basic/circle.svg", type: "circle" },
  { scale: 5, I: "/shapes/basic/star.svg", type: "path", path: c_paths.star },
  {
    scale: 5,
    I: "/shapes/basic/octagon.svg",
    type: "polygon",
    points: polyPoints.octagon,
  },
  {
    scale: 5,
    I: "/shapes/basic/trapezoid.svg",
    type: "path",
    path: c_paths.trapezoid,
  },
];

const lines: { scale: number; type: canvasShapes; path?: string; I: string }[] =
  [
    {
      scale: 5,
      type: "path",
      I: "/shapes/lines/right-arrow.svg",
      path: c_paths.arrow_right,
    },
    {
      scale: 5,
      type: "path",
      I: "/shapes/lines/arrow-right(plane).svg",
      path: c_paths.arrow_plane,
    },
    {
      scale: 1,
      type: "path",
      I: "/shapes/lines/arrow-circle.svg",
      path: c_paths.arrow_circle,
    },
    {
      scale: 5,
      type: "path",
      I: "/shapes/lines/simple-line.svg",
      path: c_paths.simple_line,
    },
  ];

const filtersOptions: { label: string; filter: any }[] = [
  { label: "grayscale", filter: filters.Grayscale },
  { label: "invert", filter: filters.Invert },
  { label: "remove-color", filter: filters.RemoveColor },
  { label: "sepia", filter: filters.Sepia },
  { label: "brownie", filter: filters.Brownie },
  { label: "brightness", filter: filters.Brightness },
  { label: "contrast", filter: filters.Contrast },
  { label: "saturation", filter: filters.Saturation },
  { label: "vibrance", filter: filters.Vibrance },
  { label: "noise", filter: filters.Noise },
  { label: "vintage", filter: filters.Vintage },
  { label: "pixelate", filter: filters.Pixelate },
  { label: "blur", filter: filters.Blur },
  { label: "sharpen", filter: filters.Convolute },
  // { label: "emboss", filter: filters. },
  { label: "technicolor", filter: filters.Technicolor },
  { label: "polaroid", filter: filters.Polaroid },
  { label: "blend-color", filter: filters.BlendColor },
  { label: "gamma", filter: filters.Gamma },
  { label: "kodachrome", filter: filters.Kodachrome },
  { label: "blackwhite", filter: filters.BlackWhite },
  // { label: "blend-image", filter: filters.BlendImage },
  { label: "hue", filter: filters.HueRotation },
  { label: "resize", filter: filters.Resize },
];

const others_shapes: {
  scale: number;
  type: canvasShapes;
  path?: string;
  I: string;
}[] = [
  {
    scale: 5,
    type: "path",
    I: "/shapes/others/edit-shape.svg",
    path: `M21,16.1707057 C22.1651924,16.5825421 23,17.6937812 23,19 C23,20.6568542 21.6568542,22 20,22 C18.6937812,22 17.5825421,21.1651924 17.1707057,20 L6.82929429,20 C6.41745788,21.1651924 5.30621883,22 4,22 C2.34314575,22 1,20.6568542 1,19 C1,17.6937812 1.83480763,16.5825421 3,16.1707057 L3,7.82929429 C1.83480763,7.41745788 1,6.30621883 1,5 C1,3.34314575 2.34314575,2 4,2 C5.30621883,2 6.41745788,2.83480763 6.82929429,4 L17.1707057,4 C17.5825421,2.83480763 18.6937812,2 20,2 C21.6568542,2 23,3.34314575 23,5 C23,6.30621883 22.1651924,7.41745788 21,7.82929429 L21,16.1707057 Z M19,16.1707057 L19,7.82929429 C18.1475866,7.52800937 17.4719906,6.85241345 17.1707057,6 L6.82929429,6 C6.52800937,6.85241345 5.85241345,7.52800937 5,7.82929429 L5,16.1707057 C5.85241345,16.4719906 6.52800937,17.1475866 6.82929429,18 L17.1707057,18 C17.4719906,17.1475866 18.1475866,16.4719906 19,16.1707057 Z M4,6 C4.55228475,6 5,5.55228475 5,5 C5,4.44771525 4.55228475,4 4,4 C3.44771525,4 3,4.44771525 3,5 C3,5.55228475 3.44771525,6 4,6 Z M20,6 C20.5522847,6 21,5.55228475 21,5 C21,4.44771525 20.5522847,4 20,4 C19.4477153,4 19,4.44771525 19,5 C19,5.55228475 19.4477153,6 20,6 Z M4,20 C4.55228475,20 5,19.5522847 5,19 C5,18.4477153 4.55228475,18 4,18 C3.44771525,18 3,18.4477153 3,19 C3,19.5522847 3.44771525,20 4,20 Z M20,20 C20.5522847,20 21,19.5522847 21,19 C21,18.4477153 20.5522847,18 20,18 C19.4477153,18 19,18.4477153 19,19 C19,19.5522847 19.4477153,20 20,20 Z`,
  },
  {
    scale: 5,
    type: "path",
    I: "/shapes/others/heart-pulse.svg",
    path: `M21 11.9998H18.6361C17.9781 11.9998 17.6491 11.9998 17.3578 12.1296C17.0665 12.2593 16.8463 12.504 16.4059 12.9932L15.3767 14.1369C15.0154 14.5382 14.8348 14.7389 14.6057 14.734C14.3766 14.7291 14.2049 14.521 13.8616 14.1048L10.3334 9.82819C10.0133 9.44017 9.85321 9.24615 9.63599 9.23311C9.41877 9.22006 9.23663 9.39352 8.87237 9.74044L7.36897 11.1723C6.93986 11.5809 6.7253 11.7853 6.45709 11.8926C6.18887 11.9998 5.89258 11.9998 5.3 11.9998H3" stroke="#1C274C" stroke-width="0.672" stroke-linecap="round"></path> <path d="M8.96173 18.9108L9.42605 18.3219L8.96173 18.9108ZM12 5.5006L11.4596 6.0207C11.601 6.1676 11.7961 6.2506 12 6.2506C12.2039 6.2506 12.399 6.1676 12.5404 6.0207L12 5.5006ZM15.0383 18.9109L15.5026 19.4999V19.4999L15.0383 18.9109ZM12 20.4859L12 19.7359L12 20.4859ZM2.65666 13.3964C2.87558 13.748 3.33811 13.8556 3.68974 13.6367C4.04137 13.4178 4.14895 12.9552 3.93003 12.6036L2.65666 13.3964ZM6.52969 15.7718C6.23645 15.4793 5.76158 15.4798 5.46903 15.7731C5.17649 16.0663 5.17706 16.5412 5.47031 16.8337L6.52969 15.7718ZM2.75 9.13707C2.75 6.33419 4.00722 4.59507 5.57921 3.99711C7.15546 3.39753 9.35129 3.8302 11.4596 6.0207L12.5404 4.9805C10.1489 2.49583 7.3447 1.72069 5.04591 2.59512C2.74286 3.47116 1.25 5.88785 1.25 9.13707H2.75ZM15.5026 19.4999C16.9949 18.3234 18.7837 16.7461 20.2061 14.9838C21.6126 13.2412 22.75 11.2089 22.75 9.13703H21.25C21.25 10.688 20.3777 12.3829 19.0389 14.0417C17.716 15.6807 16.0239 17.1788 14.574 18.3219L15.5026 19.4999ZM22.75 9.13703C22.75 5.88784 21.2571 3.47115 18.9541 2.59511C16.6553 1.7207 13.8511 2.49583 11.4596 4.9805L12.5404 6.0207C14.6487 3.8302 16.8445 3.39753 18.4208 3.99711C19.9928 4.59506 21.25 6.33418 21.25 9.13703H22.75ZM8.49742 19.4998C9.77172 20.5044 10.6501 21.2359 12 21.2359L12 19.7359C11.2693 19.7359 10.8157 19.4174 9.42605 18.3219L8.49742 19.4998ZM14.574 18.3219C13.1843 19.4174 12.7307 19.7359 12 19.7359L12 21.2359C13.3499 21.2359 14.2283 20.5044 15.5026 19.4999L14.574 18.3219ZM3.93003 12.6036C3.18403 11.4054 2.75 10.2312 2.75 9.13707H1.25C1.25 10.617 1.83054 12.0695 2.65666 13.3964L3.93003 12.6036ZM9.42605 18.3219C8.50908 17.599 7.49093 16.7307 6.52969 15.7718L5.47031 16.8337C6.48347 17.8445 7.54819 18.7515 8.49742 19.4998L9.42605 18.3219Z`,
  },
];

const saveOptions: { label: string; t: "json" | "image" }[] = [
  { label: "Save as JSON", t: "json" },
  { label: "Save as Image", t: "image" },
  // {label : "Save as "}
];

const zooms = [25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 300];

export {
  others_shapes,
  zooms,
  canvasConfig,
  saveOptions,
  filtersOptions,
  gradients,
  extra_fonts,
  shapes,
  lines,
  c_paths,
  brushes,
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
