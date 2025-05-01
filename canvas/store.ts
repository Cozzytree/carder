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
   width: 600,
   height: 600,
   activeObject: undefined,
   isDrawing: false,
   containerScale: 1,
   hasPointerEvents: true,
   snapping: true,

   setSnap: (v) => set({ snapping: v }),
   setPointerEvents: (v) => set({ hasPointerEvents: v }),
   setWidth: (v) => set({ width: v }),
   setHeight: (v) => set({ height: v }),
   setDrawingMode: (v) => set({ isDrawing: v }),
   setFabricObject: (v) => set({ activeObject: v }),
   setContainerScale: (v) =>
      set((state) => {
         if (state.containerScale <= 0.2 || state.containerScale >= 5) return state;
         state.containerScale = v;
         return state;
      }),
}));

type queueShape = {
   shapeId: string;
   props: string;
   page_id: string;
};
interface queueStoreState {
   shape: queueShape[][];

   //action
   addNewShape: (v: queueShape[]) => void;
   popShape: () => queueShape[] | undefined;
}
const queueStore = create<queueStoreState>((set, get) => ({
   shape: [],

   addNewShape: (v) =>
      set((state) => {
         state.shape.push(v);
         return { shape: [...state.shape] };
      }),
   popShape: () => {
      const state = get();

      if (!state.shape.length) return undefined;
      if (state.shape.length == 1) {
         set({ shape: [] });
         return state.shape[0];
      }

      const i = 2;
      const e = state.shape.length - 1;

      const newS = [];
      for (let j = i; j <= e; j++) {
         newS.push(state.shape[j]);
      }

      set({ shape: newS });

      return state.shape[i];
   },
}));

export { queueStore, useCanvasStore, useColorStore, useWhichOptionsOpen };
