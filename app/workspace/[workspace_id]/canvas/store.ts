import { FabricObject } from "fabric";
import { create } from "zustand";

interface canvasInterface {
   activeObject: FabricObject | undefined;

   setFabricObject: (v: FabricObject | undefined) => void;
}

const useCanvasStore = create<canvasInterface>((set) => ({
   activeObject: undefined,

   setFabricObject: (v) => set({ activeObject: v }),
}));

export { useCanvasStore };
