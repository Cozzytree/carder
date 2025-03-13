"use client";

import { FabricObject } from "fabric";
import { create } from "zustand";
import { whichOption } from "./types";

interface canvasPages {
  pages: string[];
  setCreatePage: () => void;
  deletePage: () => void;
}

interface canvasInterface {
  width: number;
  height: number;
  activeObject: FabricObject | undefined;
  isDrawing: boolean;
  containerScale: number;
  hasPointerEvents: boolean;
  snapping: boolean;

  setSnap: (v: boolean) => void;
  setPointerEvents: (v: boolean) => void;
  setContainerScale: (v: number) => void;
  setHeight: (v: number) => void;
  setWidth: (v: number) => void;
  setDrawingMode: (v: boolean) => void;
  setFabricObject: (v: FabricObject | undefined) => void;
}

interface colorStoreInterface {
  alpha: number;
  recentColors: string[];
  recentGradients: string[][];

  setRecentGradient: (v: string[]) => void;
  setRecentColors: (v: string) => void;
  setAlpha: (v: number) => void;
}

interface whichOptionOpenI {
  which: whichOption | null;
  setWhichOption: (v: whichOption | null) => void;
}

const useWhichOptionsOpen = create<whichOptionOpenI>((set) => ({
  which: null,
  setWhichOption: (v) => set({ which: v }),
}));

const useColorStore = create<colorStoreInterface>((set) => ({
  alpha: 1,
  recentColors: [],
  recentGradients: [],

  setRecentGradient: (v) =>
    set((state) => {
      if (state.recentGradients.length >= 5) {
        state.recentGradients.pop();
      }
      state.recentGradients.unshift(v);
      return state;
    }),
  setAlpha: (v) => set({ alpha: v }),
  setRecentColors: (v) => {
    set((state) => {
      if (state.recentColors.length >= 5) {
        state.recentColors.pop();
      }
      state.recentColors.unshift(v);
      return state;
    });
  },
}));

const useCanvasStore = create<canvasInterface>((set) => ({
  width: localStorage.getItem("canvas_width")
    ? (JSON.parse(localStorage.getItem("canvas_width") || "") as number)
    : 600,
  height: 600,
  activeObject: undefined,
  isDrawing: false,
  containerScale: 1,
  hasPointerEvents: true,
  snapping: true,

  setSnap: (v) => set({ snapping: v }),
  setPointerEvents: (v) => set({ hasPointerEvents: v }),
  setWidth: (v) =>
    set((state) => {
      localStorage.setItem("canvas_width", JSON.stringify(v));
      state.width = v;
      return state;
    }),
  setHeight: (v) => set({ height: v }),
  setDrawingMode: (v) => set({ isDrawing: v }),
  setFabricObject: (v) => set({ activeObject: v }),
  setContainerScale: (v) =>
    set((state) => {
      if (state.containerScale <= 0.2 || state.containerScale >= 5)
        return state;
      state.containerScale = v;
      return state;
    }),
}));

export { useCanvasStore, useColorStore, useWhichOptionsOpen };
