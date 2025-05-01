import { RefObject, useEffect, useState } from "react";
import CanvasC from "../canvas";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FabricObject } from "fabric";
import { useCanvasStore } from "../store";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { EyeClosed, EyeIcon, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useEditorContext } from "./editor-wrapper";

type props = {
   canvasC: RefObject<CanvasC | null>;
};

export default function LeftContainer({ canvasC }: props) {
   const { showUploads, handleSideToggle, sidesOpen } = useEditorContext();
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

   const handleVisible = (o: FabricObject) => {
      if (!canvasC.current) return;
      const isV = o.get("visible");
      canvasC.current.changeCanvasProperties(o, {
         visible: isV ? false : true,
      });
      if (isV) {
         canvasC.current.canvas.discardActiveObject();
      } else {
         canvasC.current.canvas.discardActiveObject();
         canvasC.current.canvas.setActiveObject(o);
      }
   };

   useEffect(() => {
      setObjs(() => {
         return canvasC?.current?.canvas?.getObjects() || [];
      });
   }, [activeObject]);

   return (
      <>
         {!sidesOpen ? (
            <div className="fixed z-50 top-4 left-5 p-2 rounded-sm bg-muted border border-muted-foreground/40 shadow-md">
               <PanelRightOpen onClick={() => handleSideToggle(true)} />
            </div>
         ) : (
            <div className="w-[350px] h-full border-r-2 border-r-muted bg-muted py-4">
               <div className="w-full flex justify-between px-3">
                  <span>something</span> <PanelRightClose onClick={() => handleSideToggle(false)} />
               </div>

               <Collapsible>
                  <CollapsibleTrigger className="pl-3 text-sm text-start w-full">
                     Layers
                  </CollapsibleTrigger>

                  <Separator className="bg-muted-foreground/50 my-1" />

                  <CollapsibleContent className="pl-3 w-full">
                     {objs.map((o, i) => (
                        <div
                           key={i}
                           className={cn(
                              activeObject?.get("id") === o.get("id") && "bg-muted-foreground/5",
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
                           <button onClick={() => handleVisible(o)}>
                              {o.get("visible") ? (
                                 <EyeIcon width={20} height={20} />
                              ) : (
                                 <EyeClosed />
                              )}
                           </button>
                        </div>
                     ))}
                  </CollapsibleContent>
               </Collapsible>

               {showUploads && (
                  <Collapsible>
                     <CollapsibleTrigger className="pl-3 text-sm text-start w-full">
                        Uploads
                     </CollapsibleTrigger>
                     <CollapsibleContent className="pl-3 w-full">Images</CollapsibleContent>
                  </Collapsible>
               )}
            </div>
         )}
      </>
   );
}
