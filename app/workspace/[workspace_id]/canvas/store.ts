import { FabricObject } from "fabric";
import { create } from "zustand";

interface canvasInterface {
   activeObject: FabricObject | undefined;

   setFabricObject: (v: FabricObject | undefined) => void;
}

interface otherInterface {
   containerScale: number;

   setContainerScale: (v: number) => void;
}

interface colorStoreInterface {
   alpha: number;
   recentColors: string[];

   setRecentColors: (v: string) => void;
   setAlpha: (v: number) => void;
}

const useColorStore = create<colorStoreInterface>((set, get) => ({
   alpha: 1,
   recentColors: localStorage.getItem("recent-colors")
      ? // @ts-expect-error //type error
        JSON.parse(localStorage.getItem("recent-colors"))
      : [],

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
   activeObject: undefined,

   setFabricObject: (v) => set({ activeObject: v }),
}));

const useOtherStore = create<otherInterface>((set) => ({
   containerScale: 1,

   setContainerScale: (v) =>
      set((state) => {
         if (state.containerScale <= 0.2 || state.containerScale >= 5)
            return state;
         state.containerScale = v;
         return state;
      }),
}));

export { useCanvasStore, useColorStore, useOtherStore };
