import { RefObject, useEffect, useState } from "react";
import CanvasC from "../canvas";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FabricObject } from "fabric";
import { useCanvasStore } from "../store";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { EyeClosed, EyeIcon } from "lucide-react";

type props = {
   canvasC: RefObject<CanvasC | null>;
};

export default function LeftContainer({ canvasC }: props) {
   const activeObject = useCanvasStore((state) => state.activeObject);
   const [objs, setObjs] = useState<FabricObject[] | []>(() => {
      return canvasC?.current?.canvas?.getObjects() || [];
   });

   const handleActive = (o: FabricObject) => {
      if (!canvasC.current) return;
      canvasC.current.canvas.discardActiveObject();
      canvasC.current.canvas.setActiveObject(o);
      canvasC.current.canvas.requestRenderAll();
   };

   const handleVisible = () => {
      if (!canvasC.current || !activeObject) return;
      const isV = activeObject.get("visible");
      canvasC.current.changeCanvasProperties(activeObject, {
         visible: isV ? false : true,
      });
      if (isV) {
         canvasC.current.canvas.discardActiveObject();
      } else {
         canvasC.current.canvas.discardActiveObject();
         canvasC.current.canvas.setActiveObject(activeObject);
      }
   };

   useEffect(() => {
      setObjs(() => {
         return canvasC?.current?.canvas?.getObjects() || [];
      });
   }, [activeObject]);

   return (
      <div className="w-[350px] h-full border-r-2 border-r-muted py-4">
         <Collapsible>
            <CollapsibleTrigger className="pl-3 text-lg w-full">Layers</CollapsibleTrigger>

            <Separator className="bg-muted my-1 mb-3" />

            <CollapsibleContent className="pl-3 w-full">
               {objs.map((o, i) => (
                  <div
                     key={i}
                     className={cn(
                        activeObject?.get("id") === o.get("id") && "bg-muted",
                        "w-full rounded-l-md py-1 text-xs flex items-center justify-between px-4",
                     )}
                  >
                     <button
                        onClick={() => {
                           handleActive(o);
                        }}
                        className="w-full text-start"
                     >
                        {o?.get("type")}
                     </button>
                     <button onClick={handleVisible}>
                        {o.get("visible") ? <EyeIcon width={20} height={20} /> : <EyeClosed />}
                     </button>
                  </div>
               ))}
            </CollapsibleContent>
         </Collapsible>
      </div>
   );
}
