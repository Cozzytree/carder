const basicColors = ["#101010", "#ef4040", "#20ff50", "#2050ef", "#9a9a10"];

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

export { basicColors, radius, colors, strokeStyles, widths };
