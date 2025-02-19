import { FabricObject } from "fabric";
import { create } from "zustand";

interface canvasInterface {
   width: number;
   height: number;
   activeObject: FabricObject | undefined;
   isDrawing: boolean;
   containerScale: number;

   setContainerScale: (v: number) => void;
   setHeight: (v: number) => void;
   setWidth: (v: number) => void;
   setDrawingMode: (v: boolean) => void;
   setFabricObject: (v: FabricObject | undefined) => void;
}

interface colorStoreInterface {
   alpha: number;
   recentColors: string[];

   setRecentColors: (v: string) => void;
   setAlpha: (v: number) => void;
}

const useColorStore = create<colorStoreInterface>((set) => ({
   alpha: 1,
   recentColors: [],

   setAlpha: (v) => set({ alpha: v }),
   setRecentColors: (v) => {
      set((state) => {
         if (state.recentColors.length > 5) {
            state.recentColors.pop();
         }
         state.recentColors.push(v);
         return state;
      });
   },
}));

const useCanvasStore = create<canvasInterface>((set) => ({
   width: 700,
   height: 400,
   activeObject: undefined,
   isDrawing: false,
   containerScale: 1,

   setWidth: (v) => set({ width: v }),
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

export { useCanvasStore, useColorStore };
